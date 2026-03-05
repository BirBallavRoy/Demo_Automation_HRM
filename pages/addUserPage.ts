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
        await this.page.getByText('Admin').click();
    }

    async addUser(username: string, role: string, status: string, password: string) {
        await this.addUserBtn.click();

        // Role - only fill if provided
        if (role) {
            await this.page.getByText('-- Select --').first().click();
            await this.page.getByRole('option', { name: role }).click();
        }

        // Employee Name - only fill if provided
        await this.page.getByRole('textbox', { name: 'Type for hints...' }).click();
        await this.page.getByRole('textbox', { name: 'Type for hints...' }).fill('test');
        await this.page.getByRole('option', { name: 'sww test' }).first().click();

        // Status - only fill if provided
        if (status) {
            await this.page.getByText('-- Select --').click();
            await this.page.getByRole('option', { name: status }).click();
        }

        // Username - only fill if provided
        if (username) {
            await this.usernameInput.fill(username);
        }

        // Password - only fill if provided
        if (password) {
            await this.page.getByRole('textbox').nth(3).fill(password);
            await this.page.getByRole('textbox').nth(3).press('Tab');
            await this.page.getByRole('textbox').nth(4).fill(password);
        }

        await this.saveBtn.click();
        await this.page.waitForTimeout(3000); // wait 3s for save to complete
        await this.page.waitForLoadState('load');
    }

    async check_addUserMandatoryField() {
        await this.saveBtn.click();
    }

    async cancelAddUser() {
        await this.addUserBtn.click();
        await this.cancelBtn.click();
    }

    async verifyUserInList(username: string, status?: string): Promise<boolean> {

        // DEBUG - add these temporarily
        console.log('Current URL:', this.page.url());
        console.log('Page content:', await this.page.locator('.oxd-table-body').count());
        console.log('Table rows:', await this.page.locator('.oxd-table-row').count());
        console.log('Page title:', await this.page.title());

        await this.page.locator('.oxd-table-row').first().waitFor({ state: 'visible', timeout: 10000 });

        const rows = this.page.locator('.oxd-table-row--with-border'); // excludes header row
        const rowCount = await rows.count();

        if (rowCount === 0) {
            console.log(`No records found`);
            return false;
        }

        for (let i = 0; i < rowCount; i++) {
            const rowText = await rows.nth(i).innerText();

            const usernameMatch = rowText.includes(username);
            const statusMatch = status ? rowText.includes(status) : true;

            if (usernameMatch && statusMatch) {
                console.log(`User "${username}" found in row ${i + 1}`);
                return true;
            }
        }

        console.log(`User "${username}" NOT found`);
        return false;
    }



}