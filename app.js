// Initialisation du client Supabase
const supabaseUrl = 'https://efnhqqgddfuxwmnrguns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbmhxcWdkZGZ1eHdtbnJndW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODYyMzUsImV4cCI6MjA1NDE2MjIzNX0.XdVYATptiop5yAUtvPZCWxPo-gcKwYuflvsjvkqEG-w';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Gestion de la connexion
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert('Erreur de connexion : ' + error.message);
    } else {
        window.location.href = 'main.html';
    }
});

// Métronome amélioré
class Metronome {
    constructor() {
        this.isPlaying = false;
        this.bpm = 120;
        this.timer = null;
        this.tapTimes = [];
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        
        this.initAudio();
        this.initControls();
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0; // Silence par défaut
        this.gainNode.connect(this.audioContext.destination);
    }

    initControls() {
        // Contrôle du BPM
        document.getElementById('bpmRange').addEventListener('input', (e) => {
            this.bpm = parseInt(e.target.value);
            this.updateDisplay();
            if (this.isPlaying) this.restart();
        });

        document.getElementById('bpmUp').addEventListener('click', () => {
            this.bpm = Math.min(240, this.bpm + 1);
            this.updateDisplay();
            if (this.isPlaying) this.restart();
        });

        document.getElementById('bpmDown').addEventListener('click', () => {
            this.bpm = Math.max(40, this.bpm - 1);
            this.updateDisplay();
            if (this.isPlaying) this.restart();
        });

        // Start/Stop
        document.getElementById('startStop').addEventListener('click', () => {
            if (!this.isPlaying) {
                this.start();
            } else {
                this.stop();
            }
        });

        // Tap Tempo
        document.getElementById('tapTempo').addEventListener('click', () => {
            this.handleTapTempo();
        });
    }

    updateDisplay() {
        document.getElementById('bpmValue').textContent = this.bpm;
        document.getElementById('bpmRange').value = this.bpm;
    }

    playClick() {
        // Crée un nouveau son à chaque click
        const osc = this.audioContext.createOscillator();
        osc.connect(this.gainNode);
        osc.frequency.value = 1000;
        
        // Enveloppe ADSR
        const now = this.audioContext.currentTime;
        osc.start(now);
        osc.stop(now + 0.1);
        
        // Animation visuelle
        const indicator = document.querySelector('.beat-indicator');
        indicator.classList.add('active');
        setTimeout(() => indicator.classList.remove('active'), 100);
    }

    start() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            document.getElementById('startStop').textContent = 'Arrêter';
            this.audioContext.resume(); // Nécessaire pour iOS
            this.scheduleClick();
        }
    }

    stop() {
        this.isPlaying = false;
        document.getElementById('startStop').textContent = 'Démarrer';
        clearTimeout(this.timer);
    }

    restart() {
        this.stop();
        this.start();
    }

    scheduleClick() {
        if (!this.isPlaying) return;

        const interval = 60000 / this.bpm;
        this.playClick();
        
        this.timer = setTimeout(() => {
            this.scheduleClick();
        }, interval);
    }

    handleTapTempo() {
        const now = Date.now();
        this.tapTimes.push(now);
        
        if (this.tapTimes.length > 2) {
            const times = this.tapTimes.slice(-3);
            const average = (times[2] - times[0]) / 2;
            this.bpm = Math.round(60000 / average);
            this.bpm = Math.min(240, Math.max(40, this.bpm));
            this.updateDisplay();
            if (this.isPlaying) this.restart();
        }
    }
}

// Initialisation du métronome
let metronome = null;
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('main.html')) {
        metronome = new Metronome();
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
