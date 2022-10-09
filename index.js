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

// retrieve all books
app.get('/books', (req, res) => {
    dbCon.query('SELECT * FROM books', (error, results, fields) => {
        if(error) throw error;
        
        let message = "";
        if(results === undefined || results.length == 0){
            message = "Books table is empty";
        }else{
            message = "Successfully retrieved all books";
        }
        return res.send({error: false, data: results, message: message});
    })
});

// add a new book
app.post('/book', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    // validation
    if(!name || !author){
        return res.status(400).send({ error: true, message: "Please provide book name and author."})
    }else{
        dbCon.query('INSERT INTO books (name, author) VALUES(?, ?)', [name, author], (error, results, fields) =>{
            if(error) throw error;
            return res.send({ error: false, data: results, message: "Book successfully added"})
        })
    }
});

// retrieve books by id
app.get('/book/:id', (req, res)=>{
    let id = req.params.id;

    if(!id){
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT * FROM books WHERE id = ?", id, (error, results, fields) =>{
            if (error) throw error;

            let message = "";
            if(results === undefined || results.length == 0){
                message = "Books not found";
            } else {
                message = "Successfully retrieved book data";
            }

            return res.send({ error: false, data: results, message: message});
        });
    }
});

// update data book with id
app.put('/book', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    // validation
    if(!id || !name || !author){
        return res.status(400).send({ error: true, message: 'Please provide book id, name and author'});
    } else {
        dbCon.query('UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if(results.changeRows === 0){  // changeRows จำนวรการเปลี่ยนแปลงข้อมูล
                message = "Books not found or data are same";
            } else {
                message = "Books successfully updated";
            }
            return res.send({ error: false, data: results, message: message });
        });
    }
});

// delete book by id
app.delete('/book', (req, res)=>{
    let id = req.body.id;

    if (!id){
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if(results.affectedRows === 0){ // affectedRows จำนวนการมีผลต่อข้อมูล
                message = "Book not found";
            } else {
                message = "Book successfully deleted";
            }
            return res.send({ error: false, data: results, message:message });
        });
    }
});

app.listen(PORT, () => {
    console.log(`Node App is running on port ${PORT}`);
});

module.exports = app;