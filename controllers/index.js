const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inputImage = document.getElementById('input');
let inputLabel = document.getElementById('input-label');
let imageText = document.getElementById('input-text');
const image = new Image();
let imageData = '';

const funnyLables = ["аниме", "добрый чел.", "ломай ломай", "всем интересно!", "смирись", "в нем заключено 6"];

requestAnimationFrame(drawCanvas);

let matrix = [1, 0, 0, 1, 0, 0];
let scale = 1;
const pos = { x: 0, y: 0 };
let dirty = true;
const mouse = {x: 0, y: 0, oldX: 0, oldY: 0, dragging: false};
let bgColor = null;
let text = '';

canvas.addEventListener('mousemove', mouseEvent, {passive: true});
canvas.addEventListener('mousedown', mouseEvent, {passive: true});
canvas.addEventListener('mouseup', mouseEvent, {passive: true});
canvas.addEventListener('mouseout', mouseEvent, {passive: true});

canvas.addEventListener('wheel', mouseWheelEvent, {passive: false});

// canvas.addEventListener('touchstart', mouseEvent);
// canvas.addEventListener('touchmove', mouseEvent);
// canvas.addEventListener('touchend', mouseEvent);

function generateImageText(){
    let randomLabel = funnyLables[Math.floor(Math.random()*funnyLables.length)]
    imageText = randomLabel;
    inputLabel = randomLabel;
    text = randomLabel;
    if (dirty) update();
    dirty = true;
}

inputImage.onchange = function() {
    loadImage(this.files[0]);
};

inputLabel.ondrop = function(e) {
    e.preventDefault();
    inputImage.files = e.dataTransfer.files;
    loadImage(inputImage.files[0]);
};

document.onpaste = function(e) {
    loadImage(e.clipboardData.items[0].getAsFile());
};

imageText.oninput = function(e) {
    text = e.target.value;
    if (dirty) update();
    dirty = true;
};

function changeVisibilityById(id, show) {
    document.getElementById(id).style.display = show ? 'flex' : 'none';
}

function update() {
    dirty = false;
    matrix[3] = matrix[0] = scale;
    matrix[2] = matrix[1] = 0;
    matrix[4] = pos.x;
    matrix[5] = pos.y;
    if (bgColor !== null) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function scaleAt(at, amount) {
    if (dirty) update();
    scale *= amount;
    pos.x = at.x - (at.x - pos.x) * amount;
    pos.y = at.y - (at.y - pos.y) * amount;
    dirty = true;
}

function drawCanvas() {
    if (dirty) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (dirty) update();
        ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        ctx.drawImage(image, 0, 0);
        ctx.resetTransform();
        ctx.font = 'bold 38px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.fillText(text, canvas.width / 2, canvas.height - 30);
    }
    requestAnimationFrame(drawCanvas);
}

function mouseEvent(e) {
    if (e.type === 'mousedown' || e.type === 'touchstart')
        mouse.dragging = true;
    if (e.type === 'mouseup' || e.type === 'mouseout' || e.type === 'touchend')
        mouse.dragging = false;
    mouse.oldX = mouse.x;
    mouse.oldY = mouse.y;
    mouse.x = e.offsetX;
    mouse.y = e.offsetY
    if (mouse.dragging) {
        if (dirty) update();
        pos.x += mouse.x - mouse.oldX;
        pos.y += mouse.y - mouse.oldY;
        dirty = true;
    }
}

function mouseWheelEvent(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    if (e.deltaY < 0) scaleAt({x, y}, 1.1);
    else {
        if (scale < 0.04) scale = 0.04;
        scaleAt({x, y}, 1 / 1.1);
    }
    e.preventDefault();
}

function download() {
    const link = document.createElement('a');
    link.download = 'image512x512.png';
    link.href = imageData;
    link.click();
}

function onSubmitClick() {
    imageData = canvas.toDataURL();
    download();
    tryToAddToGallery();
}

function loadImage(imageFile) {
    const fileFormat = imageFile.name.split('.').pop();
    const correctImageFormat = fileFormat === 'png' ||
        fileFormat === 'jpg' || fileFormat === 'jpeg';

    if (!correctImageFormat) {
        alert('Загружен файл неподдерживаемого формата. Убедитесь, что загруженный файл имеет расширение .jpg, .jpeg или .png');
        return;
    }

    image.onload = () => {
        ctx.drawImage(image, 0, 0);
        canvas.elementFromPoint(0, 0).click();
    };
    image.src = URL.createObjectURL(imageFile);
}

async function tryToAddToGallery() {
    if (!document.getElementById('gallery-checkbox').checked) return;
    const sticker = {
        id: Date.now(),
        data: imageData
    };
    await fetch('/api/stickers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sticker)
    });
}