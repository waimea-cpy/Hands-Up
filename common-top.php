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

        <title>Put Your Hand Up!</title>

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
