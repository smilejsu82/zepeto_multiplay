import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { Collider } from 'UnityEngine'
import { Action$1 } from 'System'
import PlayerController from './PlayerController'
export default class Triggerable extends ZepetoScriptBehaviour {
    
    public onTriggerEnter : Action$1<Collider>;
    public tags : string[]; 
    public collider : Collider;
    
    Start()
    {
        console.log('Triggerable::Start');
    }
    
    OnTriggerEnter(col : Collider)
    {
        let isTrigger = false;
        for(let i = 0; i<this.tags.length; i++){
            if(col.CompareTag(this.tags[i])){
                isTrigger = true;
                break;
            }    
        }
        if(isTrigger){
            
            if(this.onTriggerEnter != null){
                this.onTriggerEnter(col);
            }
        }
    }
    
    public Detecting(enabled : boolean)
    {
        //console.log('Detecting : ' + enabled);
        
        this.collider.enabled = enabled;
    }

}