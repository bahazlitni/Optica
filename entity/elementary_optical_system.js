class ElementaryOpticalSystem extends PhysicalEntity {
    static label = "elementary_optical_system";
    static label = "Elementary Optical System";

    static newEntity = null;
    static pointer = "pen";
    static settings = {};

    static mousedown(e, cursor, Class){
        Class = Class || ElementaryOpticalSystem;
        Entity.mousedown(e, cursor, Class);
        Class.newEntity.setAbsorption(Class.settings.absorption);
    }
    static mousemove(e, cursor, Class){
        Class = Class || ElementaryOpticalSystem;
        Entity.mousemove(e, cursor, Class);
    }
    static mouseup(e, cursor, Class){
        Class = Class || ElementaryOpticalSystem;
        Entity.mouseup(e, cursor, Class);
    }

    constructor(address, cls){
        super(address, cls || ElementaryOpticalSystem);
        this.opticalAxis = null;
        this.absorption = 0;
    }

    setAbsorption(absorption){
        this.absorption = absorption || 0;
        this.env.updateLightBeams()
    }
    absorptionOutput(point, angle, surfaceIndex){
        return this.absorption
    }
    angleOutput(point, angle, surfaceIndex){
        return 0
    }
    isSymetrical(){
        return false;
    }
    // computing

    output(point, angle, surfaceIndex){
        return {
            angle: this.angleOutput(point, angle, surfaceIndex),
            absorption: this.absorptionOutput(point, angle, surfaceIndex),
        }
    }

    softRemove(){
        super.softRemove();
        this.env.updateLightBeams();
    }
    softRetrieve(){
        super.softRetrieve();
        this.env.updateLightBeams();
    }

    embed(env){
        super.embed(env);
        this.env.updateLightBeams();
    }
}