# LOL Manager - Game Quản Lý Đội Tuyển LMHT

> Một trò chơi mô phỏng quản lý đội tuyển Liên Minh Huyền Thoại, xây dựng với **NestJS** (Backend) + **Next.js** (Frontend) + **PostgreSQL** (Database).

## Cấu Trúc Dự Án

```
LOL-Manager/
├── backend/          # NestJS API Server (Port 3001)
│   └── src/
│       ├── champion/ # Tướng: entity, service, controller, module
│       ├── player/   # Tuyển thủ: entity, service, controller, module
│       ├── item/     # Trang bị: entity, service, controller, module
│       ├── team/     # Đội tuyển: entity, service, controller, module
│       ├── match/    # Trận đấu: entity, service, controller, module
│       ├── tournament/ # Giải đấu: entity, service, controller, module
│       ├── transfer/ # Chuyển nhượng: entity, service, controller, module
│       ├── seed/     # Seeder: tạo dữ liệu mẫu
│       ├── app.module.ts
│       └── main.ts
├── frontend/         # Next.js Web App (Port 3000)
│   └── src/
│       ├── app/      # App Router (Next.js 14)
│       │   ├── page.tsx              # Dashboard (màn hình chính)
│       │   ├── roster/page.tsx       # Quản lý đội hình
│       │   ├── match/page.tsx        # Mô phỏng trận đấu
│       │   ├── tournament/page.tsx   # Hệ thống giải đấu
│       │   ├── transfer/page.tsx     # Thị trường chuyển nhượng
│       │   ├── champions/page.tsx    # Danh sách tướng
│       │   └── items/page.tsx        # Danh sách trang bị
│       ├── components/  # React components tái sử dụng
│       ├── lib/api.ts   # Hàm gọi API đến Backend
│       └── types/       # TypeScript types
└── docker-compose.yml
```

## Hướng Dẫn Cài Đặt & Chạy

### Bước 1: Khởi động PostgreSQL

```bash
docker compose up postgres -d
```

### Bước 2: Chạy Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

Backend chạy tại: http://localhost:3001/api

### Bước 3: Tạo Dữ Liệu Mẫu

```bash
curl -X POST http://localhost:3001/api/seed
```

### Bước 4: Chạy Frontend (Next.js)

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
npm run dev
```

Frontend chạy tại: http://localhost:3000

## Lộ Trình Phát Triển

- Phase 1: Database Schema, API CRUD, Seeder, Frontend Dashboard & Đội Hình
- Phase 2: Match Engine (mô phỏng trận đấu 5v5)
- Phase 3: Hệ thống giải đấu, lịch thi đấu
- Phase 4: Thị trường chuyển nhượng, hợp đồng ✅
- Phase 5: Tối ưu hóa, caching Redis, hoàn thiện UI/UX
- Phase 6: Dữ liệu đầy đủ và kiểm thử Alpha
