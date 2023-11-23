import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {Player, Vector3, Transform } from 'ZEPETO.Multiplay.Schema'
import {CharacterState, SpawnInfo, ZepetoPlayers} from 'ZEPETO.Character.Controller'
import {ZepetoWorldMultiplay} from 'ZEPETO.World'
import {Room, RoomData} from 'ZEPETO.Multiplay'
import * as UnityEngine from 'UnityEngine'
import { GameObject, Object, LayerMask, Canvas } from 'UnityEngine'
import * as zepeto from "Zepeto";
import UINickname from './UINickname'
import PlayerController from './PlayerController'

export default class ClientStarter extends ZepetoScriptBehaviour {

    public multiplay : ZepetoWorldMultiplay;
    private room : Room;
    private currentPlayers : Map<string,Player> = new Map<string,Player>();
    private nicknames : Map<string, GameObject> = new Map<string, GameObject>();
    public uiNicknamePrefab : GameObject;
    public canvas : Canvas;
    
    Start() {    
        this.multiplay.RoomCreated += (room : Room)=>{
            this.room = room;
            console.log('RoomCreated');
        };
        
        this.multiplay.RoomJoined += (room : Room)=>{
            console.log('RoomJoined');
            //이벤트 부착 
            room.OnStateChange += this.OnStateChange;
        };
        
        this.StartCoroutine(this.SendMessageLoop(0.01));
    }
    
    *SendMessageLoop(tick: number)
    {
        while(true){
            yield new UnityEngine.WaitForSeconds(tick);
            if(this.room != null && this.room.IsConnected)
            {
                const hasPlayer = ZepetoPlayers.instance.HasPlayer(this.room.SessionId);
                if(hasPlayer)
                {
                    const myPlayer = ZepetoPlayers.instance.GetPlayer(this.room.SessionId);
                    if(myPlayer.character.CurrentState != CharacterState.Idle){
                        this.SendTransform(myPlayer.character.transform);
                    }
                }
            }
        }
    }
    private SendTransform(transform: UnityEngine.Transform)
    {
        const data = new RoomData();    
        
        const pos = new RoomData();
        pos.Add("x", transform.localPosition.x);
        pos.Add("y", transform.localPosition.y);
        pos.Add("z", transform.localPosition.z);

        data.Add("position", pos.GetObject());
        
        const rot  = new RoomData();
        rot.Add("x", transform.localEulerAngles.x);
        rot.Add("y", transform.localEulerAngles.y);
        rot.Add("z", transform.localEulerAngles.z);

        data.Add("rotation", rot.GetObject());
        
        this.room.Send("onChangedTransform", data.GetObject()); //직렬화 해서 서버에 전송 
        
    }
    
    private SendState(state : CharacterState)
    {
        //console.log(`SendState: ${state}`);
        const data = new RoomData();
        data.Add("state", state);
        this.room.Send("onChangedState", data.GetObject());
    }
    
    private OnUpdatePlayer(sessionId : string, player : Player)
    {
        const position: UnityEngine.Vector3 = this.ParseVector3(player.transform.position);
        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        zepetoPlayer.character.MoveToPosition(position);
        
        // console.log(player.state);  //104 -> 106 -> 1
        // console.log(player.state === CharacterState.JumpIdle);  //false
        // console.log(player.state === CharacterState.JumpMove);  //false

        // 104 (Jump)
        // 106 (Stamp)
        // 1 (Idle)
        
        if(player.state === 104){   // || player.state === 106
        //if(player.state === CharacterState.JumpIdle || player.state === CharacterState.JumpMove){
            //console.log("jump");
            zepetoPlayer.character.Jump();
        }
            
    }
    
    private ParseVector3(vector3: Vector3)
    {
        return new UnityEngine.Vector3(vector3.x, vector3.y, vector3.z);
    }
    
    private OnStateChange(state, isFirst)
    {
        if(isFirst)
        {
           ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(()=>{
               console.log('OnAddedLocalPlayer');
               const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
               console.log(`myPlayer: ${myPlayer}`);

               // let layerMask = (-1) - (1 << LayerMask.NameToLayer("UI"));
               // ZepetoPlayers.instance.ZepetoCamera.camera.cullingMask = layerMask;
               
               myPlayer.character.OnChangedState.AddListener((cur, next)=>{
                   //console.log(`OnChangedState: cur: ${cur}, next: ${next}`);
                   this.SendState(cur);
               });
           }); 
           
           ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId:string)=>{
               const isLocal = this.room.SessionId === sessionId;               
               const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId); //오브젝트)
               if(!isLocal){
                   //스키마 (데이터)
                   const player = this.currentPlayers.get(sessionId);
                   player.OnChange += (ChangeValues)=> this.OnUpdatePlayer(sessionId, player);
               }

               
                   
               const playerController = zepetoPlayer.character.gameObject.AddComponent<PlayerController>();
               playerController.Init(sessionId);
               
               this.CreateUINickname(sessionId);
           });
        }
        
        let join = new Map<string, Player>();
        let leave = new Map<string, Player>(this.currentPlayers);
        
        state.players.ForEach((sessionId, player)=>{
            if(!this.currentPlayers.has(sessionId))
            {
                join.set(sessionId, player);
            }
            leave.delete(sessionId);
        });
        
        join.forEach((player, sessionId)=>{
            this.OnJoinPlayer(sessionId, player);
        });
        leave.forEach((player, sessionId)=>{
            this.OnLeavePlayer(sessionId, player);
        });
    }
    
    private CreateUINickname(sessionId : string){
        const nicknamePoint = new GameObject();
        nicknamePoint.name = "nicknamePoint";
        const player = ZepetoPlayers.instance.GetPlayer(sessionId);
        nicknamePoint.transform.SetParent(player.character.gameObject.transform);
        let localPosition = nicknamePoint.transform.localPosition;
        localPosition.y = 1.2;
        nicknamePoint.transform.localPosition = localPosition;

        const go = Object.Instantiate<GameObject>(this.uiNicknamePrefab, this.canvas.transform);
        //go.transform.SetParent(this.canvas.transform);
        // go.transform.localPosition = Vector2.zero;
        // go.transform.localRotation = Vector2.zero;

        const uiNickname = go.GetComponent<UINickname>();
        uiNickname.Init(sessionId, player.name, this.canvas);

        this.nicknames.set(sessionId, go);
    }
    
    private OnLeavePlayer(sessionId, player){
        
        console.log('OnLeavePlayer: ' + sessionId);
        
        const go = this.nicknames.get(sessionId);
        Object.Destroy(go);
        
        this.nicknames.delete(sessionId);
        
        this.currentPlayers.delete(sessionId);
        ZepetoPlayers.instance.RemovePlayer(sessionId);
    }
    private OnJoinPlayer(sessionId, player)
    {
        console.log(`[OnJoinPlayer] sessionId: ${sessionId}`);
        this.currentPlayers.set(sessionId, player);
        
        //플레이어 만들기 
        const spawnInfo = new SpawnInfo();
        const position = new UnityEngine.Vector3(0, 0, 0);
        const rotation = new UnityEngine.Vector3(0, 0, 0);
        
        spawnInfo.position = position;
        spawnInfo.rotation = UnityEngine.Quaternion.Euler(rotation);
        
        console.log(this.room.SessionId)
        console.log(player.sessionId);
        
        const isLocal = this.room.SessionId === player.sessionId;
        
        console.log(isLocal);
        
        console.log('zepetoUserId : ' + player.zepetoUserId);
        
        ZepetoPlayers.instance.CreatePlayerWithUserId(sessionId, player.zepetoUserId, spawnInfo, isLocal); 
    }
    
    
}