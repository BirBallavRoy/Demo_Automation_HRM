import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { UserManagementPage } from '../../pages/userManagement';
import { AddUserPage } from '../../pages/addUserPage';

test.describe('Add User Test Cases', () => {
    let loginPage: LoginPage;
    let addUserPage: AddUserPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        addUserPage = new AddUserPage(page);

        await loginPage.navigate();
        await loginPage.login(
            process.env.ADMIN_USERNAME!,
            process.env.ADMIN_PASSWORD!
        );
        
        await addUserPage.navigateToUserManagement();
    });

  test('Add User Full Flow: Positive & Negative Scenarios', async () => {
    // ----------------------------
    // Positive 1: Add user with valid data
    // ----------------------------
    await addUserPage.addUser('new_user1', 'Admin', 'John Doe', 'Enabled');
    await addUserPage.verifyUserInList('new_user1');

    // ----------------------------
    // Negative 1: Mandatory field validation (missing username)
    // ----------------------------
    await addUserPage.addUser('', 'Admin', 'John Doe', 'Enabled'); // username missing
    const requiredError = await addUserPage.page.locator('text=Required').innerText();
    expect(requiredError).toContain('Required');

    // ----------------------------
    // Negative 2: Invalid username
    // ----------------------------
    await addUserPage.addUser('invalid user!', 'Admin', 'John Doe', 'Enabled'); // invalid username
    const invalidError = await addUserPage.page.locator('text=Invalid').innerText();
    expect(invalidError).toContain('Invalid');

    // ----------------------------
    // Positive 2: Add user with Status = Disabled
    // ----------------------------
    await addUserPage.addUser('new_user2', 'ESS', 'Jane Doe', 'Disabled');
    await addUserPage.verifyUserInList('new_user2', 'Disabled');

    // ----------------------------
    // Positive 3: Verify Cancel button
    // ----------------------------
    await addUserPage.cancelAddUser();
    expect(await addUserPage.usernameInput.isVisible()).toBeFalsy(); // form should be closed
});
});