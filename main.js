const canvas = document.getElementById('canvas');

document.getElementById('input').onchange = function() {
    document.getElementById('input-label').style.display = 'none';
    canvas.style.display = 'flex';
    const image = new Image();
    image.onload = draw;
    image.src = URL.createObjectURL(this.files[0]);
};

function draw() {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0, 0);
}

function submit() {
    const link = document.createElement('a');
    link.download = 'canvas_image.png';
    link.href = canvas.toDataURL();
    link.click();
}