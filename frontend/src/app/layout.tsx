import type { Metadata } from 'next'
import "./globals.css";
import UmamiProvider from 'next-umami'
import PlausibleProvider from 'next-plausible'
import Footer from './components/footer'
export const metadata: Metadata = {
  title: 'AI 动漫头像魔法师 - 一键生成宫崎骏风格头像',
  description: '全球首个基于分布式家用闲置算力的 AI 头像生成服务，让你的头像变成宫崎骏风格的动漫形象',
  keywords: ['AI', '动漫头像', '宫崎骏', '头像生成', '人工智能'],
}
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <UmamiProvider websiteId="c2d8637c-80ce-4cab-9f25-a50a20bf8dca" />
        <PlausibleProvider customDomain="https://nplausible.zeabur.app" domain="hadoop.nexmoe.com" />
      </head>
      <body>
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-FK70D44KLQ" />
    </html>
  )
}
