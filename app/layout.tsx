import type { Metadata } from 'next'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import './globals.css'

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ['400', '500', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mplus-rounded',
})

export const metadata: Metadata = {
  title: 'あつまれ！漢字の森',
  description: '勉強を「攻略」に上書きする。7歳の小学1年生のための漢字学習ゲーム',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={mPlusRounded.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
