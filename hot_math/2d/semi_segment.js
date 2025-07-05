class SemiSegment {
    static interP(self, p){
        return (
            round(self.angle()) == round(Point._angle(self.origin, p)) ? p : undefined
        );
    }

    static projectOthogonalP(self, p){
        let point = Line.projectOthogonalP(self, p);
        if(!point || !self.inRangeP(point)) return undefined;
        return point;
    }

    static interL(self, l){
        let point = Line.interL(self, l);
        if(!point || !self.inRangeP(point)) return undefined;
        return point;
    }
    static interSemiSeg(self, seg){
        let point = SemiSegment.interL(self, seg);
        if(!point || !self.inRangeP(point)) return undefined;
        return point;
    }
    static interSeg(self, seg){
        return Segment.interSemiSeg(seg, self);
    }
    static interC(self, c){
        let points = Line.interC(self, c);
        if(!points.length) return [];
        if(points.length==1){
            if(self.inRangeP(points[0])) return points;
            return [];
        }
        if(self.inRangeP(points[0])) {
            if(self.inRangeP(points[1])) return points;
            return [points[0]];
        }
        if(self.inRangeP(points[1])) return [points[1]];
        return [];
    }
    static interRect(self, rect){
        let points = Line.interRect(self, rect);
        if(!points.length) return [];
        if(points.length==1){
            if(self.inRangeP(points[0])) return points;
            return [];
        }
        if(self.inRangeP(points[0])) {
            if(self.inRangeP(points[1])) return points;
            return [points[0]];
        }
        if(self.inRangeP(points[1])) return [points[1]];
        return [];
    }

    static _hover(self, p, magnet){
        if(Point._hover(self.origin, p, magnet)) return true;
        let point = SemiSegment.projectOthogonalP(self, p);
        return point && Point._hover(p, point, magnet);
    }
    static _cos(self){
        const v = Math.cos(self.angle());
        self.cos = () => v;
        return v;
    }
    static _sin(self){
        const v = Math.sin(self.angle());
        self.sin = () => v;
        return v;
    }
    static _coef(self){
        const v = Math.tan(self.angle());
        self.coef = () => v;
        return v;
    }
    static _isVertical(self){
        const v = self.angle() == DEG90 || self.angle() == DEG270;
        self.isVertical = () => v;
        return v;
    }
    static _isHorizontal(self){
        const v = !self.angle() || self.angle() == DEG180;
        self.isHorizontal = () => v;
        return v;
    }
    static _f(self, x){
        if(self.isVertical()){
            self.f = x => undefined;
            return undefined;
        }
        if(self.angle()>DEG90 && self.angle()<DEG270)
            self.f = x => x>self.x()? undefined : self.coef()*(x-self.x())+self.y();
        else
            self.f = x => x<self.x()? undefined : self.coef()*(x-self.x())+self.y();
        return self.f(x);
    }
    static _inRangeP(self){
        if(self.isVertical()){
            if(self.angle()==DEG90)
                self.inRangeP = p => p.x() == self.x() && p.y()>=self.y();
            else
                self.inRangeP = p => p.x() == self.x() && p.y()<=self.y();
        }
        if(self.angle()>DEG90 && self.angle()<DEG270)
            self.inRangeP = p => p.x()<=self.x();
        else
            self.inRangeP = p => p.x()>=self.x();

        return self.inRangeP(p);
    }


    static raw(self){
        const v = [self.origin.raw(), [self.x()+self.cos(), self.y()+self.sin()]];
        self.raw = () => v;
        return v;
    }
    static new(rawline){
        return new SemiSegment(Point.new(rawline[0]), Line.angle(rawline));
    }


    constructor(origin, angle){
        this.origin = origin;
        this.__angle = angle;
    }
    // static
    hover(p, magnet){
        return SemiSegment._hover(this, p, magnet);
    }
    isDefined(){
        return this.origin.isDefined();
    }
    x(){
        this.origin.x();
    }
    y(){
        this.origin.y();
    }
    angle(){
        return this.__angle;
    }
    len(){
        return Infinity;
    }


    beta(){
        return Segment._beta(this);
    }
    coef(){
        return SemiSegment._coef(this);
    }
    cos(){
        return SemiSegment._cos(this);
    }
    sin(){
        return SemiSegment._sin(this);
    }
    isVertical(){
        return SemiSegment._isVertical(this);
    }
    isHorizontal(){
        return SemiSegment._isHorizontal(this);
    }
    f(x){
        return SemiSegment._f(this, x)
    }
    inRangeP(p){
        return SemiSegment._inRangeP(this, p);
    }
    raw(){
        return SemiSegment.raw(this);
    }
}