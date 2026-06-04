# Dashboard Countdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar una cuenta regresiva al dashboard que muestre el tiempo hasta el primer partido del Mundial; mientras es visible, oculta todo el resto del contenido.

**Architecture:** Nuevo getter `firstMatch` en el store de matches. Nuevo composable `useCountdown` que maneja el `setInterval` con lifecycle hooks. Nuevo componente `CountdownCard` que renderiza la UI con animación slide+blur. `DashboardView` muestra el countdown condicionalmente, ocultando StatsGrid, live y upcoming.

**Tech Stack:** Vue 3 Composition API, Pinia, Vitest + @vue/test-utils, Tailwind CSS (tema oscuro custom), CSS keyframe animations.

---

## File Map

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Modify | `src/stores/matches.js` | Agregar getter `firstMatch` |
| Modify | `src/stores/__tests__/matches.test.js` | Test del getter `firstMatch` |
| Create | `src/composables/useCountdown.js` | Lógica del countdown con setInterval |
| Create | `src/composables/__tests__/useCountdown.test.js` | Tests del composable |
| Create | `src/components/dashboard/CountdownCard.vue` | UI del countdown con animación |
| Modify | `src/views/DashboardView.vue` | Renderizado condicional |

---

## Task 1: Getter `firstMatch` en el store

**Files:**
- Modify: `src/stores/matches.js`
- Modify: `src/stores/__tests__/matches.test.js`

- [ ] **Step 1: Agregar test que falla en `src/stores/__tests__/matches.test.js`**

Agregar dentro del `describe('useMatchesStore', ...)` existente:

```js
it('firstMatch devuelve el partido con la utcDate más temprana', () => {
  const store = useMatchesStore()
  store.allMatches = [
    m({ id: 2, utcDate: '2026-06-15T21:00:00Z' }),
    m({ id: 1, utcDate: '2026-06-11T21:00:00Z' }),
    m({ id: 3, utcDate: '2026-06-20T18:00:00Z' }),
  ]
  expect(store.firstMatch.id).toBe(1)
})

it('firstMatch devuelve null cuando no hay partidos', () => {
  const store = useMatchesStore()
  store.allMatches = []
  expect(store.firstMatch).toBeNull()
})
```

- [ ] **Step 2: Correr los tests para verificar que fallan**

```bash
npx vitest run src/stores/__tests__/matches.test.js
```

Esperado: FAIL — `store.firstMatch is not a function` o `Cannot read properties of undefined`.

- [ ] **Step 3: Implementar el getter en `src/stores/matches.js`**

Agregar dentro del objeto `getters:`, después del getter `pollingInterval`:

```js
firstMatch: (s) => s.allMatches.length
  ? [...s.allMatches].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))[0]
  : null,
```

- [ ] **Step 4: Correr los tests para verificar que pasan**

```bash
npx vitest run src/stores/__tests__/matches.test.js
```

Esperado: PASS — todos los tests incluyendo los 2 nuevos.

- [ ] **Step 5: Commit**

```bash
git add src/stores/matches.js src/stores/__tests__/matches.test.js
git commit -m "feat: add firstMatch getter to matches store"
```

---

## Task 2: Composable `useCountdown`

**Files:**
- Create: `src/composables/useCountdown.js`
- Create: `src/composables/__tests__/useCountdown.test.js`

- [ ] **Step 1: Crear el archivo de tests `src/composables/__tests__/useCountdown.test.js`**

```js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useCountdown } from '../useCountdown'

function withSetup(composable) {
  let result
  const wrapper = mount(defineComponent({
    setup() { result = composable(); return () => null },
    template: '<div />',
  }))
  return [result, wrapper]
}

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calcula días, horas, minutos y segundos correctamente', () => {
    const now = Date.now()
    vi.setSystemTime(now)
    const target = new Date(now + 7 * 86_400_000 + 14 * 3_600_000 + 23 * 60_000 + 45_000)
    const [result] = withSetup(() => useCountdown(target.toISOString()))
    expect(result.days.value).toBe(7)
    expect(result.hours.value).toBe(14)
    expect(result.minutes.value).toBe(23)
    expect(result.seconds.value).toBe(45)
    expect(result.done.value).toBe(false)
  })

  it('done es true cuando la fecha objetivo ya pasó', () => {
    const now = Date.now()
    vi.setSystemTime(now)
    const past = new Date(now - 1000)
    const [result] = withSetup(() => useCountdown(past.toISOString()))
    expect(result.done.value).toBe(true)
  })

  it('decrementa segundos después de 1 segundo', () => {
    const now = Date.now()
    vi.setSystemTime(now)
    const target = new Date(now + 65_000) // 1 min 5 seg
    const [result] = withSetup(() => useCountdown(target.toISOString()))
    expect(result.seconds.value).toBe(5)
    vi.advanceTimersByTime(1000)
    expect(result.seconds.value).toBe(4)
  })
})
```

- [ ] **Step 2: Correr los tests para verificar que fallan**

```bash
npx vitest run src/composables/__tests__/useCountdown.test.js
```

Esperado: FAIL — `Cannot find module '../useCountdown'`.

- [ ] **Step 3: Crear `src/composables/useCountdown.js`**

```js
import { ref, onMounted, onUnmounted } from 'vue'

export function useCountdown(targetDate) {
  const days = ref(0)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const done = ref(false)

  function tick() {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) {
      done.value = true
      days.value = hours.value = minutes.value = seconds.value = 0
      return
    }
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

- [ ] **Step 4: Correr los tests para verificar que pasan**

```bash
npx vitest run src/composables/__tests__/useCountdown.test.js
```

Esperado: PASS — los 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/composables/useCountdown.js src/composables/__tests__/useCountdown.test.js
git commit -m "feat: add useCountdown composable"
```

---

## Task 3: Componente `CountdownCard`

**Files:**
- Create: `src/components/dashboard/CountdownCard.vue`

- [ ] **Step 1: Crear `src/components/dashboard/CountdownCard.vue`**

```vue
<template>
  <div class="bg-surface border border-border rounded-xl p-6 text-center">
    <p class="text-text-muted text-[9px] font-semibold tracking-widest uppercase mb-5">
      ⚽ El torneo empieza en
    </p>
    <div class="flex items-start justify-center gap-2 mb-5">

      <div class="flex flex-col items-center">
        <div class="bg-surface-2 border border-border rounded-lg px-4 py-3 min-w-[56px]">
          <span :key="days" class="digit block text-3xl font-bold leading-none text-text">
            {{ String(days).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-text-disabled text-[8px] tracking-widest uppercase mt-1.5">días</span>
      </div>

      <span class="sep text-red text-2xl font-light pt-2.5 select-none">:</span>

      <div class="flex flex-col items-center">
        <div class="bg-surface-2 border border-border rounded-lg px-4 py-3 min-w-[56px]">
          <span :key="hours" class="digit block text-3xl font-bold leading-none text-text">
            {{ String(hours).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-text-disabled text-[8px] tracking-widest uppercase mt-1.5">hs</span>
      </div>

      <span class="sep text-red text-2xl font-light pt-2.5 select-none">:</span>

      <div class="flex flex-col items-center">
        <div class="bg-surface-2 border border-border rounded-lg px-4 py-3 min-w-[56px]">
          <span :key="minutes" class="digit block text-3xl font-bold leading-none text-text">
            {{ String(minutes).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-text-disabled text-[8px] tracking-widest uppercase mt-1.5">min</span>
      </div>

      <span class="sep text-red text-2xl font-light pt-2.5 select-none">:</span>

      <div class="flex flex-col items-center">
        <div class="bg-red/5 border border-red/30 rounded-lg px-4 py-3 min-w-[56px]">
          <span :key="seconds" class="digit block text-3xl font-bold leading-none text-red-light">
            {{ String(seconds).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-text-disabled text-[8px] tracking-widest uppercase mt-1.5">seg</span>
      </div>

    </div>
    <p class="text-text-disabled text-xs">
      {{ match.homeTeam?.shortName || match.homeTeam?.tla }}
      vs.
      {{ match.awayTeam?.shortName || match.awayTeam?.tla }}
      · {{ formatTime(match.utcDate) }} ARG
    </p>
  </div>
</template>

<script setup>
import { useCountdown } from '../../composables/useCountdown'
import { useArgTime } from '../../composables/useArgTime'

const props = defineProps({ match: { type: Object, required: true } })
const { days, hours, minutes, seconds } = useCountdown(props.match.utcDate)
const { formatTime } = useArgTime()
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateY(-60%);
    opacity: 0;
    filter: blur(4px);
  }
  to {
    transform: translateY(0);
    opacity: 1;
    filter: blur(0);
  }
}
.digit {
  animation: slideIn 0.25s ease-out;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.sep {
  animation: blink 1s ease-in-out infinite;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/CountdownCard.vue
git commit -m "feat: add CountdownCard component with slide+blur animation"
```

---

## Task 4: Integración en DashboardView

**Files:**
- Modify: `src/views/DashboardView.vue`

- [ ] **Step 1: Actualizar `src/views/DashboardView.vue`**

Reemplazar el contenido completo del archivo con:

```vue
<template>
  <div class="p-4 md:p-6 space-y-6 max-w-4xl">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-text font-bold text-xl">Dashboard</h1>
        <p class="text-text-muted text-xs mt-0.5">{{ todayStr }}</p>
      </div>
      <span v-if="store.liveMatches.length"
        class="bg-red/10 border border-red/40 text-red-light text-xs font-bold px-2 py-1 rounded">
        ● {{ store.liveMatches.length }} EN VIVO
      </span>
    </div>
    <LoadingSpinner v-if="store.isLoading && !store.allMatches.length" />
    <ErrorMessage v-else-if="store.error" :message="store.error" @retry="restart" />
    <template v-else>
      <CountdownCard v-if="showCountdown" :match="store.firstMatch" />
      <template v-else>
        <StatsGrid />
        <section v-if="store.liveMatches.length">
          <h2 class="text-text-muted text-[10px] font-semibold tracking-widest uppercase mb-3">En vivo</h2>
          <div class="grid md:grid-cols-2 gap-3">
            <LiveMatchCard v-for="m in store.liveMatches" :key="m.id" :match="m" />
          </div>
        </section>
        <section>
          <h2 class="text-text-muted text-[10px] font-semibold tracking-widest uppercase mb-3">Próximos</h2>
          <div v-if="store.upcomingMatches.length" class="space-y-2">
            <UpcomingMatch v-for="m in store.upcomingMatches" :key="m.id" :match="m" />
          </div>
          <p v-else class="text-text-disabled text-sm">No hay partidos próximos.</p>
        </section>
      </template>
    </template>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useMatchesStore } from '../stores/matches'
import { useScorersStore } from '../stores/scorers'
import { usePolling } from '../composables/usePolling'
import CountdownCard from '../components/dashboard/CountdownCard.vue'
import StatsGrid from '../components/dashboard/StatsGrid.vue'
import LiveMatchCard from '../components/dashboard/LiveMatchCard.vue'
import UpcomingMatch from '../components/dashboard/UpcomingMatch.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import ErrorMessage from '../components/shared/ErrorMessage.vue'

const store = useMatchesStore(); const sc = useScorersStore()

const todayStr = computed(() => new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Buenos_Aires', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
}).format(new Date()))

const showCountdown = computed(() => {
  const m = store.firstMatch
  return m?.status === 'SCHEDULED' && new Date(m.utcDate) > new Date()
})

const { restart } = usePolling(
  async () => { await store.fetchMatches(); await sc.fetchScorers() },
  () => store.pollingInterval
)
onMounted(restart)
</script>
```

- [ ] **Step 2: Correr todos los tests**

```bash
npx vitest run
```

Esperado: PASS — todos los tests existentes más los nuevos.

- [ ] **Step 3: Verificar visualmente con el dev server**

```bash
npm run dev
```

Abrir http://localhost:5173. Verificar:
- El countdown aparece en la parte superior del dashboard.
- Los dígitos se animan con slide+blur cada segundo.
- Los separadores `:` parpadean.
- No se muestran StatsGrid, partidos en vivo ni próximos.

- [ ] **Step 4: Commit final**

```bash
git add src/views/DashboardView.vue
git commit -m "feat: show countdown on dashboard before tournament starts"
```
