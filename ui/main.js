console.log('ITs me nazaif');
var elmt = document.getElementById('maintext');
elmt.innerHTML = 'new mode';
var marginl = 0;
var img = document.getElementById('madi');
function goright(){
    marginl = marginl+2;
    img.style.marginl = marginl + 'px';
}

img.onclick  = function() {
    var interval = setInterval(goright,50);
};
