// Initialisation du client Supabase
const supabaseUrl = 'https://efnhqqgddfuxwmnrguns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbmhxcWdkZGZ1eHdtbnJndW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODYyMzUsImV4cCI6MjA1NDE2MjIzNX0.XdVYATptiop5yAUtvPZCWxPo-gcKwYuflvsjvkqEG-w';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Vérifier la session et charger les infos de l'utilisateur
async function checkUserSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Erreur de récupération de la session :", error);
        return;
    }

    if (session) {
        console.log("Utilisateur connecté :", session.user);
        loadUserData(session.user);
    } else {
        console.log("Aucune session trouvée, redirection vers la connexion.");
        window.location.href = "/login.html";
    }
}

// Charger les infos utilisateur dans le profil
async function loadUserData(user) {
    if (!user) return;

    document.getElementById("userName").textContent = user.user_metadata?.full_name || "Nom inconnu";
    document.getElementById("userEmail").textContent = user.email;

    try {
        const { data, error } = await supabase
            .from("users")
            .select("bio")
            .eq("id", user.id)
            .single();

        if (error) throw error;

        if (data && data.bio) {
            document.getElementById("userBio").value = data.bio;
        }
    } catch (err) {
        console.error("Erreur lors du chargement de la bio :", err);
    }
}

// Sauvegarder la biographie
document.getElementById("saveBio")?.addEventListener("click", async () => {
    const bio = document.getElementById("userBio").value;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return;

    try {
        const { error } = await supabase
            .from("users")
            .update({ bio })
            .eq("id", session.user.id);

        if (error) throw error;

        alert("Biographie enregistrée !");
    } catch (err) {
        alert("Erreur lors de la sauvegarde de la bio : " + err.message);
    }
});

// Déconnexion et redirection vers login.html
document.getElementById("logout")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("supabaseSession"); // Supprime la session locale
    window.location.href = "/login.html"; // Redirection après déconnexion
});

// Vérifier la session au chargement de l'application
checkUserSession();

// 🎵 MÉTRONOME 🎵
class Metronome {
    constructor() {
        this.isPlaying = false;
        this.bpm = 120;
        this.timer = null;
        this.tapTimes = [];
        this.audioContext = null;
        this.gainNode = null;

        this.initAudio();
        this.initControls();
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
    }

    initControls() {
        document.getElementById('bpmRange')?.addEventListener('input', (e) => {
            this.bpm = parseInt(e.target.value);
            this.updateDisplay();
            if (this.isPlaying) this.restart();
        });

        document.getElementById('bpmUp')?.addEventListener('click', () => {
            this.bpm = Math.min(240, this.bpm + 1);
            this.updateDisplay();
            if (this.isPlaying) this.restart();
        });

        document.getElementById('bpmDown')?.addEventListener('click', () => {
            this.bpm = Math.max(40, this.bpm - 1);
            this.updateDisplay();
            if (this.isPlaying) this.restart();
        });

        document.getElementById('startStop')?.addEventListener('click', () => {
            this.isPlaying ? this.stop() : this.start();
        });

        document.getElementById('tapTempo')?.addEventListener('click', () => {
            this.handleTapTempo();
        });
    }

    updateDisplay() {
        document.getElementById('bpmValue').textContent = this.bpm;
        document.getElementById('bpmRange').value = this.bpm;
    }

    playClick() {
        const osc = this.audioContext.createOscillator();
        osc.connect(this.gainNode);
        osc.frequency.value = 1000;

        const now = this.audioContext.currentTime;
        osc.start(now);
        osc.stop(now + 0.1);

        const indicator = document.querySelector('.beat-indicator');
        indicator.classList.add('active');
        setTimeout(() => indicator.classList.remove('active'), 100);
    }

    start() {
        this.isPlaying = true;
        document.getElementById('startStop').textContent = 'Arrêter';
        this.audioContext.resume();
        this.scheduleClick();
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
        this.playClick();
        this.timer = setTimeout(() => this.scheduleClick(), 60000 / this.bpm);
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
    if (document.getElementById('bpmValue')) {
        metronome = new Metronome();
    }
});

// Navigation entre les onglets
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId)?.classList.add('active');
    event.target.classList.add('active');
}

// 🔹 Service Worker pour le PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js');
    });
}
