var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
    user: 'nazaifmoid',
    database: 'nazaifmoid',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: 'db-nazaifmoid-6415'
};
var app = express();
app.use(morgan('combined'));

var articles = {
 'articleone':{
    title:'IMAD | A1',
    heading:'article one',
    date:'4 aug 17',
    content:`
            <p>
                Globalization (or globalisation; see spelling differences) refers to the free movement of goods, capital, services, people, technology and information. It is the action or procedure of international integration of countries arising from the convergence of world views
            </p>
            <p>
                A business (also known as an enterprise, a company or a firm) is an organizational entity involved in the provision of goods and services to consumers.
            </p>`
},

 'articletwo':{
    title:'IMAD | A2',
    heading:'article two',
    date:'3 aug 17',
    content:`
             <p>
                Globalization (or globalisation; see spelling differences) refers to the free movement of goods, capital, services, people, technology and information. It is the action or procedure of international integration of countries arising from the convergence of world views
            </p>
            <p>
                A business (also known as an enterprise, a company or a firm) is an organizational entity involved in the provision of goods and services to consumers.
            </p>
            <p>
                 Los Angeles' Hollywood is famed for filmmaking.
            </p>
            <a href="https://en.wikipedia.org/wiki/United_States">LINK</a>`

    }
 };    

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
        <div>
            ${date}
        </div>
        <div>
            <a href="http://www.outlooker.in/">click</a>
        </div>
        <hr/>
        <div>
            <h2>
                ${heading}
            </h2>
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


var counter = 0;
app.get('/counter', function (req,res){
    counter = counter + 1;
    res.send(counter.toString());
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/articles/:artname', function (req,res) {
    pool.query("SELECT * FROM article WHERE title='" +req.params.artname+"'", function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                res.status(404).send('article not found');
            }else{
                var artData = result.rows[0];
                res.send(createtemplate(articles[artname]));        
                
            }
        }
    });
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
