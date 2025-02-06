// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"; // Import Firestore modules

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
const db = getFirestore(app);

// --- Répertoire Functionality ---

// Écouteur d'événement pour le formulaire d'ajout de pièce
document.getElementById('addPiece')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêcher la soumission par défaut du formulaire

    const pieceTitle = document.getElementById('pieceTitle').value.trim();
    const composer = document.getElementById('composer').value.trim();
    const pieceType = document.getElementById('pieceType').value;
    const notes = document.getElementById('notes').value.trim();

    if (!pieceTitle || !composer || !pieceType) {
        alert("Veuillez remplir tous les champs obligatoires (Titre, Compositeur, Catégorie).");
        return; // Arrêter la fonction si les champs obligatoires ne sont pas remplis
    }

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("Utilisateur non connecté.");
            return;
        }

        // Ajouter la pièce à Firestore dans la sous-collection "pieces" de l'utilisateur
        await addDoc(collection(db, "users", user.uid, "pieces"), {
            title: pieceTitle,
            composer: composer,
            type: pieceType,
            notes: notes,
            createdAt: new Date() // Ajouter un timestamp pour le tri par défaut
        });

        // Réinitialiser les champs du formulaire après l'ajout
        document.getElementById('pieceTitle').value = '';
        document.getElementById('composer').value = '';
        document.getElementById('pieceType').value = '';
        document.getElementById('notes').value = '';

        // Recharger la liste des pièces pour afficher la nouvelle pièce ajoutée
        loadPiecesList();
        alert("Pièce ajoutée avec succès !");


    } catch (error) {
        console.error("Erreur lors de l'ajout de la pièce à Firestore:", error);
        alert("Erreur lors de l'ajout de la pièce.");
    }
});

// Fonction pour charger et afficher la liste des pièces depuis Firestore
async function loadPiecesList() {
    const piecesListDiv = document.getElementById('piecesList');
    const emptyListMessage = document.getElementById('emptyListMessage');

    piecesListDiv.innerHTML = ''; // Vider la liste actuelle avant de la recharger

    const user = auth.currentUser;
    if (!user) {
        console.error("Utilisateur non connecté.");
        return;
    }

    const piecesRef = collection(db, "users", user.uid, "pieces");
    const q = query(piecesRef, orderBy("createdAt", "desc")); // Trier par date de création, du plus récent au plus ancien

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            emptyListMessage.classList.remove('hidden'); // Afficher le message "liste vide"
        } else {
            emptyListMessage.classList.add('hidden'); // Cacher le message "liste vide" si des pièces existent
            querySnapshot.forEach(doc => {
                const pieceData = doc.data();
                const pieceElement = createPieceElement(doc.id, pieceData); // Créer l'élément HTML pour la pièce
                piecesListDiv.appendChild(pieceElement); // Ajouter l'élément à la liste
            });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des pièces depuis Firestore:", error);
        alert("Erreur lors du chargement du répertoire.");
    }
}

// Fonction pour créer un élément HTML pour afficher une pièce
function createPieceElement(id, data) {
    const pieceCard = document.createElement('div');
    pieceCard.className = 'piece-card bg-white p-6 rounded-2xl shadow-md border-2 border-gray-200 hover:border-purple-300 transition-all transform hover:-translate-y-1 cursor-pointer';
    pieceCard.innerHTML = `
        <h3 class="font-bold text-xl text-purple-700 mb-2">${data.title}</h3>
        <p class="text-gray-600 mb-1">Compositeur: ${data.composer}</p>
        <p class="text-gray-600 mb-3">Catégorie: ${data.type}</p>
        <p class="text-gray-500 text-sm truncate">${data.notes ? data.notes : 'Aucune note'}</p>
        <div class="flex justify-end mt-4">
            <button class="btn-danger btn-small delete-piece-btn" data-id="${id}">🗑️ Supprimer</button>
        </div>
    `;

    // Écouteur d'événement pour le bouton "Supprimer" (délégué)
    pieceCard.querySelector('.delete-piece-btn').addEventListener('click', async (event) => {
        event.stopPropagation(); // Empêcher la propagation de l'événement au parent (pieceCard)
        const pieceIdToDelete = event.target.dataset.id;
        if (confirm("Voulez-vous vraiment supprimer cette pièce de votre répertoire ?")) {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error("Utilisateur non connecté.");
                    return;
                }
                await deleteDoc(doc(db, "users", user.uid, "pieces", pieceIdToDelete));
                loadPiecesList(); // Recharger la liste après suppression
                alert("Pièce supprimée avec succès.");
            } catch (error) {
                console.error("Erreur lors de la suppression de la pièce:", error);
                alert("Erreur lors de la suppression de la pièce.");
            }
        }
    });

    return pieceCard;
}

// Vérifier la session et charger les infos de l'utilisateur
function checkUserSession() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("Utilisateur connecté :", user);
            await loadUserData(user);
            loadPiecesList(); // Charger la liste des pièces après la connexion
        } else {
            console.log("Aucune session trouvée, redirection vers la connexion.");
            window.location.href = "/login.html";
        }
    });
}

// Charger les infos utilisateur dans le profil
async function loadUserData(user) {
    // ... (fonction loadUserData inchangée) ...
     if (!user) return;

    document.getElementById("userEmail").textContent = user.email;

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Récupérer le document Firestore
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById("userFirstName").textContent = userData.firstName || "Prénom inconnu";
            document.getElementById("userLastName").textContent = userData.lastName || "Nom inconnu";
        } else {
            console.log("Document utilisateur non trouvé dans Firestore");
            document.getElementById("userFirstName").textContent = "Prénom inconnu";
            document.getElementById("userLastName").textContent = "Nom inconnu";
        }

    } catch (err) {
        console.error("Erreur lors du chargement des données utilisateur depuis Firestore :", err);
        document.getElementById("userFirstName").textContent = "Prénom inconnu";
        document.getElementById("userLastName").textContent = "Nom inconnu";
    }
}


// Sauvegarder la biographie (COMMENTÉ - inchangé)
document.getElementById("saveBio")?.addEventListener("click", async () => {
    alert("Fonction de sauvegarde de la bio désactivée pour Firebase. À réimplémenter si nécessaire.");
});

// Déconnexion et redirection vers login.html (inchangé)
document.getElementById("logout")?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "/login.html";
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        alert("Erreur lors de la déconnexion.");
    }
});

// Vérifier la session au chargement de l'application (inchangé)
checkUserSession();

// ⏱ MINUTEUR ⏱
let timerInterval;
let timeLeft = 0; // Temps restant en secondes, initialisé à 0

function startTimer() {
    let minutes = parseInt(document.getElementById('minutesInput').value, 10) || 0;
    let seconds = parseInt(document.getElementById('secondsInput').value, 10) || 0;

    // S'assurer que les valeurs sont bien des nombres et dans les limites
    minutes = isNaN(minutes) ? 0 : Math.max(0, Math.min(minutes, 59));
    seconds = isNaN(seconds) ? 0 : Math.max(0, Math.min(seconds, 59));

    timeLeft = minutes * 60 + seconds;

    if (timeLeft <= 0) {
        alert("Veuillez entrer une durée valide (supérieure à 0).");
        return;
    }

    // Désactiver les inputs pendant le compte à rebours
    document.getElementById('minutesInput').disabled = true;
    document.getElementById('secondsInput').disabled = true;


    timerInterval = setInterval(updateTimer, 1000);
    updateDisplay(); // Mise à jour immédiate de l'affichage
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeLeft = 0; // Pour éviter les valeurs négatives
        updateDisplay(); // Mise à jour finale à 00:00
        alert("Temps écoulé !"); // Alerte à la fin du minuteur

        // Réactiver les inputs à la fin du compte à rebours
        document.getElementById('minutesInput').disabled = false;
        document.getElementById('secondsInput').disabled = false;


    } else {
        timeLeft--;
        updateDisplay();
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    // Réactiver les inputs quand on arrête le minuteur
    document.getElementById('minutesInput').disabled = false;
    document.getElementById('secondsInput').disabled = false;
}

function resetTimer() {
    stopTimer();
    document.getElementById('minutesInput').value = '00';
    document.getElementById('secondsInput').value = '00';
    timeLeft = 0; // Réinitialise le temps restant
    updateDisplay();
    // Réactiver les inputs après réinitialisation
    document.getElementById('minutesInput').disabled = false;
    document.getElementById('secondsInput').disabled = false;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('chronoDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => { // Assurer que le DOM est chargé
    document.getElementById('startChrono')?.addEventListener('click', startTimer);
    document.getElementById('stopChrono')?.addEventListener('click', stopTimer);
    document.getElementById('resetChrono')?.addEventListener('click', resetTimer);
});


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

// Navigation entre les onglets (inchangé)
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId)?.classList.add('active');
    document.querySelector(`.tab-button[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

// 🔹 Service Worker pour le PWA (inchangé)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js');
    });
}
