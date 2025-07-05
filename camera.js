class Camera {
    static zooms = [
        0.1, 
        0.25, 
        THIRD, 
        TWOTHIRDS, 
        0.75, 
        0.8, 
        0.9, 
        1, 
        1.1, 
        1.25, 
        1.5, 
        1.75, 
        2, 
        2.5, 
        3, 
        4, 
        5, 
        6, 
        8, 
        10, 
        12, 
        15, 
        20, 
        25, 
        30,
        50,
        100,
        200,
        250,
        300,
        400,
        500
    ];
    
    constructor(env){
        this.env = env;
        this.zoom = 1;
        this.deltaZoom = 0;

        this.__lastSpacePress = 0;
        this.__spacePressed = false;

        document.addEventListener("keypress", e => {
            if(this.__spacePressed || !this.env.isOnHover || e.code != "Space") return;
            if(this.__lastSpacePress){
                if(new Date().getTime()-this.__lastSpacePress<500) this.center();
                this.__lastSpacePress = 0;
            } 
            else this.__lastSpacePress = new Date().getTime();
            this.activate(e);
            this.__spacePressed = true;
        });
        document.addEventListener("keyup", e => {
            if(!this.__spacePressed) return;
            if(this.__lastSpacePress){
                if(new Date().getTime()-this.__lastSpacePress>=1000) this.__lastSpacePress=0;
            }
            this.desactivate(e);
            this.__spacePressed = false;
        });

        
        this.mousemove = e => null;
        this.mouseup = e => null;

        // scale indicator
        this.scaleIndicatorPath = createPath("", "fill: none; stroke: white; stroke-width: 1px;");
        this.scaleIndicatorSvg = createSvg([this.scaleIndicatorPath], "fill: none;", "pointer-events: none;");
        this.scaleIndicatorTextP = createP("", "environment-info-text", null, 
        "text-align: center; font-size: 14px !important; left: 50%; transform: translateX(-50%); color: white;");

        this.distanceIndicatorTextP = createP("", "environment-info-text", null, "text-align: right; right: 0; color: white;");
        this.scaleIndicatorTextDiv = createDiv([this.distanceIndicatorTextP, this.scaleIndicatorTextP], null, null, 
            "display: flex; width: 100%; justify-content: space-between;");
            
        this.scaleIndicatorDiv = createDiv([this.scaleIndicatorSvg, this.scaleIndicatorTextDiv], 
        "camera-scale-indicator-div", null);


        this.env.embedFixedVisualInfo(this.scaleIndicatorDiv);

        this.env.root.addEventListener("mousedown", e => this.mousedown(e));
        this.env.root.addEventListener("mousemove", e => this.mousemove(e));
        this.env.root.addEventListener("mouseup", e => this.mouseup(e));
        this.env.root.addEventListener("mouseleave", e => this.mouseup(e));
        this.env.root.addEventListener("mousewheel", e => this.mousewheel(e));

        this.x = 0;
        this.y = 0;
    }
    getZoom(){
        return this.zoom;
    }

    mousedown(e){
        if(!this.env.isOnHover) return;
        this.mouseup = e => this.ifmouseupKey(e);
        if(e.button == 1) {
            this.activate(e);
            this.mouseup = e => this.ifmouseupBtn1(e);
        }
        else if(!this.isActivated) {
            this.mouseup = e => null;
            return;
        }
        this.__lastSpacePress = 0;
        this.mousemove = e => this.ifmousemove(e);
        this.isMoving = false;

        this.originX = e.offsetX/this.zoom;
        this.originY = e.offsetY/this.zoom;
        this.env.cursorSystem.setTempImage("move-camera");
    }
    ifmousemove(e){
        if(!this.env.softHover(e)){
            this.env.cursorSystem.setTempImage("block");
            this.__blockedOnMouseMove = true;
            return;
        }
        if(this.__blockedOnMouseMove){
            this.env.cursorSystem.setTempImage("moving-camera");
            this.__blockedOnMouseMove = false;
        }
        if(!this.isMoving) this.env.cursorSystem.setTempImage("moving-camera");

        this.isMoving = true;
        this.setPosition(
            this.x - e.offsetX/this.zoom + this.originX,
            this.y - e.offsetY/this.zoom + this.originY
        );
    }
    ifmouseupKey(e){
        this.isMoving = false;
        this.env.cursorSystem.setTempImage("move-camera");
        this.mousemove = e => null;
    }
    ifmouseupBtn1(e){
        this.isMoving = false;
        this.desactivate(e);
    }

    mousewheel(e){
        if(!this.env.isOnHover || this.isMoving) return;
        this.ifmousewheel(e);
    }
    ifmousewheel(e){
        this.mousezoom(e);
    }

    activate(e){
        this.isActivated = true;
        this.env.cursorSystem.setTempImage("move-camera");
        this.mousemove = e => null;
        this.mouseup = e => null;
    }
    desactivate(e){
        this.isActivated = false;
        this.env.cursorSystem.resetPrevImage();
        this.mousemove = e => null;
        this.mouseup = e => null;
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
        this.env.updatePosition();
    }
    center(){
        this.setPosition(
            this.env.getCenterX() - this.env.w/2/this.zoom, 
            this.env.getCenterY() - this.env.h/2/this.zoom
        );
    }


    mousezoom(e){
        let i = Camera.zooms.indexOf(this.getZoom())+detectMouseWheelDirection(e);
        if(i<0 || i >= Camera.zooms.length) return;
        this.setZoom(
            Camera.zooms[i],
            e.offsetX/this.getZoom(), 
            e.offsetY/this.getZoom()
        );
    }
    setZoom(zoom, x, y){
        if(!zoom) return;
        if(!x && x!=0) x = this.env.getCenterX();
        if(!y && y!=0) y = this.env.getCenterY();

        this.deltaZoom = zoom-this.zoom;
        this.zoom = zoom;

        this.setPosition(
            this.x + (x-this.x)*this.deltaZoom/this.zoom,
            this.y + (y-this.y)*this.deltaZoom/this.zoom
        );
        this.env.updateZoom();

        this.displayScaleIndicator();
        this.updateScaleIndicatorText();
        setTimeout(() => {
            if(new Date().getTime()-this.indicatorScaleTimeDisplayed>2000)
                this.undisplayScaleIndicator();
        }, 2500);
    }

    updateScaleIndicatorText(){
        let w = 100/this.env.grid.getUnitDivider()*this.zoom;
        let h = 5;
        let x2 = this.getScaleIndicatorX();
        let y2 = this.getScaleIndicatorY();
        let x1 = x2-w; 
        let y1 = y2-h;

        let scaleIndicatorText;
        if(this.zoom<10) scaleIndicatorText = `${parseInt(stick(this.zoom*100, 0.01)*100)/100}%`;
        else scaleIndicatorText = `${this.zoom}X`;

        let distanceIndicatorText = `${parseInt(stick(100/this.env.grid.getUnitDivider(), 0.01)*100)/100}px`;
        
        this.scaleIndicatorDiv.style.left = x1 + "px";
        this.scaleIndicatorDiv.style.top  = y1 + "px";
        this.scaleIndicatorDiv.style.width = w + "px";
        this.scaleIndicatorSvg.style.height = h + "px";

        this.scaleIndicatorTextP.style.top = -h*3+"px";

        this.scaleIndicatorPath.setAttributeNS(null, "d", `M0 0L0 ${h}L${w} ${h}L${w} 0`);
        

        this.scaleIndicatorTextP.innerText = scaleIndicatorText;
        this.distanceIndicatorTextP.innerText = distanceIndicatorText;
    }
    displayScaleIndicator(){
        this.indicatorScaleTimeDisplayed = new Date().getTime();
        this.scaleIndicatorDiv.style.display = "unset";
    }
    undisplayScaleIndicator(){
        this.scaleIndicatorDiv.style.display = "none";
    }

    getScaleIndicatorX(){
        return this.env.w*0.97;
    }
    getScaleIndicatorY(){
        return this.env.h*0.94;
    }

    getBBox(){
        return [this.x/this.zoom, this.y/this.zoom, this.env.w/this.zoom, this.env.h/this.zoom]
    }
}