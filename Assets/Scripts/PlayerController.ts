import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, CharacterState } from 'ZEPETO.Character.Controller'
import { Animator } from 'UnityEngine'
export default class PlayerController extends ZepetoScriptBehaviour {
    
    private character : ZepetoCharacter;
    private anim : Animator;
    private isJumping : boolean;
    public Init()
    {
        this.character = this.GetComponent<ZepetoCharacter>();
        this.anim = this.character.Context.GetComponent<Animator>();
        
        this.character.OnUpdateState.AddListener((state)=>{
            console.log(`[OnUpdateState] state: ${state}`);
        });
        
        this.character.OnChangedState.AddListener((cur, next)=>{
            console.log(`[OnChangedState] cur: ${cur} , next: ${next}`);
            });
    }
}