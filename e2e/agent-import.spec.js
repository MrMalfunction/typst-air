import { readFile } from 'node:fs/promises'
import { test, expect } from '@playwright/test'
import { openApp, preview } from './helpers.js'

const resume = (overrides = {}) => ({
  version: 1,
  personal: { name: 'Taylor Agent', email: 'taylor@example.com', location: 'Remote' },
  summary: 'Backend engineer who likes boring, reliable systems.',
  sectionOrder: ['work', 'skills', 'education', 'projects'],
  work: [
    {
      title: 'Staff Engineer',
      company: 'Example Corp',
      location: 'Remote',
      startDate: '2021',
      endDate: 'Present',
      bullets: ['Cut p99 latency by <b>40%</b>', 'Led a team of 5'],
    },
  ],
  education: [{ institution: 'State University', degree: 'BS Computer Science', endDate: '2015' }],
  projects: [],
  skills: [{ category: 'Languages', items: ['Go', 'Python', 'SQL'] }],
  ...overrides,
})

const linkFor = (data) => `/#resume=${encodeURIComponent(JSON.stringify(data))}`

test('opens a resume from a link after confirming', async ({ page }) => {
  await page.goto(linkFor(resume()))
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('Taylor Agent')
  await expect(dialog).toContainText('1 job')

  await dialog.getByRole('button', { name: 'Open resume' }).click()

  await expect(preview(page)).toContainText('Taylor Agent')
  await expect(preview(page)).toContainText('Example Corp')
  await expect(preview(page)).not.toContainText('Amol Bohora')
  // Section order from the link is applied
  await expect(page.getByRole('tab')).toHaveText([
    'Profile',
    'Experience',
    'Skills',
    'Education',
    'Projects',
  ])
  // The resume data is removed from the address bar
  expect(new URL(page.url()).hash).toBe('')
})

test('cancelling a link keeps the current resume', async ({ page }) => {
  await page.goto(linkFor(resume()))
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click()

  await expect(preview(page)).toContainText('Amol Bohora')
  await expect(preview(page)).not.toContainText('Taylor Agent')
  expect(new URL(page.url()).hash).toBe('')
})

test('a damaged link shows an error and changes nothing', async ({ page }) => {
  await page.goto('/#resume=%7B%22personal%22%3A')

  await expect(page.locator('.q-notification')).toContainText("Couldn't open the resume")
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(preview(page)).toContainText('Amol Bohora')
})

test('strips unsafe HTML from bullets in a link', async ({ page }) => {
  const evil = resume({
    work: [
      {
        title: 'Engineer',
        company: 'Evil Inc',
        bullets: [
          '<img src=x onerror="window.__pwned = true">Shipped <b>v2</b> ' +
            '<a href="javascript:window.__pwned = true">docs</a> ' +
            '<a href="https://example.com/a">site</a><script>window.__pwned = true</script>',
        ],
      },
    ],
  })
  await page.goto(linkFor(evil))
  await page.getByRole('dialog').getByRole('button', { name: 'Open resume' }).click()
  await expect(preview(page)).toContainText('Shipped v2')

  // Open the entry so the rich-text editor renders the bullet HTML
  await page.locator('[data-work-index="0"] .entry-card__summary').click()
  const editor = page.locator('[data-work-index="0"] .q-editor__content').first()
  await expect(editor).toContainText('Shipped v2 docs site')

  const html = await editor.innerHTML()
  expect(html).toContain('<b>v2</b>')
  expect(html).toContain('href="https://example.com/a"')
  expect(html).not.toMatch(/<img|onerror|javascript:|<script/i)
  expect(await page.evaluate(() => window.__pwned)).toBeUndefined()
})

test('special characters render without breaking the preview', async ({ page }) => {
  const tricky = resume({
    personal: { name: 'Zoë "Z" O\'Neil', email: 'zoe+cv@example.com' },
    work: [
      {
        title: 'C# & .NET Developer',
        company: 'Back\\Slash Ltd',
        bullets: ['Saved $50k (30%) on R&D at @scale with *care*'],
      },
    ],
    skills: [{ category: 'Tools #1', items: 'Git, "quoted", a\\b' }],
  })
  await page.goto(linkFor(tricky))
  await page.getByRole('dialog').getByRole('button', { name: 'Open resume' }).click()

  await expect(preview(page)).toContainText('Zoë "Z" O\'Neil')
  await expect(preview(page)).toContainText('C# & .NET Developer')
  await expect(preview(page)).toContainText('Back\\Slash Ltd')
  await expect(preview(page)).toContainText('Saved $50k (30%) on R&D at @scale')
  await expect(preview(page)).toContainText('Tools #1')
  await expect(page.locator('.q-notification--negative, .q-notification.bg-negative')).toHaveCount(
    0,
  )
})

test('Download JSON and Import JSON file round-trip, and clear the current save', async ({
  page,
}) => {
  await openApp(page)
  const status = page.locator('.save-bar .text-caption')

  // Start from a saved resume, so we can check the import detaches from it
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await page.getByLabel('Resume Name').fill('Mine')
  await page.getByLabel('Resume Name').press('Enter')
  await expect(status).toHaveText('Editing “Mine”')

  await page.getByLabel('Name', { exact: true }).fill('Exported Person')
  await page.locator('.save-bar .q-btn-dropdown__arrow-container').click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByText('Download JSON').click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('Exported-Person.resume.json')
  const exported = JSON.parse(await readFile(await download.path(), 'utf8'))
  expect(exported.version).toBe(1)
  expect(exported.personal.name).toBe('Exported Person')
  expect(exported.work[0].bullets.length).toBeGreaterThan(0)

  await page.getByLabel('Name', { exact: true }).fill('Someone Else')
  await page.locator('.save-bar input[type=file]').setInputFiles({
    name: 'resume.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(exported)),
  })

  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Exported Person')
  await expect(preview(page)).toContainText('Exported Person')
  await expect(status).toHaveText('Not saved yet')
})

test('Copy link produces a link that opens the same resume', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await openApp(page)
  await page.getByLabel('Name', { exact: true }).fill('Linked Person')

  await page.locator('.save-bar .q-btn-dropdown__arrow-container').click()
  await page.getByText('Copy link').click()
  await expect(page.locator('.q-notification')).toContainText('Link copied')
  const link = await page.evaluate(() => navigator.clipboard.readText())
  expect(link).toMatch(/^http:\/\/localhost:\d+\/#resume=/)

  const other = await context.newPage()
  await other.goto(link)
  await other.getByRole('dialog').getByRole('button', { name: 'Open resume' }).click()
  await expect(preview(other)).toContainText('Linked Person')
})

test('llms.txt and the JSON schema are published for agents', async ({ request }) => {
  const llms = await request.get('/llms.txt')
  expect(llms.ok()).toBe(true)
  const body = await llms.text()
  expect(body).toContain('#resume=')
  expect(body).toContain('resume.schema.json')

  const schema = await request.get('/resume.schema.json')
  expect(schema.ok()).toBe(true)
  expect((await schema.json()).properties.work).toBeTruthy()
})

test('the example in llms.txt opens correctly', async ({ page, request }) => {
  const body = await (await request.get('/llms.txt')).text()
  const example = JSON.parse(body.match(/```json\n([\s\S]*?)\n```/)[1])

  await page.goto(linkFor(example))
  await page.getByRole('dialog').getByRole('button', { name: 'Open resume' }).click()

  await expect(preview(page)).toContainText('Jordan Rivera')
  await expect(preview(page)).toContainText('Example Corp')
  await expect(preview(page)).toContainText('Open Source CLI')
  await expect(preview(page)).toContainText('Infrastructure')
})
