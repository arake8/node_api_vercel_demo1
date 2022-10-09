let express = require('express');
let app = express();
let bodyParser = require('body-parser'); // ? รับ data body จากข้อมูลที่ส่งมา
let mysql = require('mysql'); // เรียกใช้ mysql
const PORT = 4000;

app.use(bodyParser.json()); // set รูปแบบข้อมู body แบบ json
app.use(bodyParser.urlencoded({ extended: true})); // encode data uq\rl

app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTful CRUD API with NodeJS, Express, MYSQL',
        written_by: 'Kitsana'
    });
});

// connection to mysql database
let dbCon = mysql.createConnection({
    host: '203.170.190.22',
    user: 'samud_arake',
    password: 'K0801152215ae#',
    database: 'flutter_app01'    
});
dbCon.connect();

app.listen(PORT, () => {
    console.log(`Node App is running on port ${PORT}`);
});

module.exports = app;