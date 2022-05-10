const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inputImage = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const inputColor = document.getElementById('input-color');
const buttons = document.getElementById('buttons');
const image = new Image();

requestAnimationFrame(drawCanvas);

let matrix = [1, 0, 0, 1, 0, 0];
let scale = 1;
const pos = { x: 0, y: 0 };
let dirty = true;
const mouse = {x: 0, y: 0, oldX: 0, oldY: 0, dragging: false};
let bgColor = null;

canvas.addEventListener('mousemove', mouseEvent, {passive: true});
canvas.addEventListener('mousedown', mouseEvent, {passive: true});
canvas.addEventListener('mouseup', mouseEvent, {passive: true});
canvas.addEventListener('mouseout', mouseEvent, {passive: true});
canvas.addEventListener('wheel', mouseWheelEvent, {passive: false});

function apply() {
    if (dirty)
        update();
    ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
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

function pan(amount) {
    if (dirty)
        update();
    pos.x += amount.x;
    pos.y += amount.y;
    dirty = true;
}

function scaleAt(at, amount) {
    if (dirty)
        update();
    scale *= amount;
    pos.x = at.x - (at.x - pos.x) * amount;
    pos.y = at.y - (at.y - pos.y) * amount;
    dirty = true;
}

function drawCanvas() {
    if (dirty) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        apply();
        ctx.drawImage(image, 0, 0);
    }
    requestAnimationFrame(drawCanvas);
}

function mouseEvent(e) {
    if (e.type === 'mousedown')
        mouse.dragging = true;
    if (e.type === 'mouseup' || e.type === 'mouseout')
        mouse.dragging = false;
    mouse.oldX = mouse.x;
    mouse.oldY = mouse.y;
    mouse.x = e.offsetX;
    mouse.y = e.offsetY
    if (mouse.dragging)
        pan({x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY});
}

function mouseWheelEvent(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    if (e.deltaY < 0)
        scaleAt({x, y}, 1.1);
    else {
        if (scale < 0.04)
            scale = 0.04;
        scaleAt({x, y}, 1 / 1.1);
    }
    e.preventDefault();
}

inputImage.onchange = function() {
    hideInputLabel(this.files[0]);
};

inputColor.onchange = function(e) {
    bgColor = e.target.value;
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

function download() {
    const link = document.createElement('a');
    link.download = 'image512x512.png';
    link.href = canvas.toDataURL();
    link.click();
}

function hideInputLabel(imageFile) {
    if (imageFile.name.includes('png') ||
        imageFile.name.includes('jpg') ||
        imageFile.name.includes('jpeg')) {
        inputLabel.style.display = 'none';
        canvas.style.display = 'flex';
        buttons.style.display = 'flex';
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
            canvas.elementFromPoint(0, 0).click();
        };
        image.src = URL.createObjectURL(imageFile);
    }
    else
        alert('Wrong file type. Try again.');
}