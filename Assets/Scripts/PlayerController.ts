import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, CharacterState, ZepetoPlayers, ZepetoPlayerControl} from 'ZEPETO.Character.Controller'
import { Animator, CapsuleCollider, BoxCollider, Vector3, CharacterController, Quaternion, WaitForSeconds} from 'UnityEngine'
export default class PlayerController extends ZepetoScriptBehaviour {
    
    private character : ZepetoCharacter;
    private anim : Animator;
    private isJumping : boolean;
    public sessionId : string;
    public Init(sessionId : string)
    {
        
        this.sessionId = sessionId;
        this.gameObject.tag = "Player";
        
        const col = this.gameObject.AddComponent<BoxCollider>();
        col.center = new Vector3(0, 0, 0);
        col.size = new Vector3(0.3, 0.03, 0.3);
        // col.isTrigger = true;
        
        //this.GetComponent<CharacterController>().enabled = false;
        
        this.character = this.GetComponent<ZepetoCharacter>();
        this.anim = this.character.Context.GetComponent<Animator>();
        
        //this.character.additionalJumpPower = 7;
        // this.character.OnUpdateState.AddListener((state)=>{
        //     console.log(`[OnUpdateState] state: ${state}`);
        // });
        //
        // this.character.OnChangedState.AddListener((cur, next)=>{
        //     console.log(`[OnChangedState] cur: ${cur} , next: ${next}`);
        //     });
    }
    
    public Electric()
    {
        this.character.enabled = false;
        this.anim.Play("Electric");
        this.StartCoroutine(this.CoElectric());
    }
    *CoElectric(){
        yield new WaitForSeconds(4.03); 
        console.log('finished electric animation!');
        this.Teleport();
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
        this.GetComponent<CharacterController>().enabled = false;
        this.character.transform.position = Vector3.zero;
        console.log('teleport complete!');
        yield null;
        //this.character.Teleport(new Vector3(0, 0, 0), Quaternion.identity);
        //yield new WaitForSeconds(0.5);
        //this.anim.Play("Idle");
        //this.character.Jump();
        this.GetComponent<CharacterController>().enabled = true;
        this.character.enabled = true;
        this.isTeleporting = false;
    }
}