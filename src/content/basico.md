---
url: basico
nextUrl: markdown
previousUrl: islas
number: 4
title: Fundamentos de Astro
description: Aprende lo básico de Astro, crea tus componentes y exprime todas sus funciones
icon: 🚀
---

# Fundamentos de Astro

## 📄 Anatomía de un archivo .astro

Un componente `.astro` tiene dos partes:

```js
---
// 1. FRONTMATTER (código JavaScript/TypeScript)
// Se ejecuta en BUILD TIME (servidor)
const title = "Hola Mundo";
const items = [1, 2, 3];

function saludar(nombre) {
  return `Hola, ${nombre}!`;
}
---

<!-- 2. TEMPLATE (HTML + expresiones) -->
<!-- Se convierte en HTML estático -->
<h1>{title}</h1>
<p>{saludar("Juan")}</p>

<ul>
  {items.map(item => (
    <li>Item {item}</li>
  ))}
</ul>
```

**Resultado final (HTML):**

```html
<h1>Hola Mundo</h1>
<p>Hola, Juan!</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

## 🎨 Props: Pasando datos a componentes

```js
---
// src/components/Card.astro
interface Props {
  title: string;
  description: string;
  link?: string;
}

const { title, description, link = "#" } = Astro.props;
---

<div class="card">
  <h2>{title}</h2>
  <p>{description}</p>
  <a href={link}>Leer más</a>
</div>

<style>
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
  }
</style>
```

**Usando el componente:**

```js
---
// src/pages/index.astro
import Card from '../components/Card.astro';
---

<Card
  title="Mi primer post"
  description="Este es un ejemplo de card"
  link="/blog/primer-post"
/>

<Card
  title="Segundo post"
  description="Otro ejemplo sin link"
/>
```

## 🗂️ Routing basado en archivos

Astro crea rutas automáticamente según la estructura de carpetas:

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── blog/
│   ├── index.astro      → /blog
│   └── [slug].astro     → /blog/cualquier-cosa
└── api/
    └── posts.json.ts    → /api/posts.json
```

### Rutas dinámicas:

```js
---
// src/pages/blog/[slug].astro
export function getStaticPaths() {
  return [
    { params: { slug: "primer-post" } },
    { params: { slug: "segundo-post" } },
  ];
}

const { slug } = Astro.params;
---

<h1>Post: {slug}</h1>
```

**URLs generadas:**

- `/blog/primer-post`
- `/blog/segundo-post`

## 🏗️ Layouts: Plantillas reutilizables

```js
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>{title}</title>
    <link rel="stylesheet" href="/styles/global.css">
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/blog">Blog</a>
        <a href="/about">About</a>
      </nav>
    </header>

    <main>
      <!-- El contenido de la página va aquí -->
      <slot />
    </main>

    <footer>
      <p>© 2024 Mi Sitio</p>
    </footer>
  </body>
</html>
```

**Usando el layout:**

```js
---
// src/pages/about.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Sobre mí">
  <h1>Sobre mí</h1>
  <p>Soy un desarrollador que usa Astro.</p>
</BaseLayout>
```

## 🎨 CSS: Global y Scoped

### CSS Scoped (por defecto):

```js
---
// src/components/Button.astro
---

<button class="btn">Click me</button>

<style>
  /* Este CSS solo afecta a este componente */
  .btn {
    background: blue;
    color: white;
    padding: 0.5rem 1rem;
  }
</style>
```

### CSS Global:

```css
/* src/styles/global.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}
```

**Importar en layout:**

```js
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
---

<html>
  <!-- ... -->
</html>
```

## 🔧 Variables y lógica

```js
---
const isDev = import.meta.env.DEV;
const apiUrl = import.meta.env.PUBLIC_API_URL;

const posts = await fetch(`${apiUrl}/posts`).then(r => r.json());

const featuredPosts = posts.filter(post => post.featured);
---

{isDev && <div class="dev-banner">Modo desarrollo</div>}

<h2>Posts destacados</h2>
{featuredPosts.length > 0 ? (
  <ul>
    {featuredPosts.map(post => (
      <li>{post.title}</li>
    ))}
  </ul>
) : (
  <p>No hay posts destacados</p>
)}
```

## 🧩 Componentes de otros frameworks

Astro funciona con React, Vue, Svelte, Solid:

```js
---
// src/pages/demo.astro
import ReactCounter from '../components/Counter.jsx';
import VueForm from '../components/Form.vue';
import SvelteCarousel from '../components/Carousel.svelte';
---

<!-- Cada uno en su propio framework -->
<ReactCounter client:load />
<VueForm client:visible />
<SvelteCarousel client:idle />

<!-- ¡Todos en la misma página! -->
```

**Counter.jsx (React):**

```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

## 📦 Estructura típica de proyecto

```
mi-proyecto-astro/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Card.astro
│   │   └── Button.astro
│   ├── layouts/         # Plantillas de página
│   │   └── BaseLayout.astro
│   ├── pages/           # Rutas (file-based routing)
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── blog/
│   │       └── [slug].astro
│   ├── styles/          # CSS global
│   │   └── global.css
│   └── content/         # Markdown, datos
│       └── posts/
│           └── post-1.md
├── public/              # Archivos estáticos (imágenes, etc.)
├── astro.config.mjs     # Configuración
└── package.json
```

## 🚀 Comandos básicos

```bash
# Desarrollo
npm run dev           # http://localhost:4321

# Build
npm run build         # Genera /dist

# Preview del build
npm run preview       # Prueba el build localmente
```
