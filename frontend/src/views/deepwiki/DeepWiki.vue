<template>
  <div class="deep-wiki-container">
    <iframe
      :src="deepWikiUrl"
      class="deep-wiki-iframe"
      frameborder="0"
      allowfullscreen
      @load="onIframeLoad"
      @error="onIframeError"
    />
    <div v-if="loading" class="loading-overlay">
      <t-loading size="large" :text="t('deepWiki.loading')" />
    </div>
    <div v-if="error" class="error-overlay">
      <t-result
        theme="error"
        :title="t('deepWiki.loadError')"
        :description="t('deepWiki.loadErrorDesc')"
      >
        <template #extra>
          <t-button theme="primary" @click="reloadIframe">
            {{ t('deepWiki.retry') }}
          </t-button>
        </template>
      </t-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// DeepWiki URL
const deepWikiUrl = 'http://10.7.100.231:3000/'

// 状态管理
const loading = ref(true)
const error = ref(false)

// iframe 加载完成
const onIframeLoad = () => {
  loading.value = false
  error.value = false
}

// iframe 加载错误
const onIframeError = () => {
  loading.value = false
  error.value = true
}

// 重新加载 iframe
const reloadIframe = () => {
  loading.value = true
  error.value = false
  // 通过改变 src 来重新加载 iframe
  const iframe = document.querySelector('.deep-wiki-iframe') as HTMLIFrameElement
  if (iframe) {
    iframe.src = iframe.src
  }
}

onMounted(() => {
  // 设置超时，如果 iframe 长时间未加载完成则显示错误
  setTimeout(() => {
    if (loading.value) {
      onIframeError()
    }
  }, 10000) // 10秒超时
})
</script>

<style lang="less" scoped>
.deep-wiki-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--td-bg-color-container);
  overflow: hidden;
}

.deep-wiki-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: var(--td-bg-color-container);
  display: block;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--td-bg-color-container);
  z-index: 10;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--td-bg-color-container);
  z-index: 10;
  padding: 40px;
  box-sizing: border-box;
}

// 响应式设计
@media (max-width: 768px) {
  .error-overlay {
    padding: 20px;
  }
}
</style>