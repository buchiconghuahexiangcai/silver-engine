import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '吵架包赢 - 智能反击助手',
  description: '当被骂时，用AI帮你生成最强反击语句，让你在任何争吵中都能占据上风！',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-wechat-light min-h-screen">
        {children}
      </body>
    </html>
  )
} 