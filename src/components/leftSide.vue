<template>
  <el-aside :width="isCollapse ? '64px' : '264px'" class="aside">
    <el-menu
        :collapse="isCollapse"
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
      <div class="brand">
        <div class="brand-left">
          <img src="@/assets/images/logo.png" class="logo"/>
        </div>
        <div class="brand-right" v-show="!isCollapse">
          <p class="brand-title">QianTu助手</p>
          <p class="brand-desc">AI管理后台</p>
        </div>
      </div>
        <el-menu-item v-for="value in router.options.routes[0].children" :key="value.path" :index="value.path" @click="handlePath">
          <el-icon><component :is="value.meta.icon" /></el-icon>
          <template #title><span>{{ value.meta.title }}</span></template>
        </el-menu-item>
      </el-menu>
  </el-aside>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  isCollapse: Boolean
})

const router = useRouter()
const handlePath = (key) => {
  const basePath = `${router.options.routes[0].path}/${key.index}`
  console.log(basePath,'basePath')
  router.push(basePath)
}
const handleOpen = (key) => {
}
const handleClose = (key) => {
}
</script>
<style lang="scss" scoped>
.aside {
  transition: width 0.3s;
  overflow: hidden;
  height: 100%;
}
.el-menu-vertical-demo {
  height: 100%;
}

.brand {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 70px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #efefef;
  .brand-left {
    margin-right: 10px;
    font-size: 20px;
    color: #fff;
    .logo {
      width: 50px;
      height: 50px;
    }
  }
  .brand-right {
    color: #333;
    .brand-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .brand-desc {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
