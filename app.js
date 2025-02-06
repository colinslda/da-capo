// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJFjq6AA-30mrI5Yagpy0n11fk6Wceo0k",
    authDomain: "dacapo-4e852.firebaseapp.com",
    projectId: "dacapo-4e852",
    storageBucket: "dacapo-4e852.firebasestorage.app",
    messagingSenderId: "68504525719",
    appId: "1:68504525719:web:65794607064db1fff9c2d2",
    measurementId: "G-58VM0TCQ1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Vérifier la session et charger les infos de l'utilisateur
function checkUserSession() {
    onAuthStateChanged(auth, (user) => { // Ajout de 'auth' ici
        if (user) {
            // Utilisateur connecté
            console.log("Utilisateur connecté :", user);
            loadUserData(user);
        } else {
            // Utilisateur non connecté
            console.log("Aucune session trouvée, redirection vers la connexion.");
            window.location.href = "/login.html";
        }
    });
}

// Charger les infos utilisateur dans le profil
async function loadUserData(user) {
    if (!user) return;

    document.getElementById("userName").textContent = user.displayName || "Nom inconnu";
    document.getElementById("userEmail").textContent = user.email;

    // La partie concernant la bio Supabase est commentée car elle n'est plus pertinente avec Firebase Auth directement.
    // Si vous souhaitez gérer la bio des utilisateurs avec Firebase, il faudra adapter cette partie (ex: Firestore).

    // try {
    //     const { data, error } = await supabase
    //         .from("users")
    //         .select("bio")
    //         .eq("id", user.id)
    //         .single();

    //     if (error) throw error;

    //     if (data && data.bio) {
    //         document.getElementById("userBio").value = data.bio;
    //     }
    // } catch (err) {
    //     console.error("Erreur lors du chargement de la bio :", err);
    // }
}

// Sauvegarder la biographie (COMMENTÉ - à adapter si nécessaire pour Firebase)
document.getElementById("saveBio")?.addEventListener("click", async () => {
    // Cette partie est commentée car elle dépendait de Supabase.
    // Il faudra adapter la logique de sauvegarde de la bio si vous souhaitez la conserver avec Firebase.
    alert("Fonction de sauvegarde de la bio désactivée pour Firebase. À réimplémenter si nécessaire.");

    // const bio = document.getElementById("userBio").value;
    // const { data: { session } } = await supabase.auth.getSession();

    // if (!session) return;

    // try {
    //     const { error } = await supabase
    //         .from("users")
    //         .update({ bio })
    //         .eq("id", session.user.id);

    //     if (error) throw error;

    //     alert("Biographie enregistrée !");
    // } catch (err) {
    //     alert("Erreur lors de la sauvegarde de la bio : " + err.message);
    // }
});

// Déconnexion et redirection vers login.html
document.getElementById("logout")?.addEventListener("click", async () => {
    try {
        await signOut(auth); // Ajout de 'auth' ici
        // Déconnexion réussie
        window.location.href = "/login.html";
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        alert("Erreur lors de la déconnexion.");
    }
});

// Vérifier la session au chargement de l'application
checkUserSession();

// ⏱ MINUTEUR ⏱
let timerInterval;
let timeLeft; // Temps restant en secondes

function startTimer() {
    const minutes = parseInt(document.getElementById('minutesInput').value, 10) || 0;
    const seconds = parseInt(document.getElementById('secondsInput').value, 10) || 0;
    timeLeft = minutes * 60 + seconds;

    if (timeLeft <= 0) {
        alert("Veuillez entrer une durée valide.");
        return;
    }

    timerInterval = setInterval(updateTimer, 1000);
    updateDisplay(); // Mise à jour immédiate de l'affichage
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeLeft = 0; // Pour éviter les valeurs négatives
        alert("Temps écoulé !"); // Optionnel: Jouer un son, changer l'affichage, etc.
    } else {
        timeLeft--;
    }
    updateDisplay();
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    document.getElementById('minutesInput').value = '00';
    document.getElementById('secondsInput').value = '00';
    timeLeft = 0; // Réinitialise le temps restant
    updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('chronoDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


document.getElementById('startChrono')?.addEventListener('click', startTimer);
document.getElementById('stopChrono')?.addEventListener('click', stopTimer);
document.getElementById('resetChrono')?.addEventListener('click', resetTimer);

// 🎵 MÉTRONOME 🎵 (Le reste de votre code métronome reste inchangé, il n'est pas lié à l'authentification)
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
        document.getElementById('tempoPercent').textContent = Math.round(((this.bpm - 40) / (240 - 40)) * 100) + '%'; // Pourcentage
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
