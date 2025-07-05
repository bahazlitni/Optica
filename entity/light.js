class TwoCircles extends HTMLEntity {
    constructor(entity){
        super(entity);

        this.circleToDrag = null
        this.circleMargin = 5

        this.srcCircle = createCircle(0, 0, 0, "fill: rgb(255, 90, 60);");
        this.endCircle = createCircle(0, 0, 0, "fill: rgb(50, 100, 225);");

        this.addHTMLElement(this.srcCircle, "edit");
        this.addHTMLElement(this.endCircle, "edit");
    }
    activatePointerEvents(){
        super.activatePointerEvents();
        this.srcCircle.style.pointerEvents = "all";
        this.endCircle.style.pointerEvents = "all";
    }
    desactivatePointerEvents(){
        super.desactivatePointerEvents();
        this.srcCircle.style.pointerEvents = "none";
        this.endCircle.style.pointerEvents = "none";
    }
    getUndoRedoFunction(e){
        const angle = this.entity.angle;
        const x = this.entity.matrix[0][0];
        const y = this.entity.matrix[0][1];
        const xi = this.entity.matrix[1][0];
        const yi = this.entity.matrix[1][1];
        const address = this.entity.address;
        const cls = this.entity.cls;

        return () => {
            let entity = cls.newEntities[address];
            entity.matrix[0][0] = x;
            entity.matrix[0][1] = y;
            entity.matrix[1][0] = xi;
            entity.matrix[1][1] = yi;

            entity.x = x;
            entity.y = y;
            entity.h = lineDistance(entity.matrix);
            
            var angle0 = angle;
            var newAngle = lineAngle(entity.matrix);
            if(e.shiftKey){
                if(e.ctrlKey) {
                    entity.h *= Math.cos(angle0-newAngle);
                    if(h<0) entity.changeAngle(angle+DEG180);
                    else {
                        entity.updateMatrix();
                        this.updateRotation();
                    }
                }
                
                entity.changeAngle(stick(newAngle, DEG15));
            }
            else
            entity.changeAngle(newAngle);
        };
    }

    changeX(x){
        const deltaX = x-getCircleX(this.srcCircle);
        this.srcCircle.setAttributeNS(null, "cx", x);
        this.endCircle.setAttributeNS(null, "cx", getCircleX(this.endCircle)+deltaX);
    }
    changeY(y){
        const deltaY = y-getCircleY(this.srcCircle);
        this.srcCircle.setAttributeNS(null, "cy", y);
        this.endCircle.setAttributeNS(null, "cy", getCircleY(this.endCircle)+deltaY);
    }
    changeW(w){
        this.srcCircle.setAttributeNS(null, "r", w+this.circleMargin);
        this.endCircle.setAttributeNS(null, "r", w+this.circleMargin);
    }
    changeH(h){
        this.changeW(h);
    }
    changeColor(color){
        var rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.srcCircle.setAttributeNS(null, "fill", rgb);
        this.endCircle.setAttributeNS(null, "fill", rgb);
    }
    changeOpacity(a){
        this.srcCircle.setAttributeNS(null, "opacity", a);
        this.endCircle.setAttributeNS(null, "opacity", a);
    }
    updateX(){
        this.changeX(this.entity.x*this.getZoom());
    }
    updateY(){
        this.changeY(this.entity.y*this.getZoom());
    }
    updateW(){
        this.changeW(this.entity.w);
    }
    updateH(){
        this.updateW();
    }
    updateColor(){
        this.changeColor(this.entity.color);
    }
    updateOpacity(){
        this.changeOpacity(this.entity.color[3]);
    }
    updateRotation(){
        this.srcCircle.setAttributeNS(null, "cx", this.entity.matrix[0][0]*this.getZoom());
        this.srcCircle.setAttributeNS(null, "cy", this.entity.matrix[0][1]*this.getZoom());
        this.endCircle.setAttributeNS(null, "cx", this.entity.matrix[1][0]*this.getZoom());
        this.endCircle.setAttributeNS(null, "cy", this.entity.matrix[1][1]*this.getZoom());
    }

    ifmousedown(e){
        super.ifmousedown(e);
        this.entity.env.cursorSystem.setTempImage("pointer");
        this.__diffCx = getCircleClickOffsetX(e, getCircleX(e.srcElement || this.srcCircle));
        this.__diffCy = getCircleClickOffsetY(e, getCircleY(e.srcElement || this.srcCircle));
        this.entity.arc.display();
        this.circleToDrag = e.target;
        if(!this.__stack) return;
            
        this.__undo = this.getUndoRedoFunction(e);
    }
    ifmousemove(e){
        super.ifmousemove(e)
        if(!this.circleToDrag) this.circleToDrag = this.endCircle;

        if(this.circleToDrag==this.srcCircle){
            this.entity.matrix[0][0] = this.entity.env.cursorSystem.getX(e);
            this.entity.matrix[0][1] = this.entity.env.cursorSystem.getY(e);
        } else {
            this.entity.matrix[1][0] = this.entity.env.cursorSystem.getX(e);
            this.entity.matrix[1][1] = this.entity.env.cursorSystem.getY(e);
        }

        this.entity.x = this.entity.matrix[0][0];
        this.entity.y = this.entity.matrix[0][1];
        this.entity.h = lineDistance(this.entity.matrix);
        
        var angle0 = this.entity.angle;
        var newAngle = lineAngle(this.entity.matrix);
        if(e.shiftKey && !e.altKey){
            let a;
            if(e.ctrlKey) {
                this.entity.h *= Math.cos(angle0-newAngle);
                a = this.entity.angle;
            }
            else  {
                a = stick(newAngle, 15*Math.PI/180);
                this.entity.vector[0] = Math.cos(a);
                this.entity.vector[1] = Math.sin(a);
            }

            if(this.circleToDrag==this.srcCircle){
                this.entity.setSrcPosition(
                    this.entity.matrix[1][0] - this.entity.vector[0]*this.entity.h,
                    this.entity.matrix[1][1] - this.entity.vector[1]*this.entity.h
                );
            } 
            else {
                this.entity.setEndPosition(
                    this.entity.matrix[0][0] + this.entity.vector[0]*this.entity.h,
                    this.entity.matrix[0][1] + this.entity.vector[1]*this.entity.h
                );
            }
            if(this.entity.h<0){
                this.entity.h *= -1;
                this.entity.setAngle(a+DEG180);
            }
        }
        else this.entity.changeAngle(newAngle);
    }
    ifmouseup(e){
        super.ifmouseup(e);
        super.ifmousemove(e);
        this.entity.env.cursorSystem.resetPrevImage();
        this.entity.arc.undisplay();

        if(!this.mousemoved || !this.__stack) return;
        this.entity.env.stackUndo(
            {
                undo: this.__undo,
                redo: this.getUndoRedoFunction(e),
            }
        ) 
    }
    
    ifselect(e){
        super.ifselect(e);
        this.changeColor(this.entity.selectionColor);
    }
    ifunselect(e){
        super.ifunselect(e);
        this.changeColor(this.entity.color);
    }
    ifhover(e){
        super.ifhover(e);
        if(this.entity.isSelected) return;
        this.changeColor(this.entity.hoverColor);
    }
    ifunhover(e){
        super.ifunhover(e);
        if(this.entity.isSelected) return;
        this.changeColor(this.entity.color);
    }
    
    onhover(e){
        this.entity.hover(e);
    }
    onunhover(e){
        this.entity.unhover(e);
    }
}



class LightTwoCircles extends TwoCircles {
    constructor(entity){
        super(entity);
    }
    findSrcObjectToStick(e){
        if(this.circleToDrag != this.srcCircle) return
        if(!this.entity.env.entities[RealObject.label]) return
        let srcObject = null
        for(let realObject of this.entity.env.entities[RealObject.label]){
            if(e.target == realObject.lightSticker.circle){
                srcObject = realObject
                break
            }
        }
  
        if(srcObject==null && this.entity.srcObject!=null){
            const strStroke = this.entity.srcObject.lightSticker.circle.getAttributeNS(null, 'stroke')
            this.entity.srcObject.lightSticker.circle.animate([
                {
                    stroke: 'rgb(255, 0, 0)', 
                    fill: 'rgba(255, 0, 0, 0.25)', 
                }, {
                    stroke: strStroke,
                    fill: 'rgba(255, 0, 0, 0)'
                }
            ], {duration: 400})
        }
        else if(srcObject!=null && this.entity.srcObject==null){
            const strStroke = srcObject.lightSticker.circle.getAttributeNS(null, 'stroke')
            srcObject.lightSticker.circle.animate([
                {
                    stroke: 'rgb(0, 180, 255)', 
                    fill: 'rgba(0, 180, 255, 0.25)', 
                }, {
                    stroke: strStroke,
                    fill: 'rgba(0, 180, 255, 0)'
                }
            ], {duration: 400})
        }
        
        this.entity.setSrcObject(srcObject)
    }

    ifmousedown(e){
        super.ifmousedown(e)
        if(this.circleToDrag != this.srcCircle) return
        if(!this.entity.env.entities[RealObject.label]) return
        for(let realObject of this.entity.env.entities[RealObject.label]){
            realObject.lightSticker.display()
            realObject.activatePointerEvents()
        }
        for(let light of this.entity.env.entities[Light.label])
            light.desactivatePointerEvents()

        this.findSrcObjectToStick(e)
    }
    ifmousemove(e){
        super.ifmousemove(e)
        this.findSrcObjectToStick(e)
    }
    ifmouseup(e){
        super.ifmouseup(e)

        if(this.circleToDrag != this.srcCircle) return
        if(!this.entity.env.entities[RealObject.label]) return
        for(let realObject of this.entity.env.entities[RealObject.label]){
            realObject.lightSticker.undisplay()
            realObject.desactivatePointerEvents()
        }
        for(let light of this.entity.env.entities[Light.label])
            light.activatePointerEvents()
    }
}

class LightPolyline extends HTMLEntity {
    
    constructor(entity){
        super(entity);

        this.polylines = [];
        this.arrows = [];

        this.dashedLine = createLine(0, 0, 0, 0, "stroke-dasharray: 5 10;");
        this.addHTMLElement(this.dashedLine, "visual");

        this.magnet = createPolyline([], "stroke: transparent; fill: none;");
        this.magnet.style.pointerEvents = "stroke";
        this.addHTMLElement(this.magnet, "html");

        this.arrowEdge = 10;
        this.arrowAngle = Math.PI/5;
        this.cosArrowAngle = Math.cos(this.arrowAngle);
        this.sinArrowAngle = Math.sin(this.arrowAngle);
        this.arrowH  = this.cosArrowAngle*this.arrowEdge;
    }
    activatePointerEvents(){
        super.activatePointerEvents();
        this.magnet.style.pointerEvents = "stroke";
    }
    desactivatePointerEvents(){
        super.desactivatePointerEvents();
        this.magnet.style.pointerEvents = "none";
    }

    changeW(w){
        for(let polyline of this.polylines) polyline.setAttributeNS(null, "stroke-width", w);
        this.magnet.setAttributeNS(null, "stroke-width", w+8);
        this.dashedLine.setAttributeNS(null, "stroke-width", w);
    }

    updateW(){
        this.changeW(this.entity.w);
    }
    updateH(){
        this.updateW();
    }
    updateColor(){
        this.changeColor(this.entity.color);
    }
    updateOpacity(){
        let a = this.entity.color[3];
        this.dashedLine.setAttributeNS(null, "opacity", a/2);
        let j = 0;
        let i = 0;
        for(let r=0; r<this.entity.reflections.length; r++){
            let A = i<this.polylines.length;
            let B = j<this.arrows.length;
            if(A && B) break;
            
            if( A ) {
                this.polylines[i].setAttributeNS(null, "opacity", a);
                i++;
            }
            if( B ) {
                this.arrows[j].setAttributeNS(null, "opacity", a);
                j++;
            }
            a -= a*this.entity.reflections[r].absorption;
        }
    }

    changeColor(color){
        const colorStr = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        for(let polyline of this.polylines) polyline.setAttributeNS(null, "stroke", colorStr);
        for(let arrow of this.arrows) arrow.setAttributeNS(null, "stroke", colorStr);
        this.dashedLine.setAttributeNS(null, "stroke", colorStr);
    }
    changeOpacity(a){
        for(let polyline of this.polylines) polyline.setAttributeNS(null, "opacity", a);
        for(let arrow of this.arrows) arrow.setAttributeNS(null, "opacity", a);
        this.dashedLine.setAttributeNS(null, "opacity", a/2);
    }


    updateRotation(){

        // interruption point
        let interruptionPoint = this.entity.getInterruptionPoint();
        if(interruptionPoint && this.entity.edittingActivated){
            this.dashedLine.style.display = "unset";
            this.dashedLine.setAttributeNS(null, "x1", interruptionPoint[0]*this.getZoom());
            this.dashedLine.setAttributeNS(null, "y1", interruptionPoint[1]*this.getZoom());
            this.dashedLine.setAttributeNS(null, "x2", this.entity.matrix[1][0]*this.getZoom());
            this.dashedLine.setAttributeNS(null, "y2", this.entity.matrix[1][1]*this.getZoom());
        }
        else {
            this.dashedLine.style.display = "none";
        }

        const colorStr = `rgb(${this.entity.color[0]}, ${this.entity.color[1]}, ${this.entity.color[2]})`;
        let magnetPoints = "";

        // i is current reflection, c is number of polylines
        const l = this.entity.reflections.length; // simplify code
        var i, halfD;
        for(i=0; i<this.entity.reflections.length; i++){
            const curOpacity = this.entity.reflections[i].value
            magnetPoints += `${this.entity.reflections[i].intersection[0]*this.getZoom()},${this.entity.reflections[i].intersection[1]*this.getZoom()} `;
            if(this.entity.reflections[i].islimit) break
            
            // ARROWS: for each reflection there is an arrow
            halfD = min((this.entity.reflections[i].distance*this.getZoom() + this.arrowH)/2, 100);

            let cosAngle = this.entity.reflections[i].vector[0];
            let sinAngle = this.entity.reflections[i].vector[1];
            let cosAngle1 = cosAngle*this.cosArrowAngle + sinAngle*this.sinArrowAngle;
            let sinAngle1 = sinAngle*this.cosArrowAngle - cosAngle*this.sinArrowAngle;
            let cosAngle2 = cosAngle*this.cosArrowAngle - sinAngle*this.sinArrowAngle;
            let sinAngle2 = sinAngle*this.cosArrowAngle + cosAngle*this.sinArrowAngle;
            let arrowMainX = this.entity.reflections[i].intersection[0]*this.getZoom() + cosAngle*halfD;
            let arrowMainY = this.entity.reflections[i].intersection[1]*this.getZoom() + sinAngle*halfD;
            
            let arrowPoints = (
                    `${arrowMainX - this.arrowEdge*cosAngle1},` 
                + `${arrowMainY - this.arrowEdge*sinAngle1}` 
                + " "
                + `${arrowMainX},` 
                + `${arrowMainY}`
                + " "
                + `${arrowMainX - this.arrowEdge*cosAngle2},`
                + `${arrowMainY - this.arrowEdge*sinAngle2}`
            );
            
            if(!this.arrows[i]){
                this.arrows.push(createPolyline([], `stroke-width: 2; stroke: ${colorStr}; opacity: ${curOpacity}; fill: none;`));
                this.addHTMLElement(this.arrows[i], "visual");
                this.embedHTMLElement(this.arrows[i], "visual");
            }

            this.arrows[i].style.display = '';
            this.arrows[i].setAttributeNS(null, "points", arrowPoints);
            this.arrows[i].setAttributeNS(null, "opacity", curOpacity);
            if(this.entity.reflections[i].distance*this.getZoom()<100)
            this.arrows[i].style.display = 'none'
        }

        var c=0;
        for(let j=0; j<l; j++, c++){
            const curOpacity = this.entity.reflections[j].value
            if(this.entity.reflections[j].islimit) break

            // DYNMAIC: if the path already exists, don't remove, instead utilize it.
            let polyline = this.polylines[c]
            if(!polyline){
                polyline = createPolyline(null, `fill: none; stroke-width: ${this.entity.w}; stroke: ${colorStr}; fill: none;`);
                this.polylines.push(polyline);
                // embed the polyline since it's newly created.
                this.addHTMLElement(polyline, "visual");
                this.embedHTMLElement(polyline, "visual");
            }

            polyline.style.display = "unset";
            polyline.setAttributeNS(null, "opacity", curOpacity);
            let polylinePoints = `${this.entity.reflections[j].intersection[0]*this.getZoom()},${this.entity.reflections[j].intersection[1]*this.getZoom()} `;
            while(true) {
                // LINES: For each reflection with a different opacity/color there is a seperate polyline.
                const reflection = this.entity.reflections[j]
                
                if(reflection.islimit) break
                if(j==l-1){
                    let str = ``
                    if(!Number.isFinite(reflection.distance)){
                        for(const edge of this.entity.env.getEdges()){
                            
                            const p = constructSegmentSemisegIntersection(edge, [
                                reflection.intersection, [
                                    reflection.intersection[0]+reflection.vector[0],
                                    reflection.intersection[1]+reflection.vector[1],
                                ]
                            ])
                            if(!p || Number.isNaN(p[0]) || Number.isNaN(p[1])) continue
                            str = `${p[0]*this.getZoom()},${p[1]*this.getZoom()}`
                            break
                        }
                    }
                    polylinePoints += str
                    magnetPoints += str
                    break
                }
                const nextReflection = this.entity.reflections[j+1]
                
                polylinePoints += `${nextReflection.intersection[0]*this.getZoom()},`;
                polylinePoints += `${nextReflection.intersection[1]*this.getZoom()} `;

                j++

                if(reflection.value != nextReflection.value) {
                    j--
                    break
                }
            }

            polyline.setAttributeNS(null, "points", polylinePoints)
            
        }


        for(let k=c; k<this.polylines.length; k++) this.polylines[k].style.display = "none";
        for(let k=i; k<this.arrows.length; k++) this.arrows[k].style.display = "none";
        this.magnet.setAttributeNS(null, "points", magnetPoints)
        
    }

    ifmousedown(e){
        super.ifmousedown(e);
        this.__diffCx = this.entity.env.cursorSystem.getX(e)-this.entity.x;
        this.__diffCy = this.entity.env.cursorSystem.getY(e)-this.entity.y;
    }
    ifmousemove(e){
        super.ifmousemove(e);
        if(this.entity.edittingActivated)
        this.entity.changePosition(this.entity.env.cursorSystem.getX(e)-this.__diffCx, this.entity.env.cursorSystem.getY(e)-this.__diffCy);
        this.entity.unsetSrcObject()
    }
    activateEditting(){
        super.activateEditting();
        this.dashedLine.style.display = "unset";
    }
    desactivateEditting(){
        super.desactivateEditting();
        this.dashedLine.style.display = "none";
    }
}


class Light extends NonPhysicalEntity {
    static label = "light";
    static name = "Light";

    static C = 2.998*10**8;
    static h = 6.623*10E-34;

    static minVisibleValue = 10E-3;
    static limitBounces = 400;
    static limitLength = Light.C/50000

    static newEntities = {};
    static newEntity = null;
    static entityAddress = 0;

    static undo = () => null;

    static pointer = "pen";
    static settings = {
        gamma: 1,
        lambda: 600,
        w: 1,
    };

    static selectionSheet = [
        { 
            tag: "Physical",
            inputs: [
                new EntityInputSheet("X", 1, "1fr", (selection, e) => Entity.inputX(selection, e), selection => Entity.outputX(selection), null,
                selection => selection.filter(selected => selected.cls == Light)),
                new EntityInputSheet("Y", 1, "1fr", (selection, e) => Entity.inputY(selection, e), selection => Entity.outputY(selection), null,
                selection => selection.filter(selected => selected.cls == Light)),
                new EntityInputSheet("Dest X", 2, "1fr", (selection, e) => Entity.inputX(selection, e), selection => Entity.outputX(selection), null,
                selection => selection.filter(selected => selected.cls == Light)),
                new EntityInputSheet("Dest Y", 2, "1fr", (selection, e) => Entity.inputY(selection, e), selection => Entity.outputY(selection), null,
                selection => selection.filter(selected => selected.cls == Light)),
                new EntityInputSheet("Angle", 3, "50%", (selection, e) => Entity.inputAngle(selection, e), selection => Entity.outputAngle(selection), "°",
                selection => selection.filter(selected => selected.cls == Light)),
                new EntityInputSheet("Lambda", 4, "1fr", (selection, e) => Entity.inputLambda(selection, e), selection => Entity.outputLambda(selection), "nm",
                selection => selection.filter(selected => selected.cls == Light)),
                new EntityInputSheet("Gamma", 4, "1fr", (selection, e) => Entity.inputGamma(selection, e), selection => Entity.outputGamma(selection), null,
                selection => selection.filter(selected => selected.cls == Light)),
            ]
        },
    ];

    static mousedown(e, cursorSystem, Class){
        Class = Class || Light;
        Entity.mousedown(e, cursorSystem, Class);
        Class.newEntity.changeLambda(cursorSystem.cursor.settings.lambda);
        Class.newEntity.changeGamma(cursorSystem.cursor.settings.gamma);
        Class.newEntity.twoCircles.mousedown(e, Class.label, "edit");
    }
    static mousemove(e, cursorSystem, Class){
        Class = Class || Light;
        Entity.mousemove(e, cursorSystem, Class);
        Class.newEntity.twoCircles.ifmousemove(e);
    }
    static mouseup(e, cursorSystem, Class){
        Class = Class || Light;
        Class.newEntity.twoCircles.mouseup(e, Class.label);
        Entity.mouseup(e, cursorSystem, Class);
    }
    static mouseleave(e, cursorSystem, Class){
        Class = Class || Light;
        Class.newEntity.twoCircles.mouseleave(e, Class.label);
    }
    static mouseover(e, cursorSystem, Class){
        Class = Class || Light;
        Class.newEntity.twoCircles.mouseover(e, Class.label);
    }

    constructor(address, cls){
        super(address, cls || Light);

        this.matrix = [[0, 0], [0, 0]];
        this.reflections = [];
        this.h = 0;
        this.angle = 0;
        this.gamma = 1; // can't be 0!
        this.lambda = 0;
        this.value = 1;
        this.w = 0;

        this.srcOject = null

        this.propagate = () => null;
        this.updateArrows = () => null;
        this.updatePolylines = () => null;

        //arc
        this.arc = new ArcVisual(this);
        this.pushHtmlEntity(this.arc);

        // html
        this.polyline = new LightPolyline(this, "polyline");
        this.pushHtmlEntity(this.polyline);
        this.twoCircles = new LightTwoCircles(this, "twoCircles");
        this.pushHtmlEntity(this.twoCircles);
    }

    getStatus(){
        const status = super.getStatus();
        status.h = this.h;
        status.lambda = this.lambda;
        status.gamma = this.gamma;
        status.value = this.value;
        return status;
    }
    setStatus(status){
        super.setStatus(status);
        this.setH(status.h);
        this.setLambda(status.lambda);
        this.setGamma(status.gamma);
        this.setValue(status.value);
        this.propagate();
    }

    getColor(){
        return lambdaToRGBA(this.lambda, this.gamma);
    }

    updateMatrix(){
        this.matrix[0][0] = this.x;
        this.matrix[0][1] = this.y;
        this.matrix[1][0] = this.x + this.vector[0]*this.h;
        this.matrix[1][1] = this.y + this.vector[1]*this.h;
        this.twoCircles.updateRotation();
    }

    setGamma(g){
        this.gamma = g || 1;
    }

    changeGamma(g){
        this.setGamma(g);
        this.changeColor(this.getColor(), true);
    }
    changeX(x){
        super.changeX(x);
        this.propagate();
    }
    changeY(y){
        super.changeY(y);
        this.propagate();
    }
    setSrcX(x){
        this.matrix[0][0] = x || 0;
        this.h = lineDistance(this.matrix);
        this.setAngle( lineAngle(this.matrix) );
    }
    setSrcY(y){
        this.matrix[0][1] = y || 0;
        this.h = lineDistance(this.matrix);
        this.setAngle( lineAngle(this.matrix) );
    }
    setSrcPosition(x, y){
        this.matrix[0][0] = x || 0;
        this.matrix[0][1] = y || 0;
        this.x = this.matrix[0][0];
        this.y = this.matrix[0][1];
        this.h = lineDistance(this.matrix);
        this.changeAngle( lineAngle(this.matrix) );
    }
    setEndX(x){
        this.matrix[1][0] = x || 0;
        this.h = lineDistance(this.matrix);
        this.setAngle( lineAngle(this.matrix) );
    }
    setEndY(y){
        this.matrix[1][1] = y || 0;
        this.h = lineDistance(this.matrix);
        this.setAngle( lineAngle(this.matrix) );
    }
    setEndPosition(x, y){
        this.matrix[1][0] = x || 0;
        this.matrix[1][1] = y || 0;
        this.h = lineDistance(this.matrix);
        this.changeAngle( lineAngle(this.matrix) );
    }
    changeEndX(x){
        this.setEndX(x);
        this.twoCircles.updateRotation();
        this.propagate();
    }
    changeEndY(y){
        this.setEndY(y);
        this.twoCircles.updateRotation();
        this.propagate();
    }
    setLambda(lambda){
        this.lambda = lambda || 0;
        const rgba = this.getColor();
        this.changeColor(rgba, true);
        this.changeOpacity(rgba[3]);
    }
    setValue(v){
        this.value = v || 0;
    }
    changeLambda(lambda){
        this.setLambda(lambda);
        for(let htmlEntity of this.htmlEntities) {
            htmlEntity.updateColor();
            htmlEntity.updateOpacity();
        }
        this.propagate();
    }
    changeOpacity(a){
        super.changeOpacity(a);
        this.propagate();
    }
    changePosition(x, y){
        super.changePosition(x, y);
        this.propagate();
    }
    changeAngle(angle){
        super.changeAngle(angle);
        this.propagate();
    }
    setH(d){
        this.h = d || 0;
        this.updateMatrix();
    }
    unsetSrcObject(){
        this.setSrcObject(null)
    }
    setSrcObject(srcObject){
        if(srcObject) 
            this.setSrcPosition(
                srcObject.matrix[1][0],
                srcObject.matrix[1][1]
            )
        
        if(this.srcObject == srcObject) return
        if(srcObject) srcObject.addBeam(this)
        if(this.srcObject) this.srcObject.removeBeam(this)
        this.srcObject = srcObject
    }

    hasInterruptionPoint(){
        return this.reflections.length>1 && this.reflections[1].distance<this.h;
    }

    getInterruptionPoint(){
        if( this.hasInterruptionPoint() ) return this.reflections[1].intersection;
        return null;
    }

    __propagate(){
        this.reflections = [{
            entity: null, 
            angle: this.angle,
            intersection: [this.x, this.y],
            absorption: 0,
            distance: Infinity,
            vector: this.vector,
            value: this.value
        }];
        this.interruptionPoint = null

        for(let k=0; k<Light.limitBounces; k++){
            var previousReflection = this.reflections[k]

            const currentTrajectory = [
                previousReflection.intersection, [
                    previousReflection.vector[0] + previousReflection.intersection[0],
                    previousReflection.vector[1] + previousReflection.intersection[1]
                ] 
            ]

            const reflection = {
                entity: null,
                intersection: [0, 0],
                absorption: 0,
                angle: 0,
                distance: Infinity,
                vector: [0, 0],
                value: 0
            }   
            var surfaceIndex = 0

            // FIND POSSIBLE REFLECTIONS / EVALUATE THE REAL ONE VIA MIN DISTANCE
            for(let entityType in this.env.entities){
                for(let physicalEntity of this.env.entities[entityType]){
                    if(!physicalEntity.isPhysical() || physicalEntity == previousReflection.entity) continue;
                    if(physicalEntity.matrix.length<2) continue
                    
                    for(let i=0; i<physicalEntity.matrix.length; i++){
                        const cur_intersection = constructSegmentSemisegIntersection(
                            [physicalEntity.matrix[i], physicalEntity.matrix[(i+1)%this.matrix.length]],
                            currentTrajectory
                        )
       
                        if(!cur_intersection) continue

                        const cur_d = distance(
                            cur_intersection,
                            previousReflection.intersection
                        )

                        if(cur_d<previousReflection.distance){
                            previousReflection.distance = cur_d
                            reflection.intersection[0] = cur_intersection[0]
                            reflection.intersection[1] = cur_intersection[1]
                            reflection.entity = physicalEntity
                            surfaceIndex = i
                        }
                    }
                }
            }
  
            // There has to be a reflection to continue calculating reflections.
            if(!Number.isFinite(previousReflection.distance)) break
            if(!this.interruptionPoint) this.interruptionPoint = reflection.intersection
            const {angle, absorption} = reflection.entity.output(
                reflection.intersection,
                previousReflection.angle,
                surfaceIndex
            )
            
            if(k==Light.limitBounces-1) reflection.islimit = true
            reflection.absorption = absorption
            reflection.angle = angle
            reflection.vector = [Math.cos(angle), Math.sin(angle)]
            reflection.value = previousReflection.value * (1-absorption)
            this.reflections.push(reflection)
            if(reflection.value < Light.minVisibleValue){
                reflection.islimit = true
                break
            }
            
        }
        this.polyline.updateRotation()
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

    isOnSelection(selectionBox){
        let line, dist;
        for(let reflection of this.reflections){
            if(reflection.distance == Infinity) dist = Light.limitLength;
            else dist = reflection.distance;
            line = [
                reflection.intersection,
                [
                    reflection.intersection[0]+reflection.vector[0]*dist,
                    reflection.intersection[1]+reflection.vector[1]*dist
                ]
            ];
        }


        if(!selectionBox) return null;
        const x = selectionBox[0];
        const y = selectionBox[1];
        const w = selectionBox[2];
        const h = selectionBox[3];
        return !(
            this.x < x || 
            this.y < y ||
            this.x > x+w || 
            this.y > y+h
        );
    }

    embed(env){
        super.embed(env);
        this.propagate = () => this.__propagate();
        this.updateArrows = () => this.__updateArrows();
        this.updatePolylines = () => this.__updatePolylines();
        this.propagate();
    }

    activateEditting(){
        super.activateEditting();
        this.arc.undisplay();
    }

    softRetrieve(){
        super.softRetrieve();
        this.propagate();
    }
    remove(){
        if(this.srcObject) this.srcObject.removeBeam(this)
        if(this.env) this.env.removeEntity(this);
        this.delete();
    }
    softRemove(){
        if(this.srcObject) this.srcObject.removeBeam(this)
        for(let htmlEntity of this.htmlEntities) htmlEntity.softRemove()
        this.env.removeEntity(this)
        this.isDeleted = true
    }
}