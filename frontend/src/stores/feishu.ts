import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFeishuUserToken, getFeishuUserTokenDirect, refreshFeishuUserToken, getFeishuUserInfo } from '@/api/feishu'

export interface FeishuUserInfo {
  name: string
  en_name: string
  avatar_url: string
  avatar_thumb: string
  avatar_middle: string
  avatar_big: string
  open_id: string
  union_id: string
  tenant_key: string
}

export const useFeishuStore = defineStore('feishu', () => {
  // 状态
  const accessToken = ref<string>('')
  const refreshToken = ref<string>('')
  const expiresAt = ref<number>(0)
  const userInfo = ref<FeishuUserInfo | null>(null)

  // 计算属性
  const isLoggedIn = computed(() => {
    return !!accessToken.value && Date.now() < expiresAt.value
  })

  const needsRefresh = computed(() => {
    // 提前5分钟刷新
    return !!refreshToken.value && Date.now() > expiresAt.value - 5 * 60 * 1000
  })

  // 从 localStorage 恢复状态
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('feishu_auth')
      if (stored) {
        const data = JSON.parse(stored)
        accessToken.value = data.accessToken || ''
        refreshToken.value = data.refreshToken || ''
        expiresAt.value = data.expiresAt || 0
        userInfo.value = data.userInfo || null
      }
    } catch (error) {
      console.error('加载飞书认证信息失败:', error)
    }
  }

  // 保存到 localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('feishu_auth', JSON.stringify({
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
        expiresAt: expiresAt.value,
        userInfo: userInfo.value
      }))
    } catch (error) {
      console.error('保存飞书认证信息失败:', error)
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!accessToken.value) {
      throw new Error('没有访问令牌')
    }

    try {
      const response = await getFeishuUserInfo(accessToken.value)
      
      if (response.success && response.data) {
        userInfo.value = response.data
        saveToStorage()
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('获取飞书用户信息失败:', error)
      // 提取后端返回的详细错误信息
      const errorMessage = error.response?.data?.detail || error.message || '未知错误'
      throw new Error(errorMessage)
    }
  }

  // 使用授权码登录（直接调用飞书 API，仅用于测试）
  const loginWithCodeDirect = async (code: string, redirectUri?: string) => {
    try {
      const response = await getFeishuUserTokenDirect(code, redirectUri)
      
      if (response.success && response.data) {
        accessToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        expiresAt.value = Date.now() + response.data.expires_in * 1000
        
        // 获取用户信息
        await fetchUserInfo()
        
        saveToStorage()
        return true
      } else {
        throw new Error(response.error || '获取 token 失败')
      }
    } catch (error: any) {
      console.error('飞书登录失败:', error)
      // 提取详细错误信息
      const errorMessage = error.response?.data?.msg || error.message || '未知错误'
      throw new Error(errorMessage)
    }
  }

  // 使用授权码登录（通过我们的后端）
  const loginWithCode = async (code: string, redirectUri?: string) => {
    try {
      const response = await getFeishuUserToken(code, redirectUri)
      
      if (response.success && response.data) {
        accessToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        // expires_in 是秒数，转换为毫秒时间戳
        expiresAt.value = Date.now() + response.data.expires_in * 1000
        
        // 获取用户信息
        await fetchUserInfo()
        
        saveToStorage()
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('飞书登录失败:', error)
      // 提取后端返回的详细错误信息
      const errorMessage = error.response?.data?.detail || error.message || '未知错误'
      throw new Error(errorMessage)
    }
  }

  // 刷新令牌
  const refresh = async () => {
    if (!refreshToken.value) {
      throw new Error('没有刷新令牌')
    }

    try {
      const response = await refreshFeishuUserToken(refreshToken.value)
      
      if (response.success && response.data) {
        accessToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        expiresAt.value = Date.now() + response.data.expires_in * 1000
        
        saveToStorage()
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('刷新飞书令牌失败:', error)
      // 刷新失败，清除认证信息
      logout()
      // 提取后端返回的详细错误信息
      const errorMessage = error.response?.data?.detail || error.message || '未知错误'
      throw new Error(errorMessage)
    }
  }

  // 自动刷新（如果需要）
  const autoRefresh = async () => {
    if (needsRefresh.value) {
      try {
        await refresh()
      } catch (error) {
        console.error('自动刷新失败:', error)
      }
    }
  }

  // 登出
  const logout = () => {
    accessToken.value = ''
    refreshToken.value = ''
    expiresAt.value = 0
    userInfo.value = null
    localStorage.removeItem('feishu_auth')
  }

  // 初始化时加载
  loadFromStorage()

  return {
    accessToken,
    refreshToken,
    expiresAt,
    userInfo,
    isLoggedIn,
    needsRefresh,
    loginWithCode,
    loginWithCodeDirect,  // 直接调用飞书 API（仅测试用）
    refresh,
    autoRefresh,
    logout,
    fetchUserInfo
  }
})
