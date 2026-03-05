import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { UserManagementPage } from '../../pages/userManagement';
import { EditUserPage } from '../../pages/editUserPage';


test.describe('Edit User Test Cases', () => {
    let loginPage: LoginPage;
    let editUserPage: EditUserPage;
    let userManagement : UserManagementPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        editUserPage = new EditUserPage(page);
        userManagement = new UserManagementPage(page);

        await loginPage.navigate();
        await loginPage.login(
            process.env.ADMIN_USERNAME!,
            process.env.ADMIN_PASSWORD!
        );

        await userManagement.navigateToUserManagement();
    });

    test('Verify Edit User with Valid Data (positive1)', async () => {
        await editUserPage.editUser('existing_user', 'updated_user', 'Admin', 'John Doe', 'Enabled');
        await editUserPage.verifyUserInList('updated_user');
    });

    test('Verify mandatory field validation (negative1)', async () => {
        await editUserPage.clearAllFieldsAndSave('existing_user');
        const errorMessage = await editUserPage.page.locator('text=Required').innerText();
        expect(errorMessage).toContain('Required');
    });

    test('Verify Status = Disabled (positive2)', async () => {
        await editUserPage.editUserChangeStatus('existing_user', 'Disabled');
        await editUserPage.verifyUserInList('existing_user', 'Disabled');
    });

    test('Verify Invalid Username (negative2)', async () => {
        await editUserPage.editUserInvalidUsername('existing_user', 'invalid user!');
        const errorMessage = await editUserPage.page.locator('text=Invalid').innerText();
        expect(errorMessage).toContain('Invalid');
    });
});