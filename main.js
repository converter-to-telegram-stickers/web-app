const image = new Image();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x = 500, y = 500;

image.src = 'EnglandFirstSlide.png';

image.addEventListener('load', () => {
    ctx.drawImage(image,
        x, y,           // Start at 70/20 pixels from the left and the top of the image (crop)
        500, 500,       // "Get" a `50 * 50` (w * h) area from the source image (crop)
        0, 0,           // Place the result at 0, 0 in the canvas
        500, 500);      // With as width / height: 100 * 100 (scale)
});

function submit() {
    const aDownloadLink = document.createElement('a');
    aDownloadLink.download = 'canvas_image.png';
    aDownloadLink.href = canvas.toDataURL();
    aDownloadLink.click();
}

function moveLeft() {
    x--;
    ctx.drawImage(image,
        x, y,
        500, 500,
        0, 0,
        500, 500);
}

function moveRight() {
    x++;
    ctx.drawImage(image,
        x, y,
        500, 500,
        0, 0,
        500, 500);
}