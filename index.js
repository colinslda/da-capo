// Initialize Supabase
const supabaseUrl = 'https://efnhqqgddfuxwmnrguns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbmhxcWdkZGZ1eHdtbnJndW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODYyMzUsImV4cCI6MjA1NDE2MjIzNX0.XdVYATptiop5yAUtvPZCWxPo-gcKwYuflvsjvkqEG-w';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Handle form submission
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        alert('Login failed: ' + error.message);
    } else {
        window.location.href = 'main.html';
    }
});
