<?php
    include_once 'common-functions.php';
    include_once 'common-session.php';

    if( isset( $_SESSION['fullname'] ) ) {
        $bookings = getRecords( 'SELECT ip, fullname, time
                                FROM students 
                                ORDER BY time ASC' );

        echo json_encode( $bookings );
    }
?>
