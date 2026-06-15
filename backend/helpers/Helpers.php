<?php
function usuario_autenticado() {
    session_start();
    return $_SESSION['usuario_id'] ?? 0;
}

function usuario_es_pago($usuario_id) {
    global $bd;
    $res = $bd->query("SELECT COUNT(*) as pagado FROM pagos WHERE usuario_id = $usuario_id AND estado = 'completado'");
    $fila = $res->fetchArray(SQLITE3_ASSOC);
    return $fila ? $fila['pagado'] > 0 : false;
}

function requerir_autenticacion() {
    $id = usuario_autenticado();
    if (!$id) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        exit;
    }
    return $id;
}

function leer_json() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function validar_datos_premium($data, $bd) {
    $colores_permitidos = ['#ffffff', '#fef08a', '#bfdbfe'];
    $plantillas_permitidas = ['apuntes', 'diario', 'tareas', 'proyectos'];

    $color = in_array($data['color'] ?? '', $colores_permitidos) ? $data['color'] : '#ffffff';
    $plantilla = in_array($data['plantilla'] ?? '', $plantillas_permitidas) ? $data['plantilla'] : 'apuntes';
    $fecha_evento = !empty($data['fecha_evento']) ? "'" . $bd->escapeString($data['fecha_evento']) . "'" : 'NULL';

    return [$color, $plantilla, $fecha_evento];
}
?>