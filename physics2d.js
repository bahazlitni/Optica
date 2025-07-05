function lambdaToRGBA(x, blend=1){
    const f = (x, a) => (1+sinoid(x*a))/2;
    const mid = i => i[0] + (i[1]-i[0])/2;
    const limitRed = 740;
    const limitViolet = 380;
    const ired    = [640, 780];
    const iorange = [610, 640];
    const iyellow = [570, 610];
    const igreen  = [520, 570];
    const icyan   = [490, 520];
    const iblue   = [430, 490];
    const iviolet = [360, 420];


    //red
    const rx1 = mid(iyellow);
    const rx2 = limitRed;
    const rx3 = mid(iviolet);
    const rx4 = iviolet[0];
    const rg1 = Math.abs((rx1-mid(igreen))/2);

    const rg2 = Math.abs( (rx2-ired[1])/2);
    const rg3 = Math.abs( (rx3-iviolet[0])/2);
    const rg4 = Math.abs( (rx4-mid(iviolet))/2 );
    const R = ( f(-(x-rx1+rg1)/rg1, 4/blend)) - f(-(x-rx2-rg2)/rg2, 3/blend)*2/3 + 
    (f((x-rx3-rg3)/rg4, 2/blend) - f((x-rx4-rg4)/rg4, 2/blend))*2/3;

    //blue
    const bx1 = mid(icyan);
    const bg1 = Math.abs(bx1-mid(igreen))/2;
    const bx2 = mid(iviolet);
    const bg2 = Math.abs( (bx2-iviolet[0])/2 );
    const B = f((x-bx1-bg1)/bg1, 2/blend) - f((x-bx2)/bg2, 2/blend)*0.5;

    //green
    const gx1 = mid(iblue);
    const gx2 = mid(iorange);
    const gg1 = Math.abs(gx1-mid(icyan))/2;
    const gg2 = Math.abs(gx2-mid([mid(igreen), mid(iyellow)]))/2;
    const G = 1-(f((x-gx1)/gg1, 2/blend) + f(-(x-gx2)/gg2, 2/blend));


    //alpha
    const ax1 = limitViolet;
    const ax2 = limitRed;
    const ag1 = Math.abs(ax1-iviolet[0])/2;
    const ag2 = Math.abs(ax2-ired[1])/2;
    const A = 1-(f((x-ax1+ag1/2)/ag1, 2) + f(-(x-ax2-ag2/2)/ag2, 2));

    return [R*255, G*255, B*255, A];
}