import { test, expect } from '@playwright/test'

test.describe('Page d’accueil', () => {
  test('affiche le hero et les sections principales', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/MKMI Québec/)
    await expect(page.locator('h1').first()).toContainText('Une famille.')
    await expect(page.getByRole('heading', { name: 'Vous êtes les bienvenus.' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quatre piliers pour une génération' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Donner/ }).first()).toBeVisible()
  })

  test('les pages à venir répondent', async ({ page }) => {
    const res = await page.goto('http://localhost:3000/priere')
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveText('Prière')
  })
})
