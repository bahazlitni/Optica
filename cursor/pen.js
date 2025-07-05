class Pen extends Cursor {
    static label = "pen";
    
    constructor(sys, settings){
        super(sys, settings);
        this.pointer = "pen";

        this.selection = [];

        this.settings = settings;
        this.magnetIndicator = createCircle(0, 0, 2, `fill: ${red}`)
        this.magnetIndicator.style.pointerEvents = "none"
        this.sys.env.embedSuperVisual(this.magnetIndicator)
    }
    select(){
        super.select();
        for(let key in this.sys.env.entities){
            for(let entity of this.sys.env.entities[key])
            entity.desactivatePointerEvents();
        }

        if(this.sys.env.entities[this.sys.mode]){
            for(let entity of this.sys.env.entities[this.sys.mode])
            entity.activateEditting();
        }
        
        this.activateMagnet()
    }
    unselect(){
        super.unselect();
        for(let key in this.sys.env.entities){
            for(let entity of this.sys.env.entities[key])
            entity.activatePointerEvents();
        }
        if(this.sys.env.entities[this.sys.mode]){
            for(let entity of this.sys.env.entities[this.sys.mode])
            entity.desactivateEditting();
        }
    }

    mousedown(e){
        super.mousedown(e);
        if(!e.button == 0) return;
        if(this.sys.hoveredHtmlEntity && this.sys.hoveredHtmlEntity.entity.cls.label == this.sys.mode){
            this.sys.hoveredHtmlEntity.mousedown(e);
            if(!e.shiftKey) this.sys.selector.resetSelection();
            this.sys.selector.addSelection(this.sys.hoveredHtmlEntity.entity);
        }
        else if(e.altKey && e.ctrlKey || 
        this.sys.env.hover(e) && !this.sys.env.camera.isActivated){
            this.sys.env.selectionBoard.undisplay();
            Environment.entityConverter[this.sys.mode].mousedown(e, this.sys, Environment.entityConverter[this.sys.mode]);
            this.sys.selector.resetSelection();
        }
    }
    __onmousemove(e){
        super.__onmousemove(e)

        if(this.sys.unhoveredHtmlEntity){
            if(this.sys.unhoveredHtmlEntity.entity.cls.label == this.sys.mode){
                this.sys.unhoveredHtmlEntity.entity.unhover(e)
                this.displayMagnet()
            }
        }
        if(this.sys.mousepressing) return
        if(this.sys.hoveredHtmlEntity){
            if(this.sys.hoveredHtmlEntity.entity.cls.label == this.sys.mode){
                this.sys.hoveredHtmlEntity.entity.hover(e)
                this.undisplayMagnet()
            }
        }
        this.sys.updateMagnet(e)
    }

    ifmousemove(e){
        super.ifmousemove(e)
        
    }
    ifmouseup(e){
        super.ifmouseup(e)
        this.sys.selector.updateGrpRect()
    }
    activateMagnet(){
        super.activateMagnet()
        this.magnetActivated = true
        this.sys.displayMagnet()
        this.sys.updateMagnet()
    }
    desactivateMagnet(){
        super.desactivateMagnet()
        this.magnetActivated = false
        this.sys.undisplayMagnet()
    }
}