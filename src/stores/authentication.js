import { reactive } from "vue";
import { defineStore } from "pinia";

export const useAuthenticationStore = defineStore('authentication', () => {
    const state = reactive ({
        signedUser: {
            signedUserid: 0,
            nm: ''
        },
        isSigned: false
    });

    const signIn = signedUser => {
        state.isSigned = true;
        state.signedUser = signedUser;
    }

    return { state, signIn };
} , { persist : true});