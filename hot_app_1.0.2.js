// COLORS
const svgns = 'http://www.w3.org/2000/svg';
const rgbah = {'r': 0, 'b': 1, 'g': 2, 'a': 3, 'h': 4};


//hex
const hex = {
    black: '#000000',
    white: '#FFFFFF',

    // code
    accent: '#33AAFF',
    error: '#FF4444',
    success: '#2BE89C',
    greyThin: '#E5E5E5',
    greyAccent: '#C4C4C4',
    fields: '#616161',
    button: '#3F3F3F',
    workspace: '#1A1A1A',

    format: function(v){
        v = v.toString(16).toUpperCase();
        return v.length>1 ? v : '0'.concat(v);
    },
    rgb: function(rgb){
        return '#'.concat(this.format(rgb[0]), this.format(rgb[1]), this.format(rgb[2]));
    },
    hsl: function(hsl){
        
    },
    includes: function(str){
        return '0123456789ABCDEF'.includes(str);
    }
};


//rgb
const rgb = {
    transparent: [0, 0, 0, 0],
    format: function(v){
        return parseInt(v, 16);
    },

    hex: function(hex){
        return [this.format(hex[1]+hex[2]), this.format(hex[3]+hex[4]), this.format(hex[5]+hex[6]), 1];
    },
    hsl: function(hsl){

    }
};

for(let member in hex){
    if(typeof hex[member] == typeof ''){
        rgb[member] = rgb.hex(hex[member]);
    }
}



// window applications
const preventDefault = (type) => window.addEventListener(type, e => e.preventDefault());
const addEventListener = (type, handler) => window.addEventListener(type, handler);


// tools

function generateTrimmedText(txt, split){
    var x = [""];

    var i = 0;
    var reset = true;
    for(let ch of txt){
        if(ch==split){
            x.push("");
            i += 1;
            reset = true;
        } else {
            if(reset){
                if(ch!=" " && ch!="\n" && ch!="\t"){
                    reset = false;
                    x[i] += ch;
                }
            } else {
                x[i] += ch;
            }
        }

    }
    return x;
}

function applyAttributesNS(eleNS, attrs){
    if(attrs!=undefined){
        attrs = attrs.split(';');
        for(let attr of attrs){
            if(attr){
                var x = generateTrimmedText(attr, ":");
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
                var x = generateTrimmedText(attr, ":");
                ele.setAttribute(x[0], x[1]);
            }
        }
    }
}  

// html
function createDiv(nodes, cls, uid, style){
    var div = document.createElement('div');
    if(nodes){
        for(let child of nodes){
            div.appendChild(child);
        }
    };
    if(cls){ div.setAttribute('class', cls) };
    if(uid==0 || uid){ div.setAttribute('id', cls.concat("_", uid)) };
    if(style){ div.setAttribute('style', style) };
    return div;
}

function createSvg(nodes, attrs, style){
    var svg = document.createElementNS(svgns, 'svg');
    for(let node of nodes){ svg.appendChild(node) };
    if(attrs){ applyAttributesNS(svg, attrs) };
    if(style){ svg.setAttribute('style', style) };
    return svg;
}

function createButton(nodes, cls, uid, style){
    var btn = document.createElement('button');
    for(let node of nodes){ btn.appendChild(node) };
    if(cls){ btn.setAttribute('class', cls) };
    if(uid==0 || uid){ btn.setAttribute('id', cls.concat("_", uid)) };
    if(style){ btn.setAttribute('style', style) };
    return btn;
}

function createP(txt, cls, uid, style){
    var p = document.createElement('p');
    if(txt){ p.innerText = txt }
    if(cls){p.setAttribute('class', cls)}
    if(uid==0 || uid){ p.setAttribute('id', cls.concat("_", uid)) };
    if(style){p.setAttribute('style', style)}
    return p;
}
    
function createInput(value, placeholder, cls, keydown, keypress, keyup){
    var input = document.createElement('input');
    input.setAttribute('value', value || '');
    input.setAttribute('placeholder', placeholder || '');
    if(keypress!=undefined) input.addEventListener('keypress', keypress);
    if(keydown!=undefined) input.addEventListener('keydown', keydown);
    if(keyup!=undefined) input.addEventListener('keyup', keyup);
    if(cls) input.setAttribute('class', cls);
    return input;
}

function stringAttrs(attrs){
    var string = '';
    var keys = Object.keys(attrs);
    for(let i=0; i<keys.length-1; i++){
      string += `${keys[i]}='${attrs[keys[i]]}' `;
    }
    return string + `${keys[keys.length-1]}='${attrs[keys[keys.length-1]]}'`;
}

// visual

function createSVGURL(svg, components){
    var string = `data:image/svg+xml,%3Csvg ${stringAttrs(svg)}%3E`;
    for(let key of Object.keys(components)){
        for(let component of components[key]){
            
        string += `%3C${key} ${stringAttrs(component)}/%3E`;
        }
    }
    return string + '%3C/svg%3E';
}

function createPath(d, attrs){
    path = document.createElementNS(svgns, 'path');
    if(d!=undefined){ path.setAttributeNS(null, 'd', d) }
    applyAttributesNS(path, attrs);
    return path;
}

function createRect(x, y, w, h, attrs){
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', w);
    rect.setAttributeNS(null, 'height', h);
    applyAttributesNS(rect, attrs);
    return rect;
}

function createLine(x1, y1, x2, y2, attrs){
    var line = document.createElementNS(svgns, 'line');
    line.setAttributeNS(null, 'x1', x1);
    line.setAttributeNS(null, 'y1', y1);
    line.setAttributeNS(null, 'x2', x2);
    line.setAttributeNS(null, 'y2', y2);
    applyAttributesNS(line, attrs);
    return line;
}

function createCircle(cx, cy, r, attrs){
    var c = document.createElementNS(svgns, 'circle');
    if(attrs) applyAttributesNS(c, `cx:${cx}; cy:${cy}; r:${r}; ${attrs ? attrs : ''}`)
    return c;
}

function createPolyline(matrix, attrs){
    var poly = document.createElementNS(svgns, 'polyline');
    if(matrix) poly.setAttributeNS(null, 'points', constructPolyline(matrix));
    applyAttributesNS(poly, attrs);
    return poly;
}
function createPolylineFromRefMat(refMat, start, end, attrs){
    var poly = document.createElementNS(svgns, 'polyline');
    poly.setAttributeNS(null, 'points', constructPolylineFromRefMat(refMat, start, end));
    applyAttributesNS(poly, attrs);
    return poly;
}

  
function generateArcD(cx, cy, r, startAng, endAng){
    
    startAng = absAngle(startAng%DEG360);
    endAng = absAngle(endAng%DEG360);
    
    if(startAng>endAng)
    {
        const temp = startAng;
        startAng = endAng;
        endAng = temp;
    }

    
    return `
        M
        ${cx + r * Math.cos(startAng)}, 
        ${cy + r * Math.sin(startAng)},
        A
        ${r},
        ${r}, 
        0, 
        ${endAng-startAng>DEG180? 0 : 1}, 
        0, 
        ${cx + r * Math.cos(endAng)}, 
        ${cy + r * Math.sin(endAng)} `;       
}

// ARC
function createArc(cx, cy, r, startAng, endAng, attrs){
    const arc = document.createElementNS(svgns, 'path');
    cx = cx || 0;
    cy = cy || 0;
    r = r || 0;
    startAng = startAng || 0;
    endAng = endAng || 0;
    arc.cx = cx;
    arc.cy = cy;
    arc.r = r;
    arc.startAng = startAng;
    arc.endAng = endAng;
    arc.setAttributeNS(null, "d", generateArcD(arc.cx, arc.cy, arc.r, arc.startAng, arc.endAng));
    applyAttributesNS(arc, attrs);
    return arc;
}
function changeArcAngle(arc, startAng, endAng){
    if(!arc) return;
    startAng = startAng || arc.startAng;
    endAng = endAng || arc.endAng;
    arc.startAng = startAng;
    arc.endAng = endAng;
    arc.setAttributeNS(null, "d", generateArcD(arc.cx, arc.cy, arc.r, arc.startAng, arc.endAng));
}
function changeArcPosition(arc, cx, cy){
    if(!arc) return;
    cx = cx || arc.cx;
    cy = cy || arc.cy;
    arc.cx = cx;
    arc.cy = cy;
    arc.setAttributeNS(null, "d", generateArcD(arc.cx, arc.cy, arc.r, arc.startAng, arc.endAng));
}
function translateArcX(arc, deltaX){
    arc.setAttributeNS(null, "d", generateArcD(arc.cx+deltaX, arc.cy, arc.r, arc.startAng, arc.endAng));
}
function translateArcY(arc, deltaY){
    arc.setAttributeNS(null, "d", generateArcD(arc.cx, arc.cy+deltaY, arc.r, arc.startAng, arc.endAng));
}
function changeArcR(arc, r){
    if(!arc || (!r && r!=0)) return;
    arc.r = r;
    arc.setAttributeNS(null, "d", generateArcD(arc.cx, arc.cy, arc.r, arc.startAng, arc.endAng));
}
function changeArcD(arc, cx, cy, r, startAng, endAng){
    if(!arc || (!r && r!=0)) return;
    cx = cx || arc.cx;
    cy = cy || arc.cy;
    r = r || arc.r;
    startAng = startAng || arc.startAng;
    endAng = endAng || arc.endAng;
    arc.cx = cx;
    arc.cy = cy;
    arc.r = r;
    arc.startAng = startAng;
    arc.endAng = endAng;
    arc.setAttributeNS(null, "d", generateArcD(arc.cx, arc.cy, arc.r, arc.startAng, arc.endAng));
}

//text
function createText(nodes, x, y, cls, attrs){
    const text = document.createElementNS(svgns, "text");
    if(nodes){
        for(let node of nodes) text.appendChild(node);
    }
    if(x || x == 0) text.setAttributeNS(null, "x", x);
    if(y || y == 0) text.setAttributeNS(null, "y", y);
    if(cls) text.setAttribute("class", cls);
    applyAttributesNS(text, attrs);
    return text;
}

function createTextSpan(text){
    const textSpan = document.createElementNS(svgns, "tspan");
    if(text) textSpan.innerHTML = text;
    return textSpan;
}


function detectMouseWheelDirection( e ){
    var delta = null, direction = false;
    if ( !e ) { // if the event is not provided, we get it from the window object
        e = window.event;
    }
    if ( e.wheelDelta ) { // will work in most cases
        delta = e.wheelDelta / 60;
    } else if ( e.detail ) { // fallback for Firefox
        delta = -e.detail / 2;
    }
    if ( delta !== null ) {
        direction = delta > 0 ? 1 : -1;
    }

    return direction;
}


// cursor
function createCursorImage(url, scale=1, x=0, y=0, type='pointer'){
    return `-webkit-image-set(url("${url}") ${scale}x) ${x} ${y}, ${type}`;
}

function generateTypographyLogo(fill){
    fill = (fill || "black");
    return ( 
        createSvg(
        [
            createPath("M0 29.3328L5.72205e-05 14.6619L15.183 0L30.3748 0.000457764L0 29.3328Z", `fill: ${fill};`),
            createPath("M0.00821114 49.9158V35.1928L15.1372 20.5829H30.3831L0.00821114 49.9158Z", `fill: ${fill};`),
            createPath("M132.45 26.3121C132.478 24.6957 133.811 23.4081 135.428 23.4364C137.044 23.4646 138.332 24.7978 138.303 26.4143C138.275 28.0308 136.942 29.3183 135.325 29.2901C133.709 29.2619 132.421 27.9286 132.45 26.3121Z", `fill: ${fill};`),
            createPath("M184.815 27.0975L182.617 27.1005L183.718 20.5205L184.815 27.0975Z", "fill: black;"),
            createPath("M32.2109 60H17.019L47.3939 30.6672C47.3939 30.6672 51.4334 38.0861 57.9055 38.0861C64.3776 38.0861 69.6242 32.8394 69.6242 26.3673C69.6242 19.8952 64.3776 14.6486 57.9055 14.6486L32.2567 39.4171H16.9565L47.3857 10.0842H277.143V14.6078H260.336V20.4678H265.855V38.0371H271.625V20.4678H277.143V45.3381H47.3938L32.2109 60ZM129.522 26.3632C129.522 29.5966 132.143 32.2179 135.377 32.2179C138.61 32.2179 141.231 29.5966 141.231 26.3632C141.231 23.1298 138.61 20.5086 135.377 20.5086C132.143 20.5086 129.522 23.1298 129.522 26.3632ZM174.928 38.0898L180.788 38.0817L181.88 31.535H185.555L186.648 38.0898L192.508 38.0537V14.6162L180.788 14.6523L174.928 38.0898ZM237.149 38.0536L243.009 38.0535V26.3266L248.869 38.0536L254.729 38.0453L254.476 14.616H248.869V26.3348L243.009 14.6078L237.149 14.616V38.0536ZM202.763 14.6322L196.903 14.6404V38.0697H202.763L211.544 38.0791L208.623 31.5313H202.763V14.6322ZM93.0643 38.0862L98.9243 38.0779V14.6486H93.0643L87.2043 20.5003L81.3443 14.6404L75.4842 14.6486V38.0861L81.3484 38.0862V23.4297L87.2043 29.2857L93.0643 23.4257V38.0862ZM144.035 32.2179H146.839V26.3632H151.044V24.1677H146.839V22.7041H151.044V20.5086H144.035V32.2179ZM231.297 20.4925L231.289 14.6325L214.466 14.6324V38.0766L231.289 38.0618V32.2018H220.074V29.2825H228.485L231.289 23.4225H220.074V20.4925H231.297ZM121.111 20.5086L121.102 14.6486L104.279 14.6486L104.296 38.0779H121.102V32.2179H109.887V29.2986H121.102L118.298 23.4386H109.887V20.5086H121.111ZM156.656 14.6486V20.5086H162.174V38.0779H167.944V20.5086H173.463L175.293 14.6524L156.656 14.6486Z", `fill: ${fill}; fill-rule: evenodd; clip-rule: evenodd;`),
            createPath("M52.0468 26.3586C52.0468 26.2958 52.0479 26.2332 52.05 26.1709L57.9139 20.508C61.1495 20.5128 63.7227 23.1397 63.7642 26.375C63.7595 29.6107 61.1327 32.1841 57.8973 32.2255C54.6616 32.2208 52.0882 29.594 52.0468 26.3586Z", `fill: ${fill};`)
        ], "fill: none; width: 278; height: 60; viewBox: 0 0 278 60;") 
    );
}

const cursorDs = {
    pen: 'M3.40032 5.31009L4.35521 4.35521M3.40032 5.31009L2.44543 6.26498L9.50087 17.6862L13.3899 18.4826L17.7037 22.7964L22.7964 17.7037L18.4826 13.3899L17.6862 9.44232L6.26498 2.44544L5.31009 3.40032M3.40032 5.31009L1 1L5.31009 3.40032M4.35521 4.35521L5.31009 3.40032M4.35521 4.35521L10.8681 10.8681',
    auto:'M1 19.8041V1L14.5652 14.2965L11.1739 15.6734L9.47826 16.3618L12.5438 23.6231L9.15245 25L6.08696 17.7387L4.3913 18.4272L1 19.8041Z',
    electrify: 'M13 25L13 20.298M13 1L25 12.3778M13 1L13 13.0002M13 1L9.4 4.41333M1 12.3778L9.4 4.41333M13 13.0002V20.298M13 13.0002L9.4 9.40022L9.4 4.41333M13 20.298L16.6 16.8847V9.77355',
    grab: "M13.5166 3.16987V2.95978C13.5166 2.3985 13.3147 1.84606 12.8759 1.51701C12.5259 1.25452 12.0836 1 11.6844 1C11.2853 1 10.843 1.25452 10.4929 1.51701C10.0541 1.84606 9.85224 2.3985 9.85224 2.95978V4.25481M13.5166 3.16987V10.7644M13.5166 3.16987C13.5166 3.16987 14.6422 2.6274 15.2887 2.6274C15.4278 2.6274 15.5797 2.65252 15.7326 2.69195C16.4644 2.88074 16.8591 3.65291 16.8591 4.43444V5.33974M16.8591 5.33974V10.7644M16.8591 5.33974C16.8591 5.33974 17.7831 4.79727 18.4296 4.79727C18.5687 4.79727 18.7206 4.82239 18.8735 4.86182C19.6053 5.05061 20 5.81887 20 6.6004V14.1635C20 16.1893 19.5248 18.2631 18.2961 19.8737C17.3905 21.0607 16.1855 22.2782 14.7652 22.6987C13.1926 23.1643 11.4559 23.0311 9.85224 22.6987C5.31628 21.7586 2.2016 14.0192 2.2016 14.0192C2.2016 14.0192 1.748 12.5544 2.2016 11.8494C2.88199 10.7918 4.2907 11.1954 5.34249 11.8494C5.83831 12.1576 6.38946 12.9343 6.38946 12.9343V5.61878C6.38946 4.78499 6.84364 3.98741 7.62671 3.7958C7.83162 3.74567 8.0372 3.71234 8.22165 3.71234C8.96579 3.71234 9.85224 4.25481 9.85224 4.25481M9.85224 10.7644V4.25481",
    grabbing: "M13.5167 6.16987V5.95978C13.5167 5.3985 13.3148 4.84606 12.876 4.51701C12.5259 4.25452 12.0836 4 11.6845 4C11.2853 4 10.843 4.25452 10.493 4.51701C10.0542 4.84606 9.85228 5.3985 9.85228 5.95978V6.25481M13.5167 6.16987V10.7644M13.5167 6.16987C13.5167 6.16987 14.1561 5.784 14.6146 5.69195C15.0427 5.60601 15.9676 5.66987 16.4676 6.16987C16.8188 6.52101 16.8592 7.33974 16.8592 7.33974M16.8592 7.33974V10.7644M16.8592 7.33974C16.8592 7.33974 17.7831 6.79727 18.4296 6.79727C18.5687 6.79727 18.7207 6.82239 18.8735 6.86182C19.6054 7.05061 20 7.81887 20 8.6004V14.1635C20 16.1893 19.5249 18.2631 18.2962 19.8737C17.3906 21.0607 16.1856 22.2782 14.7652 22.6987C13.1927 23.1643 12.1811 23.0311 10.5774 22.6987C6.04141 21.7586 3.50006 15 3.50006 15C3.50006 15 3.04646 13.5352 3.50006 12.8301C4.18045 11.7725 4.72564 10.1105 5.77744 10.7644C6.27326 11.0727 6.3895 12.9343 6.3895 12.9343V7.61878C6.3895 6.78499 6.84368 5.98741 7.62676 5.7958C7.83166 5.74567 8.03724 5.71234 8.22169 5.71234C8.96584 5.71234 9.85228 6.25481 9.85228 6.25481M9.85228 10.7644V6.25481",
    type: "M12 1V15M12 1H10M12 1H14M12 15H14M12 15H10",
    drag: "M12 1V23M12 1H9M12 1H15M12 23H15M12 23H9M23 12V9M23 12V15M23 12H12L1 12M1 12V15M1 12V9",
    resizeH: "M12 23L12 1M12 23L15 20M12 23L9 20M12 1L9 4M12 1L15 4",
    resizeW: "M1 12L23 12M1 12L4 15M1 12L4 9M23 12L20 9M23 12L20 15",
    pointer: "M16 8.15837C16 8.15837 16.9349 8.01126 17.5 8.15837V8.15837C18.6075 8.44665 19 9.76104 19 10.9054V16.9027C19 17.7623 18.7836 18.6107 18.314 19.3307C17.6114 20.4078 16.4857 21.9499 15.5 22.4751C14.1078 23.2169 11.9 23.0268 10.4505 22.7829C9.49562 22.6221 8.65824 22.0892 8.01624 21.3643L1.80362 14.3491C1.31981 13.8028 1.22384 13.0143 1.56248 12.3679V12.3679C2.05784 11.4223 3.27479 11.1329 4.1428 11.7543L6.5 13.4416V3.96028C6.5 3.28878 6.61727 2.61161 6.98199 2.04779C7.35832 1.46601 7.91419 0.847432 8.5 1.03381V1.03381C9.3687 1.31018 9.5 2.47011 9.5 3.38171V6.7267M16 8.15837C16 8.15837 15.4043 7.83838 15 7.68114C14.2544 7.39122 13 7.20392 13 7.20392M16 8.15837V13.9189M13 7.20392C13 7.20392 12.4142 6.85848 12 6.7267C11.0738 6.43202 9.5 6.7267 9.5 6.7267M13 7.20392V13.4416M9.5 6.7267V13.4416",
    block: "M19.7782 19.7782C24.0739 15.4824 24.0739 8.51759 19.7782 4.22183C15.4824 -0.0739417 8.51759 -0.0739417 4.22183 4.22183C-0.0739417 8.51759 -0.0739417 15.4824 4.22183 19.7782C8.51759 24.0739 15.4824 24.0739 19.7782 19.7782ZM4.66667 17.5019C1.96537 13.9109 2.24921 8.78716 5.51819 5.51819C8.78716 2.24921 13.9109 1.96537 17.5019 4.66667L4.66667 17.5019ZM18.4818 18.4818C21.7508 15.2128 22.0346 10.0891 19.3333 6.49807L6.5 19.3348C10.091 22.0345 15.2134 21.7502 18.4818 18.4818Z",
    zoomIn: "M11 6.5C11 5.94772 10.5523 5.5 10 5.5C9.44771 5.5 9 5.94772 9 6.5V9H6.5C5.94772 9 5.5 9.44771 5.5 10C5.5 10.5523 5.94772 11 6.5 11H9V13.5C9 14.0523 9.44771 14.5 10 14.5C10.5523 14.5 11 14.0523 11 13.5V11H13.5C14.0523 11 14.5 10.5523 14.5 10C14.5 9.44771 14.0523 9 13.5 9H11V6.5M10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C12.125 19 14.078 18.2635 15.6177 17.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L17.0319 15.6177C18.2635 14.078 19 12.125 19 10C19 5.02944 14.9706 1 10 1ZM3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10Z"
};

const cursorImages = {
    pen: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 32 32', 'fill': 'none'}, {'path': [{
        'd': cursorDs.pen,
        'stroke': 'white',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': `2px`}]}), 1, 0, 0, 'pointer'),
    'pen-tool': createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 32 32', 'fill': 'none'}, {'path': [{
        'd': cursorDs.pen,
        'stroke': 'white',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': `2px`}]}), 1, 0, 0, 'pointer'),
    block: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 32 32', 'fill': 'none'}, {'path': [{
        'd': cursorDs.block,
        'fill': 'white',
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd'}]}), 1, 8, 8, 'pointer'),
    zoomIn: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 32 32', 'fill': 'none'}, {'path': [{
        'd': cursorDs.zoomIn,
        'fill': 'white',
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd'}]}), 1, 8, 8, 'pointer'),

    auto: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 32 32', 'fill': 'none'}, {'path': [{
        'd': cursorDs.auto,
        'stroke': 'white',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': `2px`}]}), 1, 0, 0, 'pointer'),
    electrify: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 32 32', 'fill': 'none'}, {'path': [{
        'd': cursorDs.electrify,
        'stroke': 'white',
        'stroke-width': `2px`}]}), 1, 12, 0, 'pointer'),
    grab: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 32 32', 'fill': 'none'}, {'path': [{
        'd': cursorDs.grab, 'stroke': 'white',
        'stroke-width': `2px`}]}), 1, 12, 0, 'pointer'),
    grabbing: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 32 32', 'fill': 'none'}, {'path': [{
        'd': cursorDs.grabbing, 'stroke': 'white',
        'stroke-width': `2px`}]}), 1, 12, 0, 'pointer'),
    type: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 24 24', 'fill': 'none'}, {'path': [{
        'd': cursorDs.type, 'stroke': 'white',
        'stroke-width': `2px`}]}), 1, 12, 6, 'pointer'),
    drag: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 24 24', 'fill': 'none'}, {'path': [{
        'd': cursorDs.drag, 'stroke': 'white',
        'stroke-width': `2px`}]}), 1, 11, 11, 'pointer'),
    resizeH: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 24 24', 'fill': 'none'}, {'path': [{
        'd': cursorDs.resizeH, 'stroke': 'white',
        'stroke-width': `2px`}]}), 1, 12, 0, 'pointer'),
    resizeW: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 24 24', 'fill': 'none'}, {'path': [{
        'd': cursorDs.resizeW, 'stroke': 'white',
        'stroke-width': `2px`}]}), 1, 12, 0, 'pointer'),
    pointer: createCursorImage(
        createSVGURL({'xmlns': svgns, 'width': 24, 'height': 24, 'viewBox': '0 0 24 24', 'fill': 'none'}, {'path': [{
        'd': cursorDs.pointer, 'stroke': 'white',
        'stroke-width': `2px`}]}), 1, 12, 0, 'pointer'),

};



function blinkSVGComp(comp, freq, endF){
    if(comp.blinkSVGCompRunning) return;
    comp.blinkSVGCompRunning = true;
    const period = 1000/freq;
    const f = t => -((2*t - 1)**2) + 1;
    const v0 = 1;
    const startT = new Date().getTime();
    var t = 0;

    const blink = () => {
        if(endF()) {
            comp.setAttributeNS(null, "opacity", v0);
            comp.blinkSVGCompRunning = false;
            return;
        }

        t = new Date().getTime() - startT;
        if(t >= period) {
            comp.setAttributeNS(null, "opacity", v0);
            comp.blinkSVGCompRunning = false;
            blinkSVGComp(comp, freq, endF);
            return;
        }
        comp.setAttributeNS(null, "opacity", f(t/period)*v0);
        setTimeout(blink, 100/6);
    }

    blink();
}

function rotateCursorImageWithPathD(label){
    constructPathMatrix
}