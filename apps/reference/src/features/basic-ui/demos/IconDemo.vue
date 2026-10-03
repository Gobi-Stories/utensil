<template>
  <ReferenceComponentDemo
    title="Icon"
    anchor="icon"
    description="Icon component supporting theme icons and custom SVGs."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content icon-demo">
          <UtensilIcon icon="star" color="pen" />
          <UtensilIcon icon="heart" color="pen" />
          <UtensilIcon icon="check" color="pen" />
          <UtensilIcon icon="times" color="pen" />
        </div>
        <div class="demo-label always-visible">Theme Icons</div>
        <div class="demo-code">
          <code>&lt;UtensilIcon icon="star" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content icon-demo">
          <UtensilIcon color="pen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
              <path
                d="M256 16C123.5 16 16 123.5 16 256s107.5 240 240 240 240-107.5 240-240S388.5 16 256 16zm115.8 187.8l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l55 55 119-119c9.4-9.4 24.6-9.4 33.9 0 9.5 9.3 9.5 24.5.1 33.9z"
              />
            </svg>
          </UtensilIcon>
          <UtensilIcon color="pen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
              <path
                d="M443.3 100.7c-6.2-6.2-16.4-6.2-22.6 0L176 345.4 91.3 260.7c-6.2-6.2-16.4-6.2-22.6 0l-34 34c-6.2 6.2-6.2 16.4 0 22.6l118.7 118.7c6.2 6.2 16.4 6.2 22.6 0l278.7-278.7c6.2-6.2 6.2-16.4 0-22.6l-11.4-34z"
              />
            </svg>
          </UtensilIcon>
          <UtensilIcon color="pen">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </UtensilIcon>
        </div>
        <div class="demo-label always-visible">Custom SVG Icons</div>
        <div class="demo-code">
          <code>&lt;UtensilIcon&gt;&lt;svg&gt;...&lt;/svg&gt;&lt;/UtensilIcon&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilIconDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilIcon from 'utensil-vue/components/icon/UtensilIcon.vue'
import UtensilIconDoc from 'utensil-vue/components/icon/UtensilIconDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}

.icon-demo {
  font-size: 1.5rem;
  min-height: 140px;
}
</style>
