<template>
    <div class="stardew-diary">
        <!-- 农场背景 -->
        <div class="farm-background">
            <div class="sky">
                <div class="sun"></div>
                <div class="cloud cloud-1"></div>
                <div class="cloud cloud-2"></div>
                <div class="cloud cloud-3"></div>
            </div>
            <div class="land">
                <div class="grass"></div>
                <div class="fence"></div>
                <div class="crops">
                    <div class="crop" v-for="i in 6" :key="i"></div>
                </div>
                <div class="barn"></div>
                <div class="tree tree-1"></div>
                <div class="tree tree-2"></div>
            </div>
        </div>
        
        <!-- 装饰元素 -->
        <div class="decorations">
            <div class="floating-heart" v-for="i in 5" :key="i"></div>
            <div class="sparkle" v-for="i in 8" :key="i"></div>
            <div class="butterfly" v-for="i in 3" :key="i"></div>
        </div>
        
        <div class="diary-container">
            <div class="diary-header">
                <div class="header-character">
                    <div class="character-avatar" :class="{ 'waving': true }">
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
                        <div class="char-body">
                            <div class="char-arm left"></div>
                            <div class="char-arm right"></div>
                        </div>
                        <div class="char-legs">
                            <div class="char-leg left"></div>
                            <div class="char-leg right"></div>
                        </div>
                    </div>
                    <div class="floating-animals">
                        <div class="chicken"></div>
                        <div class="dog"></div>
                    </div>
                </div>
                <div class="header-text">
                    <h1>🌾 情绪日记农场</h1>
                    <p>在这片心灵的农场里，记录你的情绪成长</p>
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
                        <p class="card-desc">你今天的心情像哪种天气？</p>
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
                                    <span>暴风雨</span>
                                    <span>多云</span>
                                    <span>晴天</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="diary-card emotion-card">
                    <div class="card-title">
                        <span class="title-icon">🌸</span>
                        <span>情绪花园</span>
                    </div>
                    <div class="card-body">
                        <p class="card-desc">今天你的心灵花园里开了什么花？</p>
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
                                    <div class="emotion-plant" :class="emotion.plantClass"></div>
                                </div>
                                <div class="emotion-name">{{ emotion.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="diary-card detail-card">
                    <div class="card-title">
                        <span class="title-icon">📝</span>
                        <span>农场日记</span>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <div class="form-label">
                                <span class="label-icon">💭</span>
                                情绪触发因素
                            </div>
                            <el-input 
                                v-model="diaryData.emotionTriggers" 
                                placeholder="是什么让你的心灵农场发生了变化呢？" 
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
                                placeholder="在你的心灵农场里，今天发生了什么故事..." 
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
                        <span>重新播种</span>
                    </button>
                    <button class="stardew-btn primary" @click="submitForm">
                        <span class="btn-icon">🌱</span>
                        <span>收获日记</span>
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
    { name: '开心', color: '#FFD54F', eyeClass: 'happy', mouthClass: 'smile', plantClass: 'sunflower' },
    { name: '平静', color: '#81D4FA', eyeClass: 'calm', mouthClass: 'neutral', plantClass: 'waterlily' },
    { name: '焦虑', color: '#FFAB91', eyeClass: 'anxious', mouthClass: 'worried', plantClass: 'cactus' },
    { name: '悲伤', color: '#90CAF9', eyeClass: 'sad', mouthClass: 'frown', plantClass: 'blueflower' },
    { name: '兴奋', color: '#F48FB1', eyeClass: 'excited', mouthClass: 'excited', plantClass: 'rose' },
    { name: '疲惫', color: '#B0BEC5', eyeClass: 'tired', mouthClass: 'neutral', plantClass: 'mushroom' },
    { name: '惊讶', color: '#CE93D8', eyeClass: 'surprised', mouthClass: 'surprised', plantClass: 'sparkleflower' },
    { name: '困惑', color: '#A5D6A7', eyeClass: 'confused', mouthClass: 'confused', plantClass: 'clover' },
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

/* 农场背景 */
.farm-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
}

.sky {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, #87CEEB 0%, #B3E5FC 100%);
}

.sun {
    position: absolute;
    top: 30px;
    right: 100px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, #FFD54F 0%, #FFC107 100%);
    border-radius: 50%;
    box-shadow: 0 0 60px #FFD54F;
    animation: sunPulse 4s ease-in-out infinite;
}

@keyframes sunPulse {
    0%, 100% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.1); opacity: 1; }
}

.cloud {
    position: absolute;
    background: white;
    border-radius: 40px;
    opacity: 0.8;
    
    &::before, &::after {
        content: '';
        position: absolute;
        background: white;
        border-radius: 50%;
    }
}

.cloud-1 {
    top: 50px;
    left: 10%;
    width: 100px;
    height: 40px;
    animation: cloudFloat 15s ease-in-out infinite;
    
    &::before { width: 50px; height: 50px; top: -25px; left: 15px; }
    &::after { width: 30px; height: 30px; top: -12px; left: 50px; }
}

.cloud-2 {
    top: 80px;
    left: 40%;
    width: 120px;
    height: 45px;
    animation: cloudFloat 18s ease-in-out infinite 2s;
    
    &::before { width: 60px; height: 60px; top: -30px; left: 20px; }
    &::after { width: 40px; height: 40px; top: -15px; left: 60px; }
}

.cloud-3 {
    top: 40px;
    left: 70%;
    width: 90px;
    height: 35px;
    animation: cloudFloat 12s ease-in-out infinite 1s;
    
    &::before { width: 45px; height: 45px; top: -20px; left: 10px; }
    &::after { width: 25px; height: 25px; top: -10px; left: 45px; }
}

@keyframes cloudFloat {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(60px); }
}

.land {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(180deg, #C8E6C9 0%, #81C784 100%);
}

.grass {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: #4CAF50;
    border-top: 3px solid #388E3C;
}

.fence {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    height: 40px;
    background: repeating-linear-gradient(90deg, 
        #8D6E63 0px, #8D6E63 10px,
        transparent 10px, transparent 30px);
    border-top: 2px solid #5D4037;
    border-bottom: 2px solid #5D4037;
}

.crops {
    position: absolute;
    bottom: 60px;
    left: 10%;
    right: 10%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 60px;
}

.crop {
    width: 15px;
    height: 30px;
    background: #4CAF50;
    border-radius: 8px 8px 0 0;
    border: 2px solid #2E7D32;
    position: relative;
    
    &::after {
        content: '🌽';
        position: absolute;
        top: -15px;
        left: -8px;
        font-size: 18px;
    }
}

.barn {
    position: absolute;
    bottom: 60px;
    right: 15%;
    width: 80px;
    height: 60px;
    background: #8D6E63;
    border: 3px solid #5D4037;
    border-radius: 8px;
    
    &::before {
        content: '';
        position: absolute;
        top: -15px;
        left: 25px;
        width: 30px;
        height: 15px;
        background: #5D4037;
        border-radius: 4px 4px 0 0;
    }
}

.tree {
    position: absolute;
    bottom: 60px;
    width: 50px;
    height: 80px;
    
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 15px;
        width: 20px;
        height: 30px;
        background: #8D6E63;
        border: 2px solid #5D4037;
    }
    
    &::after {
        content: '🌳';
        position: absolute;
        top: 0;
        left: -8px;
        font-size: 50px;
    }
}

.tree-1 {
    left: 15%;
}

.tree-2 {
    right: 30%;
}

/* 装饰元素 */
.decorations {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 5;
}

.floating-heart {
    position: absolute;
    font-size: 20px;
    color: #F44336;
    animation: floatHeart 3s ease-in-out infinite;
    
    &:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
    &:nth-child(2) { top: 30%; right: 15%; animation-delay: 1s; }
    &:nth-child(3) { top: 60%; left: 20%; animation-delay: 0.5s; }
    &:nth-child(4) { top: 70%; right: 25%; animation-delay: 1.5s; }
    &:nth-child(5) { top: 40%; left: 30%; animation-delay: 0.8s; }
}

@keyframes floatHeart {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
    50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
}

.sparkle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 10px white;
    animation: sparkle 2s ease-in-out infinite;
    
    &:nth-child(1) { top: 15%; left: 20%; animation-delay: 0s; }
    &:nth-child(2) { top: 25%; right: 10%; animation-delay: 0.3s; }
    &:nth-child(3) { top: 45%; left: 15%; animation-delay: 0.6s; }
    &:nth-child(4) { top: 55%; right: 30%; animation-delay: 0.9s; }
    &:nth-child(5) { top: 75%; left: 25%; animation-delay: 1.2s; }
    &:nth-child(6) { top: 85%; right: 20%; animation-delay: 1.5s; }
    &:nth-child(7) { top: 35%; left: 40%; animation-delay: 0.4s; }
    &:nth-child(8) { top: 65%; right: 45%; animation-delay: 1.1s; }
}

@keyframes sparkle {
    0%, 100% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1); opacity: 1; }
}

.butterfly {
    position: absolute;
    font-size: 24px;
    animation: butterflyFly 4s ease-in-out infinite;
    
    &:nth-child(1) { top: 25%; left: 15%; animation-delay: 0s; }
    &:nth-child(2) { top: 45%; right: 20%; animation-delay: 1s; }
    &:nth-child(3) { top: 65%; left: 25%; animation-delay: 0.5s; }
}

@keyframes butterflyFly {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-20px) rotate(10deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-15px) rotate(-10deg); }
}

/* 日记容器 */
.diary-container {
    position: relative;
    z-index: 10;
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px;
}

/* 日记头部 */
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
    position: relative;
}

.header-character {
    position: relative;
    
    .character-avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: npcWave 2s ease-in-out infinite;
    }
    
    .char-head {
        position: relative;
        width: 50px;
        height: 50px;
        background: #FFCC80;
        border-radius: 50% 50% 45% 45%;
        border: 3px solid #5D4037;
        z-index: 2;
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
        
        &::after {
            content: '';
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            margin-top: 2px;
            margin-left: 2px;
        }
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
        position: relative;
        z-index: 1;
    }
    
    .char-arm {
        position: absolute;
        width: 10px;
        height: 20px;
        background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
        border: 2px solid #5D4037;
        border-radius: 6px;
        
        &.left {
            left: -8px;
            top: 10px;
            transform: rotate(-30deg);
        }
        
        &.right {
            right: -8px;
            top: 10px;
            transform: rotate(30deg);
            animation: waveArm 2s ease-in-out infinite;
        }
    }
    
    .char-legs {
        position: relative;
        width: 35px;
        margin-top: -3px;
        
        .char-leg {
            position: absolute;
            width: 10px;
            height: 25px;
            background: #8D6E63;
            border: 2px solid #5D4037;
            border-radius: 6px 6px 3px 3px;
            
            &.left {
                left: 5px;
                top: 0;
            }
            
            &.right {
                right: 5px;
                top: 0;
            }
        }
    }
    
    .floating-animals {
        position: absolute;
        top: -10px;
        right: -40px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        
        .chicken {
            font-size: 24px;
            animation: chickenWalk 2s ease-in-out infinite;
        }
        
        .dog {
            font-size: 28px;
            animation: dogWag 2s ease-in-out infinite;
        }
    }
}

@keyframes npcWave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(10deg); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(-10deg); }
}

@keyframes waveArm {
    0%, 100% { transform: rotate(30deg); }
    50% { transform: rotate(60deg); }
}

@keyframes chickenWalk {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(5px) rotate(5deg); }
    75% { transform: translateX(-5px) rotate(-5deg); }
}

@keyframes dogWag {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(10deg); }
    75% { transform: rotate(-10deg); }
}

.header-text {
    h1 {
        margin: 0;
        font-size: 32px;
        color: white;
        text-shadow: 2px 2px 0 #2E7D32;
        font-family: 'Comic Sans MS', cursive, sans-serif;
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

/* 日记内容 */
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
    position: relative;
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
    font-family: 'Comic Sans MS', cursive, sans-serif;
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
    font-family: 'Comic Sans MS', cursive, sans-serif;
}

/* 情绪评分 */
.mood-rating {
    .mood-faces {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    
    .mood-face {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        background: #FFF8E1;
        border: 3px solid #8D6E63;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
        
        &:hover {
            transform: scale(1.15);
            background: #FFECB3;
            box-shadow: 4px 4px 0 rgba(0,0,0,0.15);
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
            height: 25px;
            background: #E0E0E0;
            border: 3px solid #5D4037;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: inset 2px 2px 0 rgba(0,0,0,0.1);
        }
        
        .rating-fill {
            height: 100%;
            background: linear-gradient(90deg, #E57373 0%, #FFD54F 50%, #81C784 100%);
            transition: width 0.3s ease;
        }
        
        .rating-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 13px;
            color: #8D6E63;
            font-weight: 600;
        }
    }
}

/* 情绪花园 */
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
    box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
    position: relative;
    
    &:hover {
        transform: translateY(-3px);
        background: #FFECB3;
        box-shadow: 4px 4px 0 rgba(0,0,0,0.15);
    }
    
    &.selected {
        border-color: #4CAF50;
        background: #C8E6C9;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        
        .emo-head {
            animation: bounce 0.5s ease-in-out infinite;
        }
        
        .emotion-plant {
            animation: grow 1s ease-in-out infinite;
        }
    }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

@keyframes grow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.emotion-avatar {
    margin-bottom: 10px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.emo-head {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #5D4037;
    position: relative;
    z-index: 2;
}

.emotion-plant {
    position: absolute;
    bottom: -10px;
    right: -10px;
    font-size: 20px;
    z-index: 1;
    
    &.sunflower { content: '🌻'; }
    &.waterlily { content: '🌸'; }
    &.cactus { content: '🌵'; }
    &.blueflower { content: '💙'; }
    &.rose { content: '🌹'; }
    &.mushroom { content: '🍄'; }
    &.sparkleflower { content: '✨'; }
    &.clover { content: '🍀'; }
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
    font-family: 'Comic Sans MS', cursive, sans-serif;
}

/* 表单组 */
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
    font-family: 'Comic Sans MS', cursive, sans-serif;
}

.label-icon {
    font-size: 18px;
}

.stardew-input {
    :deep(.el-textarea__inner) {
        background: #FFF8E1;
        border: 3px solid #8D6E63 !important;
        border-radius: 12px;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        font-size: 14px;
        padding: 12px 15px;
        resize: none;
        box-shadow: inset 2px 2px 0 rgba(0,0,0,0.1);
        
        &:focus {
            border-color: #4CAF50 !important;
            background: white;
        }
        
        &::placeholder {
            color: #A1887F;
        }
    }
}

/* 生活指标 */
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
        font-family: 'Comic Sans MS', cursive, sans-serif;
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
    box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
    font-family: 'Comic Sans MS', cursive, sans-serif;
    
    &:hover {
        background: #FFECB3;
        transform: translateY(-2px);
        box-shadow: 3px 3px 0 rgba(0,0,0,0.15);
    }
    
    &.active {
        background: #C8E6C9;
        border-color: #4CAF50;
        color: #2E7D32;
    }
}

/* 操作按钮 */
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
    font-family: 'Comic Sans MS', cursive, sans-serif;
    
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

/* 像素边框 */
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

/* 响应式设计 */
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
    
    .header-character {
        .floating-animals {
            position: relative;
            top: 10px;
            right: 0;
            flex-direction: row;
            justify-content: center;
        }
    }
}
</style>
