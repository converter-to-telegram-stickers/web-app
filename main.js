const canvas = document.getElementById('canvas');
const input = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const image = new Image();
const ctx = canvas.getContext('2d');

input.onchange = function() {
    inputLabel.style.display = 'none';
    canvas.style.display = 'flex';
    const imageFile = this.files[0];
    image.onload = draw;
    image.src = URL.createObjectURL(imageFile);
};

function draw() {
    ctx.drawImage(this, 0, 0);
}

function submit() {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
}