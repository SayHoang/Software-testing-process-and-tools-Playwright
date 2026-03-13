import { test, expect } from "@playwright/test";
import { login } from "../pages/LoginPage";
import searchEmployeeData from "../test-data/SearchEmployeeData.json";

test.beforeEach(async ({ page }) => {
  await login(page);
});

for (const user of searchEmployeeData) {
  test(`${user.testCaseID} - ${user.expectedName}`, async ({ page }) => {
    await page.getByRole("link", { name: "PIM" }).click();

    await expect(page).toHaveURL(/pim/i);

    await page.getByRole("listitem").filter({ hasText: "Employee List" }).click();

    await expect(page).toHaveURL(/viewEmployeeList/i);

    await page.getByRole("textbox", { name: "Type for hints..." }).first().fill(user.keyword);

    await page.getByRole("button", { name: "Search" }).click();

    if (user.shouldFound) {
      const firstRow = page.locator(".oxd-table-body .oxd-table-row").first();
      await expect(firstRow).toContainText(user.expectedName);
    } else {
      await expect(page.locator("#oxd-toaster_1").getByText("No Records Found")).toBeVisible();
    }
  });
}
