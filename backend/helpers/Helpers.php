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
?>