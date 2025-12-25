# Digital Store 🛒

Website jualan produk digital (Hosting, VPS, Pterodactyl, Game Topup) dengan tech stack modern.

## 🎨 Theme: Cyber Marine
- **Primary**: Slate-900 (Hitam pekat kebiruan)
- **Secondary**: Slate-800 (Card/Container)
- **Accent**: Cyan-500 / Emerald-500 (Buttons, Highlights)
- **Text**: Slate-200 (Soft white)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Shadcn UI |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL + Prisma |
| Container | Docker + Docker Compose |
| Auth | JWT |

## 📁 Project Structure

```
digital-store/
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # UI Components
│   │   │   ├── ui/        # Shadcn components
│   │   │   └── skeletons/ # Skeleton loaders
│   │   ├── lib/           # Utils & helpers
│   │   └── types/         # TypeScript types
│   └── Dockerfile
├── server/                 # Backend (Express)
│   ├── src/
│   │   ├── config/        # Environment config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, validation
│   │   ├── routes/        # API endpoints
│   │   └── services/      # External integrations
│   ├── prisma/            # Database schema
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### Development

```bash
# Clone repository
git clone https://github.com/NinoNeoxus/digital-store.git
cd digital-store

# Copy environment variables
cp .env.example .env

# Start all services with Docker
docker compose up -d

# Or run locally for development
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

## 📦 Features

### Core
- [x] User Authentication (Register/Login)
- [x] Product Catalog with Categories
- [x] Shopping Cart & Checkout
- [x] Order Management
- [x] Admin Dashboard

### Products Supported
- **Automated Delivery**: VPS, Pterodactyl Servers (via API)
- **Manual/Stock Delivery**: Game Accounts, License Keys, Diamond Topup

### Integrations
- [ ] Payment Gateway (Tripay/Midtrans)
- [ ] Pterodactyl API
- [ ] DigitalOcean API
- [ ] Email Notifications

## 🔧 Environment Variables

See `.env.example` for all required variables.

## 📜 License

Private - All rights reserved.
