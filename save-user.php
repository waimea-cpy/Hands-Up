<?php
    include_once 'common-top.php';

    $_SESSION['fullname'] = $_POST['fullname'];
    $_SESSION['teacher'] = false;

    header( 'location:index.php' );

?>