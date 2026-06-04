# Countdown al primer partido — Design Spec

**Fecha:** 2026-06-04  
**Feature:** Cuenta regresiva en el dashboard hasta el inicio del torneo

---

## Resumen

Agregar una cuenta regresiva al dashboard que muestre el tiempo restante hasta el primer partido del Mundial 2026. Mientras el countdown sea visible, se ocultan todos los demás contenidos del dashboard (StatsGrid, partidos en vivo, próximos). Cuando el torneo comienza, el countdown desaparece y el dashboard vuelve a su estado normal.

---

## Decisiones de diseño

- **Partido objetivo:** el partido con la `utcDate` más temprana de `allMatches` (partido inaugural).
- **Condición de visibilidad:** `firstMatch.status === 'SCHEDULED'` y `utcDate > ahora`. Se evalúa como computed en el Dashboard.
- **Posición:** arriba de todo en el dashboard, reemplaza todo el contenido mientras sea visible.
- **Animación:** slide + blur — cada dígito entra desde arriba con `translateY(-100%)` y `opacity: 0` al cambiar. Se implementa con CSS keyframe y key dinámica de Vue para forzar recreación del elemento.
- **Arquitectura:** enfoque A — composable `useCountdown` + componente `CountdownCard`.

---

## Cambios por archivo

### 1. `src/stores/matches.js`

Nuevo getter `firstMatch`:

```js
firstMatch: (s) => s.allMatches.length
  ? [...s.allMatches].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))[0]
  : null
```

### 2. `src/composables/useCountdown.js` (nuevo)

Recibe `targetDate` (string ISO o Date). Arranca un `setInterval` de 1 segundo en `onMounted`, lo limpia en `onUnmounted`. Devuelve refs reactivos `{ days, hours, minutes, seconds, done }`.

- `done` se vuelve `true` cuando `diff <= 0`, señal para que el padre oculte el componente.
- No emite eventos — el padre (DashboardView) usa `showCountdown` computed propio basado en el store, por lo que `done` queda disponible pero no es la fuente principal de verdad para ocultar el countdown.

```js
export function useCountdown(targetDate) {
  const days = ref(0), hours = ref(0), minutes = ref(0), seconds = ref(0)
  const done = ref(false)

  function tick() {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) { done.value = true; return }
    days.value    = Math.floor(diff / 86_400_000)
    hours.value   = Math.floor((diff % 86_400_000) / 3_600_000)
    minutes.value = Math.floor((diff % 3_600_000) / 60_000)
    seconds.value = Math.floor((diff % 60_000) / 1_000)
  }

  let timer
  onMounted(() => { tick(); timer = setInterval(tick, 1000) })
  onUnmounted(() => clearInterval(timer))

  return { days, hours, minutes, seconds, done }
}
```

### 3. `src/components/dashboard/CountdownCard.vue` (nuevo)

**Props:** `match` (Object, required) — el `firstMatch` del store.

**Lógica interna:**
- Llama a `useCountdown(match.utcDate)`.
- Llama a `useArgTime()` para formatear la hora del partido.

**Animación slide+blur:**
- Cada unidad (`days`, `hours`, `minutes`, `seconds`) tiene su `<span>` con una `:key` dinámica igual al valor actual.
- Cuando el valor cambia, Vue destruye y recrea el `<span>`, disparando el keyframe `@keyframes slideIn` automáticamente.
- Keyframe:
  ```css
  @keyframes slideIn {
    from { transform: translateY(-60%); opacity: 0; filter: blur(4px); }
    to   { transform: translateY(0);    opacity: 1; filter: blur(0);   }
  }
  ```
- Los segundos tienen un highlight con borde y fondo rojizo (`#1a0a09`, `border: 1px solid #c0281e55`) para enfatizar el tick.
- Los separadores `:` tienen una animación `@keyframes pulse` de `opacity` (1 → 0.3 → 1) con duración 1s para dar vida al conjunto.

**Layout:**
```
[ ⚽ EL TORNEO EMPIEZA EN ]
[ 07 días ] : [ 14 hs ] : [ 23 min ] : [ 45 seg ]
[ México vs. Canadá · 21:00 ARG ]
```

Bordes y paleta consistentes con el tema oscuro existente (`surface`, `border`, `red`, `ochre`).

### 4. `src/views/DashboardView.vue`

Nueva computed:

```js
const showCountdown = computed(() => {
  const m = store.firstMatch
  return m?.status === 'SCHEDULED' && new Date(m.utcDate) > new Date()
})
```

Template condicional:

```html
<CountdownCard v-if="showCountdown" :match="store.firstMatch" />
<template v-else>
  <StatsGrid />
  <section v-if="store.liveMatches.length">...</section>
  <section>...</section>
</template>
```

Se importa `CountdownCard` y se agrega al bloque `<template v-else>` que ya envuelve el contenido existente.

---

## Fuera de scope

- Tests para `useCountdown` (el patrón de fake timers ya existe en `usePolling.test.js` y puede agregarse después).
- Transición animada al desaparecer el countdown.
- Soporte para múltiples idiomas en las etiquetas.
