import { expect } from '@playwright/test'

// Open the app and wait for the Typst preview's first render.
export async function openApp(page) {
  await page.goto('/')
  await expect(page.locator('.svg-container svg')).toBeVisible()
}

export const preview = (page) => page.locator('.svg-container')

// Heading text of each resume section in the form, top to bottom.
export const formSectionOrder = (page) => page.locator('.section-heading .text-h6').allInnerTexts()
