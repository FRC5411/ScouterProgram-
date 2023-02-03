let justPressed = false;

//Event listeners for the arrow keys
function userClicks(){
    canvas.addEventListener("mousedown", function(e)
    {
        getMousePosition(canvas, e);
    });

    
    function getMousePosition(canvas, event) {
        let x = event.offsetX
        let y = event.offsetY
        let marker = {
            x: Math.floor(x / grid.boxWidth),
            y: Math.floor(y / grid.boxHeight),
            scoutData: scoutData
            //,markerColor: scoutData.markerColor
        }
        //console.log('markerColor: '+marker.scoutData.markerColor.red);
        socket.emit('drawMarker', marker);
        // placeMarker(canvas, Math.floor((x/(canvas.width/20))), Math.floor((y/(canvas.height/16))));
    }
}
/*function placeMarker(canvas, x, y, markerColor)
{
    var ctx = canvas.getContext("2d");
    var width = canvas.width/20;
    var height = canvas.height/16
    var posx = x*width ;
    var posy = y*height;
    ctx.fillStyle = markerColor;
    ctx.fillRect(posx+3,posy+3,width-2, height-2);

}*/

//}