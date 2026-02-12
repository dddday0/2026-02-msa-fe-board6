<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import boardService from '@/services/boardService';
import { useAuthenticationStore } from '@/stores/authentication';

const authentication = useAuthenticationStore();

const route = useRoute();
const router = useRouter();
const state = reactive({
    data: {
        id: 0,
        title: '',
        nm: '',
        contents: '',
        createdAt: '',
        userId: ''
}
});

onMounted( async ()=> {
    const id = route.params.id; // PathVariable 받아서 id 상수에 담아주세요.
    console.log('id', id);

    const result = await boardService.getBoard(id);
    state.data = result.resultData;
})

const del = async () =>{
    if(!confirm('삭제하시겠습니까'))
{return}
    const params = {
        id: route.params.id
    }
    const result = await boardService.delBoard(params);
    if(result.resultData ===1) {
        router.push('/board/list')
    } else {
        alert(result.resultMessage);
    }
}

const goToMod = () =>{
    router.push({
        path: '/board/write',
        state: {
            data:{
                id: route.params.id
            , title: state.data.title
            , contents: state.data.contents
            }
            
        }
    });
}

</script>

<template>
<h3>게시판 디테일</h3>

<div>
    <table>
        <tr>
            <td>no</td>
            <td>{{ state.data.id }}</td>
            
        </tr>
        <tr>
            <td>title</td>
            <td>{{ state.data.title }}</td>
        </tr>
        <tr>
            <td>name</td>
            <td>{{ state.data.nm }}</td>
        </tr>
        <tr>
            <td>contents</td>
            <td>{{ state.data.contents }}</td>
        </tr>
        <tr>
            <td>created_at</td>
            <td>{{ state.data.createdAt }}</td>
        </tr>
    
        <div v-if="state.data.userId == authentication.state.signedUser.signedUserId">
            <button @click="del">삭제</button>
            <button @click="goToMod" >수정</button>
        </div>
    </table>
</div>

</template>

<style scoped>
table { border-collapse: collapse;}

</style>