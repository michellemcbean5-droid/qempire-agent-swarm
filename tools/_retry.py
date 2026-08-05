"""
Retry / backoff utilities for Q-Empire tool calls.

Provides an exponential-backoff decorator and a retry wrapper
for functions that call external APIs or services.
"""
import time
import random
import logging
from functools import wraps
from typing import Callable, TypeVar, Any

logger = logging.getLogger(__name__)

F = TypeVar("F", bound=Callable[..., Any])


def with_retry(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    backoff_factor: float = 2.0,
    jitter: bool = True,
    retryable_exceptions: tuple = (Exception,),
) -> Callable[[F], F]:
    """Decorator: retry a function with exponential backoff.

    Args:
        max_attempts: Maximum number of total attempts (including the first).
        base_delay: Initial delay between retries in seconds.
        max_delay: Maximum delay cap in seconds.
        backoff_factor: Multiply delay by this factor after each attempt.
        jitter: Add random ±20% jitter to avoid thundering-herd.
        retryable_exceptions: Only retry on these exception types.

    Usage::

        @with_retry(max_attempts=3, base_delay=2.0)
        def call_external_api():
            ...
    """
    def decorator(func: F) -> F:
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = base_delay
            last_exc = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except retryable_exceptions as exc:
                    last_exc = exc
                    if attempt == max_attempts:
                        logger.error(
                            "[RETRY] %s failed after %d attempts: %s",
                            func.__name__, max_attempts, exc,
                        )
                        raise
                    sleep_time = min(delay, max_delay)
                    if jitter:
                        sleep_time *= 1 + random.uniform(-0.2, 0.2)
                    logger.warning(
                        "[RETRY] %s attempt %d/%d failed (%s). Retrying in %.1fs…",
                        func.__name__, attempt, max_attempts, exc, sleep_time,
                    )
                    time.sleep(sleep_time)
                    delay *= backoff_factor
            raise last_exc  # unreachable but satisfies type checkers
        return wrapper  # type: ignore[return-value]
    return decorator


def retry_call(
    func: Callable,
    *args,
    max_attempts: int = 3,
    base_delay: float = 1.0,
    **kwargs,
) -> Any:
    """Inline retry call without using the decorator.

    Useful for one-off retries without modifying the target function.
    """
    decorated = with_retry(max_attempts=max_attempts, base_delay=base_delay)(func)
    return decorated(*args, **kwargs)
