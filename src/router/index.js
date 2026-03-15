import { createRouter, createWebHistory  } from "vue-router";
import fixedLayout from "@/components/fixedLayout.vue";
import authLayout from "@/components/authLayout.vue";
const routerList = [
  {
    path: '/back',
    name: 'back',
    component: fixedLayout,
    children: [
      {
        path: 'dataAnalysis',
        name: 'dataAnalysis',
        component: () => import('@/views/dataAnalysis.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledgeArticle',
        name: 'knowledgeArticle',
        component: () => import('@/views/knowledgeArticle.vue'),
        meta: {
          title: '知识文章',
          icon: 'Document'
        }
      },
      {
        path: 'consultationRecord',
        name: 'consultationRecord',
        component: () => import('@/views/consultationRecord.vue'),
        meta: {
          title: '咨询记录',
          icon: 'ChatLineRound'
        }
      },
      {
        path: 'moodJournal',
        name: 'moodJournal',
        component: () => import('@/views/moodJournal.vue'),
        meta: {
          title: '情绪日志',
          icon: 'Notebook'
        }
      }
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    component: authLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
          icon: 'Login'
        }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册',
          icon: 'Register'
        }
      }
    ]
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes: routerList
})

export default router