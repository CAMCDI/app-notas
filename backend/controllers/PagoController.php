<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Helpers.php';  

function pagar() {
    $usuario_id = usuario_autenticado();
    if (!$usuario_id) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        return;
    }
    global $bd;
    $monto = 199.99;
    $bd->exec("INSERT INTO pagos (usuario_id, monto, estado) VALUES ($usuario_id, $monto, 'completado')");
    echo json_encode(['exito' => true, 'mensaje' => 'Pago simulado correctamente. Eres premium.']);
}

function es_premium() {
    $usuario_id = usuario_autenticado();
    if (!$usuario_id) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        return;
    }
    echo json_encode(['premium' => usuario_es_pago($usuario_id)]);
}
?>