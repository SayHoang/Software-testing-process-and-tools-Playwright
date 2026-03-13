import { test, expect } from "@playwright/test";
import loginData from "../test-data/LoginData.json";

for (const user of loginData) {
  test(`${user.testCaseID} - ${user.expectedResult}`, async ({ page }) => {
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    await page.getByRole("textbox", { name: "Username" }).fill(user.username);
    await page.getByRole("textbox", { name: "Password" }).fill(user.password);

    await page.getByRole("button", { name: "Login" }).click();

    if (user.expectedResult === "Login Success") {
      await expect(page).toHaveURL(/dashboard/i);
    } else if (user.expectedResult === "Username cannot be empty") {
      await expect(page.getByText("Required")).toBeVisible();
    } else if (user.expectedResult === "Password cannot be empty") {
      await expect(page.getByText("Required")).toBeVisible();
    } else {
      await expect(page.getByText(user.expectedResult)).toBeVisible();
    }
  });
}
