class UndoRedoNode {
    constructor(){
        this.prev = null;
        this.next = null;
        this.redo = null;
        this.undo = null;
        this.forget = null;
    }
    delete(){
        delete this.prev;
        delete this.next;
        delete this.redo;
        delete this.undo;
        delete this.forget;
    }
}

class UndoRedoStack {
    constructor(limit){
        this.start = null; // quick access for the start
        this.head  = null;
        this.length = 0;

        this.stack   = () => null;
        this.unstack = () => null;
        this.setLimit(limit);
    }
    setLimit(limit){
        if(!limit || limit<0){
            this.unstack = () => null;
            this.stack   = () => null;
            this.isEmpty = () => true;
            this.isFull  = () => true;
        }
        else {
            this.unstack = this.__unstack;
            this.isEmpty = this.__isEmpty;
            
            if(isFinite(limit)){
                this.stack   = this.__stackWithLimit;
                this.isFull  = this.__isFull;
            }
            else {
                this.stack   = this.__stackWithoutLimit;
                this.isFull  = () => false;
            }
        }
    }


    __isEmpty(){
        return this.length==0;
    }
    __isFull(){
        return this.length==this.limit;
    }
    __stackWithoutLimit({undo, redo, forget}){
        const newNode = new UndoRedoNode();
        const prev = this.head;

        newNode.undo = undo;
        newNode.redo = redo;
        newNode.prev = prev;
        newNode.forget = forget;

        if(this.isEmpty()) this.start = newNode;
        else prev.next = newNode;

        this.head = newNode;
        this.length++;
    }
    __stackWithLimit({undo, redo, forget}){
        if(this.isFull()){ 
            //something iteresting happens when it's full.
            // the start moves next. It's like unstacking from the start.
            const next = this.start.next;
            this.start.delete();
            this.start = next;
            this.start.prev = null;
            this.length--;
        } 
        this.__stackWithoutLimit({undo, redo, forget});
    }
    __unstack(){
        if(this.isEmpty()) return null;
        const undo = this.head.undo; // pointing to current data
        const redo = this.head.redo; // pointing to current data
        const prev = this.head.prev; // pointing to current previous node
        const forget = this.head.forget;

        // deleting the current node
        this.head.delete();

        if(prev) prev.next = null;
        this.head = prev;
        
        this.length--;
        return {undo: undo, redo: redo, forget: forget};
    }
    reset(){
        while(!this.isEmpty()) this.unstack().forget();
        this.start = null;
        this.head  = null;
        this.length = 0;
    }
}


class UndoRedoSystem {
    constructor(limit){
        this.undoStack = new UndoRedoStack();
        this.redoStack = new UndoRedoStack(Infinity);
        this.setLimit(limit);
    }
    stackUndo({undo, redo, forget}){
        this.undoStack.stack({undo, redo, forget: forget || (() => null)});
        this.redoStack.reset();
    }
    undo(){
        if(this.undoStack.isEmpty()) return;
        const apply = this.undoStack.unstack();
        apply.undo();
        this.redoStack.stack(apply);
    }
    redo(){
        if(this.redoStack.isEmpty()) return;
        const apply = this.redoStack.unstack();
        apply.redo();
        this.undoStack.stack(apply);
    }
    setLimit(l){
        this.undoStack.setLimit(l);
    }
}