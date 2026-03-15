<template>
 <div>
    <pageHeader>
      <template #button>
        <el-button type="primary" @click="handleEdit">新增</el-button>
      </template>
    </pageHeader>
    <tableForm :searchForm="searchForm" @handleSearchForm="handleSearch" />
    <el-table :data="knowledgeArticleList" style="width: 100%;margin-top: 30px;">
      <el-table-column label="文章标题" width="220" fixed="left">
        <template #default="{row}">
          <div class="timer-box">
            <el-icon>
              <Timer />
            </el-icon>
            {{ row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="分类" min-width="120" />
      <el-table-column prop="authorName" label="作者" min-width="120" />
      <el-table-column prop="readCount" label="阅读量" min-width="120" />
      <el-table-column prop="publishedAt" label="发布时间" min-width="180" />
      <el-table-column label="操作" fixed="right" width="230">
        <template #default="{row}">
          <el-button type="primary" text @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="row.status === 0 || row.status === 2" type="success" text @click="handlePublish(row,1)">发布</el-button>
          <el-button v-if="row.status === 1" type="warning" text @click="handlePublish(row,2)">下线</el-button>
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
    <articleDialog ref="articleDialogRef" v-model:visible="visible" :categoryMap="categoryMap" :currentArticle="currentArticle" @handleSuccess="handleSuccess" />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import pageHeader from '../components/pageHeader.vue';
import tableForm from '../components/tableForm.vue';
import articleDialog from './components/articleDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCategoryTree, getKnowledgeArticleList, getArticleDetail, deleteArticle, updateArticleStatus } from '@/api/admin';
// 分类列表
const categoryList = ref([]);
// 分类映射
const categoryMap = reactive({});  
// 列表数据
const knowledgeArticleList = ref([]);
// 表单数据
const searchForm = reactive([
  {
    sort:1,
    label: '文章标题',
    props: 'title',
    type: 'elInput',
    placeholder:'请输入文章标题'
  },
  {
    sort:2,
    label: '分类',
    props: 'categoryId',
    type: 'elSelect',
    placeholder:'请选择分类',
    options:[]
  },
  {
    sort:2,
    label: '状态',
    props: 'status',
    type: 'elSelect',
    placeholder:'请选择状态',
    options:[
      {
        value: '0',
        label: '草稿'
      },
      {
        value: '2',
        label: '已发布'
      },
      {
        value: '2',
        label: '已下线'
      }
    ]
  },
])
// 分页数据
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})
onMounted(async() => {
  const data = await getCategoryTree();
  if(data.total<0) return;        
  // 分类映射
  categoryList.value = data.map(item => {
    categoryMap[item.id] = item.categoryName;
    return {
      value: item.id,
      label: item.categoryName,
    }
  })
  // 数据回填
  searchForm[1].options = categoryList.value;
  // 列表调用
  handleSearch()
})
//筛选列表
const handleSearch = async(formData) => {
  const params = {
    ...pagination,
    ...formData,
  }
  const data = await getKnowledgeArticleList(params);
  knowledgeArticleList.value = data.records || [];
  pagination.total = data.total || 0;
}
// 分页触发
const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  handleSearch();
}
const currentArticle = ref({});
// 弹窗数据
const visible = ref(false);
// 新增编辑文章
const handleEdit = async(row) => {
  if(!row.id) {
    row = {}
    currentArticle.value = null;
  }
  visible.value = true;
  // 数据回填
  const res = await getArticleDetail(row.id);
  currentArticle.value = res || {};
}

// 新增成功
const handleSuccess = () => {
  visible.value = false;
  handleSearch();
  ElMessage.success('新增成功');
}
// 删除文章
const handleDelete = (row) =>{
  ElMessageBox.confirm(`确认删除文章${row.title}吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteArticle(row.id).then(res => {
      ElMessage.success('删除成功');
      handleSearch();
    })
  })
}
// 发布下线文章
const handlePublish = (row,status) =>{
  ElMessageBox.confirm(`确认${status === 2 ? '下线' : '发布'}文章${row.title}吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    updateArticleStatus(row.id,{status}).then(res => {
      ElMessage.success(`${status === 2 ? '下线' : '发布'}成功`);
      handleSearch();
    })
  })
}
</script>
<style lang="scss" scoped>
.timer-box {
  display: flex;
  align-items: center;
}
</style>
