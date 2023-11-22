import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { TMP_Text } from 'TMPro'
import { Vector2, Vector3, RectTransformUtility, Transform, Camera, GameObject, Color, RectTransform, Canvas, Debug, Ray } from 'UnityEngine'
export default class UINickname extends ZepetoScriptBehaviour {
    public textNick : TMP_Text;
    private character : ZepetoCharacter;
    public canvas : Canvas;
    private canvasRect : RectTransform;
    private rectTrans : RectTransform; 
    private isInit : boolean;
    public Init(sessionId : string, nickname : string, canvas : Canvas){
        this.canvas = canvas;
        this.textNick.text = nickname;        
        this.character = ZepetoPlayers.instance.GetPlayer(sessionId).character;
        this.canvasRect = this.canvas.GetComponent<RectTransform>();
        this.rectTrans = this.GetComponent<RectTransform>();

        //ZepetoPlayers.instance.ZepetoCamera.SetFollowTarget(null);
        this.isInit = true;
        //this.StartCoroutine(this.UpdatePosition());
    }
    
    FixedUpdate()
    {
        if(!this.isInit) return;
        
        const nicknamePoint = this.character.transform.Find("nicknamePoint");
        
        //테스트용 레이 발사 
        // const dir : Vector3 = (nicknamePoint.position -ZepetoPlayers.instance.ZepetoCamera.camera.transform.position);
        // const distance = dir.magnitude;
        // dir.Normalize();
        // const ray : Ray = new Ray(ZepetoPlayers.instance.ZepetoCamera.camera.transform.position, dir);
        // Debug.DrawRay(ray.origin, ray.direction * distance, Color.red);

        //overlay 
        let screenPoint : Vector2 =
            RectTransformUtility.WorldToScreenPoint(ZepetoPlayers.instance.ZepetoCamera.camera, nicknamePoint.position);
        this.transform.position = new Vector3(screenPoint.x, screenPoint.y, 0);
    }
    *UpdatePosition(){
        while(true){
            yield null;

            //플레이어에 있는 nicknamePoint를 찾음  
            
            // const point = ZepetoPlayers.instance.ZepetoCamera.camera.WorldToViewportPoint(nicknamePoint.position);
            // const viewportPosition: Vector2 = new Vector2(point.x, point.y);
            // const screenPosition=new Vector2(
            //     ((viewportPosition.x*this.canvasRect.sizeDelta.x)-(this.canvasRect.sizeDelta.x*0.5)),
            // ((viewportPosition.y*this.canvasRect.sizeDelta.y)-(this.canvasRect.sizeDelta.y*0.5)));
            // this.rectTrans.anchoredPosition = screenPosition;

            const nicknamePoint = this.character.transform.Find("nicknamePoint");
            const dir : Vector3 = (nicknamePoint.position -ZepetoPlayers.instance.ZepetoCamera.camera.transform.position);
            const distance = dir.magnitude;
            dir.Normalize();
            const ray : Ray = new Ray(ZepetoPlayers.instance.ZepetoCamera.camera.transform.position, dir);
            Debug.DrawRay(ray.origin, ray.direction * distance, Color.red);
            
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