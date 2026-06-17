<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5175';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$uri = $_SERVER['REQUEST_URI'];
$uri = strtok($uri, '?');
// Quitar el prefijo /api si el backend está en una subcarpeta
if (strpos($uri, '/api') === 0) {
    $uri = substr($uri, 4);
}
if ($uri === '') $uri = '/';

if ($uri === '/registrar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../controllers/AuthController.php';
    registrar();
    exit;
}

if ($uri === '/sesion' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../controllers/AuthController.php';
    sesion();
    exit;
}

if ($uri === '/nota/crear' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../controllers/NotaController.php';
    crear_nota();
    exit;
}

if ($uri === '/notas' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/../controllers/NotaController.php';
    listar_notas();
    exit;
}

if ($uri === '/nota/actualizar' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
    require_once __DIR__ . '/../controllers/NotaController.php';
    actualizar_nota();
    exit;
}

if ($uri === '/nota/eliminar' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_once __DIR__ . '/../controllers/NotaController.php';
    eliminar_nota();
    exit;
}

if ($uri === '/pagar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../controllers/PagoController.php';
    pagar();
    exit;
}

if ($uri === '/es-premium' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/../controllers/PagoController.php';
    es_premium();
    exit;
}

if ($uri === '/logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../controllers/AuthController.php';
    cerrar_sesion();
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Ruta no encontrada']);
?>