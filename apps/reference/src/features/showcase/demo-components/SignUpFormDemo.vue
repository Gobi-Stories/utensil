<template>
  <div class="signup-form-demo">
    <h3 class="card-title">Sign up</h3>

    <form class="signup-form" autocomplete="nope" @submit.prevent>
      <UtensilInput label="Full name" placeholder="Enter your name" :variation="inputVariation" />
      <UtensilInput label="Email" placeholder="Enter your email" :variation="inputVariation" icon="envelope" />
      <UtensilPassword label="Password" placeholder="Create a password" :variation="inputVariation" />

      <div class="form-actions">
        <ReferenceButton variation="solid" class="signup-button">Create account</ReferenceButton>
      </div>

      <UtensilDivider label="or" />

      <ReferenceButton variation="outline" class="social-button" color="pencil">
        <div class="flex align-center gap-2">
          <GoogleLogo />
          <span>Continue with Google</span>
        </div>
      </ReferenceButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UtensilInput from 'utensil-vue/components/input/UtensilInput.vue'
import UtensilPassword from 'utensil-vue/components/input/UtensilPassword.vue'
import UtensilDivider from 'utensil-vue/components/divider/UtensilDivider.vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import GoogleLogo from '@/features/components/GoogleLogo.vue'
import { useShowcaseContext } from '../showcase-context'

const { immersive } = useShowcaseContext()
const inputVariation = computed(() => (immersive.value ? 'surface' : 'outline'))
</script>

<style scoped>
.signup-form-demo {
  min-width: 100%;
  max-width: 100%;
  width: 288px;
}

.card-title {
  font-size: var(--font-size-5);
  color: var(--pencil-12);
  margin-block-end: var(--space-5);
  text-align: center;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-actions {
  margin-block-start: var(--space-2);
}

.signup-button {
  width: 100%;
}

.social-button {
  width: 100%;
}
</style>
