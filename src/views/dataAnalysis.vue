<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="menuImg1" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <div class="title">用户总数</div>
              <div class="number">{{ overview?.systemOverview?.totalUsers || 0 }}</div>
              <div class="subtitle-title">活跃用户：{{ overview?.systemOverview?.activeUsers || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="menuImg2" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <div class="title">情绪日志</div>
              <div class="number">{{ overview?.systemOverview?.totalDiaries || 0 }}</div>
              <div class="subtitle-title">今日新增：{{ overview?.systemOverview?.todayNewDiaries || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="menuImg3" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <div class="title">咨询会话</div>
              <div class="number">{{ overview?.systemOverview?.totalSessions || 0 }}</div>
              <div class="subtitle-title">今日新增：{{ overview?.systemOverview?.todayNewSessions || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="menuImg4" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <div class="title">平均情绪</div>
              <div class="number">{{ overview?.systemOverview?.avgMoodScore || 0 }}/10</div>
              <div class="subtitle-title">情绪健康指数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 图表 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">
              情绪趋势分析
            </div>
            <div class="chart-content">
              <div ref="emotionChartRef" style="height: 300px;width: 100%;"></div>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">
              咨询会话统计
            </div>
            <div class="chart-content">
              <div class="consultation-stats">
                <div class="stat-item">
                  <div class="stat-label">总会话数</div>
                  <div class="stat-value">{{ overview?.consultationStats?.totalSessions || 0 }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">平均时长</div>
                  <div class="stat-value">{{ overview?.consultationStats?.avgDurationMinutes || 0 }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">活跃用户</div>
                  <div class="stat-value">{{ overview?.consultationStats?.totalSessions || 0 }}</div>
                </div>
              </div>
              <div ref="consultationChartRef" style="height: 260px;width: 100%;"></div>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <!-- 用户活跃度趋势 -->
    <el-row gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">
              用户活跃度趋势
            </div>
            <div class="chart-content">
              <div ref="userActivityChartRef" style="height: 300px;width: 100%;"></div>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
import { getOverview } from '@/api/admin';
import * as echarts from 'echarts'
const menuImg1 = new URL('@/assets/images/users.png', import.meta.url).href
const menuImg2 = new URL('@/assets/images/like.png', import.meta.url).href
const menuImg3 = new URL('@/assets/images/comments.png', import.meta.url).href
const menuImg4 = new URL('@/assets/images/smile.png', import.meta.url).href
const overview = ref({})
// 情绪分析统计
const emotionChartRef = ref(null)
let emotionChart = null
// 咨询会话统计
const consultationChartRef = ref(null)
let consultationChart = null
//用户活跃度趋势
const userActivityChartRef = ref(null)
let userActivityChart = null
//初始化图表
const initCharts = () => {
  initEmotionChart()
  initConsultationChart()
  initUserActivityChart()
}
//情绪趋势
const initEmotionChart = () => {
  if (!emotionChartRef.value) return
  //销毁旧图表
  if (emotionChart) {
    emotionChart.dispose()
  }
  //初始化新图表
  emotionChart = echarts.init(emotionChartRef.value)
  const emotionData = overview.value?.emotionTrend || []
  //配置图表
  emotionChart.setOption({
    title: {
      text: '情绪趋势分析',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#2d3436',
        fontSize: 16,
        fontWeight: 600
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#7f8c8d',
          type: 'dashed'
        }
      }
    },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: 40,
      textStyle: {
        color: '#7f8c8d'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      top: 80,
      bottom: '30%'
    },
    xAxis: {
      type: 'category',
      data: emotionData.map(item => item.date),
      axisLabel: {
        lineStyle: {
          color: '#B4C6D0'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '情绪评分',
        position: 'left',
        axisLabel: {
          lineStyle: {
            color: '#B4C6D0'
          }
        }
      },
      {
        type: 'value',
        name: '记录数量',
        position: 'right',
        axisLabel: {
          lineStyle: {
            color: '#B4C6D0'
          }
        }
      }
    ],
    series: [
      {
        name: '平均情绪评分',
        type: 'line',
        data: emotionData.map(item => item.avgMoodScore),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#F08080',
        },
        itemStyle: {
          color: '#F08080'
        }
      },
      {
        name: '记录数量',
        type: 'line',
        data: emotionData.map(item => item.recordCount),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#B4C6D0',
        },
        itemStyle: {
          color: '#B4C6D0'
        }
      },
    ]
  })
}
//咨询会话统计
const initConsultationChart = () => {
  if (!consultationChartRef.value) return
  //销毁旧图表
  if (consultationChart) {
    consultationChart.dispose()
  }
  //初始化新图表
  consultationChart = echarts.init(consultationChartRef.value)
  //获取数据
  const consultationData = overview.value?.consultationStats?.dailyTrend || []
  consultationChart.setOption({
    title: {
      text: '咨询活动统计',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['会话数量', '参与用户数'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: consultationData.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '会话数量',
        type: 'bar',
        data: consultationData.map(item => item.sessionCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#74b9ff' },
              { offset: 1, color: '#0984e3' }
            ]
          }
        },
        barWidth: '40%'
      },
      {
        name: '参与用户数',
        type: 'bar',
        data: consultationData.map(item => item.userCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#fdcb6e' },
              { offset: 1, color: '#f39c12' }
            ]
          }
        },
        barWidth: '40%'
      }
    ]
  })
}
// 用户活跃度趋势
const initUserActivityChart = () => {
  if (!userActivityChartRef.value) return
  //销毁旧图表
  if (userActivityChart) {
    userActivityChart.dispose()
  }
  //初始化新图表
  userActivityChart = echarts.init(userActivityChartRef.value)
  //获取数据
  const userActivityData = overview.value?.userActivity || []
  userActivityChart.setOption(
    {
      title: {
        text: '用户活跃度趋势',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#2d3436'
        },
        left: 'center',
        top: 10
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#fab1a0',
        borderWidth: 1,
        textStyle: {
          color: '#2d3436'
        }
      },
      legend: {
        data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
        top: 40,
        textStyle: {
          color: '#636e72'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 80,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: userActivityData.map(item => item.date),
        axisLine: {
          lineStyle: {
            color: 'rgba(244, 162, 97, 0.3)'
          }
        },
        axisLabel: {
          color: '#636e72'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#636e72'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(244, 162, 97, 0.3)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(244, 162, 97, 0.1)'
          }
        }
      },
      series: [
        {
          name: '活跃用户',
          type: 'line',
          data: userActivityData.map(item => item.activeUsers),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#a29bfe'
          },
          itemStyle: {
            color: '#a29bfe'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
                { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
              ]
            }
          }
        },
        {
          name: '新增用户',
          type: 'line',
          data: userActivityData.map(item => item.newUsers),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#fdcb6e'
          },
          itemStyle: {
            color: '#fdcb6e'
          }
        },
        {
          name: '日记用户',
          type: 'line',
          data: userActivityData.map(item => item.diaryUsers),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#00b894'
          },
          itemStyle: {
            color: '#00b894'
          }
        },
        {
          name: '咨询用户',
          type: 'line',
          data: userActivityData.map(item => item.consultationUsers),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#fab1a0'
          },
          itemStyle: {
            color: '#fab1a0'
          }
        }
      ]
    }
  )
}
  onMounted(() => {
    getOverview().then(res => {
      overview.value = res
      initCharts()
    })
  })
</script>
<style lang="scss" scoped>
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;

    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }

      .value {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px
      }

      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }

  .chart-content {
    padding: 20px;
    height: 300px;
    position: relative;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>
