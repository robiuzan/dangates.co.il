<?php
/**
 * lead.php — דן שערים חשמליים (Dan Electric Gates) lead/quote form handler.
 *
 * NOTE: the deploy target is GitHub Pages (no PHP), so this handler does NOT run there —
 * the front-end LeadForm gracefully falls back to WhatsApp. It is kept for portability
 * (any PHP-capable host would use it to email the lead to the business).
 *
 * 🔶 Confirm the destination mailbox below EXISTS (or forwards). If info@dangates.co.il
 *    is not a real mailbox on this account, change $TO to one that is.
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$TO   = 'info@dangates.co.il';        // 🔶 confirm this mailbox receives/forwards
$FROM = 'noreply@dangates.co.il';     // must be on a domain hosted on this server
$SITE = 'דן שערים חשמליים';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Honeypot: real users never fill 'company'. Pretend success so bots don't probe.
if (trim((string)($_POST['company'] ?? '')) !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name    = trim((string)($_POST['name'] ?? ''));
$phone   = trim((string)($_POST['phone'] ?? ''));
$service = trim((string)($_POST['service'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $phone === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'missing_fields']);
    exit;
}

// Sanitize / cap lengths. Fields go in the body (not headers) so no injection risk.
$name    = mb_substr($name, 0, 100);
$phone   = mb_substr(preg_replace('/[^\d+\-\s()]/u', '', $phone), 0, 30);
$service = mb_substr($service, 0, 120);
$message = mb_substr($message, 0, 2000);

$lines = ["התקבלה פנייה חדשה מאתר $SITE:", '', "שם: $name", "טלפון: $phone"];
if ($service !== '') { $lines[] = "שירות: $service"; }
if ($message !== '') { $lines[] = ''; $lines[] = 'הודעה:'; $lines[] = $message; }
$body = implode("\n", $lines);

$subject = '=?UTF-8?B?' . base64_encode("פנייה חדשה מהאתר - $SITE") . '?=';
$headers = implode("\r\n", [
    "From: $SITE <$FROM>",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
]);

if (@mail($TO, $subject, $body, $headers)) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}
