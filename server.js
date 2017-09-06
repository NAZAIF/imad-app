var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var session = require('express-session');


var config = {
    user: 'nazaifmoid',
    database: 'nazaifmoid',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD,
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.use(session({
    secret: 'someRandomSecretValue',
    cookie:{ maxAge: 1000*60*60*24*30}
}));
   

function createtemplate(data){
    date=data.date;
    title=data.title;
    heading=data.heading;
    content=data.content;
    var htmltemplate=`
    <html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="ui/style.css" rel="stylesheet" />
    </head>
    <body>
      <div class="cont">
        <hr/>
        <div>
            <h2>
                ${heading}
            </h2>
        </div>
        <div>
         ${date.toDateString()}
         </div>
        <div> 
           ${content}
        </div>
      </div>
    </body>
</html>
`;
return htmltemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/articles/:artname', function (req,res) {
    pool.query("SELECT * FROM article WHERE title=$1",[req.params.artname], function(err,result){
        if(err){
            res.setHeader('Content-Type','application/json');
            //var json = JSON.stringify({errorerr.toString());
            //res.status(500).send(JSON.parse(json));
           res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                res.status(404).send('article not found');
           //     res.setHeader('Content-Type','application/json');
             //   res.status(404).send(JSON.parse('{"error":"No article send"}'));
                
            }else{
                var artData = result.rows[0];
                res.send(createtemplate(artData));        
                
            }
        }
    });
});


app.get('/getarticle/:artname', function (req,res) {
    pool.query("SELECT * FROM article WHERE title=$1",[req.params.artname], function(err,result){
        if(err){
            res.setHeader('Content-Type','application/json');
            var json = JSON.stringify({error:err.toString()});
            res.status(500).send(JSON.parse(json));
           // res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                //res.status(404).send('article not found');
                res.setHeader('Content-Type','application/json');
                res.status(404).send(JSON.parse('{"error":"No article send"}'));
                
            }else{
                var artData = result.rows[0];
                //var artobj = createtemplate(artData);
                res.setHeader('Content-Type','application/json');
                var json2 = JSON.strigify({date:artData.date.toString()});
                res.send(JSON.parse(json2));
                
            }
        }
    });
});

app.get('/get', function (req,res){
    
    var data = [
        {   "id": 1,
            "date":"02-09-2107",
            "title":"art one",
            "heading":"article one",
            "content":"This is article one"
        }];
    
    var data2 = [
        {   "id": 2,
            "date":"06-09-2107",
            "title":"art two",
            "heading":"article two",
            "content":"This is article two content.This is article two content.This is article two content.This is article two content."
        }];
    
    res.setHeader('Content-Type','application/json');
    var json = JSON.stringify(data,data2);
    //var json2 = JSON.stringify(data2);
    res.send(JSON.parse(json));
    //res.setHeader('Content-Type','application/json');
    //res.send(JSON.parse(json2));
        
});

var pool = new Pool(config); 
app.get('/testdb', function (req,res){
    pool.query('SELECT * FROM test', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
});


function hash(input,salt){
    var hashd = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdgf2", "10000", salt, hashd.toString('hex')].join('$');
}


app.get('/hash/:input',function(req,res){
   var hashstr = hash(req.params.input,'this-random-string'); 
   res.send(hashstr);    
});


app.post('/create-user', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbstring = hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbstring], function(err,result){
        if(err){
            res.setHeader('Content-Type','application/json');
            var json = JSON.stringify({ error:err.toString()});
            res.status(500).send(JSON.parse(json));
            //res.status(500).send(err.toString());
        }else{
            //res.send('user successfully created with ' + username);
            res.setHeader('Content-Type','application/json');
            res.send(JSON.parse(`{"message": "User succesfully created: ${username}"}`))
        }
    });
});

app.post('/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user" WHERE username = $1',[username], function(err,result){
        if(err){
            res.setHeader('Content-Type','application/json');
            var json = JSON.stringify({error:err.toString()});
            res.status(500).send(JSON.parse(json));
            //res.status(500).send(err.toString());
        }else{
            if(result.rows.length === 0){
                //res.send(403).send('invalid username/password');
                res.setHeader('Content-Type','application/json');
                res.send(JSON.parse('{"error":"invalid username/password"}'));
            }else{
                var dbstring = result.rows[0].password;
                var salt = dbstring.split('$')[2];
                var hpassword = hash(password,salt);
                if(hpassword === dbstring){
                    req.session.outh = {userid: result.rows[0].id};
                    //res.send('user' + username +' successfully logged in');
                    res.setHeader('Content-Type','application/json');
                    res.send(JSON.parse('{"message":"you are successfully logged in"}'));
                    
                }else{
                    //res.send(403).send('username/password is incorrect');
                    res.setHeader('Content-Type','application/json');
                    res.send(JSON.parse('{"error":"incorrect username/password"}'));
            
                }
            }
        }
    });
});

app.get('/check', function(req,res){
    if(req.session && req.session.outh && req.session.outh.userid){
        res.send(req.session.outh.userid.toString() + ' is signed in');
    }else{
        res.send('you are not logged in');
        }
});


var counter = 0;
app.get('/counter', function (req,res){
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/logout', function(req,res){
   delete req.session.outh;
   res.send('logged out');
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}! Dont worry`);
});
