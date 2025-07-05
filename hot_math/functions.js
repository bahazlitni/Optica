const midPoint = (a, b) => [(a[0]+b[0])/2, (a[1]+b[1])/2];
const distance = (a, b) => Math.sqrt(Math.pow(b[0]-a[0], 2) + Math.pow(b[1]-a[1], 2));
const round = (x, n=E15) => Math.round(x*n)/n;


const isOpposite = (x, y) => (x<0)^(y<0);
const eqSign = (equalized, equalizer) => isOpposite(equalized, equalizer)? -equalized : equalized;
const sign = x => x<0? -1 : 1;
const abs = x => x<0 ? -x : x;
const min = (a, b) => a<b ? a : b;
const max = (a, b) => a>b ? a : b;
const absAngle = angle => {
    if(angle<0){
        angle = -angle;
        const r = angle%DEG360;
        return (DEG360 - r) + (angle-r);
    }
    return angle%DEG360;
}

const stick = (x, base) => {
    if(x<0){
        let dec = (-x)%base;
        return dec+dec<base ? x+dec : x+dec-base;
    }
    let dec = x%base;
    return dec+dec<base ? x-dec : x+base-dec;
}