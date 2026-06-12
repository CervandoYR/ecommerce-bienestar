# Guía de Configuración: Base de Datos y Autenticación

Este proyecto está construido con un stack de nivel de producción (Vercel + Next.js + Supabase + Firebase). A continuación, te explicamos cómo conectar los servicios externos para llevar la tienda a su estado de operaciones reales.

## 1. Supabase (PostgreSQL Base de Datos)

Supabase aloja nuestra base de datos relacional mediante PostgreSQL y Prisma ORM.

### Pasos:
1. Crea una cuenta en [Supabase](https://supabase.com/) y crea un nuevo proyecto.
2. Ve a las configuraciones de tu proyecto -> **Database** -> Copia la **Transaction Connection String** (URI).
3. En la raíz de tu proyecto, duplica el archivo `.env.example` y renómbralo a `.env`.
4. Pega la URL en las siguientes variables (recuerda poner tu contraseña real):
   ```env
   DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@db.[REFERENCIA].supabase.co:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[TU_PASSWORD]@db.[REFERENCIA].supabase.co:5432/postgres"
   ```
5. Aplica el esquema de la base de datos a Supabase corriendo el comando mágico de Prisma en tu terminal:
   ```bash
   npx prisma db push
   ```
   *(Esto creará las tablas automáticamente. ¡Y listo! Base de datos en vivo).*

---

## 2. Firebase (Autenticación)

Usamos Firebase para manejar el registro, login y la seguridad de las contraseñas.

### Pasos:
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Ve a **Authentication** y habilita "Correo/Contraseña" y "Google" (opcional).
3. Ve a **Project Settings (Configuración del proyecto)** -> **General** -> Agrega una aplicación web (</>).
4. Copia las variables de configuración (`apiKey`, `authDomain`, etc.) y pégalas en tu archivo `.env`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="tu_api_key_aqui"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu_proyecto.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu_proyecto"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu_proyecto.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="tu_sender_id"
   NEXT_PUBLIC_FIREBASE_APP_ID="tu_app_id"
   ```

*(Nota: Para seguridad en el servidor, también necesitarás las variables de Firebase Admin, que consigues en **Project Settings -> Service Accounts -> Generate New Private Key**).*

---

## 3. Quitar el "Bypass" del Administrador

Actualmente, el archivo `src/app/admin/layout.tsx` tiene comentado el código que bloquea la entrada al panel administrativo a personas que no hayan iniciado sesión. 

Una vez que tengas Firebase funcionando:
1. Abre `src/app/admin/layout.tsx`.
2. Busca la línea `// DEMO BYPASS: ...`.
3. Descomenta el bloque de redirección (`router.push("/login")`).
4. Configura en `.env` la variable de tu correo de administrador:
   ```env
   NEXT_PUBLIC_ADMIN_EMAIL="tu_correo_personal@gmail.com"
   ```

---

## 4. Despliegue en Vercel

¡Tienes todo listo para salir al aire!
1. Sube este código a tu GitHub.
2. Entra a [Vercel](https://vercel.com/) y dale a **Import Project** desde GitHub.
3. Copia todas tus variables del `.env` y pégalas en la sección de "Environment Variables" en Vercel.
4. Presiona **Deploy**. 

En 2 minutos tendrás tu e-commerce subido y disponible en el mundo entero.
