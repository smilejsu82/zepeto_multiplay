import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter } from 'ZEPETO.Character.Controller'
import {Collision, GameObject} from "UnityEngine";
import Collisionable from './Collisionable'
export default class SuperJumpBlock extends ZepetoScriptBehaviour {
    public collisionableGo: GameObject;
    private collisionable: Collisionable;
    Start() {

        this.collisionable = this.collisionableGo.GetComponent<Collisionable>();
        this.collisionable.onCollisionEnter = (col) => {
            col.collider.gameObject.GetComponent<ZepetoCharacter>().additionalJumpPower = 7;
        };
        this.collisionable.onCollisionExit = (col) => {
            col.collider.gameObject.GetComponent<ZepetoCharacter>().additionalJumpPower = 0;
        };
    }
}