import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { UserManagementPage } from '../../pages/userManagement';
import { EditUserPage } from '../../pages/editUserPage';
import loginData from '../../test-data/login/loginData.json';
import { faker } from '@faker-js/faker';

let loginPage: LoginPage;
let editUserPage: EditUserPage;
let userManagement: UserManagementPage;



test('Verify Edit User with Valid Data (positive1)', async ({ page }) => {

    loginPage = new LoginPage(page);
    userManagement = new UserManagementPage(page);
    editUserPage = new EditUserPage(page);
    
    const username_login: string = loginData.validUser.username;
    const password_login: string = loginData.validUser.password;


    await loginPage.login(username_login, password_login);
    await userManagement.navigateToUserManagement();

    const username = 'test_' + faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();;
    const role = loginData.validUser.role;
    const status = loginData.validUser.status;
    const password = loginData.validUser.password;


    await editUserPage.editUser(username, role, status);
    await userManagement.verifyOnUserManagementPage({ username: username, role: role, status: status });


});

