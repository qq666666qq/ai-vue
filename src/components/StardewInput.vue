<template>
  <div class="stardew-input-container">
    <label class="input-label" v-if="label">{{ label }}</label>
    <div class="input-wrapper">
      <span class="input-icon" v-if="icon">{{ icon }}</span>
      <input 
        type="text" 
        class="stardew-input" 
        :placeholder="placeholder" 
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
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

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.stardew-input-container {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #5D4037;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  
  &:has(.input-icon) .stardew-input {
    padding-left: 40px;
  }
}

.input-icon {
  position: absolute;
  left: 12px;
  font-size: 18px;
  color: #8D6E63;
  z-index: 1;
}

.stardew-input {
  width: 100%;
  padding: 10px 16px;
  padding-left: 16px;
  border: 3px solid #5D4037;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  box-shadow: inset 2px 2px 0 rgba(93, 64, 55, 0.2);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    background: #FFF8E1;
    box-shadow: inset 2px 2px 0 rgba(93, 64, 55, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #8D6E63;
  }
}
</style>