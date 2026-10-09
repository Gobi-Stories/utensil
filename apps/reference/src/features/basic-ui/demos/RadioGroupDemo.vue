<template>
  <ReferenceComponentDemo
    title="Radio Group"
    anchor="radio-group"
    description="Grid of text buttons for selecting from a larger set of options. Only one option can be selected at a time."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioGroup v-model="gridPreset" aria-label="Date presets" class="justify-center">
            <ReferenceRadioGroupButton value="today" label="Today" />
            <ReferenceRadioGroupButton value="yesterday" label="Yesterday" />
            <ReferenceRadioGroupButton value="7d" label="Last 7 days" />
            <ReferenceRadioGroupButton value="30d" label="Last 30 days" />
            <ReferenceRadioGroupButton value="90d" label="Last 90 days" />
            <ReferenceRadioGroupButton value="year" label="This year" />
          </ReferenceRadioGroup>
        </div>
        <div class="demo-label">Basic (selected: {{ gridPreset }})</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioGroup&gt;&lt;UtensilRadioGroupButton /&gt;&lt;/UtensilRadioGroup&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioGroup v-model="gridVariation" variation="outline" aria-label="Outline demo">
            <ReferenceRadioGroupButton value="less" label="Less" />
            <ReferenceRadioGroupButton value="normal" label="Normal" />
            <ReferenceRadioGroupButton value="more" label="More" />
          </ReferenceRadioGroup>
        </div>
        <div class="demo-label">Outline Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioGroup variation="outline"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioGroup v-model="gridColor" color="success" aria-label="Color demo">
            <ReferenceRadioGroupButton value="low" label="Low" />
            <ReferenceRadioGroupButton value="medium" label="Medium" />
            <ReferenceRadioGroupButton value="high" label="High" />
          </ReferenceRadioGroup>
        </div>
        <div class="demo-label">Color</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioGroup color="success"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioGroup
            v-model:selection="gridTopics"
            multiple
            on-variation="solid"
            on-color="pen"
            off-variation="outline"
            off-color="pencil"
            aria-label="Topics"
          >
            <ReferenceRadioGroupButton value="news" label="News" />
            <ReferenceRadioGroupButton value="sport" label="Sport" />
            <ReferenceRadioGroupButton value="weather" label="Weather" />
          </ReferenceRadioGroup>
        </div>
        <div class="demo-label always-visible">Multiple. On: solid pen. Off: outline pencil</div>
        <div class="demo-code">
          <code
            >&lt;UtensilRadioGroup multiple on-variation="solid" on-color="pen" off-variation="outline"
            off-color="pencil"&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioGroup v-model="gridDisabled" disabled aria-label="Disabled demo">
            <ReferenceRadioGroupButton value="a" label="Option A" />
            <ReferenceRadioGroupButton value="b" label="Option B" />
            <ReferenceRadioGroupButton value="c" label="Option C" />
          </ReferenceRadioGroup>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioGroup disabled&gt;</code>
        </div>
      </div>
    </div>

    <div class="component-demo" id="segmented-frame">
      <h3><a class="demo-anchor" href="#segmented-frame">Segmented Frame</a></h3>
      <p>
        A segmented control look — inset frame with a raised selected option. Use for tight option sets (page size, view
        mode, status filter). Values are strings; coerce in the consumer for numeric models like page size.
      </p>
      <div class="demo-grid">
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioGroup frame="segmented" v-model="segmentedPageSize" aria-label="Page size">
              <ReferenceRadioGroupButton
                v-for="n in [25, 50, 100, 200]"
                :key="n"
                :value="String(n)"
                :label="String(n)"
              />
            </ReferenceRadioGroup>
          </div>
          <div class="demo-label">Page size (consumer coerces to Number: {{ Number(segmentedPageSize) }})</div>
          <div class="demo-code">
            <code>&lt;UtensilRadioGroupButton :value="String(n)" /&gt; with v-model="ref('50')"</code>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioGroup frame="segmented" v-model="segmentedView" aria-label="View mode">
              <ReferenceRadioGroupButton value="list" label="List" />
              <ReferenceRadioGroupButton value="board" label="Board" />
              <ReferenceRadioGroupButton value="calendar" label="Calendar" />
            </ReferenceRadioGroup>
          </div>
          <div class="demo-label">View mode</div>
          <div class="demo-code">
            <code>&lt;UtensilRadioGroup frame="segmented" v-model="view"&gt;</code>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioGroup frame="segmented" v-model="segmentedColor" color="success" aria-label="Color demo">
              <ReferenceRadioGroupButton value="low" label="Low" />
              <ReferenceRadioGroupButton value="medium" label="Medium" />
              <ReferenceRadioGroupButton value="high" label="High" />
            </ReferenceRadioGroup>
          </div>
          <div class="demo-label">Color (accent on selected via pen)</div>
          <div class="demo-code">
            <code>&lt;UtensilRadioGroup frame="segmented" color="success"&gt;</code>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioGroup
              frame="segmented"
              v-model="segmentedPeriod"
              color="success"
              aria-label="Color demo"
              invert
            >
              <ReferenceRadioGroupButton value="monthly" label="Monthly" />
              <ReferenceRadioGroupButton value="yearly" label="Yearly" />
            </ReferenceRadioGroup>
          </div>
          <div class="demo-label always-visible">Invert button and background colors</div>
          <div class="demo-code">
            <code>&lt;UtensilRadioGroup frame="segmented" invert&gt;</code>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioGroup
              frame="segmented"
              v-model="segmentedPackage"
              color="success"
              aria-label="Color demo"
              radiusScale="circle"
              invert
            >
              <ReferenceRadioGroupButton value="basic" label="Basic" />
              <ReferenceRadioGroupButton value="pro" label="Pro" />
              <ReferenceRadioGroupButton value="enterprise" label="Enterprise" />
            </ReferenceRadioGroup>
          </div>
          <div class="demo-label always-visible">Invert button and background colors</div>
          <div class="demo-code">
            <code>&lt;UtensilRadioGroup frame="segmented" invert&gt;</code>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioGroup frame="segmented" v-model="segmentedDisabled" disabled aria-label="Disabled segmented">
              <ReferenceRadioGroupButton value="a" label="Option A" />
              <ReferenceRadioGroupButton value="b" label="Option B" />
              <ReferenceRadioGroupButton value="c" label="Option C" />
            </ReferenceRadioGroup>
          </div>
          <div class="demo-label">Disabled</div>
          <div class="demo-code">
            <code>&lt;UtensilRadioGroup frame="segmented" disabled&gt;</code>
          </div>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilRadioGroupDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilRadioGroupDoc from '@gobistories/utensil-vue/components/radio-group/UtensilRadioGroupDoc.vue'
import { ReferenceRadioGroup } from '@/theme/components/ReferenceRadioGroup'
import { ReferenceRadioGroupButton } from '@/theme/components/ReferenceRadioGroupButton'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const gridPreset = ref('7d')
const gridVariation = ref('normal')
const gridColor = ref('medium')
const gridTopics = ref<string[]>(['news', 'weather'])
const gridDisabled = ref('b')
const segmentedPageSize = ref<string>('50')
const segmentedView = ref<string>('board')
const segmentedColor = ref<string>('medium')
const segmentedPeriod = ref<string>('monthly')
const segmentedPackage = ref<string>('enterprise')
const segmentedDisabled = ref<string>('b')
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}
</style>
