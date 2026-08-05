"""Tests for the retry utility."""
import pytest
from unittest.mock import MagicMock, patch
from tools._retry import with_retry, retry_call


def test_succeeds_on_first_attempt():
    mock_fn = MagicMock(return_value="ok")
    decorated = with_retry(max_attempts=3)(mock_fn)
    result = decorated()
    assert result == "ok"
    assert mock_fn.call_count == 1


def test_retries_on_transient_failure():
    call_count = 0

    @with_retry(max_attempts=3, base_delay=0)
    def flaky():
        nonlocal call_count
        call_count += 1
        if call_count < 3:
            raise ValueError("transient")
        return "success"

    result = flaky()
    assert result == "success"
    assert call_count == 3


def test_raises_after_max_attempts():
    def always_fails():
        raise RuntimeError("always fails")
    decorated = with_retry(max_attempts=3, base_delay=0)(always_fails)
    with pytest.raises(RuntimeError, match="always fails"):
        decorated()


def test_does_not_retry_non_retryable_exception():
    mock_fn = MagicMock(side_effect=KeyError("not retryable"))
    # Only retry ValueError, not KeyError
    decorated = with_retry(max_attempts=3, base_delay=0, retryable_exceptions=(ValueError,))(mock_fn)
    with pytest.raises(KeyError):
        decorated()
    # Should have failed immediately without retrying
    assert mock_fn.call_count == 1


def test_retry_call_inline():
    call_count = 0

    def flaky():
        nonlocal call_count
        call_count += 1
        if call_count < 2:
            raise Exception("once")
        return "done"

    result = retry_call(flaky, max_attempts=3, base_delay=0)
    assert result == "done"
    assert call_count == 2


def test_no_sleep_when_base_delay_is_zero():
    """Ensure tests don't wait by using base_delay=0."""
    import time
    start = time.monotonic()

    @with_retry(max_attempts=3, base_delay=0)
    def fail_twice():
        fail_twice._count = getattr(fail_twice, "_count", 0) + 1
        if fail_twice._count < 3:
            raise ValueError("fail")
        return "ok"

    result = fail_twice()
    elapsed = time.monotonic() - start
    assert result == "ok"
    assert elapsed < 1.0  # Should be nearly instant
