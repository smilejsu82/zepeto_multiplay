import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, CharacterState, ZepetoPlayers, ZepetoPlayerControl} from 'ZEPETO.Character.Controller'
import { Animator, CapsuleCollider, Vector3, CharacterController, Quaternion, WaitForSeconds} from 'UnityEngine'
export default class PlayerController extends ZepetoScriptBehaviour {
    
    private character : ZepetoCharacter;
    private anim : Animator;
    private isJumping : boolean;
    public sessionId : string;
    public Init(sessionId : string)
    {
        this.sessionId = sessionId;
        this.gameObject.tag = "Player";
        
        // const col = this.gameObject.AddComponent<CapsuleCollider>();
        // col.center = new Vector3(0, 0.5, 0);
        // col.radius = 0.25;
        // col.isTrigger = true;
        
        //this.GetComponent<CharacterController>().enabled = false;
        
        this.character = this.GetComponent<ZepetoCharacter>();
        this.anim = this.character.Context.GetComponent<Animator>();
        
        // this.character.OnUpdateState.AddListener((state)=>{
        //     console.log(`[OnUpdateState] state: ${state}`);
        // });
        //
        // this.character.OnChangedState.AddListener((cur, next)=>{
        //     console.log(`[OnChangedState] cur: ${cur} , next: ${next}`);
        //     });
    }
    
    private isTeleporting = false;
    public Teleport()
    {
        if(this.isTeleporting == false){
            this.isTeleporting = true
            this.StartCoroutine(this.CoTeleport());    
        }
    }
    
    *CoTeleport(){
        this.character.enabled = false;
        this.character.Teleport(new Vector3(0, 0, 0), Quaternion.identity);
        yield new WaitForSeconds(0.5);
        this.character.enabled = true;
        this.isTeleporting = false;
    }
}