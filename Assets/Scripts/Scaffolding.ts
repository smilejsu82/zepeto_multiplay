import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Collider, MeshRenderer, Material } from 'UnityEngine'
export default class Scaffolding extends ZepetoScriptBehaviour {
    
    private isPushed : boolean = false;
    private renderer : MeshRenderer;
    public arrMat : Material[];
    Start() {    
        this.renderer = this.GetComponent<MeshRenderer>();
    }
    
    OnTriggerEnter(col : Collider)
    {
        if(col.CompareTag("Player") && this.isPushed == false)
        {
            console.log('발판을 밟았습니다.');
            this.isPushed = true;
            this.renderer.material = this.arrMat[1];    //green
        }
    }

    OnTriggerStay(col : Collider)
    {
        if(col.CompareTag("Player") && this.isPushed == false)
        {
            console.log('발판을 밟고있습니다.');
            this.isPushed = true;
            this.renderer.material = this.arrMat[1];    //green
        }
    }
    
    OnTriggerExit( col : Collider){
        if(col.CompareTag("Player") && this.isPushed == true)
        {
            console.log('발판에서 벗어났습니다.');
            this.isPushed = false;
            this.renderer.material = this.arrMat[0];    //white
        }
    }

}