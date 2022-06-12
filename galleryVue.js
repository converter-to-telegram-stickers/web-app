const App = {
    data() {
        return {
            stickers: []
        }
    },
    async mounted() {
        const res = await fetch('/api/stickers');
        this.stickers = await res.json();
    }
};

Vue.createApp(App).mount('#container');