<?php
/**
 * GitHub Webhook Handler for Automatic Deployment
 * Place this file in: /home/inmoti87/pennkraft.com/public_html/deploy-webhook.php
 * Webhook URL: https://pennkraft.com/deploy-webhook.php
 */

// Configuration
$secret = 'your-webhook-secret-here'; // CHANGE THIS! Use a strong secret
$deploy_script = '/home/inmoti87/deploy.sh';
$log_file = '/home/inmoti87/logs/webhook.log';

// Ensure log directory exists
if (!file_exists(dirname($log_file))) {
    mkdir(dirname($log_file), 0755, true);
}

// Function to log messages
function logMessage($message) {
    global $log_file;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($log_file, "[$timestamp] $message\n", FILE_APPEND);
}

// Get headers and payload
$headers = getallheaders();
$payload = file_get_contents('php://input');

// Log the webhook request
logMessage("Webhook received from IP: " . $_SERVER['REMOTE_ADDR']);

// Verify this is from GitHub
if (!isset($headers['X-Hub-Signature-256'])) {
    logMessage("Error: Missing GitHub signature header");
    http_response_code(401);
    die('Unauthorized');
}

// Verify the webhook secret
$signature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
if (!hash_equals($signature, $headers['X-Hub-Signature-256'])) {
    logMessage("Error: Invalid signature");
    http_response_code(401);
    die('Unauthorized');
}

// Parse the payload
$data = json_decode($payload, true);

// Check if this is a push to main branch
if ($data['ref'] !== 'refs/heads/main') {
    logMessage("Skipping: Not a push to main branch (ref: " . $data['ref'] . ")");
    http_response_code(200);
    die('Not main branch');
}

// Log deployment trigger
logMessage("Deployment triggered by: " . $data['pusher']['name']);
logMessage("Commit: " . $data['head_commit']['id']);
logMessage("Message: " . $data['head_commit']['message']);

// Execute deployment script in background
$command = "nohup /bin/bash $deploy_script > /home/inmoti87/logs/deploy-output.log 2>&1 &";
exec($command, $output, $return_var);

if ($return_var === 0) {
    logMessage("Deployment script started successfully");
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Deployment started']);
} else {
    logMessage("Error: Failed to start deployment script (exit code: $return_var)");
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Deployment failed to start']);
}

// Send notification email (optional)
$to = 'ipenn@pennkraft.com';
$subject = 'Pennkraft Portal Deployment Started';
$message = "Deployment triggered by: " . $data['pusher']['name'] . "\n";
$message .= "Commit: " . $data['head_commit']['message'] . "\n";
$message .= "Time: " . date('Y-m-d H:i:s') . "\n";
$headers_mail = 'From: noreply@pennkraft.com' . "\r\n" .
    'Reply-To: noreply@pennkraft.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

// Uncomment to enable email notifications
// mail($to, $subject, $message, $headers_mail);

?>