class PlaneResizers extends HTMLEntity {
    constructor(plane, modes){
        super(plane, modes);

        this.resizer1 = createPath("", "fill: white;");
        this.resizer2 = createPath("", "fill: white;");
        this.l1 = createLine(0, 0, 0, 0, `stroke: ${red}; stroke-width: 1px;`);
        this.l2 = createLine(0, 0, 0, 0, `stroke: ${red}; stroke-width: 1px;`);

        this.resizerW = 0;
        this.resizerH = 0;
        this.resizerDiag = 0;

        this.resizerVector = [0, 0];
        this.resizerMat1 = [[0, 0], [0, 0], [0, 0]];
        this.resizerMat2 = [[0, 0], [0, 0], [0, 0]];

        this.addHTMLElement(this.resizer1, "edit");
        this.addHTMLElement(this.resizer2, "edit");
        this.addHTMLElement(this.l1, "superVisual");
        this.addHTMLElement(this.l2, "superVisual");

        // CAN CHANGE ANYTIME
        // change applies on html
        this.changeColor = color => null;
        this.changeOpacity = () => null;
        this.changeX = v => {
            const x1 = this.resizerMat1[0][0] + this.resizerH*this.resizerVector[0];
            const deltaX = v - x1;
            for(let i=0; i<this.resizerMat1.length; i++){
                this.resizerMat1[i][0] += deltaX;
                this.resizerMat2[i][0] += deltaX;
            }
            changePathD(this.resizer1, this.resizerMat1);
            changePathD(this.resizer2, this.resizerMat2);

            this.l1.setAttributeNS(null, "x1", getLineX1(this.l1) + deltaX);
            this.l1.setAttributeNS(null, "x2", getLineX2(this.l1) + deltaX);
            this.l2.setAttributeNS(null, "x1", getLineX1(this.l2) + deltaX);
            this.l2.setAttributeNS(null, "x2", getLineX2(this.l2) + deltaX);
        };
        this.changeY = v => {
            const y1 = this.resizerMat1[0][1] - this.resizerH*this.resizerVector[1];
            const deltaY = v - y1;
            for(let i=0; i<this.resizerMat1.length; i++){
                this.resizerMat1[i][1] += deltaY;
                this.resizerMat2[i][1] += deltaY;
            }
            changePathD(this.resizer1, this.resizerMat1);
            changePathD(this.resizer2, this.resizerMat2);

            this.l1.setAttributeNS(null, "y1", getLineY1(this.l1) + deltaY);
            this.l1.setAttributeNS(null, "y2", getLineY2(this.l1) + deltaY);
            this.l2.setAttributeNS(null, "y1", getLineY1(this.l2) + deltaY);
            this.l2.setAttributeNS(null, "y2", getLineY2(this.l2) + deltaY);
        };
        this.changeW = v => {
            const dw = (v - this.resizerW)/2; 
            this.resizerW = v;

            /* 1 */
            //1
            this.resizerMat1[1][0] -= dw*this.resizerVector[1];
            this.resizerMat1[1][1] -= dw*this.resizerVector[0];

            //2
            this.resizerMat1[2][0] += dw*this.resizerVector[1];
            this.resizerMat1[2][1] += dw*this.resizerVector[0];

            /* 2 */
            //1
            this.resizerMat2[1][0] += dw*this.resizerVector[1];
            this.resizerMat2[1][1] += dw*this.resizerVector[0];

            //2
            this.resizerMat2[2][0] -= dw*this.resizerVector[1];
            this.resizerMat2[2][1] -= dw*this.resizerVector[0];


            changePathD(this.resizer1, this.resizerMat1);
            changePathD(this.resizer2, this.resizerMat2);
        };
        this.changeH = v => {
            const dh = v - this.resizerH;
            this.resizerH = v;
            /* 1 */
            //0
            this.resizerMat1[0][0] -= dh*this.resizerVector[0];
            this.resizerMat1[0][1] += dh*this.resizerVector[1];

            /* 2 */
            //0
            this.resizerMat2[0][0] += dh*this.resizerVector[0];
            this.resizerMat2[0][1] -= dh*this.resizerVector[1];

            changePathD(this.resizer1, this.resizerMat1);
            changePathD(this.resizer2, this.resizerMat2);
        };



        // update: depends on the entity
        // update applies on html
        this.updateX = () => this.changeX( this.entity.matrix[0][0]*this.getZoom());
        this.updateY = () => this.changeY( this.entity.matrix[0][1]*this.getZoom() );
        this.updateW = () => {
            this.changeW(this.entity.w*2+15);
            this.changeH(this.resizerW/1.75);
        }
        this.updateH = () => this.updateRotation();
        this.updateRotation = () => {
            const lineLength = 30;

            this.resizerVector[0] = this.entity.vector[0];
            this.resizerVector[1] = -this.entity.vector[1];

            // update circles
            const zoom = this.getZoom();
            const x1 = this.entity.matrix[0][0]*zoom;
            const y1 = this.entity.matrix[0][1]*zoom;
            const x2 = this.entity.matrix[1][0]*zoom;
            const y2 = this.entity.matrix[1][1]*zoom;
            const wdiv2 =  this.resizerW/2;

            /* 1 */
            //0
            this.resizerMat1[0][0] = x1 - this.resizerH*this.resizerVector[0];
            this.resizerMat1[0][1] = y1 + this.resizerH*this.resizerVector[1];
            
            //1
            this.resizerMat1[1][0] = x1 - wdiv2*this.resizerVector[1];
            this.resizerMat1[1][1] = y1 - wdiv2*this.resizerVector[0];

            //2
            this.resizerMat1[2][0] = x1 + wdiv2*this.resizerVector[1];
            this.resizerMat1[2][1] = y1 + wdiv2*this.resizerVector[0];

            /* 2 */
            //0
            this.resizerMat2[0][0] = x2 + this.resizerH*this.resizerVector[0];
            this.resizerMat2[0][1] = y2 - this.resizerH*this.resizerVector[1];
            
            //1
            this.resizerMat2[1][0] = x2 + wdiv2*this.resizerVector[1];
            this.resizerMat2[1][1] = y2 + wdiv2*this.resizerVector[0];

            //2
            this.resizerMat2[2][0] = x2 - wdiv2*this.resizerVector[1];
            this.resizerMat2[2][1] = y2 - wdiv2*this.resizerVector[0];


            changePathD(this.resizer1, this.resizerMat1);
            changePathD(this.resizer2, this.resizerMat2);
    
            // updates lines
            this.l1.setAttributeNS(null, "x1", (x1 + lineLength*this.entity.vector[1]));
            this.l2.setAttributeNS(null, "x1", (x2 + lineLength*this.entity.vector[1]));
            this.l1.setAttributeNS(null, "y1", (y1 - lineLength*this.entity.vector[0]));
            this.l2.setAttributeNS(null, "y1", (y2 - lineLength*this.entity.vector[0]));

            this.l1.setAttributeNS(null, "x2", (x1 - lineLength*this.entity.vector[1]));
            this.l2.setAttributeNS(null, "x2", (x2 - lineLength*this.entity.vector[1]));
            this.l1.setAttributeNS(null, "y2", (y1 + lineLength*this.entity.vector[0]));
            this.l2.setAttributeNS(null, "y2", (y2 + lineLength*this.entity.vector[0]));
        };
    }
    activatePointerEvents(){
        super.activatePointerEvents();
        this.resizer1.style.pointerEvents = "all";
        this.resizer2.style.pointerEvents = "all";
    }
    desactivatePointerEvents(){
        super.desactivatePointerEvents();
        this.resizer1.style.pointerEvents = "none";
        this.resizer2.style.pointerEvents = "none";
    }

    ifmousedown(e){
        super.ifmousedown(e);

        this.entity.env.cursorSystem.setTempImage("resize");
        for(let entity of this.entity.env.entities[this.entity.cls.label]){
            entity.arc.display();
            entity.resizers.undisplay();
            entity.resizers.displayVisuals();
            entity.resizers.displaySuperVisuals();
        }
        if(this.entity.env.cursorSystem.cursor.magnetActivated){
            this.__diffCx = 0;
            this.__diffCy = 0;
        } else {
            this.__diffCx = getCircleClickOffsetX(e, getCircleX(e.srcElement));
            this.__diffCy = getCircleClickOffsetY(e, getCircleY(e.srcElement));
        }

        const angle = this.entity.angle;
        const h = this.entity.h;
        const event = e;

        this.undisplayEdits();
        this.entity.arc.display();
        this.__undo = () => this.entity.stretch(event, h, angle);
    }
    ifmousemove(e){
        super.ifmousemove(e);
        const directLine = [[this.entity.env.cursorSystem.getX(e)+this.__diffCx, this.entity.env.cursorSystem.getY(e)+this.__diffCy], [this.entity.x, this.entity.y]];

        
        const phi = lineAngle(directLine);
        const d = lineDistance(directLine);
        const h = d*2;
        
        
        if(!e.altKey && e.shiftKey && e.ctrlKey) this.entity.changeH( Math.abs(Math.cos(this.entity.angle-phi))*h);
        else this.entity.stretch( e, h, phi+DEG180 );

        if(this.entity.h<=getCircleR(this.entity.centerCircle.circle))
            this.entity.centerCircle.undisplay();
        else
            this.entity.centerCircle.display();
    }
    ifmouseup(e){
        super.ifmouseup(e);
        this.entity.env.cursorSystem.resetPrevImage();
        this.entity.centerCircle.display();
        for(let entity of this.entity.env.entities[this.entity.cls.label]){
            entity.arc.undisplay();
            entity.resizers.undisplay();
            entity.resizers.displayHtmls();
        }

        this.displayEdits();
        const angle = this.entity.angle;
        const h = this.entity.h;
        const event = e;
        this.entity.env.stackUndo({
            undo: this.__undo,
            redo: () => this.entity.stretch(event, h, angle),
        });

        this.entity.arc.undisplay();
    }
}

class LineStick extends HTMLEntity {
    static defaults = {
        magnetWidth: 5,
    }

    constructor(plane, modes, magnetW){
        super(plane, modes);

        this.magnetWidth = magnetW || PlaneStick.defaults.magnetWidth;

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
        changeLineX(this.stick, v);
        changeLineX(this.magnet, v);
    }
    changeY(v){
        changeLineY(this.stick, v);
        changeLineY(this.magnet, v);
    }
    changeW(v){
        changeLineW(this.stick, v);
        changeLineW(this.magnet, v+this.magnetWidth);
    };
    changeColor(color) {
        this.stick.setAttributeNS(null, "stroke", `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    }
    changeOpacity(v){
        this.stick.setAttributeNS(null, "opacity", v);
    }

    updateX(){ 
        this.changeX(this.entity.matrix[0][0]*this.getZoom());
    }
    updateY (){ 
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
     };


    ifmousedown(e){
        super.ifmousedown(e);
        this.entity.moving = true;
        this.entity.arc.display();
    }

    ifmousemove(e){
        super.ifmousemove(e);
        if(this.entity.env.getCursorMode() != this.entity.cls.label) return;
        this.entity.changeAngle(lineAngle( [[ this.entity.env.cursorSystem.getX(e), this.entity.env.cursorSystem.getY(e) ], [this.entity.x, this.entity.y]]), e.shiftKey);
    }
    ifmouseup(e){
        super.ifmouseup(e);
        this.entity.moving = false;
        this.entity.arc.undisplay();
        this.entity.resizers.display();
    }
}

class PlaneStick extends LineStick {
    constructor(plane, modes, magnetW){
        super(plane, modes, magnetW)
    }
    ifhover(e){
        super.ifhover(e);
        this.entity.normal.ifhover(e);
    }
    ifunhover(e){
        super.ifunhover(e);
        this.entity.normal.ifunhover(e);
    }
}


class PlaneNormal extends HTMLEntity {
    constructor(plane, modes){
        super(plane, modes);
        
        this.normal = createLine(0, 0, 0, 0, "stroke: rgba(255, 255, 255, 0.33); stroke-width: 1px; stroke-dasharray: 10 5 5 5;");
        this.triangle = createPath("", `fill: ${this.normal.getAttributeNS(null, "stroke")};`);

        this.addHTMLElement(this.normal, "visual");
        this.addHTMLElement(this.triangle, "visual");

        this.normalH = 100;
        this.trangleEdge = 5;
        this.trangleH = this.trangleEdge*(1 + Math.sqrt(2)/2);
        this.triangleMat = [[0, 0], [0, 0], [0, 0]];
    }

    changeColor(color) {
        this.normal.setAttributeNS(null, "stroke", `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        this.triangle.setAttributeNS(null, "fill", this.normal.getAttributeNS(null, "stroke"));
    }
    changeOpacity = v => {
        for(let visual of this.visuals) visual.setAttributeNS(null, "opacity", v);
    };
    changeX(v){
        this.__deltaX = v - getLineX1(this.normal);
        changeLineX(this.normal, v);
        this.triangleMat[0][0] += this.__deltaX;
        this.triangleMat[1][0] += this.__deltaX;
        this.triangleMat[2][0] += this.__deltaX;
        this.triangle.setAttributeNS(null, "d", constructPath(this.triangleMat));
    };
    changeY(v){
        this.__deltaY = v - getLineY1(this.normal);
        changeLineY(this.normal, v);
        this.triangleMat[0][1] += this.__deltaY;
        this.triangleMat[1][1] += this.__deltaY;
        this.triangleMat[2][1] += this.__deltaY;
        this.triangle.setAttributeNS(null, "d", constructPath(this.triangleMat));
    };

    // update: depends on the entity
    // update applies on html
    updateColor(){
        this.changeColor(this.entity.color);
    }
    updateOpacity(){
        this.changeOpacity(this.entity.color[3]/2);
    }
    updateX(){
        this.changeX((this.entity.x*this.getZoom() + this.normalH*this.entity.vector[1]));
    }
    updateY(){
        this.changeY((this.entity.y*this.getZoom() - this.normalH*this.entity.vector[0]));
    }
    updateRotation(){
        const x1 = this.entity.x*this.getZoom() + this.normalH*this.entity.vector[1];
        const y1 = this.entity.y*this.getZoom() - this.normalH*this.entity.vector[0];

        this.normal.setAttributeNS(null, "x1", x1);
        this.normal.setAttributeNS(null, "y1", y1);
        this.normal.setAttributeNS(null, "x2", this.entity.x*this.getZoom() - this.normalH*this.entity.vector[1]);
        this.normal.setAttributeNS(null, "y2", this.entity.y*this.getZoom() + this.normalH*this.entity.vector[0]);

        // update triangle
        this.triangleMat[0][0] = x1 - this.trangleEdge*this.entity.vector[0];
        this.triangleMat[0][1] = y1 - this.trangleEdge*this.entity.vector[1];
        this.triangleMat[1][0] = x1 + this.trangleEdge*this.entity.vector[0];
        this.triangleMat[1][1] = y1 + this.trangleEdge*this.entity.vector[1];
        this.triangleMat[2][0] = x1 + this.trangleH*this.entity.vector[1];
        this.triangleMat[2][1] = y1 - this.trangleH*this.entity.vector[0];
        this.triangle.setAttributeNS(null, "d", constructPath(this.triangleMat));
    };
}

class SymetricalPlaneNormal extends PlaneNormal {
    constructor(plane, modes){
        super(plane, modes);
        this.triangle2 = createPath("", `fill: ${this.normal.getAttributeNS(null, "stroke")};`);
        this.addHTMLElement(this.triangle2, "visual");

        this.triangleMat2 = [[0, 0], [0, 0], [0, 0]];
        this.visuals.push(this.triangle2);
    } 
    changeColor(color) {
        super.changeColor(color);
        this.triangle2.setAttributeNS(null, "fill", this.normal.getAttributeNS(null, "stroke"));
    }
    changeX(v){
        super.changeX(v);
        this.triangleMat2[0][0] += this.__deltaX;
        this.triangleMat2[1][0] += this.__deltaX;
        this.triangleMat2[2][0] += this.__deltaX;
        this.triangle2.setAttributeNS(null, "d", constructPath(this.triangleMat2));
    };
    changeY(v){
        super.changeY(v);
        this.triangleMat2[0][1] += this.__deltaY;
        this.triangleMat2[1][1] += this.__deltaY;
        this.triangleMat2[2][1] += this.__deltaY;
        this.triangle2.setAttributeNS(null, "d", constructPath(this.triangleMat2));
    };
    updateRotation(){
        super.updateRotation();
        const x2 = getLineX2(this.normal);
        const y2 = getLineY2(this.normal);

        // update triangle
        this.triangleMat2[0][0] = x2 + this.trangleEdge*this.entity.vector[0];
        this.triangleMat2[0][1] = y2 + this.trangleEdge*this.entity.vector[1];
        this.triangleMat2[1][0] = x2 - this.trangleEdge*this.entity.vector[0];
        this.triangleMat2[1][1] = y2 - this.trangleEdge*this.entity.vector[1];
        this.triangleMat2[2][0] = x2 - this.trangleH*this.entity.vector[1];
        this.triangleMat2[2][1] = y2 + this.trangleH*this.entity.vector[0];
        this.triangle2.setAttributeNS(null, "d", constructPath(this.triangleMat2));
    };
}


class PlanePositioningCircle extends PositioningCircle {
    constructor(plane, modes){
        super(plane, modes);
    }
    changeX(x){
        const r = getCircleR(this.circle);
        this.circle.setAttributeNS(null, "cx", x);
        this.crossLineV.setAttributeNS(null, "x1", x);
        this.crossLineV.setAttributeNS(null, "x2", x);
        this.crossLineH.setAttributeNS(null, "x1", x - r);
        this.crossLineH.setAttributeNS(null, "x2", x + r);
    }
    changeY(y){
        const r = getCircleR(this.circle);
        this.circle.setAttributeNS(null, "cy", y);
        this.crossLineV.setAttributeNS(null, "y1", y - r);
        this.crossLineV.setAttributeNS(null, "y2", y + r);
        this.crossLineH.setAttributeNS(null, "y1", y);
        this.crossLineH.setAttributeNS(null, "y2", y);
    }
    changeW(w){
        const x = getCircleX(this.circle);
        const y = getCircleY(this.circle);
        this.circle.setAttributeNS(null, "r", w);
        this.crossLineV.setAttributeNS(null, "y1", y - w);
        this.crossLineV.setAttributeNS(null, "y2", y + w);
        this.crossLineH.setAttributeNS(null, "x1", x - w);
        this.crossLineH.setAttributeNS(null, "x2", x + w);
    }

    updateX(){
        this.changeX(this.entity.x*this.getZoom());
    }
    updateY(){
        this.changeY(this.entity.y*this.getZoom());
    }
    updateW(){
        this.changeW(this.entity.w+6);
    }

    ifmousedown(e){
        super.ifmousedown(e);
        this.entity.resizers.undisplay();
    }
    ifmouseup(e){
        super.ifmouseup(e);
        this.entity.resizers.display();
    }

}



class Plane extends ElementaryOpticalSystem {
    static label = "plane";
    static name = "Plane";

    static newEntity = null;
    static pointer = "pen";
    static settings = {
        w: 2,
        color: [200, 200, 200, 1]
    };


    static createSelectionSheet(){
        return [
            {
                tag: "Physical",
                inputs: [
                    new EntityInputSheet("X", 1, "1fr", (selection, e) => Entity.inputX(selection, e), selection => Entity.outputX(selection), null,
                    selection => selection.filter(selected => selected.isPlane())),
                    new EntityInputSheet("Y", 1, "1fr", (selection, e) => Entity.inputY(selection, e), selection => Entity.outputY(selection), null,
                    selection => selection.filter(selected => selected.isPlane())),
                    new EntityInputSheet("H", 2, "1fr", (selection, e) => Entity.inputH(selection, e), selection => Entity.outputH(selection), null,
                    selection => selection.filter(selected => selected.isPlane())),
                    new EntityInputSheet("Angle", 2, "1fr", (selection, e) => Entity.inputAngle(selection, e), selection => Entity.outputAngle(selection), "°",
                    selection => selection.filter(selected => selected.isPlane())),
                    new EntityInputSheet("Absorption", 3, "60%", 
                    (selection, e) => Entity.inputAbsorption(selection, e), selection => Entity.outputAbsorption(selection), "%", 
                    selection => selection.filter(selected => selected.isPlane() && selected.cls != Wall)),
                ]
            },
            {
                tag: "Visual",
                inputs: [
                    new EntityInputSheet("Stroke", 1, "70%", (selection, e) => Entity.inputColor(selection, e), selection => Entity.outputColor(selection), "rgb",
                    selection => selection.filter(selected => selected.isPlane())),
                    new EntityInputSheet("W", 1, "20%", (selection, e) => Entity.inputStrokeW(selection, e), selection => Entity.outputStrokeW(selection), null,
                    selection => selection.filter(selected => selected.isPlane())),
                    new EntityInputSheet("Opacity", 2, "50%", (selection, e) => Entity.inputOpacity(selection, e), selection => Entity.outputOpacity(selection), "%",
                    selection => selection.filter(selected => selected.isPlane())),
                ]
            }
        ];
    }

    static mousedown(e, cursorSystem, Class){
        Class = Class || Plane;
        ElementaryOpticalSystem.mousedown(e, cursorSystem, Class);
        Class.newEntity.arc.display();
    }
    static mousemove(e, cursorSystem, Class){
        Class = Class || Plane;
        ElementaryOpticalSystem.mousemove(e, cursorSystem, Class);
        Class.newEntity.stretch( e,
            Math.sqrt( (Class.newEntity.x-cursorSystem.getX(e))**2 + (Class.newEntity.y-cursorSystem.getY(e))**2 )*2, 
            lineAngle([[Class.newEntity.x, Class.newEntity.y], [cursorSystem.getX(e), cursorSystem.getY(e)]]) );
    }
    static mouseup(e, cursorSystem, Class){
        Class = Class || Plane;
        ElementaryOpticalSystem.mouseup(e, cursorSystem, Class);
        Class.newEntity.arc.undisplay();
    }


    constructor(address, cls, Stick=PlaneStick, CenterCircle=PlanePositioningCircle, Resizers=PlaneResizers, Normal=PlaneNormal){
        super(address, cls || Plane);

        this.matrix = [[0, 0], [0, 0]];

        this.arc = new ArcVisual(this);
        this.centerCircle = new CenterCircle(this);
        this.resizers = new Resizers(this);
        this.stick = new Stick(this);
        this.normal = new Normal(this);

        this.pushHtmlEntity(this.arc);
        this.pushHtmlEntity(this.stick);
        this.pushHtmlEntity(this.centerCircle);
        this.pushHtmlEntity(this.resizers);
        this.pushHtmlEntity(this.normal);
    }

    // change - update
    updateMatrix(){
        this.matrix[0][0] = this.x - this.vector[0]*this.h/2;
        this.matrix[1][0] = this.x + this.vector[0]*this.h/2;
        this.matrix[0][1] = this.y - this.vector[1]*this.h/2;
        this.matrix[1][1] = this.y + this.vector[1]*this.h/2;
    }
    changeAbsorption(absorption){
        this.setAbsorption(absorption)
    }
    changeAngle(angle, shiftKey){
        angle = angle || 0;
        if(shiftKey) angle = stick(angle, DEG15);
        this.setAngle(angle);
        this.updateLightBeams();
    }
    changePosition(x, y){
        super.changePosition(x, y);
        this.updateLightBeams();
    }
    stretch(e, h, angle){
        this.changeH(h);
        this.changeAngle(angle, e.shiftKey);
    }
    changeX(x){
        super.changeX(x);
        this.updateLightBeams();
    }
    changeY(y){
        super.changeY(y);
        this.updateLightBeams();
    }
    changeH(h){
        super.changeH(h);
        this.updateLightBeams();
    }
    updateLightBeams(){
        if(this.env) this.env.updateLightBeams();
    }

    // hover
    isPlane(){
        return true;
    }
    isOnHover(){
        return this.__hovered;
    }
    // selection
    isOnSelection(selectionBox){
        return overlapBoxLine(selectionBox, this.matrix);
    }

    getBBox(){
        let x, y, w, h;

        if(this.matrix[0][0]<this.matrix[1][0]){
            x = this.matrix[0][0];
            w = this.matrix[1][0] - this.matrix[0][0];
        }
        else {
            x = this.matrix[1][0];
            w = this.matrix[0][0] - this.matrix[1][0];
        }

        if(this.matrix[0][1]<this.matrix[1][1]){
            y = this.matrix[0][1];
            h = this.matrix[1][1] - this.matrix[0][1];
        }
        else {
            y = this.matrix[1][1];
            h = this.matrix[0][1] - this.matrix[1][1];
        }
        return [x, y, w, h];
    }
}

class SymetricalPlane extends Plane {
    static label = "symetrical_plane";
    static newEntity = null;
    static pointer = "pen";
    static settings = {};

    static selectionSheet = Plane.selectionSheet;

    static mousedown(e, cursorSystem, Class){
        Plane.mousedown(e, cursorSystem, Class || SymetricalPlane);
    }
    static mousemove(e, cursorSystem, Class){
        Plane.mousemove(e, cursorSystem, Class || SymetricalPlane);
    }
    static mouseup(e, cursorSystem, Class){
        Plane.mouseup(e, cursorSystem, Class || SymetricalPlane);
    }

    constructor(address, cls, Stick=PlaneStick, CenterCircle=PlanePositioningCircle, Resizers=PlaneResizers, Normal=SymetricalPlaneNormal){
        super(address, cls || SymetricalPlane, Stick, CenterCircle, Resizers, Normal);
    }
    setAngle(angle){
        super.setAngle(DEG180+absAngle(angle)%DEG180);
    }
    isSymetrical(){
        return true;
    }
}

Plane.selectionSheet = Plane.createSelectionSheet();