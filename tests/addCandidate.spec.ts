import { test, expect } from "@playwright/test";
import { login } from "../pages/LoginPage";
import addCandidateData from "../test-data/AddCandidateData.json";

test.beforeEach(async ({ page }) => {
  await login(page);
});

for (const row of addCandidateData) {
  test(`${row.testCaseID} - ${row.description}`, async ({ page }) => {
    await page.getByRole("link", { name: "PIM" }).click();

    await expect(page).toHaveURL(/pim/i);

    await page.getByRole("listitem").filter({ hasText: "Add Employee" }).click();

    await expect(page).toHaveURL(/addEmployee/i);

    await page.getByRole("textbox", { name: "First Name" }).fill(row.firstName);
    await page.getByRole("textbox", { name: "Middle Name" }).fill(row.middleName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(row.lastName);
    await page.getByRole("textbox").nth(4).fill(row.employeeID);
    const fullName = [row.firstName, row.lastName].filter(Boolean).join(" ").trim();

    await page.getByRole("button", { name: "Save" }).click();

    timeout: 2000;

    if (row.expectedResult === "pass") {
      await expect(page.locator("div").filter({ hasText: fullName }).nth(1)).toBeVisible();
    } else if (row.expectedResult === "Required") {
      const firstName = page.getByText("Required").first();
      const lastName = page.getByText("Required").nth(1);
      await expect(firstName || lastName).toBeVisible();
    } else if (row.expectedResult === "Employee Exists") {
      await expect(page.getByText("Employee Id already exists")).toBeVisible();
    } else {
      await expect(page).toHaveURL(/addEmployee/i);
    }
  });
}
