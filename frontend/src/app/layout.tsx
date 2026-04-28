// Root layout - bao toàn bộ app Next.js
// File này là "shell" HTML cơ bản, chứa <html> và <body>
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'LOL Manager - Quản lý đội tuyển LMHT',
  description: 'Game quản lý đội tuyển Liên Minh Huyền Thoại',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-lol-dark text-lol-gold-light">
        <ToastProvider>
          {/* Navbar cố định phía trên */}
          <Navbar />
          {/* Nội dung chính - có padding-top để không bị Navbar che */}
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
