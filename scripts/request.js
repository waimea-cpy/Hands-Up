let previousQueue = null;



function getStatus() {
    // console.log( 'Requesting status...' );

    const request = new XMLHttpRequest();
    const url = 'get-status.php';
    request.open( 'GET', url );
    request.send();

    request.onreadystatechange = () => {
        if( request.readyState == 4 && request.status == 200 ) {
            const statusJSON = request.responseText;
            // console.log( 'Status received: ' + statusJSON );
            const status = JSON.parse( statusJSON );
            const active = status[0].active;

            const onoff = document.getElementById( 'onoff' );
            if( onoff ) onoff.checked = active;
        }
    };
}


function setStatus( toggle ) {
    // console.log( 'Setting status...' ); 
    // console.log( 'Active toggle: ' + toggle.checked );

    const request = new XMLHttpRequest();
    const url = 'set-status.php?active=' + (toggle.checked ? 1 : 0);
    request.open( 'GET', url );
    request.send();

    request.onreadystatechange = () => {
        if( request.readyState == 4 && request.status == 200 ) {
            getQueue( null, true );
        }
    };
}


function addBooking( ipAddr ) {
    // console.log( 'Adding a booking...' ); 
    // console.log( 'IP: ' + ipAddr );

    const request = new XMLHttpRequest();
    const url = 'add-to-queue.php?ip=' + ipAddr;
    request.open( 'GET', url );
    request.send();

    request.onreadystatechange = () => {
        if( request.readyState == 4 && request.status == 200 ) {
            getQueue( ipAddr, false );
        }
    };
}


function removeBooking( ipAddr, teacher ) {
    // console.log( 'Removing booking...' ); 
    // console.log( 'IP: ' + ipAddr );

    const request = new XMLHttpRequest();
    const url = 'remove-from-queue.php?ip=' + ipAddr;
    request.open( 'GET', url );
    request.send();

    request.onreadystatechange = () => {
        if( request.readyState == 4 && request.status == 200 ) {
            getQueue( ipAddr, teacher );
        }
    };
}


function clearQueue() {
    // console.log( 'Clearing queue...' ); 

    const request = new XMLHttpRequest();
    const url = 'clear-queue.php';
    request.open( 'GET', url );
    request.send();

    request.onreadystatechange = () => {
        if( request.readyState == 4 && request.status == 200 ) {
            getQueue( null, true );
        }
    };
}


function getQueue( ipAddr, teacher ) {
    // console.log( 'IP: ' + ipAddr );
    // console.log( 'Requesting queue...' );

    const request = new XMLHttpRequest();
    const url = 'get-queue.php';
    request.open( 'GET', url );
    request.send();

    request.onreadystatechange = () => {
        if( request.readyState == 4 && request.status == 200 ) {
            const queueJSON = request.responseText;
            // console.log( 'Queue received: ' + queueJSON );
            const queue = JSON.parse( queueJSON );

            let inQueue = false;
            const queueList = document.getElementById( 'bookings' );
            const add = document.getElementById( 'addbutton' );
            const rem = document.getElementById( 'removebutton' );
            const status = document.getElementById( 'status' );
            const onoff  = document.getElementById( 'onoff' );
            const active = onoff.checked;

            // console.log( 'Previous: ' + previousQueue );
            // console.log( 'Queue: ' + queueJSON );

            if( queueJSON != previousQueue ) {
                // console.log( 'New Queue!' );
                // Save the new queue
                previousQueue = queueJSON;

                // Clear out the queue list
                queueList.innerHTML = '';

                const numBookings = queue.length;
                // console.log( numBookings + ' bookings in queue' );

                queue.forEach( booking => {
                    // console.log( booking.fullname + ' at ' + booking.time );

                    const bookingTime = new Date( booking.time );
                    const nowTime = new Date();
                    const diffTimeMS = nowTime.getTime() - bookingTime.getTime();
                    const diffMins = Math.floor( diffTimeMS / 1000 / 60 );
                    const age = diffMins >= 10 ? 5 : Math.floor( diffMins / 2 );

                    const slot = document.createElement( 'li' );
                    slot.classList.add( 'slot' );
                    slot.classList.add( 'booking' );
                    slot.classList.add( 'age-' + age );
                    
                    const name = document.createElement( 'span' );
                    name.classList.add( 'name' );
                    name.innerHTML = booking.fullname;

                    const time = document.createElement( 'span' );
                    time.classList.add( 'time' );
                    time.innerHTML = diffMins + (diffMins == 1 ? ' min' : ' mins') + ' ago';

                    const controls = document.createElement( 'span' );
                    controls.classList.add( 'controls' );

                    if( teacher ) {
                        const remove = document.createElement( 'a' );
                        remove.classList.add( 'done' );
                        remove.href = '#';
                        remove.addEventListener( 'click', () => { removeBooking( booking.ip, true ); } );
                        const cross = document.createElement( 'span' );
                        cross.classList.add( 'iconify' );
                        cross.dataset.icon = 'mdi-check';
                        
                        remove.appendChild( cross );
                        controls.appendChild( remove );
                    }

                    slot.appendChild( name );
                    slot.appendChild( time );
                    slot.appendChild( controls );

                    queueList.appendChild( slot );

                    if( booking.ip == ipAddr ) inQueue = true;
                } );

                for( let i = 0; i < 10 - numBookings; i++ ) {
                    const slot = document.createElement( 'li' );
                    slot.classList.add( 'slot' );
                    queueList.appendChild( slot );
                }
            }

            if( active ) {
                queueList.classList.add( 'active' );
                status.innerText = '';

                if( inQueue ) {
                    if( add ) add.style.display = 'none';
                    if( rem ) rem.style.display = 'flex';
                    if( !teacher ) status.innerText = 'You are waiting in the queue';
                }
                else {
                    if( add ) add.style.display = 'flex';
                    if( rem ) rem.style.display = 'none';
                    if( !teacher ) status.innerText = 'You are not yet in the queue';
                }
            }
            else {
                queueList.classList.remove( 'active' );

                if( add ) add.style.display = 'none';
                if( rem ) rem.style.display = 'none';
                status.innerText = 'The queue is currently paused';
            }
        }
    };
}

