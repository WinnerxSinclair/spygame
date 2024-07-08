<script setup>
import { ref, getCurrentInstance } from 'vue'
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;
const data = ref(null)

socket.on('deez_nuts', (players) => {
  console.log('xd')
  data.value = players;
  console.log(data.value)
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