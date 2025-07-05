class Selector extends Cursor {
    static label = "default";

    constructor(sys){
        super(sys);
        this.selectionBoard = this.sys.env.selectionBoard;
        this.noMagnet = true


        this.selection = [];

        this.boxOriginX = 0;
        this.boxOriginY = 0;
        this.box = [0, 0, 0, 0];
        this.grpRectBox = [0, 0, 0, 0];
        
        this.rect = createRect(0, 0, 0, 0, `stroke: rgba(255, 255, 255, 1); stroke-width: 1px; fill: rgba(255, 255, 255, 0.1);`);
        this.grpRect = createRect(0, 0, 0, 0, `stroke: ${selectionColor}; stroke-width: 2px; stroke-dasharray: 5 10;`);



        this.sys.env.embedSuperVisual(this.grpRect);
        this.sys.env.embedSuperVisual(this.rect);
        this.undisplayRect()
        this.undisplayGrpRect()
    }
    select(){
        this.sys.undisplayPrecisionLines()
    }
    __onmousemove(e){
        super.__onmousemove(e);
        if(e.button != 0) return

        if(this.sys.mousepressing) {
            if(this.sys.hoveredHtmlEntity)
            this.sys.hoveredHtmlEntity.entity.unhover(e);
            return;
        };
        if(this.sys.hoveredHtmlEntity)
        this.sys.hoveredHtmlEntity.entity.hover(e);

        if(this.sys.unhoveredHtmlEntity)
        this.sys.unhoveredHtmlEntity.entity.unhover(e);
    }

    mousedown(e){
        super.mousedown(e);
        if(e.button != 0) return
        if(this.sys.env.hover(e)) this.resetSelection();
        
        this.boxOriginX = this.getX(e);
        this.boxOriginY = this.getY(e);
        this.box[0] = this.boxOriginX;
        this.box[1] = this.boxOriginY;
        this.box[2] = 0;
        this.box[3] = 0;
        this.displayRect();
        this.updateRect();
        
        if(this.sys.hoveredHtmlEntity){
            if(!e.shiftKey) this.resetSelection();
            this.addSelection(this.sys.hoveredHtmlEntity.entity);
        }

    }
    ifmousemove(e){
        super.ifmousemove(e);
        if(e.button != 0) return
        const x = this.getX(e);
        const y = this.getY(e);

        if(x < this.boxOriginX){
            this.box[2] = this.boxOriginX-x;
            this.box[0] = x;
        }
        else {
            this.box[0] = this.boxOriginX;
            this.box[2] = x-this.box[0];
            
        }

        if(y < this.boxOriginY){
            this.box[3] = this.boxOriginY-y;
            this.box[1] = y;
        }
        else {
            this.box[1] = this.boxOriginY;
            this.box[3] = y-this.box[1];
        }

        this.updateRect();
        this.updateSelection();
    }
    ifmouseup(e){
        super.ifmouseup(e);
        this.undisplayRect();
        
        if(this.selection.length<2) this.undisplayGrpRect();
        else {
            this.displayGrpRect();
            this.updateGrpRectBox();
            this.updateGrpRect();
        }

        this.selectionBoard.renderSelectionSheet(this.constructSelectionSheet());
    }

    constructSelectionSheet(){
        if(!this.selection) return null;
        if(this.hasOneSelection())
        return this.selection[0].cls.selectionSheet;
        
        let selectionSheet = [];
        let classes = [];
        for(let selection of this.selection){
            if(!findIn(selection.cls, classes)) classes.push(selection.cls);
        }
        let biggestCls = null;
        let m = -Infinity;

        for(let cls of classes){
            if(cls == Light) 
            selectionSheet.push(
                {
                    tag: "Light",
                    inputs: Light.selectionSheet[0].inputs
                }
            )
            else {
                let n = cls.selectionSheet[0].inputs.length;
                if(n>m){
                    m = n;
                    biggestCls = cls;
                }
            }
        }

        if(biggestCls){
            selectionSheet.push(
                {
                    tag: "Plane: Physical",
                    inputs: biggestCls.selectionSheet[0].inputs
                }
            )
            selectionSheet.push(
                {
                    tag: "Plane: Visual",
                    inputs: biggestCls.selectionSheet[1]?.inputs || []
                }
            ) 
        }
        return selectionSheet;
    }

    addSelection(selection){
        selection.select();
        if(findIn(selection, this.selection)) return;
        this.selection.push(selection);
    }
    removeSelection(selection){
        selection.unselect();
        removeFromList(this.selection, selection);
    }

    updateSelection(){
        for(let key in this.sys.env.entities){
            for(let entity of this.sys.env.entities[key]){
                if(entity.isOnSelection(this.box)) this.addSelection(entity);
                else this.removeSelection(entity);
            }
        }
    }
    resetSelection(){
        for(let selection of this.selection)
        selection.unselect();
    
        this.selection = [];
        this.box = [0, 0, 0, 0];
        this.grpRectBox = [0, 0, 0, 0];
        this.undisplayGrpRect();
        this.selectionBoard.undisplay()
    }

    //PREDICATS
    hasOneSelection(){
        return this.selection.length == 1;
    }

    //VISUAL
    updateRect(){
        if(this.sys.mode != 'default') return
        if(this.rect.style.display == "none") return;
        const zoom = this.sys.getZoom();
        this.rect.setAttributeNS(null, 'x', this.box[0]*zoom);
        this.rect.setAttributeNS(null, 'y', this.box[1]*zoom);
        this.rect.setAttributeNS(null, 'width', this.box[2]*zoom);
        this.rect.setAttributeNS(null, 'height', this.box[3]*zoom);
    }
    updateGrpRectBox(){
        let boxes = [];
        for(let selection of this.selection)
        boxes.push(selection.getBBox());

        let box = getBBoxFromBoxes(boxes);
        this.grpRectBox[0] = box[0];
        this.grpRectBox[1] = box[1];
        this.grpRectBox[2] = box[2];
        this.grpRectBox[3] = box[3];
    }
    updateGrpRect(){
        if(this.grpRect.style.display == "none") return;
        const zoom = this.sys.getZoom();
        this.grpRect.setAttributeNS(null, 'x', this.grpRectBox[0]*zoom);
        this.grpRect.setAttributeNS(null, 'y', this.grpRectBox[1]*zoom);
        this.grpRect.setAttributeNS(null, 'width',  this.grpRectBox[2]*zoom);
        this.grpRect.setAttributeNS(null, 'height', this.grpRectBox[3]*zoom);
    }
    displayRect(){
        this.rect.style.display = "unset";
    }
    undisplayRect(){
        this.rect.style.display = "none";
    }
    displayGrpRect(){
        this.grpRect.style.display = "unset";
    }
    undisplayGrpRect(){
        this.grpRect.style.display = "none";
    }

    updateSelectionData(){
        this.updateGrpRectBox();
        this.updateGrpRect();
    }
}