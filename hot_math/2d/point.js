class Point {
    static hover(rawp1, rawp2, magnet){
        return ( Point.deltaX(rawp1, rawp2)**2 + Point.deltaY(rawp1, rawp2)**2 ) <= magnet**2;
    }
    static isDefined(rawp){
        return Number.isFinite(rawp[0]) && Number.isFinite(rawp[1]);
    }
    static isColinear(rawp1, rawp2, rawp3){
        return round(Point.coef(rawp1, rawp2)) == round(Point.coef(rawp1, rawp3));
    }
    static isVertical(rawp1, rawp2){
        return rawp2[0]==rawp1[0];
    }
    static isHorizontal(rawp1, rawp2){
        return rawp2[1]==rawp1[1];
    }
    static x(rawp){
        return rawp[0];
    }
    static y(rawp){
        return rawp[1];
    }
    static len(rawp1, rawp2){
        return Math.sqrt( Point.deltaX(rawp1, rawp2)**2 + Point.deltaY(rawp1, rawp2)**2 );
    }
    static coef(rawp1, rawp2){
        const deltaX = Point.deltaX(rawp1, rawp2);
        if(deltaX) return Point.deltaY(rawp1, rawp2)/deltaX;
        return Infinity;
    }
    static beta(rawp1, rawp2){
        let deltaX = Point.deltaX(rawp1, rawp2);
        if(deltaX) return rawp1[1]-rawp1[0]*Point.coef(rawp1, rawp2);
        return rawp1[1];
    }
    static cos(rawp1, rawp2){
        return Math.sqrt(1/(Point.coef(rawp1, rawp2)**2 + 1));
    }
    static sin(rawp1, rawp2){
        return Math.sqrt(1/(1/Point.coef(rawp1, rawp2)**2 + 1));
    }
    static angle(rawp1, rawp2){
        if(Point.isVertical(rawp1, rawp2)) return rawp2[1]<rawp1[1]? DEG270 : DEG90;
        return rawp1[0]<rawp2[0]? Math.atan(Point.coef(rawp1, rawp2)) : Math.atan(Point.coef(rawp1, rawp2)) + DEG180;
    }
    static f(rawp1, rawp2, x){
        return (
            Point.isVertical(rawp1, rawp2) ? undefined :
            rawp1[1] + (x - rawp1[0])*Point.coef(rawp1, rawp2) 
        );
    }
    static deltaX(rawp1, rawp2){
        return rawp2[0]-rawp1[0];
    }
    static deltaY(rawp1, rawp2){
        return rawp2[1]-rawp1[1];
    }



    static _hover(p1, p2, magnet){
        return ( (p2.x()-p1.x())**2 + (p2.y()-p1.y())**2 ) <= magnet**2;
    }
    static _len(p1, p2){
        return Math.sqrt( Point._deltaX(p1, p2)**2 + Point._deltaY(p1, p2)**2 );
    }
    static _angle(p1, p2){
        if(Point._isVertical(p1, p2)) return p2.y()<p1.y()? DEG270 : DEG90;
        return p1.x()<p2.x()? Math.atan(Point._coef(p1, p2)) : Math.atan(Point._coef(p1, p2)) + DEG180;
    }
    static _coef(p1, p2){
        return Point._deltaY(p1, p2)/Point._deltaY(p1, p2);
    }
    static _isVertical(p1, p2){
        return p1.x()==p2.x();
    }
    static _isHorizontal(p1, p2){
        return p1.y()==p2.y();
    }
    static _deltaX(p1, p2){
        return p2.x()-p1.x();
    }
    static _deltaY(p1, p){
        return p2.y()-p1.y();
    }
    static _isDefined(self){
        const v = Number.isFinite(self.x()) && Number.isFinite(self.y());
        self.isDefined = () => v;
        return v;
    }
    static _isColinear(p1, p2, p3){
        return (
            round(Point._coef(p1, p2)) == round(Point._coef(p1, p3))
        );
    }

    static raw(self){
        const v = [self.x(), self.y()];
        self.raw = () => v;
        return v;
    }
    static new(rawp){
        return new Point(rawp[0], rawp[1]);
    }

    constructor(x, y){
        this.__x = x;
        this.__y = y;
    }
    // static
    x(){
        return this.__x;
    }
    y(){
        return this.__y;
    }


    isDefined(){
        return Point._isDefined(this);
    }
    raw(){
        return Point.raw(this);
    }
}