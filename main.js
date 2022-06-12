const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inputImage = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const inputColor = document.getElementById('input-color');
const inputText = document.getElementById('input-text');
const buttons = document.getElementById('buttons');
const galleryWindow = document.getElementById('galleryWindow');
const image = new Image();

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

inputImage.onchange = function() {
    hideInputLabel(this.files[0]);
};

inputColor.onchange = function(e) {
    bgColor = e.target.value;
    if (dirty) update();
    dirty = true;
};

inputText.oninput = function(e) {
    text = e.target.value;
    if (dirty) update();
    dirty = true;
};

inputLabel.ondrop = function(e) {
    e.preventDefault();
    inputImage.files = e.dataTransfer.files;
    hideInputLabel(inputImage.files[0]);
};

inputLabel.ondragover = function(e) {
    e.preventDefault();
    this.classList.add('dragover');
};

inputLabel.ondragleave = function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
};

document.onpaste = function(e){
    const file = e.clipboardData.items[0].getAsFile();
    hideInputLabel(file);
};

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
        ctx.font = 'bold 48px sans-serif';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height - 40);
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

function download(imageData) {
    const link = document.createElement('a');
    link.download = 'image512x512.png';
    link.href = imageData;
    link.click();
}

function closeWindow() {
    galleryWindow.style.display = 'none';
}

function showGalleryWindow(imageData) {
    const gwImage = document.getElementById('gw-img');
    gwImage.src = imageData;
    galleryWindow.style.display = 'flex';
}

function onSubmitClick() {
    const imageData = canvas.toDataURL();
    download(imageData);
    showGalleryWindow(imageData);
}

function hideInputLabel(imageFile) {
    const fileFormat = imageFile.name.split('.').pop();
    const correctImageFormat = fileFormat === 'png' ||
        fileFormat === 'jpg' || fileFormat === 'jpeg';

    if (!correctImageFormat) {
        alert('Wrong file type. Try again.');
        return;
    }

    inputLabel.style.display = 'none';
    canvas.style.display = 'flex';
    buttons.style.display = 'flex';
    image.onload = () => {
        ctx.drawImage(image, 0, 0);
        canvas.elementFromPoint(0, 0).click();
    };
    image.src = URL.createObjectURL(imageFile);
}