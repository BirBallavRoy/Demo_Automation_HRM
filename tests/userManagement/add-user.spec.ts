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

  const username_login : string = loginData.validUser.username;
  const password_login : string = loginData.validUser.password;

  await loginPage.login(username_login, password_login);

  await userManagement.navigateToUserManagement();

  const username = 'test_' + faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  //  const username = 'iamUser'
  const role = loginData.validUser.role;
  const status = loginData.validUser.status;
  const password = loginData.validUser.password;
  const emp_name = loginData.validUser.emp_name;

  // ----------------------------
  // Positive: Add user
  // ----------------------------

  await addUserPage.addUser(username, role, status, emp_name, password);

  await userManagement.navigateToUserManagement();

  const found = await userManagement.verifyOnUserManagementPage({
    username,
    role,
    status
  });

  expect(found).toBe(true);

  // ----------------------------
  // Negative: Mandatory field
  // ----------------------------

  await addUserPage.addUser('', role, status, emp_name, password);

  const requiredError = page.locator('span.oxd-input-field-error-message', { hasText: 'Required' });

  await expect(requiredError).toBeVisible();

  // ----------------------------
  // Positive: Disabled user
  // ----------------------------

  const username2 = 'test_' + faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  const disable_status = loginData.invalidUser.status;

  await addUserPage.addUser(username2, role, disable_status, emp_name, password);

  const foundDisabled = await userManagement.verifyOnUserManagementPage({
    username: username2,
    role,
    status: disable_status
  });

  expect(foundDisabled).toBe(true);

  // ----------------------------
  // Cancel button
  // ----------------------------

  await addUserPage.cancelAddUser();

  await expect(page).toHaveURL(/viewSystemUsers/);

});