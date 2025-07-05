class ArcVisual extends HTMLEntity {
    static label = "arc_visual";

    constructor(entity, label){
        super(entity, label || ArcVisual.label);
        this.entity = entity;
        this.arc = createArc(0, 0, 0, 0, 0);
        this.arcText = createTextSpan();
        this.arcTextArea = createText([this.arcText], 0, 0, "environment-info-text");
        this.rotCircle = createCircle(0, 0, 0);

        this.addHTMLElement(this.arc, "superVisual");
        this.addHTMLElement(this.arcTextArea, "superVisual");
        this.addHTMLElement(this.rotCircle, "superVisual");

        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.startAng = 0;
        this.endAng = 0;

        this.__characterWidth = 8; //Length reserved for each character in the visual angle info.
        this.__nDecimalDigits = 2; //Number of digits after float point shown in the visual angle info.
        this.isDisplayed = false;
        this.undisplay();
    }
    getVisualAngle(){
        const n = 10**this.__nDecimalDigits;
        return  parseInt(stick(((DEG360 - this.entity.angle)%DEG360)*180/Math.PI, 0.01)*n)/n;
    }
    updateAngleTextInfo(){
        const visualAngleStr = `${this.getVisualAngle()}°`;
        this.arcText.innerHTML = visualAngleStr;
        this.arcText.setAttributeNS(null, "textLength", this.__characterWidth*visualAngleStr.length);
    }
    __translateX(deltaX){
        if(!deltaX) return;
        this.x += deltaX;
        this.arcTextArea.setAttributeNS(null, "x", parseFloat(this.arcTextArea.getAttributeNS(null, "x")) + deltaX);
        this.rotCircle.setAttributeNS(null, "cx", parseFloat(this.rotCircle.getAttributeNS(null, "cx")) + deltaX);
    }
    __translateY(deltaY){
        if(!deltaY) return;
        this.y += deltaY;
        this.arcTextArea.setAttributeNS(null, "y", parseFloat(this.arcTextArea.getAttributeNS(null, "y")) + deltaY);
        this.rotCircle.setAttributeNS(null, "cy", parseFloat(this.rotCircle.getAttributeNS(null, "cy")) + deltaY);
    }
    __translate(deltaX, deltaY){
        this.__translateX(deltaX);
        this.__translateY(deltaY);
    }
    translateX(deltaX){
        this.__translateX(deltaX);
    }
    translateY(deltaY){
        this.__translateY(deltaY);
    }
    translate(deltaX, deltaY){
        this.__translate(deltaX, deltaY);
    }

    setEndAng(angle){
        if(!angle && angle!=0) return;
        this.endAng = absAngle(angle);
    }

    changeColor(color){
        const strRgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.arc.setAttributeNS(null, "stroke", strRgb);
        this.arcTextArea.setAttributeNS(null, "fill", strRgb);
        this.rotCircle.setAttributeNS(null, "fill", strRgb); 
    }
    changeOpacity(opacity){
        this.arc.setAttributeNS(null, "opacity", opacity);
        this.arcTextArea.setAttributeNS(null, "opacity", opacity);
    }

    updateColor(){
        this.changeColor(this.entity.color);
    }
    updateOpacity(){
        this.changeOpacity(this.entity.color[3]);
    }

    changeArc(cx, cy, r, angle){
        this.x = cx;
        this.y = cy;
        this.r = r;
        const zoom = this.getZoom();
        this.setEndAng(angle);
        
        if(this.endAng){
            this.displayArc();
            changeArcD(this.arc, this.x*zoom, this.y*zoom, this.r, 0, this.endAng);
        }
        else this.undisplayArc();
        
        const g = this.endAng? this.endAng/2 : DEG180;
        const v = (DEG360 - this.endAng)%DEG360/DEG360;
        
        this.updateAngleTextInfo();
        this.arcTextArea.setAttributeNS(null, "x", this.x*zoom - Math.cos(g)*(this.r+20+48*v));
        this.arcTextArea.setAttributeNS(null, "y", this.y*zoom - Math.sin(g)*(this.r+20+48*v));
        this.rotCircle.setAttributeNS(null, "cx", this.x*zoom + this.r*Math.cos(this.endAng));
        this.rotCircle.setAttributeNS(null, "cy", this.y*zoom + this.r*Math.sin(this.endAng));
    }

    updateRotation(){
        if(!this.isDisplayed) return;
        this.changeArc(this.entity.x, this.entity.y, 20,
        this.entity.angle
        );
    }

    displayArcInfo(){
        this.arcTextArea.style.display = "unset";
    }
    undisplayArcInfo(){
        this.arcTextArea.style.display = "none";
    }
    displayArc(){
        this.arc.style.display = "unset";
    }
    undisplayArc(){
        this.arc.style.display = "none";
    }
    displayRotCircle(){
        this.rotCircle.style.display = "unset";
    }
    undisplayRotCircle(){
        this.rotCircle.style.display = "none";
    }
    display(){
        if(!this.entity.env) return;
        this.isDisplayed = true;
        this.updateRotation();
        this.activateRotCircle();
        this.displayRotCircle();
        this.displayArcInfo();
        this.displayArc();
        this.activateRotCircle();
    }
    undisplay(){
        this.isDisplayed = false;
        this.disactivateRotCircle();
        this.undisplayRotCircle();
        this.undisplayArcInfo();
        this.undisplayArc();
        this.disactivateRotCircle();
    }

    //blink logic
    activateRotCircle(){
        this.blinking = true;
        this.displayRotCircle();
        blinkSVGComp(this.rotCircle, 1, () => !this.blinking);
    }
    disactivateRotCircle(){
        this.blinking = false;
        if(this.entity.rotating) return;
        this.undisplayRotCircle();
    }
}