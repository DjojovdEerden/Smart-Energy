<?php
$pdo = new PDO("mysql:host=localhost;dbname=sed", "username", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
