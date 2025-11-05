---
url: islas
nextUrl: basico
previousUrl: porque
number: 3
title: Arquitectura de Islas y SSG
description: Hablemos sobre las islas y por qué es tan rápido
icon: 🏝️
---

# Arquitectura de Islas y SSG

## 🏝️ ¿Qué son las Islas?

La **Arquitectura de Islas** es el concepto más importante de Astro:

```
┌───────────────────────────────────────┐
│  🌊 Océano de HTML estático 🌊       │
│                                       │
│  Header (estático)                    │
│  Navegación (estática)                │
│                                       │
│  🏝️ [Isla: Contador interactivo] 🏝️  │
│                                       │
│  Contenido (estático)                 │
│                                       │
│  🏝️ [Isla: Formulario contacto] 🏝️   │
│                                       │
│  Footer (estático)                    │
└───────────────────────────────────────┘
```

**Océano = HTML estático (0KB de JS)**
**Islas = Componentes interactivos (JavaScript solo aquí)**

## 🎯 SSG: El secreto de Astro

Astro brilla usando **SSG (Static Site Generation)**:

### Durante el build:

```bash
npm run build

# Astro hace:
1. Lee todos tus archivos .astro
2. Ejecuta el código en tu máquina
3. Genera HTML completo para TODAS las rutas
4. Guarda en /dist con CERO JavaScript (por defecto)
```

### Resultado en /dist:

```
dist/
├── index.html           ← HTML completo (10KB)
├── about/
│   └── index.html       ← HTML completo (8KB)
├── blog/
│   ├── post-1/
│   │   └── index.html   ← HTML completo (12KB)
│   └── post-2/
│       └── index.html   ← HTML completo (11KB)
└── _astro/
    └── counter.js       ← Solo 3KB (si usas una isla)
```

**Total JavaScript: 3KB vs 150KB de una SPA típica**

## 🔌 Sin JavaScript por defecto

```js
---

// Este código se ejecuta en BUILD TIME, no en el navegador
const title = "Mi Sitio";
const posts = await fetch('https://api.example.com/posts');

---

<header>
  <h1>{title}</h1>
</header>

<main>
  {posts.map(post => (
    <article>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
    </article>
  ))}
</main>

<!-- TODO esto es HTML estático -->
<!-- El fetch se hizo en build time, no en el navegador -->
<!-- El navegador recibe HTML puro, sin JavaScript -->

```

## ⚡ Añadiendo interactividad: client:\*

Cuando SÍ necesitas JavaScript, usas directivas:

```js
---
import Counter from './Counter.jsx'; // Componente React
import Form from './Form.vue';       // Componente Vue
---

<!-- Sin directiva = HTML estático, 0KB JS -->
<header>
  <h1>Mi Sitio</h1>
</header>

<!-- client:load = Carga JS inmediatamente -->
<Counter client:load />

<!-- client:visible = Carga JS cuando es visible -->
<Form client:visible />

<!-- Sin directiva = HTML estático de nuevo -->
<footer>
  <p>Copyright 2024</p>
</footer>
```

### Directivas disponibles:

| Directiva                           | Cuándo se carga el JS                  |
| ----------------------------------- | -------------------------------------- |
| `client:load`                       | Inmediatamente al cargar la página     |
| `client:idle`                       | Cuando el navegador está inactivo      |
| `client:visible`                    | Cuando el componente entra en viewport |
| `client:media="(max-width: 768px)"` | Cuando se cumple la media query        |
| `client:only="react"`               | Solo en el cliente, skip SSR           |

## 🎮 Ejemplo completo

```js
---
// src/pages/index.astro
import Counter from '../components/Counter.jsx';
import Newsletter from '../components/Newsletter.vue';
---

<!DOCTYPE html>
<html>
  <head>
    <title>Mi Landing Page</title>
  </head>
  <body>
    <!-- Estático: 0KB JS -->
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>

    <!-- Estático: 0KB JS -->
    <main>
      <h1>Bienvenido a mi sitio</h1>
      <p>Este contenido es HTML puro, super rápido.</p>

      <!-- Isla 1: ~5KB JS (solo cuando es visible) -->
      <Counter client:visible />

      <p>Más contenido estático entre islas...</p>

      <!-- Isla 2: ~8KB JS (solo cuando es visible) -->
      <Newsletter client:visible />
    </main>

    <!-- Estático: 0KB JS -->
    <footer>
      <p>© 2024 - Hecho con Astro</p>
    </footer>
  </body>
</html>
```

**Resultado:**

- Página total: 25KB (HTML)
- JavaScript: 13KB (solo las 2 islas, y solo si haces scroll)
- Primera carga: **instantánea** (solo HTML)

## 🆚 Comparación visual

| Arquitectura                | Tiempo hasta First Paint | Experiencia del Usuario           | Carga de JavaScript              |
| --------------------------- | ------------------------ | --------------------------------- | -------------------------------- |
| **SPA tradicional (React)** | 2-3 segundos ⏱️          | Pantalla en blanco → Todo aparece | Bloquea el renderizado           |
| **Astro con Islas**         | <0.5 segundos ⚡         | Contenido instantáneo             | Solo lo necesario, en background |

## 💡 La filosofía

> "Usa JavaScript solo donde lo necesites, el resto que sea HTML rápido"

Esto es exactamente lo opuesto a las SPAs tradicionales donde TODO es JavaScript.
