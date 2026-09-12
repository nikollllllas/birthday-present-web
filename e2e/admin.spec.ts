import { expect, test } from '@playwright/test'

test('admin route shows the login form when no token is stored', async ({
  page,
}) => {
  await page.goto('/admin')

  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()
})

test('admin route shows the panel when a token is already stored', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('admin_token', 'test-token')
  })
  await page.route('**/present*', (route) => route.fulfill({ json: [] }))
  await page.route('**/category*', (route) => route.fulfill({ json: [] }))

  await page.goto('/admin')

  await expect(
    page.getByRole('heading', { name: 'Painel Admin' }),
  ).toBeVisible()
  await expect(page.getByText('Nenhum presente cadastrado.')).toBeVisible()
})
