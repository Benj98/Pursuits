
// // F3 KEY -- SHOW/HIDE CURSOR.

// mp.keys.bind(0x72, false, function() {
//     let toggle = !toggle;

//     if(toggle) {
//         mp.gui.cursor.show(true, true);
//         toggle;
//     } else {
//         mp.gui.cursor.show(false, false);
//         toggle;
//     }
// })

// // H KEY -- ATTEMPT CUFF ON SUSPECT.

// let lastCuffAttemptTime = 0;
// const cuffAttemptCooldown = 5000; // 5 second cooldown in milliseconds

// mp.events.add('setCuffTimer', (player, time) => {
//     cuffAttemptCooldown = time;
// })

// mp.keys.bind(0x48, false, async function() {
//     const now = Date.now();

//     if (now - lastCuffAttemptTime > cuffAttemptCooldown) {
//         const result = await mp.events.callRemoteProc('clientAttemptCuff');
//         if (!result) {
//             return;
//         } else {
            
//         }
        
//         lastCuffAttemptTime = now;
//     }
// });