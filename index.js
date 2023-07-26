
const puppeteer = require ('puppeteer-core');

console.log("Hello world! + 100")

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

const pars = async () => {
    const browser = await puppeteer.launch ({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless:false
    });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/');
    // await page.waitForNavigation();
    console.log('Load complete ');
    setTimeout(async () => {
        console.log('In time out')
        await page.type('input[id=username]','dmitryprigozhin@gmail.com');
        await page.type('input[id="password"]', 'JIG*naip5kaib3leap');
        await page.click('button[type="submit"]');

        await page.goto(companyList[0]);
        // await page.waitForNavigation();
        let res = await page.evaluate(lookForCompanySize);
        console.log('On local [0] =>', res);

        setTimeout(async ()=>{
            await page.goto(companyList[1]);
            // await page.waitForNavigation();
            console.log('Load complete ');
            res = await page.evaluate(lookForCompanySize);
            console.log('On local [1] =>', res);
            }, 10000);

    }, 10000)

}


pars();