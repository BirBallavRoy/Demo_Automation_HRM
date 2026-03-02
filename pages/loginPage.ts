import { Page, Locator } from "@playwright/test";


export class LoginPage {

    page : Page;

    readonly username : Locator;
    readonly password : Locator;
    readonly loginBtn : Locator

    constructor(page : Page) {

        this.page = page;

        this.username = page.getByPlaceholder("Username");
        this.password = page.getByPlaceholder("Password");
        this.loginBtn = page.locator("//button[@type ='submit']");


    }

    async login (username: string,pwd :string){

       await this.username.fill(username);
       await this.password.fill(pwd);
       await this.loginBtn.click();


    }



}