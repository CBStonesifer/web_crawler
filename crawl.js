const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function normalizeURL(url){
    try{
        const urlObject = new URL(url)
        let baseUrl = `${urlObject.host}${urlObject.pathname}`
        if(baseUrl.length > 0 && baseUrl.slice(-1) === '/'){
            baseUrl = baseUrl.slice(0, -1)
        }
        return baseUrl
    }
    catch {
        throw new Error("Invalid URL")
    }
}
    
function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for (const aElement of aElements){
        if (aElement.href.slice(0,1) === '/'){
        try {
            urls.push(new URL(aElement.href, baseURL).href)
        } catch (err){
            console.log(`${err.message}: ${aElement.href}`)
        }
        } else {
        try {
            urls.push(new URL(aElement.href).href)
        } catch (err){
            console.log(`${err.message}: ${aElement.href}`)
        }
        }
    }
    return urls
    }

    async function crawlPage(baseURL, currentURL, pages){
        const currentUrlObj = new URL(currentURL)
        const baseUrlObj = new URL(baseURL)
        if (currentUrlObj.hostname !== baseUrlObj.hostname){
          return pages
        }
        
        const normalizedURL = normalizeURL(currentURL)
      
        if (pages[normalizedURL] > 0){
          pages[normalizedURL]++
          return pages
        }
      
        if (currentURL === baseURL){
          pages[normalizedURL] = 0
        } else {
          pages[normalizedURL] = 1
        }
      
        //console.log(`crawling ${currentURL}`)
        let htmlBody = ''
        try {
          const resp = await fetch(currentURL)
          if (resp.status > 399){
            console.log(`Got HTTP error, status code: ${resp.status}`)
            return pages
          }
          const contentType = resp.headers.get('content-type')
          if (!contentType.includes('text/html')){
            console.log(`Got non-html response: ${contentType}`)
            return pages
          }
          htmlBody = await resp.text()
        } catch (err){
          console.log(err.message)
        }
      
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)
        for (const nextURL of nextURLs){
          pages = await crawlPage(baseURL, nextURL, pages)
        }
      
        return pages
      }

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
    