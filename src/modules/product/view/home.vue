<script setup>
import {computed, onMounted} from 'vue'
import {useStore} from "vuex"
const store = useStore();
const counter = computed(()=> store.getters['product/getCounter']);
const Counter = () => {
    store.commit('product/setCounter');
}


onMounted(()=> {
    store.dispatch('product/fetchUsers', {});
})

</script>

<template>
    <h1>this is a home page</h1>
    <h2>Counter Number: {{counter}}</h2>
    <button @click="Counter">Counter</button>
</template>

