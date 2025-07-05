class PhysicalEntity extends Entity {
    static label = "physical_entity";
    static label = "Physical Entity";

    constructor(address, cls){
        super(address, cls || PhysicalEntity);
        this.absorption = 0
    }
    isPhysical(){
        return true;
    }
}