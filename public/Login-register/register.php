<?php
require 'DBconnect.php';

$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$username || !$email || !$password) {
    die("Vul alle velden in.");
}

// Hash het wachtwoord
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Voeg user toe
$stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
$stmt->execute([
    ':username' => $username,
    ':email' => $email,
    ':password' => $hashedPassword,
]);

echo "✅ Registration succesvol.";
echo '<meta http-equiv="refresh" content="2;url=login.html">';

