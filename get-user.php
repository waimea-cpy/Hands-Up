<?php

    include_once 'common-functions.php';
    include_once 'common-top.php';
    
    echo '<h2>Tell us who you are...</h2>';

    $ip = $_SERVER['REMOTE_ADDR'];

    echo '<form action="save-user.php" method="post">';

    echo   '<label for="fullname">What is your full name?</label> ';
    echo   '<input type="text" name="fullname" placeholder="e.g. Tane Smith" required>';

    echo   '<input type="submit" value="Next">';

    echo '</form>';

    echo '<p>Note, we have the address of your computer: <span class="ip">'.$ip.'</span></p>';

    include_once 'common-bottom.php';

?>