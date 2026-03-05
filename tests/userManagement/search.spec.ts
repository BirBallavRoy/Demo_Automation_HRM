
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { UserManagementPage } from '../../pages/userManagement';
import { faker } from '@faker-js/faker';
import loginData from '../../test-data/login/loginData.json';



test('Search user using multiple valid filters', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userManagementPage = new UserManagementPage(page);


  const username: string = loginData.validUser.username;
  const password: string = loginData.validUser.password;


  await loginPage.login(username, password);

  console.log('logged Into the portal')


  await userManagementPage.navigateToUserManagement();

  console.log("Now at user management page")

  const username_search = loginData.validUser.username;
  const role = loginData.validUser.role;
  const status = loginData.validUser.status;

  console.log("searching using valid inputs")

  await userManagementPage.enterUsername(username_search);
  await userManagementPage.selectUserRole(role);
  await userManagementPage.selectStatus(status);
  await userManagementPage.clickSearch();

  console.log("valid search complete")


  const matchResult = await userManagementPage.verifyOnUserManagementPage({ username: username, role: role, status: status });
  expect(matchResult).toBe(true);

  await userManagementPage.resetFilters();
  console.log("reseting the filters")

  await userManagementPage.verifyEmptyList();
  console.log("verifying empty list")

  const invalid_username = loginData.invalidUser.username;
  const invalid_role = loginData.invalidUser.role;
  const disabled_status = loginData.invalidUser.status;

  console.log("searching using invalid credentials")

  await userManagementPage.enterUsername(invalid_username);
  await userManagementPage.selectStatus(disabled_status);
  await userManagementPage.clickSearch();

  console.log("invalid search complete")

  const matchResult_invalid = await userManagementPage.verifyOnUserManagementPage({ username: invalid_username, role: invalid_role, status: disabled_status });
  expect(matchResult_invalid).toBe(false);

  await userManagementPage.resetFilters();

  await userManagementPage.clickSearch();

  const allSmallusername = loginData.validUser.username.toLowerCase();


  await userManagementPage.enterUsername(allSmallusername);
  await userManagementPage.clickSearch();
  console.log("verifying case sensitive search")

  await userManagementPage.selectStatus(loginData.invalidUser.status);
  await userManagementPage.clickSearch();
  console.log("invalid status search complete");


});

