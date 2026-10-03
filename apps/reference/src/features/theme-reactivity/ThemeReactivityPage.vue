<template>
  <div class="demo-page">
    <ParentContextDemo />
    <ChildOverridesDemo />
    <NestedChainDemo />
    <VariantRemapDemo />
    <UseThemeComposableDemo />
    <ScaleAndRadiusDemo />
    <MountBenchmarkDemo />
  </div>
</template>

<script setup lang="ts">
import ParentContextDemo from './demos/ParentContextDemo.vue'
import ChildOverridesDemo from './demos/ChildOverridesDemo.vue'
import NestedChainDemo from './demos/NestedChainDemo.vue'
import VariantRemapDemo from './demos/VariantRemapDemo.vue'
import UseThemeComposableDemo from './demos/UseThemeComposableDemo.vue'
import ScaleAndRadiusDemo from './demos/ScaleAndRadiusDemo.vue'
import MountBenchmarkDemo from './demos/MountBenchmarkDemo.vue'
</script>
