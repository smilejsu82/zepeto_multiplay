import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { Player, Transform, Vector3 } from 'ZEPETO.Multiplay.Schema'
export default class extends Sandbox {

    onCreate(options: SandboxOptions) {
        console.log('onCreate')
        
        this.onMessage('onChangedTransform', (client, message)=>{
            const player = this.state.players.get(client.sessionId);
            if(player!= undefined){
                const transform = new Transform();
                
                transform.position = new Vector3();
                transform.position.x = message.position.x;
                transform.position.y = message.position.y;
                transform.position.z = message.position.z;
                
                transform.rotation = new Vector3();
                transform.rotation.x = message.rotation.x;
                transform.rotation.y = message.rotation.y;
                transform.rotation.z = message.rotation.z;

                player.transform = transform;
            }
        });
        
        this.onMessage("onChangedState", (client, message)=>{
            const player = this.state.players.get(client.sessionId);
            if(player != undefined){
                player.state = message.state;    
            }
            
        });
    }

    onJoin(client: SandboxPlayer) {
        console.log(`[onJoin] sessionId: ${client.sessionId}, hashCode: ${client.hashCode}, userId: ${client.userId}`);
        const player = new Player();
        player.sessionId = client.sessionId;
        console.log('hashCode : ' + client.hashCode);   //undefined
        
        if(client.hashCode != undefined)    //undefined 변수의 정의만 되어 있고 값이 할당되지 않았을때 
            player.zepetoHash = client.hashCode;
        
        console.log('userId : ' + client.userId);   //undefined
        
        if(client.userId != undefined)
            player.zepetoUserId = client.userId;
        
        console.log('players: ' + this.state.players);
        
        this.state.players.set(client.sessionId, player);
    }

    onLeave(client: SandboxPlayer, consented?: boolean) {
        this.state.players.delete(client.sessionId);
    }
}