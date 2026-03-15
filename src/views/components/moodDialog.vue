<template>
  <el-dialog title="情绪日志详情" :model-value="visible" width="60%" :close-on-click-modal="false" align-center
    :before-close="handleClose">
    <div class="detail-content" v-if="detail">
      <div class="detail-section">
        <h4>用户信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">{{ detail.username }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ detail.nickname }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ detail.userId }}</el-descriptions-item>
          <el-descriptions-item label="记录日期">{{ detail.diaryDate }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="detail-section">
        <h4>情绪状态</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="情绪评分">
            <el-rate :model-value="detail.moodScore" disabled :max="10" />
          </el-descriptions-item>
          <el-descriptions-item label="主要情绪">
            <el-tag :type="getEmotionTagType(detail.dominantEmotion)" >{{ detail.dominantEmotion || '-' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="睡眠质量">{{ detail.sleepQuality || '-' }}/5</el-descriptions-item>
          <el-descriptions-item label="压力水平">{{ detail.stressLevel || '-' }}/5</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="detail-section">
        <h4>日记内容</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="情绪触发因素">{{ detail.emotionTriggers || '-' }}</el-descriptions-item>
          <el-descriptions-item label="日记内容">{{ detail.diaryContent || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 只有当有AI分析结果时才显示 -->
      <div class="detail-section">
        <h4>AI情绪分析结果</h4>
        <div class="ai-analysis-result">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getAiEmotionTagType(aiJson.primaryEmotion)" >{{ aiJson.primaryEmotion || '-' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪强度">
              <el-progress :percentage="aiJson.emotionScore" :color="getEmotionScoreColor(aiJson.emotionScore)" :stroke-width="8" />
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag :type="getRiskLevelTagType(aiJson.riskLevel)" >{{ getRiskLevelText(aiJson.riskLevel) || '-' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪性质">
              <el-tag :type="aiJson.isNegative ? 'danger' : 'success'" >{{ aiJson.isNegative ? '负面情绪' : '正面情绪' }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <div class="ai-suggestion-section">
            <h5>专业建议</h5>
            <div class="suggestion-content">{{ aiJson.riskDescription || '无' }}</div>
          </div>
          <div class="ai-risk-section">
            <h5>风险描述</h5>
            <div class="risk-content">{{ aiJson.riskDescription || '无' }}</div>
          </div>
          <div class="ai-improvements-section">
            <h5>改善建议</h5>
            <ul class="improvement-list">
              <li v-for="item in aiJson.improvementSuggestions" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <h4>时间信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="创建时间">{{ detail.createdAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ detail.updatedAt || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  detail: {
    type: Object,
    default: () => ({})
  },
})
const emit = defineEmits(['update:visible']);
const aiJson = ref({})
if(props.detail.aiEmotionAnalysis){
  aiJson.value = JSON.parse(props.detail.aiEmotionAnalysis) || {}
} else {
  aiJson.value = {}
}


// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false);
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
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>