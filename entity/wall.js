class Wall extends SymetricalPlane {
    static label = "wall";
    static name = "Wall";
    
    static newEntity = null;
    static pointer = "pen";
    static settings = {
        w: 4,
        color: [255, 150, 50, 1],
        absorption: 1,
    };

    static createSelectionSheet(){
        let selectionSheet = Plane.createSelectionSheet();
        let b = false;
        for(let section of selectionSheet){
            if(b) break;
            if(section.tag != "Physical") continue;
            for(let input of section.inputs){
                if(input.tag != "Absorption") continue;
                input.inputFunc = null;
                input.outputFunc = () => 100;
                b = true;
                break;
            }
        }
        return selectionSheet;
    }

    static mousedown(e, cursor, Class){
        SymetricalPlane.mousedown(e, cursor, Class || Wall);
    }
    static mousemove(e, cursor, Class){
        SymetricalPlane.mousemove(e, cursor, Class || Wall);
    }
    static mouseup(e, cursor, Class){
        SymetricalPlane.mouseup(e, cursor, Class || Wall);
    }

    constructor(address, cls){
        super(address, cls || Wall);
        this.absorption = 1
    }
}

Wall.selectionSheet = Wall.createSelectionSheet();