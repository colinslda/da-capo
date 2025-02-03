document.addEventListener('DOMContentLoaded', () => {
  // Gestion de la navigation par onglets
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      document.getElementById(tab).classList.add('active');
    });
  });
  
  // Gestion du Répertoire
  const pieceForm = document.getElementById('piece-form');
  const piecesList = document.getElementById('pieces-list');
  
  pieceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('piece-title');
    const title = titleInput.value.trim();
    if(title === "") return;
    
    const li = document.createElement('li');
    li.classList.add('piece-item');
    li.innerHTML = `<span class="piece-title">${title}</span>
                    <button class="toggle-notes">Notes</button>
                    <div class="notes-section" style="display:none;">
                      <form class="note-form">
                        <input type="text" class="note-input" placeholder="Ajouter une note" required>
                        <button type="submit">Ajouter</button>
                      </form>
                      <ul class="notes-list"></ul>
                    </div>`;
    piecesList.appendChild(li);
    titleInput.value = "";
    
    // Afficher/masquer la section notes
    li.querySelector('.toggle-notes').addEventListener('click', () => {
      const notesSection = li.querySelector('.notes-section');
      notesSection.style.display = (notesSection.style.display === "none") ? "block" : "none";
    });
    
    // Ajout d'une note pour la pièce
    li.querySelector('.note-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const noteInput = li.querySelector('.note-input');
      const noteText = noteInput.value.trim();
      if(noteText === "") return;
      const noteItem = document.createElement('li');
      noteItem.textContent = noteText;
      li.querySelector('.notes-list').appendChild(noteItem);
      noteInput.value = "";
    });
  });
  
  // Gestion du Métronome
  let metronomeInterval;
  const startBtn = document.getElementById('start-metronome');
  const stopBtn = document.getElementById('stop-metronome');
  const bpmInput = document.getElementById('bpm');
  const beatIndicator = document.getElementById('metronome-beat');
  
  let audioContext;
  
  startBtn.addEventListener('click', () => {
    const bpm = parseInt(bpmInput.value);
    if(isNaN(bpm) || bpm <= 0) return;
    const interval = 60000 / bpm; // intervalle en millisecondes
    
    if(!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    metronomeInterval = setInterval(() => {
      playClick();
      beatIndicator.classList.add('beat');
      setTimeout(() => {
        beatIndicator.classList.remove('beat');
      }, interval / 2);
    }, interval);
  });
  
  stopBtn.addEventListener('click', () => {
    clearInterval(metronomeInterval);
  });
  
  function playClick() {
    if(!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 1000; // fréquence du clic
    gainNode.gain.value = 1;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }
});
