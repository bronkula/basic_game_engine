

export const drawCircle = (ctx,x,y,r,a1,a2,options) => {
    Object.assign(ctx,options);
    ctx.beginPath();
    ctx.arc(x,y,r,a1,a2);
    ctx.closePath();
    ctx.fill();
}

export const drawRect = (ctx,x,y,w,h,options) => {
    Object.assign(ctx,options);
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
}