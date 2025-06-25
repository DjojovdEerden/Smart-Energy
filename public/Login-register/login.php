<?php
require 'DBconnect.php';
session_start();

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (!$username || !$password) {
    die("Vul beide velden in.");
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['User_id'];
    $_SESSION['username'] = $user['username'];
    header("Location: ../dashboard.php");
    exit();
} else {
    echo "❌ Ongeldige gebruikersnaam of wachtwoord.";
}

