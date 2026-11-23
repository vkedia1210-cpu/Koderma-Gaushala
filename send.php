<?php
/**
 * Receives the website forms. Each message is saved to kg-enquiries/enquiries.csv
 * (outside the public folder when the server allows it), emailed if config.php has an
 * address, and the sender is offered a button to send the same message on WhatsApp.
 */
$cfg = require __DIR__ . '/config.php';

function kg_h( $s ) {
	return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' );
}
function kg_clean( $s, $max = 2000 ) {
	$s = trim( strip_tags( (string) $s ) );
	$s = preg_replace( '/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $s );
	return mb_substr( $s, 0, $max );
}

if ( 'POST' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) {
	header( 'Location: /' );
	exit;
}

$labels = array(
	'contact' => 'Message', 'visit' => 'Visit request', 'puja' => 'Puja booking', 'celebrate' => 'Celebration enquiry',
	'volunteer' => 'Volunteer', 'report' => 'Cow in need', 'order' => 'Product order', 'csr' => 'CSR enquiry', 'seva' => 'Seva details',
);
$names = array(
	'name' => 'Name', 'phone' => 'Mobile', 'email' => 'Email', 'date' => 'Date', 'group' => 'Group / school', 'occasion' => 'Occasion',
	'mode' => 'In person / on behalf', 'guests' => 'Guests', 'availability' => 'Availability', 'skills' => 'How to help', 'location' => 'Location',
	'message' => 'Message', 'product' => 'Product', 'address' => 'Address', 'organisation' => 'Organisation', 'amount' => 'Amount (Rs)',
	'reference' => 'UTR / reference', 'for_date' => 'Seva date',
);

$type   = preg_replace( '/[^a-z]/', '', strtolower( $_POST['kg_type'] ?? 'contact' ) );
$type   = isset( $labels[ $type ] ) ? $type : 'contact';
$scheme = kg_clean( $_POST['kg_scheme'] ?? '', 120 );
$back   = $_POST['kg_back'] ?? '/';
$back   = ( is_string( $back ) && preg_match( '#^/[a-z0-9\-/]*$#', $back ) ) ? $back : '/';
$ts     = (string) ( $_POST['kg_ts'] ?? '' );
$sig    = (string) ( $_POST['kg_sig'] ?? '' );
$bot    = '' !== trim( (string) ( $_POST['kg_website'] ?? '' ) ) || ! hash_equals( hash_hmac( 'sha256', 'kg' . $ts, $cfg['secret'] ), $sig );

$in     = ( isset( $_POST['kg'] ) && is_array( $_POST['kg'] ) ) ? $_POST['kg'] : array();
$fields = array();
foreach ( $in as $k => $v ) {
	$k = preg_replace( '/[^a-z_]/', '', strtolower( (string) $k ) );
	if ( isset( $names[ $k ] ) && is_string( $v ) ) {
		$fields[ $k ] = kg_clean( $v );
	}
}
$digits = preg_replace( '/\D/', '', $fields['phone'] ?? '' );
$valid  = '' !== ( $fields['name'] ?? '' ) && strlen( $digits ) >= 10;

if ( ! $bot && ! $valid ) {
	header( 'Location: ' . $back . '?kg_err=' . $type . '#kg-form-' . $type );
	exit;
}

$lines = array( $labels[ $type ] . ( $scheme ? ' - ' . $scheme : '' ) );
foreach ( $fields as $k => $v ) {
	if ( '' !== $v ) {
		$lines[] = $names[ $k ] . ': ' . $v;
	}
}
$text = implode( "\n", $lines );

if ( ! $bot ) {
	// Save outside the public folder if possible.
	$dir = dirname( __DIR__ ) . '/kg-enquiries';
	if ( ! is_dir( $dir ) ) {
		@mkdir( $dir, 0750 );
	}
	if ( ! is_dir( $dir ) || ! is_writable( $dir ) ) {
		$dir = __DIR__ . '/kg-enquiries';
		if ( ! is_dir( $dir ) ) {
			@mkdir( $dir, 0750 );
			@file_put_contents( $dir . '/.htaccess', "Require all denied\nDeny from all\n" );
			@file_put_contents( $dir . '/index.html', '' );
		}
	}
	$fh = @fopen( $dir . '/enquiries.csv', 'a' );
	if ( $fh ) {
		if ( 0 === filesize( $dir . '/enquiries.csv' ) ) {
			fputcsv( $fh, array( 'Date', 'Form', 'Seva', 'Details', 'Page' ) );
		}
		fputcsv( $fh, array( date( 'Y-m-d H:i' ), $labels[ $type ], $scheme, implode( ' | ', array_slice( $lines, 1 ) ), $back ) );
		fclose( $fh );
	}
	if ( ! empty( $cfg['email'] ) && filter_var( $cfg['email'], FILTER_VALIDATE_EMAIL ) ) {
		$host = preg_replace( '/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost' );
		@mail( $cfg['email'], '[Gaushala website] ' . $labels[ $type ] . ': ' . ( $fields['name'] ?? '' ), $text,
			"From: Gaushala website <no-reply@{$host}>\r\nContent-Type: text/plain; charset=UTF-8" );
	}
}
$wa = 'https://wa.me/' . preg_replace( '/\D/', '', $cfg['whatsapp'] ) . '?text=' . rawurlencode( "Namaste.\n" . $text );
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Thank you | Shri Koderma Gaushala Samiti</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;700&amp;family=Tiro+Devanagari+Hindi&amp;display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
<script>try{if(localStorage.getItem('kgLang')==='hi'){document.documentElement.classList.add('hi');document.documentElement.lang='hi';}}catch(e){}</script>
</head>
<body>
<header class="kg-page-head"><div class="kg-wrap"><h1><span class="lang-en">Thank you</span><span class="lang-hi">धन्यवाद</span></h1></div></header>
<main class="kg-content">
	<p class="kg-lead"><span class="lang-en">Your details have reached the gaushala office. We will contact you soon.</span><span class="lang-hi">आपका विवरण गौशाला कार्यालय पहुँच गया है। हम शीघ्र संपर्क करेंगे।</span></p>
	<p><span class="lang-en">For a faster reply, send the same message on WhatsApp:</span><span class="lang-hi">शीघ्र उत्तर के लिए यही संदेश व्हाट्सऐप पर भी भेजें:</span></p>
	<div class="wp-block-buttons">
		<a class="kg-btn kg-btn-wa" href="<?php echo kg_h( $wa ); ?>" rel="noopener"><span class="lang-en">Send on WhatsApp</span><span class="lang-hi">व्हाट्सऐप पर भेजें</span></a>
		<a class="kg-btn kg-btn-ghost" href="<?php echo kg_h( $back ); ?>"><span class="lang-en">Back to the page</span><span class="lang-hi">पृष्ठ पर लौटें</span></a>
	</div>
	<pre style="white-space:pre-wrap;background:#fff;border:1px solid #e3d5bd;border-radius:12px;padding:16px;font:inherit"><?php echo kg_h( $text ); ?></pre>
</main>
</body>
</html>
