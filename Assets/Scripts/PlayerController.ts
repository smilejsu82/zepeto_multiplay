import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, CharacterState, ZepetoPlayers, ZepetoPlayerControl} from 'ZEPETO.Character.Controller'
import { Animator, CapsuleCollider, Vector3, CharacterController } from 'UnityEngine'
export default class PlayerController extends ZepetoScriptBehaviour {
    
    private character : ZepetoCharacter;
    private anim : Animator;
    private isJumping : boolean;
    public Init()
    {
        this.gameObject.tag = "Player";
        const col = this.gameObject.AddComponent<CapsuleCollider>();
        col.center = new Vector3(0, 0.5, 0);
        col.radius = 0.25;
        col.isTrigger = true;
        
        this.GetComponent<CharacterController>().enabled = false;
        
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