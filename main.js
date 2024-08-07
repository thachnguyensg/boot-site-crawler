import { argv, exitCode } from "node:process";
import { crawlPage } from "./crawler.js";
import { printReport } from "./report.js";

async function main() {
  try {

    if (argv.length < 3) {
      console.log("Please provide url for crawling");
      process.exitCode = 1;
      return;
    }
    if (argv.length > 3) {
      console.log("Too many arguments");
      process.exitCode = 1;
      return;
    }
    const base_url = argv[2];
    console.log(`start crawling ${base_url}`);

    const result = await crawlPage(base_url);
    console.log("finish crawling");
    console.log("Result \n");
    printReport(result);
  } catch (e) {
    console.log(e);
  }
}

main();
