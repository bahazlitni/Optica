class Polyline {
    static interL(self, l){
        let points = [], point;
        for(let seg of self.segments){
            point = seg.cls.interL(seg, l);
            if(!point) continue;
            points.push(point);
        }
        return points;
    }
    static interSemiSeg(self, semiseg){
        let points = [], point;
        for(let seg of self.segments){
            point = seg.cls.interSemiSeg(seg, semiseg);
            if(!point) continue;
            points.push(point);
        }
        return points;
    }
    static interSeg(self, segment){
        let points = [], point;
        for(let seg of self.segments){
            point = seg.cls.interSemiSeg(seg, segment);
            if(!point) continue;
            points.push(point);
        }
        return points;
    }
    static interC(self, circle){
        let points = [], s;
        for(let seg of self.segments){
            s = seg.cls.interC(seg, circle);
            if(!s.length) continue;
            points.push(s[0]);
            if(s.length==1) continue;
            points.push(s[1]);
        }
        return points;
    }
    static interRect(self, rect){
        let points = [], s;
        for(let seg of self.segments){
            s = seg.cls.interRect(seg, rect);
            for(let point of s)
            points.push(point);
        }
        return points;
    }


    static len(self){
        let len = 0;
        for(let seg of self.segments)
        len += seg.len();
        return len;
    }

    constructor(points){
        this.cls = StaticPolyline;

        this.segments = [];
        for(let i=1; i<points.length; i++)
        this.segments.push(new StaticSegment(points[i-1], points[i]));
    }

    f(x){
        let image, imageTemp;
        for(let seg of this.segments){
            imageTemp = seg.f(x);
            if(Number.isNaN(imageTemp)) continue;
            if(Number.isNaN(image)) image = imageTemp;
            else return undefined;
        }
        return image;
    }
    len(){
        const v = this.cls.len(this);
        this.len = () => v;
        return v;
    }
    isHorizontal(){
        for(let seg of this.segments){
            if(!seg.isHorizontal()){
                this.isHorizontal = () => false;
                return false;
            } 
        }
        this.isHorizontal = () => true;
        return true;
    }
    isVertical(){
        for(let seg of this.segments){
            if(!seg.isVertical()){
                this.isVertical = () => false;
                return false;
            } 
        }
        this.isVertical = () => true;
        return true;
    }
    inRangeP(p){
        for(let seg of this.segments){
            if(seg.inRangeP(p)) return true;
        }
        return false;
    }
    raw(){
        let raw = [this.segments[0].origin.raw()];
        for(let seg of this.segments)
        raw.push(seg.end.raw());
        return raw;
    }
}