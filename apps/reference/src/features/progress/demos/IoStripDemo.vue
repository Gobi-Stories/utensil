<template>
  <ReferenceComponentDemo
    title="IO Strip"
    anchor="io-strip"
    description="Slim io activity strip that grows out to ~30%, creeps, then shoots to the end when the io completes."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content io-strip-demo">
          <div class="io-strip-frame">
            <div class="io-strip-header">
              <span>App header</span>
              <UtensilButton scale="small" :disabled="loadingStripActive" @click="simulateRouteLoad(1800)">
                Load a page
              </UtensilButton>
            </div>
            <ReferenceIoStrip :active="loadingStripActive" ariaLabel="Loading page" />
            <div class="io-strip-content">Main content</div>
          </div>
        </div>
        <div class="demo-label always-visible">Between Header and Content</div>
        <div class="demo-code">
          <code>&lt;UtensilIoStrip :active="routeLoading" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content io-strip-demo">
          <div class="io-strip-frame">
            <div class="io-strip-header">
              <span>Slow load</span>
              <UtensilButton scale="small" :disabled="slowStripActive" @click="simulateSlowLoad(8000)">
                Load slowly
              </UtensilButton>
            </div>
            <ReferenceIoStrip :active="slowStripActive" color="success" ariaLabel="Loading page" />
            <div class="io-strip-content">The fill creeps while a slow page loads</div>
          </div>
        </div>
        <div class="demo-label always-visible">Slow Load Creep + Color</div>
        <div class="demo-code">
          <code>&lt;UtensilIoStrip :active="routeLoading" color="success" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content io-strip-demo">
          <div class="io-strip-frame">
            <div class="io-strip-header">
              <span>Reported progress</span>
              <UtensilButton scale="small" :disabled="stepsStripActive" @click="simulateSteps(6)">
                Run 6 steps
              </UtensilButton>
            </div>
            <ReferenceIoStrip
              :active="stepsStripActive"
              :progress="stepsProgress"
              color="success"
              ariaLabel="Processing"
            />
            <div class="io-strip-content">The fill follows the reported progress instead of creeping</div>
          </div>
        </div>
        <div class="demo-label always-visible">Reported Progress</div>
        <div class="demo-code">
          <code>&lt;UtensilIoStrip :active="processing" :progress="done / total" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content io-strip-demo">
          <div class="io-strip-frame">
            <div class="io-strip-header">
              <span>Static gradient</span>
              <UtensilButton scale="small" :disabled="gradientStripActive" @click="simulateGradientLoad(8000)">
                Load
              </UtensilButton>
            </div>
            <ReferenceIoStrip
              :active="gradientStripActive"
              color="primary"
              endColor="favorite"
              ariaLabel="Loading page"
            />
            <div class="io-strip-content">Progress reveals more of the gradient</div>
          </div>
        </div>
        <div class="demo-label always-visible">Gradient</div>
        <div class="demo-code">
          <code>&lt;UtensilIoStrip :active="routeLoading" color="primary" endColor="favorite" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content io-strip-demo">
          <div class="io-strip-frame">
            <div class="io-strip-header">
              <span>Progressive gradient</span>
              <UtensilButton scale="small" :disabled="progressiveStripActive" @click="simulateProgressiveLoad(8000)">
                Load
              </UtensilButton>
            </div>
            <ReferenceIoStrip
              :active="progressiveStripActive"
              color="primary"
              endColor="favorite"
              gradientMode="progressive"
              ariaLabel="Loading page"
            />
            <div class="io-strip-content">The solid fill blends towards the end color as progress increases</div>
          </div>
        </div>
        <div class="demo-label always-visible">Progressive Gradient</div>
        <div class="demo-code">
          <code>&lt;UtensilIoStrip … endColor="favorite" gradientMode="progressive" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilIoStripDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceIoStrip } from '@/theme/components/ReferenceIoStrip'
import UtensilIoStripDoc from 'utensil-vue/components/progress/UtensilIoStripDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'

const loadingStripActive = ref(false)
const slowStripActive = ref(false)
let loadingStripTimeout: ReturnType<typeof setTimeout> | null = null
let slowStripTimeout: ReturnType<typeof setTimeout> | null = null

function simulateRouteLoad(duration: number) {
  loadingStripActive.value = true
  loadingStripTimeout = setTimeout(() => {
    loadingStripActive.value = false
  }, duration)
}

function simulateSlowLoad(duration: number) {
  slowStripActive.value = true
  slowStripTimeout = setTimeout(() => {
    slowStripActive.value = false
  }, duration)
}

const stepsStripActive = ref(false)
const stepsProgress = ref<number | undefined>(undefined)

// Steps land every half second; the strip fills a step at a time
async function simulateSteps(total: number) {
  stepsStripActive.value = true
  stepsProgress.value = 0

  for (let step = 1; step <= total; step++) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    stepsProgress.value = step / total
  }

  stepsStripActive.value = false
  stepsProgress.value = undefined
}

const gradientStripActive = ref(false)
const progressiveStripActive = ref(false)
let gradientStripTimeout: ReturnType<typeof setTimeout> | null = null
let progressiveStripTimeout: ReturnType<typeof setTimeout> | null = null

function simulateGradientLoad(duration: number) {
  gradientStripActive.value = true
  gradientStripTimeout = setTimeout(() => {
    gradientStripActive.value = false
  }, duration)
}

function simulateProgressiveLoad(duration: number) {
  progressiveStripActive.value = true
  progressiveStripTimeout = setTimeout(() => {
    progressiveStripActive.value = false
  }, duration)
}

onBeforeUnmount(() => {
  if (loadingStripTimeout) {
    clearTimeout(loadingStripTimeout)
  }
  if (slowStripTimeout) {
    clearTimeout(slowStripTimeout)
  }
  if (gradientStripTimeout) {
    clearTimeout(gradientStripTimeout)
  }
  if (progressiveStripTimeout) {
    clearTimeout(progressiveStripTimeout)
  }
})
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.io-strip-demo {
  min-height: 140px;
  display: flex;
  align-items: stretch;
}

.io-strip-frame {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-3);
  overflow: hidden;
}

.io-strip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background-color: var(--pencil-2);
  color: var(--pencil-a11);
  font-size: var(--font-size-2);
}

.io-strip-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  color: var(--pencil-a11);
  font-size: var(--font-size-2);
}
</style>
