<template>
  <el-dialog
    title="咨询会话详情"
    :model-value="visible"
    width="80%"
    :close-on-click-modal="false"
    align-center
    :before-close="handleClose"
  >
    <div class="session-detail" v-loading="loading">
      <div class="detail-header">
        <div class="detail-row">
          <div class="detail-label">用户</div>
          <div class="detail-value">{{ detail.userNickname }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">开始时间</div>
          <div class="detail-value">{{ detail.startedAt }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">消息数</div>
          <div class="detail-value">{{ detail.messageCount }}</div>
        </div>
      </div>
      <div class="messages-container">
        <div class="messages-header">
          <h4>对话记录</h4>
        </div>
        <div class="messages-list">
          <div v-for="(message, index) in messages" :key="index" class="message-item" :class="message.senderType === 1 ? 'user-message' : 'ai-message'">
            <div class="message-header">
              <div class="sender">{{ message.sender }}</div>
              <div class="time">{{ message.createdAt }}</div>
            </div>
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
      </div>

    </div>
  </el-dialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import { getMessageList } from '@/api/admin'
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
const loading = ref(false);
const messages = ref([]);
const emit = defineEmits(['update:visible']);

watch(() => props.visible, (newVal) => {
  if (newVal && props.detail.id) {
    loading.value = true;
    getMessageList(props.detail.id).then(res => {
      messages.value = res || [];
      loading.value = false;
    })
  }
})
// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false);
}
</script>
<style lang="scss" scoped>
.dialog-content {
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
}
 .session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }

</style>