import { readFile } from 'node:fs/promises'
import { test, expect } from '@playwright/test'
import { openApp, preview, formSectionOrder } from './helpers.js'

test('renders the default resume in the preview', async ({ page }) => {
  await openApp(page)

  await expect(preview(page)).toContainText('Amol Bohora')
  await expect(preview(page)).toContainText('Northeastern University')
})

test('editing a field updates the preview', async ({ page }) => {
  await openApp(page)

  await page.getByLabel('Name', { exact: true }).fill('Jordan Example')

  await expect(preview(page)).toContainText('Jordan Example')
  await expect(preview(page)).not.toContainText('Amol Bohora')
})

test('clicking text in the preview opens the matching entry', async ({ page }) => {
  await openApp(page)
  const projectCard = page.locator('[data-project-index="0"]')
  await expect(projectCard.locator('.entry-card__body')).toBeHidden()

  await preview(page).locator('.tsel', { hasText: 'Created' }).first().click()

  await expect(projectCard.locator('.entry-card__body')).toBeVisible()
  await expect(projectCard.getByLabel('Project name')).toHaveValue('AI Resume Tuner')
})

test('section arrows reorder the form, tabs and resume', async ({ page }) => {
  await openApp(page)
  expect(await formSectionOrder(page)).toEqual([
    'Education',
    'Work Experience',
    'Projects',
    'Skills',
  ])

  const education = page.locator('.section-container', {
    has: page.locator('.text-h6', { hasText: 'Education' }),
  })
  await education.getByRole('button').filter({ hasText: 'arrow_downward' }).click()

  await expect
    .poll(() => formSectionOrder(page))
    .toEqual(['Work Experience', 'Education', 'Projects', 'Skills'])
  await expect(page.getByRole('tab')).toHaveText([
    'Profile',
    'Experience',
    'Education',
    'Projects',
    'Skills',
  ])

  // The resume itself lists Work Experience before Education now
  await expect
    .poll(async () => {
      const text = await preview(page).innerText()
      return text.search(/work experience/i) < text.search(/education/i)
    })
    .toBe(true)
})

test('save, save as copy and load a resume', async ({ page }) => {
  await openApp(page)
  const name = page.getByLabel('Name', { exact: true })
  const status = page.locator('.save-bar .text-caption')

  // First save asks for a name
  await name.fill('Saved Person')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await page.getByLabel('Resume Name').fill('E2E resume')
  await page.getByLabel('Resume Name').press('Enter')
  await expect(status).toHaveText('Editing “E2E resume”')

  // Save as copy suggests a "(copy)" name and switches to the copy
  await page.locator('.save-bar .q-btn-dropdown__arrow-container').click()
  await page.getByText('Save as copy…').click()
  await expect(page.getByLabel('Resume Name')).toHaveValue('E2E resume (copy)')
  await page.getByLabel('Resume Name').press('Enter')
  await expect(status).toHaveText('Editing “E2E resume (copy)”')

  // Saves survive a reload and Load restores their content
  await page.reload()
  await expect(page.locator('.svg-container svg')).toBeVisible()
  await name.fill('Someone Else')
  await page.getByRole('button', { name: /Load/ }).click()
  await page.locator('.q-menu').getByText('E2E resume', { exact: true }).click()

  await expect(name).toHaveValue('Saved Person')
  await expect(status).toHaveText('Editing “E2E resume”')
})

test('exports the resume as a PDF', async ({ page }) => {
  await openApp(page)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export PDF' }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('Amol Bohora Resume.pdf')
  const pdf = await readFile(await download.path())
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
  expect(pdf.length).toBeGreaterThan(5_000)
})
