import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { Player } from 'ZEPETO.Multiplay.Schema'
export default class extends Sandbox {

    onCreate(options: SandboxOptions) {
        console.log('onCreate')
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
        
    }
}