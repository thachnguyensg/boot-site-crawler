import { test, describe, expect } from "@jest/globals";
import { normalizingUrl, getURLsFromHTML } from "./crawler.js";


const urlTests = [{
  urls: [
    "https://BLOG.boot.dev/path/",
    "https://blog.boot.dev/path",
    "http://blog.boot.dev/path/",
    "http://blog.boot.dev/path",
  ],
  expected: "blog.boot.dev/path"
}];

test.each(urlTests)("normalizing urls", ({ urls, expected }) => {
  urls.forEach((url) => expect(normalizingUrl(url)).toBe(expected));

})


const getUrlTests = [
  {
    html: `
      
      <html>
          <body>
              <a href="/abc"><span>Go to Boot.dev</span></a>
              <a href="/abc?d=1"><span>Go to Boot.dev</span></a>
              <a href="/a/b/c"><span>Go to Boot.dev</span></a>
          </body>
      </html>    
    `,
    baseUrl: "http://boot.deb",
    expected: [
      "http://boot.deb/abc",
      "http://boot.deb/abc?d=1",
      "http://boot.deb/a/b/c"
    ]
  },
  {
    html: `
      
      <html>
          <body>
              <a href="http://boot.deb/abc"><span>Go to Boot.dev</span></a>
              <a href="/abc?d=1"><span>Go to Boot.dev</span></a>
              <a href="http://boot.deb"><span>Go to Boot.dev</span></a>
              <a href="http://boot.de"><span>Go to Boot.dev</span></a>
          </body>
      </html>    
    `,
    baseUrl: "http://boot.deb/",
    expected: [
      "http://boot.deb/abc",
      "http://boot.deb/abc?d=1",
      "http://boot.deb/"
    ]
  }
]

test.each(getUrlTests)("test urls from html", ({ html, baseUrl, expected }) => {
  const urls = getURLsFromHTML(html, baseUrl);
  expect(urls?.length).toBe(expected.length)

  for (let i = 0; i < urls.length; i++) {
    expect(urls[i]).toBe(expected[i]);
  }

})
