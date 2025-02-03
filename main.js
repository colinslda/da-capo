document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(button.dataset.tab).classList.add('active');
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
    if (isNaN(bpm) || bpm <= 0) return;
    const interval = 60000 / bpm;

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    metronomeInterval = setInterval(() => {
      playClick();
      beatIndicator.classList.add('beat');
      setTimeout(() => beatIndicator.classList.remove('beat'), interval / 2);
    }, interval);
  });

  stopBtn.addEventListener('click', () => clearInterval(metronomeInterval));

  function playClick() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.frequency.value = 1000;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }
});
