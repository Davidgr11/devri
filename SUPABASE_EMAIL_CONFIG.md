# Configuración de Email Verification en Supabase

Este documento explica cómo configurar las URLs de redirección para que los correos de verificación de Supabase apunten a tu dominio de producción (devri.com.mx) en lugar de localhost.

## Problema

Actualmente, cuando un usuario se registra:
1. ✅ El usuario recibe un correo de verificación
2. ❌ El enlace del correo apunta a `localhost:3000` en lugar de `devri.com.mx`
3. ❌ Esto causa problemas en producción

## Solución

### 1. Configurar las URLs de Redirección en Supabase Dashboard

1. **Accede al Dashboard de Supabase**:
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto

2. **Navega a Authentication Settings**:
   - En el menú lateral, ve a `Authentication` → `URL Configuration`

3. **Configura las URLs**:

   **Site URL** (URL principal del sitio):
   ```
   https://devri.com.mx
   ```

   **Redirect URLs** (URLs permitidas para redirección):
   ```
   https://devri.com.mx/auth/callback
   https://devri.com.mx/dashboard
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   ```

   > **Nota**: Mantén localhost para desarrollo local

4. **Guarda los cambios**

### 2. Configurar Email Templates (Opcional pero Recomendado)

1. **Ve a Authentication → Email Templates**

2. **Edita el template "Confirm signup"**:

   Busca la línea que contiene `{{ .ConfirmationURL }}` y asegúrate de que esté usando la URL correcta.

   El template por defecto debería verse así:
   ```html
   <h2>Confirma tu email</h2>
   <p>Sigue este enlace para confirmar tu cuenta:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirmar mi email</a></p>
   ```

   Puedes personalizar este template con tu branding si lo deseas.

### 3. Configurar Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga las variables correctas:

**Para desarrollo local**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Para producción** (en Vercel/hosting):
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SITE_URL=https://devri.com.mx
```

### 4. Verificar la Configuración

1. **En desarrollo local**:
   - Regístrate con un nuevo email
   - Verifica que recibas el correo
   - El enlace debería apuntar a `localhost:3000/auth/callback`

2. **En producción**:
   - Regístrate con un nuevo email
   - Verifica que recibas el correo
   - El enlace debería apuntar a `https://devri.com.mx/auth/callback`

## Flujo Completo de Verificación

### Después de la configuración:

1. Usuario se registra → Ve el mensaje "¡Revisa tu correo!"
2. Usuario recibe email de verificación
3. Usuario hace clic en el enlace de verificación
4. Supabase redirige a `https://devri.com.mx/auth/callback?code=xxx`
5. El callback procesa el código y verifica la cuenta
6. Usuario es redirigido al dashboard con sesión activa

## Troubleshooting

### El enlace sigue apuntando a localhost

**Solución**: Limpia la caché de Supabase:
1. Ve a Authentication → Settings
2. Guarda de nuevo la configuración de URLs
3. Espera 5-10 minutos para que se propague

### Error "Invalid redirect URL"

**Solución**: Asegúrate de que la URL esté en la lista de Redirect URLs:
1. Ve a Authentication → URL Configuration
2. Agrega la URL exacta a la lista
3. Incluye tanto HTTP como HTTPS si es necesario

### El callback no funciona

**Solución**: Verifica que:
1. La ruta `/auth/callback/route.ts` exista
2. El archivo esté en la ubicación correcta: `app/auth/callback/route.ts`
3. No haya errores en los logs del servidor

## Comandos Útiles

**Ver logs del servidor**:
```bash
npm run dev
```

**Limpiar caché de Next.js**:
```bash
rm -rf .next
npm run dev
```

## Recursos Adicionales

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo.
