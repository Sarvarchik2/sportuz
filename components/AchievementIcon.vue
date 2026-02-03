<template>
  <span class="achievement-icon">
    <!-- Gold Star (World Championship) -->
    <svg v-if="type === 'gold-star'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFA500" stroke-width="1.5"/>
      <path d="M12 6L13.5 9.5L17 10L14.5 12.5L15 16L12 14.5L9 16L9.5 12.5L7 10L10.5 9.5L12 6Z" fill="#FFA500"/>
    </svg>
    
    <!-- Gold Medal -->
    <svg v-else-if="type === 'gold-medal'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#FFA500" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="6" fill="#FFA500"/>
      <path d="M12 6L13.5 9.5L17 10L14.5 12.5L15 16L12 14.5L9 16L9.5 12.5L7 10L10.5 9.5L12 6Z" fill="#FFD700"/>
    </svg>
    
    <!-- Silver Medal -->
    <svg v-else-if="type === 'silver-medal'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#C0C0C0" stroke="#A0A0A0" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="6" fill="#A0A0A0"/>
      <path d="M12 6L13.5 9.5L17 10L14.5 12.5L15 16L12 14.5L9 16L9.5 12.5L7 10L10.5 9.5L12 6Z" fill="#C0C0C0"/>
    </svg>
    
    <!-- Bronze Medal -->
    <svg v-else-if="type === 'bronze-medal'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#CD7F32" stroke="#8B4513" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="6" fill="#8B4513"/>
      <path d="M12 6L13.5 9.5L17 10L14.5 12.5L15 16L12 14.5L9 16L9.5 12.5L7 10L10.5 9.5L12 6Z" fill="#CD7F32"/>
    </svg>
    
    <!-- License/Briefcase -->
    <svg v-else-if="type === 'license'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="#1F51FF" stroke="#00E5FF" stroke-width="1.5"/>
      <rect x="6" y="9" width="12" height="6" rx="1" fill="#00E5FF" opacity="0.3"/>
      <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="#00E5FF" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="2" fill="#00E5FF"/>
    </svg>
    
    <!-- Star (Honorary Title) -->
    <svg v-else-if="type === 'star'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFA500" stroke-width="1.5"/>
    </svg>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  type: 'gold-star' | 'gold-medal' | 'silver-medal' | 'bronze-medal' | 'license' | 'star'
}>()
</script>

