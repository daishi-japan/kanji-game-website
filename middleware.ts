import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // セッションの更新（重要: getUser() でセッションを更新）
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 認証が必要なページ
  const protectedPaths = ['/parent']

  // 現在のパスが保護されたパスかチェック
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // 登録ページと保護者認証ページは除外
  const isRegisterPage = request.nextUrl.pathname === '/register'
  const isParentAuthPage = request.nextUrl.pathname === '/parent/auth'
  const isDemoPage = request.nextUrl.pathname === '/demo'

  // 未認証ユーザーの処理（デモページは除外）
  if (!user && !isRegisterPage && !isDemoPage && request.nextUrl.pathname !== '/') {
    // 未認証で登録ページ以外にアクセスしようとした場合、登録ページへリダイレクト
    const url = request.nextUrl.clone()
    url.pathname = '/register'
    return NextResponse.redirect(url)
  }

  // 認証済みユーザーが登録ページにアクセスした場合、ホームへリダイレクト
  if (user && isRegisterPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
