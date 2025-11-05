---
url: frameworks
previousUrl: utilidades
number: 7
title: Framework Agnostic
description: Usa el framework que quieras, o mézclalos todos!
icon: 🤯
---

# Framework Agnostic: Usa cualquier framework

Una de las características más potentes de Astro: **usa el framework que quieras, o mézclalos todos**.

## 🎨 Frameworks soportados

Astro soporta de forma oficial:

- ⚛️ React
- 💚 Vue
- 🔥 Svelte
- 🟦 Solid
- 🅰️ Preact
- 🔷 Lit
- 🌐 Alpine.js

Y también componentes nativos `.astro` que son super ligeros.

## 🚀 Instalación de integraciones

```bash
# React
npx astro add react

# Vue
npx astro add vue

# Svelte
npx astro add svelte

# O varios a la vez
npx astro add react vue svelte
```

Esto automáticamente:

1. Instala las dependencias necesarias
2. Actualiza `astro.config.mjs`
3. Configura todo para que funcione

## 📝 Configuración manual

Si lo prefieres manual:

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";

export default defineConfig({
  integrations: [react(), vue(), svelte()],
});
```

## 🎯 Usando componentes de diferentes frameworks

### Ejemplo: Componente React

```jsx
// src/components/Counter.jsx
import { useState } from "react";

export default function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);

  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
      <button onClick={() => setCount(count - 1)}>Decrementar</button>
    </div>
  );
}
```

### Ejemplo: Componente Vue

```js
<!-- src/components/Form.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" placeholder="Tu email" />
    <button type="submit">Suscribirse</button>
    <p v-if="message">{{ message }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const message = ref("");

const handleSubmit = () => {
  message.value = `¡Gracias por suscribirte, ${email.value}!`;
  email.value = "";
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
```

### Ejemplo: Componente Svelte

```js
<!-- src/components/Toggle.svelte -->
<script>
  let isDark = false;

  function toggle() {
    isDark = !isDark;
    document.body.classList.toggle('dark-mode');
  }
</script>

<button on:click={toggle}>
  {isDark ? '☀️' : '🌙'}
  {isDark ? 'Modo Claro' : 'Modo Oscuro'}
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    border-radius: 8px;
  }
</style>
```

## 🌟 Mezclando frameworks en una página

```js
---
// src/pages/demo.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Counter from '../components/Counter.jsx';      // React
import Form from '../components/Form.vue';            // Vue
import Toggle from '../components/Toggle.svelte';     // Svelte
---

<BaseLayout title="Demo Multi-Framework">
  <h1>Astro con múltiples frameworks</h1>

  <!-- Sección estática (sin JS) -->
  <section>
    <h2>Contenido estático</h2>
    <p>Este contenido es puro HTML, sin JavaScript.</p>
  </section>

  <!-- Componente React -->
  <section>
    <h2>Componente React</h2>
    <Counter client:visible initial={10} />
  </section>

  <!-- Componente Vue -->
  <section>
    <h2>Componente Vue</h2>
    <Form client:visible />
  </section>

  <!-- Componente Svelte -->
  <section>
    <h2>Componente Svelte</h2>
    <Toggle client:load />
  </section>
</BaseLayout>
```

**Resultado:**

- HTML estático para títulos y párrafos (0KB JS)
- React solo carga para el contador (~8KB)
- Vue solo carga para el formulario (~6KB)
- Svelte solo carga para el toggle (~2KB)
- Total: ~16KB vs 150KB+ si toda la página fuera React

## 🎭 Componentes .astro (nativos)

Los componentes `.astro` son la opción más ligera:

```js
---
// src/components/Card.astro
interface Props {
  title: string;
  image: string;
  link: string;
}

const { title, image, link } = Astro.props;
---

<article class="card">
  <img src={image} alt={title} />
  <h3>{title}</h3>
  <a href={link}>Ver más →</a>
</article>

<style>
  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
</style>
```

**Sin directiva client:\* = 0KB de JavaScript**

## ⚡ Cuándo usar cada framework

### Usa componentes .astro para:

- ✅ Contenido estático
- ✅ Layouts y estructuras
- ✅ Listas y mapeos simples
- ✅ Componentes sin estado

### Usa React/Vue/Svelte para:

- ✅ Componentes muy interactivos
- ✅ State management complejo
- ✅ Reutilizar componentes existentes
- ✅ Equipos con experiencia en ese framework

## 🔄 Pasando datos entre frameworks

Los props funcionan igual para todos:

```js
---
import ReactButton from './Button.jsx';
import VueCard from './Card.vue';
import SvelteModal from './Modal.svelte';

const data = {
  title: "Hola",
  count: 42,
  items: ["a", "b", "c"]
};
---

<!-- Los props se pasan igual -->
<ReactButton
  label={data.title}
  count={data.count}
  client:load
/>

<VueCard
  :title={data.title}
  :items={data.items}
  client:visible
/>

<SvelteModal
  title={data.title}
  client:idle
/>
```

## 🎯 Ejemplo real: Landing page completa

```js
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';

// Componentes estáticos (Astro)
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
import Footer from '../components/Footer.astro';

// Componentes interactivos (diferentes frameworks)
import PricingCalculator from '../components/PricingCalculator.jsx';  // React
import ContactForm from '../components/ContactForm.vue';              // Vue
import TestimonialSlider from '../components/TestimonialSlider.svelte'; // Svelte
---

<BaseLayout title="Mi Landing Page">
  <!-- Estático: 0KB JS -->
  <Hero />

  <!-- Estático: 0KB JS -->
  <Features />

  <!-- Interactivo: React -->
  <section>
    <h2>Calcula tu precio</h2>
    <PricingCalculator client:visible />
  </section>

  <!-- Interactivo: Svelte -->
  <section>
    <h2>Lo que dicen nuestros clientes</h2>
    <TestimonialSlider client:visible />
  </section>

  <!-- Interactivo: Vue -->
  <section>
    <h2>Contáctanos</h2>
    <ContactForm client:visible />
  </section>

  <!-- Estático: 0KB JS -->
  <Footer />
</BaseLayout>
```

## 📊 Comparación de tamaños

| Framework | Bundle mínimo | Uso recomendado                    |
| --------- | ------------- | ---------------------------------- |
| `.astro`  | 0KB           | Contenido estático                 |
| Svelte    | ~2KB          | Componentes ligeros e interactivos |
| Preact    | ~4KB          | Alternativa ligera a React         |
| Vue       | ~6KB          | Formularios, dashboards            |
| React     | ~8KB          | Ecosistema grande, librerías       |
| Solid     | ~7KB          | Performance extrema                |

## 💡 Mejores prácticas

1. **Empieza con .astro**: Si no necesitas interactividad, usa componentes `.astro`

2. **Hidrata solo lo necesario**: Usa `client:visible` o `client:idle` cuando sea posible

3. **Elige el framework adecuado**:

   - ¿Ya tienes componentes React? Úsalos
   - ¿Proyecto nuevo y ligero? Prueba Svelte
   - ¿Necesitas Vue? Adelante

4. **No te cases con uno**: En la misma página puedes usar varios frameworks

## 🚀 El poder de la flexibilidad

```js
---
// Puedes importar de donde sea
import MyReactComponent from './react/Button.jsx';
import MyVueComponent from './vue/Form.vue';
import MySvelteComponent from './svelte/Card.svelte';
import MyAstroComponent from './astro/Layout.astro';

// Incluso de node_modules
import { Button } from 'react-bootstrap';
import VCalendar from 'v-calendar';
---

<!-- Y usarlos todos juntos -->
<MyAstroComponent>
  <MyReactComponent client:load />
  <MyVueComponent client:visible />
  <MySvelteComponent client:idle />
  <Button client:load>Click me</Button>
</MyAstroComponent>
```

**Esto es único de Astro**: ningún otro framework te da esta flexibilidad sin complicaciones.

## 🎓 Resumen

- ✅ Usa el framework que prefieras (o varios)
- ✅ Instala con `npx astro add [framework]`
- ✅ Cada componente carga solo su framework
- ✅ Componentes `.astro` son la opción más ligera
- ✅ Todo funciona junto sin conflictos
- ✅ Migra gradualmente sin reescribir todo
