'use client';
// 'use client' vì component này dùng React hooks (useState) - chạy trên client

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Danh sách các menu điều hướng
const navItems = [
  { href: '/', label: '🏠 Dashboard', title: 'Màn hình chính' },
  { href: '/roster', label: '⚔️ Đội Hình', title: 'Quản lý tuyển thủ' },
  { href: '/champions', label: '🐉 Tướng', title: 'Danh sách tướng' },
  { href: '/items', label: '🗡️ Trang Bị', title: 'Danh sách trang bị' },
];

export default function Navbar() {
  // usePathname() trả về đường dẫn hiện tại để highlight menu đang active
  const pathname = usePathname();
  // State để toggle menu mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // fixed: cố định trên cùng | z-50: đảm bảo nằm trên tất cả content
    <nav className="fixed top-0 left-0 right-0 z-50 bg-lol-panel border-b border-lol-border">
      {/* Container giới hạn chiều rộng và căn giữa */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* flex items-center: căn dọc giữa | h-16: chiều cao navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo bên trái */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-lol-gold font-bold text-xl tracking-wider">
              LOL MANAGER
            </span>
          </Link>

          {/* Menu desktop - hidden trên mobile, flex trên màn md trở lên */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              // Kiểm tra xem đây có phải trang đang xem không
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${isActive
                      // Active: nền vàng mờ, chữ vàng
                      ? 'bg-lol-gold/20 text-lol-gold border border-lol-gold/40'
                      // Không active: chữ nhạt, hover làm sáng hơn
                      : 'text-gray-400 hover:text-lol-gold-light hover:bg-white/5'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Nút hamburger trên mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-lol-gold p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {/* Icon 3 gạch ngang */}
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-current"></span>
              <span className="block w-6 h-0.5 bg-current"></span>
              <span className="block w-6 h-0.5 bg-current"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Menu mobile - hiện khi mobileOpen = true */}
      {mobileOpen && (
        <div className="md:hidden bg-lol-panel border-t border-lol-border px-4 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  block px-4 py-3 rounded-md text-sm font-medium mb-1
                  ${isActive
                    ? 'bg-lol-gold/20 text-lol-gold'
                    : 'text-gray-400 hover:text-lol-gold-light hover:bg-white/5'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
