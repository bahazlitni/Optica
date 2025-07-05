// LINE
const getLineX1 = line => parseFloat(line.getAttributeNS(null, "x1"));
const getLineX2 = line => parseFloat(line.getAttributeNS(null, "x2"));
const getLineY1 = line => parseFloat(line.getAttributeNS(null, "y1"));
const getLineY2 = line => parseFloat(line.getAttributeNS(null, "y2"));
const changeLineW = (line, w) => line.setAttributeNS(null, "stroke-width", w);

function changeLineX(line, x){
    const x1 = getLineX1(line);
    const deltaX = x - x1;
    line.setAttributeNS(null, "x1", x1 + deltaX);
    line.setAttributeNS(null, "x2", getLineX2(line) + deltaX);
}
function changeLineY(line, y){
    const y1 = getLineY1(line);
    const deltaY = y - y1;
    line.setAttributeNS(null, "y1", y1 + deltaY);
    line.setAttributeNS(null, "y2", getLineY2(line) + deltaY);
}
const changeLineColor = (line, color) => line.setAttributeNS(null, "stroke", styleColor(color));


// CIRCLE
const getCircleX = circle => parseFloat(circle.getAttributeNS(null, "cx"));
const getCircleY = circle => parseFloat(circle.getAttributeNS(null, "cy"));
const getCircleR = circle => parseFloat(circle.getAttributeNS(null, "r"));
const changeCircleX = (circle, x) => circle.setAttributeNS(null, "cx", x);
const changeCircleY = (circle, y) => circle.setAttributeNS(null, "cy", y);
const changeCircleR = (circle, r) => circle.setAttributeNS(null, "r", r);
const changeCircleColor = (circle, color) => circle.setAttributeNS(null, "fill", styleColor(color));

// RECT
const getRectX = rect => parseFloat(rect.getAttributeNS(null, "x"));
const getRectY = rect => parseFloat(rect.getAttributeNS(null, "y"));
const getRectW = rect => parseFloat(rect.getAttributeNS(null, "width"));
const getRectH = rect => parseFloat(rect.getAttributeNS(null, "height"));
const changeRectX = (rect, x) => rect.setAttributeNS(null, "x", x);
const changeRectY = (rect, y) => rect.setAttributeNS(null, "y", y);
const changeRectW = (rect, w) => rect.setAttributeNS(null, "width", w);
const changeRectH = (rect, h) => rect.setAttributeNS(null, "height", h);
const changeRectColor = (rect, color) => rect.setAttributeNS(null, "fill", styleColor(color));

// Path
const changePathD = (path, mat) => path.setAttributeNS(null, "d", constructPath(mat));