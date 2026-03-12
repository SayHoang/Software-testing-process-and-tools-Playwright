import { test, expect } from "@playwright/test";
import { login } from "../pages/LoginPage";
import { readFileSync } from "fs";
import path from "path";

type SearchCandidateData = {
  keyword: string;
  expectedName: string;
  shouldFound: boolean;
  testCaseID: string;
};

const jsonFilePath = path.resolve(__dirname, "../test-data/SearchEmployeeData.json");

const searchCandidateData: SearchCandidateData[] = JSON.parse(readFileSync(jsonFilePath, "utf-8"));

test.beforeEach(async ({ page }) => {
  await login(page);
});

for (const { keyword, expectedName, shouldFound, testCaseID } of searchCandidateData) {
  test(`${testCaseID} - ${expectedName}`, async ({ page }) => {
    await page.getByRole("link", { name: "PIM" }).click();

    await expect(page).toHaveURL(/pim/i);

    await page.getByRole("listitem").filter({ hasText: "Employee List" }).click();

    await expect(page).toHaveURL(/viewEmployeeList/i);

    await page.getByRole("textbox", { name: "Type for hints..." }).first().fill(keyword);

    await page.getByRole("button", { name: "Search" }).click();

    if (shouldFound) {
      const firstRow = page.locator(".oxd-table-body .oxd-table-row").first();
      await expect(firstRow).toContainText(expectedName);
    } else {
      await expect(page.locator("#oxd-toaster_1").getByText("No Records Found")).toBeVisible();
    }
  });
}
