<template>
  <div>
    <pageHeader title="咨询记录" />
    <el-table :data="sessionList" style="width: 100%">
      <el-table-column label="会话ID" width="160px">
        <template #default="{row}">
          <el-avatar>{{ row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪标签" min-width="220px" >
        <template #default="{row}">
          <h4>{{ row.sessionTitle }}</h4>
          <div class="content">{{ row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" min-width="120px" />
      <el-table-column prop="lastMessageTime" label="时间" min-width="120px" />
      <el-table-column label="操作" width="100px" fixed="right">
        <template #default="{row}">
          <el-button type="primary" text size="small" @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      :current-page="pagination.currentPage"
      :page-size="pagination.size"
      :total="pagination.total"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
    <recordDialog ref="recordDialogRef" v-model:visible="visible" :detail="detail" @handleSuccess="handleSuccess"/>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import pageHeader from '../components/pageHeader.vue';
import recordDialog from './components/recordDialog.vue';
import { getSessionList } from '@/api/admin';
import { ElMessage } from 'element-plus';

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})
const sessionList = ref([]);
const visible = ref(false);
const detail = ref({});

onMounted(async() => {
  const data = await getSessionList({
    ...pagination,
  })
  if(data.total<0) return;        
  sessionList.value = data.records || [];
  pagination.total = data.total || 0;
})
// 详情
const handleDetail = (row) => {
  visible.value = true;
  detail.value = row;
}
// 成功回调
const handleSuccess = () => {
  visible.value = false;
}
// 分页触发
const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  handleSearch();
}
</script>
<style lang="scss" scoped>
.content {
  color: #909399;
  line-height: 19px;
  font-size: 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>