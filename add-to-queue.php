<?php

    include_once 'common-functions.php';
    include_once 'common-session.php';
    include_once 'common-info.php';
    
    if( isset( $_SERVER['PHP_AUTH_USER'] ) || isset( $_SESSION['fullname'] ) ) {
        $blocklist = getRecords( 'SELECT ip, perm, time FROM blocklist' );
        $isBlocked = false;

        foreach( $blocklist as $blocked ) {
            if( $blocked['ip'] == $ip ) {
                $isBlocked = true;
                break;
            }    
        }

        if( !$isBlocked ) {
            modifyRecords( 'INSERT INTO students (ip, fullname) VALUES (?, ?)', 'ss', [$ip, $fullName] );
        }
    }
?>