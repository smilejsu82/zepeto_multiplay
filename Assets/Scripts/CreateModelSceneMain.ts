import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoCharacter, ZepetoCharacterCreator, SpawnInfo, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import { Animator, RuntimeAnimatorController, Resources, GameObject, Input, Vector3, Time} from 'UnityEngine';
export default class CreateModelSceneMain extends ZepetoScriptBehaviour {

    private characterGo : GameObject;
    public speed : number;
    Start() {

        //ZepetoPlayers.instance.CreatePlayerWithZepetoId("smilejsu82", new SpawnInfo(), true);
        
        // Create a `ZepetoCharacter` using ZepetoId
        // ZepetoCharacterCreator.CreateByZepetoId("smilejsu82", 
        //     new SpawnInfo(), (character: ZepetoCharacter) => {
        // });
        
        //Create a `ZepetoCharacterModel` using ZepetoId
        ZepetoCharacterCreator.CreateModelByZepetoId("smilejsu82", new SpawnInfo(), (go) => {
            console.log(go);
            this.characterGo = go;
            
            const animator = this.characterGo.GetComponentInChildren<Animator>();
            animator.runtimeAnimatorController =
                Resources.Load<RuntimeAnimatorController>("ZepetoAnimatorV2");
            
            if(this.characterGo != null){
                ZepetoPlayers.instance.ZepetoCamera.SetFollowTarget(this.characterGo.transform);
                ZepetoPlayers.instance.ZepetoCamera.enabled = true;
            }
                
        });
    }
    
    Update()
    {
        //console.log(`characterGo: ${this.characterGo}`);
        
        if(this.characterGo != undefined){
            
            let h = Input.GetAxisRaw("Horizontal");
            let v = Input.GetAxisRaw("Vertical");
            const dir = new Vector3(h, 0, v).normalized;
            
            console.log(dir);
            
            this.characterGo.transform.Translate(dir * this.speed * Time.deltaTime);
        }
    }
    
}