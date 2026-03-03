// ✅ Make sure you have this at the bottom / top

import { Page, Locator } from "@playwright/test";

export class AddUserPage {
    readonly page: Page;
    readonly addUserBtn: Locator;
    readonly usernameInput: Locator;
    readonly roleDropdown: Locator;
    readonly employeeNameInput: Locator;
    readonly statusDropdown: Locator;
    readonly saveBtn: Locator;
    readonly cancelBtn: Locator;
    readonly userList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addUserBtn = page.locator('button:has-text("Add User")');
        this.usernameInput = page.locator('#username');
        this.roleDropdown = page.locator('#role');
        this.employeeNameInput = page.locator('#employeeName');
        this.statusDropdown = page.locator('#status');
        this.saveBtn = page.locator('button:has-text("Save")');
        this.cancelBtn = page.locator('button:has-text("Cancel")');
        this.userList = page.locator('table#userList');
    }

    async navigateToUserManagement() {
        await this.page.click('text=Admin');
        await this.page.click('text=User Management');
    }

    async addUser(username: string, role: string, empName: string, status: string) {
        await this.addUserBtn.click();
        await this.usernameInput.fill(username);
        await this.roleDropdown.selectOption(role);
        await this.employeeNameInput.fill(empName);
        await this.statusDropdown.selectOption(status);
        await this.saveBtn.click();
    }

    async cancelAddUser() {
        await this.addUserBtn.click();
        await this.cancelBtn.click();
    }

    async verifyUserInList(username: string, status?: string) {
        const userRow = this.userList.locator(`tr:has-text("${username}")`);
        await userRow.waitFor();
        if (status) {
            await userRow.locator(`td:has-text("${status}")`).waitFor();
        }
    }
}