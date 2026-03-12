import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

type LoginData = {
  username: string;
  password: string;
  expectedResult: string;
  testCaseID: string;
};

const jsonFilePath = path.resolve(__dirname, "../test-data/LoginData.json");

const loginData: LoginData[] = JSON.parse(readFileSync(jsonFilePath, "utf-8"));

for (const { username, password, expectedResult, testCaseID } of loginData) {
  test(`${testCaseID} - ${expectedResult}`, async ({ page }) => {
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    await page.getByRole("textbox", { name: "Username" }).fill(username);
    await page.getByRole("textbox", { name: "Password" }).fill(password);

    await page.getByRole("button", { name: "Login" }).click();

    if (expectedResult === "Login Success") {
      await expect(page).toHaveURL(/dashboard/i);
    } else if (expectedResult === "Username cannot be empty") {
      await expect(page.getByText("Required")).toBeVisible();
    } else if (expectedResult === "Password cannot be empty") {
      await expect(page.getByText("Required")).toBeVisible();
    } else {
      await expect(page.getByText(expectedResult)).toBeVisible();
    }
  });
}
