/**
 * SONICSTREAM PRO - CORE SYSTEM
 */

const musicData = [
    {
        id: 0,
        artist: "Arctic Monkeys",
        category: "Rock",
        sub: "Modern Rock",
        album: "The Car (Special Edition)",
        year: "2025",
        songs: ["Mirrorball", "Body Paint", "Sculptures"],
        details: "Legendary Indie-Rock pioneers from Sheffield.",
        achievements: "7 Brit Awards, Mercury Prize Winner.",
        instruments: ["Fender Stratocaster", "Vintage Keys", "Drums"],
        img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 1,
        artist: "Kamasi Washington",
        category: "Jazz",
        sub: "Modern Jazz",
        album: "Fearless Movement",
        year: "2025",
        songs: ["Dream State", "The Garden Path"],
        details: "The face of modern spiritual and orchestral jazz.",
        achievements: "Emmy Award Nominee.",
        instruments: ["Tenor Saxophone", "Double Bass", "Cello"],
        img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 2,
        artist: "Eminem",
        category: "Rap",
        sub: "Old School",
        album: "The Death of Slim Shady",
        year: "2025",
        songs: ["Houdini", "Renaissance", "Habits"],
        details: "The most successful white rapper in history.",
        achievements: "15 Grammy Awards, Academy Award Winner.",
        instruments: ["MPC 3000", "LinnDrum", "Turntables"],
        img: "https://images.unsplash.com/photo-1514525253361-bee8a187c02b?w=400",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: 3,
        artist: "Ludovico Einaudi",
        category: "Classical",
        sub: "Orchestral",
        album: "Seven Days Walking",
        year: "2026",
        songs: ["Golden Butterflies", "Low Mist"],
        details: "Italian minimalist composer and pianist.",
        achievements: "Most streamed Classical artist of all time.",
        instruments: ["Grand Piano", "Violin", "Viola"],
        img: "https://images.unsplash.com/photo-1520529611404-9acc0449d012?w=400",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
];

// STATE
let isRegistered = localStorage.getItem('sonicReg') === 'true';
let currentIndex = 0;
const audio = document.getElementById('mainAudio');

document.addEventListener('DOMContentLoaded', () => {
    renderGrid(musicData);
    initAuthUI();
    renderReviews();
    
    // Search Listener
    document.getElementById('mainSearch').oninput = (e) => {
        const val = e.target.value.toLowerCase();
        const filtered = musicData.filter(m => m.artist.toLowerCase().includes(val) || m.album.toLowerCase().includes(val));
        renderGrid(filtered);
    };

    // Audio Listeners
    audio.ontimeupdate = () => {
        const prog = (audio.currentTime / audio.duration) * 100;
        document.getElementById('seekSlider').value = prog || 0;
        document.getElementById('curTime').innerText = formatTime(audio.currentTime);
        document.getElementById('durTime').innerText = formatTime(audio.duration);
    };

    document.getElementById('volSlider').oninput = (e) => audio.volume = e.target.value;
    document.getElementById('seekSlider').oninput = (e) => audio.currentTime = (e.target.value / 100) * audio.duration;
});

// CORE FUNCTIONS
function startStream(id) {
    currentIndex = id;
    const track = musicData[id];
    
    audio.src = track.audio;
    audio.play();
    
    // Show Player Bar
    document.getElementById('globalPlayer').classList.remove('d-none');
    document.getElementById('p-song').innerText = track.songs[0];
    document.getElementById('p-artist').innerText = track.artist;
    document.getElementById('p-img').src = track.img;
    document.getElementById('playIcon').className = 'bi bi-pause-fill fs-2';

    updateInfoBox(track);
}

function togglePlay() {
    if(audio.paused) {
        audio.play();
        document.getElementById('playIcon').className = 'bi bi-pause-fill fs-2';
    } else {
        audio.pause();
        document.getElementById('playIcon').className = 'bi bi-play-fill fs-2';
    }
}

function nextTrack() {
    currentIndex = (currentIndex + 1) % musicData.length;
    startStream(currentIndex);
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + musicData.length) % musicData.length;
    startStream(currentIndex);
}

function updateInfoBox(track) {
    const box = document.getElementById('infoSidebar');
    box.innerHTML = `
        <div class="card info-box border-0 shadow-lg p-4 animate-up">
            <img src="${track.img}" class="rounded w-100 mb-3 shadow">
            <h5 class="fw-bold mb-1">${track.artist}</h5>
            <p class="text-secondary small mb-3">${track.details}</p>
            <div class="text-start">
                <h6 class="x-small fw-bold text-success text-uppercase">Album: ${track.album}</h6>
                <p class="small text-muted mb-3">Release Date: ${track.year}</p>
                <h6 class="x-small fw-bold text-uppercase">Instruments Used</h6>
                <div class="d-flex flex-wrap gap-1 mb-3">
                    ${track.instruments.map(i => `<span class="badge bg-secondary x-small">${i}</span>`).join('')}
                </div>
                <h6 class="x-small fw-bold text-uppercase">Upcoming Events</h6>
                <p class="small text-info">Live World Tour - Autumn 2025</p>
            </div>
            <button class="btn btn-outline-success btn-sm w-100 mt-2" onclick="startStream(${track.id})">Restart Track</button>
        </div>
    `;
}

function renderGrid(data) {
    const grid = document.getElementById('musicGrid');
    grid.innerHTML = data.map((m, i) => `
        <div class="col-md-4 col-6">
            <div class="music-card" onclick="startStream(${i})">
                <img src="${m.img}" class="w-100 mb-2 shadow">
                <div class="fw-bold text-truncate">${m.album}</div>
                <div class="x-small text-secondary">${m.artist}</div>
                <div class="mt-2 d-flex gap-2">
                    <button class="btn btn-sm btn-success rounded-circle"><i class="bi bi-play-fill"></i></button>
                    ${isRegistered 
                        ? `<button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="event.stopPropagation(); alert('Downloading...')">Download</button>`
                        : `<button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="event.stopPropagation(); showAuth()">Download</button>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

// LOGIC HELPERS
function handleRegister() {
    const user = document.getElementById('regUser').value;
    if(!user) return;
    localStorage.setItem('sonicReg', 'true');
    localStorage.setItem('sonicName', user);
    location.reload();
}

function initAuthUI() {
    const area = document.getElementById('authArea');
    if(isRegistered) {
        area.innerHTML = `<button class="btn btn-sm btn-outline-danger px-3 rounded-pill" onclick="logout()">Logout (${localStorage.getItem('sonicName')})</button>`;
    } else {
        area.innerHTML = `<button class="btn btn-sm btn-success px-4 rounded-pill fw-bold" onclick="showAuth()">Join Free</button>`;
    }
}

function showAuth() { new bootstrap.Modal(document.getElementById('authModal')).show(); }
function logout() { localStorage.clear(); location.reload(); }
function toggleTheme() {
    const t = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', t);
    document.getElementById('themeIcon').className = t === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
}

function filterCat(m, s) {
    const f = musicData.filter(x => x.category === m && x.sub === s);
    document.getElementById('viewTitle').innerText = s;
    renderGrid(f);
}

function filterYear(y) {
    const f = musicData.filter(x => x.year.includes(y));
    document.getElementById('viewTitle').innerText = "New Releases " + y;
    renderGrid(f);
}

function showHome() { document.getElementById('viewTitle').innerText = "Trending Now"; renderGrid(musicData); }
function formatTime(s) { const m = Math.floor(s/60); const sc = Math.floor(s%60); return `${m}:${sc<10?'0':''}${sc}`; }

function renderReviews() {
    document.getElementById('reviewsGrid').innerHTML = musicData.slice(0, 3).map(m => `
        <div class="col-md-4"><div class="card bg-custom p-3 h-100 x-small">
            <div class="text-warning mb-2"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div>
            "The 2025 remastering of ${m.artist} is incredible."
            <div class="mt-2 fw-bold text-success">— Verified Listener</div>
        </div></div>`).join('');
}