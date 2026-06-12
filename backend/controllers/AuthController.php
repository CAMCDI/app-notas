<?php
require_once __DIR__.'/../config/database.php';

function registrar(){
    global $bd;
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data['nombre'] || !$data['correo'] || !$data['password']){
        http_response_code(400);
        echo json_encode(['error'=> 'Faltaa nombre, correo o password']);
        return;
    }
    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $bd->prepare("INSERT INTO usuarios (nombre,correo,password) VALUES (:n, :c, :p)");
    $stmt-> bindValue(':n',$data['nombre'], SQLITE3_TEXT);
    $stmt-> bindValue(':c',$data['correo'], SQLITE3_TEXT);
    $stmt-> bindValue(':p',$data['password'], SQLITE3_TEXT);

    echo $stmt->execute()? json_encode(['exito'=> true]) :json_encode(['error' => 'No se pudo registar']);
}   

?>