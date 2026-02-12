<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import boardService from '@/services/boardService';

const router = useRouter();

const state = reactive({
    board: {
        title: '',
        contents: ''
    },
    boardId: 0
});

onMounted (()=>{
    console.log('history.state.id:', history.state.data);

    if(history.state.data){ //넘어온 데이터가 있다.  //통신할 필요 없이 데이터 전달 
        state.board= history.state.data;
    }
    
} );


const submit = async () => {
    const result = await(state.board.id 
    ? boardService.putBoard(state.board) 
    :boardService.postBoard(state.board));
    console.log('result: ', result);

    router.push(`/board/${result.resultData}`);

}
</script>

<template>

<h3>{{state.board.id? '글수정' :'글쓰기'}}</h3>
<div><input type="text" placeholder="제목" v-model="state.board.title"></div>
<div><textarea placeholder="제목" v-model="state.board.contents"></textarea></div>
<div><button @click="submit">{{state.board.id? '수정' : '등록'}}</button></div>
</template>

<style scoped>

</style>