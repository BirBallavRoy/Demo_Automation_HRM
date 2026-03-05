import { Page, Locator } from "@playwright/test";
import loginData from '../test-data/login/loginData.json';

export class EditUserPage {

    readonly page: Page;
    readonly addUserBtn: Locator;
    readonly usernameInput: Locator;
    readonly statusDropdown: Locator;
    readonly saveBtn: Locator;
    readonly cancelBtn: Locator;
    //  readonly editUserBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addUserBtn = page.getByRole('button', { name: ' Add' });

        this.usernameInput =  page.locator('.oxd-input-group:has(label:text("Username")) input');


        this.statusDropdown = page.locator('#status');

        this.saveBtn = page.getByRole('button', { name: 'Save' });

        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });





    }

    async editUser(username: string, role: string, status: string) {
        await this.page.locator('button:has(i.bi-pencil-fill)').nth(0).click();

        // Role - only fill if provided
        if (role) {
            await this.page.getByText('-- Select --').first().click();
            await this.page.getByRole('option', { name: role }).click();
            console.log("role selected")
        }



        // Status - only fill if provided
        if (status) {
            await this.page.locator('.oxd-input-group:has(label:text("Status")) .oxd-select-text-input').click();
            await this.page.getByRole('option', { name: status }).click();
        }

        // Username - only fill if provided
        if (username) {
            await this.usernameInput.fill(username);
        }


        await this.saveBtn.click();

        console.log('Save clicked - waiting for page to reload...');


        await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'hidden' });

        await this.page.locator('.oxd-table-card').first().waitFor({ state: 'visible' });
    }

}