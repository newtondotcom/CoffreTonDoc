export const useLoadingStore = defineStore('counter', () => {
    const loading = ref(false);
    function toggle() {
        loading.value = !loading.value;
    }

    return { loading, toggle };
});
