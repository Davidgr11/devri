# Guía de Configuración Rápida - Devri Solutions

## Problemas Actuales y Soluciones

### ✅ RESUELTO: Tailwind 4 Configuration
Ya he corregido la configuración de Tailwind 4:
- Eliminé el archivo `tailwind.config.ts` (conflictivo)
- Actualicé `app/globals.css` con la configuración completa en el bloque `@theme`
- Ahora usa la sintaxis correcta de Tailwind 4

### 🔧 PENDIENTE: Configuración de Supabase

## Paso 1: Configurar Variables de Entorno

### Respuesta a tu pregunta: ¿Anon Key o Publishable Key?

**Usa el ANON KEY** ✅

El término "publishable key" es antiguo/legacy. Supabase ahora usa:
- **anon key** (público) - Para uso en el cliente
- **service_role key** (privado) - Solo para servidor

### Instrucciones:

1. Ve a tu proyecto en Supabase: https://app.supabase.com/project/_/settings/api

2. Copia el **Project URL** y el **anon public** key

3. Crea el archivo `.env.local` en la raíz del proyecto:

```bash
# Copia el archivo de ejemplo
cp .env.local.example .env.local
```

4. Edita `.env.local` y reemplaza con tus valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Paso 2: Ejecutar Migraciones de Supabase

El error "infinite recursion detected in policy" se debe a que las tablas aún no existen o las políticas RLS tienen problemas.

### Instrucciones:

1. Ve al **SQL Editor** en Supabase: https://app.supabase.com/project/_/sql

2. Ejecuta **en orden** estos archivos:

   **a) Primera migración - Schema inicial:**
   - Abre el archivo: `supabase/migrations/001_initial_schema.sql`
   - Copia TODO el contenido
   - Pégalo en el SQL Editor
   - Haz clic en **RUN** o presiona `Ctrl + Enter`

   **b) Segunda migración - Fix RLS Policies:**
   - Abre el archivo: `supabase/migrations/002_fix_rls_policies.sql`
   - Copia TODO el contenido
   - Pégalo en el SQL Editor
   - Haz clic en **RUN** o presiona `Ctrl + Enter`

3. Verifica que las tablas se crearon correctamente:
   - Ve a **Table Editor** en Supabase
   - Deberías ver las siguientes tablas:
     - `user_profiles`
     - `user_roles`
     - `service_categories`
     - `subscription_plans`
     - `subscriptions`
     - `faqs`
     - `testimonials`
     - `client_logos`
     - `client_websites`
     - `contact_forms`
     - `site_config`

## Paso 3: Poblar Datos Iniciales (Seeder)

Una vez que las tablas existan, pobla los datos de demostración:

1. Abre el archivo: `supabase/seeds/initial_data.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **RUN**

Esto creará:
- 6 categorías de servicios (3 primarias + 3 secundarias)
- 3 planes de suscripción (Básico, Profesional, Empresarial)
- 8 preguntas frecuentes
- 6 testimonios
- 6 logos de clientes de ejemplo

## Paso 4: Reiniciar el Servidor de Desarrollo

Después de configurar `.env.local`, reinicia el servidor:

```bash
# Detén el servidor actual (Ctrl + C)
# Luego inicia de nuevo:
npm run dev
```

## Verificación

Si todo está correcto, deberías ver:

✅ Estilos de Tailwind renderizando correctamente (paddings, margins, colores)
✅ Contenido de Supabase cargando en la landing page:
  - Categorías de servicios en la sección "Servicios"
  - Preguntas frecuentes en la sección "FAQs"
  - Testimonios (si los agregaste)
  - Logos de clientes (si los agregaste)

❌ Sin errores en la consola del navegador
❌ Sin errores 500 de Supabase

## Problemas Comunes

### Error: "relation does not exist"
- Ejecuta la migración `001_initial_schema.sql` primero

### Error: "infinite recursion detected in policy"
- Ejecuta la migración `002_fix_rls_policies.sql`

### Error: "Invalid API key"
- Verifica que estés usando el **anon key** correcto de Supabase
- Asegúrate de que la variable se llame `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Los estilos no cargan
- Ya está resuelto - eliminé el `tailwind.config.ts` conflictivo
- Si persiste, ejecuta: `npm run dev` (reinicia el servidor)

### No aparece contenido de Supabase
- Ejecuta las migraciones en orden (paso 2)
- Ejecuta el seeder (paso 3)
- Verifica que el anon key sea correcto en `.env.local`

## Siguiente Paso (Opcional)

Una vez que todo funcione, puedes configurar:

### Stripe (para pagos):
1. Crea cuenta en https://stripe.com
2. Obtén las API keys de https://dashboard.stripe.com/apikeys
3. Agrégalas a `.env.local`
4. Actualiza los Price IDs en Supabase (tabla `subscription_plans`)

### Resend (para emails):
1. Crea cuenta en https://resend.com
2. Obtén la API key de https://resend.com/api-keys
3. Agrégala a `.env.local`

### PWA Icons:
Genera íconos para el PWA en los siguientes tamaños y colócalos en `/public/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Puedes usar herramientas como:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

## Resumen de Cambios Realizados

✅ Configuración de Tailwind 4 corregida (CSS-first approach)
✅ Eliminado archivo `tailwind.config.ts` conflictivo
✅ Actualizado `globals.css` con @theme block completo
✅ Creada migración `002_fix_rls_policies.sql` para resolver RLS recursion
✅ Queries de Supabase actualizadas para retornar arrays vacíos en caso de error
✅ Creado `.env.local.example` con instrucciones claras
✅ Creada esta guía de configuración

---

**¿Necesitas ayuda?** Revisa el README.md para más detalles sobre la arquitectura y configuración.
