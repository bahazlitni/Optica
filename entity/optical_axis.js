class OpticalAxis extends NonPhysicalEntity {
    static label = 'optical_axis';
    static label = "Optical Axis";

    static infinitLength = Math.sqrt(2)*10000;
    static activateEditting = cursorSystem => {
        clearMouseEvents();
        cursorSystem.env.desactivateEditting();
        cursorSystem.env.activateEditting(OpticalAxis.label);
        var newOpticalAxis = null;

        addMouseDown(e => {
            if(!cursorSystem.env.hover(e)) return;
            if(cursorSystem.env.cursorSystem.mode != cursorSystem.label) return;
            newOpticalAxis = new OpticalAxis(cursorSystem.env, e.offsetX, e.offsetY, 0, 
                cursorSystem.cursor.settings[OpticalAxis.label].color, cursorSystem.cursor.settings[OpticalAxis.label].strokeWidth);
            cursorSystem.env.addEntity(newOpticalAxis);
            newOpticalAxis.rotate(e);
        });
    }

    constructor(address, label){
        super(address, label || OpticalAxis.label);
      
        this.line = createLine( 0, 0, 0, 0, "stroke-dasharray: 20 20 5 20; opacity: 50%;");
        this.magnet = createLine( 0, 0, 0, 0, "stroke: transparent;" );

        this.angle = 0;
        this.color = [0, 0, 0, 0];
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.vector = [0, 0];
        
        this.centerCircle = new PositioningCircle(this, "fill: white;", false);
        this.arc = ArcVisual.newDefaultArc(this);

        this.magnet.addEventListener("mousedown", e => this.rotate(e));
        this.entities = {};

        this.changeW(2);
        this.changeH();
        this.changeColor(color);
        this.changeAngle(angle);
        this.changePosition(x, y);
        
        this.pushVisual(this.line);
        this.arc.pushEditVisual();
        this.pushEditVisual(this.magnet);
        this.centerCircle.pushEditVisual();
    }
    __getLineCoords(coords){
        return parseFloat(this.line.getAttributeNS(null, coords));
    }
    addEntity(entity){
        if(!this.entities[entity.label])
            this.entities[entity.label] = [];
        
        this.entities[entity.label].push(entity);
    }   

    getLine(){
        return [
            [ this.__getLineCoords("x1"), this.__getLineCoords("y1") ],
            [ this.__getLineCoords("x2"), this.__getLineCoords("y2") ]
        ]
    }
    changeColor(color){
        this.color[0] = color[0] || 0;
        this.color[1] = color[1] || 0;
        this.color[2] = color[2] || 0;
        this.color[3] = color[3] || 0;
        this.applyColor(this.color);
    }
    applyColor(color){
        this.line.setAttributeNS(null, "stroke", styleColor(color));
    }
    ChangeX(x){
        this.__deltaX = x - this.x;
        this.x = x || 0;
        this.line.setAttributeNS( null, "x1", this.__getLineCoords("x1")+this.__deltaX );
        this.line.setAttributeNS( null, "x2", this.__getLineCoords("x2")+this.__deltaX );
        this.magnet.setAttributeNS(null, "x1", this.__getLineCoords("x1"));
        this.magnet.setAttributeNS(null, "x2", this.__getLineCoords("x2"));
        this.centerCircle.changeX(this.x);
    }
    ChangeY(y){
        this.__deltaY = y - this.y;
        this.y = y || 0;
        this.line.setAttributeNS( null, "y1", this.__getLineCoords("y1")+this.__deltaY );
        this.line.setAttributeNS( null, "y2", this.__getLineCoords("y2")+this.__deltaY );
        this.magnet.setAttributeNS(null, "y1", this.__getLineCoords("y1"));
        this.magnet.setAttributeNS(null, "y2", this.__getLineCoords("y2"));
        this.centerCircle.changeY(this.y);
    }
    changeW(w){
        w = w || 0;
        this.__deltaW = w - this.w;
        this.w = w;
        this.line.setAttributeNS(null, "stroke-width", this.w);
        this.magnet.setAttributeNS(null, "stroke-width", this.w+10)
        this.centerCircle.changeR(this.w+5);
    }
    changeH(h){
        h = h || OpticalAxis.infinitLength;
        this.__deltaH = h - this.h;
        this.h = h;
        this.updateLine();
    }
    changePosition(x, y){
        this.ChangeX(x);
        this.ChangeY(y);
    }
    updateLine(){
        this.line.setAttributeNS( null, "x1", this.x - this.vector[0]*this.h);
        this.line.setAttributeNS( null, "x2", this.x + this.vector[0]*this.h);
        this.line.setAttributeNS( null, "y1", this.y - this.vector[1]*this.h);
        this.line.setAttributeNS( null, "y2", this.y + this.vector[1]*this.h);
        this.magnet.setAttributeNS(null, "x1", this.__getLineCoords("x1"));
        this.magnet.setAttributeNS(null, "x2", this.__getLineCoords("x2"));
        this.magnet.setAttributeNS(null, "y1", this.__getLineCoords("y1"));
        this.magnet.setAttributeNS(null, "y2", this.__getLineCoords("y2"));
    }
    changeAngle(e, angle){
        this.angle = angle || 0;
        this.angle = absAngle(this.angle)%DEG360;
        this.vector[0] = Math.cos(this.angle);
        this.vector[1] = Math.sin(this.angle);
        this.updateLine();
    }
    changeAngleEvent(e){
        const shiftKey = e.shiftKey;
        const offsetX = e.offsetX || mouseX;
        const offsetY = e.offsetY || mouseY;
        const angle = lineAngle([[this.x, this.y], [offsetX, offsetY]]);
        this.changeAngle(e, shiftKey? stick(angle, DEG15) : angle);
        this.arc.updateArc(distance([this.x, this.y], [offsetX, offsetY]));
    }

    rotate(e){
        var shiftMacro = new KeyDownMacro(
            "Shift",
            e => {
                this.changeAngleEvent(e);
            },
            null,
            false,
            false
        );
        addKeyDownMacro(shiftMacro);

        this.arc.display();

        addMouseUp(e => {
            this.arc.undisplay();
            removeKeyDownMacro(shiftMacro);
            clearMouseMove();
            clearMouseDown();
        });

        addMouseMove(e => {
            if(!this.env.softHover(e)) return;
            this.changeAngleEvent(e);
        });
    }

    activateEditting(){
        this.centerCircle.displayCircle();
    }

    desactivateEditting(){
        this.arc.undisplay();
        this.centerCircle.undisplayCircle();
        this.centerCircle.undisplayCross();

    }
}