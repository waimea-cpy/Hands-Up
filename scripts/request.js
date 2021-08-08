let previousQueueJSON = null;



function getStatus( ipAddr, teacher ) {
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
            onoff.checked = active;

            getQueue( ipAddr, teacher );
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

            const queueList = document.getElementById( 'bookings' );
            const addButt  = document.getElementById( 'addbutton' );
            const remButt  = document.getElementById( 'removebutton' );
            const position = document.getElementById( 'position' );
            const status   = document.getElementById( 'status' );
            const onoff    = document.getElementById( 'onoff' );
            const active  = onoff.checked;
            const nowTime = new Date();
            let inQueue  = false;
            let queuePos = 0;
            let posCount = 0;

            // Map queue to new array including times to see if any have rolled over
            const processedQueue = queue.map( booking => {
                posCount++;

                const bookingTime = new Date( booking.time );
                const diffTimeMS = nowTime.getTime() - bookingTime.getTime();
                const diffMins = Math.floor( diffTimeMS / 1000 / 60 );
                const age = diffMins >= 10 ? 5 : Math.floor( diffMins / 2 );

                booking.age = age;
                booking.mins = diffMins;

                if( booking.ip == ipAddr ) {
                    inQueue = true;
                    queuePos = posCount;
                }

                return booking;
            } );

            // To JSON for string comparison
            const processedQueueJSON = JSON.stringify( processedQueue );
            const numBookings = processedQueue.length;

            // console.log( 'Previous: ' + previousQueueJSON );
            // console.log( 'Queue: ' + processedQueueJSON );

            if( processedQueueJSON != previousQueueJSON ) {
                // console.log( 'New Queue!' );
                // Save the new queue
                previousQueueJSON = processedQueueJSON;

                // Clear out the queue list
                queueList.innerHTML = '';

                processedQueue.forEach( booking => {
                    // console.log( booking.fullname + ' at ' + booking.time );
                    const slot = document.createElement( 'li' );
                    slot.classList.add( 'slot' );
                    slot.classList.add( 'booking' );
                    slot.classList.add( 'age-' + booking.age );
                    
                    const name = document.createElement( 'span' );
                    name.classList.add( 'name' );
                    name.innerHTML = booking.fullname;
                    if( teacher ) {
                        name.title = booking.ip;
                        name.addEventListener( 'click', () => { copyClip( booking.ip ); } );
                    }
                    const time = document.createElement( 'span' );
                    time.classList.add( 'time' );
                    time.innerHTML = booking.mins + (booking.mins == 1 ? ' min' : ' mins') + ' ago';

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
                } );

                for( let i = 0; i < 10 - numBookings; i++ ) {
                    const slot = document.createElement( 'li' );
                    slot.classList.add( 'slot' );
                    queueList.appendChild( slot );
                }
            }

            if( active ) {
                queueList.classList.add( 'active' );

                if( teacher ) {
                    status.innerText = '';
                    window.document.title = numBookings + (numBookings == 1 ? ' Hand' : ' Hands') + ' Up!';
                }
                else {
                    if( inQueue ) {
                        addButt.style.display = 'none';
                        remButt.style.display = 'flex';
                        position.innerHTML = queuePos;
                        position.style.display = 'flex';
                        status.innerText = 'You are in the queue';
                        window.document.title = 'Hand Up! (' + queuePos + ')';
                    }
                    else {
                        addButt.style.display = 'flex';
                        remButt.style.display = 'none';
                        position.innerHTML = '';
                        position.style.display = 'none';
                        status.innerText = 'You are not yet in the queue';
                        window.document.title = 'Hand Up!';
                    }
                }
            }
            else {
                queueList.classList.remove( 'active' );

                if( addButt ) addButt.style.display = 'none';
                if( remButt ) remButt.style.display = 'none';
                if( position ) { 
                    position.innerHTML = ''; 
                    position.style.display = 'none';
                }
                status.innerText = 'The queue is currently paused';
                window.document.title = 'Hand Up!';
            }
        }
    };
}

function copyClip( text ) {
    navigator.clipboard.writeText( text ).then( function() {
        console.log( '"' + text + '" copied to clipboard' );
    }, function( err ) {
        console.error( 'Could not copy text: ', err );
    } );
} 