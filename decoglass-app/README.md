# DECOGLASS · Gestión

App de gestión interna de DECOGLASS ESPEJOS ILUMINADOS: mapa de sectores, ingresos, compras, presupuestador, CRM y planilla de pedidos.

Es una app React (Vite) que guarda todos sus datos en una base de datos real de **Supabase** (Postgres), así que todos los que abran el link ven y editan la misma información, desde cualquier computadora.

---

## 1. Crear la base de datos (Supabase — gratis)

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta gratis.
2. Creá un proyecto nuevo (elegí una contraseña de base de datos y guardala, aunque no la vas a necesitar para esto).
3. Una vez creado, entrá a **SQL Editor** (menú izquierdo) → **New query**.
4. Abrí el archivo `supabase/schema.sql` de esta carpeta, copiá todo su contenido, pegalo ahí y apretá **Run**. Esto crea la tabla donde se guardan todos los datos de la app.
5. Entrá a **Project Settings → API**. Vas a necesitar dos datos:
   - **Project URL**
   - **anon public key**

Guardalos, los usás en el paso 3.

## 2. Probarlo en tu computadora (opcional, para verificar antes de subirlo)

Necesitás tener [Node.js](https://nodejs.org) instalado (versión 18 o más nueva).

```bash
npm install
cp .env.example .env
```

Abrí el archivo `.env` y completá con los datos del paso 1:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

Después:

```bash
npm run dev
```

Y abrí la URL que te muestre en la terminal (algo como `http://localhost:5173`).

## 3. Subir a GitHub

1. Creá un repositorio nuevo en GitHub (puede ser privado).
2. Subí todos los archivos de esta carpeta (el `.gitignore` ya excluye `node_modules` y `.env`, no hace falta que te preocupes por eso).

```bash
git init
git add .
git commit -m "DECOGLASS gestión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## 4. Publicarla para que la abran desde cualquier computadora (Vercel — gratis)

1. Entrá a [vercel.com](https://vercel.com) y creá una cuenta gratis (podés entrar directo con tu cuenta de GitHub).
2. **Add New → Project**, elegí el repositorio que subiste.
3. Antes de darle "Deploy", abrí **Environment Variables** y agregá las mismas dos variables del paso 1:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. En 1-2 minutos te da una URL (algo como `https://decoglass-gestion.vercel.app`).

Esa URL es la que abrís en las 4 PC y las 2 notebooks. Guardala como favorito en cada equipo.

Cada vez que quieras actualizar la app (si en el futuro pedís más cambios), subís los archivos nuevos al mismo repositorio de GitHub y Vercel la actualiza solo, automáticamente.

## 5. Cómo se usa una vez desplegada

Es exactamente la misma app que veníamos usando: la primera persona en entrar como "Admin" crea la clave de administrador, cada sector configura su propia clave la primera vez, etc. Nada de eso cambió — solo cambió **dónde vive** la app y **dónde se guardan los datos**.

---

## Sobre la seguridad (importante, leer)

- La política de la base de datos que crea `schema.sql` es **abierta**: cualquiera que tenga la URL y la clave "anon" de tu proyecto de Supabase podría, en teoría, leer o escribir esos datos directamente (no solo a través de la app). La clave "anon" no es un secreto absoluto — está pensada para ir en el código del navegador — pero la política abierta sí significa que no hay una segunda capa de seguridad a nivel de base de datos, más allá de las claves que ya maneja la app (admin / sectores).
- Para este uso (una empresa chica, datos operativos internos) es una decisión razonable para arrancar. Si en el futuro vas a guardar datos más sensibles (por ejemplo, muchos DNI/CUIT de clientes) y querés más seguridad, se puede migrar a un esquema con autenticación real de Supabase (usuarios con email/contraseña y políticas por usuario) — es un paso más de trabajo que puedo armar después si lo necesitás.
- No compartas la URL de la app ni las claves de Supabase fuera de la empresa.

## Estructura del proyecto

```
decoglass-app/
├── index.html
├── package.json
├── vite.config.js
├── .env.example        (copiar a .env con tus datos de Supabase)
├── supabase/
│   └── schema.sql       (correr una vez en el SQL Editor de Supabase)
└── src/
    ├── main.jsx
    ├── App.jsx           (toda la app)
    └── lib/
        ├── supabaseClient.js
        └── storage.js    (guarda/lee los datos en Supabase)
```
