import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import loginData from '../../test-data/login/loginData.json';
import { faker } from '@faker-js/faker';


let loginPage;


test('Valid Login Function', async ({ page }) => {

  //  test.setTimeout(60000);

    loginPage = new LoginPage(page);

    const username: string = loginData.validUser.username;
    const password: string = loginData.validUser.password;


    await loginPage.login(username, password);

});

/*test('Login Function with invalid credentials', async ({ page }) => {

    const loginPage = new LoginPage(page);


    const username: string = faker.internet.username();
    const password: string = faker.internet.password();

    await loginPage.login(username, password)



});
*/
