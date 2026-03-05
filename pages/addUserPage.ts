import { Page, Locator, expect } from "@playwright/test";

export class AddUserPage {
    readonly page: Page;
    readonly addUserBtn: Locator;
    readonly usernameInput: Locator;
    readonly saveBtn: Locator;
    readonly cancelBtn: Locator;
    readonly tableRows: Locator;
    readonly loader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addUserBtn = page.getByRole('button', { name: /Add/ });

        //this.usernameInput = page.locator('input.oxd-input').nth(2);

        this.usernameInput =  page.locator('.oxd-input-group:has(label:text("Username")) input');

        this.saveBtn = page.getByRole('button', { name: 'Save' });

        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });

        this.tableRows = page.locator('.oxd-table-card');

        this.loader = page.locator('.oxd-loading-spinner');
    }

    async navigateToUserManagement() {
        await this.page.locator('a.oxd-main-menu-item[href*="viewAdminModule"]').click();
        await expect(this.page).toHaveURL(/viewSystemUsers/);
    }

    async addUser(
        username: string,
        role: string,
        status: string,
        emp_name: string,
        password: string
    ) {

        await this.addUserBtn.click();

        // Role
        if (role) {
            await this.page.getByText('-- Select --').first().click();
            await this.page.getByRole('option', { name: role }).click();
        }

        if (status) {
            await this.page.locator('.oxd-input-group:has(label:text("Status")) .oxd-select-text-input').click();
            await this.page.getByRole('option', { name: status }).click();
        }

        // Username
        if (username) {
            await this.usernameInput.fill(username);
        }

        // Employee name
        if (emp_name) {
            const empField = this.page.getByRole('textbox', { name: 'Type for hints...' });
            await empField.fill('test');
            await this.page.getByRole('option', { name: emp_name }).first().click();
        }

        // Password
        if (password) {
            await this.page.getByRole('textbox').nth(3).fill(password);
            await this.page.getByRole('textbox').nth(4).fill(password);
        }

        await this.saveBtn.click();

        console.log('Save clicked - waiting for loader...');

        // wait loader disappear
        await this.loader.waitFor({ state: 'hidden' });

        // wait table visible
        //await this.tableRows.first().waitFor({ state: 'visible' });
    }

    async check_addUserMandatoryField() {
        await this.saveBtn.click();
    }

    async cancelAddUser() {
        await this.addUserBtn.click();
        await this.cancelBtn.click();
    }

    async verifyOnUserManagementPage(filters: {
        username?: string;
        role?: string;
        status?: string;
    }): Promise<boolean> {

        const { username, role, status } = filters;

        await this.loader.waitFor({ state: 'hidden' });

        await expect(this.tableRows.first()).toBeVisible({ timeout: 60000 });

        const rowCount = await this.tableRows.count();

        for (let i = 0; i < rowCount; i++) {

            const rowText = await this.tableRows.nth(i).innerText();

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