<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    :model-value="visible"
    width="60%"
    align-center
    :before-close="handleClose"
    class="article-dialog"
  >
    <div class="dialog-content">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="110px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxLength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
          <el-option 
            v-for="(name, id) in categoryMap" 
            :key="id" 
            :label="name" 
            :value="Number(id) || id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" :rows="6" maxLength="1000" show-word-limit v-model="formData.summary" placeholder="请输入摘要"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
        v-model="formData.tags"
        multiple
        filterable
        allow-create
        placeholder="请输入或选择标签"
        >
          <el-option
          v-for="item in commonTags"
          :key="item"
          :label="item"
          :value="item"
          />
        </el-select>  
      </el-form-item>
      <el-form-item label="封面图片" prop="coverImage">
       <div class="uploader">
         <el-upload
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleAvatarSuccess"
          accept="image/*"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <div v-else class="avatar-uploader">
            点击上传封面
          </div>
        </el-upload>
        <div v-if="imageUrl">
          <el-button  type="danger" size="small" @click="handleRemove">移除封面</el-button>
        </div>
       </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor v-model="formData.content" min-height="400px" :maxCharCount="5000" show-placeholder="请输入内容" @created="handleEditorCreated" @change="handleEditorChange"/>
      </el-form-item>
      <div v-if="previewVisible">
        <div v-html="formData.content"></div>
      </div>
    </el-form>
    </div>
    <template #footer>
      <el-button @click="previewVisible = !previewVisible">{{previewVisible?'隐藏预览':'预览效果'}}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, nextTick, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { uploadFile, addKnowledgeArticle, updateKnowledgeArticle } from '@/api/admin';
import { baseURL } from '@/config/index.js';
import RichTextEditor from '../../components/RichTextEditor.vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  categoryMap: {
    type: Object,
    default: () => ({})
  },
  currentArticle: {
    type: Object,
    default: () => ({})
  }
})
const previewVisible = ref(false);
const imageUrl = ref('');
const formRef = ref(null);
const formData = reactive({
  title: '', 
  content: '',
  coverImage: '',
  categoryId: '',
  summary: '',
  tags: ''
})
const isEdit = computed(() => !!props.currentArticle?.id)
watch(() => props.currentArticle, (newVal) => {
  if(newVal?.id) {
    nextTick(() => {
      Object.assign(formData, newVal);
      uuid.value = newVal.id;
      imageUrl.value = baseURL + newVal.coverImage;
      console.log(imageUrl.value);
      formData.tags = newVal.tags ? newVal.tags.split(',') : [];
    })
  }
})
const rules = reactive({
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  content: [{ required: true, max: 5000, message: '请输入内容', trigger: 'blur' }],
})
// 标签
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
// 关闭弹窗
const emit = defineEmits(['update:visible', 'handleSuccess']);
const handleClose = () => {
  formRef.value.resetFields();
  uuid.value = null;
  formData.tags = '';
  handleRemove();
  emit('update:visible', false);
}
//上传前调用
const beforeAvatarUpload = (file) => {
  // 检查文件类型是否为图片
  if (file.type.startsWith('image/')) {
    // 检查文件大小是否超过 5MB
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.error('图片文件大小不能超过 5MB');
      return false;
    }
    return true;
  } else {
    ElMessage.error('请上传图片文件');
    return false;
  }

}
const uuid = ref(null);
//上传成功调用
const handleAvatarSuccess = async({ file }) => {
  try {
    // 生成 UUID
    uuid.value = crypto.randomUUID();
    const res = await uploadFile(file,uuid.value);
    formData.coverImage = res.filePath;
    imageUrl.value = baseURL + res.filePath;
  } catch (error) {
    ElMessage.error(error.message || '上传失败');
  }
}
// 移除封面
const handleRemove = () => {
  formData.coverImage = '';
  imageUrl.value = '';
}
// 编辑器创建时调用
const handleEditorCreated = (editor) => {
  if (editor && formData.content) {
    nextTick(() => {
      editor.setHtml(formData.content);
    })
  }
}
// 编辑器内容改变时调用
const handleEditorChange = (data) => {
  formData.content = data.html;
}
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const form = {
        ...formData,
        tags: formData.tags ? formData.tags.join(',') : ''
      }
      const api = isEdit.value ? updateKnowledgeArticle : addKnowledgeArticle;
      const res = await api(form.id, form);
      if (res) emit('handleSuccess')
    }
  });
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 0;
}
.detail-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
}
.avatar-uploader {
  display: flex;
  flex-direction: column;
}
.avatar-uploader{
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background-color: #f6f8fa;
  border-radius: 5px;
}
.avatar {
  display: block;
  width: 200px;
  height: 120px;
}
</style>
