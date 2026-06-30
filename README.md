# Bienestar Store (E-commerce)

Este es un e-commerce de alto rendimiento construido con Next.js (App Router), Supabase (Base de datos y Autenticación), Prisma y Tailwind CSS.

## Requisitos Previos

- Node.js (v18+)
- Cuenta en [Supabase](https://supabase.com/)
- Cuenta en [Cloudinary](https://cloudinary.com/)
- Cuenta en [Resend](https://resend.com/) (para envío de correos)

## Configuración del Entorno (.env)

1. Duplica el archivo `.env.example` o `.env` y asegúrate de tener las siguientes variables configuradas:

```env
# Base de datos Supabase
DATABASE_URL="postgresql://postgres.[REFERENCIA]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REFERENCIA]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Autenticación Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[REFERENCIA].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_anon_key"

# Cloudinary (Imágenes)
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu_cloud_name"

# Resend (Envío de Correos)
RESEND_API_KEY="re_tu_api_key"
FROM_EMAIL="Bienestar Store <noreply@bienestarstore.pe>"
```

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Inicializar base de datos (Prisma):
```bash
npx prisma db push
```

3. Correr el servidor de desarrollo:
```bash
npm run dev
```

La tienda estará disponible en `http://localhost:3000`.

## Subida de Imágenes (Cloudinary)
Este proyecto utiliza **Signed Uploads** desde el cliente (Browser). El servidor solo genera firmas criptográficas en `/api/cloudinary/sign` y el cliente sube la imagen de forma directa y segura a Cloudinary, guardando únicamente la URL en la base de datos de Supabase.

## Cumplimiento Legal (Perú)
Implementa funcionalidades nativas para la Ley N° 29733 (Ley de Protección de Datos Personales), incluyendo checkboxes explícitos de consentimiento en el registro y un panel en el perfil para ejercer los **Derechos ARCO** (Acceso, Rectificación, Cancelación y Oposición).

## SEO
Integración nativa con `generateMetadata` y Schema Markup (JSON-LD) inyectado dinámicamente en los productos para soportar Rich Snippets de Google y Motores AI.
