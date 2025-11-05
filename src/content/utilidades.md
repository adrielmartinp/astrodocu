---
url: utilidades
nextUrl: frameworks
previousUrl: markdown
number: 6
title: Astro.glob() y getStaticPaths()
description: Utilidades recomendadas
icon: 🔥
---

# Astro.glob() y getStaticPaths()

Dos utilidades fundamentales para trabajar con contenido dinámico en Astro.

## 📂 Astro.glob()

`Astro.glob()` te permite **importar múltiples archivos** usando patterns glob (comodines).

### Sintaxis básica:

```js
---
const archivos = await Astro.glob('./ruta/*.extensión');
---
```

### Ejemplo: Cargar todos los posts Markdown

```js
---
// src/pages/blog/index.astro
const posts = await Astro.glob('../posts/*.md');

// Cada post tiene:
// - frontmatter: { title, date, author, ... }
// - url: la URL del archivo
// - file: ruta del archivo
// - Content: componente para renderizar el contenido
---

<h1>Todos los posts</h1>

{posts.map(post => (
  <article>
    <h2>{post.frontmatter.title}</h2>
    <p>{post.frontmatter.description}</p>
    <a href={post.url}>Leer más</a>
  </article>
))}
```

### Ejemplo: Cargar componentes dinámicamente

```js
---
// Cargar todos los componentes Card
const cards = await Astro.glob('../components/cards/*.astro');
---

<div class="grid">
  {cards.map((Card) => (
    <Card.default />
  ))}
</div>
```

### Ejemplo: Cargar imágenes

```js
---
const images = await Astro.glob('../assets/gallery/*.{png,jpg}');
---

<div class="gallery">
  {images.map(img => (
    <img src={img.default.src} alt="Gallery image" />
  ))}
</div>
```

### Patterns comunes:

```javascript
// Todos los .md en una carpeta
await Astro.glob("./posts/*.md");

// Archivos en subcarpetas también
await Astro.glob("./posts/**/*.md");

// Múltiples extensiones
await Astro.glob("./content/*.{md,mdx}");

// Componentes específicos
await Astro.glob("./components/cards/*.astro");
```

## 🛣️ getStaticPaths()

`getStaticPaths()` se usa en rutas dinámicas `[param].astro` para **generar páginas estáticas** en build time.

### Caso 1: Rutas simples

```js
---
// src/pages/products/[id].astro
export function getStaticPaths() {
  return [
    { params: { id: "1" } },
    { params: { id: "2" } },
    { params: { id: "3" } },
  ];
}

const { id } = Astro.params;
---

<h1>Producto #{id}</h1>
```

**Genera:**

- `/products/1`
- `/products/2`
- `/products/3`

### Caso 2: Con datos (props)

```js
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await Astro.glob('../posts/*.md');

  return posts.map(post => ({
    params: { slug: post.frontmatter.slug },
    props: { post }, // Datos extra
  }));
}

const { post } = Astro.props; // Acceder a los props
const { slug } = Astro.params; // Acceder al parámetro URL
---

<article>
  <h1>{post.frontmatter.title}</h1>
  <p>Slug: {slug}</p>
</article>
```

### Caso 3: Desde API externa

```js
---
// src/pages/users/[id].astro
export async function getStaticPaths() {
  // Fetch desde API
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await response.json();

  return users.map(user => ({
    params: { id: user.id.toString() },
    props: { user },
  }));
}

const { user } = Astro.props;
---

<h1>{user.name}</h1>
<p>Email: {user.email}</p>
<p>Ciudad: {user.address.city}</p>
```

**Genera 10 páginas estáticas (una por usuario) en build time**

### Caso 4: Múltiples parámetros

```js
---
// src/pages/blog/[year]/[month]/[slug].astro
export function getStaticPaths() {
  return [
    { params: { year: "2024", month: "10", slug: "primer-post" } },
    { params: { year: "2024", month: "11", slug: "segundo-post" } },
  ];
}

const { year, month, slug } = Astro.params;
---

<h1>Post: {slug}</h1>
<p>Fecha: {month}/{year}</p>
```

**Genera:**

- `/blog/2024/10/primer-post`
- `/blog/2024/11/segundo-post`

## 🎯 Combinando ambos

El patrón más común: usar `Astro.glob()` dentro de `getStaticPaths()`:

```js
---
// src/pages/blog/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';

// Generar rutas desde archivos
export async function getStaticPaths() {
  const posts = await Astro.glob('../posts/*.md');

  return posts.map(post => ({
    params: {
      slug: post.frontmatter.slug
    },
    props: {
      title: post.frontmatter.title,
      content: post.Content,
      date: post.frontmatter.date,
    },
  }));
}

const { title, content, date } = Astro.props;
const Content = content;
---

<BaseLayout title={title}>
  <article>
    <h1>{title}</h1>
    <time>{date}</time>
    <Content />
  </article>
</BaseLayout>
```

## 🏷️ Ejemplo avanzado: Sistema de tags

```js
---
// src/pages/tags/[tag].astro
export async function getStaticPaths() {
  const posts = await Astro.glob('../posts/*.md');

  // Recopilar todos los tags únicos
  const allTags = [...new Set(
    posts.flatMap(post => post.frontmatter.tags || [])
  )];

  // Crear ruta para cada tag
  return allTags.map(tag => ({
    params: { tag },
    props: {
      posts: posts.filter(post =>
        post.frontmatter.tags?.includes(tag)
      ),
    },
  }));
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<h1>Posts con tag: {tag}</h1>
<p>Total: {posts.length} posts</p>

<ul>
  {posts.map(post => (
    <li>
      <a href={post.url}>
        {post.frontmatter.title}
      </a>
    </li>
  ))}
</ul>
```

**Si tienes posts con tags ["astro", "react", "vue"], genera:**

- `/tags/astro`
- `/tags/react`
- `/tags/vue`

## 🔍 Filtrado y ordenamiento

```js
---
export async function getStaticPaths() {
  const allPosts = await Astro.glob('../posts/*.md');

  // Filtrar posts publicados
  const publishedPosts = allPosts.filter(
    post => !post.frontmatter.draft
  );

  // Ordenar por fecha
  const sortedPosts = publishedPosts.sort((a, b) =>
    new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  );

  return sortedPosts.map(post => ({
    params: { slug: post.frontmatter.slug },
    props: { post },
  }));
}
---
```

## 💡 Tip: Debugging

```js
---
export async function getStaticPaths() {
  const posts = await Astro.glob('../posts/*.md');

  // Ver qué rutas se están generando
  console.log('Generando rutas para:', posts.length, 'posts');

  return posts.map(post => {
    console.log('→', post.frontmatter.slug);
    return {
      params: { slug: post.frontmatter.slug },
      props: { post },
    };
  });
}
---
```

La salida aparecerá en la terminal durante `npm run build`.

## 📊 Comparación rápida

| Función            | Cuándo usarla             | Dónde usarla                     |
| ------------------ | ------------------------- | -------------------------------- |
| `Astro.glob()`     | Cargar múltiples archivos | En cualquier componente `.astro` |
| `getStaticPaths()` | Generar rutas dinámicas   | Solo en archivos `[param].astro` |

## 🎓 Resumen

- **Astro.glob()**: Importa múltiples archivos con un patrón
- **getStaticPaths()**: Define qué rutas estáticas generar
- Casi siempre se usan juntos para blogs y contenido dinámico
- Todo se ejecuta en **build time**, generando HTML estático
- Súper rápido porque no hay procesamiento en runtime
