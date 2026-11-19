<template>
  <ReferenceComponentDemo
    title="Listbox"
    anchor="listbox"
    description="The list of options under a select. It tracks the option the keyboard is on and scrolls it into view; its host drives it from the keyboard."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content listbox-demo">
          <span :id="labelId" class="listbox-demo-label">Fruit</span>
          <UtensilListbox
            ref="listbox"
            v-model:focused-value="focused"
            class="listbox-demo-list"
            :aria-labelledby="labelId"
            tabindex="0"
            :aria-activedescendant="listbox?.activeDescendant ?? undefined"
            @focus="focused ??= chosen"
            @keydown.down.prevent="listbox?.focusNext()"
            @keydown.up.prevent="listbox?.focusPrev()"
            @keydown.home.prevent="listbox?.focusFirst()"
            @keydown.end.prevent="listbox?.focusLast()"
            @keydown.enter.prevent="choose(focused)"
            @keydown.space.prevent="choose(focused)"
            @keydown="typeahead"
          >
            <template #default="{ setFocusedValue }">
              <ReferenceSelectOption
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                :selected="chosen === option.value"
                :focused="focused === option.value"
                :disabled="option.disabled"
                @click="choose(option.value)"
                @mouseenter="option.disabled || setFocusedValue(option.value)"
              />
            </template>
          </UtensilListbox>
          <div class="input-value">Chosen: "{{ chosen }}"</div>
        </div>
        <div class="demo-label">Arrow keys, Home and End move, typing jumps, Enter chooses</div>
      </div>
    </div>

    <template #api>
      <UtensilListboxDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import UtensilListbox from '@gobistories/utensil-vue/components/listbox/UtensilListbox.vue'
import UtensilListboxDoc from '@gobistories/utensil-vue/components/listbox/UtensilListboxDoc.vue'
import { ReferenceSelectOption } from '@/theme/components/ReferenceSelect'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry (out of season)', disabled: true },
  { value: 'date', label: 'Date' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'lemon', label: 'Lemon' },
]

const labelId = `listbox-demo-${useId()}`
const listbox = useTemplateRef<InstanceType<typeof UtensilListbox>>('listbox')
const focused = ref<string | null>(null)
const chosen = ref<string | null>('banana')

function choose(value: string | null) {
  if (value) chosen.value = value
}

function typeahead(event: KeyboardEvent) {
  if (event.key.length !== 1 || event.key === ' ' || event.ctrlKey || event.metaKey || event.altKey) return
  event.preventDefault()
  listbox.value?.typeahead(event.key)
}
</script>

<style scoped>
.listbox-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-2);
}

.listbox-demo-label {
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--pencil-11);
}

.listbox-demo-list {
  --utensil-listbox-max-height: 180px;

  border-radius: var(--radius-3);
  background-color: var(--panel-solid);
  box-shadow: inset 0 0 0 1px var(--pencil-a7);
}
</style>
