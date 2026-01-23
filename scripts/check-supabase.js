#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase環境変数が設定されていません')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSupabase() {
  console.log('🔍 Supabase接続チェック中...\n')

  // 1. 接続テスト
  console.log('1. 接続テスト')
  const { data: healthCheck, error: healthError } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)

  if (healthError) {
    console.log('❌ 接続失敗:', healthError.message)
    console.log('\n📝 解決方法:')
    console.log('1. Supabaseダッシュボードでプロジェクトを確認')
    console.log('2. SQL Editorで以下のSQLを実行してください:')
    console.log('\n-- profiles テーブル作成')
    console.log(`CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    login_streak INTEGER DEFAULT 0 NOT NULL,
    last_login_at TIMESTAMPTZ,
    coins INTEGER DEFAULT 0 NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);`)
    console.log('\n-- RLSを有効化')
    console.log('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;')
    console.log('\n-- すべてのユーザーが自分のプロフィールを読み書きできるポリシー')
    console.log(`CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);`)
    return false
  }

  console.log('✅ 接続成功\n')

  // 2. テーブル存在確認
  console.log('2. 必須テーブル確認')
  const requiredTables = [
    'profiles',
    'user_characters',
    'user_items',
    'game_history',
    'parent_rewards',
    'daily_missions'
  ]

  for (const table of requiredTables) {
    const { error } = await supabase.from(table).select('count').limit(1)
    if (error) {
      console.log(`❌ ${table}: 存在しない`)
    } else {
      console.log(`✅ ${table}: 存在する`)
    }
  }

  console.log('\n✨ Supabaseチェック完了')
  return true
}

checkSupabase()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((err) => {
    console.error('予期しないエラー:', err)
    process.exit(1)
  })
