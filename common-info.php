<?php
    include_once 'common-session.php';

    if( isset( $_SESSION['fullname'] ) ) {
        $fullName = $_SESSION['fullname'];
        $firstName = explode( " ", $fullName )[0];
        $teacher = $_SESSION['teacher'];
    }
    elseif( isset( $_SERVER['PHP_AUTH_USER'] ) ) {
        $user = strtolower( $_SERVER['PHP_AUTH_USER'] );
        $fullName = shell_exec( 'getent passwd | grep "'.$user.'" | cut -d":" -f5 | cut -d"," -f1' );
        $firstName = explode( " ", $fullName )[0];
        $teacher = $user == 'cpy';
        $_SESSION['fullname'] = $fullName;
        $_SESSION['teacher'] = $teacher;
    }
    else {
        $firstName = 'Mystery Person';
        $teacher = false;
        $_SESSION['teacher'] = false;
    }

    $ip = $_SERVER['REMOTE_ADDR'];
?>

