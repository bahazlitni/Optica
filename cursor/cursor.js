class Cursor {
    static label = "cursor"
    
    constructor(sys, settings){
        this.sys = sys
        this.settings = settings || {}
        this.pointer = "default"
        this.magnetActivated = false

        this.mousemove   = () => null
        this.mouseup     = () => null
        this.onmousedown = () => null
        this.onmousemove = () => null
        this.onmouseup   = () => null

        this.sys.env.root.addEventListener("mousedown", e => this.onmousedown(e));
        this.sys.env.root.addEventListener("mousemove", e => this.onmousemove(e));
        this.sys.env.root.addEventListener("mouseup", e => this.onmouseup(e));
        this.sys.env.root.addEventListener("mouseleave", e => this.onmouseup(e));
    
    }
    getMode(){ return this.sys.mode }
    getImage(){ return CursorSystem.cursorImages[this.getMode()] }
    getX(e){ return this.sys.getX(e) }
    getY(e){ return this.sys.getY(e) }

    mousedown(e){
        this.mousemove = e => this.ifmousemove(e)
        this.mouseup = e => {
            this.ifmouseup(e)
            this.mousemove = e => null
            this.mouseup = e => null
        }
    }
    ifmousemove(e){}
    ifmouseup(e){}

    __onmousedown(e){}
    __onmousemove(e){
        this.sys.undisplayMagnet()
        this.sys.undisplayPrecisionLines()
    }
    __onmouseup(e){
        this.sys.updateMagnet()
    }

    activateMagnet(){}
    desactivateMagnet(){}

    displayMagnet(){}
    undisplayMagnet(){}
    updateMagnet(){}

    updateZoom(){ 
        this.updateMagnet()
        this.sys.selector.updateRect();
        this.sys.selector.updateGrpRect();
    }

    select(){
        this.onmousedown = e => this.__onmousedown(e)
        this.onmousemove = e => this.__onmousemove(e)
        this.onmouseup = e => this.__onmouseup(e)
        this.sys.setImage(this.pointer)
        this.activateMagnet()
    };
    unselect(){
        this.onmousedown = e => null;
        this.onmousemove = e => null;
        this.onmouseup = e => null;
        this.sys.setImage();
    };
}