import { test, expect } from "@playwright/test";

const SITE = "https://template.com";

test("contact form", async ({ page }) => {
  await page.goto(SITE);
  await page.getByRole("link", { name: "Start Your Project" }).click();
  await page.getByPlaceholder("Karel Nagel").click();
  await page.getByPlaceholder("Karel Nagel").fill("Test name");
  await page.getByPlaceholder("Karel Nagel").press("Tab");
  await page.getByPlaceholder("karel@template.com").fill("nagelkarel@gmail.com");
  await page.getByPlaceholder("karel@template.com").press("Tab");
  await page.getByPlaceholder("I need a website that...").fill("This is a test message!");
  await page.getByRole("button", { name: "Send" }).click();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const result = await page.getByTestId("form-result").textContent();
  expect(result).toBe("Thank you! Your message has been sent. We'll be in touch soon.");
});

test("test sitemap pages", async ({ page }) => {
  const res = await page.goto(SITE + "/sitemap.xml");
  if (!res) throw new Error("No sitemap!");
  const text = await res.text();
  const urls = text.match(/<loc>(.*?)<\/loc>/g)?.map((x) => x.replace(/<loc>|<\/loc>/g, "")) || [];
  if (urls.length === 0) throw new Error("No urls found");
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    const res = await page.goto(url);
    expect(res?.status()).toBe(200);
  }
});
test("robots.txt", async ({ page }) => {
  const res = await page.goto(SITE + "/robots.txt");
  expect(res?.status()).toBe(200);
  const txt = await res?.text();
  expect(txt).toContain("User-agent: *");
  expect(txt).toContain("Allow: /");
  expect(txt).toContain(`Sitemap: ${SITE}/sitemap.xml`);
});
