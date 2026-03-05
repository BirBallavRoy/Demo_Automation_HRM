import { Page, Locator } from "@playwright/test";


export class UserManagementPage {
  readonly page: Page;
  readonly userList: Locator;
  readonly ResetBtn: Locator;
  readonly SearchBtn: Locator;
  readonly dropdown_role: Locator;
  readonly username_input: Locator;
  readonly dropdown_status: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userList = this.page.locator('table#userList');
    this.ResetBtn = this.page.locator('button:has-text("Reset")');
    this.SearchBtn = this.page.getByRole('button', { name: 'Search' });
    this.userList = this.page.getByRole('rowgroup').locator('.oxd-table-body');
    this.dropdown_role = this.page
      .locator("label:has-text('User Role')")
      .locator("xpath=ancestor::div[contains(@class,'oxd-input-group')]")
      .locator(".oxd-select-text");

    this.dropdown_status = this.page
      .locator("label:has-text('Status')")
      .locator("xpath=ancestor::div[contains(@class,'oxd-input-group')]")
      .locator(".oxd-select-text");


    //this.username_input = this.page.locator('.oxd-input.oxd-input--active').first();
    this.username_input = this.page.locator('//label[text()="Username"]/following::input[1]');
  }

  async navigateToUserManagement() {

    await this.page.locator('//span[text()="Admin"]').click();
  }

  async enterUsername(username: string) {

    await this.username_input.waitFor({ state: 'visible' });

    await this.username_input.fill(username);

    console.log("entered username");
  }



  async selectUserRole(role: string) {

    await this.dropdown_role.click();
    await this.page.locator('div[role="option"]', { hasText: role }).click();
    console.log("Selected role");

  }

  async selectStatus(status: string) {
    await this.dropdown_status.click();
    await this.page.locator('div[role="option"]', { hasText: status }).click();
    console.log("Selected status");
  }

  async clickSearch() {
    await this.SearchBtn.click();
  }

  async clickReset() {
    await this.ResetBtn.click();
  }

  
  async verifyOnUserManagementPage(filters: { username?: string; role?: string; status?: string }): Promise<boolean> {
    const { username, role, status } = filters;

    // Wait for search results to appear
    await this.page.waitForLoadState('load');
    await this.page.locator('.oxd-table-card').first().waitFor({ state: 'visible', timeout: 60000 });

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


  async resetFilters() {

    await this.ResetBtn.click();
  }

  async verifyEmptyList() {

    const count = await this.page.locator(
      '.oxd-table-card'
    ).count();

    if (count > 0) {
      console.log("Table not empty");
      return false;
    } else {
      console.log("Empty table");
      return true;

    }

  };





}






