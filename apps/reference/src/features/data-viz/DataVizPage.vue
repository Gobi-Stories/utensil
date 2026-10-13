<template>
  <div class="demo-page">
    <DataVizDemo />
    <InteractiveDemo />
    <BaselineDemo />
    <LongSeriesDemo />
    <OptionsDemo />
  </div>
</template>

<script setup lang="ts">
import DataVizDemo from './demos/DataVizDemo.vue'
import InteractiveDemo from './demos/InteractiveDemo.vue'
import BaselineDemo from './demos/BaselineDemo.vue'
import LongSeriesDemo from './demos/LongSeriesDemo.vue'
import OptionsDemo from './demos/OptionsDemo.vue'
</script>
