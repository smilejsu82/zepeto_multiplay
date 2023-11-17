import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Player, State } from 'ZEPETO.Multiplay.Schema'
import { SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoWorldMultiplay } from 'ZEPETO.World'
import { Room } from 'ZEPETO.Multiplay'
import * as UnityEngine from 'UnityEngine'
export default class ClientStarter extends ZepetoScriptBehaviour {

    public multiplay : ZepetoWorldMultiplay;
    private room : Room;
    private currentPlayers : Map<string,Player> = new Map<string,Player>();
    
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
    }
    
    private OnStateChange(state, isFirst)
    {
        let join = new Map<string, Player>();
        state.players.ForEach((sessionId, player)=>{
            if(!this.currentPlayers.has(sessionId))
            {
                join.set(sessionId, player);
            }
        });
        
        join.forEach((player, sessionId)=>{
            this.OnJoinPlayer(sessionId, player);
        });
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