<script setup>
import {ref, onMounted} from 'vue'
const emit = defineEmits(['join', 'close'])
const code = ref(null);
const errMsg = ref(null);
const codeInput = ref();
function joinGame(){
  console.log(code.value);
  console.log(code.value.length)
  if(!validateInput()){
     errMsg.value = "Invalid Code";
     return;
  }
  emit('join', code.value)
}
function closeThis(){
  console.log('xd')
  emit('close');
}
function validateInput(){
  if(code.value==null || code.value.trim()=='' || code.value==undefined) return false;
  if(code.value.length!==5)return false;
  return true;
}
onMounted(() => codeInput.value.focus());
</script>

<template>
  <div class="outer" @click="closeThis">
    <div class="inner pad flex column gap rc" @click.stop>
      <input ref="codeInput" class="pad" type="text" v-model="code" placeholder="ENTER CODE">
      <span>{{ errMsg }}</span>
      <button class="main-btn-full" @click="joinGame">Join Game</button>
    </div>
  </div>
</template>

<style scoped>
.outer{
  position:absolute;
  display:flex;
  inset:0;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  z-index:1;
}
.inner{
  background:rgb(86, 86, 86);
  width:300px;
  z-index:99;
}
</style>