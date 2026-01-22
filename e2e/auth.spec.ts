import { test, expect } from '@playwright/test'

test.describe('認証フロー', () => {
  test('初回登録から保護者認証までの完全なフロー', async ({ page, context }) => {
    // セッションをクリア
    await context.clearCookies()

    // トップページにアクセス
    await page.goto('/')

    // 未認証なので登録ページへリダイレクトされる
    await expect(page).toHaveURL('/register')
    await expect(page.getByRole('heading', { name: 'あつまれ！漢字の森' })).toBeVisible()

    // 名前を入力
    const nameInput = page.getByPlaceholder('よりちゃん')
    await nameInput.fill('テストユーザー')

    // 登録ボタンをクリック
    const submitButton = page.getByRole('button', { name: 'ぼうけんを はじめる！' })
    await submitButton.click()

    // ホーム画面へ遷移
    await expect(page).toHaveURL('/')
    await expect(page.getByText('テストユーザーさん')).toBeVisible()
    await expect(page.getByText('きょうも ぼうけんに でかけよう！')).toBeVisible()

    // モードボタンが表示される
    await expect(page.getByRole('button', { name: 'よむ（おちもの）' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'かく（おうぎ）' })).toBeVisible()

    // 保護者メニューをクリック
    await page.getByRole('link', { name: 'おとなメニュー' }).click()

    // 保護者認証画面へ遷移
    await expect(page).toHaveURL('/parent/auth')
    await expect(page.getByText('おとなの かくにん')).toBeVisible()
    await expect(page.getByText('7 + 5 = ?')).toBeVisible()

    // 間違った答えを入力
    const answerInput = page.getByPlaceholder('こたえ')
    await answerInput.fill('10')
    await page.getByRole('button', { name: 'かくにん' }).click()

    // エラーメッセージが表示される
    await expect(page.getByText(/こたえが ちがいます/)).toBeVisible()

    // 正しい答えを入力
    await answerInput.fill('12')
    await page.getByRole('button', { name: 'かくにん' }).click()

    // 保護者ダッシュボードへ遷移
    await expect(page).toHaveURL('/parent/dashboard')
    await expect(page.getByRole('heading', { name: '保護者ダッシュボード' })).toBeVisible()
    await expect(page.getByText('お子さま: テストユーザーさん')).toBeVisible()

    // 学習サマリーが表示される
    await expect(page.getByText('学習サマリー')).toBeVisible()
    await expect(page.getByText('連続ログイン')).toBeVisible()

    // ホームに戻るボタンをクリック
    await page.getByRole('link', { name: 'ホームに戻る' }).click()

    // ホーム画面へ戻る
    await expect(page).toHaveURL('/')
    await expect(page.getByText('テストユーザーさん')).toBeVisible()
  })

  test('オートログイン機能の確認', async ({ page }) => {
    // 一度登録を行う
    await page.goto('/register')
    await page.getByPlaceholder('よりちゃん').fill('オートログインテスト')
    await page.getByRole('button', { name: 'ぼうけんを はじめる！' }).click()

    // ホーム画面に遷移していることを確認
    await expect(page).toHaveURL('/')
    await expect(page.getByText('オートログインテストさん')).toBeVisible()

    // 新しいページを開く（セッションCookieは保持される）
    const newPage = await page.context().newPage()
    await newPage.goto('/')

    // 自動的にログインされ、ホーム画面が表示される
    await expect(newPage).toHaveURL('/')
    await expect(newPage.getByText('オートログインテストさん')).toBeVisible()

    await newPage.close()
  })

  test('認証済みユーザーは登録ページにアクセスできない', async ({ page }) => {
    // 登録を行う
    await page.goto('/register')
    await page.getByPlaceholder('よりちゃん').fill('リダイレクトテスト')
    await page.getByRole('button', { name: 'ぼうけんを はじめる！' }).click()

    // ホーム画面に遷移
    await expect(page).toHaveURL('/')

    // 登録ページに直接アクセスしようとする
    await page.goto('/register')

    // ホーム画面にリダイレクトされる
    await expect(page).toHaveURL('/')
    await expect(page.getByText('リダイレクトテストさん')).toBeVisible()
  })

  test('保護者認証のキャンセル', async ({ page }) => {
    // 登録を行う
    await page.goto('/register')
    await page.getByPlaceholder('よりちゃん').fill('キャンセルテスト')
    await page.getByRole('button', { name: 'ぼうけんを はじめる！' }).click()

    // ホーム画面に遷移
    await expect(page).toHaveURL('/')

    // 保護者メニューをクリック
    await page.getByRole('link', { name: 'おとなメニュー' }).click()

    // 保護者認証画面が表示される
    await expect(page).toHaveURL('/parent/auth')

    // キャンセルボタンをクリック
    await page.getByRole('button', { name: 'もどる' }).click()

    // ホーム画面に戻る
    await expect(page).toHaveURL('/')
  })

  test('名前入力のバリデーション', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/register')

    const submitButton = page.getByRole('button', { name: 'ぼうけんを はじめる！' })

    // 空の名前では送信ボタンが無効
    await expect(submitButton).toBeDisabled()

    // 名前を入力すると有効になる
    await page.getByPlaceholder('よりちゃん').fill('テスト')
    await expect(submitButton).toBeEnabled()

    // 10文字を超える名前は入力できない（maxLength制約）
    await page.getByPlaceholder('よりちゃん').fill('あいうえおかきくけこさしすみせそ')
    const value = await page.getByPlaceholder('よりちゃん').inputValue()
    expect(value.length).toBeLessThanOrEqual(10)
  })
})
