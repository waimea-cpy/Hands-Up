<?php

    include_once 'common-functions.php';
    include_once 'common-top.php';
    
    if( $teacher && isset( $_GET['active'] ) ) {
        modifyRecords( 'UPDATE status SET active = ?', 'i', [$_GET['active']] );
    }
?>