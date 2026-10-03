<template>
  <slot></slot>
  <div ref="modalHostRef" class="utensil-modal-host"></div>
</template>

<script setup lang="ts">
import { shallowRef, provide } from 'vue'
import { utensilRootElementKey } from '../../utensil-keys'

const modalHostRef = shallowRef<HTMLElement>()

// Provide the ref directly - useModalHost returns refs consistently
provide(utensilRootElementKey, modalHostRef)
</script>
