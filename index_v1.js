const puppeteer = require ('puppeteer-core');
const XLSX = require ('xlsx')
require('dotenv').config();

console.log("Hello world! + 100")

const login = process.env.LOGIN;
const password = process.env.PASSWORD;

console.log('Loginpassword', login, password)
const companyList = [
    'https://www.linkedin.com/company/landa-digital-printing/about/',
    'https://www.linkedin.com/company/massivit3d/about/',
]

const lookForCompanySize =  () => {
    console.log('Start parse')
    let i = 0;
    const dome = document.querySelector('body');
    let resEmpl = 0;
    // console.log(dome.childNodes);
    function searchFunction (element) {
        // console.log("Recursy Level", i )
        i++;
        element.childNodes.forEach ((node) => {
            if (node.childNodes.length === 0 && node.textContent.indexOf('on LinkedIn') !== -1) {
                // if (node.textContent.indexOf('on LinkedIn') !== -1) {
                console.log('Search node =>', node)
                console.log('Search result =>', node.textContent)
                resEmpl = node.textContent.split(' ')[0];
                return node.textContent
           } else {
                const res = searchFunction(node);
                if (res) {
                    console.log('------------ =>', res);
                }
               return  res
           }
        })
    }

   const res = searchFunction(dome);
    console.log('********** res =>', res);
    console.log('********** resEmpl =>', resEmpl);
    return resEmpl;
}

const pars = async (json) => {
    const browser = await puppeteer.launch ({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless:false
    });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/');
    await page.waitForNavigation();
    console.log('Load complete ');
    console.log('In time out')
    await page.waitForTimeout(5000)
    await page.type('input[id=username]',login);
    await page.type('input[id="password"]', password);
    await page.click('button[type="submit"]');

    for ( let company of json ) {
        await page.waitForTimeout(30000)
        await page.goto(company.LinkdIn + 'about/');
        // await page.waitForNavigation();
        let res = await page.evaluate(lookForCompanySize);
        console.log(`${company.Company}, ${res}`);
    }


}

const dataFromEXEL = () =>{
    const workbook = XLSX.readFile('info.xlsx');
    const sheet_name_list = workbook.SheetNames;
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
    return (json);
}


const json = dataFromEXEL();

pars(json);