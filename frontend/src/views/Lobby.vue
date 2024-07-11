<script setup>
import { ref, getCurrentInstance } from 'vue'
import router from '../router'
const props = defineProps({
  roomCode: String,
  userName: String,
})
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;
const data = ref(null);


socket.on('deez_nuts', (players) => {
  console.log('xd')
  data.value = players;
  console.log(data.value)
})

socket.on('update_players', (players) => {
  data.value = players;
  console.log(data.value)
})

socket.on('route_game', () => {
  router.push({ path: `/game/${props.roomCode}`, query: { name: props?.userName } });
})

function startGame(){
  socket.emit('start_game', props.roomCode);
}
</script>

<template>
  <div class="menu flex column align-c gap">
    <div class="fs-600 ff-1 margin-bot">{{ props.roomCode }}</div>
    <div v-if="data">Players {{ data.length }}/8</div>
    <div v-for="name in data" :key="name">{{ name }}</div>
    
    <button v-if="data"  class="main-btn-full" @click="startGame">Start Game</button>
    
  </div>
</template>

<style scoped>
.menu{
  margin-top:5rem;
}
</style>