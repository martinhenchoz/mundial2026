<template>
  <div class="bg-surface border border-border rounded-xl overflow-hidden">
    <div class="flex flex-col md:flex-row min-h-[340px] md:min-h-[380px]">

      <!-- Image panel — solid black, PNG with transparency -->
      <div class="relative w-full md:w-[48%] flex-shrink-0 bg-black aspect-[3/2] md:aspect-auto overflow-hidden">
        <Transition :name="slideClass" mode="out-in">
          <img
            :key="current.num"
            :src="current.img"
            :alt="current.city"
            class="absolute inset-0 w-full h-full object-contain"
          />
        </Transition>
      </div>

      <!-- Info panel -->
      <div class="flex flex-col justify-between flex-1 p-6 border-t md:border-t-0 md:border-l border-border relative overflow-hidden">

        <!-- Ghost number decoration -->
        <span class="ghost-num" aria-hidden="true">{{ String(idx + 1).padStart(2, '0') }}</span>

        <p class="text-text-muted text-[9px] font-semibold tracking-[0.2em] uppercase">
          Posters Oficiales · FIFA World Cup 2026
        </p>

        <!-- City info -->
        <Transition name="fade" mode="out-in">
          <div :key="current.num" class="flex-1 flex flex-col justify-center py-4">
            <p class="city-meta">{{ current.meta }}</p>
            <h2 class="city-name" v-html="current.cityHtml" />
            <p class="mt-3 text-[11px] text-text-disabled tracking-[0.04em]">{{ current.country }}</p>
          </div>
        </Transition>

        <!-- Navigation -->
        <div>
          <div class="h-px mb-4" style="background: linear-gradient(to right, rgba(192,40,30,.35), transparent)" />
          <div class="flex items-center gap-[14px] mb-3">
            <button class="nav-btn" @click="navigate(-1)" aria-label="Anterior">
              <ChevronLeft :size="15" :stroke-width="2.2" />
            </button>
            <span class="text-[12px] text-text-muted tabular-nums tracking-[0.08em]">
              {{ String(idx + 1).padStart(2, '0') }} / 17
            </span>
            <button class="nav-btn" @click="navigate(1)" aria-label="Siguiente">
              <ChevronRight :size="15" :stroke-width="2.2" />
            </button>
          </div>
          <!-- Progress bar -->
          <div class="h-[2px] bg-border rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-[width] duration-[380ms] ease-[cubic-bezier(.25,.46,.45,.94)]"
              style="background: linear-gradient(to right, #c0281e, #e8503a)"
              :style="{ width: progressWidth }"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const POSTERS = [
  { num: '01', city: 'Mundial 2026',     cityHtml: 'Mundial<br>2026',      meta: 'Póster Oficial',    country: 'FIFA'           },
  { num: '02', city: 'Atlanta',          cityHtml: 'Atlanta',              meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '03', city: 'Boston',           cityHtml: 'Boston',               meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '04', city: 'Dallas',           cityHtml: 'Dallas',               meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '05', city: 'Guadalajara',      cityHtml: 'Guadalajara',          meta: 'Ciudad Anfitriona', country: 'México'          },
  { num: '06', city: 'Houston',          cityHtml: 'Houston',              meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '07', city: 'Kansas City',      cityHtml: 'Kansas<br>City',       meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '08', city: 'Los Ángeles',      cityHtml: 'Los<br>Ángeles',       meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '09', city: 'Ciudad de México', cityHtml: 'Ciudad<br>de México',  meta: 'Ciudad Anfitriona', country: 'México'          },
  { num: '10', city: 'Miami',            cityHtml: 'Miami',                meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '11', city: 'Monterrey',        cityHtml: 'Monterrey',            meta: 'Ciudad Anfitriona', country: 'México'          },
  { num: '12', city: 'Nueva York',       cityHtml: 'Nueva<br>York',        meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '13', city: 'Filadelfia',       cityHtml: 'Filadelfia',           meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '14', city: 'San Francisco',    cityHtml: 'San<br>Francisco',     meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '15', city: 'Seattle',          cityHtml: 'Seattle',              meta: 'Ciudad Anfitriona', country: 'Estados Unidos'  },
  { num: '16', city: 'Toronto',          cityHtml: 'Toronto',              meta: 'Ciudad Anfitriona', country: 'Canadá'          },
  { num: '17', city: 'Vancouver',        cityHtml: 'Vancouver',            meta: 'Ciudad Anfitriona', country: 'Canadá'          },
].map(p => ({ ...p, img: `/posters/poster-${p.num}.png` }))

const idx       = ref(0)
const direction = ref(1)

const current      = computed(() => POSTERS[idx.value])
const slideClass   = computed(() => direction.value > 0 ? 'slide-left' : 'slide-right')
const progressWidth = computed(() => ((idx.value + 1) / 17 * 100).toFixed(2) + '%')

function navigate(dir) {
  direction.value = dir
  idx.value = ((idx.value + dir) + 17) % 17
}

function onKey(e) {
  if (e.key === 'ArrowRight') navigate(1)
  if (e.key === 'ArrowLeft')  navigate(-1)
}

onMounted(()   => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* Ghost number */
.ghost-num {
  position: absolute;
  right: -4px;
  bottom: -20px;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 140px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.03);
  line-height: 1;
  user-select: none;
  pointer-events: none;
}

/* City meta line */
.city-meta {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.city-meta::before {
  content: '';
  display: inline-block;
  width: 18px;
  height: 1px;
  background: #c0281e;
  flex-shrink: 0;
}

/* City name */
.city-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3.1rem);
  font-weight: 900;
  color: #f0f0f0;
  line-height: 1.05;
  letter-spacing: -0.01em;
}

/* Navigation buttons */
.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
  background: transparent;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  padding: 0;
}
.nav-btn:hover {
  color: #f0f0f0;
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
}
.nav-btn:active { transform: scale(0.91); }

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.3s ease, transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-left-enter-from  { opacity: 0; transform: translateX(28px) scale(1.04); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-28px) scale(1.04); }
.slide-right-enter-from { opacity: 0; transform: translateX(-28px) scale(1.04); }
.slide-right-leave-to   { opacity: 0; transform: translateX(28px) scale(1.04); }

/* Fade for text */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease, transform 0.28s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; transform: translateY(8px); }
</style>
