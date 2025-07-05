class SphericalMirrorStick extends ThinLensStick {
    constructor(entity, modes){
        super(entity, modes);
        this.linesMatrix = [];
        this.linesPath = createPath("");
        this.addHTMLElement(this.linesPath, "visual");
        this.linesW = 5;
        this.linesMargin = 10;
        this.nVisibleLines = 0;
    }
    changeX(v){
        let deltaX = super.changeX(v);
        for(let line of this.linesMatrix){
            line[0][0] += deltaX;
            line[1][0] += deltaX;
        }
        this.linesPath.setAttributeNS(null, "d", this.__convertLinesMatrix());
    }
    changeY(v){
        let deltaY = super.changeY(v);
        for(let line of this.linesMatrix){
            line[0][1] += deltaY;
            line[1][1] += deltaY;
        }
        this.linesPath.setAttributeNS(null, "d", this.__convertLinesMatrix());
    }
    changeW(v){
        super.changeW(v);
        this.linesPath.setAttributeNS(null, "stroke-width", v);
    }
    changeColor(color){
        super.changeColor(color);
        const strColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.linesPath.setAttributeNS(null, "stroke", strColor);
    };
    changeOpacity(v){
        super.changeOpacity(v);
        this.linesPath.setAttributeNS(null, "opacity", v);
    };
    changeH(v){
        super.changeH(v);
        this.nVisibleLines = parseInt(v/this.linesMargin);
        if(v>this.linesMargin) this.updateLines();
        else this.linesPath.style.display = "none";
    }
    
    updateLines(from, to){
        if(!from && !to){
            from = 0;
            to = this.nVisibleLines;
        }
        const conv = this.entity.isConv()? -1 : 1;

        
        this.linesMatrix = [];
        this.linesPath.style.display = "unset";

        for(let i=from; i<to; i++){
            let x = this.entity.matrix[0][0]*this.getZoom() + i*this.linesMargin*this.entity.vector[0];
            let y = this.entity.matrix[0][1]*this.getZoom() + i*this.linesMargin*this.entity.vector[1];
            this.linesMatrix.push([[x,y],
                    [
                        x - this.entity.vector[1]*this.linesW*conv,
                        y + this.entity.vector[0]*this.linesW*conv
                    ]
                ]
            );
        }
        this.linesPath.setAttributeNS(null, "d", this.__convertLinesMatrix());
    }

    __convertLinesMatrix(){
        let str = '';
        for(let line of this.linesMatrix){
            str += `M${line[0][0]} ${line[0][1]}L${line[1][0]} ${line[1][1]}`;
        }
        return str;
    }

    updateRotation(){
        let {cos1, cos2, sin1, sin2, x1, y1, x2, y2, conv} = super.updateRotation();

        this.arrowMat1[0][0] = x1*this.getZoom();
        this.arrowMat1[0][1] = y1*this.getZoom();
        this.arrowMat2[0][0] = x2*this.getZoom();
        this.arrowMat2[0][1] = y2*this.getZoom();
        
        if(conv){
            this.arrowMat1[2][0] = x1*this.getZoom() + sin2;
            this.arrowMat1[2][1] = y1*this.getZoom() - cos2;
            this.arrowMat2[2][0] = x2*this.getZoom() + sin1;
            this.arrowMat2[2][1] = y2*this.getZoom() - cos1;
        }
        else {
            this.arrowMat1[2][0] = x1*this.getZoom() - cos2;
            this.arrowMat1[2][1] = y1*this.getZoom() - sin2;
            this.arrowMat2[2][0] = x2*this.getZoom() + cos1;
            this.arrowMat2[2][1] = y2*this.getZoom() + sin1;
        }


        this.arrow1.setAttributeNS(null, "d", constructPath(this.arrowMat1));
        this.arrow2.setAttributeNS(null, "d", constructPath(this.arrowMat2));

        this.updateLines();
    }
    updateH(){
        this.changeH(this.entity.h*this.getZoom());
    }
    
}


class SphericalMirror extends ThinLens {
    static label = "spherical_mirror";
    static name = "Spherical Mirror";

    static maxStrokeW = 5;
    static selectionSheet = ThinLens.selectionSheet;

    static newEntity = null;
    static pointer = "pen";
    static settings = {
        f: 100,
        color: [255, 180, 255, 1],
        w: 2,
    };
    static mousedown(e, cursor, Class){
        Class = Class || SphericalMirror;
        ThinLens.mousedown(e, cursor, Class);
        Class.newEntity.changeF(Class.settings.f);
    }
    static mousemove(e, cursor, Class){
        ThinLens.mousemove(e, cursor, Class || SphericalMirror);
    }
    static mouseup(e, cursor, Class){
        ThinLens.mouseup(e, cursor, Class || SphericalMirror);
    }

    constructor(address, cls){
        super(address, cls || SphericalMirror, SphericalMirrorStick);
    }

    getR(){
        return this.f*2;
    }

    changeR(r){
        const prevF = this.f;
        this.f = r? r/2 : 0;
        if(this.f*prevF<0)
            this.updateLines();
        this.updatefpointImage(prevF);
    }
    angleOutput(point, angle, surfaceIndex){
        angle = -angle
        const cos = -Math.sin(angle + this.angle); // Math.cos(this.angle+DEG90 - -angle)
        const nextIntersection = constructIntersection(
            [[this.x, this.y], [this.x+Math.cos(angle), this.y+Math.sin(angle)]],
            [
             [this.fpointImage[0], this.fpointImage[1]], 
             [this.fpointImage[0]+this.vector[0], this.fpointImage[1]+this.vector[1]]
            ]
        )
        const sign = this.f<0 ? (cos>0 ? 0 : 1) : (cos<0 ? 0 : 1)
        return lineAngle([point, nextIntersection]) + sign*Math.PI 
    }
}