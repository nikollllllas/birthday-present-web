import { expect, test } from '@playwright/test'

const PRESENTS = [
  {
    category: 'Roupas',
    presents: [
      {
        id: 1,
        name: 'Camiseta estampada',
        place: 'Loja Renner',
        condition: { value: 'available', label: 'Disponível' },
        note: null,
        categoryId: 1,
      },
    ],
  },
]

test('home page shows the gift list from the API', async ({ page }) => {
  await page.route('**/present*', (route) => route.fulfill({ json: PRESENTS }))

  await page.goto('/')

  await expect(page.getByText('Roupas')).toBeVisible()
  await expect(page.getByText('Camiseta estampada')).toBeVisible()
  await expect(page.getByText('Loja Renner')).toBeVisible()
  await expect(page.getByText('Disponível').first()).toBeVisible()
})
