<script setup>
import { ref, getCurrentInstance } from 'vue'
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;
const data = ref([
    'xd',
    'xdd',
    'xddd'
])

socket.on('deez_nuts', () => {
  console.log('xd')
})
</script>

<template>
  <div class="menu">
    <div>Players {{ data.length }}/8</div>
    <div v-for="name in data" :key="name">{{ name }}</div>
    <RouterLink to="/game">
      <button :disabled="data.length<3" class="main-btn-full">Start Game</button>
    </RouterLink>
  </div>
</template>