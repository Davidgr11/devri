# Devri Solutions - Plataforma Web Completa

Plataforma profesional para agencia de desarrollo web con portal de clientes, panel de administración, sistema de suscripciones Stripe, y más.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Guía de Uso](#guía-de-uso)
- [Deployment](#deployment)
- [PWA](#pwa)
- [SEO](#seo)
- [Troubleshooting](#troubleshooting)

## ✨ Características

### Landing Page
- Hero con video de fondo
- Carrusel de logos de clientes
- **Sección de servicios con tabs multinivel** (categorías principales y subcategorías)
- Sección "Por qué elegirnos" con video, testimonios y timeline
- Acordeón de FAQs
- Formulario de contacto wizard (paso a paso)
- Totalmente responsive y mobile-first

### Portal de Clientes
- Dashboard con estadísticas y estado del proyecto
- Vista de suscripción con integración Stripe Customer Portal
- Información del sitio web (cuando esté publicado)
- Perfil editable
- Onboarding wizard para nuevos usuarios

### Panel de Administración
- Dashboard con KPIs (clientes, suscripciones, ingresos)
- Gestión de clientes
- Gestión de suscripciones
- Gestión de formularios de contacto
- CRUD completo de contenido (servicios, FAQs, testimonios, logos)
- Configuración del sitio (contacto, redes sociales, SEO)

### Características Técnicas
- Autenticación completa con Supabase Auth
- RLS (Row Level Security) en todas las tablas
- Integración Stripe (Checkout, Portal, Webhooks)
- Sistema de emails con Resend
- PWA con manifest y service worker
- SEO optimizado (metadata, sitemap, robots.txt)
- Validaciones con Zod en todos los formularios
- Animaciones con Framer Motion
- Sistema de temas configurable

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe (Hosted Checkout)
- **Emails**: Resend
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Validaciones**: Zod + React Hook Form
- **State Management**: React Query (TanStack Query)
- **Deployment**: Vercel

## 📦 Requisitos Previos

- Node.js 18+ y npm/yarn/pnpm
- Cuenta de Supabase
- Cuenta de Stripe
- Cuenta de Resend
- Cuenta de Vercel (para deployment)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd devri
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales (ver sección [Configuración](#configuración))

4. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=contacto@devrisolutions.com
NEXT_PUBLIC_CONTACT_PHONE=5512345678
NEXT_PUBLIC_CONTACT_WHATSAPP=5215512345678

# Social Media
NEXT_PUBLIC_SOCIAL_FACEBOOK=https://facebook.com/devrisolutions
NEXT_PUBLIC_SOCIAL_INSTAGRAM=https://instagram.com/devrisolutions
NEXT_PUBLIC_SOCIAL_TWITTER=https://twitter.com/devrisolutions
NEXT_PUBLIC_SOCIAL_LINKEDIN=https://linkedin.com/company/devrisolutions
```

### 2. Supabase

1. **Crear Proyecto**: Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. **Ejecutar Migraciones**: En el SQL Editor de Supabase, ejecuta el contenido de `supabase/migrations/001_initial_schema.sql`
3. **Ejecutar Seeder**: Ejecuta el contenido de `supabase/seeds/initial_data.sql` para crear datos iniciales
4. **Crear Usuario Admin**:
   - Crea un usuario desde el dashboard de Supabase (Authentication > Users)
   - Email: admin@devrisolutions.com
   - Password: [tu-password-seguro]
   - Ejecuta este SQL reemplazando `uuid-del-usuario` con el UUID del usuario creado:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('uuid-del-usuario', 'admin');
```

### 3. Stripe

1. **Crear Cuenta**: Regístrate en [stripe.com](https://stripe.com)
2. **Crear Productos**: En el dashboard de Stripe, crea 3 productos con precios recurrentes:
   - Plan Básico: $350 MXN/mes
   - Plan Medio: $750 MXN/mes
   - Plan Avanzado: $1,150 MXN/mes
3. **Actualizar Price IDs**: Copia los Price IDs (empiezan con `price_...`) y actualiza la tabla `subscription_plans` en Supabase:

```sql
UPDATE subscription_plans
SET stripe_price_id = 'price_XXXXXXXX'
WHERE name = 'Plan Básico';
-- Repite para los otros planes
```

4. **Configurar Webhook**:
   - En Stripe Dashboard, ve a Developers > Webhooks
   - Agrega endpoint: `https://tu-dominio.com/api/stripe/webhook`
   - Selecciona eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copia el Signing secret y agrégalo a `.env.local` como `STRIPE_WEBHOOK_SECRET`

**Para desarrollo local**, usa Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. Resend

1. **Crear Cuenta**: Regístrate en [resend.com](https://resend.com)
2. **Crear API Key**: Crea una API Key y agrégala a `.env.local`
3. **Configurar Dominio** (Producción): Agrega y verifica tu dominio en Resend

## 📁 Estructura del Proyecto

```
devri/
├── app/
│   ├── (admin)/              # Panel de administración
│   ├── (auth)/               # Login, Signup, Reset Password
│   ├── (dashboard)/          # Portal de clientes
│   ├── (marketing)/          # Landing page
│   ├── api/stripe/           # Stripe API routes
│   ├── layout.tsx            # Root layout con metadata
│   ├── sitemap.ts            # Sitemap dinámico
│   └── robots.ts             # Robots.txt
├── components/
│   ├── marketing/            # Componentes de landing
│   ├── shared/               # Navbar, Footer, WhatsApp
│   └── ui/                   # Componentes UI base
├── config/
│   └── theme.ts              # Sistema de colores
├── hooks/
│   └── useUser.ts            # Hook de autenticación
├── lib/
│   ├── supabase/             # Cliente y queries
│   ├── stripe/               # Cliente Stripe
│   ├── resend/               # Cliente Resend
│   ├── validations/          # Esquemas Zod
│   └── utils.ts              # Utilidades
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── supabase/
│   ├── migrations/           # Migraciones SQL
│   └── seeds/                # Datos iniciales
└── types/                    # TypeScript types
```

## 📜 Scripts Disponibles

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build para producción
npm run start            # Servidor de producción
npm run lint             # Ejecutar ESLint
```

## 📖 Guía de Uso

### Flujo de Usuario Cliente

1. Registro en `/signup`
2. Onboarding wizard en `/onboarding`
3. Dashboard en `/dashboard`
4. Gestión de suscripción en `/dashboard/subscription`
5. Información del sitio en `/dashboard/website`
6. Edición de perfil en `/dashboard/profile`

### Flujo de Administrador

1. Login en `/login` con cuenta admin
2. Dashboard admin en `/admin`
3. Gestión de clientes en `/admin/clients`
4. Gestión de suscripciones en `/admin/subscriptions`
5. Formularios de contacto en `/admin/contact-forms`
6. Gestión de contenido en `/admin/content/*`
7. Configuración en `/admin/settings`

## 🚢 Deployment

### Vercel (Recomendado)

1. **Conectar Repositorio**: Push tu código a GitHub/GitLab/Bitbucket e importa en [vercel.com](https://vercel.com)
2. **Configurar Variables**: Agrega todas las variables de `.env.local` en Vercel
   - **IMPORTANTE**: Cambia `NEXT_PUBLIC_SITE_URL` a tu dominio de producción
3. **Deploy**: Vercel detectará Next.js automáticamente
4. **Dominio Personalizado**: En Settings > Domains, agrega tu dominio
5. **Actualizar Stripe Webhook**: Cambia la URL del webhook en Stripe a `https://tu-dominio.com/api/stripe/webhook`

## 📱 PWA

La aplicación está configurada como PWA:
- **Manifest**: `/public/manifest.json`
- **Service Worker**: `/public/sw.js`
- **Icons**: Genera íconos PWA en `/public/icons/` (tamaños: 72, 96, 128, 144, 152, 192, 384, 512px)

Para generar íconos desde un logo:
```bash
npx pwa-asset-generator tu-logo.svg public/icons --icon-only --type png
```

## 🔍 SEO

- **Metadata**: Configurado en `app/layout.tsx`
- **Sitemap**: Generado en `app/sitemap.ts` → `/sitemap.xml`
- **Robots**: Generado en `app/robots.ts` → `/robots.txt`
- **Open Graph**: Configurado para redes sociales
- **Twitter Cards**: Configurado para Twitter/X

## 🐛 Troubleshooting

### Error de autenticación
- Verifica credenciales de Supabase en `.env.local`
- Asegúrate de que RLS esté habilitado
- Reinicia el servidor de desarrollo

### Stripe webhook falla
- Verifica `STRIPE_WEBHOOK_SECRET`
- En local, usa Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Emails no se envían
- Verifica API key de Resend
- En desarrollo, Resend solo envía a emails verificados
- Para producción, configura tu dominio en Resend

### Estilos no se aplican
- Verifica que Tailwind esté correctamente configurado
- Limpia la caché: `rm -rf .next && npm run dev`

## 📝 Notas Adicionales

### Sistema de Temas
Los colores se configuran en `config/theme.ts`. Para cambiar el color principal, modifica el valor del accent en ese archivo.

### Validaciones
Todos los formularios usan Zod. Los esquemas están en `lib/validations/schemas.ts`.

### Consultas de BD
Las funciones reutilizables de Supabase están en `lib/supabase/queries.ts`.

## 📄 Licencia

Copyright © 2025 Devri Solutions. Todos los derechos reservados.

## 📞 Soporte

- Email: contacto@devrisolutions.com
- WhatsApp: +52 1 55 1234 5678

---

**Hecho con ❤️ por Devri Solutions**
