<script setup>
import { ref, getCurrentInstance,onMounted, onUnmounted, computed } from 'vue'
import router from '../router'
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;
const props = defineProps({
  roomCode: String,
  userName: String,
})
const location = ref(null);
const role = ref(null);
const players = ref(null);
const timer = ref(480);
socket.on('load_game', (locAndRoles) => {
  timer.value = 480;
  location.value = locAndRoles.location;
  locAndRoles.roles.forEach((r)=>{
    if(r.player==props.userName){
      role.value = r.role;
    }
  })
  players.value = locAndRoles.roles;
  console.log(players.value)
})
socket.on('lobby_returnfs', ()=>{
  router.push({ path: `/lobby/${props.roomCode}`, query: { name: props?.userName } });
})
function restartGame(){
  socket.emit('restart_game',props.roomCode);
}
function lobbyReturn(){
  socket.emit('lobby_return',props.roomCode)
}

const timesUp = computed(()=> timer.value == 0);
let intId = null;
onMounted(() => {
  intId = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    }
  }, 1000);
});
onUnmounted(()=> clearInterval(intId));

function applyLS(){

}
</script>
<template>
  <div class="flex gap">
    <button class="main-btn-full" @click="lobbyReturn">Back To Lobby</button>
    <button class="main-btn-full" @click="restartGame">Restart Game</button>
  </div>
  <div class="margin-top fs-600">{{ timesUp ? 'Times Up!' : timer }}</div>
  <div class="flex gap player-wrap wrap">
    <div class="fs-400 ff-1" v-for="playerr in players" 
    :key="playerr" @click="applyLS">{{ playerr.player }}</div>
  </div>
  <div class="fs-600"><span class="fs-100 bold">Location:</span> {{ role=='spy' ? '???' : location }}</div>
  <div class="fs-600"><span class="fs-100 bold">Role:</span> {{ role }}</div>
</template>

<style scoped>
.player-wrap{
  max-width: 400px;
}
</style>