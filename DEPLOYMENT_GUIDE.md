# 🚀 Guía Completa de Deployment - DEVRI

Esta guía te llevará paso a paso desde GitHub hasta tener tu proyecto en producción con SEO optimizado.

---

## 📋 Tabla de Contenidos
1. [Preparar el proyecto](#1-preparar-el-proyecto)
2. [Subir a GitHub](#2-subir-a-github)
3. [Configurar Supabase en producción](#3-configurar-supabase-en-producción)
4. [Deploy en Vercel](#4-deploy-en-vercel)
5. [Configurar SEO](#5-configurar-seo)
6. [Control de indexación](#6-control-de-indexación)

---

## 1️⃣ Preparar el proyecto

### ✅ Verificar que NO se suban archivos sensibles

El `.gitignore` ya está configurado correctamente para excluir:
- ❌ `.env.local` (variables de entorno)
- ❌ `node_modules/`
- ❌ `.next/` (archivos de build)
- ❌ Archivos temporales

**IMPORTANTE**: Nunca subas estos archivos:
```bash
.env.local          # ⚠️ Contiene tus secretos
.env.production     # ⚠️ Contiene secrets de producción
node_modules/       # No necesario (se instala con npm install)
.next/              # Se genera en cada build
```

### ✅ Crear archivo de ejemplo para variables de entorno

Ya tienes `.env.local.example` que documenta qué variables necesitas. ✅

### ✅ Eliminar scripts temporales

```bash
# Elimina archivos temporales que creamos durante desarrollo
rm scripts/fix-customer-id.sql 2>/dev/null || true
```

---

## 2️⃣ Subir a GitHub

### Paso 1: Inicializar Git (si no está inicializado)

```bash
# Verifica si ya es un repositorio git
git status

# Si NO es un repo, inicialízalo:
git init
```

### Paso 2: Agregar todos los archivos

```bash
# Agregar TODOS los archivos (el .gitignore filtrará automáticamente)
git add .

# Verifica qué se va a subir
git status
```

### Paso 3: Crear el primer commit

```bash
git commit -m "Initial commit: DEVRI platform with Stripe integration and admin dashboard"
```

### Paso 4: Crear repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Click en **"New repository"** (botón verde)
3. Configura:
   - **Repository name**: `devri` (o el nombre que prefieras)
   - **Description**: "Plataforma DEVRI - Desarrollo web con suscripciones"
   - **Visibility**:
     - ✅ **Private** (recomendado para código de negocio)
     - ⚠️ Public (solo si quieres que sea open source)
   - ❌ **NO** marques "Add README" (ya tienes archivos)
   - ❌ **NO** marques "Add .gitignore" (ya tienes uno)

4. Click **"Create repository"**

### Paso 5: Conectar tu repo local con GitHub

```bash
# Reemplaza YOUR-USERNAME y YOUR-REPO con tus datos
git remote add origin https://github.com/YOUR-USERNAME/devri.git

# Verifica la conexión
git remote -v
```

### Paso 6: Subir el código

```bash
# Primera vez (crea la rama main y sube)
git branch -M main
git push -u origin main

# Futuros pushes (solo):
git push
```

---

## 3️⃣ Configurar Supabase en Producción

### Opción A: Usar el mismo proyecto de Supabase

Si vas a usar el mismo proyecto de Supabase que en desarrollo:
- ✅ Ya tienes las tablas creadas
- ✅ Ya tienes los datos de prueba
- ✅ Solo necesitas las mismas credenciales en Vercel

### Opción B: Crear proyecto nuevo de producción (Recomendado)

1. Ve a [supabase.com](https://supabase.com)
2. Click **"New project"**
3. Configura:
   - **Name**: `devri-production`
   - **Database Password**: (guárdala en lugar seguro)
   - **Region**: `South America (São Paulo)` (más cercano a México)

4. **Espera** a que se cree el proyecto (2-3 minutos)

5. **Ejecuta las migraciones**:
   - Ve a **SQL Editor** en Supabase Dashboard
   - Copia y ejecuta en orden:
     1. `supabase/migrations/001_initial_schema.sql`
     2. `supabase/migrations/002_fix_rls_policies.sql`
     3. `supabase/migrations/003_fix_rls_recursion_complete.sql`
     4. `supabase/migrations/004_update_stripe_price_ids.sql`
     5. `supabase/migrations/005_add_subscription_custom_fields.sql`

6. **Ejecuta los seeds**:
   - Copia y ejecuta: `supabase/seeds/initial_data.sql`

7. **Obtén las credenciales**:
   - Ve a **Settings** → **API**
   - Copia:
     - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
     - `anon/public key` (NEXT_PUBLIC_SUPABASE_ANON_KEY)
     - `service_role key` (SUPABASE_SERVICE_ROLE_KEY) ⚠️ Secreto

---

## 4️⃣ Deploy en Vercel

### Paso 1: Importar desde GitHub

1. Ve a [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Selecciona tu repositorio `devri`
5. Click **"Import"**

### Paso 2: Configurar variables de entorno

En la pantalla de configuración, ve a **Environment Variables** y agrega:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key_aqui

# Site URL (se actualizará después del deploy)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app

# Stripe (modo producción)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend (email)
RESEND_API_KEY=re_xxx

# Contact
NEXT_PUBLIC_CONTACT_ADDRESS=tu_direccion
NEXT_PUBLIC_CONTACT_EMAIL=hola@tudominio.com
NEXT_PUBLIC_CONTACT_PHONE=+52_tu_telefono
NEXT_PUBLIC_WHATSAPP_NUMBER=tu_numero_whatsapp
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hola! Me interesa conocer más
```

⚠️ **IMPORTANTE**:
- Usa las keys de **PRODUCCIÓN** de Stripe (`pk_live_` y `sk_live_`)
- NO uses las de test (`pk_test_`, `sk_test_`)

### Paso 3: Deploy

1. Click **"Deploy"**
2. Espera 2-3 minutos
3. ✅ Tu sitio estará en: `https://devri-xxx.vercel.app`

### Paso 4: Configurar dominio personalizado (Opcional)

1. En Vercel Dashboard, ve a tu proyecto
2. Click **"Settings"** → **"Domains"**
3. Agrega tu dominio: `devri.com`
4. Sigue las instrucciones para configurar DNS

### Paso 5: Actualizar SITE_URL

1. Copia tu URL final de Vercel (ej: `https://devri.vercel.app`)
2. Ve a **Settings** → **Environment Variables**
3. Actualiza:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_APP_URL`
4. Click **"Redeploy"** para aplicar cambios

### Paso 6: Configurar Webhook de Stripe

1. Ve a [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Configura:
   - **Endpoint URL**: `https://tu-dominio.vercel.app/api/stripe/webhook`
   - **Events**:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Copia el **Signing secret** (`whsec_xxx`)
5. Actualiza `STRIPE_WEBHOOK_SECRET` en Vercel
6. Redeploy

---

## 5️⃣ Configurar SEO

### Ya implementado en el proyecto ✅

Tu `app/layout.tsx` ya tiene configurado:
- ✅ Title optimizado
- ✅ Meta description
- ✅ Keywords relevantes
- ✅ Open Graph (redes sociales)
- ✅ Twitter Cards
- ✅ Canonical URLs

### Archivos de SEO importantes

#### `app/robots.ts`
Ya configurado para controlar qué rastrean los bots.

#### `app/sitemap.ts`
Ya configurado para generar el sitemap automáticamente.

### Mejoras adicionales de SEO:

1. **Agregar Google Search Console**:
   ```bash
   # Verifica tu sitio en:
   https://search.google.com/search-console
   ```

2. **Agregar Google Analytics** (opcional):
   - Crea cuenta en [analytics.google.com](https://analytics.google.com)
   - Agrega el tracking code a `app/layout.tsx`

3. **Velocidad del sitio**:
   - Tu sitio ya usa Next.js 14 que es muy rápido ✅
   - Imágenes optimizadas con next/image ✅
   - Usa Vercel Edge Network ✅

---

## 6️⃣ Control de Indexación

### Páginas que SÍ deben indexarse (públicas)

Estas páginas ya están configuradas para indexarse:
- ✅ `/` (Home)
- ✅ `/servicios` (Servicios)
- ✅ `/nosotros` (Nosotros)
- ✅ `/precios` (Precios - si existe)

### Páginas que NO deben indexarse (privadas)

Voy a actualizar para que estas NO se indexen:
- ❌ `/dashboard/*` (Dashboard de cliente)
- ❌ `/admin/*` (Panel de administración)
- ❌ `/auth/*` (Login/Signup)
- ❌ `/onboarding` (Onboarding)

#### Implementación:

Crea `app/(dashboard)/layout.tsx`:
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

Crea `app/(admin)/layout.tsx`:
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

Crea `app/(auth)/layout.tsx`:
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

### Actualizar robots.txt

Tu `app/robots.ts` debería tener:
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/auth/',
          '/onboarding/',
          '/api/',
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
```

---

## 🎯 Checklist Final

Antes de considerar el deploy completado, verifica:

### Pre-deployment
- [ ] `.env.local` está en `.gitignore`
- [ ] No hay secretos hardcodeados en el código
- [ ] Todos los scripts temporales eliminados
- [ ] README actualizado con instrucciones

### GitHub
- [ ] Código subido a GitHub
- [ ] Repositorio configurado como Private (o Public si lo prefieres)
- [ ] `.env.local.example` incluido

### Supabase
- [ ] Proyecto de producción creado
- [ ] Todas las migraciones ejecutadas
- [ ] Seeds ejecutados (opcional)
- [ ] RLS políticas verificadas

### Vercel
- [ ] Proyecto deployado
- [ ] Variables de entorno configuradas
- [ ] SITE_URL actualizada
- [ ] Dominio personalizado configurado (opcional)
- [ ] Build exitoso (sin errores)

### Stripe
- [ ] Webhook configurado apuntando a producción
- [ ] STRIPE_WEBHOOK_SECRET actualizado
- [ ] Keys de producción (`pk_live_`, `sk_live_`) configuradas
- [ ] Precios de planes actualizados en base de datos

### SEO
- [ ] Layouts de rutas privadas con `robots: false`
- [ ] Google Search Console verificado
- [ ] Sitemap accesible en `/sitemap.xml`
- [ ] Robots.txt accesible en `/robots.txt`
- [ ] Meta tags verificados

### Testing
- [ ] Probar signup de usuario
- [ ] Probar checkout de Stripe en producción
- [ ] Probar webhook de Stripe
- [ ] Probar login de admin
- [ ] Verificar que páginas privadas no se indexen

---

## 🚨 Troubleshooting

### Error: "Build failed"
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel

### Error: "Database connection failed"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` sea correcto
- Verifica que `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea correcto

### Error: "Stripe webhook failed"
- Verifica que `STRIPE_WEBHOOK_SECRET` sea el de producción
- Verifica que el endpoint esté accesible públicamente

### No aparece en Google
- Espera 2-7 días después del deploy
- Verifica en Google Search Console
- Asegúrate de que `robots.txt` permita el rastreo

---

## 📚 Recursos Útiles

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Google Search Console](https://search.google.com/search-console)

---

## ✅ ¡Listo!

Tu proyecto está en producción. Monitorea:
- Vercel Dashboard para analytics
- Stripe Dashboard para pagos
- Supabase Dashboard para base de datos
- Google Search Console para SEO

**¡Felicidades!** 🎉
