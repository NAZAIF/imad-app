console.log('ITs me nazaif');
var elmt = document.getElementById('maintext');
elmt.innerHTML = 'new mode';
var marginl = 0;
function goright(){
    marginl = marginl+1;
    img.style.marginl = marginl + "px";
}
var img = document.getElemetById('madi');
img.onclick  = function() {
    var interval = setInterval(goright,50);
}
