<?php
    include_once 'common-functions.php';
    include_once 'common-session.php';

    if( isset( $_SESSION['fullname'] ) ) {
        $blocklist = getRecords( 'SELECT ip, perm, time FROM blocklist' );
        echo json_encode( $blocklist );
    }
?>