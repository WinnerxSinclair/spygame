<script setup>
import {ref, getCurrentInstance} from 'vue'
import TheCode from '../components/TheCode.vue'

import router from '../router'
const uName = ref('');
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;

function createRoom(){
  socket.emit('create_room', uName.value);
  socket.on('room_created', (code) => {
    console.log(code)
    router.push({ path: `/lobby/${code}`, query: { name: uName.value } });
  })
}

const showModal = ref(false);
function joinRoom(roomCode){
  socket.emit('join_room', roomCode, uName.value);
  socket.on('joined_room', (code) => {
    router.push({ path: `/lobby/${code}`, query: { name: uName.value } });
  })
}
</script>

<template>
  <div class="flex-c-c gap column home-wrap">
    <h1 class="main-title ff-2">SPY</h1>
    <input class="pad" type="text" placeholder="Enter Name" v-model="uName">
    <button class="main-btn-full" @click="createRoom">Create New Game</button>
    <button class="main-btn-full" @click="showModal=true">Join Existing Game</button>
    <TheCode v-if="showModal" @join="joinRoom" @close="showModal=false" />
  </div>
</template>

<style scoped>
.home-wrap{
  min-height:100vh;
}
.main-title{
  font-size:5rem;
}
</style>