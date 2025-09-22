<?php
// Test file to verify portal routing
// Upload to: /home/inmoti87/pennkraft.com/public_html/portal-test.php
// Access at: https://www.pennkraft.com/portal-test.php

echo "<h1>Portal Routing Test</h1>";
echo "<p>If you can see this, PHP and routing are working.</p>";
echo "<hr>";

// Check if Node.js app is accessible
$nodeUrl = "http://127.0.0.1:30000/"; // Replace with your port
$ch = curl_init($nodeUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<h2>Node.js App Status:</h2>";
if ($httpCode == 200) {
    echo "<p style='color:green'>✅ Node.js app is responding on port 30000</p>";
    echo "<p>Response preview: " . substr(htmlspecialchars($response), 0, 200) . "...</p>";
} else {
    echo "<p style='color:red'>❌ Node.js app is not responding on port 30000</p>";
    echo "<p>HTTP Code: $httpCode</p>";
    echo "<p>You may need to check the port number in cPanel.</p>";
}

// Show server info
echo "<hr><h2>Server Info:</h2>";
echo "<p>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p>Script Filename: " . $_SERVER['SCRIPT_FILENAME'] . "</p>";
echo "<p>Request URI: " . $_SERVER['REQUEST_URI'] . "</p>";
?>