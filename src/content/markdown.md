---
url: markdown
nextUrl: utilidades
previousUrl: basico
number: 5
title: Markdown y Content Collections
description: Soporte nativo, perfecto para blogs y docus
icon: ✨
---

# Markdown y Content Collections

## 📝 ¿Por qué Markdown en Astro?

Astro tiene soporte **nativo y de primera clase** para Markdown:

- Perfecto para blogs y documentación
- Fácil de escribir y mantener
- Frontmatter para metadata
- Validación de tipos con Content Collections

## 📄 Archivo Markdown básico

````markdown
---
title: "Mi primer post"
author: "Juan Pérez"
date: 2024-10-29
tags: ["astro", "tutorial", "web"]
description: "Aprende a usar Markdown en Astro"
---

# Mi primer post

Este es el contenido de mi post escrito en **Markdown**.

## Sección 1

Puedes usar todo el poder de Markdown:

- Listas
- **Negrita**
- _Cursiva_
- [Links](https://astro.build)

## Sección 2

```javascript
// Incluso bloques de código
console.log("Hola Astro!");
```
````

Y mucho más...

## 🗂️ Content Collections

Las **Content Collections** son la forma recomendada de manejar contenido en Astro:

### Estructura:

```
src/
└── content/
    ├── config.ts           # Configuración y schemas
    └── blog/               # Colección "blog"
        ├── post-1.md
        ├── post-2.md
        └── post-3.md
```

### Configurar la colección:

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    description: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

**Beneficios:**

- ✅ Validación de tipos automática
- ✅ Autocompletado en el editor
- ✅ Errores en build time si falta algo

## 📚 Mostrar lista de posts

```js
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

// Obtener todos los posts de la colección "blog"
const posts = await getCollection('blog');

// Ordenar por fecha (más reciente primero)
const sortedPosts = posts.sort((a, b) =>
  b.data.date.getTime() - a.data.date.getTime()
);
---

<BaseLayout title="Blog">
  <h1>Todos mis posts</h1>

  <ul>
    {sortedPosts.map(post => (
      <li>
        <a href={`/blog/${post.slug}`}>
          <h2>{post.data.title}</h2>
          <p>{post.data.description}</p>
          <time>{post.data.date.toLocaleDateString()}</time>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

## 📖 Página individual de post

```js
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

// Generar rutas estáticas para cada post
export async function getStaticPaths() {
  const posts = await getCollection('blog');

  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout title={post.data.title}>
  <article>
    <header>
      <h1>{post.data.title}</h1>
      <p>Por {post.data.author}</p>
      <time>{post.data.date.toLocaleDateString()}</time>

      <div class="tags">
        {post.data.tags.map(tag => (
          <span class="tag">{tag}</span>
        ))}
      </div>
    </header>

    <!-- El contenido Markdown renderizado -->
    <Content />
  </article>
</BaseLayout>

<style>
  article {
    max-width: 700px;
    margin: 0 auto;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
  }

  .tag {
    background: #e0e0e0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
</style>
```

## 🎨 Frontmatter: Metadata estructurada

El **frontmatter** es YAML al inicio del archivo Markdown:

```markdown
---
# Metadata del post
title: "Guía de Astro"
author: "María García"
date: 2024-10-29
tags: ["tutorial", "astro", "javascript"]
draft: false
featured: true
image: "/images/astro-guide.jpg"
---

# Contenido del post...
```

### Acceder al frontmatter:

```js
---
const { data } = post;
---

<h1>{data.title}</h1>
<p>Por {data.author}</p>

{data.featured && (
  <span class="badge">⭐ Destacado</span>
)}

{!data.draft ? (
  <Content />
) : (
  <p>Este post está en borrador</p>
)}
```

## 🔍 Filtrar posts por tags

```js
---
// src/pages/blog/tag/[tag].astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');

  // Obtener todos los tags únicos
  const allTags = [...new Set(posts.flatMap(post => post.data.tags))];

  return allTags.map(tag => ({
    params: { tag },
    props: {
      posts: posts.filter(post => post.data.tags.includes(tag))
    },
  }));
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<BaseLayout title={`Posts con tag: ${tag}`}>
  <h1>Posts etiquetados como "{tag}"</h1>

  <ul>
    {posts.map(post => (
      <li>
        <a href={`/blog/${post.slug}`}>
          {post.data.title}
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

## 📄 Páginas Markdown directas

También puedes crear páginas Markdown sin collections:

```markdown
---
# src/pages/about.md
layout: ../../layouts/BaseLayout.astro
title: "Sobre mí"
---

# Sobre mí

Soy un **desarrollador web** que ama usar Astro.

## Experiencia

- Frontend: React, Vue, Svelte
- Backend: Node.js, Python
- Frameworks: Astro, Next.js
```

**Resultado:** Astro renderiza `/about` automáticamente usando el layout especificado.

## 🎯 MDX: Markdown + Componentes

Con MDX puedes usar componentes dentro de Markdown:

```mdx
---
# src/content/blog/post-mdx.mdx
title: "Post con MDX"
---

import Counter from "../../components/Counter.jsx";
import Alert from "../../components/Alert.astro";

# Post con componentes

Este es texto normal de Markdown.

<Alert type="info">Esto es un componente Astro dentro de Markdown!</Alert>

Y aquí un componente React interactivo:

<Counter client:load />

Seguimos con Markdown normal...
```

## 💡 Ejemplo completo: Blog

```
src/
├── content/
│   ├── config.ts
│   └── blog/
│       ├── mi-primer-post.md
│       ├── segundo-post.md
│       └── guia-astro.md
├── layouts/
│   └── BlogLayout.astro
└── pages/
    └── blog/
        ├── index.astro      # Lista de posts
        ├── [slug].astro     # Post individual
        └── tag/
            └── [tag].astro  # Posts por tag
```

Con esta estructura tienes un blog completo con:

- ✅ Validación de tipos
- ✅ SEO optimizado
- ✅ Rutas automáticas
- ✅ Filtrado por tags
- ✅ HTML estático super rápido
