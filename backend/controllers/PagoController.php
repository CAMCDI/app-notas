<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Helpers.php';

$dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$stripeKey = $_ENV['STRIPE_SECRET_KEY'] ?? getenv('STRIPE_SECRET_KEY') ?? '';
\Stripe\Stripe::setApiKey($stripeKey);

function pagar() {
    $usuario_id = requerir_autenticacion();
    $input = leer_json();
    $token = $input['stripeToken'] ?? null;

    if (!$token) {
        http_response_code(400);
        echo json_encode(['error' => 'Token de tarjeta no proporcionado']);
        return;
    }

    try {

        $charge = \Stripe\Charge::create([
            'amount' => 999,
            'currency' => 'usd',
            'source' => $token,
            'description' => 'Premium para usuario ' . $usuario_id
        ]);

     
        global $bd;
        $bd->exec("INSERT INTO pagos (usuario_id, monto, estado) VALUES ($usuario_id, 9.99, 'completado')");

        echo json_encode([
            'exito' => true,
            'mensaje' => '¡Pago exitoso! Ahora eres premium.',
            'charge_id' => $charge->id
        ]);
    } catch (\Stripe\Exception\CardException $e) {
        http_response_code(402);
        echo json_encode(['error' => 'Tarjeta rechazada: ' . $e->getMessage()]);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error en el servidor de pagos: ' . $e->getMessage()]);
    }
}

function es_premium() {
    $usuario_id = requerir_autenticacion();
    echo json_encode(['premium' => usuario_es_pago($usuario_id)]);
}
?>