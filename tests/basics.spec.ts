import {test, expect} from '@playwright/test';

let username : string = "Admin";
let pwd : string = "admin123";

let webUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

test ('TC001 , it will test the text', async ({page}) => {

    await page.goto(webUrl);
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password").fill("pwd");

    await page.locator("//button[@type ='submit']").click();

    const errormsg =await page.locator("//p[contains(@class,'alert-content-text')]").textContent();
    expect (errormsg?.includes("error")).toBeTruthy();

});

test.skip ('TC002, it will test the screenshot functionality ', async ({page}) =>{

    await page.screenshot({path: 'screenshot.png', fullPage:true});

});

test ('TC003 ,this will check mouse hover function', async ({page})=>{



});


