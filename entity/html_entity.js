class HTMLEntity {
    static label = "html_entity";
    static label = "Html Entity";

    static categories = ["visual", "html", "edit", "superVisual"];
    static eventTypes = ["mousedown", "mousemove", "mouseup"];
    
    constructor(entity, name){
        this.entity = entity || null;
        this.name = name || null;

        this.isDisplayed = null;
        this.__loadCatrgories();
        this.display();
    }

    getStatus(){
        const status = {
            allowPendingEvents: this.allowPendingEvents,
            isDisplayed: this.isDisplayed,
        };
        for(let category of HTMLEntity.categories) status[category+"sDisplayed"] = this[category+"sDisplayed"];
        return status;
    }

    __loadCatrgories(){
        for(let category of HTMLEntity.categories){                     // example: html
            category = category + "s";                                  // adds s to refer to multiple elements
            this[category] = [];                                        // this.htmls is now an array
            const str = "display"+capitalizeStr(category);              // this.displayHtmls
            // DISPLAY - UNDISPLAY
            this["un"+str] = () => this.__setDisplay(category, "none"); // this.undisplayHtmls is now a function
            this[str] = () => this.__setDisplay(category, "unset");     // this.displayHtmls is now a function
        }
    }
    __addEventListeners(html, category){
        if(!(category == "html" || category == "edit")) return;
        html.style.visibility = "visible";
        html.addEventListener("mousedown", e => {
                this.__stack = true;
                this.entity.env.cursorSystem.setPressedHtmlEntity(this);
            }
        );
        html.addEventListener("click", e => {
                this.entity.env.cursorSystem.setClickedHtmlEntity(this);
            }
        );
        html.addEventListener("dblclick", e => {
                this.entity.env.cursorSystem.setDblclickedHtmlEntity(this);
            }
        );
        html.addEventListener("mouseover", e => {
                this.entity.env.cursorSystem.setHoveredHtmlEntity(this);
            }
        );
        html.addEventListener("mouseleave", e => {
                this.entity.env.cursorSystem.unsetHoveredHtmlEntity(this);
            }
        );
    }
    __setDisplay(category, display){
        this[category+"Displayed"] = display != "none";
        for(let element of this[category]) element.style.display = display;
    }
    addHTMLElement(html, category){
        this.__addEventListeners(html, category);
        this[category+"s"].push(html);
        this.display();
    }
    display(){
        this.isDisplayed = true;
        this.displayHtmls();
        this.displayVisuals();
        this.undisplaySuperVisuals();
    }
    undisplay(){
        this.isDisplayed = false;
        this.undisplayHtmls();
        this.undisplayVisuals();
        this.undisplaySuperVisuals();
    }

    getZoom(){
        if(!this.entity.env) return 1;
        return this.entity.env.getZoom();
    }
    updateZoom(){
        this.updatePosition();
        this.updateSize();
        this.updateRotation();
    }


    // change - update

    // change applies on html
    changeColor(color){};
    changeOpacity(v){};
    changeX(v){};
    changeY(v){};
    changeW(v){};
    changeH(v){};

    // update: depends on the entity
    // update applies on html
    updateColor(){};
    updateOpacity(){};
    updateX(){};
    updateY(){};
    updateW(){};
    updateH(){};
    updateRotation(){};

    changePosition(x, y){
        this.changeX(x);
        this.changeX(y);
    }
    changeSize(w, h){
        this.changeW(w);
        this.changeH(h);
    }
    updatePosition(){
        this.updateX();
        this.updateY();
    }
    updateSize(){
        this.updateW();
        this.updateH();
    }
    activateEditting(){
        this.displayEdits();
        this.activatePointerEvents();
        this.mousedown = e => this.ifmousedown(e);
        this.click = e => this.ifclick(e);
        this.dblclick = e => this.ifdblclick(e);
        this.onhover = e => this.ifonhover(e);
        this.onunhover = e => this.ifonunhover(e);
    }
    desactivateEditting(){
        this.undisplayEdits();
        this.mousedown = e => null;
        this.click = e => null;
        this.dblclick = e => null;
        this.onhover = e => null;
        this.onunhover = e => null;
    }
    activatePointerEvents(){
        this.isInteractive = true;
    }
    desactivatePointerEvents(){
        this.isInteractive = false;
    }

    // events apply on entities
    mousenotdown(e){
        if(this.entity.isHovered) return;
        this.ifmousenotdown(e);
    }
    mousedown(e){
        this.ifmousedown(e);
    }
    mousemove(e){
        if(!this.entity.env.softHover(e)) {
            this.entity.env.cursorSystem.setTempImage("block");
            this.__blockedImage = true;
            return;
        }
        if(this.__blockedImage){
            this.entity.env.cursorSystem.resetPrevImage();
            this.__blockedImage = false;
        }
        
        this.ifmousemove(e);
    }
    mouseup(e){
        this.ifmouseup(e);
        this.__stack = false;
        this.undisplaySuperVisuals();
        this.entity.env.cursorSystem.pressedEntity = null;
    }

    hover(e){
        this.ifhover(e);
    }
    unhover(e){
        this.ifunhover(e);
    }
    select(e){
        this.ifselect(e);
    }
    unselect(e){
        this.ifunselect(e);
    }

    ifmousedown(e){
        this.mousemoved = false;
        this.entity.env.root.onmousemove  = e => this.mousemove(e);
        this.entity.env.root.onmouseup    = e => this.mouseup(e);
        this.entity.env.root.onmouseleave = e => this.mouseup(e);
    }
    ifmousemove(e){
        this.mousemoved = true;
    }
    ifmouseup(e){ 
        this.mousemoved = false;
        this.entity.env.root.onmousemove = null;
        this.entity.env.root.onmouseup = null;
        this.entity.env.root.onmouseleave = null;
    }
    ifmouseover(e){}
    ifmouseleave(e){}

    ifmousenotdown(e){
        this.entity.unselect(e);
    }
    ifselect(e){
        this.entity.changeColor(this.entity.selectionColor);
    }
    ifunselect(e){
        this.entity.changeColor(this.entity.colorRestored);
    }
    ifhover(e){}
    ifunhover(e){}

    onhover(e){}
    onunhover(e){}
    ifonhover(e){
        this.entity.hover(e);
    }
    ifonunhover(e){
        this.entity.unhover(e);
    }
    
    click(e){}
    dblclick(e){}
    ifclick(e){}
    ifdblclick(e){}
    
    getBBox(){
        return [0, 0, 0, 0];
    }

    embed(){
        for(let category of HTMLEntity.categories){
            const capCategory = capitalizeStr(category);
            for(let element of this[category+"s"]){
                this.embedHTMLElement(element, category);
            }
        }
    }
    embedAndPushHTMLElement(element, category){
        this.embedHTMLElement(element, category);
        this[category+"s"].push(element);
    }
    embedHTMLElement(element, category){
        this.entity.env["embed"+capitalizeStr(category)](element);
        this.__addEventListeners(element, category);
        if(element.displayCache) element.style.display = element.displayCache;        
    }
    remove(){
        for(let html of this.htmls) html.remove();
        for(let visual of this.visuals) visual.remove();
        for(let superVisual of this.superVisuals) superVisual.remove();
        undefine(this);
    }
    softRemove(){
        for(let category of HTMLEntity.categories){
            for(let html of this[category+"s"]){
                html.displayCache = html.style.display;
                html.style.display = "none";
            }    
        }
    }
    softRetrieve(){
        for(let category of HTMLEntity.categories){
            for(let html of this[category+"s"]){
                html.style.display = html.displayCache;
            }    
        }
    }
}