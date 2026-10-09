import { test, expect } from "@playwright/test";

test.describe("Marketplace Kurio", () => {
  test("deve carregar o catálogo de NFTs", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Kurio/i);

    await expect(
      page.getByText("Emerald Ape #042").first()
    ).toBeVisible();
  });

 test("deve abrir o detalhe de um NFT", async ({ page }) => {
  await page.goto("/nft/1");

  await expect(
    page.locator("h1").filter({
      hasText: "Emerald Ape #042",
    }).visible().first()
  ).toBeVisible();
});

  test("deve manter o carrinho após atualizar a página", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.setItem(
        "kurio-cart",
        JSON.stringify([{ id: 1, qty: 1 }])
      );
    });

    await page.goto("/carrinho");

    await expect(
      page.getByText("Emerald Ape #042").first()
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByText("Emerald Ape #042").first()
    ).toBeVisible();
  });
});