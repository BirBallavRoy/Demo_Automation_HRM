import { Page, Locator } from "@playwright/test";
import loginData from '../test-data/login/loginData.json';

export class AddUserPage {
    readonly page: Page;
    readonly addUserBtn: Locator;
    readonly usernameInput: Locator;
    readonly statusDropdown: Locator;
    readonly saveBtn: Locator;
    readonly cancelBtn: Locator;
    readonly userList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addUserBtn = page.getByRole('button', { name: ' Add' });

        this.usernameInput = page.locator('input.oxd-input.oxd-input--active').nth(2);


        this.statusDropdown = page.locator('#status');

        this.saveBtn = page.getByRole('button', { name: 'Save' });

        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
        this.userList = page.locator('table#userList');
    }

    async navigateToUserManagement() {
        await this.page.locator('a.oxd-main-menu-item[href="/web/index.php/admin/viewAdminModule"]').click();
        await this.page.waitForLoadState('load');
    }

    async addUser(username: string, role: string, status: string, emp_name: string, password: string) {
        await this.addUserBtn.click();

        // Role - only fill if provided
        if (role) {
            await this.page.getByText('-- Select --').first().click();
            await this.page.getByRole('option', { name: role }).click();
        }



        // Status - only fill if provided
        if (status) {
            await this.page.getByText('-- Select --').click();
            await this.page.getByRole('option', { name: status }).click();
        }

        // Username - only fill if provided
        if (username) {
            await this.usernameInput.fill(username);
        }

        if (emp_name) {

            await this.page.getByRole('textbox', { name: 'Type for hints...' }).click();
            await this.page.getByRole('textbox', { name: 'Type for hints...' }).fill('test');
            await this.page.getByRole('option', { name: emp_name }).first().click();
        }


        // Password - only fill if provided
        if (password) {
            await this.page.getByRole('textbox').nth(3).fill(password);
            await this.page.getByRole('textbox').nth(3).press('Tab');
            await this.page.getByRole('textbox').nth(4).fill(password);
        }

        await this.saveBtn.click();
        
        console.log('Save clicked - waiting for page to reload...');

        
        await this.page.waitForTimeout(5000);
        await this.page.waitForLoadState('load');
    }

    async check_addUserMandatoryField() {
        await this.saveBtn.click();
    }

    async cancelAddUser() {
        await this.addUserBtn.click();
        await this.cancelBtn.click();
    }


    async verifyOnUserManagementPage(filters: { username?: string; role?: string; status?: string }): Promise<boolean> {
        const { username, role, status } = filters;

        // Wait for search results to appear
        await this.page.waitForLoadState('load');
        await this.page.locator('.oxd-table-card').first().waitFor({ state: 'visible', timeout: 90000 });

        const rows = this.page.locator('.oxd-table-card');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const rowText = await row.innerText();

            const usernameMatch = username ? rowText.includes(username) : true;
            const roleMatch = role ? rowText.includes(role) : true;
            const statusMatch = status ? rowText.includes(status) : true;

            if (usernameMatch && roleMatch && statusMatch) {
                console.log(`Match found in row ${i + 1}`);
                return true;
            }
        }

        console.log("No matching user found");
        return false;
    }



}