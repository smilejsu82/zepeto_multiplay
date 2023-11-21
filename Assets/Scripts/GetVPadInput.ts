import { Object } from 'UnityEngine';
import { ZepetoPlayers, ZepetoScreenButton, ZepetoScreenTouchpad } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class GetVPadInput extends ZepetoScriptBehaviour {

    Start() {

        // Add a listener for the event when a local player is added
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.GetPadTouch();
            this.GetJumpTouch();
        });
    }

    GetPadTouch() {

        // Find the ZepetoScreenTouchpad object in the scene
        const touchPad = Object.FindObjectOfType<ZepetoScreenTouchpad>();

        // Add a listener for the drag event on the touchpad
        touchPad.OnDragEvent.AddListener(() => {
            // Log the position of the touch handle when a drag event occurs
            console.log(touchPad.touchHandle.transform.position);
        });
    }

    GetJumpTouch() {

        // Find the ZepetoScreenButton object in the scene
        const screenButton = Object.FindObjectOfType<ZepetoScreenButton>();

        // Add a listener to the OnPointDownEvent of the screenButton
        // This listener logs "Jump Button Down" when the button is pressed
        screenButton.OnPointDownEvent.AddListener(() => {

            console.log("Jump Button Down");
        });

        // Add a listener to the OnPointUpEvent of the screenButton
        // This listener logs "Jump Button Up" when the button is released
        screenButton.OnPointUpEvent.AddListener(() => {

            console.log("Jump Button Up");
        });

    }

}