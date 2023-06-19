import { defineStore } from 'pinia';

// state
const createState = () => {
    const state = {
        username: 'asd'
    };
    return state;
};
export type userState = ReturnType<typeof createState>

const state = createState();

export const useUserStore = defineStore('user', {
    state: ():userState => (state)
});
