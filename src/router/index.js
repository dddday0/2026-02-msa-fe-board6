import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignIn from '../views/Signin.vue';
import BoardWriteMod from '@/views/BoardWriteMod.vue';
import { useAuthenticationStore } from '@/stores/authentication';
import BoardList from '@/views/BoardList.vue';
import BoardDetail from '@/views/BoardDetail.vue';
/*
무조건 접근 가능한 path
로그인되면 접근 불가능한 path (비로그인 시 접근 가능한 path)
비로그인이면 접근 불가능한 path(로그인 시 접근 가능한 path) 

route 객체가 meta 속성이 없으면 무조건 접근 가능한 path
meta 속성에 requiresAuth: true면 로그인 시 접근 가능한 path
meta 속성에 requiresGuest: false면 비로그인 시 접근 가능한 path
*/

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',           
      component: () => import('../views/SignUp.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/signin',           
      component: SignIn,
      meta: { requiresGuest: true }
    },
    {
      path: '/board/write',
      component: BoardWriteMod,
      meta: { requiresAuth: true }
    },

    {
      path: '/board/list',
      component: BoardList,
    },

    {
      path: '/board/:id',
      component: BoardDetail,
    },
    
  ],
})

//로그인, 비로그인 상태일 때 접근할 수 없는 라우팅 처리
// navigation guard를 이용하여 처리한다.

//비로그인 시 이용할 수 잇는 Path들


//라우팅 될 때마다 아래 콜백함수가 계속 실행된다.
router.beforeEach( (to, from, next) => {
  const authentication = useAuthenticationStore();
  const isSigned = authentication.state.isSigned; //true: 로그인 상태, false: 비로그인 상태

  //비로그인 상태에서 로그인이 필요한 path로 가려고 할 때 
  if( to.meta.requiresAuth && !isSigned ) {
    return next( '/signin' );
  }
  // 로그인 상태에서 비로그인이 필요한 path로 가려고 할 때
  if( to.meta.requiresGuest && isSigned ) {
    return next( '/' );
  }

    next(); // 원래 처리대로
} );

export default router