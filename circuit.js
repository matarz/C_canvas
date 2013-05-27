var canvas = document.getElementById('drawArea');
var ctx = canvas.getContext('2d');

//setting variables
var colors = {off:"rgba(200,200,200,1)", hot:"rgba(255,0,0,.6)", cold:"rgba(0,0,255,.6)", stroke:"rgba(0,0,0,.8)"};
var cSwitch = {radius:30, lineWidth:4, status:"off"};
cSwitch.sideWiresLen = cSwitch.radius/2 + 2
cSwitch.center = {x:canvas.width/2, y:canvas.height-80};
setPos(cSwitch, cSwitch.center.x - cSwitch.radius, cSwitch.center.x + cSwitch.radius, cSwitch.center.y - cSwitch.radius, cSwitch.center.y + cSwitch.radius);

var bottomR = {width:130, height:10};
var hw = cSwitch.lineWidth/2 - cSwitch.sideWiresLen;
setPos(bottomR, cSwitch.right + hw, cSwitch.right + hw + bottomR.width, cSwitch.center.y-(bottomR.height/2), cSwitch.center.y+(bottomR.height/2));

var bottomL = {width:bottomR.width, height:bottomR.height};
setPos(bottomL, cSwitch.left - (hw + bottomL.width), cSwitch.left - hw, cSwitch.center.y-(bottomL.height/2), cSwitch.center.y+(bottomL.height/2));

var switchArm = {angle:-30, x:bottomL.right-3, y:bottomL.top+2, width:bottomR.left-bottomL.right, height:4};

var rightR = {width:bottomR.height, height:270};
setPos(rightR, bottomR.right, bottomR.right+rightR.width, bottomR.bottom-rightR.height, bottomR.bottom);

var leftR = {width:bottomR.height, height:rightR.height};
setPos(leftR, bottomL.left-leftR.width, bottomL.left, bottomL.bottom-leftR.height, bottomL.bottom);

var topR = {width:140, height:bottomR.height};
setPos(topR, rightR.left - topR.width, rightR.left, rightR.top, rightR.top+topR.height);

var topL = {width:topR.width, height:bottomR.height};
setPos(topL, leftR.right, leftR.right+topL.width, leftR.top, leftR.top+topL.height);

//Hot wire
var halfR = cSwitch.radius/2;
var hotWire = {color:colors.hot, width:4, height:50};
hotWire.circle = {radius:4, x:cSwitch.center.x-halfR, y:cSwitch.center.y+halfR};
setPos(hotWire, hotWire.circle.x-(hotWire.width/2), hotWire.left + hotWire.width, hotWire.circle.y+(hotWire.circle.radius/2), hotWire.top + hotWire.height);

//Cold wire
var coldWire = {color:colors.cold, width:hotWire.width, height:hotWire.height};
coldWire.circle = {radius:hotWire.circle.radius, x:cSwitch.center.x+halfR, y:hotWire.circle.y};
setPos(coldWire, coldWire.circle.x-(coldWire.width/2), coldWire.left + coldWire.width, coldWire.circle.y+(coldWire.circle.radius/2), coldWire.top + coldWire.height);

var bulb, intHandle;
var flow = {x:bottomL.right, y:bottomL.top, xInc:-2, yInc:0, step:2, color:colors.hot, passedCircle:true};

canvas.addEventListener("click", clickRespond, false);


draw();
function draw(){
    drawAll();
    drawBulb();
    drawArm();
}


function drawSwitchCircle(){
    //circle
    ctx.beginPath();
    ctx.arc(cSwitch.center.x, cSwitch.center.y, cSwitch.radius, 0, Math.PI * 2, true);
    ctx.lineWidth = cSwitch.lineWidth;
    ctx.strokeStyle = colors.stroke;
    ctx.stroke();
    ctx.closePath();
}

function drawAll(){
   //bottom-right
    dRect(bottomR.left, bottomR.top, bottomR.width, bottomR.height, colors.off);

    //bottom-left
    dRect(bottomL.left, bottomL.top, bottomL.width, bottomL.height, colors.off);

    //right rect
    dRect(rightR.left, rightR.top, rightR.width, rightR.height, colors.off);

    //left rect
    dRect(leftR.left, leftR.top, leftR.width, leftR.height, colors.off);

    //top-right
    dRect(topR.left, topR.top, topR.width, topR.height, colors.off);

    //top-Left
    dRect(topL.left, topL.top, topL.width, topL.height, colors.off);

    //hot wire circle
    ctx.beginPath();
    ctx.arc(hotWire.circle.x, hotWire.circle.y, hotWire.circle.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = hotWire.color;
    ctx.fill();
    ctx.closePath();
    //wire
    dRect(hotWire.left, hotWire.top, hotWire.width, hotWire.height, hotWire.color);

    //cold wire circle
    ctx.beginPath();
    ctx.arc(coldWire.circle.x, coldWire.circle.y, coldWire.circle.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = coldWire.color;
    ctx.fill();
    ctx.closePath();
    //wire
    dRect(coldWire.left, coldWire.top, coldWire.width, coldWire.height, coldWire.color);

    drawSwitchCircle();

}

function drawBulb(){
    bulb = new Image();
    bulb.onload = function() {
        bulb.resizeFactor = bulb.width/60;
        bulb.width /= bulb.resizeFactor;
        bulb.height /= bulb.resizeFactor;
        bulb.off = {x:cSwitch.center.x - bulb.width/2, y:topL.top-bulb.height};
        ctx.drawImage(bulb, bulb.off.x, bulb.off.y, bulb.width, bulb.height);
    };
    bulb.src = "bulbOff.jpg";
}

function drawArm(){
    ctx.save();
    ctx.translate(switchArm.x,switchArm.y)   //make switch arm xy center of rotation
    ctx.rotate(switchArm.angle * Math.PI/180);             //rotate view
    ctx.translate(-switchArm.x,-switchArm.y) //return center to normal
    ctx.beginPath();
    ctx.fillStyle = colors.stroke;
    ctx.fillRect(switchArm.x, switchArm.y, switchArm.width+6, switchArm.height);
    ctx.closePath();
    ctx.restore();
}

function aniArm(){
    ctx.clearRect(0, topL.top, canvas.width, canvas.height);
    drawAll();
    ++switchArm.angle;
    drawArm();
    if(switchArm.angle>-10){
        clearInterval(intHandle);
        intHandle = setInterval(aniBottomL, 20);
    }
}

function aniBottomL(){
    if(flow.passedCircle && flow.x < cSwitch.left){
        drawArm();
        drawSwitchCircle();
        flow.passedCircle = false;
    }

    dRect(flow.x - flow.step, flow.y, flow.step, bottomL.height, flow.color)
    flow.x -= flow.step;

    if(flow.x <= bottomL.left-leftR.width){
        clearInterval(intHandle);
        intHandle = setInterval(aniLeftR, 20);
    }
}

function aniLeftR(){
    dRect(flow.x, flow.y - flow.step, leftR.width , flow.step, flow.color)
    flow.y -= flow.step;

    if(flow.y <= leftR.top){
        clearInterval(intHandle);
        intHandle = setInterval(aniTopL, 20);
    }
}

function aniTopL(){
    dRect(flow.x + flow.step, flow.y, flow.step, topL.height, flow.color)
    flow.x += flow.step;

    if(flow.x >= topL.right){
        clearInterval(intHandle);
        flow.x = topR.left-flow.step;
        flow.color = colors.cold;
        bulb.src = "bulbOn.jpg";
        intHandle = setInterval(aniTopR, 20);
    }
}

function aniTopR(){
    dRect(flow.x + flow.step, flow.y, flow.step, topR.height, flow.color)
    flow.x += flow.step;

    if(flow.x+flow.step >= topR.right + rightR.width){
        flow.x = rightR.left;
        clearInterval(intHandle);
        intHandle = setInterval(aniRightR, 20);
    }
}

function aniRightR(){
    dRect(flow.x, flow.y + flow.step, rightR.width , flow.step, flow.color)
    flow.y += flow.step;

    if(flow.y+flow.step >= bottomR.bottom){
        flow.y = bottomR.top;
        flow.passedCircle = true;
        clearInterval(intHandle);
        intHandle = setInterval(aniBottomR, 20);
    }
}

function aniBottomR(){
    if(flow.passedCircle && flow.x < cSwitch.right){
        drawSwitchCircle();
        flow.passedCircle = false;
    }
    dRect(flow.x - flow.step, flow.y, flow.step, bottomR.height, flow.color)
    flow.x -= flow.step;

    if(flow.x <= bottomR.left){
        drawArm();
        clearInterval(intHandle);
    }
}



function clickRespond(e){
    var p = clickPos(e);
    if(p[0] < cSwitch.left || p[0] > cSwitch.right || p[1] > cSwitch.bottom || p[1] < cSwitch.top)
        return;

    if (cSwitch.status == "off"){
        cSwitch.status = "on";
        intHandle = setInterval(aniArm, 20);
    }else{  //turn off
        clearInterval(intHandle);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        switchArm.angle = -30;
        flow.x = bottomL.right;
        flow.y = bottomL.top;
        flow.xInc = -2;
        flow.yInc = 0;
        flow.step = 2;
        flow.color = colors.hot;
        flow.passedCircle = true;

        draw();
        cSwitch.status = "off";
    }
}


function setPos(obj, left, right, top, bottom){
    obj.left = left;
    obj.right = right;
    obj.top = top;
    obj.bottom = bottom;
}

function dRect(x, y, width, hieght, color){
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, hieght);
    ctx.closePath();
}


function clickPos(e){
    var pos = [];
    if (e.pageX || e.pageY) {
        pos[0] = e.pageX;
        pos[1] = e.pageY;
    }
    else {
        pos[0] = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        pos[1] = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    pos[0] -= canvas.offsetLeft;
    pos[1] -= canvas.offsetTop;

    return pos;
}