import { Page, Locator } from "@playwright/test";
import loginData from '../test-data/login/loginData.json';

export class EditUserPage {

    readonly page : Page;

    constructor(page: Page) {
        this.page = page;
        
    }

}