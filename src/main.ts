/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import {ActionMessage} from "@workadventure/iframe-api-typings";

console.log('Script started successfully');

function displayDoor(state: boolean) { 
    if (state === true) {
        WA.room.showLayer('door/door_opened');
        WA.room.hideLayer('door/door_closed');
    } else {
        WA.room.hideLayer('door/door_opened');
        WA.room.showLayer('door/door_closed');
    }
}

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    displayDoor(WA.state.doorState as boolean);

    let player = (Math.random()>=0.5)? 1 : 0;

    if (player === 1) {
        WA.room.hideLayer("above/laptops");
    }

    console.log('bite');
    

    WA.state.onVariableChange('doorState').subscribe((doorState) => {
        displayDoor(doorState as boolean);
    });

    let openCloseMessage: ActionMessage | undefined;

    WA.room.area.onEnter('inside_doorstep').subscribe(() => {
        console.log('inside');
        openCloseMessage = WA.ui.displayActionMessage({
            message: "Press 'space' to open/close the door",
            callback: () => {
                WA.state.doorState = !WA.state.doorState;
            }
        });
    });

    // When someone leaves the doorstep (inside the room), we remove the message
    WA.room.area.onLeave('inside_doorstep').subscribe(() => {
        if (openCloseMessage !== undefined) {
            openCloseMessage.remove();
        }
    });

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    let noteWebsite: any;

    WA.room.area.onEnter('bowling').subscribe(async () => {
        currentPopup = WA.ui.openPopup("bowling", "C'est du bowling", []);
        noteWebsite = await WA.ui.website.open({
            url: "./src/note.html",
            position: {
                vertical: "top",
                horizontal: "middle",
            },
            size: {
                height: "30vh",
                width: "50vw",
            },
            margin: {
                top: "10vh",
            },
            allowApi: true,
        });
    })


    WA.room.area.onLeave('bowling').subscribe(function(){
        closePopup();
        noteWebsite.close();
    });


    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
