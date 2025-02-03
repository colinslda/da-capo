<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DA CAPO - Nouveau compte</title>
  <link rel="manifest" href="manifest.json">
  <link rel="stylesheet" href="styles.css">
  <!-- Import de la bibliothèque SupaBase -->
  <script src="https://unpkg.com/@supabase/supabase-js@1.35.7/dist/supabase.min.js" type="text/javascript"></script>
</head>
<body>
  <div class="auth-container">
    <h1>DA CAPO - Nouveau compte</h1>
    <form id="signup-form">
      <input type="text" id="first-name" placeholder="Prénom" required>
      <input type="text" id="last-name" placeholder="Nom" required>
      <input type="email" id="email" placeholder="Adresse mail" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button type="submit">Créer un compte</button>
    </form>
    <p id="error-message"></p>
  </div>
  <script src="signup.js"></script>
</body>
</html>
