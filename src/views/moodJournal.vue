  <template>
    <div>
      <pageHeader title="情绪日志" />
      <tableForm :searchForm="searchForm" @handleSearchForm="handleSearch" />
      <el-table :data="moodJournalList" style="width: 100%;margin-top: 30px;">
        <el-table-column prop="userId" label="用户ID" min-width="120" fixed="left" />
        <el-table-column label="会话ID" width="120">
          <template #default="{row}">
            <el-avatar> {{ row.nickname }} </el-avatar>  
          </template>
        </el-table-column>
        <el-table-column prop="diaryDate" label="记录日期" min-width="120" />
        <el-table-column prop="authorName" label="情绪评分" min-width="140">
          <template #default="{row}">
            <el-rate :model-value="row.moodScore" disabled :max="10" />
          </template>
        </el-table-column>
        <el-table-column prop="readCount" label="生活指标" min-width="120">
          <template #default="{row}">
            <div>睡眠：{{ row.sleepQuality }}/5</div>
            <div>压力：{{ row.stressLevel }}/5</div>
          </template>
        </el-table-column>
        <el-table-column prop="emotionTriggers" label="情绪触发因素" min-width="140" />
        <el-table-column prop="diaryContent" label="日记内容" min-width="180" />
        <el-table-column label="操作" fixed="right" width="160">
          <template #default="{row}">
            <el-button type="primary" text @click="handleDetail(row)">详情</el-button>
            <el-button type="danger" text @click="handleDelete(row)">删除</el-button>
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
      <moodDialog ref="moodDialogRef" v-model:visible="visible" :detail="detail" />
    </div>
  </template>
  <script setup>
import { reactive, ref, onMounted } from 'vue';
import pageHeader from '../components/pageHeader.vue';
import tableForm from '../components/tableForm.vue';
import { getMoodJournalList, deleteMoodJournal } from '@/api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import moodDialog from './components/moodDialog.vue';
const visible = ref(false);
const detail = ref({});
// 列表数据
const moodJournalList = ref([]);
// 表单数据
const searchForm = reactive([
  {
    sort:1,
    label: '用户ID',
    props: 'userId',
    type: 'elInput',
    placeholder:'请输入用户ID'
  },
  {
    sort:2,
    label: '情绪评分',
    props: 'moodScreRange',
    type: 'elSelect',
    placeholder:'请选择评分范围',
    options:[
      {
        value: '1-3',
        label: '低分（1-3分）'
      },
      {
        value: '4-6',
        label: '中分（4-6分）'
      },
      {
        value: '7-10',
        label: '高分（7-10分）'
      },
    ]
  }
])
// 分页数据
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})
onMounted(async() => {
  // 列表调用
  handleSearch()
})
//筛选列表
const handleSearch = async(formData) => {
  const params = {
    ...pagination,
    ...formData,
  }
  const data = await getMoodJournalList(params);
  moodJournalList.value = data.records || [];
  pagination.total = data.total || 0;
}
// 详情弹窗
const handleDetail = (row) => {
  detail.value = row;
  visible.value = true;
}
// 删除
const handleDelete = (row) =>{
  ElMessageBox.confirm(`确认删除该条记录吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteMoodJournal(row.id).then(res => {
      ElMessage.success('删除成功');
      handleSearch();
    })
  })
}
// 分页
const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  handleSearch();
}
</script>
