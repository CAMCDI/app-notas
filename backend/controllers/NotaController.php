<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Helpers.php';   

function crear_nota() {
    global $bd;
    $usuario_id = requerir_autenticacion();

    $res = $bd->query("SELECT COUNT(*) as total FROM notas WHERE usuario_id = $usuario_id");
    $total_notas = $res->fetchArray(SQLITE3_ASSOC)['total'];
    $es_premium = usuario_es_pago($usuario_id);

    if (!$es_premium && $total_notas >= 5) {
        http_response_code(402);
        echo json_encode(['error' => 'Límite de 5 notas gratis alcanzado. Debes pagar.', 'limite' => 5, 'creadas' => $total_notas]);
        return;
    }

    $data = leer_json();
    $titulo = $bd->escapeString($data['titulo'] ?? '');
    $contenido = $bd->escapeString($data['contenido'] ?? '');
    $es_favorito = isset($data['es_favorito']) ? (int)$data['es_favorito'] : 0;

    $color = '#ffffff';
    $plantilla = 'apuntes';
    $fecha_evento = 'NULL';

    if ($es_premium) {
        list($color, $plantilla, $fecha_evento) = validar_datos_premium($data, $bd);
    }

    $bd->exec("INSERT INTO notas (usuario_id, titulo, contenido, es_favorito, color, plantilla, fecha_evento) 
               VALUES ($usuario_id, '$titulo', '$contenido', $es_favorito, '$color', '$plantilla', $fecha_evento)");
    echo json_encode(['exito' => true, 'id' => $bd->lastInsertRowID()]);
}

function listar_notas() {
    global $bd;
    $usuario_id = requerir_autenticacion();

    $res = $bd->query("SELECT id, titulo, contenido, creado_en, actualizado_en, es_favorito, color, plantilla, fecha_evento 
                       FROM notas WHERE usuario_id = $usuario_id 
                       ORDER BY es_favorito DESC, actualizado_en DESC");
    $notas = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $notas[] = $row;
    }
    echo json_encode($notas);
}

function actualizar_nota() {
    global $bd;
    $usuario_id = requerir_autenticacion();
    $data = leer_json();
    $id = intval($data['id'] ?? 0);
    $es_premium = usuario_es_pago($usuario_id);

    $updates = [];
    if (isset($data['titulo'])) {
        $updates[] = "titulo = '{$bd->escapeString($data['titulo'])}'";
    }
    if (isset($data['contenido'])) {
        $updates[] = "contenido = '{$bd->escapeString($data['contenido'])}'";
    }
    if (isset($data['es_favorito'])) {
        $updates[] = "es_favorito = " . (int)$data['es_favorito'];
    }

    if ($es_premium) {
        list($color, $plantilla, $fecha_evento) = validar_datos_premium($data, $bd);
        
        if (isset($data['color'])) $updates[] = "color = '$color'";
        if (isset($data['plantilla'])) $updates[] = "plantilla = '$plantilla'";
        if (array_key_exists('fecha_evento', $data)) $updates[] = "fecha_evento = $fecha_evento";
    }

    if (empty($updates)) {
        echo json_encode(['exito' => false, 'error' => 'No hay datos para actualizar']);
        return;
    }
    $updates_str = implode(', ', $updates);
    $bd->exec("UPDATE notas SET $updates_str, actualizado_en = CURRENT_TIMESTAMP WHERE id = $id AND usuario_id = $usuario_id");
    echo json_encode(['exito' => true, 'filas_afectadas' => $bd->changes()]);
}

function eliminar_nota() {
    global $bd;
    $usuario_id = requerir_autenticacion();
    $data = leer_json();
    $id = intval($data['id'] ?? 0);
    
    $bd->exec("DELETE FROM notas WHERE id = $id AND usuario_id = $usuario_id");
    echo json_encode(['exito' => true]);
}
?>