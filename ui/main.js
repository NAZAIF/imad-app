console.log('ITs me nazaif');
var elmt = document.getElementById('maintext');
elmt.innerHTML = 'new mode';
var marginLeft = 0;
var img = document.getElementById('madi');
function goright(){
    marginLeft = marginLeft+2;
    img.style.marginLeft = marginLeft + 'px';
}

img.onclick  = function() {
    var interval = setInterval(goright,50);
};
