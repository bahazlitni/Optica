class DiopterSpline extends HTMLEntity {
    
    constructor(entity){
        super(entity)

        this.path = createPath('', 'fill-opacity: 50%;')
        this.vertices = []
        this.controlers = []
        this.lines = []

        this.addHTMLElement(this.path, "html")
    }
    addVertex(){
        const circle = createCircle(0,0,0)
        this.addHTMLElement(circle, "edit")
        this.vertices.push(circle)
    }
    addControlPoint(){
        const circle = createCircle(0,0,5, 'fill: rgb(220,220,220);')
        this.addHTMLElement(circle, "edit")
        this.controlers.push(circle)
    }
    addLine(){
        const line = createLine(0,0,0,0, 'stroke-width: 1; stroke: rgb(220,220,220);')
        this.addHTMLElement(line, "edit")
        line.style.pointerEvents = 'none'
        this.lines.push(line)
    }
    activatePointerEvents(){
        super.activatePointerEvents()
        this.path.style.pointerEvents = 'all'
        for(let vertex of this.vertices)
        vertex.style.pointerEvents = 'all'
        for(let controler of this.controlers)
        controler.style.pointerEvents = 'all'
    }
    desactivatePointerEvents(){
        super.desactivatePointerEvents()
        this.path.style.pointerEvents = 'none'
        for(let vertex of this.vertices)
        vertex.style.pointerEvents = 'none'
        for(let controler of this.controlers)
        controler.style.pointerEvents = 'none'       
    }

    changeX(x){
        const deltaX = x-getCircleX(this.vertices[0])

        for(let i=0; i<this.entity.matrix.length; i++){
            const ix2 = i*2
            const p0x = getCircleX(this.vertices[i])+deltaX
            const p1x = getCircleX(this.controlers[ix2])+deltaX
            const p2x = getCircleX(this.controlers[ix2+1])+deltaX
            const p3x = getCircleX(this.vertices[(i+1)%this.entity.matrix.length])+deltaX

            this.vertices[i].setAttributeNS(null, 'cx', p0x)
            this.controlers[ix2].setAttributeNS(null, 'cx', p1x)
            this.lines[ix2].setAttributeNS(null, 'x1', p0x)
            this.lines[ix2].setAttributeNS(null, 'x2', p1x)
    
            if(i<this.entity.matrix.length-1){
                this.vertices[i+1].setAttributeNS(null, 'cx', p3x)
                this.controlers[ix2+1].setAttributeNS(null, 'cx', p2x)
                this.lines[ix2+1].setAttributeNS(null, 'x1', p3x)
                this.lines[ix2+1].setAttributeNS(null, 'x2', p2x)
            }
        }

    }

    changeW(w){
        this.path.setAttributeNS(null, "stroke-width", w)
        for(let vertex of this.vertices)
            vertex.setAttributeNS(null, 'r', w+5)
    }
    changeColor(color){
        const colorStr = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.path.setAttributeNS(null, 'stroke', colorStr)
        this.path.setAttributeNS(null, 'fill', colorStr)

        for(let vertex of this.vertices)
            vertex.setAttributeNS(null, 'stroke', colorStr)
    }
    changeOpacity(a){
        this.path.setAttributeNS(null, 'opacity', a)
    }
    updateW(){
        this.changeW(this.entity.w)
    }
    updateH(){
        this.updateW()
    }
    updateColor(){
        this.changeColor(this.entity.color)
    }
    updateOpacity(){
        this.changeOpacity(this.entity.color[3])
    }

    updatePath(){
        let d = `M${this.entity.matrix[0][0]*this.getZoom()} ${this.entity.matrix[0][1]*this.getZoom()}`
        for(let i=0; i<this.entity.matrix.length; i++){
            const point = this.entity.matrix[i]
            const next = this.entity.matrix[(i+1)%this.entity.matrix.length]

            const p0x = point[0]*this.getZoom()
            const p0y = point[1]*this.getZoom()
            const p1x = point[2]*this.getZoom()
            const p1y = point[3]*this.getZoom()
            const p2x = point[4]*this.getZoom()
            const p2y = point[5]*this.getZoom()
            const p3x = next[0]*this.getZoom()
            const p3y = next[1]*this.getZoom()

            const ix2 = i*2

            this.vertices[i].style.display = ''
            this.controlers[ix2].style.display = ''
            this.lines[ix2].style.display = ''

            this.vertices[i].setAttributeNS(null, 'cx', p0x)
            this.vertices[i].setAttributeNS(null, 'cy', p0y)
            this.controlers[ix2].setAttributeNS(null, 'cx', p1x)
            this.controlers[ix2].setAttributeNS(null, 'cy', p1y)
            this.lines[ix2].setAttributeNS(null, 'x1', p0x)
            this.lines[ix2].setAttributeNS(null, 'y1', p0y)
            this.lines[ix2].setAttributeNS(null, 'x2', p1x)
            this.lines[ix2].setAttributeNS(null, 'y2', p1y)

            if(i<this.entity.matrix.length-1){
                this.vertices[i+1].style.display = ''
                this.controlers[ix2+1].style.display = ''
                this.lines[ix2+1].style.display = ''
    
                this.vertices[i+1].setAttributeNS(null, 'cx', p3x)
                this.vertices[i+1].setAttributeNS(null, 'cy', p3y)

                this.controlers[ix2+1].setAttributeNS(null, 'cx', p2x)
                this.controlers[ix2+1].setAttributeNS(null, 'cy', p2y)

                this.lines[ix2+1].setAttributeNS(null, 'x1', p3x)
                this.lines[ix2+1].setAttributeNS(null, 'y1', p3y)
                this.lines[ix2+1].setAttributeNS(null, 'x2', p2x)
                this.lines[ix2+1].setAttributeNS(null, 'y2', p2y)
            }

            d += (
                point[2]==point[0] && point[3]==point[1] ?
                (
                    point[4]==point[0] && point[5]==point[1] ?
                    `L${p3x} ${p3y}` :
                    `Q${p2x} ${p2y},${p3x} ${p3y}`
                ) :
                (
                    point[4]==point[0] && point[5]==point[1] ?
                    `$Q${p1x} ${p1y},${p3x} ${p3y}` :
                    `$C${p1x} ${p1y},${p2x} ${p2y},${p3x} ${p3y}`
                )
            )
                 
        }
        d += 'Z'

        this.path.setAttributeNS(null, 'd', d)
    }

    updateMatrix(){
        if(this.entity.matrix.length == 0){
            this.path.setAttributeNS(null, 'd', '')
            return
        }
        for(let end = this.vertices.length-1, 
            i=0; i<this.vertices.length-this.entity.matrix.length; i++)
        {
            const ix2 = i*2
            this.vertices[end-i].style.display = 'none'
            this.lines[end-ix2].style.display = 'none'
            this.lines[end-ix2-1].style.display = 'none'
            this.controlers[end-ix2].style.display = 'none'
            this.controlers[end-ix2-1].style.display = 'none'
        }
            
        for(let i=0; i<this.entity.matrix.length-this.vertices.length; i++){
            this.addVertex()
            this.addLine()
            this.addLine()
            this.addControlPoint()
            this.addControlPoint()
        }

        this.updatePath()
    }

    ifmousemove(e){
        
    }
}

class Diopter extends PhysicalEntity {
    static label = "diopter";
    static name = "Diopter";
 
    static newEntities = {};
    static newEntity = null;
    static entityAddress = 0;
 
    static undo = () => null;
 
    static pointer = "pen";
    static settings = {
        gamma: 1,
        lambda: 600,
        w: 1,
    };
 
    static selectionSheet = [
        { 
            tag: "Physical",
            inputs: [
                new EntityInputSheet("X", 1, "1fr", (selection, e) => Entity.inputX(selection, e), selection => Entity.outputX(selection), null,
                selection => selection.filter(selected => selected.cls == Diopter)),
                new EntityInputSheet("Y", 1, "1fr", (selection, e) => Entity.inputY(selection, e), selection => Entity.outputY(selection), null,
                selection => selection.filter(selected => selected.cls == Diopter)),
                new EntityInputSheet("Dest X", 2, "1fr", (selection, e) => Entity.inputX(selection, e), selection => Entity.outputX(selection), null,
                selection => selection.filter(selected => selected.cls == Diopter)),
                new EntityInputSheet("Dest Y", 2, "1fr", (selection, e) => Entity.inputY(selection, e), selection => Entity.outputY(selection), null,
                selection => selection.filter(selected => selected.cls == Diopter)),
                new EntityInputSheet("Angle", 3, "50%", (selection, e) => Entity.inputAngle(selection, e), selection => Entity.outputAngle(selection), "°",
                selection => selection.filter(selected => selected.cls == Diopter)),
                new EntityInputSheet("Lambda", 4, "1fr", (selection, e) => Entity.inputLambda(selection, e), selection => Entity.outputLambda(selection), "nm",
                selection => selection.filter(selected => selected.cls == Diopter)),
                new EntityInputSheet("Gamma", 4, "1fr", (selection, e) => Entity.inputGamma(selection, e), selection => Entity.outputGamma(selection), null,
                selection => selection.filter(selected => selected.cls == Diopter)),
            ]
        },
    ];
 
    static mousedown(e, cursorSystem, Class){
        Class = Class || Diopter;
        Entity.mousedown(e, cursorSystem, Class)
        Class.newEntity.createVertex(cursorSystem.getX(e), cursorSystem.getY(e))
    }
    static mousemove(e, cursorSystem, Class){
        Class = Class || Diopter;
        Entity.mousemove(e, cursorSystem, Class);
        Class.newEntity.spline.ifmousemove(e)
    }
    static mouseup(e, cursorSystem, Class){
        Class = Class || Diopter;
        Class.newEntity.spline.mouseup(e)
        Entity.mouseup(e, cursorSystem, Class);
    }
    static mouseleave(e, cursorSystem, Class){
        Class = Class || Diopter;
        Class.newEntity.twoCircles.mouseleave(e, Class.label);
    }
    static mouseover(e, cursorSystem, Class){
        Class = Class || Diopter;
        Class.newEntity.twoCircles.mouseover(e, Class.label);
    }
 
    constructor(address, cls){
        super(address, cls || Diopter);
        
        this.x = 0
        this.y = 0
        this.w = 0
        this.h = 0
        this.angle = 0
        
        //a point in this matrix has these information
        // p[i][0-1]   = p0
        // p[i][2-3]   = p1
        // p[i][4-5]   = p2
        // p[i+1][0-1] = p3

        this.matrix = []

        this.spline = new DiopterSpline(this)
    }
    addVertex(p0x,p0y,p1x,p1y,p2x,p2y){
        if(!p1x && p1x!=0) p1x = p0x
        if(!p1y && p1y!=0) p1y = p0y
        if(!p2x && p2x!=0) p2x = p1x
        if(!p2y && p2y!=0) p2y = p1y

        this.matrix.push([p0x, p0y, p1x, p1y, p2x, p2y])
        this.spline.updateMatrix()
    }
    popVertex(i){
        for(let j=i; j<this.matrix.length; j++)
            this.matrix[j] = this.matrix[j+1]
        
        this.spline.updateMatrix()
        this.matrix.pop()
    }

    setX(x){
        const deltaX = x - this.x
        this.x = x
        for(let point of this.matrix){
            point[0] += deltaX
            point[2] += deltaX
            point[4] += deltaX
        }
        this.spline.updatePath()
    }
    setY(y){
        const deltaY = y - this.y
        this.y = y
        for(let point of this.matrix){
            point[1] += deltaY
            point[3] += deltaY
            point[5] += deltaY
        }
        this.spline.updatePath()
    }

    output(line, angle){
        return {
            angle: this.__angleOutput(line, angle), 
            intersection: constructSegmentIntersection(this.matrix, line),
            absorption: this.absorption || 0,
        }
    }
}