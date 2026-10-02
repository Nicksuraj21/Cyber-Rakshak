/**
 * Cyber Rakshak IDS - Interactive Showcase Engine
 */

// Theme toggle
let currentTheme = localStorage.getItem('cyberrakshak_theme') || 'light';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    localStorage.setItem('cyberrakshak_theme', theme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
}

applyTheme(currentTheme);


// Navbar Scroll Elevation & ScrollSpy
window.addEventListener('scroll', () => {
    const header = document.getElementById('topNav');
    if (header) {
        if (window.scrollY > 15) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Mobile Drawer
function toggleMobileMenu(force) {
    const drawer = document.getElementById('mobDrawer');
    const backdrop = document.getElementById('mobBackdrop');
    if (!drawer || !backdrop) return;
    
    const isOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Hardware Media Switcher
window.setHwMedia = function(src, btn) {
    document.querySelectorAll('.hw-thumb-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    const img = document.getElementById('hwMainImg');
    if (img) {
        img.style.opacity = '0.3';
        setTimeout(() => {
            img.src = src;
            img.style.opacity = '1';
        }, 120);
    }
};

// FAQ Accordion
function toggleFaq(btn) {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
}

// Oscilloscope Canvas Lab
const canvas = document.getElementById('shieldOscCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth || 550;
    let height = canvas.height = 220;
    let offset = 0;
    let disrupted = false;

    window.addEventListener('resize', () => {
        width = canvas.width = canvas.parentElement.clientWidth || 550;
        height = canvas.height = 220;
    });

    function draw() {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
        ctx.lineWidth = 1;
        const step = 20;
        for (let x = 0; x < width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Primary Blue Wave
        ctx.strokeStyle = disrupted ? '#ef4444' : '#0080ff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
            const amp = disrupted ? 45 + Math.sin(x * 0.1) * 15 : 28;
            const freq = disrupted ? 0.04 : 0.025;
            const y = height / 2 + Math.sin((x + offset) * freq) * amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        offset += disrupted ? 5 : 2;
        requestAnimationFrame(draw);
    }

    draw();

    window.injectThreatVector = function() {
        const sel = document.getElementById('attackSelect');
        const val = sel ? sel.value : 'DDoS Slowloris Flood';
        const feed = document.getElementById('attackFeed');

        disrupted = true;
        setTimeout(() => { disrupted = false; }, 1500);

        const isClean = val.includes('Clean');
        const randomIp = '198.51.100.' + Math.floor(Math.random() * 200 + 10);
        const row = document.createElement('div');
        row.className = 'feed-entry ' + (isClean ? 'clean' : 'blocked');
        row.innerHTML = `
            <span class="font-mono">${randomIp} &bull; ${val}</span>
            <strong>${isClean ? 'CLEAN (0.08ms)' : 'QUARANTINED (0.12ms)'}</strong>
        `;

        if (feed) {
            feed.insertBefore(row, feed.firstChild);
            if (feed.children.length > 5) feed.removeChild(feed.lastChild);
        }
    };
}
