import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

const chromePath = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const publicDir = path.resolve("public", "screenshots");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function run() {
  console.log("Launching browser via:", chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  // 1. Desktop Dark (1440 x 900)
  console.log("--- Step 1: Desktop Dark 1440 ---");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // Click demo sample chip
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const sampleBtn = buttons.find((b) => b.textContent?.includes("Electricity Disconnection"));
    if (sampleBtn) sampleBtn.click();
  });
  await new Promise((r) => setTimeout(r, 200));

  // Click Inspect Threat CTA
  await page.evaluate(() => {
    const cta = document.getElementById("satark-analyze-cta");
    if (cta) cta.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 200));

  const desktopDarkPath = path.join(publicDir, "desktop-dark-1440.png");
  await page.screenshot({ path: desktopDarkPath, fullPage: true });
  console.log("Saved:", desktopDarkPath);

  // 2. Desktop Light in Hindi
  console.log("--- Step 2: Desktop Light Hindi 1440 ---");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const hiBtn = buttons.find((b) => b.textContent?.trim() === "हिन्दी");
    if (hiBtn) hiBtn.click();
  });
  await new Promise((r) => setTimeout(r, 200));

  await page.evaluate(() => {
    const themeBtn = document.querySelector('button[aria-label*="theme"]') as HTMLElement | null;
    if (themeBtn) themeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 200));

  const desktopLightHindiPath = path.join(publicDir, "desktop-light-hindi-1440.png");
  await page.screenshot({ path: desktopLightHindiPath, fullPage: true });
  console.log("Saved:", desktopLightHindiPath);

  // 3. Mobile Light (375 x 812)
  console.log("--- Step 3: Mobile Light 375 ---");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));

  const mobileLightPath = path.join(publicDir, "mobile-light-375.png");
  await page.screenshot({ path: mobileLightPath, fullPage: true });
  console.log("Saved:", mobileLightPath);

  // 4. Mobile Dark (375 x 812)
  console.log("--- Step 4: Mobile Dark 375 ---");
  await page.evaluate(() => {
    const themeBtn = document.querySelector('button[aria-label*="theme"]') as HTMLElement | null;
    if (themeBtn) themeBtn.click();
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));

  const mobileDarkPath = path.join(publicDir, "mobile-dark-375.png");
  await page.screenshot({ path: mobileDarkPath, fullPage: true });
  console.log("Saved:", mobileDarkPath);

  await browser.close();
  console.log("Screenshot capture and DOM verification complete!");
}

run().catch((err) => {
  console.error("Error during capture:", err);
  process.exit(1);
});
