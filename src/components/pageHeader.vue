<template>
  <div class="header-bar">
   <div class="title">{{route.meta.title}}</div>
   <div class="btn-box">
    <slot name="button"></slot>
   </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

</script>
<style lang="scss" scoped>
.header-bar {
  display: flex;
  height: 60px;
  align-items: center;
  margin-bottom: 20px;
  .title {
    font-size: 22px;
    color: #333;
  }
  .btn-box {
    margin-left: auto;
  }
}
</style>
