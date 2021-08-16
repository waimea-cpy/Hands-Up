<?php

    include_once 'common-functions.php';
    include_once 'common-info.php';
    
    if( $teacher ) {
        modifyRecords( 'DELETE FROM students' );
        modifyRecords( 'DELETE FROM blocklist' );
    }
?>