<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Helpers.php';   

function crear_nota() {
    $usuario_id = usuario_autenticado();
    if (!$usuario_id) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        return;
    }
    global $bd;

    $res = $bd->query("SELECT COUNT(*) as total FROM notas WHERE usuario_id = $usuario_id");
    $total_notas = $res->fetchArray(SQLITE3_ASSOC)['total'];
    $es_premium = usuario_es_pago($usuario_id);

    if (!$es_premium && $total_notas >= 10) {
        http_response_code(402);
        echo json_encode(['error' => 'Límite de 10 notas gratis alcanzado. Debes pagar.', 'limite' => 10, 'creadas' => $total_notas]);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $titulo = $bd->escapeString($data['titulo']);
    $contenido = $bd->escapeString($data['contenido'] ?? '');
    $es_favorito = isset($data['es_favorito']) ? (int)$data['es_favorito'] : 0;

    $color = '#ffffff';
    $plantilla = 'apuntes';
    $fecha_evento = 'NULL';

    if ($es_premium) {
        $colores_permitidos = ['#ffffff', '#fef08a', '#bfdbfe'];
        $plantillas_permitidas = ['apuntes', 'diario', 'tareas', 'proyectos'];

        $color_input = $data['color'] ?? '#ffffff';
        $color = in_array($color_input, $colores_permitidos) ? $color_input : '#ffffff';

        $plantilla_input = $data['plantilla'] ?? 'apuntes';
        $plantilla = in_array($plantilla_input, $plantillas_permitidas) ? $plantilla_input : 'apuntes';

        if (isset($data['fecha_evento']) && !empty($data['fecha_evento'])) {
            $fecha_evento = "'" . $bd->escapeString($data['fecha_evento']) . "'";
        }
    }

    $bd->exec("INSERT INTO notas (usuario_id, titulo, contenido, es_favorito, color, plantilla, fecha_evento) 
               VALUES ($usuario_id, '$titulo', '$contenido', $es_favorito, '$color', '$plantilla', $fecha_evento)");
    echo json_encode(['exito' => true, 'id' => $bd->lastInsertRowID()]);
}

function listar_notas() {
    $usuario_id = usuario_autenticado();
    if (!$usuario_id) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        return;
    }
    global $bd;
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
    $usuario_id = usuario_autenticado();
    if (!$usuario_id) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        return;
    }
    global $bd;
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id']);
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
        $colores_permitidos = ['#ffffff', '#fef08a', '#bfdbfe'];
        $plantillas_permitidas = ['apuntes', 'diario', 'tareas', 'proyectos'];

        if (isset($data['color'])) {
            $color = in_array($data['color'], $colores_permitidos) ? $data['color'] : '#ffffff';
            $updates[] = "color = '$color'";
        }
        if (isset($data['plantilla'])) {
            $plantilla = in_array($data['plantilla'], $plantillas_permitidas) ? $data['plantilla'] : 'apuntes';
            $updates[] = "plantilla = '$plantilla'";
        }
        if (isset($data['fecha_evento'])) {
            $fecha = $data['fecha_evento'] ? "'{$bd->escapeString($data['fecha_evento'])}'" : 'NULL';
            $updates[] = "fecha_evento = $fecha";
        }
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
    $usuario_id = usuario_autenticado();
    if (!$usuario_id) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        return;
    }
    global $bd;
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id']);
    $bd->exec("DELETE FROM notas WHERE id = $id AND usuario_id = $usuario_id");
    echo json_encode(['exito' => true]);
}
?>