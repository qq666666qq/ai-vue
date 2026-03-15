<template>
  <div class="header-bar">
   <div class="title-box">
     <el-button :icon="Expand" @click="handleCollapse" />
     <div class="title">数据分析</div>
   </div>
   <div class="logo-box">
    <el-dropdown class="dropdown-box">
     <div class="flex-box">
       <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="logo" />
        <div class="el-dropdown-link">
          QianTu
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </div>
     </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
          <el-dropdown-item>Action 3</el-dropdown-item>
          <el-dropdown-item disabled>Action 4</el-dropdown-item>
          <el-dropdown-item divided>Action 5</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
   </div>
  </div>
</template>

<script setup>
import { Expand } from '@element-plus/icons-vue'

// 1. 在顶层声明事件，获取 emit 函数
const emit = defineEmits(['changeCollapse'])

// 2. 在函数内部使用 emit
const handleCollapse = () => {
  emit('changeCollapse')
}
</script>

<style lang="scss" scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #efefef;
  .title-box {
    display: flex;
    align-items: center;
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-left: 10px;
      color: #333;
    }
  }
  .logo-box {
    display: flex;
    align-items: center;
    .flex-box {
      display: flex;
      align-items: center;
    }
    .logo {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .dropdown-box {
      cursor: pointer;
    }
  }
}
</style>