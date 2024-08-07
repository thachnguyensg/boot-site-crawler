import url from 'node:url';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch'

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = {}) {
  try {

    const normUrl= normalizingUrl(currentUrl);
    if (pages[normUrl]) {
      pages[normUrl] += 1;
      return pages;
    }

    console.log(`crawling ${currentUrl}`);
    pages[normUrl] = 1;

    const urls = await fetch_get_urls(baseUrl, currentUrl);

    for (const url of urls) {
      await crawlPage(baseUrl, url, pages);
    }

    return pages;
  } catch (e) {
    console.log(e);
  }
}

async function fetch_get_urls(baseUrl, currentUrl) {
  const response = await fetch(currentUrl);
  if (response.status > 400) {
    throw new Error("fetching failed, status: ", response.status);
  }
  if (!response.headers.get('content-type').includes("text/html")) {
    throw new Error("This is not a website, content type: ", response.headers.get('content-type'));
  }

  const content = await response.text();
  return getURLsFromHTML(content, baseUrl);
}

function normalizingUrl(urlString) {
  const urlparts = url.parse(urlString);
  let pathname = urlparts.pathname || "";
  let host = urlparts.host || "";

  // Remove trailing slash if it exists
  if (pathname.endsWith('/') && pathname.length > 1) {
    pathname = pathname.slice(0, -1);
  }



  return host + pathname;
}

function getURLsFromHTML(htmlBody, baseUrl) {
  try {
    let urls = []
    const dom = new JSDOM(htmlBody);
    const anchors = dom.window.document.querySelectorAll("a");
    if (anchors) {
      for (const a of anchors) {
        if (!a.hasAttribute("href"))
          continue;

        const urlparts = url.parse(a.href);
        const base = url.parse(baseUrl);

        if (urlparts.host && urlparts.host != base.host) {
          continue;
        }

        const u = new URL(a.href, baseUrl);
        urls.push(u.href);
      }
    }
    return urls;
  } catch (e) {
    console.log(e)
  }

}

export { normalizingUrl, getURLsFromHTML, crawlPage };

