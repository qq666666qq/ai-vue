<template>
    <div class="articleDetail-container">
        <div class="header-section">
            <div class="header-content">
                <el-image :src="iconUrl" style="width: 60px;height: 60px;"></el-image>
                <h1>知识文章详情</h1>
            </div>
        </div>
        <div class="content">
            <div class="diary-card">
                <div class="sub-title">
                    <el-tag size="large" class="category-tag">{{ articleDetail.categoryName }}</el-tag>
                    <div class="flex-box">
                        <el-icon><List /></el-icon>
                        <span>{{ dayjs(articleDetail.updatedAt).format('YYYY-MM-DD') }}</span>
                    </div>
                </div>
                <h1 class="article-title">{{ articleDetail.title }}</h1>
                <div class="summary-content" v-if="articleDetail.summary">
                    <p>{{ articleDetail.summary }}</p>
                </div>
                <div class="flex-box">
                    <div class="flex-box">
                        <el-icon><Avatar /></el-icon>
                        <span>{{ articleDetail.authorName }}</span>
                    </div>
                    <div class="item flex-box">
                        <el-icon><Platform /></el-icon>
                        <span>{{ articleDetail.readCount }} 次阅读</span>
                    </div>
                </div>
            </div>
            <div class="diary-card">
                <div class="content-title">正文内容</div>
                <div class="content-wrapper" v-html="formatContent(articleDetail.content)"></div>
                <div class="tags-content" v-if="hasTags">
                    <h4 class="tags-title">相关标签</h4>
                    <div class="tags-list">
                        <el-tag v-for="tag in tagList" :key="tag" type="info" effect="light" class="tag-item">{{ tag }}</el-tag>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getKnowledgeDetail } from '@/api/frontend'
import dayjs from 'dayjs'
import { Avatar, Platform, List } from '@element-plus/icons-vue'

const route = useRoute()
const iconUrl = new URL('@/assets/images/book.png', import.meta.url).href
const articleDetail = ref({})

onMounted(() => {
    const id = route.params.id
    getKnowledgeDetail(id).then(res => {
        articleDetail.value = res
        console.log('文章详情:', articleDetail.value)
        console.log('tags:', res.tags)
        console.log('tagArray:', res.tagArray)
    })
})

const formatContent = (content) => {
    if (!content) return ''
    return content
}

const tagList = computed(() => {
    if (articleDetail.value.tagArray && articleDetail.value.tagArray.length) {
        return articleDetail.value.tagArray
    }
    if (articleDetail.value.tags) {
        if (Array.isArray(articleDetail.value.tags)) {
            return articleDetail.value.tags
        }
        if (typeof articleDetail.value.tags === 'string' && articleDetail.value.tags.trim()) {
            return articleDetail.value.tags.split(/[,,]/).map(t => t.trim()).filter(t => t)
        }
    }
    return []
})

const hasTags = computed(() => {
    return tagList.value.length > 0
})
</script>

<style lang="scss" scoped>
.articleDetail-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    min-height: 100vh;

    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;

        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0 auto;
            width: 1200px;

            h1 {
                font-size: 32px;
                font-weight: 600;
            }
        }
    }

    .content {
        margin: 0 auto;
        width: 1200px;
        padding: 20px;

        .diary-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
            margin-bottom: 16px;

            .content-title {
                font-size: 16px;
                font-weight: 600;
                color: #303133;
                margin-bottom: 16px;
            }

            .sub-title {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;

                .category-tag {
                    font-size: 12px;
                    padding: 3px 10px;
                    background-color: #ecf5ff;
                    border-color: #d9ecff;
                    color: #409eff;
                }

                .flex-box {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #909399;
                    font-size: 13px;
                    font-weight: 500;
                }
            }

            .article-title {
                font-size: 24px;
                font-weight: 600;
                color: #303133;
                margin: 16px 0;
                line-height: 1.4;
            }

            .summary-content {
                background: #f0f9eb;
                border-left: 3px solid #67c23a;
                padding: 12px 16px;
                border-radius: 4px;
                margin: 20px 0;

                p {
                    color: #606266;
                    line-height: 1.6;
                    margin: 0;
                    font-size: 14px;
                }
            }

            .flex-box {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid #ebeef5;

                .item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #909399;
                    font-size: 13px;
                }
            }

            .content-wrapper {
                font-size: 14px;
                line-height: 1.8;
                color: #606266;

                :deep(p) {
                    margin-bottom: 16px;
                    line-height: 1.8;
                    color: #606266;
                }

                :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
                    margin-top: 20px;
                    margin-bottom: 12px;
                    font-weight: 600;
                    line-height: 1.4;
                    color: #303133;
                }

                :deep(h1) {
                    font-size: 18px;
                }

                :deep(h2) {
                    font-size: 16px;
                }

                :deep(h3) {
                    font-size: 15px;
                }

                :deep(h4), :deep(h5), :deep(h6) {
                    font-size: 14px;
                }

                :deep(ul), :deep(ol) {
                    margin-bottom: 16px;
                    padding-left: 24px;

                    li {
                        margin-bottom: 6px;
                        color: #606266;
                    }
                }

                :deep(blockquote) {
                    margin: 16px 0;
                    padding: 12px 16px;
                    background: #f0f9eb;
                    border-left: 3px solid #67c23a;
                    border-radius: 4px;
                    color: #606266;
                }

                :deep(pre) {
                    background: #1f2937;
                    color: #f9fafb;
                    padding: 16px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 16px 0;

                    code {
                        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                        font-size: 14px;
                        line-height: 1.6;
                    }
                }

                :deep(code) {
                    background: #f5f7fa;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-size: 13px;
                    color: #909399;
                }

                :deep(table) {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 16px 0;

                    th, td {
                        border: 1px solid #ebeef5;
                        padding: 12px;
                        text-align: left;
                    }

                    th {
                        background: #f5f7fa;
                        font-weight: 600;
                    }
                }

                :deep(img) {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 16px 0;
                }
            }

            .tags-content {
                margin-top: 24px;
                padding-top: 16px;
                border-top: 1px solid #e4e7ed;

                .tags-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #606266;
                    margin-bottom: 12px;
                }

                .tags-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;

                    .tag-item {
                        font-size: 12px;
                        padding: 4px 10px;
                        background-color: #f5f7fa;
                        border-color: #e4e7ed;
                        color: #606266;
                    }
                }
            }
        }
    }
}
</style>
