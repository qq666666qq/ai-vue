import { createRouter, createWebHistory  } from "vue-router";
import fixedLayout from "@/components/fixedLayout.vue";
import authLayout from "@/components/authLayout.vue";
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import frontLayout from "@/components/frontLayout.vue";
const routerList = [
  {
    path: '/back',
    redirect: '/back/dataAnalysis',//默认跳转到数据分析
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
const frontlayouot=[{
  path:"/",
  component:frontLayout,
  children:[
    {
      path:"/",
      component:()=>import('@/views/home.vue'),
      
    },
    {
      path:"/consultation",
      component:()=>import('@/views/consultation.vue'),
      
    },
    {
      path:"/emotion-diary",
      component:()=>import('@/views/emotionDiary.vue'),
      
    },
    {
      path:"/knowledge",
      component:()=>import('@/views/frontentKnowledge.vue'),
      
    },
  ]
}]
const router = createRouter({
  history: createWebHistory(),
  routes: [...routerList,...frontlayouot]
})



router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo.userType == 2) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dataAnalysis')
      }
    } else if (userInfo.userType == 1) { 
      if (to.path.startsWith('/back')||to.path.startsWith('/auth')) {
        next("/")
      } else {
        next()
      }
    }
  } else {
    if (to.path.startsWith('/auth') || to.path === '/' || to.path.startsWith('/consultation') || to.path.startsWith('/emotion-diary') || to.path.startsWith('/knowledge')) {
      next()
    } else {
      next('/auth/login')
    }
  }
})

export default router