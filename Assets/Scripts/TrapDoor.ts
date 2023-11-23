import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Time, Vector3, GameObject, Transform} from 'UnityEngine'
import Collisionable from './Collisionable'

export default class TrapDoor extends ZepetoScriptBehaviour {
    
    public startDirection : int;    //-1 : left, 1 : right
    
    private dir : Vector3;
    public speed : number = 1;
    public collisionableGo : GameObject;
    private collisionable : Collisionable;
    public leftTrans : Transform;
    public rightTrans : Transform;
    
    Start() {    
        
        this.leftTrans.SetParent(null);
        this.rightTrans.SetParent(null);
        
        this.collisionable = this.collisionableGo.GetComponent<Collisionable>();
        this.collisionable.onCollisionEnter = (col)=>{
            col.gameObject.transform.SetParent(this.transform);
        };
        this.collisionable.onCollisionExit = (col)=>{
            col.gameObject.transform.parent = null;
        };
        
        if(this.startDirection == -1){
            this.dir = Vector3.left;    
        }else if(this.startDirection == 1){
            this.dir = Vector3.right;
        }
        
        this.StartCoroutine(this.CoMove());
    }
    
    *CoMove()
    {
        while(true){
            this.transform.Translate( this.dir * this.speed * Time.deltaTime);
            
            if(this.dir == Vector3.right){
                
                const dis = Vector3.Distance(this.rightTrans.position, this.transform.position);
                
                //console.log(dis);   //4?
                
                if(dis <= 0.1){
                    //방향 전환
                    this.dir = Vector3.left;
                }
                
            }else if(this.dir == Vector3.left){
                const dis = Vector3.Distance(this.leftTrans.position, this.transform.position);
                if(dis <= 0.1){
                    //방향 전환
                    this.dir = Vector3.right;
                }
            }
            
            yield null;
        }
    }

}