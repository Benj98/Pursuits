

mp.events.addProc('clientAttemptCuff', async (player) => {
    const nearbySuspect = await getNearbySuspect(player);

    if(nearbySuspect) {
        try {
            let isSusMoving = await nearbySuspect.callProc('clientIsTargetMoving', [nearbySuspect]);
            
            if(!isSusMoving) {
                cuffSuspect(player, nearbySuspect);
            } else return null;
                 
        } catch (error) {
            console.error(error);
        }
    }
})

const cuffSuspect = async (player, suspect) => {
    try {
        
    } catch (error) {
        console.error(error);
    }
}

const getNearbySuspect = async (player) => {
    mp.players.forEachInRange(player.position, 2, (_player) => {
        let team = _player.getVariable('team');
        if(team === "suspect") {
            return _player;
        } else return;
    })
}