<template>
  <ReferenceComponentDemo
    title="Info Strip"
    anchor="info-strip"
    description="A non-interactive strip of labelled values (stats). Compose with UtensilInfoStripItem children."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content info-strip-demo">
          <ReferenceInfoStrip>
            <UtensilInfoStripItem label="Stories">5</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Teams">1</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Members">&infin;</UtensilInfoStripItem>
          </ReferenceInfoStrip>
        </div>
        <div class="demo-label">Default</div>
      </div>

      <div class="demo-item">
        <div class="demo-content info-strip-demo">
          <ReferenceInfoStrip variation="soft">
            <UtensilInfoStripItem label="Soft">12</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Items">34</UtensilInfoStripItem>
          </ReferenceInfoStrip>
          <ReferenceInfoStrip variation="outline">
            <UtensilInfoStripItem label="Outline">12</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Items">34</UtensilInfoStripItem>
          </ReferenceInfoStrip>
          <ReferenceInfoStrip variation="unstyled">
            <UtensilInfoStripItem label="Unstyled">12</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Items">34</UtensilInfoStripItem>
          </ReferenceInfoStrip>
        </div>
        <div class="demo-label always-visible">Variations</div>
      </div>

      <div class="demo-item">
        <div class="demo-content info-strip-demo">
          <ReferenceInfoStrip dividers label-placement="bottom">
            <UtensilInfoStripItem label="Views">12,480</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Completes">9,213</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Clicks">1,024</UtensilInfoStripItem>
          </ReferenceInfoStrip>
        </div>
        <div class="demo-label always-visible">Dividers &middot; label below</div>
      </div>

      <div class="demo-item">
        <div class="demo-content info-strip-demo">
          <ReferenceInfoStrip orientation="vertical" dividers>
            <UtensilInfoStripItem label="Plan">Business</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Seats">8 of 10</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Renews">12 Aug</UtensilInfoStripItem>
          </ReferenceInfoStrip>
        </div>
        <div class="demo-label always-visible">Vertical</div>
      </div>

      <div class="demo-item">
        <div class="demo-content info-strip-demo">
          <ReferenceInfoStrip color="success">
            <UtensilInfoStripItem label="Uptime">99.9%</UtensilInfoStripItem>
            <UtensilInfoStripItem label="Status">
              <ReferenceBadge variation="soft" color="success" scale="small">Healthy</ReferenceBadge>
            </UtensilInfoStripItem>
          </ReferenceInfoStrip>
        </div>
        <div class="demo-label always-visible">Coloured &middot; rich value</div>
      </div>
    </div>

    <template #api>
      <UtensilInfoStripDoc />
      <UtensilInfoStripItemDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilInfoStripItem from '@gobistories/utensil-vue/components/info-strip/UtensilInfoStripItem.vue'
import UtensilInfoStripDoc from '@gobistories/utensil-vue/components/info-strip/UtensilInfoStripDoc.vue'
import UtensilInfoStripItemDoc from '@gobistories/utensil-vue/components/info-strip/UtensilInfoStripItemDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceInfoStrip } from '@/theme/components/ReferenceInfoStrip'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
</script>

<style scoped>
.demo-content.info-strip-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-4);
}

/* A vertical strip is content-width; centre it in the demo cell. */
.info-strip-demo .utensil-info-strip.vertical {
  align-self: center;
}
</style>
