<template>
  <el-form :model="formData" ref="formRef">
    <el-row>
      <template v-for="item in formCol" :key="item.sort">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.props">
            <component :is="item.type" v-model="formData[item.props]" :placeholder="item.placeholder" >
            <template v-if="item.type === 'elSelect'">
              <el-option label="全部" value="" />
              <el-option
                v-for="item2 in item.options"
                :key="item2.value"
                :label="item2.label"
                :value="item2.value"
              />
            </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button type="primary" @click="handleReset(formRef)">重置</el-button>
  </el-form>
   
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
const formRef = ref()
const emit = defineEmits(['handleSearchForm'])
const formData = reactive({})
const props = defineProps({
  searchForm: {
    type: Array,
    default: () => ([])
  }
})
const formCol = computed(()=>{
  const { searchForm } = props
  searchForm.forEach(item=>{
    item.col = {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6,
    }
  })
  return searchForm
})
const handleSearch = () => {
  emit('handleSearchForm', formData)
}
const handleReset = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  emit('handleSearchForm', {})
}
</script>