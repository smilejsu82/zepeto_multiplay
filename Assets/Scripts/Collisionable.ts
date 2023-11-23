import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { Collider, Collision } from 'UnityEngine'
import { Action$1 } from 'System'
import PlayerController from './PlayerController'
export default class Collisionable extends ZepetoScriptBehaviour {

    public onCollisionEnter : Action$1<Collision>;
    public onCollisionExit : Action$1<Collision>;
    public tags : string[];
    public collider : Collider;

    Start()
    {
        console.log('Triggerable::Start');
        this.Detecting(true);
    }

    OnCollisionEnter(col : Collision)
    {
        let isCollision = false;
        for(let i = 0; i<this.tags.length; i++){
            if(col.collider.CompareTag(this.tags[i])){
                isCollision = true;
                break;
            }
        }
        if(isCollision){

            console.log('OnCollisionEnter : ', col);
            
            if(this.onCollisionEnter != null){
                this.onCollisionEnter(col);
            }
        }
    }

    OnCollisionExit(col : Collision)
    {
        let isCollision = false;
        for(let i = 0; i<this.tags.length; i++){
            if(col.collider.CompareTag(this.tags[i])){
                isCollision = true;
                break;
            }
        }
        if(isCollision){

            console.log('OnCollisionExit : ', col);
            
            if(this.onCollisionExit != null){
                this.onCollisionExit(col);
            }
        }
    }

    public Detecting(enabled : boolean)
    {
        console.log('Detecting : ' + enabled);

        this.collider.enabled = enabled;
    }

}