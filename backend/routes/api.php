<?php 

header("Access-control-Allow-Origin: http//localhost:5172");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$uri = $_SERVER['REQUEST_URI'];
$uri = strtok($uri, '?');

if ($uri === '/registrar' && $_SERVER['REQUEST_METHOD'] === 'POST'){
    require_once __DIR__ .'/../controllers/AuthController.php';
    registrar();
    exit;

} 

http_response_code(404);
echo json_encode(['error' => 'Ruta no encontrada']);


?>