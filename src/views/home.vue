<template>
    <div class="stardew-home-v2">
        <!-- 像素风格背景 -->
        <div class="pixel-background">
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
                    <div class="crop" v-for="i in 12" :key="i" :style="{ '--delay': `${i * 0.1}s` }"></div>
                </div>
                <div class="barn"></div>
                <div class="tree tree-1"></div>
                <div class="tree tree-2"></div>
            </div>
        </div>
        
        <!-- 主内容 -->
        <div class="main-content">
            <!-- 游戏标题 -->
            <div class="game-title" :class="{ 'show': showTitle }">
                <h1 class="title-text">心灵牧场</h1>
                <p class="subtitle-text">Mental Health Farm</p>
                <div class="title-decoration">
                    <span>🌾</span>
                    <span>🌸</span>
                    <span>🐔</span>
                </div>
            </div>
            
            <!-- 角色动画 -->
            <div class="character-section" :class="{ 'show': showCharacter }">
                <div class="player-character" :class="{ 'walking': isWalking, 'waving': isWaving }">
                    <div class="character-sprite">
                        <div class="character-head">
                            <div class="character-hair"></div>
                            <div class="character-face">
                                <div class="character-eyes"></div>
                                <div class="character-mouth"></div>
                            </div>
                        </div>
                        <div class="character-body">
                            <div class="character-torso"></div>
                            <div class="character-arms">
                                <div class="arm left" :class="{ 'swing': isWaving }"></div>
                                <div class="arm right"></div>
                            </div>
                            <div class="character-legs">
                                <div class="leg left" :class="{ 'step': isWalking }"></div>
                                <div class="leg right" :class="{ 'step': isWalking, 'step-right': isWalking }"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="animal-friends" :class="{ 'show': showAnimals }">
                    <div class="chicken" :class="{ 'walking': showAnimals }">
                        <div class="chicken-sprite">
                            <div class="chicken-head"></div>
                            <div class="chicken-body"></div>
                            <div class="chicken-legs">
                                <div class="chicken-leg left"></div>
                                <div class="chicken-leg right"></div>
                            </div>
                        </div>
                    </div>
                    <div class="dog" :class="{ 'show': showAnimals }">
                        <div class="dog-sprite">
                            <div class="dog-head"></div>
                            <div class="dog-body"></div>
                            <div class="dog-tail" :class="{ 'wagging': showAnimals }"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 欢迎信息 -->
            <div class="welcome-message" :class="{ 'show': showMessage }">
                <div class="speech-bubble">
                    <div class="bubble-content">
                        <p>欢迎来到心灵牧场！</p>
                        <p>我是小暖，你的心理助手。</p>
                        <p>在这里，我们一起照顾心灵，收获快乐！</p>
                    </div>
                    <div class="bubble-tail"></div>
                </div>
            </div>
            
            <!-- 功能按钮 -->
            <div class="action-buttons" :class="{ 'show': showButtons }">
                <router-link to="/consultation" class="stardew-button primary">
                    <span class="button-icon">💬</span>
                    <span class="button-text">开始对话</span>
                    <span class="button-decoration">🌼</span>
                </router-link>
                <router-link to="/emotion-diary" class="stardew-button secondary">
                    <span class="button-icon">📔</span>
                    <span class="button-text">情绪日记</span>
                    <span class="button-decoration">🌻</span>
                </router-link>
                <router-link to="/knowledge" class="stardew-button tertiary">
                    <span class="button-icon">📚</span>
                    <span class="button-text">知识农场</span>
                    <span class="button-decoration">🌱</span>
                </router-link>
            </div>
            
            <!-- 装饰元素 -->
            <div class="decorations">
                <div class="floating-heart" v-for="i in 6" :key="i" :style="{ '--delay': `${i * 0.5}s` }"></div>
                <div class="sparkle" v-for="i in 8" :key="i + 10" :style="{ '--delay': `${i * 0.3}s` }"></div>
            </div>
        </div>
        
        <!-- 像素边框 -->
        <div class="pixel-borders">
            <div class="border top"></div>
            <div class="border bottom"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showTitle = ref(false)
const showCharacter = ref(false)
const showAnimals = ref(false)
const showMessage = ref(false)
const showButtons = ref(false)
const isWalking = ref(false)
const isWaving = ref(false)

onMounted(() => {
    // 动画序列
    setTimeout(() => {
        showTitle.value = true
    }, 500)
    
    setTimeout(() => {
        showCharacter.value = true
        isWalking.value = true
    }, 1500)
    
    setTimeout(() => {
        isWalking.value = false
        isWaving.value = true
        showAnimals.value = true
    }, 3500)
    
    setTimeout(() => {
        showMessage.value = true
    }, 4000)
    
    setTimeout(() => {
        showButtons.value = true
    }, 4500)
})
</script>

<style lang="scss" scoped>
.stardew-home-v2 {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
}

.pixel-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}

.sky {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(180deg, #87CEEB 0%, #B3E5FC 100%);
}

.sun {
    position: absolute;
    top: 40px;
    right: 100px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, #FFD54F 0%, #FFC107 100%);
    border-radius: 50%;
    box-shadow: 0 0 60px #FFD54F;
    animation: sunPulse 4s ease-in-out infinite;
}

@keyframes sunPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.cloud {
    position: absolute;
    background: white;
    border-radius: 50px;
    opacity: 0.9;
    
    &::before, &::after {
        content: '';
        position: absolute;
        background: white;
        border-radius: 50%;
    }
}

.cloud-1 {
    top: 60px;
    left: 10%;
    width: 100px;
    height: 40px;
    animation: cloudFloat 12s ease-in-out infinite;
    
    &::before { width: 50px; height: 50px; top: -25px; left: 15px; }
    &::after { width: 35px; height: 35px; top: -15px; left: 50px; }
}

.cloud-2 {
    top: 100px;
    left: 40%;
    width: 120px;
    height: 45px;
    animation: cloudFloat 15s ease-in-out infinite 2s;
    
    &::before { width: 60px; height: 60px; top: -30px; left: 20px; }
    &::after { width: 40px; height: 40px; top: -20px; left: 60px; }
}

.cloud-3 {
    top: 80px;
    right: 20%;
    width: 90px;
    height: 35px;
    animation: cloudFloat 10s ease-in-out infinite 1s;
    
    &::before { width: 45px; height: 45px; top: -22px; left: 12px; }
    &::after { width: 30px; height: 30px; top: -12px; left: 45px; }
}

@keyframes cloudFloat {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(40px); }
}

.land {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, #8BC34A 0%, #689F38 100%);
}

.grass {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: #7CB342;
    background-image: repeating-linear-gradient(90deg, 
        transparent 0px, transparent 15px, 
        #689F38 15px, #689F38 17px);
}

.fence {
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    height: 15px;
    background: repeating-linear-gradient(90deg, 
        #8D6E63 0px, #8D6E63 20px, 
        transparent 20px, transparent 30px);
    border-top: 2px solid #5D4037;
    border-bottom: 2px solid #5D4037;
}

.crops {
    position: absolute;
    bottom: 50px;
    left: 10%;
    right: 10%;
    display: flex;
    justify-content: space-around;
}

.crop {
    width: 20px;
    height: 30px;
    background: #4CAF50;
    border-radius: 10px 10px 0 0;
    animation: cropGrow 3s ease-in-out infinite;
    animation-delay: var(--delay);
    
    &::before {
        content: '🌱';
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
    }
}

@keyframes cropGrow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.barn {
    position: absolute;
    bottom: 40px;
    right: 10%;
    width: 80px;
    height: 60px;
    background: #A1887F;
    border: 3px solid #5D4037;
    border-radius: 5px;
    
    &::before {
        content: '';
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 20px;
        background: #D7CCC8;
        border: 3px solid #5D4037;
        border-bottom: none;
        border-radius: 5px 5px 0 0;
    }
    
    &::after {
        content: '🚪';
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 20px;
    }
}

.tree {
    position: absolute;
    bottom: 40px;
    
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        width: 20px;
        height: 40px;
        background: #8D6E63;
        border: 2px solid #5D4037;
        border-radius: 3px;
    }
    
    &::after {
        content: '🌳';
        position: absolute;
        top: -40px;
        font-size: 40px;
    }
}

.tree-1 {
    left: 20%;
}

.tree-2 {
    left: 35%;
}

.main-content {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.game-title {
    text-align: center;
    margin-bottom: 60px;
    opacity: 0;
    transform: translateY(-30px);
    transition: all 1s ease-out;
    
    &.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .title-text {
        font-size: 64px;
        font-weight: 800;
        color: #5D4037;
        text-shadow: 
            4px 4px 0 #FFD54F,
            -2px -2px 0 #5D4037,
            2px -2px 0 #5D4037,
            -2px 2px 0 #5D4037;
        margin-bottom: 10px;
        letter-spacing: 2px;
    }
    
    .subtitle-text {
        font-size: 24px;
        color: #6D4C41;
        margin-bottom: 20px;
    }
    
    .title-decoration {
        display: flex;
        justify-content: center;
        gap: 20px;
        font-size: 28px;
        animation: sway 3s ease-in-out infinite;
    }
}

@keyframes sway {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(10px); }
}

.character-section {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 40px;
    opacity: 0;
    transform: translateX(-50px);
    transition: all 1s ease-out;
    
    &.show {
        opacity: 1;
        transform: translateX(0);
    }
}

.player-character {
    position: relative;
    
    &.walking {
        animation: walk 1s ease-in-out infinite;
    }
    
    &.waving {
        animation: wave 2s ease-in-out infinite;
    }
}

@keyframes walk {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(20px); }
}

@keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.character-sprite {
    width: 80px;
    height: 120px;
    position: relative;
}

.character-head {
    position: absolute;
    top: 0;
    left: 15px;
    width: 50px;
    height: 50px;
    background: #FFCC80;
    border: 3px solid #5D4037;
    border-radius: 50% 50% 45% 45%;
    z-index: 2;
}

.character-hair {
    position: absolute;
    top: -8px;
    left: 5px;
    width: 40px;
    height: 25px;
    background: #8D6E63;
    border: 2px solid #5D4037;
    border-radius: 50% 50% 30% 30%;
}

.character-face {
    position: absolute;
    top: 20px;
    left: 8px;
    width: 34px;
}

.character-eyes {
    display: flex;
    justify-content: space-between;
    padding: 0 4px;
    margin-bottom: 4px;
    
    &::before, &::after {
        content: '';
        width: 6px;
        height: 8px;
        background: #3E2723;
        border-radius: 50%;
        position: relative;
        
        &::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
        }
    }
}

.character-mouth {
    width: 12px;
    height: 6px;
    background: #D84315;
    border-radius: 0 0 8px 8px;
    margin: 0 auto;
}

.character-body {
    position: absolute;
    top: 45px;
    left: 20px;
    width: 40px;
    height: 60px;
}

.character-torso {
    width: 40px;
    height: 40px;
    background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
    border: 3px solid #5D4037;
    border-radius: 8px 8px 4px 4px;
}

.character-arms {
    position: absolute;
    top: 50px;
    left: -10px;
    width: 60px;
    display: flex;
    justify-content: space-between;
}

.arm {
    width: 15px;
    height: 30px;
    background: #FFCC80;
    border: 2px solid #5D4037;
    border-radius: 8px;
    transform-origin: top center;
    
    &.left {
        transform: rotate(-30deg);
        
        &.swing {
            animation: swing 1s ease-in-out infinite;
        }
    }
    
    &.right {
        transform: rotate(30deg);
    }
}

@keyframes swing {
    0%, 100% { transform: rotate(-30deg); }
    50% { transform: rotate(30deg); }
}

.character-legs {
    position: absolute;
    top: 75px;
    left: 5px;
    width: 30px;
    display: flex;
    justify-content: space-between;
}

.leg {
    width: 12px;
    height: 30px;
    background: #5D4037;
    border: 2px solid #3E2723;
    border-radius: 4px 4px 6px 6px;
    transform-origin: top center;
    
    &.step {
        animation: step 1s ease-in-out infinite;
    }
    
    &.step-right {
        animation-delay: 0.5s;
    }
}

@keyframes step {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(30deg); }
}

.animal-friends {
    display: flex;
    flex-direction: column;
    gap: 20px;
    opacity: 0;
    transform: translateX(50px);
    transition: all 1s ease-out;
    
    &.show {
        opacity: 1;
        transform: translateX(0);
    }
}

.chicken {
    position: relative;
    
    &.walking {
        animation: chickenWalk 1.5s ease-in-out infinite;
    }
}

@keyframes chickenWalk {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(10px); }
}

.chicken-sprite {
    width: 40px;
    height: 30px;
    position: relative;
}

.chicken-head {
    position: absolute;
    top: -5px;
    left: -10px;
    width: 15px;
    height: 15px;
    background: #FFCC80;
    border: 2px solid #5D4037;
    border-radius: 50%;
    
    &::before {
        content: '';
        position: absolute;
        top: -3px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 3px;
        background: #F44336;
        border-radius: 3px 3px 0 0;
    }
}

.chicken-body {
    position: absolute;
    top: 5px;
    left: 0;
    width: 40px;
    height: 20px;
    background: #FFEB3B;
    border: 2px solid #5D4037;
    border-radius: 10px;
}

.chicken-legs {
    position: absolute;
    bottom: -10px;
    left: 10px;
    width: 20px;
    display: flex;
    justify-content: space-between;
}

.chicken-leg {
    width: 3px;
    height: 10px;
    background: #FFCC80;
    border: 1px solid #5D4037;
    border-radius: 2px;
    
    &.left {
        animation: chickenStep 1.5s ease-in-out infinite;
    }
    
    &.right {
        animation: chickenStep 1.5s ease-in-out infinite 0.75s;
    }
}

@keyframes chickenStep {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(45deg); }
}

.dog {
    position: relative;
    opacity: 0;
    transform: translateY(20px);
    transition: all 1s ease-out 0.5s;
    
    &.show {
        opacity: 1;
        transform: translateY(0);
    }
}

.dog-sprite {
    width: 50px;
    height: 30px;
    position: relative;
}

.dog-head {
    position: absolute;
    top: 0;
    left: -5px;
    width: 20px;
    height: 20px;
    background: #8D6E63;
    border: 2px solid #5D4037;
    border-radius: 50%;
}

.dog-body {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 35px;
    height: 15px;
    background: #8D6E63;
    border: 2px solid #5D4037;
    border-radius: 8px;
}

.dog-tail {
    position: absolute;
    top: 12px;
    right: -5px;
    width: 10px;
    height: 3px;
    background: #8D6E63;
    border: 1px solid #5D4037;
    border-radius: 2px;
    transform-origin: left center;
    
    &.wagging {
        animation: wag 0.5s ease-in-out infinite;
    }
}

@keyframes wag {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(45deg); }
}

.welcome-message {
    margin-bottom: 40px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 1s ease-out;
    
    &.show {
        opacity: 1;
        transform: translateY(0);
    }
}

.speech-bubble {
    position: relative;
    background: white;
    border: 3px solid #5D4037;
    border-radius: 20px;
    padding: 20px 25px;
    max-width: 300px;
    box-shadow: 4px 4px 0 #5D4037;
    text-align: center;
    
    .bubble-content {
        font-size: 16px;
        line-height: 1.6;
        color: #5D4037;
        font-weight: 500;
        
        p {
            margin: 5px 0;
        }
    }
    
    .bubble-tail {
        position: absolute;
        bottom: -15px;
        left: 30px;
        width: 20px;
        height: 20px;
        background: white;
        border: 3px solid #5D4037;
        border-top: none;
        border-right: none;
        transform: rotate(45deg);
    }
}

.action-buttons {
    display: flex;
    gap: 20px;
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s ease-out;
    
    &.show {
        opacity: 1;
        transform: translateY(0);
    }
}

.stardew-button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 25px;
    text-decoration: none;
    border: 4px solid #5D4037;
    border-radius: 12px;
    font-weight: 700;
    font-size: 16px;
    transition: all 0.2s ease;
    box-shadow: 4px 4px 0 #5D4037;
    
    &:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #5D4037;
    }
    
    &:active {
        transform: translate(4px, 4px);
        box-shadow: 0 0 0 #5D4037;
    }
    
    .button-icon {
        font-size: 20px;
    }
    
    .button-decoration {
        font-size: 18px;
    }
    
    &.primary {
        background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%);
        color: #1B5E20;
    }
    
    &.secondary {
        background: linear-gradient(180deg, #FFB74D 0%, #FF9800 100%);
        color: #E65100;
    }
    
    &.tertiary {
        background: linear-gradient(180deg, #90CAF9 0%, #2196F3 100%);
        color: #1565C0;
    }
}

.decorations {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
}

.floating-heart {
    position: absolute;
    font-size: 24px;
    animation: floatHeart 3s ease-in-out infinite;
    animation-delay: var(--delay);
    
    &:nth-child(1) { top: 20%; left: 10%; }
    &:nth-child(2) { top: 30%; right: 15%; }
    &:nth-child(3) { top: 60%; left: 20%; }
    &:nth-child(4) { top: 70%; right: 25%; }
    &:nth-child(5) { top: 40%; left: 30%; }
    &:nth-child(6) { top: 50%; right: 35%; }
}

@keyframes floatHeart {
    0% {
        transform: translateY(0) scale(0);
        opacity: 0;
    }
    50% {
        transform: translateY(-30px) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-60px) scale(0);
        opacity: 0;
    }
}

.sparkle {
    position: absolute;
    font-size: 16px;
    animation: sparkle 2s ease-in-out infinite;
    animation-delay: var(--delay);
    
    &:nth-child(7) { top: 15%; left: 15%; }
    &:nth-child(8) { top: 25%; right: 20%; }
    &:nth-child(9) { top: 55%; left: 25%; }
    &:nth-child(10) { top: 65%; right: 30%; }
    &:nth-child(11) { top: 35%; left: 35%; }
    &:nth-child(12) { top: 45%; right: 40%; }
    &:nth-child(13) { top: 75%; left: 45%; }
    &:nth-child(14) { top: 85%; right: 50%; }
}

@keyframes sparkle {
    0%, 100% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1); opacity: 1; }
}

.pixel-borders {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 100;
}

.border {
    position: fixed;
    left: 0;
    right: 0;
    height: 10px;
    background: repeating-linear-gradient(90deg, 
        #5D4037 0px, #5D4037 10px,
        #8D6E63 10px, #8D6E63 20px);
    
    &.top { top: 0; }
    &.bottom { bottom: 0; }
}

@media (max-width: 768px) {
    .game-title .title-text {
        font-size: 48px;
    }
    
    .character-section {
        flex-direction: column;
        gap: 20px;
    }
    
    .action-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .stardew-button {
        width: 200px;
        justify-content: center;
    }
}
</style>