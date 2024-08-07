function printReport(pages) {
  const sortedPages = sortPages(pages);
  for(const key of Object.keys(sortedPages)){
    const url = key;
    const count = sortedPages[key]
    console.log(`Found ${count} internal links to ${url}`)
  }

}

function sortPages(pages) {
  return Object.fromEntries(Object.entries(pages).sort((a, b) => b[1] - a[1]));
}

export { printReport, sortPages }
