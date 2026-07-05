<?php
// Contact form mailer for the NCMT site.
// Sends via the server's local mailer (no SMTP credentials needed) from
// the site's own domain, so SPF/DKIM stay aligned.

header('Content-Type: application/json');

const MAIL_TO = 'ncmtwa@hotmail.com';
const MAIL_FROM = 'website@ncmt.com.au';
const MIN_INTERVAL_SECONDS = 30;

function fail(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'message' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('Method not allowed', 405);
}

// Honeypot: bots fill the hidden "company" field; pretend success.
if (!empty($_POST['company'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $message === '') {
    fail('Please fill in your name and what you need moved.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail("That email address doesn't look right.");
}
if (strlen($name) > 200 || strlen($email) > 200 || strlen($message) > 5000) {
    fail('That message is too long.');
}

// Strip anything that could inject extra mail headers.
$name = str_replace(["\r", "\n", '"'], '', $name);
$email = str_replace(["\r", "\n"], '', $email);

session_start();
if (isset($_SESSION['last_submit']) && time() - $_SESSION['last_submit'] < MIN_INTERVAL_SECONDS) {
    fail('Hang on a moment before sending again.', 429);
}

$subject = "Quote request from {$name}";
$body = "Name: {$name}\nEmail: {$email}\n\n{$message}\n";
$headers = implode("\r\n", [
    'From: "NCMT Website" <' . MAIL_FROM . '>',
    "Reply-To: \"{$name}\" <{$email}>",
    'Content-Type: text/plain; charset=UTF-8',
]);

if (!mail(MAIL_TO, $subject, $body, $headers, '-f' . MAIL_FROM)) {
    fail('Something went wrong sending your message. Please call or email us directly.', 500);
}

$_SESSION['last_submit'] = time();
echo json_encode(['ok' => true]);
