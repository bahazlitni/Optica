class Segment {
    static interP(self, p){
        return (
            (
                self.isVertical() && p.x() == self.x() || round(self.f(p.x())) == round(p.y())
            ) ? (
                Point._len(self.origin, p)<=self.len() &&
                Point._len(self.end, p)<=self.len() ? p : undefined
            ) : undefined
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
        let point = Segment.interL(self, seg);
        if(!point || !seg.inRangeP(point)) return undefined;
        return point;
    }
    static interSeg(self, seg){
        let point = Segment.interL(self, seg);
        if(!point || !seg.inRangeP(point)) return undefined;
        return point;
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
        if(Point._hover(self.origin, p, magnet) && Point._hover(self.end, p, magnet)) return true;
        let point = Segment.projectOthogonalP(self, p);
        return point && Point._hover(p, point, magnet);
    }
    static _isDefined(self){
        const v = self.origin.isDefined() && self.end.isDefined();
        self.isDefined = () => v;
        return v;
    }
    static _isHorizontal(self){
        const v = Point._isHorizontal(self.origin, self.end);
        this.isHorizontal = () => v;
        return v;
    }
    static _isVertical(self){
        const v = Point._isVertical(self.origin, self.end);
        this.isVertical = () => v;
        return v;
    }
    static _deltaX(self){
        const v = Point._deltaX(self.origin, self.end);
        this.deltaX = () => v;
        return v;
    }
    static _deltaY(self){
        const v = Point._deltaY(self.origin, self.end);
        this.deltaY = () => v;
        return v;
    }
    static _cos(self){
        const v = self.deltaX()/self.len();
        self.cos = () => v;
        return v;
    }
    static _sin(self){
        const v = self.deltaY()/self.len();
        self.sin = () => v;
        return v;
    }
    static _angle(self){
        const v = self.isVertical()? (self.y2()<self.y()? DEG270 : DEG90) 
        : (self.x()<self.x2()? Math.atan(self.coef()) : Math.atan(self.coef()) + DEG180);
        self.angle = () => v;
        return v;
    }
    static _beta(self){
        const v = self.y() - self.coef()*self.x();
        self.beta = () => v;
        return v;
    }
    static _coef(self){
        const v = self.deltaY()/self.deltaX();
        self.coef = () => v;
        return v;
    }
    static _f(self, x){
        if(self.isVertical())
            self.f = x => undefined;
        else if(self.x()<self.x2())
            self.f = x => x<self.x() || x>self.x2() ? undefined : self.coef()*(x-self.x())+self.y();
        else
            self.f = x => x<self.x2() || x>self.x()? undefined : self.coef()*(x-self.x())+self.y();
        return self.f(x);
    }
    static _inRangeP(self, p){
        if(self.isVertical()){
            if(self.y()<self.y2())
                self.inRangeP = p => p.x() == self.x() && !(p.y()<self.y() || p.y()>self.y2());
            else 
                self.inRangeP = p => p.x() == self.x() && !(p.y()>self.y() || p.y()<self.y2());
        }
        if(self.x()<self.x2())
            self.inRangeP = p => !(p.x()<self.x() || p.x()>self.x2());
        else
            self.inRangeP = p => !(p.x()>self.x() || p.x()<self.x2());

        return self.inRangeP(p);
    }

    static raw(self){
        const v = [[self.x(), self.y()], [self.x2(), self.y2()]];
        self.raw = () => v;
        return v;
    }
    static new(rawline){
        return new Segment(Point.new(rawline[0]), Point.new(rawline[1]));
    }

    constructor(origin, end){
        this.origin = origin;
        this.end = end;
    }
    // static
    hover(p, magnet){
        return Segment._hover(this, p, magnet);
    }
    x(){
        return this.origin.x();
    }
    y(){
        return this.origin.y(); 
    }
    x2(){
        return this.end.x();
    }
    y2(){
        return this.end.y(); 
    }


    isDefined(){
        return Segment._isDefined(this);
    }
    cos(){
        return Segment._cos(this);
    }
    sin(){
        return Segment._sin(this);
    }
    angle(){
        return Segment._angle(this);
    }
    deltaX(){
        return Segment._deltaX(this);
    }
    deltaY(){
        return Segment._deltaY(this);
    }
    beta(){
        return Segment._beta(this);
    }
    coef(){
        return Segment._coef(this);
    }
    f(x){
        return Segment._f(this, x);
    }
    inRangeP(p){
        return Segment._inRangeP(this, p);
    }
    raw(){
        return Segment.raw(this);
    }
}