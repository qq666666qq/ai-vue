<template>
 <div class="container">
    <el-container class="main-box">
      <leftSide :isCollapse="isCollapse" />
      <el-container>
        <el-header>
          <headerBar @changeCollapse="changeCollapse" />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import leftSide from '@/components/leftSide.vue'
import headerBar from '@/components/headerBar.vue'

const isCollapse = ref(false)

const changeCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  .main-box {
    height: 100%;
    .main-content {
        height: 100%;
        width: 100%;
        padding: 20px;
        .content-container {
          padding: 20px;
          box-sizing: border-box;
          background-color: #fff;
          min-height: calc(100% - 30px);
      }
    }
  }
}
.el-header {
  height: 70px!important;
} 
</style>
