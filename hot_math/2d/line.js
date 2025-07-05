class Line {
    static interP(self, p){
        return (
            self.isVertical() && round(p.x()) == round(self.x()) ||
            round(self.f(p.x()))==round((p.y())) ? p : undefined
        );
    }
    
    static projectOthogonalP(self, p){
        if(self.isVertical()) return new Point(self.x(), p.y());
        const x = (p.x() + (p.y()-self.beta())*self.coef())/(1+self.coef()**2);
        return new Point(x, self.f(x));
    }
    static raw_projectOthogonalP(rawline, rawp){
        if(Line.isVertical(rawline)) return [rawline[0][0], rawp[1]];
        let coef = Line.coef(rawline);
        let beta = Line.beta(rawline);
        let x = (rawp[0] + (rawp[1]-beta)*coef)/(1+coef**2);
        return [x, coef*x+beta];
    }
    

    static interL(self, l){
        if(Line._isParallel(self, l))
            return undefined;
        if(self.isVertical()){
            if(l.isVertical()) return undefined;
            return new Point(self.x(), l.f(self.x()));
        }
        if(l.isVertical()){
            return new Point(l.x(), self.f(l.x()));
        }
        const x = (l.beta()-self.beta())/(self.coef()-l.coef());
        return new Point(x, self.f(x));
    }
    static interSemiSeg(self, seg){
        return SemiSegment.interL(seg, self);
    }
    static interSeg(self, seg){
        return Segment.interL(seg, self);
    }
    static interC(self, circle){
        const cx = circle.x();
        const cy = circle.y();
        const r = circle.r();

        if(self.isVertical()){
            const x = self.x();
            let start = cx-r;
            let end = cx+r;
            if(x<start || x>end)
                return [];
            if(x == start || x == end)
                return [new Point(x, cy)];
            //let b_div2 = -cy;
            //let c = x*(x-2*cx) + cx**2 + cy**2 - r**2;
            let d_div2 = Math.sqrt(r**2 -x*(x-2*cx) - cx**2);
            return [new Point(x, cy-d_div2), new Point(x, -(cy+d_div2))];
        }
        const coef = self.coef();
        const beta = self.beta();

        const a = 1+coef**2;
        const b_div2 = coef*(beta-cy)-cx;
        //const c = cx**2+cy**2+beta*(beta-2*cy)-r**2;
        let delta_div4 = b_div2**2 - a*(cx**2+cy**2+beta*(beta-2*cy)-r**2);

        if(delta_div4<0) return [];
        let x;
        if(!delta_div4){
            x = b_div2/a;
            return [new Point(x, self.f(x))];
        }
        delta_div4 = Math.sqrt(delta_div4);
        x = (delta_div4-b_div2)/a;
        let x2 = -(b_div2+delta_div4)/a;
        return [new Point(x, self.f(x)), new Point(x2, self.f(x2))];
    }
    static interRect(self, rect){

    }

    // with raw line
    static hover(rawline, rawp, magnet){
        return Point.hover(Line.raw_projectOthogonalP(rawline, rawp), rawp, magnet);
    }
    static isDefined(rawline){
        return Point.isDefined(rawline[0]) && Point.isDefined(rawline[1]);
    }
    static isParallel(rawline1, rawline2){
        return round(Line.coef(rawline1)) == round(Line.coef(rawline2));
    }
    static isVertical(rawline){
        return rawline[0][0] == rawline[1][0];
    }
    static isHorizontal(rawline){
        return rawline[0][1] == rawline[1][1];
    }
    static x(rawline){
        return rawline[0][0];
    }
    static y(rawline){
        return rawline[0][1];
    }
    static x2(rawline){
        return rawline[1][0];
    }
    static y2(rawline){
        return rawline[1][1];
    }
    static coef(rawline){
        return Point.coef(rawline[0], rawline[1]);
    }
    static beta(rawline){
        return Point.beta(rawline[0], rawline[1]);
    }
    static len(rawline){
        return Point.len(rawline[0], rawline[1]);
    }
    static cos(rawline){
        return Point.cos(rawline[0], rawline[1]);
    }
    static sin(rawline){
        return Point.sin(rawline[0], rawline[1]);
    }
    static angle(rawline){
        return Point.angle(rawline[0], rawline[1]);
    }
    static f(rawline, x){
        return Point.f(rawline[0], rawline[1], x);
    }
    static inRangeP(rawline, rawpoint){
        return !Line.isVertical(rawline) || Point.isVertical(rawline[0], rawpoint);
    }

    static _hover(self, p, magnet){
        return Point.hover(Line.projectOthogonalP(self, p), p, magnet);
    }
    static _isParallel(self, l){
        return round(self.coef()) == round(l.coef());
    }
    static _isVertical(self){
        const v = !Number.isFinite(self.coef());
        self.isVertical = () => v;
        return v;
    }
    static _isHorizontal(self){
        const v = !self.coef();
        self.isHorizontal = () => v;
        return v;
    }
    static _x(self){
        const v = self.isVertical()? self.beta() : 0;
        self.x = () => v;
        return v
    }
    static _y(self){
        const v = self.f(0);
        self.y = () => v;
        return v;
    }
    static _cos(self){
        const v = Math.sqrt(1/(self.coef()**2 + 1));
        self.cos = () => v;
        return v;
    }
    static _sin(self){
        const v = Math.sqrt(1/(1/self.coef()**2 + 1));
        self.sin = () => v;
        return v;
    }
    static _angle(self){
        const v = self.isVertical() ? DEG90 : Math.atan(self.coef());
        self.angle = () => v;
        return v;
    }
    static _f(self, x){
        if(self.isVertical()) 
            self.f = x => undefined;
        else if(self.beta() == 0){
            if(self.coef() == 0) self.f = x => 0;
            else if(self.coef() == 1) self.f = x => x;
            else self.f = x => self.coef()*x;
        }
        else if(self.coef() == 0)
            self.f = x => self.beta();
        else if(self.coef() == 1)
            self.f = x => x + self.beta();
        else
            self.f = x => self.coef()*x + self.beta();

        return self.f(x);
    }
    static _inRangeP(self, p){
        if(self.isVertical())
            self.inRangeP = p => p.x() == self.x();
        else
            self.inRangeP = p => true;
        return self.inRangeP(p);
    }


    static raw(self){
        const v = self.isVertical()? [[self.x(), 0], [self.x(), 1]] : [[0, self.beta()], [self.cos(), self.beta()+self.sin()]];
        this.raw = () => v;
        return v;
    }
    static new(rawline){
        let deltaX = rawline[1][0]-rawline[0][0];
        if(deltaX){
            let coef = (rawline[1][1]-rawline[0][1])/deltaX;
            return new Line(rawline[0][1] - rawline[0][0]*coef, coef);
        }
        return new Line(rawline[0][0]);
    }
    

    constructor(beta, coef=Infinity){
        //if is vertical: x() gives beta()
        this.__beta = beta;
        this.__coef = coef;
    }
    // static
    hover(p, magnet){
        return Line._hover(this, p, magnet);
    }
    isDefined(){
        return true;
    }
    coef(){
        return this.__coef;
    }
    beta(){
        return this.__beta;
    }
    len(){
        return Infinity;
    }


    x(){
        return Line._x(this);
    }
    y(){
        return Line._y(this);
    }
    isVertical(){
        return Line._isVertical(this);
    }
    isHorizontal(){
        return Line._isHorizontal(this);
    }
    cos(){
        return Line._cos(this);
    }
    sin(){
        return Line._sin(this);
    }
    angle(){
        return Line._angle(this);
    }
    f(x){
        return Line._f(this, x);
    }
    inRangeP(p){
        return Line._inRangeP(this, p);
    }
    raw(){
        return Line.raw(this);
    }
}