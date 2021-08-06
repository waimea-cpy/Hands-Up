<?php
    include_once 'common-functions.php';
    include_once 'common-session.php';
    include_once 'common-info.php';
    
    if( $teacher ) {
        if( isset( $_GET['ip'] ) && !empty( $_GET['ip'] ) ) {
            $ipToRemove = $_GET['ip'];
        }
    }
    else {
        if( isset( $_SERVER['PHP_AUTH_USER'] ) || isset( $_SESSION['fullname'] ) ) {
            $ipToRemove = $ip;
        }
    }

    if( isset( $ipToRemove ) ) modifyRecords( 'DELETE FROM students WHERE ip=?', 's', [$ipToRemove] );
?>