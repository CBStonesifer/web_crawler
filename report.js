function sortURLs(pages){
    const pagesArr = Object.entries(pages)
    pagesArr.sort((pageA, pageB) => {
      return pageB[1] - pageA[1]
    })
    return pagesArr
  }
  function printReport(pages){
    console.log('___________ CRAWL REPORT ___________')
    const sortedPages = sortURLs(pages)
    for (const sortedPage of sortedPages){
      const url = sortedPage[0]
      const count = sortedPage[1]
      console.log(`Found ${count} internal links to ${url}`)
    }
  }

module.exports = {
    printReport,
}