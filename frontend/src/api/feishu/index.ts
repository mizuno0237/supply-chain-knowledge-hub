import axios from 'axios'

/**
 * 飞书 API 客户端
 * 所有请求都需要在 headers 中携带 X-Feishu-Token
 */

export interface FeishuSpace {
  space_id: string
  name: string
  description?: string
}

export interface FeishuNode {
  node_token: string
  obj_token: string
  node_type: string
  obj_type: string
  title: string
  has_child: boolean
  children?: FeishuNode[]
  updated_at?: string  // 飞书文档更新时间
}

export interface SyncStatus {
  file_token: string
  status: 'not_synced' | 'synced' | 'outdated' | 'failed'
  synced_at?: string  // WeKnora 录入时间
  feishu_updated_at?: string  // 飞书更新时间
  error_message?: string  // 失败原因
  knowledge_id?: string  // WeKnora 知识ID
}

export interface SyncDocument {
  file_token: string
  title: string
}

export interface SyncRequest {
  documents: SyncDocument[]
  knowledge_base_id: string
  file_type?: string
  doc_type?: string
  enable_multimodel?: boolean
  feishu_nodes?: any[]  // 飞书节点列表（包含 updated_at）
}

export interface SyncResult {
  success: number
  failed: number
  details?: any[]
}

/**
 * 飞书 OAuth Token 响应接口（官方 API 返回结构）
 */
export interface FeishuOAuthTokenResponse {
  access_token: string              // 用户访问令牌
  expires_in: number                // access_token 有效期（秒）
  refresh_token?: string            // 刷新令牌（仅在授予 offline_access 权限时返回）
  refresh_token_expires_in?: number // refresh_token 有效期（秒）
  token_type: string                // 固定为 "Bearer"
  scope: string                     // 权限列表（空格分隔）
}

/**
 * 直接调用飞书官方 API 获取用户访问令牌（仅用于测试！）
 * ⚠️ 警告：这会暴露 APP_SECRET，生产环境必须使用后端中转
 * @param code 飞书授权回调返回的授权码
 * @param redirectUri 重定向 URI（可选，但建议提供）
 */
export async function getFeishuUserTokenDirect(code: string, redirectUri?: string) {
  const APP_ID = 'cli_a914e49515f95bb5'
  const APP_SECRET = '' // ⚠️ 暴露在前端！
  
  const payload: any = {
    grant_type: 'authorization_code',
    client_id: APP_ID,
    client_secret: APP_SECRET,
    code: code
  }
  
  if (redirectUri) {
    payload.redirect_uri = redirectUri
  }
  
  // 直接调用飞书官方 API
  const response = await axios.post(
    'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
    payload,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  
  return {
    success: response.data.code === 0,
    data: response.data.code === 0 ? {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      refresh_token_expires_in: response.data.refresh_token_expires_in,
      token_type: response.data.token_type,
      scope: response.data.scope
    } : null,
    error: response.data.code !== 0 ? response.data.msg : null
  }
}

/**
 * 使用授权码获取用户访问令牌（通过我们的后端）
 * @param code 飞书授权回调返回的授权码
 * @param redirectUri 重定向 URI（可选，但建议提供）
 */
export async function getFeishuUserToken(code: string, redirectUri?: string) {
  const response = await axios.post('/api/v1/feishu/oauth/token', { 
    code,
    redirect_uri: redirectUri
  })
  return response.data
}

/**
 * 刷新用户访问令牌
 * @param refreshToken 刷新令牌
 */
export async function refreshFeishuUserToken(refreshToken: string) {
  const response = await axios.post('/api/v1/feishu/oauth/refresh', {
    refresh_token: refreshToken
  })
  return response.data
}

/**
 * 获取飞书知识空间列表
 * @param tenantToken 飞书租户 Token
 */
export async function getFeishuSpaces(tenantToken: string) {
  const response = await axios.get('/api/v1/feishu/spaces', {
    headers: {
      'X-Feishu-Token': tenantToken
    }
  })
  return response.data
}

/**
 * 获取知识空间节点
 * @param tenantToken 飞书租户 Token
 * @param spaceId 知识空间 ID
 * @param parentNodeToken 父节点 Token（可选，用于懒加载子节点）
 */
export async function getFeishuSpaceNodes(
  tenantToken: string,
  spaceId: string,
  parentNodeToken?: string
) {
  const response = await axios.post('/api/v1/feishu/space/nodes', {
    space_id: spaceId,
    parent_node_token: parentNodeToken
  }, {
    headers: {
      'X-Feishu-Token': tenantToken
    }
  })
  return response.data
}

/**
 * 同步飞书文档到知识库
 * @param tenantToken 飞书租户 Token
 * @param data 同步请求数据
 */
export async function syncFeishuDocuments(
  tenantToken: string,
  data: SyncRequest
) {
  const token = localStorage.getItem('weknora_token')
  const response = await axios.post('/api/v1/feishu/sync/documents', data, {
    headers: {
      'X-Feishu-Token': tenantToken,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  })
  return response.data
}

/**
 * 获取文档同步状态
 * @param tenantToken 飞书租户 Token
 * @param knowledgeBaseId 知识库 ID
 * @param fileTokens 文档 token 列表
 * @param feishuNodes 飞书节点列表（包含 updated_at）
 */
/**
 * 获取飞书用户信息（通过后端代理）
 * @param userAccessToken 用户访问令牌
 */
export async function getFeishuUserInfo(userAccessToken: string) {
  const response = await axios.get('/api/v1/feishu/user/info', {
    headers: {
      'X-Feishu-Token': userAccessToken
    }
  })
  return response.data
}

/**
 * 获取同步日志
 * @param knowledgeBaseId 知识库 ID（可选）
 * @param limit 返回最近的日志数量
 */
export async function getSyncLogs(
  knowledgeBaseId?: string,
  limit: number = 10
) {
  const params: any = { limit }
  if (knowledgeBaseId) {
    params.knowledge_base_id = knowledgeBaseId
  }
  
  const response = await axios.get('/api/v1/feishu/sync/logs', { params })
  return response.data
}

/**
 * 获取文档同步状态
 * @param tenantToken 飞书租户 Token
 * @param knowledgeBaseId 知识库 ID
 * @param fileTokens 文档 token 列表
 * @param feishuNodes 飞书节点列表（包含 updated_at）
 */
/**
 * 查询单个文档的导出权限（通过后端代理，避免跨域）
 * @param userAccessToken 用户访问令牌
 * @param objToken 文档 token
 * @param objType 文档类型
 */
export async function checkDocumentPermission(
  userAccessToken: string,
  objToken: string,
  objType: string
): Promise<boolean> {
  try {
    const response = await axios.get(`/api/v1/feishu/permissions/${objToken}`, {
      params: { type: objType, action: 'export' },
      headers: { 'X-Feishu-Token': userAccessToken }
    })
    return response.data?.data?.auth_result === true
  } catch {
    return true // 查询失败默认放行
  }
}

export async function getDocumentsSyncStatus(
  tenantToken: string,
  knowledgeBaseId: string,
  fileTokens: string[],
  feishuNodes?: any[]
) {
  const token = localStorage.getItem('weknora_token')
  const response = await axios.post('/api/v1/feishu/sync/status', {
    knowledge_base_id: knowledgeBaseId,
    file_tokens: fileTokens,
    feishu_nodes: feishuNodes
  }, {
    headers: {
      'X-Feishu-Token': tenantToken,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  })
  return response.data
}
