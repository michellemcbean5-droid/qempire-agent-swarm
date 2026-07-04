"""Browser tool using Playwright for autonomous web interaction."""
from playwright.sync_api import sync_playwright


def browser_navigate(url: str) -> str:
    """Navigate to a URL and return the page text content."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto(url, timeout=30000)
            page.wait_for_load_state("domcontentloaded", timeout=15000)
            title = page.title()
            content = page.evaluate("document.body.innerText")
            return f"Title: {title}\n\nContent:\n{content[:5000]}"
        except Exception as e:
            return f"ERROR navigating to {url}: {str(e)}"
        finally:
            browser.close()


def browser_search(query: str) -> str:
    """Search the web using DuckDuckGo and return top results."""
    try:
        from duckduckgo_search import DDGS
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=5):
                results.append(f"• {r['title']}\n  {r['body']}\n  URL: {r['href']}")
        if results:
            return f"Search results for '{query}':\n\n" + "\n\n".join(results)
        else:
            return f"No results found for '{query}'"
    except Exception as e:
        return f"ERROR searching for '{query}': {str(e)}"
