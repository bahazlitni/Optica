class Mirror extends SymetricalPlane {
    static label = "mirror";
    static name = "Mirror";

    static newEntity = null;
    static pointer = "pen";
    static settings = {
        w: 2,
        absorption: 0,
        color: [125, 220, 100, 1]
    };
    static selectionSheet = Plane.selectionSheet;

    static mousedown(e, cursorSystem, Class){
        SymetricalPlane.mousedown(e, cursorSystem, Class || Mirror);
    }
    static mousemove(e, cursorSystem, Class){
        SymetricalPlane.mousemove(e, cursorSystem, Class || Mirror);
    }
    static mouseup(e, cursorSystem, Class){
        SymetricalPlane.mouseup(e, cursorSystem, Class || Mirror);
    }

    constructor(address, cls){
        super(address, cls || Mirror);
    }

    angleOutput(point, angle){
        return 2*this.angle - angle;
    }
}