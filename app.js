const supabase = createClient(
    'https://efnhqqgddfuxwmnrguns.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbmhxcWdkZGZ1eHdtbnJndW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODYyMzUsImV4cCI6MjA1NDE2MjIzNX0.XdVYATptiop5yAUtvPZCWxPo-gcKwYuflvsjvkqEG-w'
);

// Gestion de la connexion
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (!error) window.location.href = 'main.html';
    else alert('Erreur de connexion');
});

// Métronome
let isPlaying = false;
let timer;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playClick() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

document.getElementById('bpmRange')?.addEventListener('input', (e) => {
    document.getElementById('bpm').textContent = e.target.value;
});

document.getElementById('startStop')?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    document.getElementById('startStop').textContent = isPlaying ? 'Arrêter' : 'Démarrer';
    if (isPlaying) {
        const bpm = parseInt(document.getElementById('bpmRange').value);
        const interval = 60000 / bpm;
        timer = setInterval(playClick, interval);
    } else {
        clearInterval(timer);
    }
});

// Navigation
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// Déconnexion
document.getElementById('logout')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js');
    });
}
