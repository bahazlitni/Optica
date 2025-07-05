/*
circle: [x, y, r]
rect: [x, y, w, h]
point: [x, y]
line: [[x1, y1], [x2, y2]]
matrix: [p1, ... pN]
*/

const DEG360 = Math.PI*2;
const DEG345 = Math.PI*1.75;
const DEG330 = Math.PI*11/6;
const DEG315 = Math.PI*1.75;
const DEG300 = Math.PI*5/3;
const DEG285 = Math.PI*19/12;
const DEG270 = Math.PI*1.50;
const DEG255 = Math.PI*17/12;
const DEG240 = Math.PI*4/3;
const DEG225 = Math.PI*5/4;
const DEG210 = Math.PI*7/6;
const DEG195 = Math.PI*13/12;
const DEG180 = Math.PI*1.00;
const DEG165 = Math.PI*11/12;
const DEG150 = Math.PI*5/6;
const DEG135 = Math.PI*0.75;
const DEG120 = Math.PI*2/3;
const DEG105 = Math.PI*5/12;
const DEG90  = Math.PI*0.50;
const DEG75  = Math.PI*5/12;
const DEG60  = Math.PI/3;
const DEG45  = Math.PI*0.25;
const DEG30  = Math.PI/6;
const DEG15  = Math.PI/12;
const DEG0   = 0;

const THIRD = 1/3;
const TWOTHIRDS = 2/3;

const midPoint = (a, b) => [(a[0]+b[0])/2, (a[1]+b[1])/2];
const distance = (a, b) => Math.sqrt(Math.pow(b[0]-a[0], 2) + Math.pow(b[1]-a[1], 2));
const round = (x, n=0) => { var beta = Math.pow(10, n); return Math.round(x*beta)/beta; };
const roundAngle = (angle, angleMultiplier) => angleMultiplier*Math.round((angle+Math.PI*2)/angleMultiplier);
const haveSameSign = (x, y) => (x>=0 && y>=0) || (x<0 && y<0);
const equalizeSign = (x, y) => ((y<0 && x>0) || (y>0 && x<0)) ? -x : x;
const min = (a, b) => a<b ? a : b;
const max = (a, b) => a>b ? a : b;
function stick(x, base){
  if(x<0) return -stick(-x, base);
  const dec = x%base;
  if(dec<base/2)
      return x-dec;
  return x+base-dec;
}

const __lineIsVorH = (line, i, h) => (line[0][i]-line[1][i])<=h && (line[0][i]-line[1][i])>=-h;
const lineIsVertical = (line, h) => __lineIsVorH(line, 0, h || 10E-13);
const lineIsHorizental = (line, h) => __lineIsVorH(line, 1, h || 10E-13);
const lineCoef = line => {
  if(line[0][0]==line[1][0]) return Infinity;
  return (line[1][1]-line[0][1])/(line[1][0]-line[0][0]);
};
const lineAngle = (line) => {
  if(line[1][0] == line[0][0]){
    if(line[1][1] < line[0][1]) return DEG270; 
    return DEG90;
  }
  var angle = Math.atan((line[1][1]-line[0][1])/((line[1][0]-line[0][0])));
  if(line[0][0] >= line[1][0]) return angle + Math.PI;
  return angle;
};
const lineNormal = (line) => lineAngle(line)+DEG90;
const lineDistance = line => Math.sqrt( (line[0][0]-line[1][0])**2 + (line[0][1]-line[1][1])**2 );
const positiveAngle = (angle) => angle<0 ? angle + DEG360 : angle;
const poLineToPntLine = (x, y, angle, length) => [[x, y], [Math.cos(angle)*length+x, Math.sin(angle)*length+y]];
const absAngle = angle => {
  if(angle>=0) return angle;
  angle = -angle;
  const r = angle%DEG360;
  return (DEG360 - r) + (angle-r);
}

function deviateLine(line, deviationAngle){
  if(lineIsVertical(line) || lineIsHorizental(line)) 
    return line[0];

  if(deviationAngle%(Math.PI/2)){ return ( deviationAngle > 0 ? [line[0][0], line[1][1]] : [line[1][0], line[0][1]] ) }

  var coefLine = lineCoef(line);
  var coefDeviation = Math.sin(deviationAngle)/Math.cos(deviationAngle);

  equalizeSign(coefDeviation, coefLine);

  if( Math.abs(coefLine) > Math.abs(coefDeviation) )
      return [line[1][0], coefDeviation*(line[1][0]-line[0][0]) + line[0][1]];
  else 
      return [(line[1][1]-line[0][1])/coefDeviation+line[0][0], line[1][1]];
  
}

function lerp(t, a, b){
  return [a[0]*(1-t) + t*b[0], a[1]*(1-t) + t*b[1]]
}

function calculateIntersectionVar(line1, line2){
  const a = line1[0], b = line1[1]
  const c = line2[0], d = line2[1]
  
  const dx_AB = (b[0]-a[0])
  const dx_CD = (d[0]-c[0])
  const dy_AB = (b[1]-a[1])
  const dy_CD = (d[1]-c[1])
  return ((c[1]-a[1])*dx_CD + dy_CD*(a[0]-c[0]))/(dy_AB*dx_CD - dx_AB*dy_CD)
}

function constructIntersection(line1, line2){
  return lerp(calculateIntersectionVar(line1, line2), line1[0], line1[1])
}
function cubicLerp(p0, p1, p2, p3, t) {
  const a = (1-t)**3
  const b = (1-t)**2*t
  const c = (1-t)*t**2
  const d = t**3
  return [
    p0[0]*a+3*(p1[0]*b+p2[0]*c)+p3[0]*d, 
    p0[1]*a+3*(p1[1]*b+p2[1]*c)+p3[1]*d
  ]
}
function dCubic(p0, p1, p2, p3, t){
  const d = t**2
  const c = 2*t-3*d
  const a = -1+2*t-d
  const b = 1-c-2*t
  return [
    3*(p0[0]*a + p1[0]*b + p2[0]*c + p3[0]*d),
    3*(p0[1]*a + p1[1]*b + p2[1]*c + p3[1]*d),
  ]
}


function constructIntersectionBezierLine(p0, p1, p2, p3, line){
  var solutions
  if(line[1][0]!=line[0][0]){
    const g = (line[1][1]-line[0][1])/(line[1][0]-line[0][0])
    const dp0 = p0[1]-p0[0]*g
    const dp1 = p1[1]-p1[0]*g
    const dp2 = p2[1]-p2[0]*g
    const dp3 = p3[1]-p3[0]*g
    solutions = solveCubic(
      dp3 + 3*(dp1-dp2) - dp0,
      3*( dp0 + dp2 -2*dp1 ),
      3*( dp1 - dp0 ),
      dp0 - (line[0][1]-line[0][0]*g )
    )
  }
  else {
    solutions = solveCubic(
      p3[0] - p0[0] + 3*(p1[0] - p2[0]),
      3*(p0[0] - 2*p1[0] + p2[0]),
      3*(p1[0] - p0[0]),
      p0[0] - line[0][0]
    )
  }

  const points = []
  for(let t of solutions){
    if(t<0 || t>1) continue
    const p = cubicLerp(p0, p1, p2, p3, t)
    
    const s = line[1][0]!=line[0][0]? 
    (p[0]-line[0][0])/(line[1][0]-line[0][0]) : 
    (p[1]-line[0][1])/(line[1][1]-line[0][1])
    
    if(s<0 || s>1) continue
    points.push(p)
  }
  
  return points
}


// returns the intersection of a circle with a line
function constructIntersectionLineCircle(circle, line){ //circle [cx, cy, r] line [[x, y], [x', y']]
  let a = lineCoef(line);
  let b = -a*line[0][0]+line[0][1];
  let dblalpha = 2+2*a**2,  beta = 2*(a*b-circle[0]-a*circle[1]);
  let delta = beta**2 - 2*dblalpha*(circle[0]**2 + b**2 + circle[1]**2 - circle[2]**2 - 2*b*circle[1]);
  if(delta<0){ return false } 
  else if(delta>0){
    let mdelta = Math.sqrt(delta);
    return [-(beta+mdelta)/dblalpha, -(beta-mdelta)/dblalpha];
  }
  return [-beta/dblalpha];
}



// returns the projection of a point on a line
function constructOrthogonalPoint(line, c){
    var v = [line[1][0]-line[0][0], line[1][1]-line[0][1]];
    var t = -((line[0][0]-c[0])*(line[1][0]-line[0][0]) + (line[0][1]-c[1])*(line[1][1]-line[0][1]))/((line[1][0]-line[0][0])*v[0]+(line[1][1]-line[0][1])*v[1]);
    return [line[0][0] + v[0]*t, line[0][1] + v[1]*t];
}
/// BOOLEANS ///

// returns a boolean referring to whether an intersection of two lines exists
function lineAligned(line1, line2, coef){
  coef = !coef && coef!=0? lineCoef(line1) : coef;
  return lineCoef(line1[0], line2[0]) == coef1;
}
function anyIntersectionLL(line1, line2){
  return Number.isFinite(calculateIntersectionVar(line1, line2))
}
function anyIntersectionLineSegment(line, seg){
  const s = calculateIntersectionVar(line, seg)
  const t = calculateIntersectionVar(seg, line)
  return !(t<0 || t>1) && !(s<0 || s>1)
}

// checks if the first defined segment has an intersection with the second segment, if it exists, then returns a point
function constructSegmentLineIntersection(seg, line){
  const t = calculateIntersectionVar(seg, line)
  if(t<0 || t>1) return undefined
  return lerp(t, seg[0], seg[1])
}
function constructSegmentSemisegIntersection(line1, line2){
  const s = calculateIntersectionVar(line2, line1)
  const t = calculateIntersectionVar(line1, line2)
  if(t<0 || t>1 || s<0) return undefined
  return lerp(t, line1[0], line1[1])
}
function constructSegmentIntersection(line1, line2){
  const s = calculateIntersectionVar(line2, line1)
  const t = calculateIntersectionVar(line1, line2)
  if(t<0 || t>1 || s<0 || s>1) return undefined
  return lerp(t, line1[0], line1[1])
}

// returns a boolean that refers to whether an intersection of a line with a circle exists
function anyIntersectionLC(circle, line){
    let a = lineCoef(line);
    let b = -a*line[0][0]+line[0][1];
    let alpha = 1+a**2,  beta = 2*(a*b-circle[0]-a*circle[1]);
    let delta = beta**2 - 4*alpha*(circle[0]**2 + b**2 + circle[1]**2 - circle[2]**2 - 2*b*circle[1]);
    if(delta<0) 
      return false;
    return true;
}

// retruns a boolean that refers to whether a rectangle overlaps with another rectangle
function overlapRects(rect1, rect2){ //rect = [x, y, w, h]
    let right1 = rect1[0]+rect1[2];
    let bot1 = rect1[1]+rect1[3];
    let top1 = rect1[1];
    let left1 = rect1[0];

    let right2 = rect2[0]+rect2[2];
    let bot2 = rect2[1]+rect2[3];
    let top2 = rect2[1];
    let left2 = rect2[0];

    return (
      (left1>left2 && left1<right2) || 
      (right1>left2 && right1<right2) || 
      (top1>top2 && top1<bot2) || 
      (bot1>top2 && bot1<bot2)
    );
}

function overlapBoxLine(box, line){
  if(!box || !line) return null;
  const x1 = box[0];
  const y1 = box[1];
  const x2 = x1+box[2];
  const y2 = y1+box[3];
  
  return (
      line[0][0] >= x1 && line[0][1] >= y1 &&
      line[1][0] >= x1 && line[1][1] >= y1 &&
      line[0][0] <= x2 && line[0][1] <= y2 &&
      line[1][0] <= x2 && line[1][1] <= y2 
  )
  ||
  (  constructSegmentIntersection(line, [[x1, y1], [x2, y1]])
  || constructSegmentIntersection(line, [[x1, y1], [x1, y2]]) 
  || constructSegmentIntersection(line, [[x2, y1], [x2, y2]])
  || constructSegmentIntersection(line, [[x1, y2], [x2, y2]]))
  ;
}

function getBBoxFromBoxes(boxes){
  if(boxes.length==0) return [0, 0, 0, 0];

  var minX = boxes[0][0];
  var minY = boxes[0][1];
  var maxX = minX+boxes[0][2];
  var maxY = minY+boxes[0][3];

  let x1, y1, x2, y2;
  for(let i=1; i<boxes.length; i++){
    x1 = boxes[i][0];
    y1 = boxes[i][1];
    x2 = x1+boxes[i][2];
    y2 = y1+boxes[i][3];
    if(x1<minX) minX = x1;
    if(y1<minY) minY = y1;
    if(x2>maxX) maxX = x2;
    if(y2>maxY) maxY = y2;
  }

  return [minX, minY, maxX-minX, maxY-minY];
}

function getBBoxFromMatrixOfPoints(matrix){
  if(!matrix) return [0, 0, 0, 0];
  var minX = matrix[0][0];
  var minY = matrix[0][1];
  var maxX = matrix[0][0];
  var maxY = matrix[0][1];
  for(let i=1; i<matrix.length; i++){
    if(matrix[i][0]<minX) minX = boxes[i][0];
    else if(matrix[i][0]>maxY) maxX = boxes[i][0];
    if(matrix[i][1]<minX) minY = boxes[i][1];
    else if(matrix[i][1]>maxY) maxY = boxes[i][1];
  }

  return [minX, minY, maxX-minX, maxY-minY];
}


function solveCubic(a, b, c, d) {
  const zero = 1e-12
  if(a>-zero && a<zero) {
      if (b == 0) {
          if (c==0) return []
          return [-d/c]
      }
      const D = c*c - 4*b*d
      if (D < 0)  return []
      if (D == 0) return [-c/(2*b)]
      const sqrtD = Math.sqrt(D)
      return [(-c+sqrtD)/(b+b), (-c-sqrtD)/(b+b)]
  }

  const p = (3*a*c - b*b)/(3*a*a);
  const q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
  const sym = -b/(3*a)

  if (p>-zero && p<zero) return [Math.cbrt(-q)+sym]
  if (q>-zero && q<zero) {
    if(p<0){
      const sqrtP = Math.sqrt(-p)
      return [sym, sqrtP+sym, -sqrtP+sym]
    }
    return [sym]
  }

  const D = q*q/4 + p*p*p/27;
  if (D == 0) return [-1.5*q/p+sym, 3*q/p+sym];
  if (D > 0) {
    const u = Math.cbrt(-q/2 - Math.sqrt(D))
    return [u - p/(3*u)+sym]
  }                       
  const u = 2*Math.sqrt(-p/3)
  const t = Math.acos(3*q/(p*u))/3
  const k = 2*Math.PI/3
  return [u*Math.cos(t)+sym, u*Math.cos(t-k)+sym, u*Math.cos(t-2*k)+sym];
}

function rotateMatrixOfPoints(matrix, angle){
  if(!matrix) return;
  var newMatrix = [];
  const bBox = getBBoxFromMatrixOfPoints(matrix);
  const x = bBox[0] + bBox[2]/2;
  const y = bBox[1] + bBox[3]/2;
  let dist, angle0;
  for(let i=0; i<matrix.length; i++){
    dist = Math.sqrt((x-bBox[i][0])**2 + (y-bBox[i][0])**2);
    angle0 = lineAngle([[x, y], bBox[i]]);
    newMatrix.push(
      Math.cos(angle0+angle)*dist,
      Math.sin(angle0+angle)*dist
    )
  }
  return matrix;
}

function sinoid(x){
  let exp = Math.exp(x);
  return (1-exp)/(1+exp);
}

// retruns a boolean that refers to whether a point is within a circle
const anyHoverCircle = (circle, p, marg=0) => Math.sqrt(Math.pow(p[0]-circle[0], 2)+Math.pow(p[1]-circle[1], 2))<circle[2]+marg;

// retruns a boolean that refers to whether a point is within a rectangle
const anyHoverRect = (rect, p, marg=0) => p[0]>rect[0]-marg && p[1]>rect[1]-marg && p[0]<rect[0]+rect[2]+marg && p[1]<rect[1]+rect[3]+marg;