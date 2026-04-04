const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");

function artifactPath(name, projectName) {
  const dir = path.join(__dirname, "..", "playwright-artifacts", "smoke");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${name}-${projectName}.png`);
}

test("homepage smoke", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Gotham Web Dev/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const menuToggle = page.getByRole("button", { name: /open site menu|close site menu/i });
  if (await menuToggle.isVisible()) {
    await menuToggle.click();
    await expect(page.locator(".site-nav.is-open").getByRole("link", { name: /get a quote/i })).toBeVisible();
  } else {
    await expect(page.locator("header").getByRole("link", { name: /get a quote/i })).toBeVisible();
  }

  await page.screenshot({ path: artifactPath("homepage", testInfo.project.name), fullPage: true });
});

test("contact smoke", async ({ page }, testInfo) => {
  await page.goto("/contact.html");
  await expect(page.getByRole("heading", { name: /get in touch/i })).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: /info@gothamwebdev.com/i })).toBeVisible();
  await expect(page.getByLabel(/full name/i)).toBeVisible();
  await page.screenshot({ path: artifactPath("contact", testInfo.project.name), fullPage: true });
});

test("mobile nav closes without ghost hit targets", async ({ page }, testInfo) => {
  const viewport = testInfo.project.use.viewport;
  test.skip(!viewport || viewport.width > 800, "Only relevant for mobile nav layout.");

  await page.goto("/");

  const menuToggle = page.getByRole("button", { name: /open site menu|close site menu/i });
  await expect(menuToggle).toBeVisible();

  await menuToggle.click();
  await expect(page.locator(".site-nav.is-open").getByRole("link", { name: /web design/i })).toBeVisible();

  await menuToggle.click();
  await expect(page.locator(".site-nav")).not.toBeVisible();

  const beforeUrl = page.url();
  await page.mouse.click(60, 240);
  await page.waitForTimeout(150);
  await expect(page).toHaveURL(beforeUrl);
});
