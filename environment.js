class Environment {
    static label = "environment";
    static defaults = {
        color: [25, 25, 25, 1],
        getX: () => 0,
        getY: () => 0,
        getW: () => window.innerWidth,
        getH: () => window.innerHeight,
        layerW: 5000,
        layerH: 2500,
    }
    static numberInputLimit = 1E6;
    static eventTypes = ["mousedown", "mousemove", "mouseup"];
    static address = 0;
    static environments = {};
    static entityClasses = [
        Entity, Light, Mirror, Plane, ThinLens, 
        SphericalMirror, OpticalAxis, NonPhysicalEntity,
        PhysicalEntity, SymetricalPlane, Wall, RealObject,
        Diopter
    ];
    static entityConverter = {};
    
    constructor(root){
        this.cls = Environment;
        this.address = this.cls.address;

        this.cls.environments[this.address] = this;
        this.cls.address++;
        this.root = root;

        // DIMENSIONS
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.color = [0, 0, 0, 0];

        this.dialogsDisplayed = true;

        this.layerW = Environment.defaults.layerW;
        this.layerH = Environment.defaults.layerH;

        this.entities = {};
        this.dialogs  = [];
        
        // UNDO-REDO
        this.undoRedoSystem = new UndoRedoSystem(100);
        
        this.setUndoRedoLimit = l => this.undoRedoSystem.setLimit(l);
        this.stackUndo = ({undo, redo, forget}) => {
            this.undoRedoSystem.stackUndo({undo, redo, forget});
        }
        this.undo = () => this.undoRedoSystem.undo();
        this.redo = () => this.undoRedoSystem.redo();
        

        // CONSTRUCT HTML
        let cls = "environment-layer-container";
        let fixedCls = "environment-fixed-layer-container";
        let layerCls = "environment-layer";
        let fixedLayerCls = "environment-fixed-layer";
        this.layersDiv = createDiv([
            this.createLayer("svg", "background", layerCls),
            this.createLayer("svg", "visual", layerCls),
            this.createLayer("svg", "html", layerCls, true),
            this.createLayer("svg", "edit", layerCls, true),
            this.createLayer("svg", "superVisual", layerCls),
        ], cls, `${cls}-${this.address}`);
        this.fixedLayersDiv = createDiv([
            this.createLayer("div", "fixedVisualInfo", fixedLayerCls),
        ], fixedCls, `${fixedCls}-${this.address}`);

        this.html = createDiv([this.layersDiv, this.fixedLayersDiv], 
        Environment.label, `${Environment.label}-${this.address}`);

        this.root.appendChild(this.html);

        // DIALOGS
        this.selectionBoard = new SelectionBoard(this);
        this.addDialog(this.selectionBoard);
        this.toolsBar = new ToolsBar(this);
        this.addDialog(this.toolsBar);

        // EVENTS
        this.htmlLayer.style.pointerEvents = "visible";
        this.editLayer.style.pointerEvents = "visible";
        this.htmlLayer.style.visibility = "hidden";
        this.editLayer.style.visibility = "hidden";
        this.backgroundLayer.style.pointerEvents = "all";
        this.superVisualLayer.style.pointerEvents = "none";
        this.visualLayer.style.pointerEvents = "none";
        
        window.addEventListener("resize", e => this.changeClientSize(window.innerWidth, window.innerHeight));
    
        addKeyDownMacro(new KeyDownMacro("Escape", () => this.toggleDialogs(), null, true, false));
        this.root.addEventListener("keydown", e => {
            if(!e.ctrlKey) return;
            if(e.code == 'KeyZ') this.undo();
            if(e.code == 'KeyY') this.redo();
        });
        this.root.addEventListener("keydown", e => this.keydownDeleteSelections(e));
        this.root.addEventListener("mousemove", e => {
            this.isOnHover = this.softHover(e);
        });

        
        // SYSTEMS
        this.cursorSystem = new CursorSystem(this);
        this.camera = new Camera(this);
        this.grid = new Grid(this);

        this.updateClientPosition();
        this.changeClientSize(this.cls.defaults.getW(), this.cls.defaults.getH());
        this.changeSize(this.cls.defaults.layerW, this.cls.defaults.layerH);
        this.changeColor(this.cls.defaults.color);
        this.camera.center();
    }

    createLayer(tagName, name, cls, interactive){
        const layer = tagName == "svg" ? createSvg([], `fill: none;`) : createDiv([], null, null);

        const nameCapitalized = capitalizeStr(name);
        const str = name+"Layer";
        this[str] = layer;
        this["get" + nameCapitalized] = () => this[str];
        if(interactive)
        this["embed"  + nameCapitalized] = element => layer.appendChild(element);
        else
        this["embed"  + nameCapitalized] = element => {
            element.style.pointerEvents = "none";
            layer.appendChild(element);
        }
        this["remove" + nameCapitalized] = element => layer.removeChild(element);
        
        layer.setAttribute("id", `${name}-${this.address}`);
        layer.setAttribute("class", `${cls}`);
        layer.setAttribute("name", name);
        return layer;
    }



    // POSITION
    setClientX(x){
        this.x = x || Environment.defaults.getX();
    }
    setClientY(y){
        this.y = y || Environment.defaults.getY();
    }
    changeClientX(x){
        this.setClientX(x);
        this.updateClientX();
    }
    changeClientY(y){
        this.setClientY(y);
        this.updateClientY();
    }
    changeClientPosition(x, y){
        this.setClientX(x);
        this.setClientY(y);
        this.updateClientPosition();
    }
    updateClientX(){
        this.html.style.left = this.x + "px";
    }
    updateClientY(){
        this.html.style.top = this.y + "px";
    }
    updateClientPosition(){
        this.updateClientX();
        this.updateClientY();
    }

    setX(x){

    }
    setY(y){

    }
    changeX(x){
        this.setX(x);
        this.updateX();
    }
    changeY(y){
        this.setY(y);
        this.updateY();
    }
    changePosition(x, y){
        this.setX(x);
        this.setY(y);
        this.updatePosition();
    }
    updateX(){
        this.layersDiv.style.left = -this.camera.x*this.getZoom() + "px";
    }
    updateY(){
        this.layersDiv.style.top = -this.camera.y*this.getZoom() + "px";
    }
    updatePosition(){
        this.updateX();
        this.updateY();
    }



    // SIZE
    __changeClientW(w){
        this.w = w || Environment.defaults.getW();
        this.html.style.width = this.w + "px";
    }
    __changeClientH(h){
        this.h = h || Environment.defaults.getH();
        this.html.style.height = this.h + "px";
    }
    changeClientW(w){
        this.__changeClientW(w);
    }
    changeClientH(h){
        this.__changeClientH(w);
    }
    changeClientSize(w, h){
        this.__changeClientW(w);
        this.__changeClientH(h);
    }

    __changeW(w){
        this.layerW = w;
        this.layersDiv.style.width = this.layerW*this.getZoom() + "px";
    }
    __changeH(h){
        this.layerH = h;
        this.layersDiv.style.height = this.layerH*this.getZoom() + "px";
    }
    changeW(w){
        this.__changeW(w);
    }
    changeH(h){
        this.__changeH(h);
    }
    changeSize(w, h){
        this.__changeW(w);
        this.__changeH(h);
    }
    updateW(){
        this.changeW(this.layerW);
    }
    updateH(){
        this.changeH(this.layerH);
    }
    updateSize(){
        this.updateW();
        this.updateH();
    }



    // ZOOM
    updateZoom(){
        for(let entityType in this.entities){
            for(let entity of this.entities[entityType]) entity.updateZoom();
        }
        this.updateSize();
        this.grid.updateZoom();
        this.cursorSystem.updateZoom();
    }



    // BACKGROUND COLOR
    setColor(color){
        color = color || Environment.defaults.color;
        this.color[0] = color[0];
        this.color[1] = color[1];
        this.color[2] = color[2];
        this.color[3] = color[3];
    }
    changeColor(color){
        this.setColor(color);
        this.updateColor();
    }
    updateColor(){
        const bg = this.getBackground();
        bg.style.backgroundColor = styleColor(this.color);
        for(let dialog of this.dialogs){
            dialog.changeColor(
                this.color[0] + 20,
                this.color[1] + 20,
                this.color[2] + 20,
                this.color[3] + 20
            );
        }
    }



    // GET
    getBoundingRect(){
        return this.layersDiv.getBoundingClientRect();
    }
    getCenterX(){
        return this.layerW/2;
    }
    getCenterY(){
        return this.layerH/2;
    }
    getCenter(){
        return [this.getCenterX(), this.getCenterY()];
    }
    getClientCenterX(){
        return this.html.clientLeft + this.html.clientWidth/2;
    }
    getClientCenterY(){
        return this.html.clientTop + this.html.clientHeight/2;
    }
    getClientCenter(){
        return [this.getClientCenterX(), this.getClientCenterY()]
    }
    getZoom(){
        return this.camera.getZoom();
    }
    getCursorMode(){
        return this.cursorSystem.cursor.getMode();
    }
    getSelection(){
        return this.cursorSystem.selector.selection;
    }
    getEdges(){
        const topleft  = [this.x, this.y]
        const topright = [this.x+this.layerW, this.y]
        const botright = [this.x+this.layerW, this.y+this.layerH]
        const botleft  = [this.x, this.y+this.layerH]
        return [
            [ topleft , topright ],
            [ topright, botright ],
            [ botright, botleft  ],
            [ botleft , topleft  ]
        ]
    }


    // PREDICATS
    hover(e){
        return e.composedPath()[0] == this.getBackground();
    }
    softHover(e){
        for(let target of e.composedPath()){
            if(target == this.layersDiv) 
            return true;
        }
        return false;
    }



    // DIALOGS
    addDialog(dialog){
        this.dialogs.push(dialog);
        dialog.html.classList.add("environment-dialog");
        this.html.appendChild(dialog.html);
    }
    undisplayDialogs(){
        this.dialogsDisplayed = false;
        for(let dialog of this.dialogs) dialog.undisplay();
    }
    displayDialogs(){
        this.dialogsDisplayed = true;
        for(let dialog of this.dialogs) dialog.display();
    }
    toggleDialogs(){
        this.dialogsDisplayed = !this.dialogsDisplayed;
        if(this.dialogsDisplayed) this.displayDialogs();
        else this.undisplayDialogs();        
    }



    // ENTITIES
    pushEntity(entity){
        if(!this.entities[entity.cls.label]) this.entities[entity.cls.label] = [];
        if(!findIn(entity, this.entities[entity.cls.label])) this.entities[entity.cls.label].push(entity);
    }
    removeEntity(entity){
        this.entities[entity.cls.label] = removeFromList(this.entities[entity.cls.label], entity);
    }
    updateLightBeams(){
        if(!this.entities.light) return;
        for(let light of this.entities.light) light.propagate();
    }


    // SELECTION
    keydownDeleteSelections(e){
        const statuses = [];
        if(e.code == "Delete") {
            for(let entityType in this.entities){
                for(let entity of this.entities[entityType])
                    if(entity.isSelected) {
                        statuses.push({cls: entity.cls, address: entity.address});
                        entity.softRemove();
                    }
            }
            if(statuses) this.stackUndo({ undo: () => {
                for(let status of statuses) status.cls.newEntities[status.address].softRetrieve(status);
            },  redo: () => {
                for(let status of statuses) status.cls.newEntities[status.address].softRemove(this);
            }, forget: () => {
                for(let status of statuses) {
                    if(status.cls.newEntities[status.address]) status.cls.newEntities[status.address].remove(this);
                }
                
            }})
            this.cursorSystem.selector.resetSelection()
        }
    }

    //OUTPUT
    outputX(x){
        return parseInt(stick(x, 0.0001)*10000)/10000 - this.layerW/2;
    }
    outputY(y){
        return -parseInt(stick(y, 0.0001)*10000)/10000 + this.layerH/2;
    }
    outputW(w){
        return parseInt(stick(w, 0.0001)*10000)/10000;
    }
    outputH(h){
        return this.outputW(h);
    }
    outputF(f){
        return parseInt(stick(f, 0.01)*100)/100;
    }
    outputAngle(angle){
        return parseInt(stick(absAngle(-angle)*180/DEG180, 0.0001)*10000)/10000;
    }
    outputStrokeW(w){
        return parseInt(stick(v, 0.1)*10)/10;
    }
    outputOpacity(a){
        return parseInt(stick(a, 0.0001)*10000)/100;
    }
    outputAbsorption(a){
        return this.outputOpacity(a);
    }
    outputLambda(lam){
        return parseInt(stick(lam, 0.001)*1000)/1000;
    }
    outputGamma(g){
        return parseInt(stick(g, 0.01)*100)/100;
    }

    //INPUT
    submitInput(e){
        return e.key=='Enter' || e.key=='Tab' || e.key=='Escape';
    }
    inputEval(str, backtrack, convert){
        try {
            var x = eval("\"use strict\";"+str+";");


            if(isNaN(x) || x<-Environment.numberInputLimit || x>Environment.numberInputLimit ) return backtrack;
            return convert(x);
        }
        catch {

            return backtrack;
        }
    }
    inputX(str, backtrack){
        return this.inputEval(str, backtrack, v => v + this.layerW/2)
    }
    inputY(str, backtrack){
        return this.inputEval(str, backtrack, v => -v + this.layerH/2);
    }
    inputW(str, backtrack){
        return this.inputEval(str, backtrack, v => v);
    }
    inputH(str, backtrack){
        return this.inputW(str, backtrack);
    }
    inputF(str, backtrack){
        return this.inputEval(str, backtrack, v => -v);
    }
    inputAngle(str, backtrack){
        return this.inputEval(str, backtrack, v => absAngle(-v*DEG180/180));
    }
    inputStrokeW(str, backtrack){
        return this.inputEval(str, backtrack, 
            v => {
                v = parseInt(stick(v, 0.1)*10)/10;
                return v<0? 1 : (v > 10 ? 10 : (v == 0? 0.1 : v));
            }
        );
    }
    inputOpacity(str, backtrack){
        return this.inputEval(str, backtrack, v => v/100);
    }
    inputAbsorption(str, backtrack){
        return this.inputOpacity(str, backtrack, v => v);
    }
    inputLambda(str, backtrack){
        return this.inputEval(str, backtrack, v => {
            v = parseInt(stick(v, 0.001)*1000)/1000;
            if(v<=0) return 0.001;
            return v;
        });
    }
    inputGamma(str, backtrack){
        return this.inputEval(str, backtrack, v => {
            v = parseInt(stick(v, 0.01)*100)/100;
            if(v<=0) return 0.01;
            if(v>12) return 12;
            return v;
        });
    }
    inputColor(str, backtrack){
        var s = "";
        var i = 0;
        var rgb = [0, 0, 0];
        let j = 0;
        while(str[j] == " " || str[j] == ",") j++;

        while(j<str.length){
           if(str[j] == " " || str[j] == ","){
                rgb[i] = parseInt(s);
                j++;
                while(str[j] == " " || str[j] == ",") j++;
                s = str[j];
               i++;
            }
            else s += str[j];
            j++;
        }
        rgb[i] = parseInt(s);
        return rgb;
    }
}

for(let entityCls of Environment.entityClasses)
Environment.entityConverter[entityCls.label] = entityCls;