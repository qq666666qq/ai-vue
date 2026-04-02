<template>
  <button 
    class="stardew-button" 
    :class="[
      `variant-${variant}`,
      { 'disabled': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="button-icon" v-if="icon">{{ icon }}</span>
    <span class="button-text">{{ text }}</span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.stardew-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 3px solid #5D4037;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 2px 2px 0 #5D4037;
  position: relative;
  overflow: hidden;
  
  &:hover:not(.disabled) {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #5D4037;
  }
  
  &:active:not(.disabled) {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .button-icon {
    font-size: 18px;
  }
  
  .button-text {
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
  }
  
  &.variant-primary {
    background: linear-gradient(180deg, #4CAF50 0%, #388E3C 100%);
    color: white;
  }
  
  &.variant-secondary {
    background: linear-gradient(180deg, #90A4AE 0%, #607D8B 100%);
    color: white;
  }
  
  &.variant-success {
    background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%);
    color: white;
  }
  
  &.variant-warning {
    background: linear-gradient(180deg, #FFD54F 0%, #FFC107 100%);
    color: #E65100;
  }
  
  &.variant-danger {
    background: linear-gradient(180deg, #EF5350 0%, #C62828 100%);
    color: white;
  }
}
</style>