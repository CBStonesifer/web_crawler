const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')

async function main(){
    const args = process.argv
    if(args.length != 3){
        throw new Error("Improper arguments")
    }
    const baseUrl = args[2]
    console.log("Beginning crawl on:", baseUrl)
    const pages = await crawlPage(baseUrl, baseUrl, {})
    printReport(pages)
}
main()

