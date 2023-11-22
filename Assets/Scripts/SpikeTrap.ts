import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Animator, WaitForSeconds, GameObject } from 'UnityEngine'
import Triggerable from './Triggerable'
import PlayerController from './PlayerController'
export default class SpikeTrap extends ZepetoScriptBehaviour {

    private anim : Animator;
    public delay : int = 3;
    public triggerableGo : GameObject;
    private triggerable : Triggerable;
    
    Start() {
        console.log('SpikeTrap::Start');
        this.triggerable = this.triggerableGo.GetComponent<Triggerable>();
        
        this.triggerable.onTriggerEnter = (col)=>{
            console.log('====> ' + col.gameObject);

            col.gameObject.GetComponent<PlayerController>().Teleport();
        };
        
        this.anim = this.GetComponent<Animator>();
        this.triggerable.Detecting(false);
        this.StartCoroutine(this.Run());
    }
    
    *Run()
    {
        while(true){
            this.Open();
            yield new WaitForSeconds(this.delay);
            this.Close();
            yield new WaitForSeconds(this.delay);
        }
    }
    private Open()
    {
        this.triggerable.Detecting(true);
        this.anim.SetTrigger("Open");
    }
    
    private Close()
    {
        this.triggerable.Detecting(false);
        this.anim.SetTrigger("Close");
    }
}