<?php

    include_once 'common-functions.php';
    include_once 'common-info.php';
    include_once 'common-top.php';
?>

    <h2>Tell us who you are...</h2>

    <section class="group">
        <p>If you have an account on the DT server...<p>

        <a href="/login.php?next=handup" class="button">Login</a>
    </section>

    <section class="group">
        <p>If you don't have an account on the server...</p>

        <form action="save-user.php" method="post">
            <label for="fullname">What is your full name?</label>
            <input type="text" name="fullname" placeholder="e.g. Tane Smith" required>
            <input type="submit" value="Next">
        </form>

        <p>The address of your computer is: <span class="ip"><?= $ip ?></span><br>(this can be used to identify you)</p>
    </section>

<?php
    include_once 'common-bottom.php';
?>