const supabaseUrl = 'https://efnhqqgddfuxwmnrguns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbmhxcWdkZGZ1eHdtbnJndW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODYyMzUsImV4cCI6MjA1NDE2MjIzNX0.XdVYATptiop5yAUtvPZCWxPo-gcKwYuflvsjvkqEG-w';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signIn({ email, password });
    
    if (error) {
        alert('Erreur d\'authentification');
    } else {
        window.location.href = 'main.html';
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function addPiece() {
    const pieceName = document.getElementById('piece-name').value;
    const pieceList = document.getElementById('piece-list');
    const listItem = document.createElement('li');
    listItem.textContent = pieceName;
    pieceList.appendChild(listItem);
    document.getElementById('piece-name').value = '';
}
