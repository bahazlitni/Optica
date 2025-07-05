class Dialog {
    static defaults = {
        getBgColor: dialog => [ 
            dialog.env.color[0]+20, 
            dialog.env.color[1]+20, 
            dialog.env.color[2]+20, 
            dialog.env.color[3]+20,  
        ]
    }
    constructor(env, default_display, setup){
        this.env = env;
        this.bgColor = [0, 0, 0, 0];

        this.isDisplayable = true;

        this.cursor = env.cursor;
        this.html = createDiv();
        this.default_display = default_display;
        this.env.html.appendChild(this.html);

        if(setup){
            this.changeColor();
        }
        
    }

    toggleDisplay(){
        if(this.html.style.display == 'none') this.display();
        else this.undisplay();
    }
    display(){
        if(this.isDisplayable) this.html.style.display = this.__default_display;
    }
    undisplay(){
        this.__default_display = this.html.style.display;
        this.html.style.display = 'none';
    }

    changeColor(color){
        color = color || Dialog.defaults.getBgColor(this);
        this.bgColor[0] = color[0];
        this.bgColor[1] = color[1];
        this.bgColor[2] = color[2];
        this.bgColor[3] = color[3];

        this.html.style.backgroundColor = styleColor(this.bgColor);
    }
}