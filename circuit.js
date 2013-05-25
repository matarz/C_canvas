var canvas = document.getElementById('drawArea');
var ctx = canvas.getContext('2d');

//setting variables
var cSwitch = {radius:30, lineWidth:4, sideWiresLen:18, status:"off"};
cSwitch.center = {x:canvas.width/2, y:canvas.height-100};
setPos(cSwitch, cSwitch.center.x - cSwitch.radius, cSwitch.center.x + cSwitch.radius, cSwitch.center.y - cSwitch.radius, cSwitch.center.y + cSwitch.radius);

var bottomR = {width:130, height:8};
var hw = cSwitch.lineWidth/2 - cSwitch.sideWiresLen;
setPos(bottomR, cSwitch.right + hw, cSwitch.right + hw + bottomR.width, cSwitch.center.y-(bottomR.height/2), cSwitch.center.y+(bottomR.height/2));

var bottomL = {width:130, height:8};
setPos(bottomL, cSwitch.left - (hw + bottomL.width), cSwitch.left - hw, cSwitch.center.y-(bottomL.height/2), cSwitch.center.y+(bottomL.height/2));

var switchArm = {angle:-30, x:bottomL.right-3, y:bottomL.top+2, width:bottomR.left-bottomL.right, height:4};

var rightR = {width:8, height:250};
setPos(rightR, bottomR.right, bottomR.right+rightR.width, bottomR.bottom-rightR.height, bottomR.bottom);

var leftR = {width:8, height:250};
setPos(leftR, bottomL.left-leftR.width, bottomL.left, bottomL.bottom-leftR.height, bottomL.bottom);

var topR = {width:140, height:8};
setPos(topR, rightR.left - topR.width, rightR.left, rightR.top, rightR.top+topR.height);

var topL = {width:140, height:8};
setPos(topL, leftR.right, leftR.right+topL.width, leftR.top, leftR.top+topL.height);

//Hot wire
var halfR = cSwitch.radius/2;
var hotWire = {color:"red", width:4, height:50};
hotWire.circle = {radius:4, x:cSwitch.center.x-halfR, y:cSwitch.center.y+halfR};
setPos(hotWire, hotWire.circle.x-(hotWire.width/2), hotWire.left + hotWire.width, hotWire.circle.y+(hotWire.circle.radius/2), hotWire.top + hotWire.height);

//Cold wire
var coldWire = {color:"blue", width:hotWire.width, height:hotWire.height};
coldWire.circle = {radius:hotWire.circle.radius, x:cSwitch.center.x+halfR, y:hotWire.circle.y};
setPos(coldWire, coldWire.circle.x-(coldWire.width/2), coldWire.left + coldWire.width, coldWire.circle.y+(coldWire.circle.radius/2), coldWire.top + coldWire.height);

var bulb;

canvas.addEventListener("click", clickRespond, false);


draw();
function draw(){
    drawAll();
    drawArm();
}

function drawAll(){
   //bottom-right
    dRect(bottomR.left, bottomR.top, bottomR.width, bottomR.height, "DarkGrey");

    //bottom-left
    dRect(bottomL.left, bottomL.top, bottomL.width, bottomL.height, "DarkGrey");

    //circle
    ctx.beginPath();
    ctx.arc(cSwitch.center.x, cSwitch.center.y, cSwitch.radius, 0, Math.PI * 2, true);
    ctx.lineWidth = cSwitch.lineWidth;
    ctx.stroke();
    ctx.closePath();

    //right rect
    dRect(rightR.left, rightR.top, rightR.width, rightR.height, "DarkGrey");

    //left rect
    dRect(leftR.left, leftR.top, leftR.width, leftR.height, "DarkGrey");

    //top-right
    dRect(topR.left, topR.top, topR.width, topR.height, "DarkGrey");

    //top-Left
    dRect(topL.left, topL.top, topL.width, topL.height, "DarkGrey");

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
    //switch arm

    ctx.save();
    ctx.translate(switchArm.x,switchArm.y)   //make switch arm xy center of rotation
    ctx.rotate(switchArm.angle * Math.PI/180);             //rotate view
    ctx.translate(-switchArm.x,-switchArm.y) //return center to normal
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(switchArm.x, switchArm.y, switchArm.width+6, switchArm.height);
    ctx.closePath();
    ctx.restore();
}

var angle = -30, intHandle;
function aniArm(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAll();
    ++switchArm.angle;
    drawArm();
    if(switchArm.angle>-10)
        clearInterval(intHandle);
}

function clickRespond(e){
    var p = clickPos(e);
    if(p[0] < cSwitch.left || p[0] > cSwitch.right || p[1] > cSwitch.bottom || p[1] < cSwitch.top || cSwitch.status == "busy")
        return;

    if (cSwitch.status == "off"){
        intHandle = setInterval(aniArm, 20);
        //run turnOn

    }else{
        //turn off
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