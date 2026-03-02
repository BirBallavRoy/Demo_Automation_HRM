import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import loginData from '../../test-data/login/loginData.json';
import { faker } from '@faker-js/faker';



test('Valid Login Function', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password,


    );

});

test('Login Function with invalid credentials', async ({ page }) => {

    const loginPage = new LoginPage(page);

    //await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
      await page.goto('/web/index.php/auth/login');

    const username: string = faker.internet.username();
    const password: string = faker.internet.password();
    
    await loginPage.login(username, password)
      


});

