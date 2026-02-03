<template>
  <div class="popup-athlete-item">
    <div class="athlete-image-wrapper">
      <img :src="image" :alt="name" loading="lazy" />
      <div class="medal-badge">
        <span class="medal-label">{{ medalLabel }}</span>
        <span class="sport-type">{{ sportType }}</span>
      </div>
    </div>
    <div class="athlete-content">
      <h3>{{ title }}</h3>
      <h4>{{ name }}</h4>
      <p class="athlete-description">{{ description }}</p>
      <div class="achievements">
        <div v-for="(achievement, index) in achievements" :key="index" class="achievement-item">
          <AchievementIcon :type="achievement.type" />
          <span>{{ achievement.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Achievement {
  type: 'gold-star' | 'gold-medal' | 'silver-medal' | 'bronze-medal' | 'license' | 'star'
  text: string
}

defineProps<{
  image: string
  medalLabel: string
  sportType: string
  title: string
  name: string
  description: string
  achievements: Achievement[]
}>()
</script>

