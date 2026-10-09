<template>
  <ReferenceComponentDemo
    title="Avatar"
    anchor="avatar"
    description="Displays a profile picture with automatic fallback to initials or custom content when the image fails to load."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceAvatar src="https://i.pravatar.cc/150?u=a" alt="User A" fallback="A" />
          <ReferenceAvatar src="https://i.pravatar.cc/150?u=b" alt="User B" fallback="B" />
          <ReferenceAvatar src="https://i.pravatar.cc/150?u=c" alt="User C" fallback="C" />
        </div>
        <div class="demo-label">With Images</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatar src="..." alt="User" fallback="U" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceAvatar fallback="A" />
          <ReferenceAvatar fallback="JD" />
          <ReferenceAvatar fallback="AB" color="success" />
          <ReferenceAvatar fallback="XY" color="warning" />
          <ReferenceAvatar fallback="Z" color="error" />
        </div>
        <div class="demo-label">Fallback Initials</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatar fallback="JD" color="success" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceAvatar fallback="S" variation="solid" />
          <ReferenceAvatar fallback="S" variation="soft" />
        </div>
        <div class="demo-label">Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatar fallback="S" variation="solid" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceAvatar fallback="A" variation="solid" />
          <ReferenceAvatar fallback="B" variation="solid" color="success" />
          <ReferenceAvatar fallback="C" variation="solid" color="warning" />
          <ReferenceAvatar fallback="D" variation="solid" color="error" />
          <ReferenceAvatar fallback="E" variation="solid" color="pencil" />
        </div>
        <div class="demo-label">Solid with Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatar fallback="B" variation="solid" color="success" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <UtensilTheme :radius-scale="1" class="demo-content">
          <ReferenceAvatar fallback="N" radius="none" />
          <ReferenceAvatar fallback="S" radius="small" />
          <ReferenceAvatar fallback="M" radius="medium" />
          <ReferenceAvatar fallback="L" radius="large" />
          <ReferenceAvatar fallback="F" radius="full" />
        </UtensilTheme>
        <div class="demo-label">Radius Options</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatar fallback="M" radius="medium" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content avatar-sizes">
          <ReferenceAvatar fallback="T" scale="tiny" />
          <ReferenceAvatar fallback="S" scale="small" />
          <ReferenceAvatar fallback="N" scale="normal" />
          <ReferenceAvatar fallback="L" scale="large" />
          <ReferenceAvatar fallback="G" scale="giant" />
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatar fallback="L" scale="large" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content controlled-demo">
          <div class="demo flex row gap-2">
            <ReferenceAvatar fallback="A" :scale="scaleAvatarScale" />
            <ReferenceAvatar fallback="B" :scale="scaleAvatarScale" variation="solid" color="success" />
          </div>
          <ReferenceRangeSlider
            class="control"
            v-model="scaleAvatarScale"
            label="Scale"
            label-placement="inline"
            :min="0.5"
            :max="2"
            :step="0.01"
          />
        </div>
        <div class="demo-label">Reactive Scale</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatar fallback="A" :scale="{{ scaleAvatarScale.toFixed(2) }}" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceAvatar src="https://invalid-url.example/404.jpg" fallback="?" />
          <ReferenceAvatar fallback="JD">
            <template #fallback>
              <ReferenceIcon icon="user" />
            </template>
          </ReferenceAvatar>
          <ReferenceAvatar variation="solid" color="success">
            <template #fallback>
              <ReferenceIcon icon="check" />
            </template>
          </ReferenceAvatar>
        </div>
        <div class="demo-label">Error Fallback & Custom Slot</div>
        <div class="demo-code">
          <code
            >&lt;UtensilAvatar&gt;&lt;template #fallback&gt;&lt;UtensilIcon icon="user"
            /&gt;&lt;/template&gt;&lt;/UtensilAvatar&gt;</code
          >
        </div>
      </div>
    </div>

    <template #api>
      <UtensilAvatarDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilTheme from '@gobistories/utensil-vue/theme/UtensilTheme.vue'
import UtensilAvatarDoc from '@gobistories/utensil-vue/components/avatar/UtensilAvatarDoc.vue'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
import { ReferenceIcon } from '@/theme/components/ReferenceIcon'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const scaleAvatarScale = ref(1)
</script>

<style scoped>
.demo-content:not(.controlled-demo) {
  min-height: 80px;
}

.demo-content.avatar-sizes {
  align-items: flex-end;
}
</style>
