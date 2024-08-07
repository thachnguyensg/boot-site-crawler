import { test, expect } from "@jest/globals";
import { sortPages } from "./report.js";

const datas = [{
  pages: {
    'https://wagslane.dev': 1,
    'https://wagslane.dev/': 70,
    'https://wagslane.dev/tags/': 40,
    'https://wagslane.dev/about/': 50,
    'https://wagslane.dev/index.xml': 20,
  },
  expected: {
    'https://wagslane.dev/': 70,
    'https://wagslane.dev/about/': 50,
    'https://wagslane.dev/tags/': 40,
    'https://wagslane.dev/index.xml': 20,
    'https://wagslane.dev': 1,
  }
}];

test.each(datas)("testing page sort", ({ pages, expected }) => {
  const sortedPages = sortPages(pages);
  expect(sortedPages).toEqual(expected);
})
