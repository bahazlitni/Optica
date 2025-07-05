class SelectionBoard extends Dialog {
    constructor(env){
        super(env, "grid", false);

        this.html.setAttribute("class", "selection-board");
        this.container = createDiv([], "selection-board-container");
        this.html.appendChild(this.container);

        this.html.addEventListener("mouseover", e => {
            this.env.cursorSystem.setTempImage("default");
        });
        this.html.addEventListener("mouseleave", e => {
            this.env.cursorSystem.resetPrevImage();
        });

        this.sections = [];

        this.changeColor( [50, 50, 50, 1] );
    }

    renderSelectionSheet(selectionSheet){
        if(!selectionSheet){
            this.undisplay();
            this.isDisplayable = false;
            return;
        }

        this.clear();
        for(let section of selectionSheet)
        this.sections.push(new SelectionBoardSection(this, section.tag, section.inputs) );

        this.refreshData();
        this.isDisplayable = true;
        this.display();
    }

    refreshData(){
        if(this.html.style.display == "none") return;
        for(let section of this.sections) section.refreshData();
    }

    clear(){
        for(let section of this.sections) section.html.remove();
        this.sections = [];
    }

    display(){
        this.html.style.display = "unset";
    }
    undisplay(){
        this.html.style.display = "none";
    }

    getEnv(){
        return this.env;
    }

    getSelection(){
        return this.env.getSelection();
    }
    updateSelectionData(){
        this.env.cursorSystem.selector.updateSelectionData();
    }
}

class SelectionBoardSection {
    constructor(main, name, inputs){
        this.main = main;
        this.name = name;

        this.header = createDiv([createP(name)], "selection-board-section-header");
        
        this.bodyContainer = createDiv([], "selection-board-section-body-container");
        this.body = createDiv([this.bodyContainer], "selection-board-section-body");
        
        this.container = createDiv([this.header, this.body], "selection-board-section-container");
        this.html = createDiv([this.container], "selection-board-section");

        this.rows = [];
        this.rowsGridTemplateColumns = [];
        this.inputs = [];

        for(let input of inputs) this.inputs.push(this.generateInputField(input));
        for(let row of this.rows) this.bodyContainer.appendChild(row);

        this.main.container.appendChild(this.html);
    }
    refreshData(){
        for(let input of this.inputs) input.refreshData();
    }

    generateInputField(input){
        return new SelectionBoardInputField(this, input.tag, input.row, 
            input.spacing, input.unit, input.inputFunc, input.outputFunc, 
            input.selector, input.type);
    }

    getEnv(){
        return this.main.getEnv();
    }
    getSelection(){
        return this.main.getSelection();
    }
    updateSelectionData(){
        this.main.updateSelectionData();
    }
}


class SelectionBoardInputField {
    static submitKey = "Enter";

    constructor(main, tag, row, spacing, unit, inputFunc, outputFunc, selector, type){
        this.main = main;
        this.selector = selector;

        /* BUILDING HTML */
        const cls = "selection-board-input-field";
        this.divParent = this.main.bodyContainer;

        // TAG
        this.tag = createP(tag, cls+"-tag");
        this.textDiv = createDiv([this.tag], "selection-board-input-text-div");

        // INPUT
        this.input = createInput(null, null, cls);
        this.inputDiv = createDiv([this.input], "selection-board-input-div");

        this.type = type
        if(type == 'checkbox') this.input.setAttribute('type', 'checkbox')

        // UNIT
        this.unitP = createP(this.unit, cls+"-unit");
        this.unitDiv = createDiv([this.unitP], "selection-board-input-unit-div");

        // HTML
        this.html = createDiv([this.textDiv, this.inputDiv, this.unitDiv], cls+"-container");
        const htmlCls = this.html.getAttribute("class");
        this.buildGrid(row, spacing, unit);



        

        /* INPUT/OUTPUT */
        this.__outputFunc = outputFunc;
        this.__inputFunc = inputFunc;
        this.inputFunc = e => null;
        this.outputFunc = () => this.__outputFunc(this.getSelection());

        this.freeze = () => {
            this.input.setAttribute("class", `${cls}-frozen`);
            this.html.setAttribute("class", `${htmlCls}-frozen`);
            this.input.style.pointerEvents = "none";
            this.inputFunc = e => null;
        }
        this.unfreeze = () => {
            this.input.setAttribute("class", cls);
            this.html.setAttribute("class", htmlCls);
            this.input.style.pointerEvents = "all";
            this.inputFunc = e => {
                this.lastKeydownE = e;
                this.__inputFunc(this.getSelection(), e);
            }
        }

        
        /* PROPERTIES */
        this.inputColorRestored = this.input.style.color;
        this.input.style.cursor = cursorImages["type"];


        /* EVENTS */
        this.input.addEventListener("keydown", e => {
            if(e.key == SelectionBoardInputField.submitKey) this.submit();
            else
            this.inputFunc(e);
        });
        this.input.addEventListener("mouseover", () => this.onhover());
        this.input.addEventListener("mouseleave", () => {
            if(!this.isOnFocus) this.onunhover();
        });
        this.input.addEventListener("mousedown", e => this.onfocus(e));
        document.body.addEventListener("mousedown", e => {
            if(e.target != this.input && this.isOnFocus)
            this.onunfocus(e);
        })

        if(!this.__inputFunc) this.freeze();
        else this.unfreeze();
    }

    buildGrid(row, spacing, unit){
        this.row = row-1;
        const l = row;
        var initRow = this.main.rows.length<l;
        while(this.main.rows.length<l) {
            this.main.rows.push(createDiv([], "selection-board-section-row" ));
            this.main.rowsGridTemplateColumns.push("");
        }
        this.main.rows[this.row].appendChild(this.html);
        
        if(initRow) this.main.rowsGridTemplateColumns[this.row] = `${spacing}`;
        else this.main.rowsGridTemplateColumns[this.row] += ` ${spacing}`;

        this.main.rows[this.row].setAttribute("style", `grid-template-columns: ${this.main.rowsGridTemplateColumns[this.row]};`);
        this.setUnit(unit);
    }

    setUnit(unit){
        this.unit = unit;

        if(this.unit)
        this.unitDiv.style.display = "unset";
        else
        this.unitDiv.style.display = "none";
    }

    getSelection(){
        return this.selector(this.main.getSelection());
    }

    refreshData(){
        if(this.type == 'checkbox')
        this.input.checked = this.outputFunc()
        else
        this.input.value = this.outputFunc()
    }
    updateSelectionData(){
        this.main.updateSelectionData();
    }

    getEnv(){
        return this.main.getEnv();
    }

    submit(){
        this.inputFunc({target: this.input, key: SelectionBoardInputField.submitKey});
        this.updateSelectionData();
    }

    onhover(){
        this.input.style.color = hoverColor;
    }
    onunhover(){
        this.input.style.color = this.inputColorRestored;
    }
    onfocus(e){
        this.isOnFocus = true;
        this.input.style.color = selectionColor;
        this.input.value = "";
    }
    onunfocus(e){
        this.submit();
        this.isOnFocus = false;
        this.input.style.color = this.inputColorRestored;
        this.input.value = this.outputFunc();
    }
}