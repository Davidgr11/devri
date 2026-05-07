# devri

Plataforma interna para agencia digital. Incluye landing page, portal de clientes y panel de administración.

## Stack

- Next.js 16 (App Router) + TypeScript
- Supabase (PostgreSQL + Auth + Storage)
- Stripe (Checkout, Portal, Webhooks)
- Resend (emails transaccionales)
- Tailwind CSS + Framer Motion
- Vercel (deploy)

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Desarrollo

```bash
npm install
npm run dev
```

## Rutas principales

| Ruta               | Descripción             |
| ------------------ | ----------------------- |
| `/`                | Landing page            |
| `/dashboard`       | Portal del cliente      |
| `/admin`           | Panel de administración |
| `/login` `/signup` | Autenticación           |
