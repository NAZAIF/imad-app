var button = document.getElementById(counter);
button.onclick = function (req, res){
    counter = counter + 1;
    var span = document.getElementById(count);
    span.innerHTML = counter.toSting();
};
