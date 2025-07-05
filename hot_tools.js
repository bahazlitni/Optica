// returns the time in milliseconds
now = () => new Date().getTime();

// JSON method to deep copy objects
deepCopy = (object) => JSON.parse(JSON.stringify(object));

// Gets the name of the class of an object
className = (object) => object.constructor.name;

// loops through an object and deletes its properties
function undefine(object){
  for(var member in object){delete object[member]}
}

// capitalizes a string
function capitalizeStr(str){
  return str[0].toUpperCase() + str.substring(1);
}

// get angle
const getAngle = (p1, p2) => {
  var angle = Math.atan( (p1[1]-p2[1])/(p1[0]-p2[0]) );
  if(p1[0] >= p2[0]) return angle + Math.PI;
  return angle;
}

// compares deeply two lists of depth 2
function compareLists(l1, l2){
  if(l1.length==l2.length){
    for(let j = 0; j<l1.length; j++){
      if(l1[j]!=l2[j]){ return false }
    }
  }
  return true;
}

// searches for an element and removes it from the list
function removeFromList(list, element){
  newList = [];
  for(let x of list){
    if(x!=element){
      newList.push(x);
    }
  }  
  return newList;
}

// returns the maximum value of a list
function maxof(l){
  var m = l[0];
  for(let i=1; i<l.length; i++){
      if(m<l[i]){ m = l[i] }
  }
  return m;
}

// returns the minimum value of a list
function minof(l){
  var m = l[0];
  for(let i=1; i<l.length; i++){
      if(m>l[i]){ m = l[i] }
  }
  return m;
}

// returns a matrix with inserted isosceles summits in between two successive points in a loop through a matrix
function zigzagMatrix(matrix, angle){
  if(angle){
      var newM = [matrix[0]];
      for(let i=0; i<matrix.length; i++){
          newM.push(isoscelesSummit(matrix[i], matrix[i+1], angle));
          newM.push(matrix[i+1]);
      }
      return newM;
  }
  return matrix;
}

// searches for a point and returns it and its previous point as a line
function getPureLine(matrix, endPoint){
  for(let i=0; i<matrix.length; i++){
      if(compareLists(endPoint, matrix[i])){
          for(let j=i-1; j>-1; i--){
              if(!(compareLists(matrix[j], endPoint))){
                  return [matrix[j], endPoint];
              }
          }
      }
  }
  return [endPoint, endPoint];
}


function findIn(element, list){
  if(!list) return false;
  for(let ele of list){
    if(ele==element){return true}
  }
  return false;
}



/// HTML  & VISUAL ///

function convertDtoList(d){
  var filterD = [];
  filterD.push('');
  for(let ch of d){
    if(findIn(ch, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'])){
      filterD[filterD.length-1] += ch;
    }
    else if(filterD[filterD.length-1]) {
      filterD.push('');
    }
  }
  var matrix = [];
  for(let i = 0; i<filterD.length; i+=2){
    matrix.push([parseFloat(filterD[i]), parseFloat(filterD[i+1])])
  }
  return matrix
}


function constructPath(matrix){
  var string = `M${max(matrix[0][0], 0)} ${max(matrix[0][1], 0)}`;
  for(let i=1; i<matrix.length; i++){
    string += `L${max(matrix[i][0], 0)} ${max(matrix[i][1], 0)}`;
  }
  return string;
}
function constructPathFromRefMat(refMat, start, end){
  var string = `M${max(refMat[start][0], 0)} ${max(refMat[start][1], 0)}`;
  for(let i=start+1; i<end; i++){
    string += `L${max(refMat[i][0], 0)} ${max(refMat[i][1], 0)}`;
  }
  return string;
}

function constructPathMatrix(originalMatrix, pathStrokeWidth){
  var matrix = [[max(originalMatrix[0][0]-pathStrokeWidth, pathStrokeWidth), max(originalMatrix[0][1], pathStrokeWidth)]];
  for(let i=1; i<originalMatrix.length; i++){
    matrix.push([max(originalMatrix[i][0]-pathStrokeWidth, pathStrokeWidth), max(originalMatrix[i][1], pathStrokeWidth)]);
  }
  return matrix
}
function contructMatrixFromPath(path){
  var string = `M${max(matrix[0][0], 0)} ${max(matrix[0][1], 0)}`;
  for(let i=1; i<matrix.length; i++){
    string += `L${max(matrix[i][0], 0)} ${max(matrix[i][1], 0)}`;
  }
  return string;
}

function applyAttributesNS(eleNS, attrs){
  if(attrs!=undefined){
    attrs = attrs.split(';');
    for(let attr of attrs){
      if(attr){
        var x = attr.replace(/ /g, '').replace(/\n/g, '').split(':');
        eleNS.setAttributeNS(null, x[0], x[1]);
      }
    }
  }
}

function applyAttributes(ele, attrs){
  if(attrs!=undefined){
    attrs = attrs.split(';');
    for(let attr of attrs){
      if(attr){
        var x = attr.split(':');
        ele.setAttribute(null, x[0].replace(' ', ''), x[1].replace(' ', ''));
      }
    }
  }
}

//make element draggable
function dragElement(htmlDiv, clickFunc) {
  var start, rect, pos1, pos2, pos3, pos4;
  htmlDiv.addEventListener('mousedown', (e) => dragMouseDown(e, drag), false);
  function dragMouseDown(e, k) {
    pos3 = e.clientX;
    pos4 = e.clientY;
    start = now();
    document.onmouseup = stop;
    document.onmousemove = k;
  }

  function drag(e) {
    if(now()-start.getTime()>500 || e.buttons=='4'){
      document.body.style.cursor = "move";
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      rect = htmlDiv.getBoundingClientRect();
      htmlDiv.style.left = rect.left-pos1+'px';
      htmlDiv.style.top = rect.top-pos2+'px';
    }

  }
  function stop() {
    document.body.style.cursor = "auto";
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function fadeIn(element, initDisplay, d){
    d = d || 500;
    initDisplay = initDisplay || 'flex';
    element.style.display = initDisplay
    element.animate([{opacity:0}, {opacity: 1}], {duration: d, fill:'forwards'});
}

function fadeOut(element, endDisplay, d){
    d = d || 500;
    endDisplay = endDisplay || 'none';
    element.animate([{opacity:1}, {opacity: 0,}], {duration: d, fill:'forwards'});
    setTimeout(function (){element.style.display = endDisplay}, d);
}

function mouseDown(e, f){
    document.onmouseup = () => f();
}

//notifications
var htmlNotification = document.getElementById('notification');

function undisplayNotification(d){
  d = d || 500;
  htmlNotification.animate([{opacity:1}, {opacity: 0}], {duration: d, fill:'forwards'});
  setTimeout(function (){htmlNotification.removeAttribute('class');htmlNotification.style.display = 'none'}, d);
}

function notify(cls, text, d){
  d = d || 1000;
  htmlNotification.animate([{opacity:0}, {opacity: 1}], {duration: 500, fill:'forwards'});
  htmlNotification.innerText = text;
  htmlNotification.style.display= 'flex';
  htmlNotification.className = cls;
  setTimeout(() => undisplayNotification(500), d);
}

function getColorFromStyle(pattern){
  var color = [''];
  var i = null;
  for(let ch of pattern){
    if(ch=='('){
      i = 0;
    } else if(ch==')'){
      color[i] = parseFloat(color[i]);
      while(color.length<4){
        color.push(1);
      }
      return color;
    } else if(i!=null){
      if(ch==','){
        color.push('');
        color[i] = parseFloat(color[i]);
        i++;
      } else {
        color[i] += ch;
      }
    }
  }
}
function styleColor(color){
  if(color.length>3){ return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})` }
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}



// dynamic function that returns a string containing points of a polyline of an svg object
function constructPolyline(matrix){
  string = '';
  for(let point of matrix){
    string += `${point[0]},${point[1]} `;
  }
  return string;
}
function constructPolylineFromRefMat(refMat, start, end){
  string = '';
  for(let i=start; i<end; i++){
    string += `${refMat[i][0]},${refMat[i][1]} `;
  }
  return string;
}

// reverse engineering constructPolyline
function constructPolylineMatrix(points){
  i = 0;
  matrix = [];
  point = ['', ''];
  for(let ch of points){
    if(ch==',') i++;
    else if (ch==' ') {
      matrix.push([parseFloat(point[0]), parseFloat(point[1])]);
      point = ['', ''];
      i = 0;
    }
    else point[i] += ch;
  }
  return matrix;
}


// dynamic function that returns a legal hex value of a string
function filterHex(str){
  var filtered = '';
  for(let ch of str){
      if(hex.vars.includes(ch)){
          filtered+=ch;
      }
  }
  return filtered;
}

function autoDashPolyline(sw){
  return `${sw*1.25} ${sw}`;
}


// repositioning
function repositionLine(line, zoom){
  if(!line.actualX1) line.actualX1 = parseFloat(line.getAttributeNS(null, "x1"));
  if(!line.actualX2) line.actualX2 = parseFloat(line.getAttributeNS(null, "x2"));
  if(!line.actualY1) line.actualY1 = parseFloat(line.getAttributeNS(null, "y1"));
  if(!line.actualY2) line.actualY2 = parseFloat(line.getAttributeNS(null, "y2"));

  
  line.setAttributeNS(null, 'x1', line.actualX1*zoom);
  line.setAttributeNS(null, 'x2', line.actualX2*zoom);
  line.setAttributeNS(null, 'y1', line.actualY1*zoom);
  line.setAttributeNS(null, 'y2', line.actualY2*zoom);
}

function repositionPolyline(polyline, zoom){
  if(!polyline.actualMatrix) 
    polyline.actualMatrix = constructPolylineMatrix(polyline.getAttributeNS(null, "points"));

  for( let i=0; i<polyline.actualMatrix.length; i++ ){
      polyline.actualMatrix[i][0] = polyline.actualMatrix[i][0]*zoom;
      polyline.actualMatrix[i][1] = polyline.actualMatrix[i][1]*zoom;
  }
  polyline.setAttributeNS(null, 'points', constructPolyline( polyline.actualMatrix ));
}

function repositionCircle(circle, zoom){
  if(!circle.actualX) circle.actualX = parseFloat(circle.getAttributeNS(null, "cx"));
  if(!circle.actualY) circle.actualY = parseFloat(circle.getAttributeNS(null, "cy"));

  circle.setAttributeNS(null, "cx", circle.actualX*zoom);
  circle.setAttributeNS(null, "cy", circle.actualY*zoom);
}

function repositionAny(svgElement, zoom){
  if( svgElement.tagName == "circle" ) repositionCircle(svgElement, zoom);
  else if( svgElement.tagName == "polyline" ) repositionPolyline(svgElement, zoom);
  else if( svgElement.tagName == "line" ) repositionLine(svgElement, zoom);
}

function displayHtmlElement(htmlElement, display){
  htmlElement.style.display = display || "unset";
}
function undisplayHtmlElement(htmlElement){
  htmlElement.style.display = "none";
}

function absColor(color){
  return color>255? 255 : (color<0? 0 : color);
}
function absOpacity(a){
  return a>1? 1 : (a<0? 0 : a);
}

function deepCopyList(list){
  const newList = [];
  for(let element of list) list.push(element);
  return newList;
}

function isDigit(ch){
  return findIn(ch, "-+*/. 0123456789()");
}
function listsAreEqual(list1, list2){
  if(!list1 && !list2) return true;
  if(list1.length != list2.length) return false;
  for(let i=0; i<list1.length; i++){
    if(list1[i] != list2[i]) return false;
  }
  return true;
}

function inputNumber(e, input, submit){
  if(e.target.value.length){
    if(!isDigit(e.target.value[e.target.value.length-1]))
      e.target.value = e.target.value.slice(0, [e.target.value.length-1]);
  }
  if(submit(e)) input(e.target.value);
}
function inputText(e, input, submit){
  if(submit(e)) input(e.target.value);
}

function inputBoolean(e, input, submit){
  if(submit(e)) input(e.target.checked);
}

function replaceInList(list, oldElement, newElement){
  for(let i=0; i<list.length; i++){
    if(list[i] == oldElement){
      list[i] = newElement;
      return;
    }
  }
}

function getCircleClickOffsetX(e, x){
  return x-e.layerX || 0;
}
function getCircleClickOffsetY(e, y){
  return y-e.layerY || 0;
}