import { Page } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("https://opensource-demo.orangehrmlive.com/");

  await page.getByRole("textbox", { name: "Username" }).fill("Admin");

  await page.getByRole("textbox", { name: "Password" }).fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();
}
