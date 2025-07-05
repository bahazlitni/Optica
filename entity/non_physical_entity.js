class NonPhysicalEntity extends Entity {
    static label = "non_physical_entity";
    static label = "Non Physical Entity";

    constructor(address, cls){
        super(address, cls || NonPhysicalEntity);
    }
    isPhysical(){
        return false;
    }
    isPlane(){
        return false;
    }
}