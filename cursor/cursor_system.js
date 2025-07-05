class CursorSystem {
    static label = "cursor_system";
    static cursorSize = 32;
    static cursors = [Selector, Pen, PenTool];
    static images = {
        "default": cursorImages["auto"],
        "move-camera": cursorImages["grab"],
        "moving-camera": cursorImages["grabbing"],
        "type": cursorImages["type"],
        "drag": cursorImages["drag"],
        "resize": cursorImages["resizeH"],
        "pointer": cursorImages["pointer"],
        "block": cursorImages["block"],
        "zoom-in": cursorImages["zoomIn"],
        "pen": cursorImages["pen"],
        "pen-tool": cursorImages["pen"],
    }

    constructor(env){
        this.env = env
        this.x = 0
        this.y = 0
        
        this.hPrecisionLine = createLine(0,0,0,0,`stroke-width:1; stroke:red;`)
        this.vPrecisionLine = createLine(0,0,0,0,`stroke-width:1; stroke:red;`)


        this.indicationTextX = createTextSpan('')
        this.indicationTextY = createTextSpan('')
        this.indicationTextAreaX = createText([this.indicationTextX], 0, 0, 'entity-info-text')
        this.indicationTextAreaY = createText([this.indicationTextY], 0, 0, 'entity-info-text')

        this.indicationTextX.style.fontSize = '11px'
        this.indicationTextY.style.fontSize = '11px'

        this.magnetIndicator = createCircle(0, 0, 2, `fill: ${red};`)
        this.magnetIndicator.style.pointerEvents = "none"
        
        this.env.embedSuperVisual(this.hPrecisionLine)
        this.env.embedSuperVisual(this.vPrecisionLine)
        this.env.embedSuperVisual(this.magnetIndicator)
        this.env.embedSuperVisual(this.indicationTextAreaX)
        this.env.embedSuperVisual(this.indicationTextAreaY)

        this.cursors = {}


        //settings
        this.settings = {}
        this.hoveredHtmlEntity = null
        this.pressedHtmlEntity = null
        this.clickedHtmlEntity = null
        this.dblclickedHtmlEntity = null

        this.unhoveredHtmlEntity = null
        this.unpressedHtmlEntity = null
        this.unclickedHtmlEntity = null
        this.undblclickedHtmlEntity = null
        
        this.mousepressing = false
        this.mousemoving = false

        this.setHoveredHtmlEntity = html_entity => {
            this.hoveredHtmlEntity = html_entity;
            if(this.unhoveredHtmlEntity && html_entity.entity == this.unhoveredHtmlEntity.entity)
            this.unhoveredHtmlEntity = null;
        }
        this.setPressedHtmlEntity = html_entity => {
            this.pressedHtmlEntity = html_entity;
            if(this.unpressedHtmlEntity && html_entity.entity == this.unpressedHtmlEntity.entity)
            this.unpressedHtmlEntity = null;
        }
        this.setClickedHtmlEntity = html_entity => {
            this.clickedHtmlEntity = html_entity;
            if(this.unclickedHtmlEntity && html_entity.entity == this.unclickedHtmlEntity.entity)
            this.unclickedHtmlEntity = null;
        }
        this.setDblclickedHtmlEntity = html_entity => {
            this.dblclickedHtmlEntity = html_entity;
            if(this.undblclickedHtmlEntity && html_entity.entity == this.undblclickedHtmlEntity.entity)
            this.undblclickedHtmlEntity = null;
        }

        this.unsetHoveredHtmlEntity = html_entity => {
            this.unhoveredHtmlEntity = html_entity;
            if(this.hoveredHtmlEntity && html_entity.entity == this.hoveredHtmlEntity.entity)
            this.hoveredHtmlEntity = null;
        }
        this.unsetPressedHtmlEntity = html_entity => {
            this.unpressedHtmlEntity = html_entity;
            if(this.pressedHtmlEntity && html_entity.entity == this.pressedHtmlEntity.entity)
            this.pressedHtmlEntity = null;
        }
        this.unsetClickedHtmlEntity = html_entity => {
            this.unclickedHtmlEntity = html_entity;
            if(this.clickedHtmlEntity && html_entity.entity == this.clickedHtmlEntity.entity)
            this.clickedHtmlEntity = null;
        }
        this.unsetDblclickedHtmlEntity = html_entity => {
            this.undblclickedHtmlEntity = html_entity;
            if(this.dblclickedHtmlEntity && html_entity.entity == this.dblclickedHtmlEntity.entity)
            this.dblclickedHtmlEntity = null;
        }


        this.cursors[Selector.label] = new Selector(this);
        this.selector = this.cursors[Selector.label];
        
        this.cursors[Light.label] = new Pen(this, Light.settings);
        this.cursors[Mirror.label] = new Pen(this, Mirror.settings);
        this.cursors[Wall.label] = new Pen(this, Wall.settings);
        this.cursors[ThinLens.label] = new Pen(this, ThinLens.settings);
        this.cursors[SphericalMirror.label] = new Pen(this, SphericalMirror.settings);
        this.cursors[RealObject.label] = new Pen(this, RealObject.settings);



        this.env.root.addEventListener("mousedown", e => {
            if(!this.env.softHover(e)) return;
            this.updatePos(e);
            this.mousepressing = true;
            this.cursor.mousedown(e);
            this.cursor.updateMagnet(e);
        })
        this.env.root.addEventListener("mousemove", e => {
            this.mousemoving = false;
            if(!this.env.softHover(e)) return;
            this.updatePos(e);
            this.cursor.updateMagnet(e);
            this.mousemoving = true;
            this.cursor.mousemove(e);
            this.mousemoving = false;
        })
        this.env.root.addEventListener("mouseup", e => {
            if(!this.env.softHover(e)) return;
            this.updatePos(e);
            this.mousepressing = false;
            this.cursor.mouseup(e);
            this.undisplayPrecisionLines()
        })

        addKeyDownMacro(
            new KeyDownMacro(
                'Shift', 
                () => this.cursor.desactivateMagnet(),
                () => this.cursor.activateMagnet(),
                true,
                false
            )
        )

        this.setMode(Selector.label)
    }
    getX(e){
        if(!e) return this.x;
        let x = e.offsetX/this.env.getZoom();
        if(this.cursor.magnetActivated){
            let sign = x<this.env.grid.origin[0] ? -1 : 1;
            return this.env.grid.origin[0] + sign*stick(sign*(x-this.env.grid.origin[0]), this.env.grid.getZoomedUnit()/2);
        }
        return x;
    }
    getY(e){
        if(!e) return this.y;
        let y = e.offsetY/this.env.getZoom();
        if(this.cursor.magnetActivated){
            let sign = y<this.env.grid.origin[1] ? -1 : 1;
            return this.env.grid.origin[1] + sign*stick(sign*(y-this.env.grid.origin[1]), this.env.grid.getZoomedUnit()/2);
        }
        return y;
    }
    updatePos(e){
        if(!e) return;
        this.x = e.offsetX/this.env.getZoom();
        this.y = e.offsetY/this.env.getZoom();  
    }
    updateZoom(e){
        this.updatePos(e)
        this.cursor.updateZoom(e)
        this.updatePrecisionLines(e)
        this.updateMagnet(e)
    }

    getZoom(){
        return this.env.getZoom();
    }
    getCursor(){
        return this.cursors[this.mode] || this.cursors["default"];
    }
    updatePrecisionLines(e){
        if(this.cursor.noMagnet) return
        const mx = this.getX(e)*this.getZoom(), my = this.getY(e)*this.getZoom()
        const centerX = this.env.getCenterX()*this.getZoom()
        const centerY = this.env.getCenterY()*this.getZoom()
        this.hPrecisionLine.setAttributeNS(null, 'x1', mx)
        this.hPrecisionLine.setAttributeNS(null, 'y1', my)
        this.hPrecisionLine.setAttributeNS(null, 'x2', centerX)
        this.hPrecisionLine.setAttributeNS(null, 'y2', my)
        
        this.vPrecisionLine.setAttributeNS(null, 'x1', mx)
        this.vPrecisionLine.setAttributeNS(null, 'y1', my)
        this.vPrecisionLine.setAttributeNS(null, 'x2', mx)
        this.vPrecisionLine.setAttributeNS(null, 'y2', centerY)
    
        const rectTextX = this.indicationTextX.getBBox()
        const rectTextY = this.indicationTextY.getBBox()

        this.indicationTextX.innerHTML = `${Math.round(
            this.env.outputX(this.getX(e))*1000)/1000}`
        this.indicationTextY.innerHTML = `${Math.round(
            this.env.outputY(this.getY(e))*1000)/1000}`
        const textMarg = 3
        const signYMarg = my<centerY? textMarg+rectTextX.height/2 : -rectTextX.height/4
        const signXMarg = mx<centerX? textMarg : -textMarg-rectTextY.width
        

        this.indicationTextAreaX.setAttributeNS(null, 'x', mx-rectTextX.width/2)
        this.indicationTextAreaX.setAttributeNS(null, 'y', centerY+signYMarg)
        this.indicationTextAreaY.setAttributeNS(null, 'x', centerX+signXMarg)
        this.indicationTextAreaY.setAttributeNS(null, 'y', my+rectTextY.height/4)
    }
    displayPrecisionLines(){
        if(this.cursor.noMagnet) return this.undisplayPrecisionLines()
        this.hPrecisionLine.style.display = ''
        this.vPrecisionLine.style.display = ''
        this.indicationTextAreaX.style.display = ''
        this.indicationTextAreaY.style.display = ''
    }
    undisplayPrecisionLines(){
        this.hPrecisionLine.style.display = 'none'
        this.vPrecisionLine.style.display = 'none'
        this.indicationTextAreaX.style.display = 'none'
        this.indicationTextAreaY.style.display = 'none'
    }
    updateMagnet(e){
        if(this.cursor.noMagnet) return
        if(!this.cursor.magnetActivated){
            this.updatePrecisionLines(e)
            return this.undisplayMagnet()
        }
        this.displayMagnet()
        const zoom = this.env.getZoom()
        this.magnetIndicator.setAttributeNS(
            null, "cx", this.getX(e)*zoom
        )
        this.magnetIndicator.setAttributeNS(
            null, "cy", this.getY(e)*zoom
        )
    }

    displayMagnet(){
        if(this.cursor.noMagnet) return this.undisplayMagnet()
        this.magnetIndicator.style.display = ""
        this.undisplayPrecisionLines()
    }
    undisplayMagnet(){
        this.magnetIndicator.style.display = "none"
        this.displayPrecisionLines()
        this.updatePrecisionLines()
    }

    // modes
    getImage(){
        return this.cursor.getImage();
    }
    setMode(mode){
        if(this.cursor) this.cursor.unselect();
        this.mode = mode;
        this.cursor = this.cursors[this.mode];
        this.cursor.select();
    }
    setImage(pointer){
        pointer = pointer || "default";
        this.pointer = pointer;
        this.applyImage(CursorSystem.images[pointer]);
    }
    applyImage(image){
        this.env.root.style.cursor = image;
    }
    displayCursor(){
        this.applyImage(this.__lastCursorImage);
    }
    undisplayCursor(){
        this.__lastCursorImage = CursorSystem.images[this.mode];
        this.env.root.style.cursor = "none";
    }
    
    resetPrevImage(){
        this.applyImage(CursorSystem.images[this.pointer]);
        
    }
    setTempImage(pointer){
        this.applyImage(CursorSystem.images[pointer]);
    }
}