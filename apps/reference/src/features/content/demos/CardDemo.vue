<template>
  <ReferenceComponentDemo title="Card" anchor="card" description="Container that groups related content and actions.">
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content card-demo">
          <ReferenceCard variation="surface">
            <div class="profile-card">
              <ReferenceAvatar src="https://i.pravatar.cc/150?u=sofia" alt="Sofia Chen" fallback="SC" />
              <div class="profile-info">
                <div class="profile-name">Sofia Chen</div>
                <div class="profile-email">sofia.chen@example.com</div>
              </div>
            </div>
          </ReferenceCard>
        </div>
        <div class="demo-label">Profile Card</div>
        <div class="demo-code">
          <code>&lt;UtensilCard&gt;&lt;Avatar /&gt; Name &amp; email&lt;/UtensilCard&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content card-demo">
          <ReferenceCard variation="solid">
            <p>Solid variation.</p>
          </ReferenceCard>
          <ReferenceCard variation="soft">
            <p>Soft variation.</p>
          </ReferenceCard>
          <ReferenceCard variation="surface">
            <p>Surface variation.</p>
          </ReferenceCard>
          <ReferenceCard variation="outline">
            <p>Outline variation.</p>
          </ReferenceCard>
          <ReferenceCard variation="unstyled" style="box-shadow: var(--shadow-border-3)">
            <p>Unstyled variation.<br />Shadow added externally.</p>
          </ReferenceCard>
        </div>
        <div class="demo-label">Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilCard variation="outline"&gt;...&lt;/UtensilCard&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content card-demo">
          <ReferenceCard variation="solid" highlighted>
            <p>Solid highlighted.</p>
          </ReferenceCard>
          <ReferenceCard variation="soft" highlighted>
            <p>Soft highlighted.</p>
          </ReferenceCard>
          <ReferenceCard variation="surface" highlighted>
            <p>Surface highlighted.</p>
          </ReferenceCard>
          <ReferenceCard variation="outline" highlighted>
            <p>Outline highlighted.</p>
          </ReferenceCard>
        </div>
        <div class="demo-label always-visible">Highlighted</div>
        <div class="demo-code">
          <code>&lt;UtensilCard variation="surface" highlighted&gt;...&lt;/UtensilCard&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content card-demo">
          <ReferenceCard variation="solid" interactive>
            <p>Solid interactive.</p>
          </ReferenceCard>
          <ReferenceCard variation="soft" interactive>
            <p>Soft interactive.</p>
          </ReferenceCard>
          <ReferenceCard variation="surface" interactive>
            <p>Surface interactive.</p>
          </ReferenceCard>
          <ReferenceCard variation="outline" interactive>
            <p>Outline interactive.</p>
          </ReferenceCard>
        </div>
        <div class="demo-label always-visible">Interactive</div>
        <div class="demo-code">
          <code>&lt;UtensilCard variation="surface" interactive&gt;...&lt;/UtensilCard&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content card-demo">
          <ReferenceCard variation="solid" interactive highlighted>
            <p>Solid interactive.</p>
          </ReferenceCard>
          <ReferenceCard variation="soft" interactive highlighted>
            <p>Soft interactive.</p>
          </ReferenceCard>
          <ReferenceCard variation="surface" interactive highlighted>
            <p>Surface interactive.</p>
          </ReferenceCard>
          <ReferenceCard variation="outline" interactive highlighted>
            <p>Outline interactive.</p>
          </ReferenceCard>
        </div>
        <div class="demo-label always-visible">Interactive Highlighted</div>
        <div class="demo-code">
          <code>&lt;UtensilCard variation="surface" interactive highlighted&gt;...&lt;/UtensilCard&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content card-demo">
          <ReferenceCard color="success" variation="surface" highlighted>
            <p>Success colored card.</p>
          </ReferenceCard>
          <ReferenceCard color="warning" variation="surface" highlighted>
            <p>Warning colored card.</p>
          </ReferenceCard>
          <ReferenceCard color="error" variation="surface" highlighted>
            <p>Error colored card.</p>
          </ReferenceCard>
        </div>
        <div class="demo-label">Semantic Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilCard color="success"&gt;...&lt;/UtensilCard&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content card-demo">
          <ReferenceCard scale="small" variation="surface">
            <p>Small scale card.</p>
          </ReferenceCard>
          <ReferenceCard variation="surface">
            <p>Normal scale card.</p>
          </ReferenceCard>
          <ReferenceCard scale="large" variation="surface">
            <p>Large scale card.</p>
          </ReferenceCard>
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilCard scale="large"&gt;...&lt;/UtensilCard&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content card-demo controlled-demo">
          <div class="demo">
            <ReferenceCard :scale="scaleCardScale" variation="surface">
              <p>Scalable card component with reactive sizing.</p>
            </ReferenceCard>
          </div>
          <ReferenceRangeSlider class="control" v-model="scaleCardScale" :min="0.7" :max="1.5" :step="0.01" />
        </div>
        <div class="demo-label">Reactive Scale</div>
        <div class="demo-code">
          <code>&lt;UtensilCard :scale="{{ scaleCardScale.toFixed(2) }}"&gt;...&lt;/UtensilCard&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilCardDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilCardDoc from 'utensil-vue/components/card/UtensilCardDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceCard } from '@/theme/components/ReferenceCard'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'

const scaleCardScale = ref(1)
</script>

<style scoped>
.demo-content.card-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-3);
}

.demo-content.card-demo p {
  margin: 0;
}

.profile-card {
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
