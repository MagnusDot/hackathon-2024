/// <reference types="@workadventure/iframe-api-typings" />

console.log('Script started successfully');

const noteTextArea = document.getElementById("noteTextArea") as HTMLTextAreaElement;
const saveButton = document.getElementById("saveButton") as HTMLButtonElement;

// Waiting for the API to be ready
WA.onInit().then(() => {

    noteTextArea.value = (WA.state.noteText ?? "") as string;
    saveButton.addEventListener("click", () => {
        WA.state.noteText = noteTextArea.value;
    });

}).catch(e => console.error(e));

export {};  