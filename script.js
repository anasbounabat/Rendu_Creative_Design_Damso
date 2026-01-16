
// gestion du curseur custom
const customCursor = document.getElementById('customCursor');

if (customCursor) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    let isHovering = false;
    let rotation = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        customCursor.classList.add('active');
    });

    function animateCursor() {
        const speed = isHovering ? 0.5 : 0.25;
        cx += (mx - cx) * speed;
        cy += (my - cy) * speed;

        rotation += 0.5;
        if (rotation > 360) rotation = 0;

        customCursor.style.left = cx + 'px';
        customCursor.style.top = cy + 'px';
        customCursor.style.transform = `translate(-50%, -50%) rotate(${isHovering ? rotation * 0.1 : 0}deg)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.addEventListener('mouseleave', () => {
        customCursor.classList.remove('active');
        isHovering = false;
    });
    document.addEventListener('mouseenter', () => {
        customCursor.classList.add('active');
    });

    const interactiveElements = document.querySelectorAll('button, .cover-btn, .track, a, canvas');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            customCursor.classList.add('hover-button');
            if (el.classList.contains('cover-btn') || el.classList.contains('track')) {
                customCursor.classList.add('hover-interactive');
            }
        });
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            customCursor.classList.remove('hover-button', 'hover-interactive');
        });
    });
}

// animation des particules jaunes en fond
const sandCanvas = document.getElementById("sandCanvas");
if (sandCanvas) {
    const ctx = sandCanvas.getContext("2d");
    const parts = [];

    function resize() {
        sandCanvas.width = sandCanvas.offsetWidth;
        sandCanvas.height = sandCanvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 400; i++) {
        parts.push({
            x: Math.random() * sandCanvas.width,
            y: Math.random() * sandCanvas.height,
            size: Math.random() * 2 + 0.5,
            sx: Math.random() * 0.5 - 0.25,
            sy: Math.random() * 0.3 + 0.1,
            op: Math.random() * 0.5 + 0.2,
        });
    }

    function animate() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, sandCanvas.width, sandCanvas.height);

        parts.forEach(p => {
            p.x += p.sx;
            p.y += p.sy;
            if (p.y > sandCanvas.height) {
                p.y = 0;
            }
            if (p.y < 0) {
                p.y = sandCanvas.height;
            }
            if (p.x > sandCanvas.width) {
                p.x = 0;
            }
            if (p.x < 0) {
                p.x = sandCanvas.width;
            }
            ctx.fillStyle = `rgba(218, 165, 32, ${p.op})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// effet glitch sur le titre KONGO
const glitchText = document.getElementById("glitchText");
if (glitchText) {
    setInterval(() => {
        glitchText.classList.add("glitch-active");
        setTimeout(() => glitchText.classList.remove("glitch-active"), 200);
    }, 4000);
}


// génération des covers d'album
const coverCanvas = document.getElementById('coverCanvas');
let style = 'geometric';
let img = null;
let variationCount = 0;

const preload = new Image();
preload.src = 'img/damso.png';
preload.onload = function () {
    img = preload;
    if (coverCanvas) generateCover('digital');
};
preload.onerror = function () {
    const retry = new Image();
    retry.src = 'img/damso.png';
    retry.onload = function () {
        img = retry;
        if (coverCanvas) generateCover('digital');
    };
};

const basePalette = ['#3D4426', '#6B7444', '#A8A37E', '#121410', '#000000', '#dc2626', '#d97706', '#f2f2f2'];



function generateCover(s) {
    if (!coverCanvas) return;
    const ctx = coverCanvas.getContext('2d');
    const size = 500;
    coverCanvas.width = size;
    coverCanvas.height = size;

    const palette = basePalette;

    if (s === 'digital') generateDigitalCover(ctx, size, palette);
    else if (s === 'organic') generateOrganicCover(ctx, size, palette);
    else generateDigitalCover(ctx, size, palette);

    addImageToCover(ctx, size);
}

function generateDigitalCover(ctx, size, palette) {
    const baseSeed = 'digital'.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = baseSeed + variationCount * 1000;
    let rng = seed;
    function random() {
        rng = (rng * 9301 + 49297) % 233280;
        return rng / 233280;
    }

    const offsetX = (variationCount * 37) % size;
    const offsetY = (variationCount * 53) % size;

    ctx.fillStyle = palette[2];
    ctx.fillRect(0, 0, size, size);

    const gridSize = 10;
    const pixelColors = palette;

    for (let i = 0; i < 600; i++) {
        let gridX = Math.floor(random() * (size / gridSize));
        let gridY = Math.floor(random() * (size / gridSize));

        gridX = (gridX + Math.floor(offsetX / gridSize)) % (size / gridSize);
        gridY = (gridY + Math.floor(offsetY / gridSize)) % (size / gridSize);

        const x = gridX * gridSize;
        const y = gridY * gridSize;

        const pixelSize = Math.floor(random() * 3) + 1;
        const w = gridSize * pixelSize;
        const h = gridSize * pixelSize;

        ctx.fillStyle = pixelColors[Math.floor(random() * pixelColors.length)];
        ctx.fillRect(x, y, w, h);
    }
}

function generateOrganicCover(ctx, size, palette) {
    ctx.fillStyle = palette[3];
    ctx.fillRect(0, 0, size, size);

    const numShapes = 40;

    for (let i = 0; i < numShapes; i++) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        ctx.fillStyle = color;
        ctx.globalAlpha = 1.0;

        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 150 + 50;

        drawInterlockingBlob(ctx, x, y, radius, false);
    }

    ctx.globalAlpha = 1;
}

function drawInterlockingBlob(ctx, x, y, radius, edgy = false) {
    const points = edgy
        ? 8 + Math.floor(Math.random() * 4)
        : 14 + Math.floor(Math.random() * 6);

    const angleStep = (Math.PI * 2) / points;
    const coords = [];

    for (let i = 0; i < points; i++) {
        const angle = i * angleStep;
        const dist = radius * (0.5 + Math.random() * 1.1);
        coords.push({
            x: x + Math.cos(angle) * dist,
            y: y + Math.sin(angle) * dist
        });
    }

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);

    for (let i = 0; i < points; i++) {
        const next = (i + 1) % points;
        if (edgy) {
            ctx.lineTo(coords[next].x, coords[next].y);
        } else {
            ctx.quadraticCurveTo(coords[i].x, coords[i].y, coords[next].x, coords[next].y);
        }
    }

    ctx.closePath();
    ctx.fill();
}

function addImageToCover(ctx, size) {
    if (img && img.complete) {
        ctx.save();
        const w = size * 0.7;
        const h = (img.height / img.width) * w;
        const x = (size - w) / 2;
        const y = (size - h) / 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
    } else {

        if (!img) {
            const newImg = new Image();
            newImg.src = 'img/damso.png';
            newImg.onload = function () {
                img = newImg;
                generateCover(style);
            };
            newImg.onerror = function () {

                setTimeout(() => {
                    const retryImg = new Image();
                    retryImg.src = 'img/damso.png';
                    retryImg.onload = function () {
                        img = retryImg;
                        generateCover(style);
                    };
                }, 500);
            };
        } else {

            img.onload = function () {
                generateCover(style);
            };
        }
    }
}

if (coverCanvas) {
    const btns = document.querySelectorAll('.cover-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const s = btn.getAttribute('data-style');
            style = s;
            variationCount++;
            generateCover(s);
        });
    });

    coverCanvas.addEventListener('click', () => {
        variationCount++;
        generateCover(style);
    });

    if (img && img.complete) generateCover('digital');
}
