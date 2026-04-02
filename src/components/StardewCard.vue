<template>
  <div class="stardew-card" :class="{ 'with-shadow': shadow }">
    <div class="card-header" v-if="title">
      <h3 class="card-title">{{ title }}</h3>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  shadow: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
.stardew-card {
  background: white;
  border: 3px solid #5D4037;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &.with-shadow {
    box-shadow: 4px 4px 0 #5D4037;
  }
  
  .card-header {
    background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%);
    padding: 12px 16px;
    border-bottom: 3px solid #5D4037;
  }
  
  .card-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: white;
    text-shadow: 2px 2px 0 #2E7D32;
  }
  
  .card-body {
    padding: 16px;
  }
}
</style>