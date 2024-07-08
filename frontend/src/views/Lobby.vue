<script setup>
import { ref, getCurrentInstance } from 'vue'
const props = defineProps({
  roomCode: String
})
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;
const data = ref(null);


socket.on('deez_nuts', (players) => {
  console.log('xd')
  data.value = players;
  console.log(data.value)
})

</script>

<template>
  <div class="menu">
    <div>{{ props.roomCode }}</div>
    <div v-if="data">Players {{ data.length }}/8</div>
    <div v-for="name in data" :key="name">{{ name }}</div>
    <RouterLink to="/game">
      <button v-if="data" :disabled="data.length<3" class="main-btn-full">Start Game</button>
    </RouterLink>
  </div>
</template>