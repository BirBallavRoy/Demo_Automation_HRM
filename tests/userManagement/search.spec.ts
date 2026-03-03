
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { UserManagementPage } from '../../pages/userManagement';
import { faker } from '@faker-js/faker';
import loginData from '../../test-data/login/loginData.json';


test.describe('User Management - Search Functionality', () => {

  let userManagement: UserManagementPage;
  let loginPage : LoginPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    userManagement = new UserManagementPage(page);

    await loginPage.navigate();
    await loginPage.login(
      process.env.ADMIN_USERNAME!,
      process.env.ADMIN_PASSWORD!
    );

    await userManagement.navigateToUserManagement();
  });

  // ✅ Positive1
  test('Search user using multiple valid filters', async () => {

    const username = loginData.validUser.username;
    const role = loginData.validUser.role;
    const status = loginData.validUser.status;

    await userManagement.enterUsername(username);
    await userManagement.selectUserRole(role);
    await userManagement.selectStatus(status);
    await userManagement.clickSearch();

    const matchResult = await userManagement.verifyOnUserManagementPage({ username: username, role: role, status: status });
    expect(matchResult).toBe(true);

    await userManagement.resetFilters();




    // Add result validation here
  });

  // ✅ Positive2
  test('Verify Reset button clears all applied filters', async () => {

    await userManagement.resetFilters();
    await userManagement.verifyEmptyList();
  });

  // ❌ Negative1
  test('Search user with invalid Username and boundary validation', async () => {
    const invalid_username = loginData.invalidUser.username;
    const invalid_role = loginData.invalidUser.role;
    const disabled_status = loginData.invalidUser.status;

    await userManagement.enterUsername(invalid_username);
    await userManagement.selectUserRole(invalid_role);
    await userManagement.selectStatus(disabled_status);
    await userManagement.clickSearch();

    const matchResult = await userManagement.verifyOnUserManagementPage({ username : invalid_username  , role: invalid_role, status: disabled_status });
    expect(matchResult).toBe(false);


    // Validate error message or no results
  });

  // ❌ Negative2
  test('Search user without selecting any filters', async () => {
    await userManagement.clickSearch;

    // Validate behavior (all users displayed or validation message)
  });

  // ❌ Negative3
  test('Verify case-insensitive Username search', async () => {

    const allSmallusername = loginData.validUser.username.toLowerCase();
  

    await userManagement.enterUsername(allSmallusername);
    await userManagement.clickSearch();

    await userManagement.verifyOnUserManagementPage({username: allSmallusername});

    // Validate expected behavior
  });

  // ✅ Positive3
  test('Verify Status filter = Disabled', async () => {
    await userManagement.selectStatus(loginData.invalidUser.status);
    await userManagement.clickSearch();
    await userManagement.verifyOnUserManagementPage ({status : loginData.invalidUser.status})

    // Validate only disabled users shown
  });

});