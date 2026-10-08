<template>
  <ReferenceComponentDemo
    title="Box"
    anchor="box"
    description="A styled container with edges, highlighted, interactive and disabled states, and no layout of its own."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox variation="surface">
            <div class="profile-box">
              <ReferenceAvatar src="https://i.pravatar.cc/150?u=sofia" alt="Sofia Chen" fallback="SC" />
              <div class="profile-info">
                <div class="profile-name">Sofia Chen</div>
                <div class="profile-email">sofia.chen@example.com</div>
              </div>
            </div>
          </ReferenceBox>
        </div>
        <div class="demo-label">Profile Box</div>
        <div class="demo-code">
          <code>&lt;UtensilBox&gt;&lt;Avatar /&gt; Name &amp; email&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox variation="solid">
            <p>Solid variation.</p>
          </ReferenceBox>
          <ReferenceBox variation="soft">
            <p>Soft variation.</p>
          </ReferenceBox>
          <ReferenceBox variation="surface">
            <p>Surface variation.</p>
          </ReferenceBox>
          <ReferenceBox variation="outline">
            <p>Outline variation.</p>
          </ReferenceBox>
          <ReferenceBox variation="unstyled" style="box-shadow: var(--shadow-border-3)">
            <p>Unstyled variation.<br />Shadow added externally.</p>
          </ReferenceBox>
        </div>
        <div class="demo-label">Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilBox variation="outline"&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox variation="solid" highlighted>
            <p>Solid highlighted.</p>
          </ReferenceBox>
          <ReferenceBox variation="soft" highlighted>
            <p>Soft highlighted.</p>
          </ReferenceBox>
          <ReferenceBox variation="surface" highlighted>
            <p>Surface highlighted.</p>
          </ReferenceBox>
          <ReferenceBox variation="outline" highlighted>
            <p>Outline highlighted.</p>
          </ReferenceBox>
        </div>
        <div class="demo-label always-visible">Highlighted</div>
        <div class="demo-code">
          <code>&lt;UtensilBox variation="surface" highlighted&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox as="button" variation="solid" interactive>
            <p>Solid interactive.</p>
          </ReferenceBox>
          <ReferenceBox as="button" variation="soft" interactive>
            <p>Soft interactive.</p>
          </ReferenceBox>
          <ReferenceBox as="button" variation="surface" interactive>
            <p>Surface interactive.</p>
          </ReferenceBox>
          <ReferenceBox as="button" variation="outline" interactive>
            <p>Outline interactive.</p>
          </ReferenceBox>
        </div>
        <div class="demo-label always-visible">Interactive</div>
        <div class="demo-code">
          <code>&lt;UtensilBox as="button" variation="surface" interactive&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox as="button" variation="solid" interactive highlighted>
            <p>Solid interactive.</p>
          </ReferenceBox>
          <ReferenceBox as="button" variation="soft" interactive highlighted>
            <p>Soft interactive.</p>
          </ReferenceBox>
          <ReferenceBox as="button" variation="surface" interactive highlighted>
            <p>Surface interactive.</p>
          </ReferenceBox>
          <ReferenceBox as="button" variation="outline" interactive highlighted>
            <p>Outline interactive.</p>
          </ReferenceBox>
        </div>
        <div class="demo-label always-visible">Interactive Highlighted</div>
        <div class="demo-code">
          <code>&lt;UtensilBox as="button" variation="surface" interactive highlighted&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox color="success" variation="surface" highlighted>
            <p>Success colored box.</p>
          </ReferenceBox>
          <ReferenceBox color="warning" variation="surface" highlighted>
            <p>Warning colored box.</p>
          </ReferenceBox>
          <ReferenceBox color="error" variation="surface" highlighted>
            <p>Error colored box.</p>
          </ReferenceBox>
        </div>
        <div class="demo-label">Semantic Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilBox color="success"&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox :shadow="2">
            <p>Shadow border: edges and elevation.</p>
          </ReferenceBox>
          <ReferenceBox :shadow="2" highlighted>
            <p>Highlighted shadow border, with a pen edge.</p>
          </ReferenceBox>
          <ReferenceBox variation="surface" :elevation="3">
            <p>Elevation, keeping the surface border.</p>
          </ReferenceBox>
          <ReferenceBox as="button" variation="surface" :elevation="2" interactive>
            <p>Interactive elevation rises on hover.</p>
          </ReferenceBox>
        </div>
        <div class="demo-label always-visible">Shadow &amp; Elevation</div>
        <div class="demo-code">
          <code>&lt;UtensilBox variation="surface" :elevation="3"&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox
            v-for="option in boxOptions"
            :key="option"
            as="button"
            variation="surface"
            interactive
            :selected="boxChosen.includes(option)"
            @click="toggleBoxOption(option)"
          >
            <p>{{ option }}</p>
          </ReferenceBox>
        </div>
        <div class="demo-label always-visible">Selected</div>
        <div class="demo-code">
          <code>&lt;UtensilBox as="button" interactive :selected="chosen"&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox clickable :shadow="2" @click="boxClicks++">
            <h4 class="box-title">Clickable box</h4>
            <p>Block content a button can't hold. Clicked {{ boxClicks }} times.</p>
          </ReferenceBox>
          <ReferenceBox clickable :shadow="2" disabled @click="boxClicks++">
            <h4 class="box-title">Disabled</h4>
            <p>Muted, and blocks clicks.</p>
          </ReferenceBox>
          <ReferenceBox as="a" href="#box" variation="surface" interactive>
            <p>A link box.</p>
          </ReferenceBox>
          <ReferenceBox as="a" href="#box" variation="surface" disabled>
            <p>A disabled link box drops its href.</p>
          </ReferenceBox>
        </div>
        <div class="demo-label always-visible">Clickable, Links &amp; Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilBox clickable :disabled="!available" @click="choose"&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo">
          <ReferenceBox scale="small" variation="surface">
            <p>Small scale box.</p>
          </ReferenceBox>
          <ReferenceBox variation="surface">
            <p>Normal scale box.</p>
          </ReferenceBox>
          <ReferenceBox scale="large" variation="surface">
            <p>Large scale box.</p>
          </ReferenceBox>
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilBox scale="large"&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content box-demo controlled-demo">
          <div class="demo">
            <ReferenceBox :scale="scaleBoxScale" variation="surface">
              <p>Scalable box with reactive sizing.</p>
            </ReferenceBox>
          </div>
          <ReferenceRangeSlider class="control" v-model="scaleBoxScale" :min="0.7" :max="1.5" :step="0.01" />
        </div>
        <div class="demo-label">Reactive Scale</div>
        <div class="demo-code">
          <code>&lt;UtensilBox :scale="{{ scaleBoxScale.toFixed(2) }}"&gt;...&lt;/UtensilBox&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilBoxDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilBoxDoc from 'utensil-vue/components/box/UtensilBoxDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceBox } from '@/theme/components/ReferenceBox'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'

const scaleBoxScale = ref(1)
const boxOptions = ['Include captions', 'Add music']
const boxChosen = ref<string[]>(['Include captions'])
const boxClicks = ref(0)

function toggleBoxOption(option: string) {
  boxChosen.value = boxChosen.value.includes(option)
    ? boxChosen.value.filter((chosen) => chosen !== option)
    : [...boxChosen.value, option]
}
</script>

<style scoped>
.demo-content.box-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-3);
}

.demo-content.box-demo p {
  margin: 0;
}

.box-title {
  margin: 0 0 var(--space-1);
  font-size: var(--font-size-3);
}

.profile-box {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-weight: 500;
}

.profile-email {
  font-size: var(--font-size-2);
  color: var(--pencil-11);
}
</style>
