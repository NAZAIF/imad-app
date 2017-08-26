

var submit = document.getElementById('sbmtbtn');
submit.onclick = function() {
    var request = new XMLHttpRequest();
        request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE){
            if (request.status === 200){
                alert('logged in successfully');
                }else if(request.status === 403){
                    alert('password/username is incorrect');
                }else if(request.status === 500){
                    alert('something wrong');
                }
                
        }
        
    };
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST','http://nazaifmoid.imad.hasura-app.io/login' + name, true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username: username,password: password}));
    
 };
