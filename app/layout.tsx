import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '给你的每日天气情书 ♡',
  description: '专属于你的丰城天气、穿搭建议、午餐灵感和每日情话。',
  applicationName: '给你的每日天气情书',
};

export const viewport: Viewport = { themeColor: '#fff7f5' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
