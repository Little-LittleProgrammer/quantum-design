import AppVue from './App.vue';
import { Component, createApp } from 'vue';

console.log('script');

function append_conent(app: Component) {
    const div = document.createElement('div');
    div.id = 'joinContentApp';
    div.style.position = 'fixed';
    div.style.right = '1px';
    div.style.zIndex = '100';
    div.style.cursor = 'pointer';
    div.style.bottom = '200px';
    document.body.appendChild(div);
    createApp(app).mount('#joinContentApp');
}

// const appid = location.href.split('/').pop() || '';
// if (appid) {
//     append_conent(AppVue);
// }

append_conent(AppVue);
