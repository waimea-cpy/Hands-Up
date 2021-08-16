<?php

    include_once 'common-functions.php';
    include_once 'common-top.php';
    
    if( !isset( $_SERVER['PHP_AUTH_USER'] ) && !isset( $_SESSION['fullname'] ) ) {
        header( 'location:get-user.php' );
        exit();
    }

    echo '<section id="queue" class="'.($teacher ? 'admin' : '').'">';
    echo   '<ol id="bookings">';
    echo   '</ol>';
    echo '</section>';

    if( !$teacher ) {
        echo '<section id="position"></section>';
    }

    echo '<section id="controls">';

    if( $teacher ) {
        echo '<p id="status"></p>';
        echo '<a class="action bad" href="#" onclick="if( confirm( \'Clear the queue... Are you sure?\' ) ) clearQueue();"><span class="iconify" data-icon="mdi-delete"></span></a>';
    }
    else {
        echo '<p id="status"></p>';
        echo '<a id="removebutton" class="action bad" href="#" onClick="if( confirm( \'Leave the queue... Are you sure?\' ) ) removeBooking( \''.$ip.'\', false );"><span class="iconify" data-icon="mdi-minus-thick"></span></a>';
        echo '<a id="addbutton"    class="action"     href="#" onClick="addBooking( \''.$ip.'\' );"><span class="iconify" data-icon="mdi-plus-thick"></span></a>';
    }

    echo '</section>';
?>

    <script src="scripts/request.js"></script>

    <script>
        getStatus( '<?= $ip ?>', <?= $teacher ?> );

        var timer = setInterval( function() {
            getStatus( '<?= $ip ?>', <?= $teacher ?> );
        }, <?= $teacher ? 2500 : 10000 ?> );
    </script>

<?php

    include_once 'common-bottom.php';

?>