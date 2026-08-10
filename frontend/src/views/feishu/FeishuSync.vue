<template>
  <div class="feishu-sync-container">
    <div class="feishu-sync-layout">
      <!-- 左侧配置面板 -->
      <div class="left-panel">
        <div class="panel-header" style="paddingBottom: 23px">
          <h3>飞书同步配置</h3>
        </div>
        
        <!-- 飞书登录状态 -->
        <div class="login-section">
          <!-- 未登录状态 -->
          <!-- <div v-if="!feishuStore.isLoggedIn && !isLoggingIn" class="login-prompt">
            <div class="login-icon">🔐</div>
            <p class="login-text">请先登录飞书账号</p>
            <t-button
              @click="handleFeishuLogin"
              theme="primary"
              size="large"
              block
            >
              <span class="login-button-content">
                <span class="feishu-icon">📱</span>
                飞书登录
              </span>
            </t-button>
          </div> -->
          
          <!-- 登录中状态 -->
          <div v-if="isLoggingIn" class="login-loading">
            <t-loading size="large" />
            <p class="loading-text">正在登录飞书...</p>
            <p class="loading-hint">正在获取用户信息</p>
          </div>
          
          <!-- 已登录状态 -->
          <div v-else class="login-success">
            <div class="user-info">
              <img 
                v-if="feishuStore.userInfo?.avatar_thumb" 
                :src="feishuStore.userInfo.avatar_thumb" 
                class="user-avatar"
                alt="用户头像"
              />
              <div v-else class="user-avatar-placeholder">
                {{ feishuStore.userInfo?.name?.charAt(0) || '无' }}
              </div>
              <div class="user-details">
                <div class="user-name">{{ feishuStore.userInfo?.name || '飞书用户' }}</div>
                <div class="user-status">{{ feishuStore.isLoggedIn ? '已登录' : '未登录' }}</div>
              </div>
            </div>
            <t-button
              v-if="!feishuStore.isLoggedIn"
              @click="handleFeishuLogin"
              theme="primary"
              size="large"
              block
            >
              <span class="login-button-content">
                飞书登录
              </span>
            </t-button>
            <t-button
              v-else
              @click="handleFeishuLogout"
              theme="default"
              size="small"
              block
            >
              退出登录
            </t-button>
          </div>
        </div>
        
        <!-- 状态统计 -->
        <div class="status-stats">
          <div class="stats-grid">
            <div class="stat-item stat-not-synced">
              <div class="stat-icon">⚪</div>
              <div class="stat-info">
                <div class="stat-label">未同步</div>
                <div class="stat-value">{{ statusCounts.not_synced }}</div>
                <div class="stat-percent">{{ getStatusPercent('not_synced') }}%</div>
              </div>
            </div>
            
            <div class="stat-item stat-synced">
              <div class="stat-icon">✓</div>
              <div class="stat-info">
                <div class="stat-label">已同步</div>
                <div class="stat-value">{{ statusCounts.synced }}</div>
                <div class="stat-percent">{{ getStatusPercent('synced') }}%</div>
              </div>
            </div>
            
            <div class="stat-item stat-outdated">
              <div class="stat-icon">⟳</div>
              <div class="stat-info">
                <div class="stat-label">需更新</div>
                <div class="stat-value">{{ statusCounts.outdated }}</div>
                <div class="stat-percent">{{ getStatusPercent('outdated') }}%</div>
              </div>
            </div>
            
            <div class="stat-item stat-failed">
              <div class="stat-icon">✗</div>
              <div class="stat-info">
                <div class="stat-label">失败</div>
                <div class="stat-value">{{ statusCounts.failed }}</div>
                <div class="stat-percent">{{ getStatusPercent('failed') }}%</div>
              </div>
            </div>
          </div>
          
          <div class="stats-total">
            总文档数: {{ totalDocuments }}
          </div>
        </div>
        
        <div class="panel-content" style="padding: 14px">
          <!-- 加载知识空间状态 -->
          <div v-if="feishuStore.isLoggedIn && isLoadingSpaces" class="loading-hint">
            <t-loading size="small" />
            <span>正在加载知识空间...</span>
          </div>
          
          <!-- 知识空间为空提示 -->
          <div v-if="feishuStore.isLoggedIn && !isLoadingSpaces && spaces.length === 0" class="empty-hint">
            <p>暂无知识空间</p>
            <t-button size="small" @click="loadSpaces">重新加载</t-button>
          </div>
          
          <!-- 知识空间选择 -->
          <div v-if="feishuStore.isLoggedIn && spaces.length > 0" class="config-item">
            <label>飞书知识空间</label>
            <t-select
              v-model="selectedSpace"
              @change="handleSpaceChange"
              placeholder="请选择知识空间"
              class="config-input"
            >
              <t-option
                v-for="space in spaces"
                :key="space.space_id"
                :value="space.space_id"
                :label="space.name"
              />
            </t-select>
          </div>

          <!-- 目标知识库选择 -->
          <div v-if="feishuStore.isLoggedIn && spaces.length > 0" class="config-item">
            <label>目标知识库</label>
            <t-select
              v-model="selectedKbId"
              placeholder="请选择知识库"
              class="config-input"
            >
              <t-option
                v-for="kb in knowledgeBases"
                :key="kb.id"
                :value="kb.id"
                :label="kb.name"
              />
            </t-select>
          </div>

          <!-- 同步操作区 -->
          <div v-if="feishuStore.isLoggedIn && nodes.length > 0" class="sync-actions">
            <div class="selected-info">
              <span class="info-label">已选择</span>
              <span class="info-value">{{ checkedNodesCount }}</span>
              <span class="info-unit">个文档</span>
            </div>
            
            <div class="button-group">
              <template v-if="showConfirm">
                <t-button
                  @click="confirmSync"
                  :loading="isSyncing"
                  theme="success"
                  block
                >
                  确认同步
                </t-button>
                <t-button
                  @click="cancelSync"
                  :disabled="isSyncing"
                  theme="default"
                  block
                  class="mt-8"
                >
                  取消
                </t-button>
              </template>
              <t-button
                v-else
                @click="handleSyncClick"
                :disabled="isSyncing || checkedNodesCount === 0 || !selectedKbId"
                theme="primary"
                block
              >
                {{ isSyncing ? '同步中...' : '开始同步' }}
              </t-button>
            </div>
            
            <t-alert
              v-if="syncProgress"
              :theme="syncResult ? 'success' : 'info'"
              :message="syncProgress"
              class="mt-16"
            />
          </div>
        </div>
      </div>

      <!-- 右侧文档树 -->
      <div class="right-panel">
        <div class="panel-header" style="padding: 17px 24px 17px;">
          <h3>文档列表</h3>
          <t-tooltip content="查看同步日志" placement="bottom">
            <t-icon
              name="history"
              class="log-icon"
              @click="showLogDialog = true"
            />
          </t-tooltip>
        </div>
        
        <div class="panel-content">
          <!-- 文档树加载状态 -->
          <div v-if="isLoadingNodes" class="loading-state">
            <t-loading size="large" />
            <p>正在加载文档树...</p>
          </div>

          <!-- 文档树 -->
          <div v-else-if="nodes.length > 0" class="tree-container">
            <FeishuNode
              v-for="node in nodes"
              :key="node.node_token"
              :node="node"
              :level="0"
              @toggle-check="toggleNodeCheck"
              @toggle-expand="toggleNodeExpand"
            />
          </div>

          <!-- 空状态提示 -->
          <div v-else-if="selectedSpace && !isLoadingNodes" class="empty-state">
            <p>该知识空间暂无文档</p>
          </div>
          
          <!-- 初始状态提示 -->
          <div v-else class="empty-state">
            <p>请先选择知识空间</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 同步日志弹窗 -->
    <SyncLogDialog
      v-model:visible="showLogDialog"
      :knowledge-base-id="selectedKbId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import FeishuNode from './components/FeishuNode.vue'
import SyncLogDialog from './components/SyncLogDialog.vue'
import { listKnowledgeBases } from '@/api/knowledge-base'
import { getFeishuSpaces, getFeishuSpaceNodes, syncFeishuDocuments, getDocumentsSyncStatus, checkDocumentPermission, type SyncStatus } from '@/api/feishu'
import { useFeishuStore } from '@/stores/feishu'

// 飞书应用配置
const FEISHU_APP_ID = 'cli_a914e49515f95bb5'
const FEISHU_REDIRECT_URI = `${window.location.origin}/platform/feishu-sync`

const route = useRoute()
const router = useRouter()
const feishuStore = useFeishuStore()

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
  has_permission?: boolean  // 是否有权限同步
}

const spaces = ref<any[]>([])
const selectedSpace = ref('')
const nodes = ref<SpaceNode[]>([])
const isLoadingSpaces = ref(false)
const isLoadingNodes = ref(false)
const isSyncing = ref(false)
const isLoggingIn = ref(false)  // 飞书登录中状态
const knowledgeBases = ref<any[]>([])
const selectedKbId = ref('')
const syncProgress = ref('')
const showConfirm = ref(false)
const syncResult = ref<any>(null)
const showLogDialog = ref(false)
const isBatchUpdating = ref(false)  // 标记是否在批量更新子节点

// 飞书登录相关
const handleFeishuLogin = () => {
  // 生成随机 state 用于防止 CSRF 攻击
  const state = Math.random().toString(36).substring(2, 15)
  sessionStorage.setItem('feishu_oauth_state', state)
  
  // 构建飞书授权 URL（根据官方文档）
  // 包含所有需要的权限（用空格分隔）
  const scopes = 'docs:document.content:read docs:document:copy docs:document:export drive:export:readonly docx:document docx:document:readonly wiki:node:read wiki:space:retrieve wiki:wiki wiki:wiki:readonly offline_access'
  
  const params = new URLSearchParams({
    client_id: FEISHU_APP_ID,
    response_type: 'code',
    redirect_uri: FEISHU_REDIRECT_URI,
    scope: scopes,
  })
  
  // 使用官方文档的 /authorize 端点
  const authUrl = `https://accounts.feishu.cn/open-apis/authen/v1/authorize?${params.toString()}`
  
  
  // 重定向到飞书授权页面
  window.location.href = authUrl
}

const handleFeishuLogout = () => {
  feishuStore.logout()
  MessagePlugin.success('已退出飞书登录')
}

// 处理飞书回调
const handleFeishuCallback = async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  
  if (code) {
    // 验证 state 参数（防止 CSRF 攻击）
    const savedState = sessionStorage.getItem('feishu_oauth_state')
    if (state && savedState && state !== savedState) {
      MessagePlugin.error('授权验证失败，请重试')
      sessionStorage.removeItem('feishu_oauth_state')
      return
    }
    
    let loginSuccess = false
    
    try {
      // 设置登录中状态
      isLoggingIn.value = true
      
      // 通过我们的后端调用飞书 API（避免跨域问题）
      await feishuStore.loginWithCode(code, FEISHU_REDIRECT_URI)
      
      loginSuccess = true
      MessagePlugin.success('飞书登录成功')
      
      // 清除 state
      sessionStorage.removeItem('feishu_oauth_state')
      
      // 清除 URL 中的 code 和 state 参数
      router.replace({ query: {} })
    } catch (error: any) {
      console.error('飞书登录失败:', error)
      MessagePlugin.error(`飞书登录失败: ${error.message || error}`)
      sessionStorage.removeItem('feishu_oauth_state')
    } finally {
      // 无论成功或失败，都清除登录中状态
      isLoggingIn.value = false
    }
    
    // 登录成功后自动加载知识空间（在 loading 状态结束后）
    if (loginSuccess) {
      await loadSpaces()
    }
  }
}

// 计算选中的节点数量
const checkedNodesCount = computed(() => {
  return getCheckedNodes(nodes.value).length
})

// 统计各状态的文档数量
const statusCounts = computed(() => {
  const counts = {
    not_synced: 0,
    synced: 0,
    outdated: 0,
    failed: 0
  }
  
  const countStatus = (nodes: SpaceNode[]) => {
    nodes.forEach(node => {
      if (node.obj_token && node.sync_status) {
        counts[node.sync_status]++
      }
      if (node.children) {
        countStatus(node.children)
      }
    })
  }
  
  countStatus(nodes.value)
  return counts
})

// 总文档数
const totalDocuments = computed(() => {
  return statusCounts.value.not_synced + 
         statusCounts.value.synced + 
         statusCounts.value.outdated + 
         statusCounts.value.failed
})

// 计算状态百分比
const getStatusPercent = (status: string) => {
  if (totalDocuments.value === 0) return 0
  const count = statusCounts.value[status as keyof typeof statusCounts.value]
  return Math.round((count / totalDocuments.value) * 100)
}

// 加载知识库列表
onMounted(async () => {
  try {
    const response = await listKnowledgeBases()
    if (response.data) {
      knowledgeBases.value = response.data
      if (response.data.length > 0) {
        selectedKbId.value = response.data[0].id
      }
    }
  } catch (error) {
    console.error('[onMounted] 加载知识库失败:', error)
    MessagePlugin.error('加载知识库失败')
  }
  
  // 处理飞书回调（如果有 code 参数，会在这里登录并加载知识空间）
  await handleFeishuCallback()
  
  // 如果已登录且没有处理回调（即不是刚登录的情况），才加载知识空间
  if (feishuStore.isLoggedIn && !route.query.code) {
    await loadSpaces()
  }
})

// 监听登录状态变化（仅在非初始加载时触发）
let isInitialLoad = true
watch(() => feishuStore.isLoggedIn, async (isLoggedIn) => {
  // 跳过初始加载时的触发
  if (isInitialLoad) {
    isInitialLoad = false
    return
  }
  
  if (isLoggedIn) {
    // 自动刷新 token（如果需要）
    await feishuStore.autoRefresh()
    
    // 自动加载知识空间
    if (spaces.value.length === 0) {
      await loadSpaces()
    }
  }
})

// 加载知识空间列表
const loadSpaces = async () => {
  // 如果已经有知识空间数据，直接返回，避免重复加载
  if (spaces.value.length > 0) {
    return
  }
  
  if (!feishuStore.accessToken) {
    MessagePlugin.warning('请先登录飞书')
    return
  }

  isLoadingSpaces.value = true
  
  try {
    // 自动刷新 token（如果需要）
    await feishuStore.autoRefresh()
    
    const data = await getFeishuSpaces(feishuStore.accessToken)
    
    if (data.success) {
      spaces.value = data.data || []
      MessagePlugin.success(`成功加载 ${spaces.value.length} 个知识空间`)
    } else {
      throw new Error(data.message || '加载失败')
    }
  } catch (error: any) {
    console.error('[loadSpaces] 加载知识空间失败:', error)
    MessagePlugin.error(`加载知识空间失败: ${error.message || error}`)
  } finally {
    isLoadingSpaces.value = false
  }
}

// 递归加载完整的文档树
const loadCompleteTree = async (spaceId: string, parentNodeToken?: string): Promise<SpaceNode[]> => {
  try {
    const data = await getFeishuSpaceNodes(feishuStore.accessToken, spaceId, parentNodeToken)
    
    if (!data.success) {
      throw new Error(data.detail || '加载失败')
    }
    
    const nodes = data.data || []
    
    // 递归加载所有子节点
    const processedNodes = await Promise.all(
      nodes.map(async (node: any) => {
        const processedNode: SpaceNode = {
          ...node,
          checked: false,
          expanded: false,
          // 如果是文档节点，设置默认同步状态
          sync_status: node.obj_token ? 'not_synced' : undefined
        }
        
        // 如果节点有子节点，递归加载
        if (node.has_child) {
          try {
            processedNode.children = await loadCompleteTree(spaceId, node.node_token)
            processedNode.expanded = true // 默认展开
          } catch (error) {
            console.error(`加载子节点失败 (${node.title}):`, error)
            processedNode.children = []
          }
        }
        
        return processedNode
      })
    )
    
    return processedNodes
  } catch (error) {
    console.error('加载节点失败:', error)
    throw error
  }
}



// 处理知识空间选择 - 加载完整树结构
const handleSpaceChange = async (spaceId: string) => {
  if (!spaceId) {
    nodes.value = []
    return
  }
  
  isLoadingNodes.value = true
  nodes.value = []
  
  try {
    MessagePlugin.info('正在加载文档树，请稍候...')
    const treeNodes = await loadCompleteTree(spaceId)
    nodes.value = treeNodes
    
    const totalNodes = countTotalNodes(treeNodes)
    
    MessagePlugin.success(`成功加载文档树，共 ${totalNodes} 个节点`)
    
    // 加载同步状态
    if (selectedKbId.value) {
      await loadSyncStatus()
    }
  } catch (error: any) {
    console.error('加载文档树失败:', error)
    MessagePlugin.error(`加载文档树失败: ${error.message || error}`)
  } finally {
    isLoadingNodes.value = false
  }
}

// 监听知识库选择变化，重新加载同步状态
watch(selectedKbId, async (newKbId) => {
  if (newKbId && nodes.value.length > 0) {
    await loadSyncStatus()
  }
})

// 收集所有文档的 file_token
const collectFileTokens = (nodes: SpaceNode[]): string[] => {
  let tokens: string[] = []
  nodes.forEach(node => {
    if (node.obj_token) {
      tokens.push(node.obj_token)
    }
    if (node.children) {
      tokens = tokens.concat(collectFileTokens(node.children))
    }
  })
  return tokens
}

// 收集所有文档节点（包含完整信息）
const collectDocumentNodes = (nodes: SpaceNode[]): any[] => {
  let docNodes: any[] = []
  nodes.forEach(node => {
    if (node.obj_token) {
      // 只收集需要的字段
      docNodes.push({
        obj_token: node.obj_token,
        updated_at: node.updated_at,
        title: node.title
      })
    }
    if (node.children) {
      docNodes = docNodes.concat(collectDocumentNodes(node.children))
    }
  })
  return docNodes
}

// 加载同步状态
const loadSyncStatus = async () => {
  if (!selectedKbId.value || nodes.value.length === 0) {
    return
  }
  
  try {
    const fileTokens = collectFileTokens(nodes.value)
    const docNodes = collectDocumentNodes(nodes.value)
    
    if (fileTokens.length === 0) {
      return
    }
    
    const data = await getDocumentsSyncStatus(
      feishuStore.accessToken,
      selectedKbId.value,
      fileTokens,
      docNodes  // 传递飞书节点数据
    )
    
    if (data.success) {
      const statusMap = new Map(
        data.data.map((item: SyncStatus) => [item.file_token, item])
      )
      
      // 更新节点的同步状态
      const updateNodeStatus = (nodes: SpaceNode[]): SpaceNode[] => {
        return nodes.map(node => {
          const updatedNode = { ...node }
          
          // 如果是文档节点，更新其状态
          if (node.obj_token) {
            const status = statusMap.get(node.obj_token)
            if (status) {
              updatedNode.sync_status = status.status
              updatedNode.synced_at = status.synced_at
              updatedNode.error_message = status.error_message
              updatedNode.knowledge_id = status.knowledge_id
            } else {
              // 如果没有状态信息，默认为未同步
              updatedNode.sync_status = 'not_synced'
            }
          }
          
          // 递归更新子节点
          if (node.children && node.children.length > 0) {
            updatedNode.children = updateNodeStatus(node.children)
          }
          
          return updatedNode
        })
      }
      
      nodes.value = updateNodeStatus(nodes.value)
    }
  } catch (error: any) {
    console.error('加载同步状态失败:', error)
    // 不显示错误提示，避免干扰用户
  }
}

// 统计节点总数
const countTotalNodes = (nodes: SpaceNode[]): number => {
  let count = nodes.length
  nodes.forEach(node => {
    if (node.children) {
      count += countTotalNodes(node.children)
    }
  })
  return count
}

// 切换节点选中状态
// 更新单个节点的权限状态
const updateNodePermission = (token: string, hasPermission: boolean) => {
  const apply = (list: SpaceNode[]): SpaceNode[] =>
    list.map(node => {
      if (node.node_token === token) return { ...node, has_permission: hasPermission }
      if (node.children) return { ...node, children: apply(node.children) }
      return node
    })
  nodes.value = apply(nodes.value)
}

const toggleNodeCheck = async (nodeToken: string, checked: boolean) => {
  // 如果正在批量更新，忽略子节点触发的事件
  if (isBatchUpdating.value) {
    console.log(`[toggleNodeCheck] 批量更新中，忽略节点: ${nodeToken}`)
    return
  }

  const updateChildrenCheck = (children: SpaceNode[], checked: boolean): SpaceNode[] => {
    return children.map(child => {
      const shouldUpdate = checked
        ? child.sync_status !== 'synced'
        : true
      return {
        ...child,
        checked: shouldUpdate ? checked : child.checked,
        children: child.children ? updateChildrenCheck(child.children, checked) : undefined
      }
    })
  }

  // 如果是取消勾选，直接执行，无需校验
  if (!checked) {
    isBatchUpdating.value = true
    const updateNodes = (list: SpaceNode[]): SpaceNode[] =>
      list.map(node => {
        if (node.node_token === nodeToken) {
          return { ...node, checked: false, children: node.children ? updateChildrenCheck(node.children, false) : undefined }
        }
        if (node.children) return { ...node, children: updateNodes(node.children) }
        return node
      })
    nodes.value = [...updateNodes(nodes.value)]
    await new Promise(resolve => setTimeout(resolve, 50))
    isBatchUpdating.value = false
    return
  }

  // 找到目标节点
  const findNode = (list: SpaceNode[]): SpaceNode | null => {
    for (const node of list) {
      if (node.node_token === nodeToken) return node
      if (node.children) {
        const found = findNode(node.children)
        if (found) return found
      }
    }
    return null
  }
  const targetNode = findNode(nodes.value)
  if (!targetNode) return

  console.log(`[toggleNodeCheck] 目标节点:`, targetNode.title, `有子节点: ${!!targetNode.children}, 子节点数: ${targetNode.children?.length || 0}`)

  // 目标节点本身已知无权限，直接阻止
  if (targetNode.obj_token && targetNode.has_permission === false) {
    MessagePlugin.warning('该文档未开启外部分享，无法同步到知识库')
    return
  }

  // 目标节点本身需要查权限
  if (targetNode.obj_token && targetNode.obj_type && targetNode.has_permission === undefined) {
    const hasPermission = await checkDocumentPermission(
      feishuStore.accessToken,
      targetNode.obj_token,
      targetNode.obj_type
    )
    updateNodePermission(targetNode.node_token, hasPermission)
    if (!hasPermission) {
      MessagePlugin.warning('该文档未开启外部分享，无法同步到知识库')
      return
    }
  }

  // 先立即勾选目标节点（子节点也先勾上，后台再逐个校验）
  isBatchUpdating.value = true
  const updateNodes = (list: SpaceNode[]): SpaceNode[] =>
    list.map(node => {
      if (node.node_token === nodeToken) {
        return { ...node, checked: true, children: node.children ? updateChildrenCheck(node.children, true) : undefined }
      }
      if (node.children) return { ...node, children: updateNodes(node.children) }
      return node
    })
  nodes.value = [...updateNodes(nodes.value)]
  // 等待 DOM 更新完成后再解除批量更新标志
  await new Promise(resolve => setTimeout(resolve, 50))
  isBatchUpdating.value = false

  // 后台串行校验子孙节点权限，查到无权限的立即禁用并取消勾选
  const collectUncheckedDocNodes = (node: SpaceNode): SpaceNode[] => {
    const result: SpaceNode[] = []
    const collect = (n: SpaceNode) => {
      // 收集所有未查询过权限的文档节点（包括目标节点本身，如果它是文档且未查过）
      if (n.obj_token && n.obj_type && n.has_permission === undefined) {
        result.push(n)
      }
      n.children?.forEach(collect)
    }
    collect(node)
    return result
  }

  const toQuery = collectUncheckedDocNodes(targetNode)
  console.log(`[toggleNodeCheck] 需要查询权限的节点数: ${toQuery.length}`, toQuery.map(n => n.title))
  
  for (const node of toQuery) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const hasPermission = await checkDocumentPermission(
      feishuStore.accessToken,
      node.obj_token,
      node.obj_type
    )
    console.log(`[toggleNodeCheck] 节点 ${node.title} 权限查询结果: ${hasPermission}`)
    updateNodePermission(node.node_token, hasPermission)
    // 无权限：取消该节点勾选（has_permission=false 会触发 checkbox 禁用）
    if (!hasPermission) {
      const uncheckNode = (list: SpaceNode[]): SpaceNode[] =>
        list.map(n => {
          if (n.node_token === node.node_token) return { ...n, checked: false }
          if (n.children) return { ...n, children: uncheckNode(n.children) }
          return n
        })
      nodes.value = uncheckNode(nodes.value)
    }
  }
}

// 切换节点展开状态
const toggleNodeExpand = (nodeToken: string) => {
  const updateNodes = (nodes: SpaceNode[]): SpaceNode[] => {
    return nodes.map(node => {
      if (node.node_token === nodeToken) {
        return { ...node, expanded: !node.expanded }
      }
      if (node.children) {
        return { ...node, children: updateNodes(node.children) }
      }
      return node
    })
  }

  nodes.value = updateNodes(nodes.value)
}

// 获取选中的节点
const getCheckedNodes = (nodes: SpaceNode[]): SpaceNode[] => {
  let checked: SpaceNode[] = []
  nodes.forEach(node => {
    if (node.checked) {
      checked.push(node)
    }
    if (node.children) {
      checked = checked.concat(getCheckedNodes(node.children))
    }
  })
  return checked
}

// 开始同步
const handleSyncClick = () => {
  const checkedNodes = getCheckedNodes(nodes.value)
  
  if (checkedNodes.length === 0) {
    MessagePlugin.warning('请至少选择一个文档')
    return
  }

  if (!selectedKbId.value) {
    MessagePlugin.warning('请选择目标知识库')
    return
  }

  showConfirm.value = true
}

  const confirmSync = async () => {
  showConfirm.value = false
  const checkedNodes = getCheckedNodes(nodes.value)
  
  isSyncing.value = true
  syncResult.value = null
  syncProgress.value = `准备同步 ${checkedNodes.length} 个文档...`
  
  try {
    const documents = checkedNodes
      .filter(node => node.obj_token && node.sync_status !== 'synced')
      .map(node => {
        return {
          file_token: node.obj_token,
          title: node.title
        }
      })
    
    if (documents.length === 0) {
      MessagePlugin.warning('选中的节点中没有可同步的文档')
      return
    }
    
    // 收集飞书节点数据（用于判断是否需要更新）
    const docNodes = collectDocumentNodes(nodes.value).filter(node => 
      documents.some(doc => doc.file_token === node.obj_token)
    )
    
    syncProgress.value = `正在同步 ${documents.length} 个文档...`
    
    const data = await syncFeishuDocuments(feishuStore.accessToken, {
      documents: documents,
      knowledge_base_id: selectedKbId.value,
      file_type: 'docx',
      doc_type: 'docx',
      enable_multimodel: false,
      feishu_nodes: docNodes  // 传递飞书节点数据
    })
    
    if (data.success) {
      const result = data.data
      syncResult.value = result
      
      // 构建结果消息
      let message = `同步完成！`
      if (result.created > 0) {
        message += ` 新建 ${result.created} 个`
      }
      if (result.updated > 0) {
        message += ` 更新 ${result.updated} 个`
      }
      if (result.failed > 0) {
        message += ` 失败 ${result.failed} 个`
      }
      
      syncProgress.value = message
      MessagePlugin.success(message)
      
      // 取消所有勾选
      uncheckAllNodes()
      
      // 重新加载同步状态
      await loadSyncStatus()
      
      setTimeout(() => {
        syncProgress.value = ''
        syncResult.value = null
      }, 5000)
    } else {
      throw new Error(data.detail || '同步失败')
    }
  } catch (error: any) {
    console.error('同步失败:', error)
    syncProgress.value = `同步失败: ${error.message || error}`
    MessagePlugin.error(syncProgress.value)
    setTimeout(() => syncProgress.value = '', 5000)
  } finally {
    isSyncing.value = false
  }
}

// 取消所有勾选
const uncheckAllNodes = () => {
  const updateNodes = (nodes: SpaceNode[]): SpaceNode[] => {
    return nodes.map(node => ({
      ...node,
      checked: false,
      children: node.children ? updateNodes(node.children) : undefined
    }))
  }
  
  nodes.value = updateNodes(nodes.value)
}

// 取消同步
const cancelSync = () => {
  showConfirm.value = false
}
</script>

<style lang="less" scoped>
.feishu-sync-container {
  width: 100%;
  height: 100vh;
  background: #fafbfc;
  overflow: hidden;
}

.feishu-sync-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

// 左侧配置面板
.left-panel {
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  border-right: 2px solid rgba(102, 126, 234, 0.1);
  box-shadow: 2px 0 16px rgba(102, 126, 234, 0.05);
}

.panel-header {
  padding: 24px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.5px;
  }
  
  .log-icon {
    font-size: 22px;
    color: #fff;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    
    &:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

// 状态统计
.status-stats {
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

// 飞书登录区域
.login-section {
  padding: 14px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.login-prompt {
  text-align: center;
  padding: 20px 0;
  
  .login-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .login-text {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 20px;
  }
  
  .login-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    .feishu-icon {
      font-size: 18px;
    }
  }
}

.login-success {
  padding: 16px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%);
  border-radius: 12px;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(5, 150, 105, 0.15);
  }
  
  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(5, 150, 105, 0.3);
  }
  
  .user-avatar-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    border: 2px solid rgba(5, 150, 105, 0.3);
  }
  
  .user-details {
    flex: 1;
    text-align: left;
  }
  
  .user-name {
    font-size: 15px;
    font-weight: 600;
    color: #059669;
    margin-bottom: 4px;
  }
  
  .user-status {
    font-size: 12px;
    color: #6b7280;
  }
}

.login-loading {
  text-align: center;
  padding: 32px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 12px;
  
  .loading-text {
    font-size: 15px;
    font-weight: 500;
    color: #667eea;
    margin: 16px 0 8px 0;
  }
  
  .loading-hint {
    font-size: 13px;
    color: #8b92b0;
    margin: 0;
  }
}

// 状态统计
.status-stats {
  padding: 14px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.stats-title {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: 0.5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.stat-icon {
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.stat-not-synced .stat-icon {
  background: rgba(156, 163, 175, 0.15);
  color: #6b7280;
}

.stat-synced .stat-icon {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.stat-outdated .stat-icon {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.stat-failed .stat-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 2px;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #374151;
  line-height: 1;
}

.stat-percent {
  font-size: 10px;
  color: #8b92b0;
  margin-top: 2px;
}

.stats-total {
  text-align: center;
  padding: 10px;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(102, 126, 234, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.3);
    }
  }
}

.config-item {
  margin-bottom: 14px;
  
  label {
    display: block;
    font-size: 13px;
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 8px;
    letter-spacing: 0.3px;
  }
  
  .config-input {
    width: 100%;
  }
}

.loading-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  color: #667eea;
  font-size: 14px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  margin-bottom: 16px;
}

.empty-hint {
  text-align: center;
  padding: 24px;
  background: rgba(156, 163, 175, 0.05);
  border-radius: 8px;
  margin-bottom: 16px;
  
  p {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 12px;
  }
}

.mt-8 {
  margin-top: 8px;
}

.mt-12 {
  margin-top: 12px;
}

.mt-16 {
  margin-top: 16px;
}

.sync-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
}

.selected-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 12px;
  margin-bottom: 16px;
  
  .info-label {
    font-size: 13px;
    color: #6b7280;
  }
  
  .info-value {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    margin: 0 4px;
  }
  
  .info-unit {
    font-size: 13px;
    color: #6b7280;
  }
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 右侧文档树面板
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  
  .panel-content {
    flex: 1;
    overflow: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #8b92b0;
  
  p {
    margin-top: 16px;
    font-size: 14px;
  }
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(102, 126, 234, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.3);
    }
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #8b92b0;
  font-size: 15px;
  
  p {
    margin: 0;
  }
}
</style>
