<?php
    include_once 'common-functions.php';
    include_once 'common-session.php';
    include_once 'common-info.php';
    
    if( $teacher ) {
        if( isset( $_GET['ip'] ) && !empty( $_GET['ip'] ) ) {
            $ipToRemove = $_GET['ip'];
            modifyRecords( 'DELETE FROM blocklist WHERE ip=?', 's', [$ipToRemove] );
        }
    }
?>