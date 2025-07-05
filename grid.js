class Grid {
    static label = "environment_grid";
    static unitDivider = [
        THIRD,
        0.5,
        0.5,  
        0.5,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        5,
        5,
        5,
        5,
        5,
        10,
        10,
        10,
        12.5,
        12.5,
        12.5,
        25,
        25,
        50,
        100,
        150,
        250,
        250,
    ];


    constructor(env){
        this.path = createPath("");
        this.subPath = createPath("");

        this.indicatorX = createCircle(0, 0, 0);
        this.indicatorY = createCircle(0, 0, 0);

        this.midH = createLine(0, 0, 0, 0, "opacity: 1;");
        this.midV = createLine(0, 0, 0, 0, "opacity: 1;");

        this.unit = 50;
        this.origin = [0, 0];
        this.mainLinesColor = [0, 0, 0, 1];
        this.color = [0, 0, 0, 1];

        this.embed(env);
        this.setOpacity(1);
        this.setColor([80, 80, 80]);
        this.setMainLinesColor([80, 100, 128]);
        this.setW(0.5);
    }

    getZoom(){
        return this.env.getZoom();
    }
    getUnitDivider(){
        return Grid.unitDivider[Camera.zooms.indexOf(this.getZoom())];
    }
    getUnit(){
        return this.unit;
    }
    getZoomedUnit(){
        return this.getUnit()/this.getUnitDivider();
    }

    undisplay(){
        this.path.style.display = "none";
        this.midV.style.display = "none";
        this.midH.style.display = "none";
    }
    display(){
        this.path.style.display = "unset";
        this.midV.style.display = "unset";
        this.midH.style.display = "unset";
    }
    updateColor(){
        const strRgb = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
        this.path.setAttributeNS(null, "stroke", strRgb);
        this.subPath.setAttributeNS(null, "stroke", strRgb);
    }
    updateMainLinesColor(){
        const strRgb = `rgb(${this.mainLinesColor[0]}, ${this.mainLinesColor[1]}, ${this.mainLinesColor[2]})`;
        this.midV.setAttributeNS(null, "stroke", strRgb);
        this.midH.setAttributeNS(null, "stroke", strRgb);
        this.indicatorX.setAttributeNS(null, "fill", strRgb);
        this.indicatorY.setAttributeNS(null, "fill", strRgb);
    }
    updateOpacity(){
        this.path.setAttributeNS(null, "opacity", this.color[3]);
        this.subPath.setAttributeNS(null, "opacity", this.color[3]*0.75);
    }
    updateW(){
        this.path.setAttributeNS(null, "stroke-width", this.w);
        this.subPath.setAttributeNS(null, "stroke-width", this.w/2);
        let w = this.w*1.5;
        w = w>1.5? w : 1.5;
        this.midV.setAttributeNS(null, "stroke-width", w);
        this.midH.setAttributeNS(null, "stroke-width", w);
        this.indicatorX.setAttributeNS(null, "r", w+1);
        this.indicatorY.setAttributeNS(null, "r", w+1);
    }

    setColor(color){
        this.color[0] = color[0] || 0;
        this.color[1] = color[1] || 0;
        this.color[2] = color[2] || 0;
        this.updateColor();
    }
    setMainLinesColor(color){
        this.mainLinesColor[0] = color[0] || 0;
        this.mainLinesColor[1] = color[1] || 0;
        this.mainLinesColor[2] = color[2] || 0;
        this.updateMainLinesColor();
    }
    setOpacity(opacity){
        if(!opacity && opacity!=0) return;
        this.color[3] = opacity;
        this.updateOpacity();
    }
    setW(w){
        this.w = w || 0;
        this.updateW();
    }
    setUnit(unit){
        this.unit = unit || 1;
        this.update();
    }

    embed(env){
        if(!env || this.env == env) return;
        this.env = env;
        this.env.embedBackground(this.subPath);
        this.env.embedBackground(this.path);
        this.env.embedBackground(this.midV);
        this.env.embedBackground(this.midH);
        this.env.embedBackground(this.indicatorX);
        this.env.embedBackground(this.indicatorY);

        this.origin[0] = this.env.getCenterX();
        this.origin[1] = this.env.getCenterY();

        this.env.root.addEventListener("mousemove", e => this.updateIndicators(e));

        this.indicatorX.setAttributeNS(null, "cy", this.origin[1]*this.getZoom());
        this.indicatorY.setAttributeNS(null, "cx", this.origin[0]*this.getZoom());

        this.update();
    }


    update(){
        if(!this.env) return;
        let unit = this.getZoomedUnit();

        const nH = parseInt((this.env.layerH-unit)/unit/2);
        const nV = parseInt((this.env.layerW-unit)/unit/2);

        this.midV.setAttributeNS(null, "x1", this.origin[0]*this.getZoom());
        this.midV.setAttributeNS(null, "x2", this.origin[0]*this.getZoom());
        this.midV.setAttributeNS(null, "y2", this.env.layerH*this.getZoom());

        this.midH.setAttributeNS(null, "y1", this.origin[1]*this.getZoom());
        this.midH.setAttributeNS(null, "y2", this.origin[1]*this.getZoom());
        this.midH.setAttributeNS(null, "x2", this.env.layerW*this.getZoom());


        let str = '';
        let subStr = '';
        const halfUnit = -unit*this.getZoom()/2;

        for(let i=1; i<=nH+1; i++){
            let y1 = (this.origin[1] - i*unit)*this.getZoom();
            let y2 = (this.origin[1] + i*unit)*this.getZoom();
            str += `M0 ${y1}L${this.env.layerW*this.getZoom()} ${y1}M0 ${y2}L${this.env.layerW*this.getZoom()} ${y2}`;
            subStr += `M0 ${y1-halfUnit}L${this.env.layerW*this.getZoom()} ${y1-halfUnit}M0 ${y2+halfUnit}L${this.env.layerW*this.getZoom()} ${y2+halfUnit}`;
        }
        for(let i=1; i<=nV+1; i++){
            let x1 = (this.origin[0] - i*unit)*this.getZoom();
            let x2 = (this.origin[0] + i*unit)*this.getZoom();
            str += `M${x1} 0L${x1} ${this.env.layerH*this.getZoom()}M${x2} 0L${x2} ${this.env.layerH*this.getZoom()}`;
            subStr += `M${x1-halfUnit} 0L${x1-halfUnit} ${this.env.layerH*this.getZoom()}M${x2+halfUnit} 0L${x2+halfUnit} ${this.env.layerH*this.getZoom()}`;
        }


        this.indicatorX.setAttributeNS(null, "cy", this.origin[1]*this.getZoom());
        this.indicatorY.setAttributeNS(null, "cx", this.origin[0]*this.getZoom());
        this.indicatorX.setAttributeNS(null, "cx", (this.indicatorCx || this.origin[0])*this.getZoom());
        this.indicatorY.setAttributeNS(null, "cy", (this.indicatorCy || this.origin[1])*this.getZoom());

        this.path.setAttributeNS(null, "d", str);
        this.subPath.setAttributeNS(null, "d", subStr);
    }

    updateIndicators(e){
        this.indicatorX.setAttributeNS(null, "cy", this.origin[1]*this.getZoom());
        this.indicatorY.setAttributeNS(null, "cx", this.origin[0]*this.getZoom());
        
        if(!this.env.isOnHover){
            this.indicatorX.setAttributeNS(null, "cx", this.origin[0]*this.getZoom());
            this.indicatorY.setAttributeNS(null, "cy", this.origin[1]*this.getZoom());
            return;
        }

        this.indicatorCx = this.env.cursorSystem.getX(e);
        this.indicatorCy = this.env.cursorSystem.getY(e);
        this.indicatorX.setAttributeNS(null, "cx", this.indicatorCx*this.getZoom());
        this.indicatorY.setAttributeNS(null, "cy", this.indicatorCy*this.getZoom());
    }

    updateZoom(){
        this.update();
    }
}