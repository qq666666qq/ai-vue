<template>
    <div class="stardew-home">
        <div class="sky">
            <div class="sun"></div>
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
        </div>
        
        <div class="ground">
            <div class="grass-pattern"></div>
        </div>
        
        <div class="scene">
            <div class="welcome-text" :class="{ 'show': textVisible }">
                <h1 class="game-title">欢迎来到心灵牧场</h1>
                <p class="subtitle">在这里，每一次对话都是治愈的开始</p>
            </div>
            
            <div class="character-container">
                <div class="character" :class="{ 'running': isRunning, 'hugging': isHugging }">
                    <div class="head">
                        <div class="hair"></div>
                        <div class="face">
                            <div class="eyes">
                                <div class="eye left"></div>
                                <div class="eye right"></div>
                            </div>
                            <div class="mouth" :class="{ 'smile': isHugging }"></div>
                        </div>
                    </div>
                    <div class="body">
                        <div class="torso"></div>
                        <div class="arms">
                            <div class="arm left"></div>
                            <div class="arm right"></div>
                        </div>
                        <div class="legs">
                            <div class="leg left"></div>
                            <div class="leg right"></div>
                        </div>
                    </div>
                </div>
                
                <div class="heart-particles" v-if="isHugging">
                    <div class="heart" v-for="i in 8" :key="i" :style="{ '--delay': `${i * 0.3}s` }">❤️</div>
                </div>
            </div>
            
            <div class="action-buttons" :class="{ 'show': buttonsVisible }">
                <router-link to="/consultation" class="stardew-btn primary">
                    <span class="btn-icon">💬</span>
                    <span>开始倾诉</span>
                </router-link>
                <router-link to="/emotion-diary" class="stardew-btn secondary">
                    <span class="btn-icon">📝</span>
                    <span>记录心情</span>
                </router-link>
            </div>
        </div>
        
        <div class="pixel-border top"></div>
        <div class="pixel-border bottom"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isRunning = ref(false)
const isHugging = ref(false)
const textVisible = ref(false)
const buttonsVisible = ref(false)

onMounted(() => {
    setTimeout(() => {
        textVisible.value = true
    }, 500)
    
    setTimeout(() => {
        isRunning.value = true
    }, 1500)
    
    setTimeout(() => {
        isRunning.value = false
        isHugging.value = true
    }, 3500)
    
    setTimeout(() => {
        buttonsVisible.value = true
    }, 4200)
})
</script>

<style lang="scss" scoped>
.stardew-home {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 70px);
    overflow: hidden;
    background: linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #7CB342 100%);
}

.sky {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(180deg, #4FC3F7 0%, #81D4FA 50%, #B3E5FC 100%);
}

.sun {
    position: absolute;
    top: 40px;
    right: 80px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, #FFD54F 0%, #FFC107 50%, #FF9800 100%);
    border-radius: 50%;
    box-shadow: 0 0 60px #FFD54F, 0 0 100px #FFC107;
    animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.cloud {
    position: absolute;
    background: white;
    border-radius: 50px;
    opacity: 0.9;
}

.cloud::before,
.cloud::after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 50%;
}

.cloud-1 {
    top: 60px;
    left: 10%;
    width: 100px;
    height: 40px;
    animation: float 8s ease-in-out infinite;
    
    &::before {
        width: 50px;
        height: 50px;
        top: -25px;
        left: 15px;
    }
    
    &::after {
        width: 35px;
        height: 35px;
        top: -15px;
        left: 50px;
    }
}

.cloud-2 {
    top: 100px;
    left: 40%;
    width: 120px;
    height: 45px;
    animation: float 10s ease-in-out infinite 1s;
    
    &::before {
        width: 60px;
        height: 60px;
        top: -30px;
        left: 20px;
    }
    
    &::after {
        width: 40px;
        height: 40px;
        top: -20px;
        left: 60px;
    }
}

.cloud-3 {
    top: 80px;
    right: 20%;
    width: 90px;
    height: 35px;
    animation: float 9s ease-in-out infinite 0.5s;
    
    &::before {
        width: 45px;
        height: 45px;
        top: -22px;
        left: 12px;
    }
    
    &::after {
        width: 30px;
        height: 30px;
        top: -12px;
        left: 45px;
    }
}

@keyframes float {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(30px); }
}

.ground {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 45%;
    background: linear-gradient(180deg, #8BC34A 0%, #689F38 50%, #558B2F 100%);
}

.grass-pattern {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
        repeating-linear-gradient(90deg, 
            transparent 0px, transparent 20px, 
            #7CB342 20px, #7CB342 22px),
        repeating-linear-gradient(90deg, 
            transparent 0px, transparent 35px, 
            #689F38 35px, #689F38 38px);
    background-position: 0 100%, 10px 100%;
}

.scene {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 70px);
    padding: 40px 20px;
}

.welcome-text {
    text-align: center;
    margin-bottom: 40px;
    opacity: 0;
    transform: translateY(-30px);
    transition: all 1s ease-out;
    
    &.show {
        opacity: 1;
        transform: translateY(0);
    }
}

.game-title {
    font-size: 56px;
    font-weight: 800;
    color: #5D4037;
    text-shadow: 
        3px 3px 0 #FFD54F,
        -1px -1px 0 #5D4037,
        1px -1px 0 #5D4037,
        -1px 1px 0 #5D4037;
    margin-bottom: 15px;
    letter-spacing: 2px;
}

.subtitle {
    font-size: 24px;
    color: #4E342E;
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.character-container {
    position: relative;
    height: 280px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.character {
    position: relative;
    transform: translateX(-200px);
    transition: transform 2s ease-in-out;
}

.character.running {
    transform: translateX(0);
    animation: bounce 0.3s ease-in-out infinite;
}

.character.hugging {
    animation: happyBounce 0.5s ease-in-out infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(0) translateY(-10px); }
}

@keyframes happyBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-15px) scale(1.05); }
}

.head {
    position: relative;
    width: 80px;
    height: 80px;
    background: #FFCC80;
    border-radius: 50% 50% 45% 45%;
    border: 4px solid #5D4037;
    margin: 0 auto;
    z-index: 2;
}

.hair {
    position: absolute;
    top: -15px;
    left: 5px;
    width: 70px;
    height: 45px;
    background: #8D6E63;
    border-radius: 50% 50% 30% 30%;
    border: 3px solid #5D4037;
}

.face {
    position: absolute;
    top: 30px;
    left: 10px;
    width: 60px;
    height: 40px;
}

.eyes {
    display: flex;
    justify-content: space-between;
    padding: 0 8px;
    margin-bottom: 8px;
}

.eye {
    width: 12px;
    height: 14px;
    background: #3E2723;
    border-radius: 50%;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 3px;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
    }
}

.mouth {
    width: 20px;
    height: 8px;
    background: #D84315;
    border-radius: 0 0 10px 10px;
    margin: 0 auto;
    transition: all 0.3s ease;
    
    &.smile {
        width: 30px;
        height: 15px;
        border-radius: 0 0 20px 20px;
    }
}

.body {
    position: relative;
    margin-top: -5px;
}

.torso {
    width: 60px;
    height: 70px;
    background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
    border: 4px solid #5D4037;
    border-radius: 10px 10px 5px 5px;
    margin: 0 auto;
}

.arms {
    position: absolute;
    top: 5px;
    left: -25px;
    width: 110px;
    display: flex;
    justify-content: space-between;
}

.arm {
    width: 20px;
    height: 50px;
    background: #FFCC80;
    border: 3px solid #5D4037;
    border-radius: 10px;
    transform-origin: top center;
    transition: transform 0.5s ease;
    
    &.left {
        transform: rotate(-20deg);
    }
    
    &.right {
        transform: rotate(20deg);
    }
}

.character.hugging .arm.left {
    transform: rotate(-80deg) translateY(-10px);
}

.character.hugging .arm.right {
    transform: rotate(80deg) translateY(-10px);
}

.legs {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: -5px;
}

.leg {
    width: 22px;
    height: 45px;
    background: #5D4037;
    border: 3px solid #3E2723;
    border-radius: 5px 5px 8px 8px;
    transform-origin: top center;
}

.character.running .leg.left {
    animation: legLeft 0.3s ease-in-out infinite;
}

.character.running .leg.right {
    animation: legRight 0.3s ease-in-out infinite;
}

@keyframes legLeft {
    0%, 100% { transform: rotate(-20deg); }
    50% { transform: rotate(20deg); }
}

@keyframes legRight {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(-20deg); }
}

.heart-particles {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.heart {
    position: absolute;
    font-size: 24px;
    animation: floatUp 2s ease-out infinite;
    animation-delay: var(--delay);
    opacity: 0;
}

@keyframes floatUp {
    0% {
        opacity: 1;
        transform: translateY(0) scale(0);
    }
    50% {
        opacity: 1;
        transform: translateY(-50px) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) scale(0.5);
    }
}

.action-buttons {
    display: flex;
    gap: 30px;
    margin-top: 50px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease-out;
    
    &.show {
        opacity: 1;
        transform: translateY(0);
    }
}

.stardew-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 35px;
    font-size: 20px;
    font-weight: 700;
    text-decoration: none;
    border: 4px solid #5D4037;
    border-radius: 8px;
    box-shadow: 
        4px 4px 0 #5D4037,
        inset 0 -4px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.15s ease;
    cursor: pointer;
    
    &:hover {
        transform: translate(2px, 2px);
        box-shadow: 
            2px 2px 0 #5D4037,
            inset 0 -4px 0 rgba(0, 0, 0, 0.1);
    }
    
    &:active {
        transform: translate(4px, 4px);
        box-shadow: 
            0 0 0 #5D4037,
            inset 0 -2px 0 rgba(0, 0, 0, 0.1);
    }
    
    .btn-icon {
        font-size: 28px;
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
    
    &.top {
        top: 0;
    }
    
    &.bottom {
        bottom: 0;
    }
}
</style>
