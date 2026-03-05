import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { UserManagementPage } from '../../pages/userManagement';
import { AddUserPage } from '../../pages/AddUserPage';
import loginData from '../../test-data/login/loginData.json';
import { faker } from '@faker-js/faker';



let loginPage: LoginPage;
let addUserPage: AddUserPage;
let userManagement: UserManagementPage;

test('Add User Full Flow: Positive & Negative Scenarios', async ({ page }) => {
    loginPage = new LoginPage(page);
    userManagement = new UserManagementPage(page);
    addUserPage = new AddUserPage(page);


    const username_login: string = loginData.validUser.username;
    const password_login: string = loginData.validUser.password;


    await loginPage.login(username_login, password_login);

    await userManagement.navigateToUserManagement();

    console.log("Now at user management page")

    const username = 'test_' + faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();;
    const role = loginData.validUser.role;
    const status = loginData.validUser.status;
    const password = loginData.validUser.password;

    await addUserPage.addUser(username, role, status, password);
    console.log("Entered valid data for a user")
    const found = await addUserPage.verifyUserInList(username);
    expect(found).toBe(true);
    console.log("User found on the list")

    // ----------------------------
    // Negative 1: Mandatory field validation (missing username)
    // ----------------------------

    await addUserPage.addUser('', role, status, password);
    
    console.log("checking if mandatory field");

    const requiredError = addUserPage.page.locator('span.oxd-input-field-error-message', { hasText: 'Required' });
    await requiredError.waitFor({ state: 'visible' });
    expect(await requiredError.innerText()).toContain('Required');

    /*
    // ----------------------------
    // Negative 2: Invalid username
    // ----------------------------
    await addUserPage.addUser('invalid user!', role, status, password); // invalid username
    const invalidError = await addUserPage.page.locator('text=Invalid').innerText();
    expect(invalidError).toContain('Invalid');
    */

    // ----------------------------
    // Positive 2: Add user with Status = Disabled
    // ----------------------------

    const disable_status = loginData.invalidUser.status;
    await addUserPage.addUser(username, role, disable_status, password);
    const foundDisabled = await addUserPage.verifyUserInList(username, disable_status);
    expect(foundDisabled).toBe(true);

    // ----------------------------
    // Positive 3: Verify Cancel button
    // ----------------------------
    await addUserPage.cancelAddUser();
    expect(await addUserPage.usernameInput.isVisible()).toBeFalsy();

    
});