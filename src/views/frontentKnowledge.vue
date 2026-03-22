<template>
    <div class="knowledge-container">
        <div class="header-section">
            <div class="header-content">
                <h1>知识库</h1>
            </div>
        </div>
        <div class="content">
            <div class="recommend-section">
                <div class="section-title">推荐阅读</div>
                <div class="recommend-list">
                    <div class="recommend-item" v-for="(item, index) in knowledgeList.slice(0, 5)" :key="item.id">
                        <div>{{ item.title }}</div>
                        <div class="read-count">
                            <span>{{ item.categoryName }}</span>
                            <span>阅读：{{ item.readCount }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="article-list">
                <div class="article-item" v-for="item in knowledgeList" :key="item.id" @click="goToArticle(item.id)" style="cursor: pointer;">
                    <img :src="getImage(item.coverImage)" alt="封面" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px;">
                    <div class="info">
                        <div class="title">
                            <h2>{{ item.title }}</h2>
                            <span v-if="item.tags">{{ item.tags }}</span>
                        </div>
                        <p>{{ item.summary }}</p>
                        <div class="flex-box">
                            <span>{{ item.categoryName }}</span>
                            <span>作者：{{ item.authorName }}</span>
                            <span>阅读：{{ item.readCount }}</span>
                            <span>时间：{{ item.publishedAt }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination-wrapper"></div>
    </div>
</template>

<script setup>
import { getKnowledgeList } from '@/api/frontend';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const knowledgeList = ref([]);

const getImage = (url) => {
    return url ? 'http://159.75.169.224:1235' + url : 'https://file.itndedu.com/psychology_ai.png';
};

const goToArticle = (id) => {
    router.push(`/knowledge/article/${id}`)
}

onMounted(() => {
    getKnowledgeList({
        sortField: 'readCount',
        sortDirection: 'desc',
        currentPage: 1,
        size: 5
    }).then(res => {
        console.log('获取到的数据:', res);
        knowledgeList.value = res.records;
        console.log('知识库列表:', knowledgeList.value);
    })
})
</script>


<style lang="scss" scoped>
.knowledge-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
        }
    }
    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        display: flex;
        gap: 20px;
        margin: 0 auto;
        width: 1200px;
        padding: 20px;
        .recommend-section {
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 15px;
            height: 400px;
            .section-title {
                font-size: 12;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .recommend-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .recommend-item {
                    border-left: 4px solid #f59e0b;
                    padding-left: 10px;
                    cursor: pointer;
                    .read-count {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
        .article-list {
            flex: 1;
            .article-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                .info {
                    margin-left: 20px;
                    .title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
    }
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding-bottom: 30px;
    }
}
</style>