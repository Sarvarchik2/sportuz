<template>
  <div class="custom-select" :class="{ disabled, 'is-open': isOpen }" ref="selectRef">
    <div class="select-trigger" @click="toggleMenu">
      <span class="truncate">{{ displayValue }}</span>
      <span class="select-caret" aria-hidden="true" :class="{ open: isOpen }">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    
    <div class="select-dropdown" v-if="isOpen">
      <div 
        class="select-option" 
        :class="{ selected: modelValue === '__ALL__' }"
        @click="selectOption('__ALL__')"
      >
        <span class="check-icon" v-if="modelValue === '__ALL__'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="placeholder-icon" v-else></span>
        Barchasi
      </div>
      <div 
        class="select-option" 
        v-for="option in options" 
        :key="option"
        :class="{ selected: modelValue === option }"
        @click="selectOption(option)"
      >
        <span class="check-icon" v-if="modelValue === option">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="placeholder-icon" v-else></span>
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string | null | undefined
  options: string[]
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const displayValue = computed(() => {
  if (!props.modelValue || props.modelValue === '__ALL__') return 'Barchasi'
  return props.modelValue
})

function toggleMenu() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function selectOption(value: string) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  min-width: 0;
}

.custom-select.is-open {
  z-index: 50;
}

.custom-select.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.select-trigger {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  color: var(--text, #fff);
  padding: 10px 34px 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  font-size: 14px;
  box-sizing: border-box;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  flex: 1;
  min-width: 0;
  text-align: left;
}

.select-caret {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #bfe9ff;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
}

.select-caret.open {
  transform: translateY(-50%) rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 280px;
  overflow-y: auto;
  background: rgba(30, 30, 32, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 4px;
}

.select-dropdown::-webkit-scrollbar {
  width: 6px;
}
.select-dropdown::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.select-dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.select-option {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 2px;
  transition: background 0.1s ease;
  word-break: break-word;
}

.select-option:last-child {
  margin-bottom: 0;
}

.select-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.select-option.selected {
  background: #0a84ff;
  color: #fff;
}

.check-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
}

.placeholder-icon {
  width: 16px;
  display: inline-block;
  margin-right: 8px;
  flex-shrink: 0;
}
</style>
