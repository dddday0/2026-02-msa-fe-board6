<script setup>
import { reactive } from 'vue';
import boardService from '@/services/boardService';
const state = reactive({
    board: {
        title: '',
        contents: ''
    }
});

const submit = async () => {
    const result = await boardService.postBoard(state.board);
    console.log('result: ', result);
}
</script>

<template>
<h3>글쓰기</h3>
<div><input type="text" placeholder="제목" v-model="state.board.title"></div>
<div><textarea placeholder="제목" v-model="state.board.contents"></textarea></div>
<div><button @click="submit">등록</button></div>
</template>

<style scoped>

</style>