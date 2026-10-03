<template>
  <ReferenceComponentDemo
    title="Item Stack"
    anchor="item-stack"
    description="Vertical stack that animates items in and out — gaps open and close as items come and go."
  >
    <div class="flex column align-start gap-4">
      <ReferenceButton variation="soft" scale="small" @click="addStackItem">Add item</ReferenceButton>
      <UtensilItemStack class="item-stack-demo">
        <div v-for="item in stackItems" :key="item" class="item-stack-demo-card">
          <span>{{ item }}</span>
          <ReferenceButton variation="text" scale="small" @click="removeStackItem(item)">Dismiss</ReferenceButton>
        </div>
      </UtensilItemStack>
    </div>

    <template #api>
      <UtensilItemStackDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilItemStack from 'utensil-vue/components/item-stack/UtensilItemStack.vue'
import UtensilItemStackDoc from 'utensil-vue/components/item-stack/UtensilItemStackDoc.vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

let stackItemNumber = 3
const stackItems = ref(['Item 1', 'Item 2', 'Item 3'])

function addStackItem() {
  stackItemNumber += 1

  // Insert at a random position so gaps also open mid-stack
  const index = Math.floor(Math.random() * (stackItems.value.length + 1))
  stackItems.value.splice(index, 0, `Item ${stackItemNumber}`)
}

function removeStackItem(item: string) {
  stackItems.value = stackItems.value.filter((candidate) => candidate !== item)
}
</script>

<style scoped>
.item-stack-demo {
  width: 320px;
}

.item-stack-demo-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-3);
  background-color: var(--pencil-a3);
  font-size: var(--font-size-2);
}
</style>
