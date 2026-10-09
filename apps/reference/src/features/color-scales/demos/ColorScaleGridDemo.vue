<template>
  <div class="component-demo">
    <UtensilColorScaleGrid>
      <ReferenceColorScale color="custom-pen" label="Current Pen" instrument="pen" />
      <ReferenceColorScale color="custom-pencil" label="Current Pencil" instrument="pencil" />
      <ReferenceColorScale color="custom-paper" label="Current Paper" instrument="paper" />
      <ReferenceColorScale color="blue" instrument="pen" />
      <ReferenceColorScale color="blue" instrument="pencil" />
      <ReferenceColorScale color="green" instrument="pen" />
      <ReferenceColorScale color="green" instrument="pencil" />
      <ReferenceColorScale color="orange" instrument="pen" />
      <ReferenceColorScale color="orange" instrument="pencil" />
      <ReferenceColorScale color="pink" instrument="pen" />
      <ReferenceColorScale color="pink" instrument="pencil" />
      <ReferenceColorScale color="red" instrument="pen" />
      <ReferenceColorScale color="red" instrument="pencil" />
      <ReferenceColorScale color="grey" instrument="pen" />
      <ReferenceColorScale color="grey" instrument="pencil" />
    </UtensilColorScaleGrid>
  </div>
</template>

<script setup lang="ts">
import UtensilColorScaleGrid from '@gobistories/utensil-vue/components/color-scale/UtensilColorScaleGrid.vue'
import { ReferenceColorScale } from '@/theme/components/ReferenceColorScale'
</script>
