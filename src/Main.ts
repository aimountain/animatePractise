//////////////////////////////////////////////////////////////////////////////////////
// 显示对象是图片资源或者程序绘制的形状，
// 所有显示的对象要加到显示列表。
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {
    // 旋转设定
    private static STEP_ROT :number = 3;
    // 缩放设定
    private static STEP_SCALE :number = .3;
    private _cartoon : egret.Bitmap;
    private _txInfo: egret.TextField;
    private _nAnimMode: number;
    private _nScaleBase: number; 


    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {

        let backgroundMask = new egret.Shape();
        backgroundMask.graphics.beginFill(0x000000, 0.1);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        backgroundMask.graphics.drawRect(0, 0, stageW, stageH);
        backgroundMask.graphics.endFill();
        this.addChild(backgroundMask);

        this._cartoon = this.createBitmapByName("cartoon_png");
        this.addChild(this._cartoon);
        this._cartoon.anchorOffsetX = this._cartoon.width / 2;
        this._cartoon.anchorOffsetY = this._cartoon.height / 2;
        this._cartoon.x = this.stage.stageWidth / 2;
        this._cartoon.y = this.stage.stageHeight * 0.618;

        //提示信息
        this._txInfo = new egret.TextField;
        this.addChild(this._txInfo);
        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;

        this.launchAnimations();

    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private launchAnimations(): void {
        this._nAnimMode = AnimMode.ANIM_ROT;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this._nAnimMode = (this._nAnimMode + 1) % 3;
        }, this);

        this._nScaleBase = 0;

        this.addEventListener(egret.Event.ENTER_FRAME, (evt: egret.Event) => {
            switch(this._nAnimMode){
                case AnimMode.ANIM_ROT:
                    this._cartoon.rotation += Main.STEP_ROT; 
                    break;
                case AnimMode.ANIM_SCALE:      //缩放范围在 0.5-1 之间
                    this._cartoon.scaleX = this._cartoon.scaleY = 0.5 + 0.5* Math.abs(Math.sin( this._nScaleBase += Main.STEP_SCALE)); 
                    break;
            }
            this._txInfo.text = 
                "选择角度：" + this._cartoon.rotation 
               +"\n缩放比例：" + this._cartoon.scaleX.toFixed(2) 
               +"\n\n轻触进入" +(["旋转","缩放","静止"][this._nAnimMode]) + "模式";
        
            return false;

        }, this);
 
    }
}