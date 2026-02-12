<script setup>
import boardService from '@/services/boardService';
import { reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const state = reactive({
    list: [],
    searchText: '',
    size: 50,
    currentPage: 1,
    maxPage: 0,
    relatedSearchList: ['', '']
});

const getBoardList = async() => {
    const params = {
        page: state.currentPage
        , size: state.size
    };
    if(state.searchText){
        params.search_text = state.searchText;
    }
    const result = await boardService.getBoardList(params);
    state.list = result.resultData;
}

const getBoardMaxPage = async() => {
    const params = {size: state.size };
    if(state.searchText){
        params.search_text = state.searchText;
    }

    const result = await boardService.getBoardMaxPage(params);
    state.maxPage = result.resultData;
}

onMounted( ()=> {
    doSearch();
});

const goToPage = page => {
    console.log(typeof page);
    state.currentPage = page;
    getBoardList();
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
};

//페이징 그룹의 번호 갯수
const pageGroupSize = 10;
//현재 페이지 그룹 계산
const currentGroup = computed( () => Math.ceil(state.currentPage / pageGroupSize) );
//현재 그룹의 시작 페이지 번호
const startPage = computed( () => ((currentGroup.value - 1)* pageGroupSize +1));
const endPage = computed( ()=> Math.min(currentGroup.value * pageGroupSize, state.maxPage));
const displayedPages = computed( ()=> {
    const pages = [];
    for(let i=startPage.value; i<= endPage.value; i++){
        pages.push(i);
    }
    return pages;
});

const goToFirstPage = () => {
    goToPage(1);
}

const goToPreviousPage = () =>{
    const previousPage = startPage.value -1;
    if(previousPage < 1 ) { return;}
    goToPage(previousPage);
}

const goToNextPage = ()=> {
    const nextPage = endPage.value + 1;
    if(nextPage > state.maxPage) { return; }
    goToPage(nextPage);
}

const goToLastPage = () => {
    goToPage(state.maxPage);
}


const doSearch = () => {
    state.relatedSearchList = [];
    state.currentPage = 1;
    getBoardMaxPage();
    getBoardList();
    getRelatedTitles();
}

const moveToDetail = id => {
    router.push(`/board/${id}`);

}

let timer;

const typing = e =>{
    if(timer) { clearTimeout(timer);}
    timer = setTimeout(() => {
            getRelatedTitles();
    }, 700);
}

const getRelatedTitles = async () => {
    if(state.searchText.length === 0 ){
        state.relatedSearchList = [];
        return;
    }
    const params = {
        search_text: state.searchText
    }

    const result = await boardService.getBoardRelatedTitles(params);
    state.relatedSearchList = result.resultData;
}

const send = (item) => {
    state.searchText = item
    doSearch();
}
</script>

<template>
    <h3>게시판 리스트</h3>
    <div class="search-container">
        <input type="search" v-model="state.searchText" @keyup="typing" @keyup.enter="doSearch">
        <button @click="doSearch">검색</button>
    </div>
    <div class="related-search-container" v-if="state.relatedSearchList.length >0 ">
        <div v-for="item in state.relatedSearchList" @click="send(item)">
            {{ item }}
        </div>
    </div>
    <div v-if="state.list.length === 0">게시글이 없습니다.</div>
    <div v-else>
        <table>
            <thead>
                <tr>
                    <th>no</th>
                    <th>title</th>
                    <th>writer</th>
                    <th>created_at</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in state.list" :key="item.id" @click="moveToDetail(item.id)">
                    <td>{{ item.id }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.nm }}</td>
                    <td>{{ item.createdAt }}</td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <button @click="goToFirstPage" :disabled="startPage === 1">&lt;&lt;</button>
            <button @click="goToPreviousPage" :disabled="startPage === 1" >&lt;Back</button>
            <span class="page" v-for="item in displayedPages" 
            :key="item" :class="{selected: item == state.currentPage}" @click="goToPage(item)">
                {{ item }}
                </span>
                <button @click="goToNextPage" :disabled="endPage === state.maxPage">&gt;Next</button>
                <button @click="goToLastPage" :disabled="endPage === state.maxPage">&gt;&gt;</button>
        </div>
        </div>
    
    </template>
    
    <style scoped>
    table { border-collapse: collapse; }
    table td, table th { border: 1px solid #eee; padding: 10px; }
    table tbody tr:hover { background-color: aliceblue; cursor: pointer;}
    .page{cursor: pointer;}
    .page{scroll-behavior: smooth;}
    .page:not(:first-child) {margin-left: 8px;}
    .selected { color: red; font-weight: bold;}
    .pagination { display: flex; justify-content: center;}

    .search-container { position: relative;}
    .related-search-container { position: absolute; left: 0; top: 25; background-color: #fff;
                                z-index: 5; width: 170px; border: 1px solid #eee;
                                padding: 5px;}
    .related-search-container .item:hover { background-color: #eee; cursor: pointer;}                           
    </style>