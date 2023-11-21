import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { TMP_Text } from 'TMPro'
import { Vector2, Vector3, RectTransformUtility, Transform, Camera, GameObject, RectTransform, Canvas} from 'UnityEngine'
export default class UINickname extends ZepetoScriptBehaviour {
    public textNick : TMP_Text;
    private character : ZepetoCharacter;
    public canvas : Canvas;
    
    public Init(sessionId : string, nickname : string, canvas : Canvas){
        this.canvas = canvas;
        this.textNick.text = nickname;        
        this.character = ZepetoPlayers.instance.GetPlayer(sessionId).character;
        this.StartCoroutine(this.UpdatePosition());
    }
    
    *UpdatePosition(){
        while(true){
            yield null;

                                                            //TODO : 플레이어에 있는 nicknamePoint를 찾게 수정 
            const nicknamePoint = GameObject.Find("nicknamePoint").transform;
            //const nicknamePoint = this.character.transform.Find("nicknamePoint");
           
            //overlay 
            let screenPoint : Vector2 = 
                RectTransformUtility.WorldToScreenPoint(ZepetoPlayers.instance.ZepetoCamera.camera, nicknamePoint.position);
            this.transform.position = new Vector3(screenPoint.x, screenPoint.y, 0);
            
            //ui camera 
            //Canvas의 Render Mode가 Screen Space - Camera 일경우 
            // const uiCam = GameObject.FindGameObjectWithTag("UICamera").GetComponent<Camera>();
            // const screenPoint = RectTransformUtility.WorldToScreenPoint(uiCam, nicknamePoint.position);
            // const canvasRectTransform = this.canvas.GetComponent<RectTransform>();
            // let ref = $ref<Vector2>();
            //
            // if (RectTransformUtility.ScreenPointToLocalPointInRectangle(canvasRectTransform, screenPoint, uiCam, ref))
            // {
            //     let localPoint = $unref(ref);
            //    this.GetComponent<RectTransform>().localPosition = new Vector3(localPoint.x, localPoint.y, 0);
            // }
        }
    }
}