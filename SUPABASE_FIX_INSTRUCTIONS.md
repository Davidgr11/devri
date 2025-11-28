# Cómo Solucionar el Error de Recursión Infinita en Supabase

## El Problema

Estás viendo este error:
```
infinite recursion detected in policy for relation "user_roles"
```

Esto ocurre porque las políticas RLS (Row Level Security) en Supabase están causando recursión infinita al intentar verificar permisos de admin consultando la tabla `user_roles` dentro de políticas que también pertenecen a `user_roles`.

## La Solución

He creado una migración que elimina todas las políticas problemáticas y las reemplaza con políticas simples y sin recursión.

---

## Opción 1: Ejecutar SQL Manualmente en Supabase Dashboard (RECOMENDADO)

Esta es la forma más rápida y segura:

### Pasos:

1. **Ve a tu proyecto de Supabase**: https://app.supabase.com
   - Selecciona tu proyecto: `lphzbqxsppuswzalxjxi`

2. **Abre el SQL Editor**:
   - En el menú lateral izquierdo, haz clic en "SQL Editor"

3. **Crea una nueva query**:
   - Haz clic en "New Query"

4. **Copia y pega el contenido del archivo**:
   - Abre el archivo: `supabase/migrations/003_fix_rls_recursion_complete.sql`
   - Copia TODO el contenido
   - Pégalo en el editor SQL de Supabase

5. **Ejecuta la migración**:
   - Haz clic en el botón "Run" (o presiona Ctrl+Enter)
   - Deberías ver un mensaje de éxito

6. **Verifica que funcionó**:
   - Recarga tu aplicación en localhost:3000
   - Los errores 500 deberían desaparecer
   - Los testimonios, logos, FAQs, etc. deberían cargar correctamente

---

## Opción 2: Usar Supabase CLI

Si prefieres usar la línea de comandos:

### Requisitos previos:
```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Login a Supabase
npx supabase login
```

### Pasos:

1. **Vincula tu proyecto**:
```bash
npx supabase link --project-ref lphzbqxsppuswzalxjxi
```

2. **Ejecuta la migración**:
```bash
npx supabase db push
```

---

## Verificación Final

Después de ejecutar la migración, verifica que todo funcione:

1. **En el navegador**, abre las DevTools (F12)
2. **Recarga la página** (Ctrl+R)
3. **Verifica que NO haya errores 500** en la consola
4. **Verifica que los datos se carguen**:
   - Testimonios
   - Logos de clientes
   - FAQs
   - Categorías de servicios

---

## Qué hace esta migración

La migración hace lo siguiente:

1. **Elimina TODAS las políticas problemáticas** que causan recursión
2. **Crea políticas simples** sin recursión:
   - Las tablas públicas (testimonios, FAQs, logos, etc.) son legibles por TODOS
   - Solo el service role (tu backend) puede escribir/actualizar/eliminar
3. **Elimina la dependencia de user_roles** en las verificaciones de permisos

---

## Cambios Importantes

Después de esta migración:

- ✅ **Landing page funcionará sin autenticación** (lo cual es correcto)
- ✅ **No más errores 500**
- ✅ **No más recursión infinita**
- ⚠️ **Para operaciones de admin** (crear/editar contenido), deberás usar el service role key en tu backend

---

## Si algo sale mal

Si después de ejecutar la migración sigues viendo errores:

1. **Verifica las políticas en Supabase**:
   - Ve a "Database" → "Tables"
   - Selecciona una tabla (ej: `testimonials`)
   - Ve a la pestaña "Policies"
   - Deberías ver solo 2 políticas:
     - `testimonials_select_public`
     - `testimonials_all_service_role`

2. **Contacta al soporte** si necesitas ayuda adicional

---

## Próximos Pasos

Una vez que la migración funcione:

1. **Prueba el landing page** completo
2. **Verifica que todos los componentes carguen datos**
3. **Planea crear un panel de admin** para gestionar el contenido (usando el service role key)
