const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  fullyParallel: true,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  outputDir: "playwright-artifacts/test-results",
  use: {
    baseURL: "http://127.0.0.1:8080",
    headless: false,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:8080",
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: "mobile-390x844",
      use: {
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: "tablet-768x1024",
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "tablet-landscape-1024x768",
      use: {
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: "desktop-1440x900",
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
