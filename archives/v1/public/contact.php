<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://julienbourcet.fr');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$config = __DIR__ . '/.smtp-config.php';
if (!file_exists($config)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration missing']);
    exit;
}
require_once $config;

// ── Validation ────────────────────────────────────────────────────────────────
$data    = json_decode(file_get_contents('php://input'), true);
$name    = htmlspecialchars(strip_tags(trim($data['name']    ?? '')));
$email   = filter_var(trim($data['email']   ?? ''), FILTER_VALIDATE_EMAIL);
$message = htmlspecialchars(strip_tags(trim($data['message'] ?? '')));

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Champs manquants ou invalides']);
    exit;
}

// ── Envoi SMTP (STARTTLS port 587) ────────────────────────────────────────────
function smtp_send(string $to, string $from, string $fromName, string $subject, string $body): bool
{
    $socket = @stream_socket_client('tcp://' . SMTP_HOST . ':' . SMTP_PORT, $errno, $errstr, 15);
    if (!$socket) return false;

    $r = fn() => fgets($socket, 512);
    $w = fn(string $cmd) => fwrite($socket, $cmd . "\r\n");

    $r(); // 220 greeting

    $w('EHLO julienbourcet.fr');
    while (($line = $r()) && substr($line, 3, 1) !== ' ') {}

    $w('STARTTLS');
    $r(); // 220 Go ahead

    stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

    $w('EHLO julienbourcet.fr');
    while (($line = $r()) && substr($line, 3, 1) !== ' ') {}

    $w('AUTH LOGIN');
    $r();
    $w(base64_encode(SMTP_USER));
    $r();
    $w(base64_encode(SMTP_PASS));
    $resp = $r();
    if (substr(trim($resp), 0, 3) !== '235') {
        fclose($socket);
        return false;
    }

    $w("MAIL FROM:<{$from}>");
    $r();
    $w("RCPT TO:<{$to}>");
    $r();
    $w('DATA');
    $r();

    $headers  = "From: {$fromName} <{$from}>\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "To: <{$to}>\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "MIME-Version: 1.0\r\n";

    $w($headers . "\r\n" . $body . "\r\n.");
    $r();
    $w('QUIT');
    fclose($socket);
    return true;
}

$subject = 'Portfolio — message de ' . $name;
$body    = "Nom : {$name}\nEmail : {$email}\n\nMessage :\n{$message}";

$ok = smtp_send(SMTP_TO, SMTP_USER, 'Portfolio julienbourcet.fr', $subject, $body);

ob_clean();
http_response_code($ok ? 200 : 500);
echo json_encode(['success' => $ok]);
