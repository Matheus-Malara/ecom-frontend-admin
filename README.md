# Ecom Frontend Admin

Admin dashboard (learning project) for managing an e-commerce: products, brands, categories, orders and users.  
Built with React + TypeScript + Vite + TailwindCSS.

⚠️ **Educational only** — not production-ready.

## 📌 Description

This frontend provides an admin interface secured by authentication.  
Only users with `ROLE_ADMIN` (from Keycloak) can access the dashboard.

You can:
- Manage Products (CRUD, images, pagination & filters)
- Manage Brands and Categories (CRUD, images, pagination & filters)
- Track Orders and update status
- List Users and activate/deactivate

It communicates with a Spring Boot backend and uses Keycloak for auth.

## 🧰 Tech Stack
- React + TypeScript + Vite
- TailwindCSS
- Axios (HTTP)
- React Router
- Zustand (state)
- React Toastify (toasts)
- Framer Motion (animations)
- lucide-react (icons)

## 🚀 Getting Started

1) Clone the repository

```bash
git clone https://github.com/Matheus-Malara/ecom-frontend-admin.git
cd ecom-frontend-admin
```

2) Install dependencies

```bash
npm install
```

3) Run locally
```bash  
npm run dev
```

Backend must be running at `http://localhost:8081` and Keycloak must be configured locally (see Authentication).  
Use `npm run preview` after building to test a production build locally.

## 🔧 NPM Scripts
- `dev` – start Vite dev server
- `build` – type-check and build production bundle
- `preview` – preview the built app

## ⚙️ Project Structure

```
src/
├─ components/     # Reusable UI pieces (forms, tables, modals, etc.)
├─ hooks/          # Custom React hooks (data fetching, auth helpers, etc.)
├─ layouts/        # App shell / sidebar / header wrappers
├─ pages/          # Route-level pages (Products, Brands, Categories, Orders, Users, Auth)
├─ services/       # API clients, HTTP interceptors, domain services
├─ stores/         # Zustand stores (auth, toasts, UI state)
├─ types/          # Shared TypeScript types/interfaces
├─ App.tsx         # Routes and top-level layout
├─ main.tsx        # App entry point
├─ index.css       # Tailwind base styles
└─ App.css         # Component-scoped/global overrides when needed
```

---


## 🔐 Authentication
Login is performed via backend endpoints (the app does not talk to Keycloak directly).

You must:
- Run Keycloak locally
- Create an admin user (`ROLE_ADMIN`) that the backend recognizes

The backend handles token issuance/refresh and protects the APIs this UI consumes.

No `.env` is required here; the API base is `http://localhost:8081`.  
If you need a different URL, adjust the API client inside `src/services/`.

## 💡 Features
- Protected routes (`ROLE_ADMIN`)
- Products: CRUD, image upload, pagination & filters
- Brands/Categories: CRUD, image upload, pagination & filters
- Orders: list + status updates
- Users: list + activation toggle
- Global toasts, loading and error handling
- Modern, responsive UI with Tailwind

## 🧠 Learning Goals
Practice modern React with TypeScript, protected routing, API integration, token flows via backend, global state with Zustand, and a clean UI with Tailwind.

## 🌐 Related Projects
- Backend (Spring Boot): [ecom-backend](https://github.com/Matheus-Malara/ecom-backend)
- Store Frontend: [ecom-frontend](https://github.com/Matheus-Malara/ecom-frontend)

## ✅ Prerequisites
- Node.js (LTS recommended)
- Running backend at `http://localhost:8081`
- Local Keycloak instance configured with an ADMIN user recognized by the backend

## 📄 License
No license — educational use only.
