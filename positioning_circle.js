class PositioningCircle extends HTMLEntity {
    constructor(entity, modes){
        super(entity, modes);

        this.circle = createCircle(0, 0, 0, "fill: white;");
        this.crossLineH = createLine(0, 0, 0, 0, `stroke: ${red}; stroke-width: 1px;`);
        this.crossLineV = createLine(0, 0, 0, 0, `stroke: ${red}; stroke-width: 1px;`);

        this.addHTMLElement(this.circle, "edit");
        this.addHTMLElement(this.crossLineV, "superVisual");
        this.addHTMLElement(this.crossLineH, "superVisual");

        this.dblclick = (e => null);

        this.betweenClicks = 300;
        this.clickT = 0;

        this.undisplayCross();
    }

    activatePointerEvents(){
        super.activatePointerEvents();
        this.circle.style.pointerEvents = "all";
    }
    desactivatePointerEvents(){
        super.desactivatePointerEvents();
        this.circle.style.pointerEvents = "none";
    }

    displayCross(){
        this.crossLineV.style.display = "unset";
        this.crossLineH.style.display = "unset";
    }
    undisplayCross(){
        this.crossLineV.style.display = "none";
        this.crossLineH.style.display = "none";
    }
    displayCircle(){
        this.circle.style.display = "unset";
    }
    undisplayCircle(){
        this.circle.style.display = "none";
    }

    addEventListener(type, listener){
        if(type == "dblclick")
            this.dblclick = listener;
        else
            this.circle.addEventListener(type, listener);
    }


    ifmousedown(e){
        super.ifmousedown(e);
        
        const x = this.entity.x;
        const y = this.entity.y;

        this.__undo = () => this.entity.changePosition(x, y);

        this.__diffCx = getCircleClickOffsetX(e, getCircleX(e.srcElement));
        this.__diffCy = getCircleClickOffsetY(e, getCircleY(e.srcElement));

        var clickT = new Date().getTime();
        if(this.entity.env.getCursorMode() != this.entity.cls.label) return;
        
        if(!this.clickT)
            this.clickT = clickT;
        else if(clickT-this.clickT<this.betweenClicks){
            this.dblclick(e);
            this.clickT = 0;
        }

        this.clickT = clickT;
        this.undisplayCircle();
        this.displayCross();

        this.entity.env.undisplayDialogs();
        this.entity.env.cursorSystem.setTempImage("drag");
        this.entity.env.cursorSystem.undisplayCursor();
    }
    ifmousemove(e){
        super.ifmousemove(e);
        this.entity.changePosition(
            this.entity.env.cursorSystem.getX(e), 
            this.entity.env.cursorSystem.getY(e)
        )
        
        this.entity.moving = true;
    }
    ifmouseup(e){
        super.ifmouseup(e);
        this.entity.env.displayDialogs();

        const x = this.entity.x;
        const y = this.entity.y;
        this.entity.env.stackUndo({
            undo: this.__undo,
            redo: () => {
                this.entity.changePosition(x, y);
            }
        })

        this.entity.moving = false;
        this.displayCircle();
        this.undisplayCross();
        this.entity.env.cursorSystem.resetPrevImage();
    }
}