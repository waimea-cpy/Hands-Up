<?php
    include_once 'common-session.php';
    include_once 'common-info.php';
?>

<!doctype html>

<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- <meta http-equiv="refresh" content="<?= $teacher ? 10 : 30 ?>"> -->

        <title>Hand Up!</title>

        <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
        <link rel="manifest" href="images/site.webmanifest">
        <link rel="mask-icon" href="images/safari-pinned-tab.svg" color="#03a9f4">
        <link rel="shortcut icon" href="images/favicon.ico">
        <meta name="apple-mobile-web-app-title" content="Hand Up">
        <meta name="application-name" content="Hand Up">
        <meta name="msapplication-TileColor" content="#03a9f4">
        <meta name="msapplication-config" content="images/browserconfig.xml">
        <meta name="theme-color" content="#03a9f4">

        <script src="//code.iconify.design/1/1.0.6/iconify.min.js"></script>

        <link rel="stylesheet" href="css/reset.css">
        <link rel="stylesheet" href="css/styles.css">
    </head>

    <body>

        <header>
            <h2><span class="iconify" data-icon="mdi-hand"></span> 
<?php
    if( $teacher ) {
        echo 'Hands-Up Queue';
    }
    else {
        echo 'Hello, '.$firstName;
    }
?>
            </h2>
            
            <nav>
                <input type="checkbox" id="onoff" name="onoff"  
<?php
    if( $teacher ) {
        echo ' onclick="setStatus( this );"';
    }
    else {
        echo ' disabled';
    }
?>
                ><label for="onoff"></label>
            </nav>
        </header>

        <main>
