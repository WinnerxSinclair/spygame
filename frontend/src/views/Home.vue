<script setup>
import {ref, getCurrentInstance} from 'vue'

import router from '../router'
const uName = ref('');
const roomCode = ref('')
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;

function createRoom(){
  socket.emit('create_room', uName.value);
  socket.on('room_created', (code) => {
    console.log(code)
    router.push(`/lobby/${code}`)
  })
}

function joinRoom(){
  socket.emit('join_room', roomCode.value, uName.value);
  socket.on('joined_room', (code) => {
    router.push(`lobby/${code}`)
  })
}
</script>

<template>
    <h1 class="main-title ff-2">SPY</h1>
    <input class="pad" type="text" placeholder="Enter Name" v-model="uName">
    <input type="text" class="pad" placeholder="Room Code" v-model="roomCode">
    <button class="main-btn-full" @click="createRoom">Create New Game</button>
    <button class="main-btn-full" @click="joinRoom">Join Existing Game</button>
</template>

<style scoped>
input{

}
.main-title{
  font-size:5rem;
}
</style>