<template>
  <div class="utensil-context-menu-area" @contextmenu.prevent="onContextMenu" @click="onClick">
    <slot />
  </div>
  <UtensilContextMenu ref="menuRef" :position="position">
    <template #default="slotProps">
      <slot name="menu" v-bind="slotProps" />
    </template>
  </UtensilContextMenu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilContextMenu from './UtensilContextMenu.vue'
import type { Position } from '../popover/utensil-popover-positioned'

interface Props {
  /** Which mouse button triggers the menu: 'right' for right-click, 'left' for left-click */
  button?: 'right' | 'left'
}

const props = withDefaults(defineProps<Props>(), {
  button: 'right',
})

const menuRef = ref<InstanceType<typeof UtensilContextMenu>>()
const position = ref<Position>({ x: 0, y: 0 })

function onContextMenu(event: MouseEvent) {
  if (props.button !== 'right') return
  position.value = { x: event.clientX, y: event.clientY }
  menuRef.value?.forceOpen()
}

function onClick(event: MouseEvent) {
  if (props.button !== 'left') return
  position.value = { x: event.clientX, y: event.clientY }
  menuRef.value?.forceOpen()
}

defineExpose({
  open: () => menuRef.value?.open(),
  close: () => menuRef.value?.close(),
  toggle: () => menuRef.value?.toggle(),
  forceOpen: () => menuRef.value?.forceOpen(),
  get isOpen() {
    return menuRef.value?.isOpen
  },
})
</script>

<style scoped>
@layer utensil {
  .utensil-context-menu-area {
    display: contents;
  }
}
</style>
