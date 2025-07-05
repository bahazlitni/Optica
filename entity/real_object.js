class RealObjectTwoCircles extends TwoCircles {
	constructor(entity){
		super(entity)
	}
	ifmousedown(e){
		super.ifmousedown(e)
		if(e.srcElement == this.endCircle)
		this.endCircle.style.display = 'none'
    }
    ifmouseup(e){
        super.ifmouseup(e)
		this.endCircle.style.display = ''
    }
}

class RealObjectStick extends HTMLEntity {
    static defaults = {
        magnetWidth: 5,
    }

    constructor(plane, modes, magnetW){
        super(plane, modes);

        this.magnetWidth = magnetW || RealObjectStick.defaults.magnetWidth;

		this.srcText = createTextSpan();
        this.srcTextArea = createText([this.srcText], 0, 0, "environment-info-text");
		
		this.endText = createTextSpan();
        this.endTextArea = createText([this.endText], 0, 0, "environment-info-text");

		this.arrowAngle = Math.PI/180*55
		this.arrowLength = 12
		this.arrow = createPath('')

		this.srcTextArea.style.display = ''
		this.endTextArea.style.display = ''

		this.addHTMLElement(this.arrow, "visual");
        this.addHTMLElement(this.srcTextArea, "visual");
		this.addHTMLElement(this.endTextArea, "visual");

        this.stick = createLine(0, 0, 0, 0);
        this.magnet = createLine(0, 0, 0, 0, "stroke: transparent;");
        this.addHTMLElement(this.stick, "visual");
        this.addHTMLElement(this.magnet, "html");
    }
    activatePointerEvents(){
        super.activatePointerEvents();
        this.magnet.style.pointerEvents = "stroke";
    }
    desactivatePointerEvents(){
        super.desactivatePointerEvents();
        this.magnet.style.pointerEvents = "none";
    }

    changeX(v){
		const deltaX = v-parseFloat(this.stick.getAttributeNS(null, 'x1'))
        changeLineX(this.stick, v)
        changeLineX(this.magnet, v)

		this.srcTextArea.setAttributeNS(null, "x", 
		parseFloat(this.srcTextArea.getAttributeNS(null, 'x'))+deltaX)

		this.endTextArea.setAttributeNS(null, "x", 
		parseFloat(this.endTextArea.getAttributeNS(null, 'x'))+deltaX)
    }
    changeY(v){
		const deltaY = v-parseFloat(this.stick.getAttributeNS(null, 'y1'))
        changeLineY(this.stick, v)
        changeLineY(this.magnet, v)

		this.srcTextArea.setAttributeNS(null, "y", 
		parseFloat(this.srcTextArea.getAttributeNS(null, 'y'))+deltaY)

		this.endTextArea.setAttributeNS(null, "y", 
		parseFloat(this.endTextArea.getAttributeNS(null, 'y'))+deltaY)
    }
    changeW(v){
        changeLineW(this.stick, v);
        changeLineW(this.magnet, v+this.magnetWidth);
		this.arrow.setAttributeNS(null, 'stroke-width', v)
    };
	changeH(v){
		this.changeW(v)
	}
    changeColor(color) {
		const srcColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        this.stick.setAttributeNS(null, "stroke", srcColor);
		this.srcTextArea.setAttributeNS(null, 'fill', srcColor)
		this.endTextArea.setAttributeNS(null, 'fill', srcColor)
		this.arrow.setAttributeNS(null, 'stroke', srcColor)
	}
    changeOpacity(v){
        this.stick.setAttributeNS(null, "opacity", v);
    }
	changeSrcText(text){
		this.srcText.innerHTML = text
	}
	changeEndText(text){
		this.endText.innerHTML = text
	}
    updateX(){ 
        this.changeX(this.entity.matrix[0][0]*this.getZoom());
    }
    updateY(){ 
        this.changeY(this.entity.matrix[0][1]*this.getZoom());
    }
    updateW(){ 
        this.changeW(this.entity.w);
    }
    updateH(){ 
        this.updateRotation();
    }
    updateColor(){
        this.changeColor(this.entity.color);
    }
    updateOpacity(){ 
        this.changeOpacity(this.entity.color[3]);
    }
    updateRotation(){
        this.stick.setAttributeNS(null, "x1", this.entity.matrix[0][0]*this.getZoom());
        this.stick.setAttributeNS(null, "x2", this.entity.matrix[1][0]*this.getZoom());
        this.stick.setAttributeNS(null, "y1", this.entity.matrix[0][1]*this.getZoom());
        this.stick.setAttributeNS(null, "y2", this.entity.matrix[1][1]*this.getZoom());

        this.magnet.setAttributeNS(null, "x1", this.entity.matrix[0][0]*this.getZoom());
        this.magnet.setAttributeNS(null, "x2", this.entity.matrix[1][0]*this.getZoom());
        this.magnet.setAttributeNS(null, "y1", this.entity.matrix[0][1]*this.getZoom());
        this.magnet.setAttributeNS(null, "y2", this.entity.matrix[1][1]*this.getZoom());


		const x1Path = this.entity.matrix[1][0]*this.getZoom()-Math.sin(this.arrowAngle+this.entity.angle)*this.arrowLength
		const y1Path = this.entity.matrix[1][1]*this.getZoom()+Math.cos(this.arrowAngle+this.entity.angle)*this.arrowLength
		const x2Path = this.entity.matrix[1][0]*this.getZoom()+Math.sin(-this.arrowAngle+this.entity.angle)*this.arrowLength
		const y2Path = this.entity.matrix[1][1]*this.getZoom()-Math.cos(-this.arrowAngle+this.entity.angle)*this.arrowLength

		this.arrow.setAttributeNS(null, 'd', 
			`M${x1Path} ${y1Path}` +
			`L${this.entity.matrix[1][0]*this.getZoom()}`+
			` ${this.entity.matrix[1][1]*this.getZoom()}`+
			`L${x2Path} ${y2Path}`
		)


		const ang = absAngle(this.entity.angle)
		const rect1 = this.srcText.getBBox()
		const rect2 = this.endText.getBBox()
		const marg = 20


		const x1 = this.entity.matrix[0][0]*this.getZoom()-marg*this.entity.vector[0]
		const y1 = this.entity.matrix[0][1]*this.getZoom()-marg*this.entity.vector[1]
		const x2 = this.entity.matrix[1][0]*this.getZoom()+marg*this.entity.vector[0]
		const y2 = this.entity.matrix[1][1]*this.getZoom()+marg*this.entity.vector[1]

		var transX1, transY1, transX2, transY2
		if(ang<DEG45 || ang>=DEG315){
			transX2 = 0
			transY2 = rect2.height/4
			transX1 = -rect1.width
			transY1 = rect1.height/4
		}
		else if(ang>=DEG45 && ang<DEG135){
			transX2 = -rect2.width/2
			transY2 = rect2.height/2
			transX1 = -rect1.width/2
			transY1 = 0
		}
		else if(ang>=DEG135 && ang<DEG225){
			transX2 = -rect2.width
			transY2 = rect2.height/4
			transX1 = 0
			transY1 = rect1.height/4
		}
		else {
			transX2 = -rect2.width/2
			transY2 = 0
			transX1 = -rect1.width/2
			transY1 = rect1.height/2
		}

		this.srcTextArea.setAttributeNS(null, "x", x1+transX1)
		this.srcTextArea.setAttributeNS(null, "y", y1+transY1)
		this.endTextArea.setAttributeNS(null, "x", x2+transX2)
		this.endTextArea.setAttributeNS(null, "y", y2+transY2)
	}
	updateIsReal(){
		if(!this.entity.isReal)
		this.stick.setAttributeNS(null, 'stroke-dasharray', '6 8')
		else 
		this.stick.setAttributeNS(null, 'stroke-dasharray', '')
	}
	updateSrcText(){
		this.changeSrcText(this.entity.srcText)
	}
	updateEndText(){
		this.changeEndText(this.entity.endText)
	}
    ifmousedown(e){
        super.ifmousedown(e);
        this.entity.moving = true;
		this.entity.env.cursorSystem.setTempImage("pointer");
		this.__diffCx = this.entity.env.cursorSystem.getX(e)-this.entity.x;
		this.__diffCy = this.entity.env.cursorSystem.getY(e)-this.entity.y;
        this.entity.arc.undisplay();
    }
    
    ifmousemove(e){
        super.ifmousemove(e);
        if(this.entity.env.getCursorMode() != this.entity.cls.label) return;
        if(this.entity.edittingActivated)
		this.entity.changePosition(this.entity.env.cursorSystem.getX(e)-this.__diffCx, this.entity.env.cursorSystem.getY(e)-this.__diffCy);
    }
    ifmouseup(e){
        super.ifmouseup(e);
        this.entity.moving = false;
        this.entity.arc.display();
		this.entity.env.cursorSystem.resetPrevImage();
    }
}
class RealObjectLightSticker extends HTMLEntity {
    constructor(entity){
        super(entity)
        this.circle = createCircle(0, 0, 0, 'stroke-dasharray: 3,3;')
        this.circleMarg = 12
        this.addHTMLElement(this.circle, "html")

        this.undisplay()
    }
    activatePointerEvents(){
        super.activatePointerEvents()
        this.circle.style.pointerEvents = "all"
    }
    desactivatePointerEvents(){
        super.desactivatePointerEvents()
        this.circle.style.pointerEvents = "none"
    }

    changeX(v){
        this.circle.setAttributeNS(null, "cx", v)
    }
    changeY(v){
		this.circle.setAttributeNS(null, "cy", v)
    }
    changeW(v){
		this.circle.setAttributeNS(null, 'r', v+this.circleMarg)
    }
	changeH(v){
		this.changeW(v)
	}
    changeColor(color) {
		this.circle.setAttributeNS(null, 'stroke', `rgb(${color[0]}, ${color[1]}, ${color[2]})`)
	}
    updateX(){ 
        this.changeX(this.entity.matrix[0][0]*this.getZoom());
    }
    updateY(){ 
        this.changeY(this.entity.matrix[0][1]*this.getZoom());
    }
    updateW(){ 
        this.changeW(this.entity.w);
    }
    updateColor(){
        this.changeColor(this.entity.color);
    }
    updateRotation(){
        this.circle.setAttributeNS(null, "cx", this.entity.matrix[1][0]*this.getZoom());
        this.circle.setAttributeNS(null, "cy", this.entity.matrix[1][1]*this.getZoom());
	}
    updateIsReal(){

    }
}

class RealObject extends NonPhysicalEntity {
    static label = "real-object";
    static name = "Real Object";

    static newEntities = {};
    static newEntity = null;
    static entityAddress = 0;

    static undo = () => null;

    static pointer = "pen";
    static settings = {
        w: 2,
		color: [255, 255, 255, 1]
    };
	static getNextPointNames(){
		let iA = -1
		let iB = -1
		const f = i => i==0? '' : (i==1? '\'' : i==2? '\'\'' : i.toString())
		const g = str => str == ''? 0 : str == '\''? 1 : str == '\'\''? 2 : parseInt(str)
		for(let address in RealObject.newEntities){
			const e = RealObject.newEntities[address]
			if(e.isDeleted) continue
			if(e.srcText[0] == 'A'){
				const n = g(e.srcText.slice(1))
				if(iA<n) iA = n
			}
			if(e.endText[0] == 'A'){
				const n = g(e.endText.slice(1))
				if(iA<n) iA = n
			}
			else if(e.srcText[0] == 'B'){
				const n = g(e.srcText.slice(1))
				if(iB<n) iB = n
				
			}
			else if(e.endText[0] == 'B'){
				const n = g(e.endText.slice(1))
				if(iB<n) iB = n
			}
		
		}
		return [`A${f(iA+1)}`, `B${f(iB+1)}`]
	}

    static selectionSheet = [
        { 
            tag: "Physical",
            inputs: [
                new EntityInputSheet("X A", 1, "1fr", (selection, e) => Entity.inputX(selection, e), selection => Entity.outputX(selection), null,
                selection => selection.filter(selected => selected.cls == RealObject)),
                new EntityInputSheet("Y A", 1, "1fr", (selection, e) => Entity.inputY(selection, e), selection => Entity.outputY(selection), null,
                selection => selection.filter(selected => selected.cls == RealObject)),
                new EntityInputSheet("X B", 2, "1fr", (selection, e) => Entity.inputX(selection, e), selection => Entity.outputX(selection), null,
                selection => selection.filter(selected => selected.cls == RealObject)),
                new EntityInputSheet("Y B", 2, "1fr", (selection, e) => Entity.inputY(selection, e), selection => Entity.outputY(selection), null,
                selection => selection.filter(selected => selected.cls == RealObject)),
                new EntityInputSheet("Angle", 3, "1fr", (selection, e) => Entity.inputAngle(selection, e), selection => Entity.outputAngle(selection), "°",
                selection => selection.filter(selected => selected.cls == RealObject)),
                new EntityInputSheet("Height", 3, "1fr", 
				(selection, e) => Entity.inputH(selection, e), 
				selection => Entity.outputH(selection), null,
                selection => selection.filter(selected => selected.cls == RealObject)),
				new EntityInputSheet("Point 1", 4, "1fr", 
				(selection, e) => Entity.inputText(selection, e, (selected, text) => selected.setSrcText(text)), 
				selection => Entity.outputText(selection, selected => selected.srcText), null,
                selection => selection.filter(selected => selected.cls == RealObject)),
				new EntityInputSheet("Point 2", 4, "1fr", 
				(selection, e) => Entity.inputText(selection, e, (selected, text) => selected.setEndText(text)), 
				selection => Entity.outputText(selection, selected => selected.endText), null,
                selection => selection.filter(selected => selected.cls == RealObject)),
				new EntityInputSheet("Is Virtual", 5, "50%", 
				(selection, e) => Entity.inputBoolean(selection, e, (selected, bool) => selected.setIsReal(!bool)), 
				selection => Entity.outputText(selection, selected => !selected.isReal), null,
                selection => selection.filter(selected => selected.cls == RealObject), 'checkbox'),
            ]
        },
    ];

    static mousedown(e, cursorSystem, Class){
        Class = Class || RealObject;
        Entity.mousedown(e, cursorSystem, Class);
        Class.newEntity.changeW(cursorSystem.cursor.settings.w);
		Class.newEntity.changeColor(cursorSystem.cursor.settings.color);
        Class.newEntity.twoCircles.mousedown(e, Class.label, "edit");
		Class.newEntity.twoCircles.endCircle.style.display = 'none'
		Class.newEntity.setIsReal(!e.shiftKey)
    }
    static mousemove(e, cursorSystem, Class){
        Class = Class || RealObject;
        Entity.mousemove(e, cursorSystem, Class);
        Class.newEntity.twoCircles.ifmousemove(e);
    }
    static mouseup(e, cursorSystem, Class){
        Class = Class || RealObject;
        Class.newEntity.twoCircles.mouseup(e, Class.label);
        Entity.mouseup(e, cursorSystem, Class);
		Class.newEntity.setIsReal(!e.shiftKey)
    }
    static mouseleave(e, cursorSystem, Class){
        Class = Class || RealObject;
        Class.newEntity.twoCircles.mouseleave(e, Class.label);
    }
    static mouseover(e, cursorSystem, Class){
        Class = Class || RealObject;
        Class.newEntity.twoCircles.mouseover(e, Class.label);
    }

    constructor(address, cls){
        super(address, cls || RealObject);

        this.matrix = [[0, 0], [0, 0]];
		this.x = 0
		this.y = 0
        this.h = 0
		this.w = 0
        this.angle = 0
		this.srcText = ''
		this.endText = ''
		this.isReal = true
        this.beams = []

        this.stickLightCircle = createCircle(0,0,0)


        //arc
        this.arc = new ArcVisual(this);
        this.pushHtmlEntity(this.arc);

        // html
        this.line = new RealObjectStick(this)
        this.pushHtmlEntity(this.line)
        this.twoCircles = new RealObjectTwoCircles(this)
        this.pushHtmlEntity(this.twoCircles)

        this.lightSticker = new RealObjectLightSticker(this)
        this.pushHtmlEntity(this.lightSticker)

		const genericLabels = RealObject.getNextPointNames()
		this.setSrcText(genericLabels[0])
		this.setEndText(genericLabels[1])

        
    }

    getStatus(){
        const status = super.getStatus();
        status.h = this.h;
        return status;
    }
    setStatus(status){
        super.setStatus(status);
        this.setH(status.h);
    }

    getColor(){
        return this.color;
    }

    updateMatrix(){
        this.matrix[0][0] = this.x;
        this.matrix[0][1] = this.y;
        this.matrix[1][0] = this.x + this.vector[0]*this.h;
        this.matrix[1][1] = this.y + this.vector[1]*this.h;
        this.twoCircles.updateRotation()
		this.line.updateRotation()
        this.lightSticker.updateRotation()

        for(let beam of this.beams)
            beam.setSrcPosition(this.matrix[1][0], this.matrix[1][1])
    }
	setIsReal(isReal){
		this.isReal = isReal
		this.line.updateIsReal()
        this.lightSticker.updateIsReal()
	}
    setSrcX(x){
		super.setX(x)
        this.matrix[0][0] = x || 0
        this.h = lineDistance(this.matrix)
        this.setAngle( lineAngle(this.matrix) )
    }
    setSrcY(y){
		super.setY(y)
        this.matrix[0][1] = y || 0
        this.h = lineDistance(this.matrix)
        this.setAngle( lineAngle(this.matrix) )
    }
    setSrcPosition(x, y){
		super.setX(x)
		super.setY(y)
        this.matrix[0][0] = this.x || 0
        this.matrix[0][1] = this.y || 0
        this.h = lineDistance(this.matrix)
        this.changeAngle( lineAngle(this.matrix) )
    }
    setEndX(x){
        this.matrix[1][0] = x || 0;
		this.setH(lineDistance(this.matrix))
        this.setAngle(lineAngle(this.matrix))
        this.lightSticker.updateX()
        for(let beam of this.beams)
            beam.setSrcX(this.matrix[1][0])
    }
    setEndY(y){
        this.matrix[1][1] = y || 0;
		this.setH(lineDistance(this.matrix))
        this.setAngle(lineAngle(this.matrix))
        this.lightSticker.updateY()
        for(let beam of this.beams)
            beam.setSrcY(this.matrix[1][1])
    }
    setEndPosition(x, y){
        this.matrix[1][0] = x || 0;
        this.matrix[1][1] = y || 0;
        this.h = lineDistance(this.matrix);
        this.changeAngle( lineAngle(this.matrix) );
        this.lightSticker.updateRotation()
        for(let beam of this.beams)
            beam.setSrcPosition(this.matrix[1][0], this.matrix[1][1])
    }
	setSrcText(text){
		this.srcText = text
		this.line.updateSrcText()
	}
	setEndText(text){
		this.endText = text
		this.line.updateEndText()
	}
    changeEndX(x){
        this.setEndX(x);
        this.twoCircles.updateRotation()
        this.lightSticker.updateX()
    }
    changeEndY(y){
        this.setEndY(y);
        this.twoCircles.updateRotation()
        this.lightSticker.updateY()
    }
    setH(h){
        this.h = h || 0
        this.updateMatrix()
    }
    addBeam(light){
        this.beams.push(light)
    }
    removeBeam(light){
        this.beams = this.beams.filter(beam => beam!=light)
    }

    getBBox(){
        let x, y, w, h;
        if(this.x<this.matrix[1][0]){
            x = this.x;
            w = this.matrix[1][0] - this.x;
        }
        else {
            x = this.matrix[1][0];
            w = this.x - this.matrix[1][0];
        }

        if(this.y<this.matrix[1][1]){
            y = this.y;
            h = this.matrix[1][1] - this.y;
        }
        else {
            y = this.matrix[1][1];
            h = this.y - this.matrix[1][1];
        }

        return [x, y, w, h];
    }

    // selection
    isOnSelection(selectionBox){
        return overlapBoxLine(selectionBox, this.matrix);
    }

    embed(env){
        super.embed(env);
        this.updateArrow = () => this.__updateArrow();
        this.updateLine = () => this.__updateLine();
    }

    activateEditting(){
        super.activateEditting()
        this.arc.undisplay()
        this.lightSticker.undisplay()
    }

    remove(){
        for(let beam of this.beams) beam.unsetSrcObject()
        if(this.env) this.env.removeEntity(this);
        this.delete();
    }
    softRemove(){
        for(let beam of this.beams) beam.unsetSrcObject()
        for(let htmlEntity of this.htmlEntities) htmlEntity.softRemove()
        this.env.removeEntity(this)
        this.isDeleted = true
    }
}