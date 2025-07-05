class Entity {
    static label = "entity";
    static label = "Entity";

    static pointer = "pen";
    static settings = {};
    static newEntities = {};
    static newEntity = null;
    static entityAddress = 0;
    static selectionSheet = null;

    static inputData(selection, e, input){
        for(let i=0; i<selection.length; i++){
            if(!selection[i]) continue;
            inputNumber(e, str => input(selection[i], str), selection[i].env.submitInput);     
        }
    }
    static inputBoolean(selection, e, setter){
        selection.forEach(selected => {
            inputBoolean(e, bool => setter(selected, bool), selected.env.submitInput)
        })
    }
    static inputText(selection, e, setter){
        selection.forEach(selected =>
            inputText(e, str => setter(selected, str.trim()), selected.env.submitInput)
        )
    }
    static outputText(selection, getter){
        if(selection.length == 0) return ''
        if(selection.length == 1) return getter(selection[0])
        const text = getter(selection[0])
        for(let selected of selection){
            if(getter(selected) != text) return 'Mixed'
        }
        return text
    }
    // plane
    static inputX(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeX(selected.env.inputX(str, selected.x)));
    }
    static inputY(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeY(selected.env.inputY(str, selected.y)));
    }
    static inputH(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeH(selected.env.inputH(str, selected.h)));
    }
    static inputColor(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeColor(selected.env.inputColor(str, selected.color), true));
    }
    static inputStrokeW(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeW(selected.env.inputStrokeW(str, selected.w)));
    }
    static inputAbsorption(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeAbsorption(selected.env.inputAbsorption(str, selected.absorption)));
    }
    static inputAngle(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeAngle(selected.env.inputAngle(str, selected.angle)));
    }
    static inputOpacity(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeOpacity(selected.env.inputOpacity(str, selected.color[3])));
    }
    static inputF(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeF(selected.env.inputF(str, selected.getAlgebricF())));
    }

    // light
    static inputSrcX(selection, e){
        Entity.inputX(selection, e);
    }
    static inputSrcY(selection, e){
        Entity.inputY(selection, e);
    }
    static inputEndX(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeEndX(selected.env.inputX(str, selected.matrix[1][0])));
    }
    static inputEndY(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeEndY(selected.env.inputY(str, selected.matrix[1][1])));
    }
    static inputLambda(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeLambda(selected.env.inputLambda(str, selected.lambda)));
    }
    static inputGamma(selection, e){
        Entity.inputData(selection, e, (selected, str) => selected.changeGamma(selected.env.inputGamma(str, selected.gamma)));
    }


    static outputData(selection, output, get){
        if(!selection) return "";
        let i = 1;
        let selected = selection[0];
        while(!selected || !selected.env){
            if(i>=selection.length) return "";
            selected = selection[i];
            i++;
        }
        
        for(let j = 0; j<selection.length; j++){
            try {
                if(get(selection[j]) != get(selected)) return "Mixed";
            }
            catch {
            }
            
        }
        try {
            return output(selected.env, get(selected));
        }
        catch {
            return "";
        }
        
    }

    // plane
    static outputX(selection){
        return Entity.outputData(selection, (env, v) => env.outputX(v), selected => selected.x);
    }
    static outputY(selection){
        return Entity.outputData(selection, (env, v) => env.outputY(v), selected => selected.y);
    }
    static outputStrokeW(selection){
        return Entity.outputData(selection, (env, v) => env.outputStrokeW(v), selected => selected.w);
    }
    static outputH(selection){
        return Entity.outputData(selection, (env, v) => env.outputH(v), selected => selected.h);
    }
    static outputAngle(selection){
        return Entity.outputData(selection, (env, v) => env.outputAngle(v), selected => selected.angle);
    }
    static outputColor(selection){
        return Entity.outputData(selection, (env, v) => `${v[0]} ${v[1]} ${v[2]}`, selected => selected.color);
    }
    static outputAbsorption(selection){
        return Entity.outputData(selection, (env, v) => env.outputAbsorption(v), selected => selected.absorption);
    }
    static outputOpacity(selection){
        return Entity.outputData(selection, (env, v) => env.outputOpacity(v), selected => selected.color[3]);
    }
    static outputF(selection){
        return Entity.outputData(selection, (env, v) => env.outputF(v), selected => selected.getAlgebricF());
    }

    // light
    static outputEndX(selection){
        return Entity.outputData(selection, (env, v) => env.outputX(v), selected => selected.matrix[1][0]);
    }
    static outputEndY(selection){
        return Entity.outputData(selection, (env, v) => env.outputY(v), selected => selected.matrix[1][1]);
    }
    static outputLambda(selection){
        return Entity.outputData(selection, (env, v) => env.outputLambda(v), selected => selected.lambda);
    }
    static outputGamma(selection){
        return Entity.outputData(selection, (env, v) => env.outputGamma(v), selected => selected.gamma);
    }


    static addEntity(Class){
        Class.newEntity = new Class(Class.entityAddress, Class);
        Class.newEntities[Class.entityAddress] = Class.newEntity;
        Class.entityAddress++;
    }

    static mousedown(e, cursorSystem, Class){
        Class = Class || Entity;
        Entity.addEntity(Class);

        Class.newEntity.embed(cursorSystem.env);
        Class.newEntity.changeX(cursorSystem.getX(e));
        Class.newEntity.changeY(cursorSystem.getY(e));
        Class.newEntity.changeH(0);
        Class.newEntity.changeW(cursorSystem.cursor.settings.w);
        if(cursorSystem.cursor.settings.color) {
            Class.newEntity.changeColor(cursorSystem.cursor.settings.color);
            Class.newEntity.changeOpacity(cursorSystem.cursor.settings.color[3]);
        }
        Class.newEntity.changeAngle(DEG90);
        Class.newEntity.activateEditting();

        cursorSystem.env.root.onmousemove = e => Class.mousemove(e, cursorSystem, Class);
        cursorSystem.env.root.onmouseup = e => Class.mouseup(e, cursorSystem, Class);
        cursorSystem.env.root.onmouseleave = e => Class.mouseup(e, cursorSystem, Class);
    }
    static mousemove(e, cursorSystem, Class){}
    static mouseup(e, cursorSystem, Class){
        const status = Class.newEntity.getStatus();
        Class.newEntity.env.stackUndo({
            undo: () => {
                status.cls.newEntities[status.address].softRemove();
            },
            redo: () => { 
                status.cls.newEntities[status.address].softRetrieve();
            },
            forget: () => {
                status.cls.newEntities[status.address].remove();
                delete status.cls.newEntities[status.address];
            }
        });

        cursorSystem.env.root.onmousemove = null;
        cursorSystem.env.root.onmouseup = null;
        cursorSystem.env.root.onmouseleave = null;
    }
    


    constructor(address, cls){
        //COLORS
        this.address = address;
        this.cls = cls;

        this.selectionColor = [90, 180, 255, 1];
        this.hoverColor = [80, 127, 255, 1];
        this.colorRestored = [0, 0, 0, 0];
        this.color = [0, 0, 0, 0];

        this.env = null;
        
        this.moving = false;
        this.isSelected = false;
        this.isHovered = false;

        this.edittingActivated = null;

        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;

        this.matrix = [];

        this.angle = 0;
        this.vector = [1, 0];

        this.htmlEntities = [];
        this.selectionSheet = [];


    }

    getBBox(){}

    getStatus(){
        const env = this.env;
        const status = {
            address: this.address,
            cls: this.cls,

            selectionColor: [this.selectionColor[0], this.selectionColor[1], this.selectionColor[2], this.selectionColor[3]],
            hoverColor:     [this.hoverColor[0], this.hoverColor[1], this.hoverColor[2], this.hoverColor[3]],
            colorRestored:  [this.colorRestored[0], this.colorRestored[1], this.colorRestored[2], this.colorRestored[3]],
            color:  [this.color[0], this.color[1], this.color[2], this.color[3]],

            env: env,

            moving : this.moving,
            isSelected: this.isSelected,
            isHovered: this.isHovered,

            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            angle: this.angle,
            
            htmlEntitiesStatus: {},
            edittingActivated: this.edittingActivated,
        }
        
        for(let i=0; i<this.htmlEntities.length; i++){
            const htmlEntityStatus = this.htmlEntities[i].getStatus();
            status.htmlEntitiesStatus[this.htmlEntities[i].name || i] = htmlEntityStatus;
        }

        return status;
    }

    pushHtmlEntity(htmlEntity){
        if(findIn(htmlEntity, this.htmlEntities)) return;
        this.htmlEntities.push(htmlEntity);
    }
    replaceHtmlEntity(oldHtmlEntity, newHtmlEntity){
        replaceInList(this.htmlEntities, oldHtmlEntity, newHtmlEntity);
    }


    
    // INTERACTIVITY
    mousenotdown(e){
        for(let htmlEntity of this.htmlEntities)
        htmlEntity.mousenotdown(e);
    }
    mousedown(e){
        for(let htmlEntity of this.htmlEntities)
        htmlEntity.mousedown(e);
    }
    ifmousemove(e){
        for(let htmlEntity of this.htmlEntities)
        htmlEntity.mousemove(e);
    }
    ifmouseup(e){
        for(let htmlEntity of this.htmlEntities)
        htmlEntity.mouseup(e);
    }
    select(e){
        if(this.isSelected) return;
        this.isSelected = true;
        this.changeColor(this.selectionColor);
        for(let htmlEntity of this.htmlEntities) htmlEntity.select(e);
    }
    unselect(e){
        if(!this.isSelected) return;
        this.isSelected = false;
        if(!this.isHovered)
        this.changeColor(this.colorRestored);
        for(let htmlEntity of this.htmlEntities)
        htmlEntity.unselect(e);
    }
    hover(e){
        if(this.isHovered || this.moving) return;
        this.isHovered = true;
        if(!this.isSelected)
        this.changeColor(this.hoverColor);
        for(let htmlEntity of this.htmlEntities)
        htmlEntity.hover(e);
    }
    unhover(e){
        if(!this.isHovered || this.moving) return;
        this.isHovered = false;
        if(!this.isSelected)
        this.changeColor(this.colorRestored);
        for(let htmlEntity of this.htmlEntities)
        htmlEntity.unhover(e);
    }



    // EDIT
    activateEditting(){
        this.edittingActivated = true;
        for(let htmlEntity of this.htmlEntities) htmlEntity.activateEditting();
    }
    desactivateEditting(){
        this.edittingActivated = false;
        for(let htmlEntity of this.htmlEntities) htmlEntity.desactivateEditting();
    }
    activatePointerEvents(){
        this.isInteractive = true;
        for(let htmlEntity of this.htmlEntities) htmlEntity.activatePointerEvents();
    }
    desactivatePointerEvents(){
        this.isInteractive = false;
        for(let htmlEntity of this.htmlEntities) htmlEntity.desactivatePointerEvents();
    }


    
    // UPDATE
    updateMatrix(){
        
    }
    updateZoom(){
        for(let htmlEntity of this.htmlEntities) htmlEntity.updateZoom();
    }
    setStatus(status){
        // this.address, frozen
        this.embed(status.env);
        this.setPosition(status.x, status.y);
        this.setSize(status.w, status.h);
        this.setAngle(status.angle);

        this.setColors(
            status.colorRestored, 
            status.colorRestored, 
            status.selectionColor, 
            status.hoverColor
        );

        this.desactivateEditting();
        this.setOpacity(status.color[3]);
    }



    // PREDICATS
    isOnSelection(selectionBox){
        return false;
    }
    isOnHover(){
        return false;
    }
    isPhysical(){
        return null;
    }
    isPlane(){
        return null;
    }



    // POSITION
    setX(x){
        x = x || 0;
        this.x = x;
        this.updateMatrix();
        for(let htmlEntity of this.htmlEntities) htmlEntity.updateX();
    }
    setY(y){
        y = y || 0;
        this.y = y;
        this.updateMatrix();
        for(let htmlEntity of this.htmlEntities) htmlEntity.updateY();
    }
    __setX(x){
        x = x || 0;
        this.x = x;
    }
    __setY(y){
        y = y || 0;
        this.y = y;
    }
    setPosition(x, y){
        this.__setX(x);
        this.__setY(y);
        this.updateMatrix();
        for(let htmlEntity of this.htmlEntities) {
            htmlEntity.updateX();
            htmlEntity.updateY();
        }
    }
    changeX(v){
        this.setX(v);
    }
    changeY(v){
        this.setY(v);
    }
    changePosition(x, y){
        this.setPosition(x, y);
    }
    

    // SIZE
    setW(w){
        w = w || 0;
        this.w = w;
        this.updateMatrix();
        for(let htmlEntity of this.htmlEntities) htmlEntity.updateW();
    }
    setH(h){
        h = h || this.env.grid.getZoomedUnit();
        this.h = h;
        this.updateMatrix();
        for(let htmlEntity of this.htmlEntities) htmlEntity.updateH();
    }
    setSize(w, h){
        this.setH(h);
        this.setW(w);
    }
    changeW(v){
        this.setW(v);
    }
    changeH(v){
        this.setH(v);
    }
    changeSize(w, h){
        this.setSize(w, h);
    }

    // ROTATION
    setAngle(angle){
        angle = angle || 0;
        this.angle = absAngle(angle)%DEG360;
        this.vector[0] = Math.cos(this.angle);
        this.vector[1] = Math.sin(this.angle);
        this.updateMatrix();
        for(let htmlEntity of this.htmlEntities) htmlEntity.updateRotation();
    }
    changeAngle(v){
        this.setAngle(v);
    }


    // VISUAL
    setColor(color){
        this.color[0] = absColor(color[0]);
        this.color[1] = absColor(color[1]);
        this.color[2] = absColor(color[2]);
        for(let htmlEntity of this.htmlEntities) htmlEntity.updateColor();
    }
    setSelectionColor(color){
        if( color[0] || color[0]==0 ) this.selectionColor[0] = absColor(color[0]);
        if( color[1] || color[1]==0 ) this.selectionColor[1] = absColor(color[1]);
        if( color[2] || color[2]==0 ) this.selectionColor[2] = absColor(color[2]);
    }
    setHoverColor(color){
        if( color[0] || color[0]==0 ) this.hoverColor[0] = absColor(color[0]);
        if( color[1] || color[1]==0 ) this.hoverColor[1] = absColor(color[1]);
        if( color[2] || color[2]==0 ) this.hoverColor[2] = absColor(color[2]);
    }
    setColorRestored(color){
        if( color[0] || color[0]==0 ) this.colorRestored[0] = absColor(color[0]);
        if( color[1] || color[1]==0 ) this.colorRestored[1] = absColor(color[1]);
        if( color[2] || color[2]==0 ) this.colorRestored[2] = absColor(color[2]);
        if( color[3] || color[3]==0 ) this.colorRestored[3] = absColor(color[3]);
    }
    setColors(color, colorRestored, selectionColor, hoverColor){
        this.setSelectionColor(selectionColor);
        this.setColorRestored(colorRestored);
        this.setHoverColor(hoverColor);
        this.setColor(color);
    }
    setOpacity(a){
        if(!a && a!=0) return;
        this.color[3] = absOpacity(a);
        for(let htmlEntity of this.htmlEntities) htmlEntity.updateOpacity();
    }
    changeColor(color, force){
        if(!(this.isSelected || this.isHovered) || force) this.setColorRestored(color);
        this.setColor(color);
    }
    changeOpacity(v){
        this.setOpacity(v);
    }



    // DEL
    delete(){
        for(let htmlEntity of this.htmlEntities)
        htmlEntity.remove();
        delete this.cls.newEntities[this.address];
        undefine(this);
    }
    remove(){
        if(this.env) this.env.removeEntity(this);
        this.delete();
    }
    softRemove(){
        for(let htmlEntity of this.htmlEntities) htmlEntity.softRemove();
        this.env.removeEntity(this);
        this.isDeleted = true
    }


    
    // CONSTRUCT
    embed(env){
        if(!env) return;
        if(this.env && env != this.env) this.env.removeEntity(this);
        this.env = env;
        for(let htmlEntity of this.htmlEntities) htmlEntity.embed(this.env);
        if(this.env.getCursorMode() == this.cls.label) this.activateEditting();
        else this.desactivateEditting();
        this.env.pushEntity(this);
    }

    softRetrieve(){
        for(let htmlEntity of this.htmlEntities) htmlEntity.softRetrieve();
        this.env.pushEntity(this);
        this.isDeleted = false
    }

}