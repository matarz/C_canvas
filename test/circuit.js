//todo preload images
//todo relative sizes
//todo remove can borders



window.onload = draw;

function draw() {
  var ctx = (a canvas context);
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  //...drawing code...
}


html, body {
  width:  100%;
  height: 100%;
  margin: 0px;
}



var canvas, ctx;

//setting variables (canW = canH = 450)
var colors = {off:"rgba(200,200,200,1)", hot:"rgba(255,0,0,.6)", cold:"rgba(0,0,255,.6)", stroke:"rgba(0,0,0,.8)"};
var cSwitch = {radius:30, lineWidth:4, status:"off"};
cSwitch.sideWiresLen = cSwitch.radius/2 + 2;
cSwitch.center = {x:canvas.width/2, y:canvas.height-80};
setPos(cSwitch, cSwitch.center.x - cSwitch.radius, cSwitch.center.x + cSwitch.radius, cSwitch.center.y - cSwitch.radius, cSwitch.center.y + cSwitch.radius);

var corner = {radius:30, lineWidth:10};

//noinspection JSSuspiciousNameCombination
var bottomR = {width:76, height:corner.lineWidth};
var hw = cSwitch.lineWidth/2 - cSwitch.sideWiresLen;
setPos(bottomR, cSwitch.right + hw, cSwitch.right + hw + bottomR.width, cSwitch.center.y-(bottomR.height/2), cSwitch.center.y+(bottomR.height/2));

var bottomL = {width:bottomR.width, height:bottomR.height};
setPos(bottomL, cSwitch.left - (hw + bottomL.width), cSwitch.left - hw, cSwitch.center.y-(bottomL.height/2), cSwitch.center.y+(bottomL.height/2));

var switchArm = {angle:-30, x:bottomL.right-3, y:bottomL.top+2, width:bottomR.left-bottomL.right, height:4};

//noinspection JSSuspiciousNameCombination
var rightR = {width:bottomR.height, height:180};
setPos(rightR, bottomR.right+corner.radius, bottomR.right+rightR.width+corner.radius, bottomR.top-rightR.height-corner.radius, bottomR.top-corner.radius);

//noinspection JSSuspiciousNameCombination
var leftR = {width:bottomR.height, height:rightR.height};
setPos(leftR, bottomL.left-leftR.width-corner.radius, bottomL.left-corner.radius, rightR.top, rightR.bottom);

var topL = {width:((bottomR.right-bottomL.left)-6)/2, height:bottomR.height};
setPos(topL, bottomL.left, bottomL.left+topL.width, leftR.top-corner.radius-topL.height, leftR.top+topL.height-corner.radius);

var topR = {width:topL.width, height:bottomR.height};
setPos(topR, rightR.left - topR.width - corner.radius, rightR.left - corner.radius, topL.top, topL.bottom);


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
var flow = {x:bottomL.right, y:bottomL.top, step:4, callSpeed:20, color:colors.hot, passedCircle:true};
flow.corner = {x:0, y:0, r:0, sAngle:0, step:0.05, maxAngle:0, color:0};

canvas.addEventListener("click", clickRespond, false);

window.onload = init;


function init(){
	canvas = document.getElementById('drawArea');
	ctx = canvas.getContext('2d');
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	//preload bulbOn image
	var preloadBulb = new Image();
	preloadBulb.src = "bulbOn.jpg";  
  
	draw();
}

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

function dCorner(x, y, r, sAngle, eAngle, color){
    ctx.beginPath();
    ctx.arc(x, y, r, sAngle, eAngle, false);
    ctx.lineWidth = corner.lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

function drawAll(){
   //sides, tops, and bottoms
    dRect(bottomR.left, bottomR.top, bottomR.width, bottomR.height, colors.off);  //bottom-right
    dRect(bottomL.left, bottomL.top, bottomL.width, bottomL.height, colors.off);  //bottom-left
    dRect(rightR.left, rightR.top, rightR.width, rightR.height, colors.off);      //right rect
    dRect(leftR.left, leftR.top, leftR.width, leftR.height, colors.off);          //left rect
    dRect(topR.left, topR.top, topR.width, topR.height, colors.off);              //top-right
    dRect(topL.left, topL.top, topL.width, topL.height, colors.off);              //top-Left

	//corners
    dCorner(bottomR.right, rightR.bottom, corner.radius+corner.lineWidth/2, 0, Math.PI*.5, colors.off);     //corner bottom-right
    dCorner(bottomL.left, leftR.bottom, corner.radius+corner.lineWidth/2, Math.PI*.5, Math.PI, colors.off); //corner bottom-left
    dCorner(topL.left, leftR.top, corner.radius+corner.lineWidth/2, Math.PI, Math.PI*1.5, colors.off);      //corner top-left
    dCorner(topR.right, rightR.top, corner.radius+corner.lineWidth/2, Math.PI*1.5, 0, colors.off);          //corner top-right

    //hot wire circle
    ctx.beginPath();
    ctx.arc(hotWire.circle.x, hotWire.circle.y, hotWire.circle.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = hotWire.color;
    ctx.fill();
    ctx.closePath();
    dRect(hotWire.left, hotWire.top, hotWire.width, hotWire.height, hotWire.color);  //wire

    //cold wire circle
    ctx.beginPath();
    ctx.arc(coldWire.circle.x, coldWire.circle.y, coldWire.circle.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = coldWire.color;
    ctx.fill();
    ctx.closePath();
    dRect(coldWire.left, coldWire.top, coldWire.width, coldWire.height, coldWire.color);  //wire

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
    ctx.fillStyle = colors.stroke;
    ctx.translate(switchArm.x,switchArm.y);   //make switch arm xy center of rotation
    //ctx.rotate(switchArm.angle * Math.PI/180);             //rotate view
    ctx.rotate(switchArm.angle * Math.PI/180);
    ctx.translate(-switchArm.x,-switchArm.y); //return center to normal
    ctx.beginPath();
    ctx.fillRect(switchArm.x, switchArm.y, switchArm.width+6, switchArm.height);
    ctx.closePath();
    ctx.restore();
    //alert(switchArm.x +" "+ switchArm.y +" "+ switchArm.angle +" "+ switchArm.width +" "+ switchArm.height +" "+ colors.stroke);
}

function aniArm(){
    ctx.clearRect(0, topL.top, canvas.width, canvas.height);
    drawAll();
    ++switchArm.angle;
    drawArm();
    if(switchArm.angle>-10){
        clearInterval(intHandle);
        intHandle = setInterval(aniBottomL, flow.callSpeed);
    }
}


function aniBottomL(){
    if(flow.passedCircle && flow.x < cSwitch.left){
        drawArm();
        drawSwitchCircle();
        flow.passedCircle = false;
    }

    if(flow.x - flow.step < bottomL.left)
		flow.x = bottomL.left + flow.step;
		
	dRect(flow.x - flow.step, flow.y, flow.step, bottomL.height, flow.color);
    flow.x -= flow.step;

    if(flow.x <= bottomL.left){
        flow.corner = {x:bottomL.left, y:leftR.bottom, r:corner.radius+corner.lineWidth/2, sAngle:0.5, step:0.05,
                       maxAngle:1.0, color:colors.hot, nextFunc:aniLeftR};
        flow.x = leftR.left;
        flow.y = leftR.bottom;
        clearInterval(intHandle);
        intHandle = setInterval(aniCorner, flow.callSpeed);
    }
}


function aniLeftR(){
	if(flow.y - flow.step < leftR.top)
		flow.y = leftR.top + flow.step;
	
	dRect(flow.x, flow.y - flow.step, leftR.width , flow.step, flow.color);
    flow.y -= flow.step;

    if(flow.y <= leftR.top){
        flow.corner = {x:topL.left, y:leftR.top, r:corner.radius+corner.lineWidth/2, sAngle:1.0, step:0.05,
                       maxAngle:1.5, color:colors.hot, nextFunc:aniTop};
        flow.x = topL.left;
        flow.y = topL.top;
        clearInterval(intHandle);
        intHandle = setInterval(aniCorner, flow.callSpeed);
    }
}


function aniTop(){
    if(flow.x + flow.step > topL.right && flow.color == colors.hot)
		flow.x = topL.right - flow.step;

    if(flow.x + flow.step > topR.right)
        flow.x = topR.right - flow.step;

    dRect(flow.x, flow.y, flow.step, topL.height, flow.color);
    flow.x += flow.step;

    if(flow.x == topL.right){
        bulb.src = "bulbOn.jpg";
        flow.x = topR.left;
        flow.color = colors.cold;
    }

    if(flow.x >= topR.right){
        flow.corner = {x:topR.right, y:rightR.top, r:corner.radius+corner.lineWidth/2, sAngle:1.5, step:0.05,
                       maxAngle:2.0, color:colors.cold, nextFunc:aniRightR};

        flow.x = rightR.left;
        flow.y = rightR.top;
        flow.color = colors.cold;
        clearInterval(intHandle);
        intHandle = setInterval(aniCorner, flow.callSpeed);
    }
}

function aniRightR(){
	if(flow.y + flow.step > rightR.bottom)
		flow.y = rightR.bottom - flow.step;    
	
	dRect(flow.x, flow.y, rightR.width , flow.step, flow.color);
    flow.y += flow.step;

    if(flow.y >= rightR.bottom){
        flow.corner = {x:bottomR.right, y:rightR.bottom, r:corner.radius+corner.lineWidth/2, sAngle:0, step:0.05,
                       maxAngle:0.5, color:colors.cold, nextFunc:aniBottomR};
        flow.x = bottomR.right;
        flow.y = bottomR.top;
        flow.passedCircle = true;
        clearInterval(intHandle);
        intHandle = setInterval(aniCorner, flow.callSpeed);
    }
}

function aniBottomR(){
    if(flow.x - flow.step < bottomR.left)
		flow.x = bottomR.left + flow.step;    
	
	if(flow.passedCircle && flow.x < cSwitch.right){
        drawSwitchCircle();
        flow.passedCircle = false;
    }
    dRect(flow.x - flow.step, flow.y, flow.step, bottomR.height, flow.color);
    flow.x -= flow.step;

    if(flow.x <= bottomR.left){
        drawArm();
        clearInterval(intHandle);
    }
}

function aniCorner(){
    dCorner(flow.corner.x, flow.corner.y, flow.corner.r, Math.PI * flow.corner.sAngle, Math.PI * Number((flow.corner.sAngle + flow.corner.step).toFixed(2)), flow.corner.color);

    flow.corner.sAngle = Number((flow.corner.sAngle + flow.corner.step).toFixed(2));

    if(flow.corner.sAngle + flow.corner.step > flow.corner.maxAngle){
        clearInterval(intHandle);
        intHandle = setInterval(flow.corner.nextFunc, flow.callSpeed);
    }
}



function clickRespond(e){
    var p = clickPos(e);
    if(p[0] < cSwitch.left || p[0] > cSwitch.right || p[1] > cSwitch.bottom || p[1] < cSwitch.top)
        return;

    if (cSwitch.status == "off"){
        cSwitch.status = "on";
        intHandle = setInterval(aniArm, flow.callSpeed);
    }else{  //turn off
        clearInterval(intHandle);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        switchArm.angle = -30;
        flow.x = bottomL.right;
        flow.y = bottomL.top;
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