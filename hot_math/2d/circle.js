class Circle {
    static interL(self, l){
        return Line.interC(l, self);
    }
    static interSemiSeg(self, seg){
        let points = Circle.interL(self, seg);
        if(!points.length) return [];
        if(points.length == 1) {
            let p = SemiSegment.interP(seg, points[0]);
            if(!p) return [];
            return [p];
        }
        let p1 = SemiSegment.interP(seg, points[0]);
        let p2 = SemiSegment.interP(seg, points[1]);
        if(p1){
            if(p2) return [p1, p2];
            return [p1];
        }
        if(p2) return [p2];
        return [];
    }
    static interSeg(self, seg){
        let points = Circle.interL(self, seg);
        if(!points.length) return [];
        if(points.length == 1) {
            let p = Segment.interP(seg, points[0]);
            if(!p) return [];
            return [p];
        }
        let p1 = Segment.interP(seg, points[0]);
        let p2 = Segment.interP(seg, points[1]);
        if(p1){
            if(p2) return [p1, p2];
            return [p1];
        }
        if(p2) return [p2];
        return [];
    }
    static interC(self, crc){
        const x1 = self.x();
        const y1 = self.y();
        const x2 = crc.x();
        const y2 = crc.y();

        const cte5 = x1**2 + y1**2;
        const cte48 = self.r()**2;
        const alpha = (x1-x2)/(y2-y1);
        const beta = (cte48 - crc.r()**2 - cte5 + y2**2 + x2**2)/(2*(y2-y1));

        const a_neg_2 = -2-2*alpha**2;
        const b = 2*(alpha*(beta-y1)-x1);
        const c = beta*(beta - 2*y1) + cte5 - cte48;
        let d = (b**2 + 2*a_neg_2*c);

        if(d<0) return [];
        let x;
        if(!d){
            x = b/a_neg_2;
            return [new Point(x, beta + x*alpha)];
        }
        d = Math.sqrt(d);
        x = (b+d)/a_neg_2;
        let x_2 = (b-d)/a_neg_2;
        return [new Point(x, beta + x*alpha), new Point(x_2, beta + x_2*alpha )];
    }
    static interRect(self, rect){

    }

    static hover(rawc, rawp){
        return Point.hover(rawc[0], rawp, rawc[1]);
    }
    static isDefined(rawc){
        return Number.isFinite(rawc[1]) && Point.isDefined(rawc[0]);
    }
    static perimeter(rawc){
        return DEG360*rawc[1];
    }
    static area(rawc){
        return PI*rawc[1]**2;
    }

    static _hover(c, p){
        return Point.hover(c.origin, p, c.r());
    }
    static _isDefined(self){
        const v = Number.isFinite(self.r()) && Point._isDefined(self.origin);
        self.isDefined = () => v;
        return v;
    }
    static _perimeter(self){
        const v = DEG360*self.r();
        self.perimeter = () => v;
        return v;
    }
    static _area(self){
        const v = PI*self.r()**2;
        self.area = () => v;
        return v;
    }


    static raw(self){
        const v = [self.origin.raw(), self.r()];
        self.raw = () => v;
        return v;
    }
    static new(rawc){
        return new Circle(Point.new(rawc[0]), rawc[1]);
    }
    
    constructor(origin, r){
        this.origin = origin;
        this.__r = r;
    }
    // static
    x(){
        return this.origin.x();
    }
    y(){
        return this.origin.y();
    }
    r(){
        return this.__r;
    }

    hover(p){
        return Circle._hover(this, p);
    }
    isDefined(){
        return Circle._isDefined(this);
    }
    area(){
        return Circle._area(this);
    }
    perimeter(){
        return Circle._perimeter(this);
    }
    raw(){
        return Circle.raw(this);
    }
}