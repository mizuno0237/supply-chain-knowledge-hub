<template>
  <div class="tree-node" :style="{ paddingLeft: `${level * 24}px` }">
    <div class="node-content">
      <span
        v-if="node.has_child"
        :class="['expand-icon', { expanded: node.expanded }]"
        @click="$emit('toggle-expand', node.node_token)"
      >
        <t-icon name="chevron-right" />
      </span>
      <span v-else class="expand-icon placeholder"></span>
      
      <t-checkbox
        :checked="!!node.checked"
        @change="handleCheckboxChange"
        :disabled="isCheckboxDisabled"
        class="node-checkbox"
      />
      
      <span class="node-title">
        {{ node.title }}
        <span v-if="!isDocument" class="node-hint"> (文件夹)</span>
        <!-- 无权限提示 -->
        <t-tooltip
          v-if="isDocument && node.has_permission === false"
          content="该文档未开启外部分享，无法同步到知识库"
          placement="top"
        >
          <t-icon name="lock-on" class="no-permission-icon" />
        </t-tooltip>
        <!-- 跳转到飞书文档的图标 - 只对文档节点显示 -->
        <t-tooltip
          v-if="isDocument"
          content="在飞书中打开"
          placement="top"
        >
          <span class="jump-icon-wrapper" @click.stop="openInFeishu">
            <t-icon name="jump" class="jump-icon" />
          </span>
        </t-tooltip>
      </span>
    
      
      <!-- 同步状态标识 - 只对文档节点显示 -->
      <t-tooltip
        v-if="isDocument"
        :content="getSyncStatusTooltip()"
        placement="top"
      >
        <span :class="['sync-status-badge', `status-${node.sync_status || 'not_synced'}`]">
          {{ getSyncStatusText() }}
        </span>
      </t-tooltip>
    </div>
    
    <template v-if="node.expanded && hasLoadedChildren">
      <div class="node-children">
        <FeishuNode
          v-for="child in node.children"
          :key="child.node_token"
          :node="child"
          :level="level + 1"
          @toggle-check="(nodeToken, checked) => emit('toggle-check', nodeToken, checked)"
          @toggle-expand="(nodeToken) => emit('toggle-expand', nodeToken)"
        />
      </div>
    </template>
    
    <div
      v-if="node.expanded && node.has_child && !hasLoadedChildren"
      class="node-loading"
      :style="{ paddingLeft: `${(level + 1) * 24}px` }"
    >
      <t-loading size="small" />
      <span class="loading-text">加载中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

interface SpaceNode {
  node_token: string
  obj_token: string
  node_type: string
  obj_type: string
  title: string
  has_child: boolean
  children?: SpaceNode[]
  checked?: boolean
  expanded?: boolean
  updated_at?: string  // 飞书文档更新时间
  sync_status?: 'not_synced' | 'synced' | 'outdated' | 'failed'
  synced_at?: string  // WeKnora 录入时间
  error_message?: string  // 失败原因
  knowledge_id?: string  // WeKnora 知识ID
  has_permission?: boolean  // 是否有权限同步（飞书文档是否允许外部访问）
}

interface Props {
  node: SpaceNode
  level: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'toggle-check': [nodeToken: string, checked: boolean]
  'toggle-expand': [nodeToken: string]
}>()

const isDocument = computed(() => {
  return !!(props.node.obj_token && props.node.obj_type)
})

const hasLoadedChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

// 处理复选框变化
const handleCheckboxChange = (checked: boolean) => {
  console.log(`[FeishuNode] 复选框变化: ${props.node.title}`)
  console.log(`  当前状态: ${props.node.checked}, 新状态: ${checked}`)
  console.log(`  是否禁用: ${isCheckboxDisabled.value}`)
  
  // 如果状态没变（被父节点更新导致的），不触发 emit，避免重复处理
  if (props.node.checked === checked) {
    console.log(`  状态未变化，跳过 emit`)
    return
  }
  
  // 发射事件到父组件
  emit('toggle-check', props.node.node_token, checked)
}

// 打开飞书文档
const openInFeishu = () => {
  if (!props.node.node_token) {
    console.warn('文档没有 node_token')
    return
  }
  
  // 使用你们公司的飞书域名和 node_token
  const feishuUrl = `https://vi0fprp6sd.feishu.cn/wiki/${props.node.node_token}`
  
  console.log(`[FeishuNode] 打开飞书文档: ${feishuUrl}`)
  
  // 在新标签页打开
  window.open(feishuUrl, '_blank')
}

// 判断复选框是否禁用
const isCheckboxDisabled = computed(() => {
  // 如果不是文档节点，禁用
  if (!isDocument.value) {
    return true
  }
  
  // 如果没有权限（飞书文档不允许外部访问），禁用
  if (props.node.has_permission === false) {
    return true
  }
  
  // 如果是已同步状态，禁用
  if (props.node.sync_status === 'synced') {
    return true
  }
  
  return false
})

const getNodeIcon = (objType: string): string => {
  const iconMap: Record<string, string> = {
    'docx': '📄',
    'sheet': '📊',
    'bitable': '📋',
    'mindnote': '🧠',
    'file': '📎'
  }
  return iconMap[objType] || '📁'
}

const getSyncStatusText = (): string => {
  const status = props.node.sync_status || 'not_synced'
  const statusMap: Record<string, string> = {
    'not_synced': '未同步',
    'synced': '已同步',
    'outdated': '需更新',
    'failed': '失败'
  }
  return statusMap[status] || '未同步'
}

const getSyncStatusTooltip = (): string => {
  const status = props.node.sync_status || 'not_synced'
  const syncedAt = props.node.synced_at
  const errorMsg = props.node.error_message
  
  if (status === 'not_synced') {
    return '此文档尚未同步到知识库'
  } else if (status === 'synced') {
    return syncedAt ? `已同步 (${formatDate(syncedAt)})` : '已同步到知识库'
  } else if (status === 'outdated') {
    return syncedAt 
      ? `飞书文档已更新，需要重新同步 (上次同步: ${formatDate(syncedAt)})`
      : '飞书文档已更新，需要重新同步'
  } else if (status === 'failed') {
    return errorMsg ? `同步失败: ${errorMsg}` : '同步失败'
  }
  return '此文档尚未同步到知识库'
}

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateStr
    }
    
    // 格式化为：年-月-日 时:分:秒
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('日期格式化失败:', error, dateStr)
    return dateStr
  }
}
</script>

<style lang="less" scoped>
.tree-node {
  margin: 6px 0;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    background: rgba(102, 126, 234, 0.06);
    transform: translateX(4px);
  }
}

.expand-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #8b92b0;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;

  &.expanded {
    transform: rotate(90deg);
    color: #667eea;
  }

  &.placeholder {
    cursor: default;
    visibility: hidden;
  }
}

.node-checkbox {
  flex-shrink: 0;
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.node-title {
  flex: 1;
  font-size: 14px;
  color: #374151;
  user-select: none;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.node-hint {
  color: #8b92b0;
  font-size: 12px;
  font-style: italic;
  margin-left: 4px;
  font-weight: 400;
}

.no-permission-icon {
  font-size: 14px;
  color: #f59e0b;
  margin-left: 6px;
  vertical-align: middle;
}

.jump-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 8px;
  cursor: pointer;
}

.jump-icon {
  font-size: 16px;
  color: #667eea;
  transition: all 0.2s;
  
  .jump-icon-wrapper:hover & {
    color: #5a67d8;
    transform: translateX(2px);
  }
  
  .jump-icon-wrapper:active & {
    transform: translateX(4px);
  }
}

.sync-status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s;
  
  &.status-not_synced {
    background: rgba(156, 163, 175, 0.15);
    color: #6b7280;
    border: 1px solid rgba(156, 163, 175, 0.3);
  }
  
  &.status-synced {
    background: rgba(16, 185, 129, 0.15);
    color: #059669;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  &.status-outdated {
    background: rgba(245, 158, 11, 0.15);
    color: #d97706;
    border: 1px solid rgba(245, 158, 11, 0.3);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  &.status-failed {
    background: rgba(239, 68, 68, 0.15);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.node-children {
  margin-left: 0;
}

.node-loading {
  padding: 8px 0;
  color: #8b92b0;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-text {
  font-style: italic;
}
</style>
