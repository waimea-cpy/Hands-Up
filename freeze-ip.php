<?php
    include_once 'common-functions.php';
    include_once 'common-session.php';
    include_once 'common-info.php';
    
    if( $teacher ) {
        if( isset( $_GET['ip'] ) && !empty( $_GET['ip'] ) ) {
            $ipToBlock = $_GET['ip'];
            modifyRecords( 'INSERT INTO blocklist (ip, perm) VALUES (?, 0)', 's', [$ipToBlock] );
        }
    }
?>