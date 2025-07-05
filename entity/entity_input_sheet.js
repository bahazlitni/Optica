class EntityInputSheet {
    constructor(tag, row, spacing, inputFunc, outputFunc, unit, selector, type){
        this.row = row || 1;
        this.spacing = spacing || 1;
        this.tag = tag;
        this.inputFunc = inputFunc;
        this.outputFunc = outputFunc;
        this.unit = unit || null;
        this.selector = selector || (x => x);
        this.type = type
    }
}