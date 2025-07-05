class FocalPoint extends HTMLEntity {
    constructor(entity, modes){
        super(entity, modes);
        this.circle = createCircle(0, 0, 0, "fill: rgb(255, 120, 120); r: 5;");
        this.triangleMat = [[0, 0], [0, 0], [0, 0]];
        this.triangle = createPath("", `fill: ${red};`);
        this.triangleLine = createLine(0, 0, 0, 0, `stroke: ${red}; stroke-width: 1px;`)
        this.text = createTextSpan("");
        this.textArea = createText([this.text], 0, 0, "entity-info-text", `fill: ${this.circle.getAttributeNS(null, "fill")};`);
        
        this.textSize = 12;
        this.textArea.style.fontSize = this.textSize + "px";

        this.distanceLine = createLine(0, 0, 0, 0, `stroke: ${red}; stroke-width: 1px;`);
        
        this.addHTMLElement(this.circle, "edit");
        this.addHTMLElement(this.triangle, "superVisual");
        this.addHTMLElement(this.triangleLine, "superVisual");
        this.addHTMLElement(this.textArea, "superVisual");
        this.addHTMLElement(this.distanceLine, "superVisual");
    }
    activatePointerEvents(){
        super.activatePointerEvents();
        this.circle.style.pointerEvents = "all";
    }
    desactivatePointerEvents(){
        super.desactivatePointerEvents();
        this.circle.style.pointerEvents = "none";
    }

    // change - update
    // change applies on html
    changeColor(color){
        this.circle.setAttributeNS(null, "fill", `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    };
    changeOpacity(v){
        this.circle.setAttributeNS(null, "opacity", v);
    };
    changeX(v){
        const cx = getCircleX(this.circle);
        const deltaX = v - cx;
        this.circle.setAttributeNS(null, "cx", v);
        this.triangleMat[0][0] += deltaX;
        this.triangleMat[1][0] += deltaX;
        this.triangleMat[2][0] += deltaX;
        this.triangleLine.setAttributeNS(null, "x1", getLineX1(this.triangleLine) + deltaX);
        this.triangleLine.setAttributeNS(null, "x2", getLineX2(this.triangleLine) + deltaX);
        this.distanceLine.setAttributeNS(null, "x1", getLineX1(this.distanceLine) + deltaX);
        this.distanceLine.setAttributeNS(null, "x2", getLineX2(this.distanceLine) + deltaX);

        this.textArea.setAttributeNS(null, "x", parseFloat(this.textArea.getAttributeNS(null, "x")) + deltaX);
        this.triangle.setAttributeNS(null, "d", constructPath(this.triangleMat));
    };
    changeY(v){
        const cy = getCircleY(this.circle);
        const deltaY = v - cy;
        this.circle.setAttributeNS(null, "cy", v);

        this.triangleMat[0][1] += deltaY;
        this.triangleMat[1][1] += deltaY;
        this.triangleMat[2][1] += deltaY;
        this.triangleLine.setAttributeNS(null, "y1", getLineY1(this.triangleLine) + deltaY);
        this.triangleLine.setAttributeNS(null, "y2", getLineY2(this.triangleLine) + deltaY);
        this.distanceLine.setAttributeNS(null, "y1", getLineY1(this.distanceLine) + deltaY);
        this.distanceLine.setAttributeNS(null, "y2", getLineY2(this.distanceLine) + deltaY);

        this.textArea.setAttributeNS(null, "y", parseFloat(this.textArea.getAttributeNS(null, "y")) + deltaY);
        this.triangle.setAttributeNS(null, "d", constructPath(this.triangleMat));
    };
    changeW(v){
        this.circle.setAttributeNS(null, "r", v);
    };
    changeH(v){
        this.changeW(v);
    };

    // update: depends on the entity
    // update applies on htmlfT
    updateColor(){
        this.changeColor(this.entity.color);
    };
    updateOpacity(){
        this.changeOpacity(this.entity.color[3]);
    };
    updateX(){
        this.changeX(this.entity.fpointImage[0]*this.getZoom());
    };
    updateY(){
        this.changeY(this.entity.fpointImage[1]*this.getZoom());
    };

    updateRotation(){
        super.updateRotation();
        const lineH = 6;
        const marginTrianSummetLine = -0.5;
        const marginY = lineH/2 + marginTrianSummetLine;
        const edge = 6;
        const angle = this.entity.angle%DEG180;
        const angle1 = angle+DEG150;
        const angle2 = angle-DEG150;

        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        const hx = cosAngle*marginY;
        const hy = sinAngle*marginY;

        this.circle.setAttributeNS(null, "cx", this.entity.fpointImage[0]*this.getZoom());
        this.circle.setAttributeNS(null, "cy", this.entity.fpointImage[1]*this.getZoom());

        this.triangleMat[0][0] = this.entity.fpointImage[0]*this.getZoom()+hx;
        this.triangleMat[0][1] = this.entity.fpointImage[1]*this.getZoom()+hy;
        this.triangleMat[1][0] = this.triangleMat[0][0] - edge*Math.cos(angle1);
        this.triangleMat[1][1] = this.triangleMat[0][1] - edge*Math.sin(angle1);
        this.triangleMat[2][0] = this.triangleMat[0][0] - edge*Math.cos(angle2);
        this.triangleMat[2][1] = this.triangleMat[0][1] - edge*Math.sin(angle2);

        this.text.innerHTML = Entity.outputF([this.entity]);
        
        this.triangleLine.setAttributeNS(null, "x1", this.triangleMat[0][0]-marginTrianSummetLine*cosAngle);
        this.triangleLine.setAttributeNS(null, "y1", this.triangleMat[0][1]-marginTrianSummetLine*sinAngle);
        this.triangleLine.setAttributeNS(null, "x2", this.entity.fpointImage[0]*this.getZoom()-hx);
        this.triangleLine.setAttributeNS(null, "y2", this.entity.fpointImage[1]*this.getZoom()-hy);

        this.distanceLine.setAttributeNS(null, "x1", this.triangleMat[0][0]-marginY*cosAngle);
        this.distanceLine.setAttributeNS(null, "y1", this.triangleMat[0][1]-marginY*sinAngle);
        this.distanceLine.setAttributeNS(null, "x2", this.entity.x*this.getZoom());
        this.distanceLine.setAttributeNS(null, "y2", this.entity.y*this.getZoom());
        const textWidth = this.textArea.getBoundingClientRect().width;
        const bottomMargin = this.textSize + 2;
        const cte = bottomMargin+edge*Math.sqrt(3)/2;
        const textX = this.triangleMat[0][0]+cte*cosAngle-textWidth/2*sinAngle;
        const textY = this.triangleMat[0][1]+cte*sinAngle+textWidth/2*cosAngle;

        this.textArea.setAttributeNS(null, "x", textX);
        this.textArea.setAttributeNS(null, "y", textY);
        this.textArea.setAttributeNS(null, "transform", `rotate(${angle*180/DEG180-90} ${textX},${textY})`);
        this.triangle.setAttributeNS(null, "d", constructPath(this.triangleMat));
    };

    activateEditting(){
        this.activatePointerEvents()
        this.displayHtmls();
        this.displayEdits();
        this.undisplayVisuals();
        this.undisplaySuperVisuals();
    }
    desactivateEditting(){
        this.undisplay();
    }

    ifmousedown(e){
        super.ifmousedown(e);
        const f = this.entity.f;
        this.undo = () => this.entity.changeF(f);
        this.updateRotation();
        this.undisplayHtmls();
        this.undisplayEdits();
        this.undisplayVisuals();
        this.displaySuperVisuals();
        this.entity.resizers.undisplay();

        this.entity.env.cursorSystem.setTempImage("pointer");
    }
    ifmousemove(e){
        super.ifmousemove(e);
        const x = this.entity.env.cursorSystem.getX(e), y = this.entity.env.cursorSystem.getY(e);
        const projection = constructOrthogonalPoint([
            [this.entity.x, this.entity.y], 
            [this.entity.x-this.entity.vector[1], this.entity.y+this.entity.vector[0]]], [x, y]);
        const sign = Math.sin(lineAngle([[this.entity.x, this.entity.y], projection])-this.entity.angle%DEG180)<0 ? -1 : 1;
        var dist = lineDistance([[this.entity.x, this.entity.y], projection]);
        if(e.shiftKey){
            if(e.ctrlKey) dist = parseInt(stick(dist, 5));
            else dist = parseInt(stick(dist, 1));
        }
        this.entity.changeF(sign*dist);

        if(dist<=getCircleR(this.entity.centerCircle.circle))
            this.entity.centerCircle.undisplay();
        else
            this.entity.centerCircle.display();

    }
    ifmouseup(e){
        super.ifmouseup(e);
        this.entity.resizers.display();
        this.entity.centerCircle.display();
        this.displayHtmls();
        this.displayEdits();
        this.displayVisuals();
        this.undisplaySuperVisuals();
        
        this.entity.resizers.display();
        this.entity.env.cursorSystem.resetPrevImage();
    }
    
    ifhover(e){
        this.changeColor(this.entity.hoverColor);
    }
    ifunhover(e){
        this.changeColor(this.entity.color);
    }
    ifselect(e){
        this.changeColor(this.entity.selectionColor);
    }
    ifunselect(e){
        this.changeColor(this.entity.color);
    }
    onhover(e){
        this.entity.hover(e);
    }
    onunhover(e){
        this.entity.unhover(e);
    }
}

class ThinLensStick extends PlaneStick {
    constructor(entity, modes){
        super(entity, modes);
        this.lockfocal = false;

        this.arrowMat1 = [[0, 0], [0, 0], [0, 0]];
        this.arrowMat2 = [[0, 0], [0, 0], [0, 0]];

        this.arrow1 = createPath("");
        this.arrow2 = createPath("");

        this.arrowEdge = 10;
        this.arrowAngle = Math.PI/4;
        this.cosArrowAngle = Math.cos(this.arrowAngle);
        this.sinArrowAngle = Math.sin(this.arrowAngle);

        this.addHTMLElement(this.arrow1, "visual");
        this.addHTMLElement(this.arrow2, "visual");
    }
    changeX(v){
        super.changeX(v);
        const deltaX = v - this.arrowMat1[1][0];
        this.arrowMat1[1][0] = v;
        this.arrowMat2[1][0] += deltaX;
        this.arrowMat1[0][0] += deltaX;
        this.arrowMat1[2][0] += deltaX;
        this.arrowMat2[0][0] += deltaX;
        this.arrowMat2[2][0] += deltaX;
        
        this.arrow1.setAttributeNS(null, "d", constructPath(this.arrowMat1));
        this.arrow2.setAttributeNS(null, "d", constructPath(this.arrowMat2));

        return deltaX;
    }

    changeY(v){
        super.changeY(v);
        const deltaY = v - this.arrowMat1[1][1];
        this.arrowMat1[1][1] = v;
        this.arrowMat2[1][1] += deltaY;
        this.arrowMat1[0][1] += deltaY;
        this.arrowMat1[2][1] += deltaY;
        this.arrowMat2[0][1] += deltaY;
        this.arrowMat2[2][1] += deltaY;
        
        this.arrow1.setAttributeNS(null, "d", constructPath(this.arrowMat1));
        this.arrow2.setAttributeNS(null, "d", constructPath(this.arrowMat2));

        return deltaY;
    }
    changeW(v){
        super.changeW(v);
        this.arrow1.setAttributeNS(null, "stroke-width", v);
        this.arrow2.setAttributeNS(null, "stroke-width", v);
    }
    changeColor(color){
        super.changeColor(color);
        const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.arrow1.setAttributeNS(null, "stroke", rgb);
        this.arrow2.setAttributeNS(null, "stroke", rgb);
    };
    changeOpacity(v){
        super.changeOpacity(v);
        this.arrow1.setAttributeNS(null, "opacity", v);
        this.arrow2.setAttributeNS(null, "opacity", v);
    };
    changeH(v){
        super.changeH(v);

        const deltaX1 = getLineX1(this.stick) - this.arrowMat1[1][0];
        const deltaY1 = getLineY1(this.stick) - this.arrowMat1[1][1];
        const deltaX2 = getLineX2(this.stick) - this.arrowMat2[1][0];
        const deltaY2 = getLineY2(this.stick) - this.arrowMat2[1][1];
        
        this.arrowMat1[1][0] += deltaX1;
        this.arrowMat2[1][0] += deltaX2;
        this.arrowMat1[0][0] += deltaX1;
        this.arrowMat1[2][0] += deltaX1;
        this.arrowMat2[0][0] += deltaX2;
        this.arrowMat2[2][0] += deltaX2;

        this.arrowMat1[1][1] += deltaY1;
        this.arrowMat2[1][1] += deltaY2;
        this.arrowMat1[0][1] += deltaY1;
        this.arrowMat1[2][1] += deltaY1;
        this.arrowMat2[0][1] += deltaY2;
        this.arrowMat2[2][1] += deltaY2;
        
        this.arrow1.setAttributeNS(null, "d", constructPath(this.arrowMat1));
        this.arrow2.setAttributeNS(null, "d", constructPath(this.arrowMat2));
    }

    updateRotation(){
        super.updateRotation();
        var cos1, cos2, sin1, sin2, conv;
        conv = this.entity.isConv();
        if( conv ){ 
            cos1 = -this.arrowEdge*(this.entity.vector[1]*this.cosArrowAngle + this.entity.vector[0]*this.sinArrowAngle);
            cos2 =  this.arrowEdge*(this.entity.vector[1]*this.cosArrowAngle - this.entity.vector[0]*this.sinArrowAngle);
            sin1 =  this.arrowEdge*(this.entity.vector[0]*this.cosArrowAngle - this.entity.vector[1]*this.sinArrowAngle); 
            sin2 = -this.arrowEdge*(this.entity.vector[0]*this.cosArrowAngle + this.entity.vector[1]*this.sinArrowAngle);
        }
        else {
            cos1 = this.arrowEdge*(this.entity.vector[0]*this.cosArrowAngle - this.entity.vector[1]*this.sinArrowAngle);
            cos2 = this.arrowEdge*(this.entity.vector[0]*this.cosArrowAngle + this.entity.vector[1]*this.sinArrowAngle);
            sin1 = this.arrowEdge*(this.entity.vector[1]*this.cosArrowAngle + this.entity.vector[0]*this.sinArrowAngle);
            sin2 = this.arrowEdge*(this.entity.vector[1]*this.cosArrowAngle - this.entity.vector[0]*this.sinArrowAngle);
        }

        const x1 = this.entity.matrix[0][0];
        const y1 = this.entity.matrix[0][1];
        const x2 = this.entity.matrix[1][0];
        const y2 = this.entity.matrix[1][1];

        this.arrowMat1[1][0] = x1*this.getZoom();
        this.arrowMat1[1][1] = y1*this.getZoom();
        this.arrowMat2[1][0] = x2*this.getZoom();
        this.arrowMat2[1][1] = y2*this.getZoom();

        this.arrowMat1[0][0] = x1*this.getZoom() + cos1;
        this.arrowMat1[0][1] = y1*this.getZoom() + sin1;
        this.arrowMat1[2][0] = x1*this.getZoom() + cos2;
        this.arrowMat1[2][1] = y1*this.getZoom() + sin2;
        
        this.arrowMat2[0][0] = x2*this.getZoom() - cos2;
        this.arrowMat2[0][1] = y2*this.getZoom() - sin2;
        this.arrowMat2[2][0] = x2*this.getZoom() - cos1;
        this.arrowMat2[2][1] = y2*this.getZoom() - sin1;

        this.arrow1.setAttributeNS(null, "d", constructPath(this.arrowMat1));
        this.arrow2.setAttributeNS(null, "d", constructPath(this.arrowMat2));
        return {cos1, cos2, sin1, sin2, x1, y1, x2, y2, conv};
    }

    ifmousedown(e){
        super.ifmousedown(e);
        this.lockfocal = !this.lockfocal;
    }
    ifhover(e){
        super.ifhover(e);
    }
    ifunhover(e){
        super.ifunhover(e);
    }
}


class ThinLens extends Plane {
    static label = "thin_lens";
    static name = "Thin Lens";
    static maxStrokeW = 4;

    static newEntity = null;
    static pointer = "pen";
    static settings = {
        f: 100,
        color: [180, 180, 180, 1],
        w: 2,
    };
    static mousedown(e, cursor, Class){
        Class = Class || ThinLens;
        Plane.mousedown(e, cursor, Class);
        Class.newEntity.changeF(Class.settings.f);
    }
    static mousemove(e, cursor, Class){
        Plane.mousemove(e, cursor, Class || ThinLens);
    }
    static mouseup(e, cursor, Class){
        Plane.mouseup(e, cursor, Class || ThinLens);
    }


    static createSelectionSheet(){
        let selectionSheet = Plane.createSelectionSheet();
        for(let section of selectionSheet){
            if(section.tag != "Physical") continue;
            section.inputs.push(new EntityInputSheet(
                "F", 3, "1fr", (selection, e) => Entity.inputF(selection, e), selection => Entity.outputF(selection), null,
                selection => selection.filter(selected => selected.isPlane() && selected.f != undefined)
            ));
            break;
        }
        return selectionSheet;
    }

    constructor(address, cls, Stick=ThinLensStick, CenterCircle=PlanePositioningCircle, Resizers=PlaneResizers, Normal=PlaneNormal, Focal=FocalPoint){
        super(address, cls || ThinLens, Stick, CenterCircle, Resizers, Normal);

        this.fpointImage = [0, 0];
        this.f = 0;

        this.focal = new Focal(this);
        this.centerCircle.addEventListener("dblclick", () => this.flipConv());
        
        this.pushHtmlEntity(this.focal);
    }

    getAlgebricF(){
        return this.isConv()? -this.f : this.f;
    }

    changeW(w){
        super.changeW(w<=0 ? 1 : (w > ThinLens.maxStrokeW? ThinLens.maxStrokeW : w ));
    }

    isConv(){
        return this.angle<DEG180;
    }
    flipConv(){
        this.changeAngle(this.angle%DEG180+(this.isConv()? DEG180 : 0));
        this.updateLightBeams();
    }
    changeF(f){
        if(!f) return;
        this.f = f;
        
        if(this.f<0){
            this.f *= -1;
            this.changeAngle(this.angle%DEG180+DEG180);
        }
        else this.changeAngle(this.angle%DEG180);
        
        this.fpointImage = [this.x - this.f*this.vector[1], this.y + this.f*this.vector[0]];
        

        this.focal.updateRotation();
        this.updateLightBeams();
    }

    updateMatrix(){
        super.updateMatrix();
        this.fpointImage = [this.x - this.f*this.vector[1], this.y + this.f*this.vector[0]];
    }

    angleOutput(point, angle, surfaceIndex){
        const cos = Math.sin(angle - this.angle)
        const nextIntersection = constructIntersection([
            [this.x, this.y], [this.x+Math.cos(angle), this.y+Math.sin(angle)]],
            [[this.fpointImage[0], this.fpointImage[1]], 
            [this.fpointImage[0]+this.vector[0], this.fpointImage[1]+this.vector[1]]]
        )
        const sign = this.f<0 ? (cos>0 ? 1 : 0) : (cos<0 ? 1 : 0);
        return lineAngle([point, nextIntersection]) + sign*Math.PI
    }
}

ThinLens.selectionSheet = ThinLens.createSelectionSheet();