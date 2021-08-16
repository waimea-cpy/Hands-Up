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


function blockIP( ipAddr, teacher, perm ) {
    // console.log( 'Blocking IP)...' ); 
    // console.log( 'IP: ' + ipAddr );

    const request = new XMLHttpRequest();
    const url = (perm ? 'block-ip.php' : 'freeze-ip.php') + '?ip=' + ipAddr;
    request.open( 'GET', url );
    request.send();

    request.onreadystatechange = () => {
        if( request.readyState == 4 && request.status == 200 ) {
            removeBooking( ipAddr, teacher );
        }
    };
}


function unblockIP( ipAddr ) {
    // console.log( 'Unblocking IP)...' ); 
    // console.log( 'IP: ' + ipAddr );

    const request = new XMLHttpRequest();
    request.open( 'GET', 'unblock-ip.php?ip=' + ipAddr );
    request.send();
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
    // console.log( 'Requesting blocklist...' );

    const request = new XMLHttpRequest();
    const url = 'get-blocklist.php';
    request.open( 'GET', url );
    request.send();

    request.onreadystatechange = () => {
        if( request.readyState == 4 && request.status == 200 ) {
            const blocklistJSON = request.responseText;
            // console.log( 'Blocklist received: ' + blocklistJSON );
            const blocklist = JSON.parse( blocklistJSON );

            const nowTime = new Date();
            let isBlocked = false;
            let isFrozen = false;

            blocklist.forEach( blocked => {
                if( teacher ) {
                    // Check is just frozen
                    if( !blocked.perm ) {
                        const blockTime = new Date( blocked.time );
                        const diffTimeMS = nowTime.getTime() - blockTime.getTime();
                        const diffMins = Math.floor( diffTimeMS / 1000 / 60 );

                        // Unfreeze if 5mins has gone by
                        if( diffMins >= 5 ) {
                            unblockIP( blocked.ip );
                        }
                    }
                }
                else if( blocked.ip == ipAddr ) {
                    // console.log( "BLOCKED!");
                    isBlocked = blocked.perm;
                    isFrozen = !blocked.perm;
                }    
            } );

            getBookings( ipAddr, teacher, isBlocked, isFrozen );
        }
    };
}


function getBookings( ipAddr, teacher, blocked, frozen ) {
    // console.log( 'IP: ' + ipAddr );
    // console.log( 'Blocked: ' + blocked );
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
                        const removeIcon = document.createElement( 'span' );
                        removeIcon.classList.add( 'iconify' );
                        removeIcon.dataset.icon = 'mdi-check';
                        remove.appendChild( removeIcon );
                        
                        const freeze = document.createElement( 'a' );
                        freeze.classList.add( 'warn' );
                        freeze.href = '#';
                        freeze.addEventListener( 'click', () => { if( confirm( 'Freeze IP ' + booking.ip + '... Are you sure?' ) ) blockIP( booking.ip, true, false ); } );
                        const freezeIcon = document.createElement( 'span' );
                        freezeIcon.classList.add( 'iconify' );
                        freezeIcon.dataset.icon = 'mdi-snowflake';
                        freeze.appendChild( freezeIcon );
                        
                        const block = document.createElement( 'a' );
                        block.classList.add( 'bad' );
                        block.href = '#';
                        block.addEventListener( 'click', () => { if( confirm( 'Block IP ' + booking.ip + '... Are you sure?' ) ) blockIP( booking.ip, true, true ); } );
                        const blockIcon = document.createElement( 'span' );
                        blockIcon.classList.add( 'iconify' );
                        blockIcon.dataset.icon = 'mdi-cancel';
                        block.appendChild( blockIcon );
                        
                        controls.appendChild( block );
                        controls.appendChild( freeze );
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

            // console.log( 'Active: ' + active );

            if( active && !blocked && !frozen ) {
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
                        position.classList.remove( 'bad' );
                        position.classList.remove( 'warn' );
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

                status.innerText = 'The queue is currently paused';

                if( position ) { 
                    if( blocked ) {
                        const symbol = document.createElement( 'span' );
                        symbol.classList.add( 'iconify' );
                        symbol.dataset.icon = 'mdi-cancel';
                        position.innerHTML = ''; 
                        position.appendChild( symbol );
                        position.style.display = 'flex';
                        position.classList.add( 'bad' );
                        status.innerText = 'You are blocked from the queue!';
                    }
                    else if( frozen ) {
                        const symbol = document.createElement( 'span' );
                        symbol.classList.add( 'iconify' );
                        symbol.dataset.icon = 'mdi-snowflake';
                        position.innerHTML = ''; 
                        position.appendChild( symbol );
                        position.style.display = 'flex';
                        position.classList.add( 'warn' );
                        status.innerText = 'You are temporarily frozen out of the queue!';
                    }
                    else {
                        position.innerHTML = ''; 
                        position.style.display = 'none';
                    }
                }

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