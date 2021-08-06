<?php
    include_once 'common-functions.php';
    include_once 'common-session.php';

    if( isset( $_SESSION['fullname'] ) ) {
        $status = getRecords( 'SELECT active FROM status' );
        echo json_encode( $status );
    }
?>
