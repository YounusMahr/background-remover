<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';

echo json_encode(get_settings(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
