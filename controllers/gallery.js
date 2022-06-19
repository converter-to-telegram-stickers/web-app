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

function download(sticker) {
    const link = document.createElement('a');
    link.download = 'image512x512.png';
    link.href = sticker.src;
    link.click();
}

function updateGallery() {
    const res = fetch('/api/stickers');
    this.stickers = res.json();
}