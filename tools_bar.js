class ToolsBar extends Dialog {
    static traceBeamD = "M4.04694 0.490753C5.92452 0.490753 7.44653 2.01281 7.44653 3.89035C7.44653 4.45771 7.30755 4.99261 7.06178 5.46285L17.1007 15.5018L19.4414 13.1611L21.1549 19.556L30.6752 29.0763C31.1455 28.8305 31.6804 28.6915 32.2477 28.6915C34.1253 28.6915 35.6473 30.2136 35.6473 32.0911C35.6473 33.9687 34.1253 35.4907 32.2477 35.4907C30.3702 35.4907 28.8481 33.9687 28.8481 32.0911C28.8481 31.5238 28.9871 30.9889 29.2329 30.5186L19.7126 20.9984L13.3177 19.2848L15.6584 16.9441L5.61945 6.90518C5.14921 7.15096 4.61431 7.28995 4.04694 7.28995C2.16936 7.28995 0.647339 5.76789 0.647339 3.89035C0.647339 2.01281 2.16936 0.490753 4.04694 0.490753ZM4.04694 5.93011C5.17347 5.93011 6.08669 5.01688 6.08669 3.89035C6.08669 2.76382 5.17347 1.85059 4.04694 1.85059C2.9204 1.85059 2.00718 2.76382 2.00718 3.89035C2.00718 5.01688 2.9204 5.93011 4.04694 5.93011ZM32.2477 34.1309C33.3743 34.1309 34.2875 33.2177 34.2875 32.0911C34.2875 30.9646 33.3743 30.0514 32.2477 30.0514C31.1212 30.0514 30.208 30.9646 30.208 32.0911C30.208 33.2177 31.1212 34.1309 32.2477 34.1309Z";
    static mirrorEdittingD = "M27.704 0.395386L29.2513 0.852672L28.8992 2.04421L31.7762 2.89447L31.4928 3.85346L28.6158 3.00321L28.0288 4.98933L30.9058 5.83959L30.6224 6.79858L27.7454 5.94833L27.1584 7.93434L30.0354 8.78459L29.752 9.74359L26.875 8.89333L26.2881 10.8795L29.165 11.7297L28.8816 12.6887L26.0046 11.8385L25.4177 13.8245L28.2947 14.6747L28.0113 15.6337L25.1343 14.7835L24.5473 16.7696L27.4243 17.6198L27.1409 18.5788L24.2639 17.7286L23.677 19.7146L26.5539 20.5648L26.2705 21.5238L23.3935 20.6736L22.8066 22.6597L25.6836 23.51L25.4001 24.469L22.5231 23.6187L21.9362 25.6047L24.8132 26.455L24.5298 27.414L21.6528 26.5637L21.0658 28.5498L23.9428 29.4001L23.6594 30.3591L20.7824 29.5088L20.1955 31.4948L23.0725 32.3451L22.789 33.3041L19.912 32.4538L19.3251 34.44L22.2021 35.2902L21.9186 36.2492L19.0417 35.399L18.4547 37.385L21.3317 38.2352L21.0483 39.1942L18.1713 38.344L17.8192 39.5354L16.2719 39.0782L21.7593 20.5104L5.29589 29.4626L6.2598 31.2353L0.583496 31.0902L3.54731 26.2469L4.52512 28.0451L21.2821 18.9333L12.4183 2.63248L13.8358 1.86172L22.5399 17.869L27.704 0.395386Z";
    static wallEdittingD = "M0 14.0704L0.507997 12.1527L14.9427 16.065L15.6403 17.286L14.4347 17.9826L0 14.0704M23.9946 0.560028L26.3644 1.20233L23.2873 12.8184L20.2845 14.5657L23.9946 0.560028M17.4745 34.7616L15.1047 34.1193L18.32 21.9817L20.0558 25.0173L17.4745 34.7616M16.5288 14.8668L17.7712 14.1412L19.5646 17.283L22.6707 15.4691L23.388 16.7258L20.2819 18.5398L22.0752 21.6815L20.8327 22.4071L19.0395 19.2653L15.9334 21.0793L15.2161 19.8225L18.3221 18.0086L16.5288 14.8668Z"
    static convThinLensD = "M2.99999 31L4 32L3.99731 3L3.00002 4H1.00509L4.99994 0.00514984L8.99479 4H7.00002L6.00009 3L6.00249 32L7 31H9.00001L5.00001 35L0.998657 31L2.99999 31Z";
    static divThinLensD = "M12 0.0051527L7.00256 5.00258L7.00256 29.9973L11.9999 34.9946H10L6 31L2.0054 34.9946H0L4.9973 29.9973L4.9973 5.00258L-0.00012207 0.0051527L2.00514 0.0051527L5.99999 4L9.99483 0.0051527L12 0.0051527Z";
    static concSphericalMirrorD = "M4.49731 4.49731L4.5 33.4973L0.999916 36.9974H3.0024L6.50249 33.4973L6.50228 33H8.5V32H6.5022L6.50203 30H8.5V29H6.50195L6.50178 27H8.5V26H6.5017L6.50154 24H8.5V23H6.50145L6.50129 21H8.5V20H6.5012L6.50104 18H8.5V17H6.50096L6.50079 15H8.5V14H6.50071L6.50054 12H8.5V11H6.50046L6.5003 9H8.5V8H6.50021L6.50014 6L8.5 6V5L6.50011 5L6.50009 4.50009L2 0L0 0L4.49731 4.49731Z";
    static opticalAxisD = "M35 1.85373L28.646 0.604286L30.1891 3.29998L16.6561 11.1805L16.3272 10.606L15.2862 11.2122L15.6151 11.7867L0 20.8796L1.1984 22.9732L16.8135 13.8803L17.1076 14.394L18.1486 13.7878L17.8545 13.2741L24.5 9.40429L31.3875 5.39356L32.8958 8.02849L35 1.85373Z";
    static btnActiveColor = selectionColor;
    static realObjectD = "M20.9983 39.5H18.9983V11.44L12.4125 18.2411L10.9983 16.7807L19.9983 7.48639L28.9983 16.7807L27.5841 18.2411L20.9983 11.44V39.5M8.00171 9.79427V0.5H11.6346C12.3021 0.5 12.8589 0.601354 13.3049 0.804061C13.7509 1.00677 14.0861 1.28814 14.3106 1.64817C14.535 2.00518 14.6473 2.41664 14.6473 2.88257C14.6473 3.24562 14.5764 3.56481 14.4346 3.84013C14.2928 4.11242 14.0979 4.33631 13.8498 4.51179C13.6047 4.68424 13.3241 4.80677 13.008 4.87938V4.97015C13.3536 4.98527 13.677 5.08512 13.9783 5.26967C14.2825 5.45422 14.5291 5.7129 14.7182 6.0457C14.9072 6.37548 15.0017 6.76879 15.0017 7.22564C15.0017 7.7188 14.8821 8.159 14.6428 8.54626C14.4066 8.9305 14.0566 9.23456 13.5928 9.45845C13.1291 9.68233 12.5576 9.79427 11.8783 9.79427H8.00171ZM9.92006 8.18774H11.484C12.0186 8.18774 12.4085 8.08337 12.6536 7.87461C12.8988 7.66282 13.0213 7.38145 13.0213 7.0305C13.0213 6.77333 12.9608 6.54642 12.8397 6.34977C12.7186 6.15311 12.5458 5.99881 12.3213 5.88687C12.0998 5.77492 11.8355 5.71895 11.5283 5.71895H9.92006V8.18774ZM9.92006 4.38926H11.3422C11.6051 4.38926 11.8384 4.34236 12.0422 4.24857C12.249 4.15175 12.4114 4.01561 12.5296 3.84013C12.6507 3.66465 12.7112 3.45438 12.7112 3.20932C12.7112 2.87349 12.5945 2.60271 12.3612 2.39698C12.1308 2.19124 11.803 2.08838 11.3777 2.08838H9.92006V4.38926M25.8816 39.5H23.9983L26.8679 30.2057H29.1327L31.9983 39.5H30.115L29.4995 37.3806H26.4982L25.8816 39.5ZM27.9678 32.3296H28.0328L29.0541 35.8467H26.9445L27.9678 32.3296Z"
    static diopterD = "M4.63474 24.4899C9.31735 11.4275 27.1589 19.967 27.3652 8.89627M4.63474 24.4899C2.6273 24.4899 1 26.1024 1 28.0915C1 30.0806 2.62735 31.6931 4.63478 31.6931C6.64222 31.6931 8.26957 30.0806 8.26957 28.0915C8.26957 26.1024 6.64217 24.4899 4.63474 24.4899ZM27.3652 8.89627C29.3727 8.89627 31 7.28381 31 5.29471C31 3.3056 29.3727 1.69312 27.3652 1.69312C25.3578 1.69312 23.7304 3.3056 23.7304 5.29471C23.7304 7.28381 25.3578 8.89627 27.3652 8.89627Z"

    constructor(env){
        super(env, "flex", true);
        this.buttonsContainer = createDiv([], 'tools_bar_buttons_container')

        this.betaVersionText = createP('Beta Version - 0.0.3 BY BAHA ZLITNI')
        this.betaVersionText.style.marginRight = '5%'

        this.html.appendChild(this.buttonsContainer)
        this.html.appendChild(this.betaVersionText)
        this.html.setAttribute("class",  "tools_bar");
        this.buttons = [];

        this.lightTracerColor = [255, 200, 25, 1];
        this.lightTracerWidth = 2;
        this.mirrorBuilderColor = [100, 255, 100, 1];

        this.__lastActivatedMode = "default";

        this.traceBeamButton = createButton([
            createSvg([
                createPath(
                    ToolsBar.traceBeamD, 
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white; stroke: none;")
            ], "fill: none; width: 36; height: 36; viewBox: 0 0 36 36;"),
        ], "tools_bar_button", null);
        this.addMirrorButton = createButton([
            createSvg([
                createPath(
                    ToolsBar.mirrorEdittingD, 
                    "fill: white;")
            ], "fill: none; width: 32; height: 40; viewBox: 0 0 32 40;"),
        ], "tools_bar_button", null);
        this.addWallButton = createButton([
            createSvg([
                createPath(
                    ToolsBar.wallEdittingD, 
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;")
            ], "fill: none; width: 27; height: 35; viewBox: 0 0 27 35;"),
        ], "tools_bar_button", null);

        this.addThinLens = createButton([
            createSvg([
                createPath(
                    ToolsBar.convThinLensD, 
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;")
            ], "fill: none; width: 9; height: 35; viewBox: 0 0 9 35;"),
        ], "tools_bar_button", null);

        
        this.addSphericalMirror = createButton([
            createSvg([
                createPath(
                    ToolsBar.concSphericalMirrorD, 
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;")
            ], "fill: none; width: 9; height: 37; viewBox: 0 0 9 37;"),
        ], "tools_bar_button", null);


        this.addRealObject = createButton([
            createSvg([
                createPath(
                    ToolsBar.realObjectD, 
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;")
            ], "fill: none; width: 40; height: 40; viewBox: 0 0 40 40;"),
        ], "tools_bar_button", null);

        
        this.addDiopter = createButton([
            createSvg([
                createPath(
                    ToolsBar.diopterD, 
                    "stroke-width: 2; stroke: white;")
            ], "fill: none; width: 32; height: 33; viewBox: 0 0 32 33;"),
        ], "tools_bar_button", null);

        /*this.addOpticalAxis = createButton([
            createSvg([
                createPath(
                    "M9.21506 0.606195L10.2561 0L12.0774 3.1818L11.0364 3.788L9.21506 0.606195Z",
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;"),
                createPath(
                    "M24.2197 24.3938L23.1787 25L21.3574 21.8182L22.3984 21.212L24.2197 24.3938Z",
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;"),
                createPath(
                    "M13.2916 5.303L12.2506 5.90919L14.072 9.091L15.113 8.4848L13.2916 5.303Z",
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;"),
                createPath(
                    "M19.3628 15.909L18.3218 16.5152L20.1431 19.697L21.1841 19.0908L19.3628 15.909Z",
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;"),
                createPath(
                    "M24.5 9.40429L26.1112 10.3425L24.5 11.2807V9.40429Z",
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;"),
                createPath(
                    ToolsBar.opticalAxisD,
                    "fill-rule: evenodd; clip-rule: evenodd; fill: white;"),
                    
            ], "fill: none; width: 35; height: 25; viewBox: 0 0 35 25;"),
        ], "tools_bar_button", null);
        this.addButton(this.addOpticalAxis, OpticalAxis.label);*/

        this.addButton(this.traceBeamButton, Light.label);
        this.addButton(this.addMirrorButton, Mirror.label);
        this.addButton(this.addWallButton, Wall.label);
        this.addButton(this.addThinLens, ThinLens.label);
        this.addButton(this.addSphericalMirror, SphericalMirror.label);
        this.addButton(this.addRealObject, RealObject.label);
        this.addButton(this.addDiopter, Diopter.label);
    }

    addButton(btn, mode){
        this.buttonsContainer.appendChild(btn);
        this.buttons.push(btn);
        btn.addEventListener("click", e => this.toggleButton(btn, mode));
        btn.addEventListener("mouseover", e => this.env.cursorSystem.setTempImage("pointer"));
        btn.addEventListener("mouseleave", e => this.env.cursorSystem.setTempImage(this.env.cursorSystem.cursor.pointer));
    }

    toggleButton(btn, mode){
        if(this.__lastActivatedButton){
            this.__lastActivatedButton.style.backgroundColor = "transparent";
            if( btn == this.__lastActivatedButton ){
                this.__lastActivatedButton = null;
                this.env.cursorSystem.setMode("default");
                return;
            }
        }
        btn.style.backgroundColor = ToolsBar.btnActiveColor;
        this.__lastActivatedButton = btn;
        this.env.cursorSystem.setMode(mode);
    }
    
    updateColor(){
        this.html.style.backgroundColor = styleColor(color || [0, 0, 0, 1]);
    }
}