var mousePressing = false;
const keyCodesMap = {};
var mouseX = 0;
var mouseY = 0;

document.body.onkeydown = e => {
    for(let keyCode in keyCodesMap){
        if(e.key == keyCode || e.code == keyCode){
            for(let i = keyCodesMap[keyCode].length-1; i>-1; i--){
                const keyDownMacro = keyCodesMap[keyCode][i];
                if( keyDownMacro.repetitive || !keyDownMacro.acted ) keyDownMacro.act(e);
                keyDownMacro.acted = true;
                keyDownMacro.stopped = false;
                if( keyDownMacro.unique) return;
            }
        }
    }
};
document.body.onkeyup = e => {
    for(let keyCode in keyCodesMap){
        if(e.key == keyCode || e.code == keyCode){
            for(let i = keyCodesMap[keyCode].length-1; i>-1; i--){
                const keyDownMacro = keyCodesMap[keyCode][i];
                keyDownMacro.stop(e);
                keyDownMacro.acted = false;
                keyDownMacro.stopped = true;
                if( keyDownMacro.unique) return;
            }
        }
    }
};



function eventSetter(eventName, eventFunc, prio){
    if(eventFunc){
        mouseEventsCache[eventName].push(eventFunc);
        eventFunc.prio = prio || false;
    }
}
function eventRemover(eventName, event){
    mouseEventsCache[eventName] = removeFromList(mouseEventsCache[eventName], event);
}

const setKeyDown = fevent => eventSetter("keydown", event);
const removeKeyDown = event => eventRemover("keydown", event);

class KeyDownMacro {
    constructor(keyCode, act, stop, unique, repetitive){
        this.keyCode = keyCode || "";
        this.act = act || ( e => null );
        this.stop = stop || ( e => null );
        this.unique = unique || false;
        this.repetitive = repetitive || false;
        this.acted = false;
        this.stopped = true;
    }
}

function addKeyDownMacro(keyDownMacro) {
    if(!keyCodesMap[keyDownMacro.keyCode]) keyCodesMap[keyDownMacro.keyCode] = [];
    keyCodesMap[keyDownMacro.keyCode].push(keyDownMacro);
}
function removeKeyDownMacro(keyDownMacro){
    keyCodesMap[keyDownMacro.keyCode] = removeFromList(keyCodesMap[keyDownMacro.keyCode], keyDownMacro);
}


function resetKeyDownMacro(keyCode){
    keyCodesMap[keyCode].acted = false;
    keyCodesMap[keyCode].stopped = true;
}