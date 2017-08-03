var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articleone={
    title:'IMAD | A1',
    heading:'article one',
    date:'3 aug 17',
    content:`
            <p>
                Globalization (or globalisation; see spelling differences) refers to the free movement of goods, capital, services, people, technology and information. It is the action or procedure of international integration of countries arising from the convergence of world views
            </p>
            <p>
                A business (also known as an enterprise, a company or a firm) is an organizational entity involved in the provision of goods and services to consumers.
            </p>`
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
</html>`;
return htmltemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/art-one', function (req,res) {
 res.send(createtemplate(articleone));  
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/two', function (req,res){
    res.sendFile(path.join(__dirname, 'ui', 'two.html'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
