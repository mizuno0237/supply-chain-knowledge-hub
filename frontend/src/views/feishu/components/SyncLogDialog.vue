<template>
  <t-dialog
    v-model:visible="visible"
    header="同步日志"
    width="800px"
    :footer="false"
    @close="handleClose"
  >
    <div class="sync-log-container">
      <div v-if="loading" class="loading-state">
        <t-loading size="large" />
        <p>加载日志中...</p>
      </div>
      
      <div v-else-if="logs.length === 0" class="empty-state">
        <p>暂无同步日志</p>
      </div>
      
      <div v-else class="log-list">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="log-entry"
        >
          <div class="log-header">
            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
            <span class="log-summary">
              总计: {{ log.total }} | 
              成功: <span class="success-count">{{ log.success }}</span> | 
              失败: <span class="failed-count">{{ log.failed }}</span>
              <template v-if="log.created > 0">
                | 新建: <span class="created-count">{{ log.created }}</span>
              </template>
              <template v-if="log.updated > 0">
                | 更新: <span class="updated-count">{{ log.updated }}</span>
              </template>
            </span>
          </div>
          
          <div class="log-details">
            <div
              v-for="(result, idx) in log.results"
              :key="idx"
              :class="['log-item', result.status === 'success' ? 'success' : 'failed']"
            >
              <span class="log-icon">{{ result.status === 'success' ? '✓' : '✗' }}</span>
              <span class="log-title">{{ result.title }}</span>
              <span v-if="result.action" class="log-action">[{{ result.action === 'created' ? '新建' : '更新' }}]</span>
              <t-tooltip
                v-if="result.error"
                :content="result.error"
                placement="top"
                :max-width="400"
              >
                <span class="log-error">{{ result.error }}</span>
              </t-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { getSyncLogs } from '@/api/feishu'

interface Props {
  visible: boolean
  knowledgeBaseId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const visible = ref(props.visible)
const loading = ref(false)
const logs = ref<any[]>([])

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  visible.value = newVal
  if (newVal) {
    loadLogs()
  }
})

// 加载日志
const loadLogs = async () => {
  loading.value = true
  try {
    const data = await getSyncLogs(props.knowledgeBaseId, 10)
    if (data.success) {
      logs.value = data.data || []
    }
  } catch (error: any) {
    console.error('加载同步日志失败:', error)
    MessagePlugin.error('加载同步日志失败')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    return timestamp
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}
</script>

<style lang="less" scoped>
.sync-log-container {
  max-height: 600px;
  overflow-y: auto;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
    
    &:hover {
      background: #5a5a5a;
    }
  }
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #888;
  
  p {
    margin-top: 16px;
    font-size: 14px;
  }
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.log-entry {
  border: 1px solid #333;
  border-radius: 6px;
  padding: 12px;
  background: #252525;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
}

.log-time {
  color: #888;
  font-size: 12px;
}

.log-summary {
  color: #ccc;
  font-size: 12px;
  
  .success-count {
    color: #4ade80;
    font-weight: 600;
  }
  
  .failed-count {
    color: #f87171;
    font-weight: 600;
  }
  
  .created-count {
    color: #60a5fa;
    font-weight: 600;
  }
  
  .updated-count {
    color: #fbbf24;
    font-weight: 600;
  }
}

.log-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 13px;
  transition: background 0.2s;
  
  &:hover {
    background: #2d2d2d;
  }
  
  &.success {
    .log-icon {
      color: #4ade80;
    }
    
    .log-title {
      color: #d4d4d4;
    }
  }
  
  &.failed {
    .log-icon {
      color: #f87171;
    }
    
    .log-title {
      color: #d4d4d4;
    }
  }
}

.log-icon {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 14px;
}

.log-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.log-action {
  flex-shrink: 0;
  color: #60a5fa;
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 3px;
}

.log-error {
  flex-shrink: 0;
  color: #f87171;
  font-size: 11px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
  
  &:hover {
    color: #fca5a5;
  }
}
</style>
