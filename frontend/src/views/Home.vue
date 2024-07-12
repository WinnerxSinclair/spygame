<script setup>
import {ref, getCurrentInstance} from 'vue'
import TheCode from '../components/TheCode.vue'

import router from '../router'
const uName = ref('');
const errMsg = ref(null);
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;

function createRoom(){
  if(!validateInput()){
     errMsg.value = "Invalid Name";
     return;
  }
  socket.emit('create_room', uName.value);
  socket.on('room_created', (code) => {
    console.log(code)
    router.push({ path: `/lobby/${code}`, query: { name: uName.value } });
  })
}

const showModal = ref(false);
function openModal(){
  if(!validateInput()){
     errMsg.value = "Invalid Name";
     return;
  }
  showModal.value = true;
}
function joinRoom(roomCode){
  if(!validateInput()){
     errMsg.value = "Invalid Name";
     return;
  }
  socket.emit('join_room', roomCode, uName.value);
  socket.on('joined_room', (code) => {
    router.push({ path: `/lobby/${code}`, query: { name: uName.value } });
  })
}

function validateInput(){
  if(uName.value==null || uName.value.trim()=='' || uName.value==undefined) return false;
  if(uName.value.length < 1 || uName.value.length > 15)return false;
  return true;
}
</script>

<template>
  <div class="flex-c-c gap column home-wrap">
    <h1 class="main-title ff-2">SPY</h1>
    <input class="pad" type="text" placeholder="Enter Name" v-model="uName">
    <span>{{ errMsg }}</span>
    <button class="main-btn-full" @click="createRoom">Create New Game</button>
    <button class="main-btn-full" @click="openModal">Join Existing Game</button>
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