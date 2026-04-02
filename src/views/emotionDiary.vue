<template>
    <div class="stardew-diary">
        <div class="sky-bg">
            <div class="sun-mini"></div>
            <div class="cloud-mini cloud-m1"></div>
            <div class="cloud-mini cloud-m2"></div>
        </div>
        
        <div class="diary-container">
            <div class="diary-header">
                <div class="header-character">
                    <div class="character-avatar">
                        <div class="char-head">
                            <div class="char-hair"></div>
                            <div class="char-face">
                                <div class="char-eyes">
                                    <div class="char-eye"></div>
                                    <div class="char-eye"></div>
                                </div>
                                <div class="char-mouth smile"></div>
                            </div>
                        </div>
                        <div class="char-body"></div>
                    </div>
                </div>
                <div class="header-text">
                    <h1>📔 情绪日记</h1>
                    <p>记录每一天的心情故事</p>
                </div>
                <div class="date-display">
                    <div class="date-icon">📅</div>
                    <div class="date-text">{{ currentDate }}</div>
                </div>
            </div>

            <div class="diary-content">
                <div class="diary-card mood-card">
                    <div class="card-title">
                        <span class="title-icon">⭐</span>
                        <span>今日情绪评分</span>
                    </div>
                    <div class="card-body">
                        <p class="card-desc">你今天整体情绪如何？</p>
                        <div class="mood-rating">
                            <div class="mood-faces">
                                <div class="mood-face" 
                                     v-for="(face, index) in moodFaces" 
                                     :key="index"
                                     :class="{ 'active': diaryData.moodScore === index + 1 }"
                                     @click="diaryData.moodScore = index + 1">
                                    {{ face }}
                                </div>
                            </div>
                            <div class="rating-bar">
                                <div class="rating-track">
                                    <div class="rating-fill" :style="{ width: (diaryData.moodScore || 0) * 10 + '%' }"></div>
                                </div>
                                <div class="rating-labels">
                                    <span>崩溃</span>
                                    <span>平静</span>
                                    <span>幸福</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="diary-card emotion-card">
                    <div class="card-title">
                        <span class="title-icon">🌸</span>
                        <span>主要情绪</span>
                    </div>
                    <div class="card-body">
                        <div class="emotion-grid">
                            <div class="emotion-item" 
                                 v-for="emotion in emotionStatus" 
                                 :key="emotion.name"
                                 :class="{ 'selected': diaryData.dominantEmotion === emotion.name }"
                                 @click="selectEmotion(emotion)">
                                <div class="emotion-avatar">
                                    <div class="emo-head" :style="{ background: emotion.color }">
                                        <div class="emo-face">
                                            <div class="emo-eyes">
                                                <div class="emo-eye" :class="emotion.eyeClass"></div>
                                                <div class="emo-eye" :class="emotion.eyeClass"></div>
                                            </div>
                                            <div class="emo-mouth" :class="emotion.mouthClass"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="emotion-name">{{ emotion.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="diary-card detail-card">
                    <div class="card-title">
                        <span class="title-icon">📝</span>
                        <span>详细记录</span>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <div class="form-label">
                                <span class="label-icon">💭</span>
                                情绪触发因素
                            </div>
                            <el-input 
                                v-model="diaryData.emotionTriggers" 
                                placeholder="是什么触发了你的情绪呢？" 
                                type="textarea" 
                                :rows="3" 
                                maxlength="1000" 
                                show-word-limit
                                class="stardew-input"
                            />
                        </div>
                        
                        <div class="form-group">
                            <div class="form-label">
                                <span class="label-icon">📖</span>
                                日记内容
                            </div>
                            <el-input 
                                v-model="diaryData.diaryContent" 
                                placeholder="写下你今天的想法、感受或发生的有趣的事情..." 
                                type="textarea" 
                                :rows="4" 
                                maxlength="2000" 
                                show-word-limit
                                class="stardew-input"
                            />
                        </div>

                        <div class="life-indicators">
                            <div class="indicator-item">
                                <div class="indicator-label">
                                    <span class="label-icon">🌙</span>
                                    睡眠质量
                                </div>
                                <div class="indicator-options">
                                    <div class="option-btn" 
                                         v-for="opt in sleepOptions" 
                                         :key="opt.value"
                                         :class="{ 'active': diaryData.sleepQuality === opt.value }"
                                         @click="diaryData.sleepQuality = opt.value">
                                        {{ opt.label }}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="indicator-item">
                                <div class="indicator-label">
                                    <span class="label-icon">⚡</span>
                                    压力等级
                                </div>
                                <div class="indicator-options">
                                    <div class="option-btn" 
                                         v-for="opt in stressOptions" 
                                         :key="opt.value"
                                         :class="{ 'active': diaryData.stressLevel === opt.value }"
                                         @click="diaryData.stressLevel = opt.value">
                                        {{ opt.label }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="stardew-btn secondary" @click="resetForm">
                        <span class="btn-icon">🔄</span>
                        <span>重置</span>
                    </button>
                    <button class="stardew-btn primary" @click="submitForm">
                        <span class="btn-icon">✨</span>
                        <span>保存日记</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="pixel-border top"></div>
        <div class="pixel-border bottom"></div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { createOrUpdateEmotionDiary } from '@/api/frontend';

const currentDate = computed(() => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
});

const moodFaces = ['😢', '😔', '😰', '😕', '😐', '🙂', '😊', '😄', '😁', '🥰'];

const emotionStatus = [
    { name: '开心', color: '#FFD54F', eyeClass: 'happy', mouthClass: 'smile' },
    { name: '平静', color: '#81D4FA', eyeClass: 'calm', mouthClass: 'neutral' },
    { name: '焦虑', color: '#FFAB91', eyeClass: 'anxious', mouthClass: 'worried' },
    { name: '悲伤', color: '#90CAF9', eyeClass: 'sad', mouthClass: 'frown' },
    { name: '兴奋', color: '#F48FB1', eyeClass: 'excited', mouthClass: 'excited' },
    { name: '疲惫', color: '#B0BEC5', eyeClass: 'tired', mouthClass: 'neutral' },
    { name: '惊讶', color: '#CE93D8', eyeClass: 'surprised', mouthClass: 'surprised' },
    { name: '困惑', color: '#A5D6A7', eyeClass: 'confused', mouthClass: 'confused' },
];

const sleepOptions = [
    { label: '很差', value: '1' },
    { label: '较差', value: '2' },
    { label: '一般', value: '3' },
    { label: '良好', value: '4' },
    { label: '优秀', value: '5' },
];

const stressOptions = [
    { label: '很低', value: '1' },
    { label: '较低', value: '2' },
    { label: '中等', value: '3' },
    { label: '较高', value: '4' },
    { label: '很高', value: '5' },
];

const diaryData = reactive({
    diaryDate: new Date().toISOString().split('T')[0],
    moodScore: null,
    dominantEmotion: '',
    emotionTriggers: '',
    diaryContent: '',
    sleepQuality: null,
    stressLevel: null
});

const selectEmotion = (emotion) => {
    diaryData.dominantEmotion = emotion.name;
};

const resetForm = () => {
    Object.assign(diaryData, {
        moodScore: null,
        dominantEmotion: '',
        emotionTriggers: '',
        diaryContent: '',
        sleepQuality: null,
        stressLevel: null
    });
};

const submitForm = () => {
    if (!diaryData.moodScore) {
        ElMessage.error('请选择今日情绪评分');
        return;
    }
    if (!diaryData.dominantEmotion) {
        ElMessage.error('请选择主要情绪');
        return;
    }
    
    createOrUpdateEmotionDiary(diaryData).then(() => {
        ElMessage.success('日记保存成功！继续保持记录哦~');
        resetForm();
    });
};
</script>

<style lang="scss" scoped>
.stardew-diary {
    position: relative;
    min-height: calc(100vh - 70px);
    background: linear-gradient(180deg, #87CEEB 0%, #B3E5FC 40%, #C8E6C9 70%, #81C784 100%);
    overflow: hidden;
}

.sky-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    pointer-events: none;
}

.sun-mini {
    position: absolute;
    top: 20px;
    right: 80px;
    width: 50px;
    height: 50px;
    background: radial-gradient(circle, #FFD54F 0%, #FFC107 100%);
    border-radius: 50%;
    box-shadow: 0 0 40px #FFD54F;
    animation: sunPulse 3s ease-in-out infinite;
}

@keyframes sunPulse {
    0%, 100% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.1); opacity: 1; }
}

.cloud-mini {
    position: absolute;
    background: white;
    border-radius: 30px;
    opacity: 0.8;
    
    &::before, &::after {
        content: '';
        position: absolute;
        background: white;
        border-radius: 50%;
    }
}

.cloud-m1 {
    top: 30px;
    left: 15%;
    width: 60px;
    height: 25px;
    animation: cloudFloat 12s ease-in-out infinite;
    
    &::before { width: 30px; height: 30px; top: -15px; left: 10px; }
    &::after { width: 20px; height: 20px; top: -8px; left: 30px; }
}

.cloud-m2 {
    top: 60px;
    left: 50%;
    width: 70px;
    height: 28px;
    animation: cloudFloat 15s ease-in-out infinite 2s;
    
    &::before { width: 35px; height: 35px; top: -18px; left: 15px; }
    &::after { width: 25px; height: 25px; top: -10px; left: 40px; }
}

@keyframes cloudFloat {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(40px); }
}

.diary-container {
    position: relative;
    z-index: 10;
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px;
}

.diary-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%);
    border: 4px solid #5D4037;
    border-radius: 16px;
    padding: 20px 30px;
    margin-bottom: 25px;
    box-shadow: 4px 4px 0 #5D4037;
}

.header-character {
    .character-avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .char-head {
        position: relative;
        width: 50px;
        height: 50px;
        background: #FFCC80;
        border-radius: 50% 50% 45% 45%;
        border: 3px solid #5D4037;
    }
    
    .char-hair {
        position: absolute;
        top: -8px;
        left: 5px;
        width: 40px;
        height: 25px;
        background: #8D6E63;
        border-radius: 50% 50% 30% 30%;
        border: 2px solid #5D4037;
    }
    
    .char-face {
        position: absolute;
        top: 20px;
        left: 8px;
        width: 34px;
    }
    
    .char-eyes {
        display: flex;
        justify-content: space-between;
        padding: 0 4px;
        margin-bottom: 4px;
    }
    
    .char-eye {
        width: 6px;
        height: 8px;
        background: #3E2723;
        border-radius: 50%;
    }
    
    .char-mouth {
        width: 12px;
        height: 5px;
        background: #D84315;
        border-radius: 0 0 8px 8px;
        margin: 0 auto;
        
        &.smile {
            width: 18px;
            height: 10px;
            border-radius: 0 0 12px 12px;
        }
    }
    
    .char-body {
        width: 35px;
        height: 40px;
        background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
        border: 3px solid #5D4037;
        border-radius: 8px 8px 4px 4px;
        margin-top: -3px;
    }
}

.header-text {
    h1 {
        margin: 0;
        font-size: 32px;
        color: white;
        text-shadow: 2px 2px 0 #2E7D32;
    }
    
    p {
        margin: 5px 0 0;
        font-size: 14px;
        color: #E8F5E9;
    }
}

.date-display {
    display: flex;
    align-items: center;
    gap: 10px;
    background: white;
    border: 3px solid #5D4037;
    border-radius: 12px;
    padding: 10px 15px;
    box-shadow: 2px 2px 0 #5D4037;
}

.date-icon {
    font-size: 24px;
}

.date-text {
    font-size: 14px;
    font-weight: 600;
    color: #5D4037;
}

.diary-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.diary-card {
    background: white;
    border: 4px solid #5D4037;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 4px 4px 0 #5D4037;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    background: linear-gradient(180deg, #FFF8E1 0%, #FFECB3 100%);
    border-bottom: 3px solid #5D4037;
    font-size: 18px;
    font-weight: 700;
    color: #5D4037;
}

.title-icon {
    font-size: 22px;
}

.card-body {
    padding: 20px;
}

.card-desc {
    margin: 0 0 20px;
    font-size: 15px;
    color: #6D4C41;
}

.mood-rating {
    .mood-faces {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    
    .mood-face {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        background: #FFF8E1;
        border: 3px solid #8D6E63;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            transform: scale(1.15);
            background: #FFECB3;
        }
        
        &.active {
            transform: scale(1.2);
            border-color: #4CAF50;
            background: #C8E6C9;
            box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
        }
    }
    
    .rating-bar {
        .rating-track {
            height: 20px;
            background: #E0E0E0;
            border: 3px solid #5D4037;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .rating-fill {
            height: 100%;
            background: linear-gradient(90deg, #E57373 0%, #FFD54F 50%, #81C784 100%);
            transition: width 0.3s ease;
        }
        
        .rating-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            font-size: 12px;
            color: #8D6E63;
        }
    }
}

.emotion-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
}

.emotion-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 10px;
    background: #FFF8E1;
    border: 3px solid #8D6E63;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        transform: translateY(-3px);
        background: #FFECB3;
    }
    
    &.selected {
        border-color: #4CAF50;
        background: #C8E6C9;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        
        .emo-head {
            animation: bounce 0.5s ease-in-out infinite;
        }
    }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

.emotion-avatar {
    margin-bottom: 10px;
}

.emo-head {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #5D4037;
    position: relative;
}

.emo-face {
    position: absolute;
    top: 18px;
    left: 8px;
    width: 34px;
}

.emo-eyes {
    display: flex;
    justify-content: space-between;
    padding: 0 4px;
    margin-bottom: 5px;
}

.emo-eye {
    width: 6px;
    height: 6px;
    background: #3E2723;
    border-radius: 50%;
    
    &.happy { height: 3px; border-radius: 0 0 6px 6px; }
    &.sad { transform: translateY(2px); }
    &.anxious { animation: shake 0.3s ease-in-out infinite; }
    &.excited { height: 8px; }
    &.tired { opacity: 0.5; height: 3px; }
    &.surprised { width: 8px; height: 8px; }
    &.confused { transform: rotate(10deg); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(1px); }
}

.emo-mouth {
    width: 12px;
    height: 5px;
    background: #3E2723;
    margin: 0 auto;
    
    &.smile {
        width: 16px;
        height: 8px;
        background: #D84315;
        border-radius: 0 0 10px 10px;
    }
    
    &.neutral {
        width: 12px;
        height: 3px;
        border-radius: 3px;
    }
    
    &.worried {
        width: 14px;
        height: 6px;
        background: #D84315;
        border-radius: 10px 10px 0 0;
    }
    
    &.frown {
        width: 14px;
        height: 6px;
        background: #3E2723;
        border-radius: 10px 10px 0 0;
    }
    
    &.excited {
        width: 18px;
        height: 10px;
        background: #D84315;
        border-radius: 0 0 12px 12px;
    }
    
    &.surprised {
        width: 10px;
        height: 10px;
        background: #3E2723;
        border-radius: 50%;
    }
    
    &.confused {
        width: 12px;
        height: 3px;
        transform: rotate(-10deg);
        border-radius: 3px;
    }
}

.emotion-name {
    font-size: 13px;
    font-weight: 600;
    color: #5D4037;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #5D4037;
}

.label-icon {
    font-size: 18px;
}

.stardew-input {
    :deep(.el-textarea__inner) {
        background: #FFF8E1;
        border: 3px solid #8D6E63 !important;
        border-radius: 12px;
        font-family: inherit;
        font-size: 14px;
        padding: 12px 15px;
        resize: none;
        
        &:focus {
            border-color: #4CAF50 !important;
            background: white;
        }
        
        &::placeholder {
            color: #A1887F;
        }
    }
}

.life-indicators {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.indicator-item {
    .indicator-label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 600;
        color: #5D4037;
    }
}

.indicator-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.option-btn {
    padding: 8px 14px;
    background: #FFF8E1;
    border: 2px solid #8D6E63;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #5D4037;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #FFECB3;
        transform: translateY(-2px);
    }
    
    &.active {
        background: #C8E6C9;
        border-color: #4CAF50;
        color: #2E7D32;
    }
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
}

.stardew-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 30px;
    font-size: 18px;
    font-weight: 700;
    border: 4px solid #5D4037;
    border-radius: 12px;
    box-shadow: 4px 4px 0 #5D4037;
    transition: all 0.15s ease;
    cursor: pointer;
    
    &:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #5D4037;
    }
    
    &:active {
        transform: translate(4px, 4px);
        box-shadow: 0 0 0 #5D4037;
    }
    
    .btn-icon {
        font-size: 22px;
    }
    
    &.primary {
        background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%);
        color: #1B5E20;
    }
    
    &.secondary {
        background: linear-gradient(180deg, #FFB74D 0%, #FF9800 100%);
        color: #E65100;
    }
}

.pixel-border {
    position: absolute;
    left: 0;
    right: 0;
    height: 8px;
    background: repeating-linear-gradient(90deg, 
        #5D4037 0px, #5D4037 8px,
        #8D6E63 8px, #8D6E63 16px);
    z-index: 100;
    
    &.top { top: 0; }
    &.bottom { bottom: 0; }
}

@media (max-width: 768px) {
    .emotion-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .life-indicators {
        grid-template-columns: 1fr;
    }
    
    .diary-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
}
</style>
