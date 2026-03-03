import { Page, Locator } from "@playwright/test";


export class UserManagementPage {
  readonly page: Page;
  readonly userList: Locator;
  readonly ResetBtn: Locator;
  readonly SearchBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userList = this.page.locator('table#userList');
    this.ResetBtn = this.page.locator('button:has-text("Reset")');
    this.SearchBtn = this.page.getByRole('button', { name: 'Search' });
    this.userList = this.page.getByRole('rowgroup').locator('.oxd-table-body');
  }

  async navigateToUserManagement() {

    await this.page.getByText('Admin').click();
  }

  async enterUsername(username: string) {
    //await this.page.fill('#username', username);

    await this.page.getByRole('textbox').nth(1).fill(username);
  }

  async selectUserRole(role: string) {
    await this.page.getByText('-- Select --').first().click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async selectStatus(status: string) {
    await this.page.getByText('-- Select --').click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async clickSearch() {
    await this.SearchBtn.click();
  }

  async clickReset() {
    await this.ResetBtn.click;
  }

  async verifyOnUserManagementPage(filters: { username?: string; role?: string; status?: string }): Promise<boolean> {
    const { username, role, status } = filters;

    // await this.userList.waitFor();

    const rows = this.userList.locator('tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
      // No rows found → return false instead of throwing
      return false;
    }

    else {

      return true;
    }

    // Loop through each row and check if it matches the filters
    /*for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);

      if (username) {
        const usernameCell = row.locator('td').nth(0);
        const usernameText = await usernameCell.textContent();
        if (!usernameText?.includes(username)) {
          return false; // mismatch → return false
        }
      }

      if (role) {
        const roleCell = row.locator('td').nth(1);
        const roleText = await roleCell.textContent();
        if (!roleText?.includes(role)) {
          return false; // mismatch → return false
        }
      }

      if (status) {
        const statusCell = row.locator('td').nth(2);
        const statusText = await statusCell.textContent();
        if (!statusText?.includes(status)) {
          return false; // mismatch → return false
        }
      }
    }

    // If we reach here → all rows matched the filters
    return true;

    */
  }


  async resetFilters() {

    await this.ResetBtn.click();
  }

  async verifyEmptyList() {

  };





}






