const mysql = require('mysql');
const http = require('http');
const { exec } = require('child_process');

const db = mysql.createConnection({
    host: 'mydatabase.com',
    user: 'admin',
    password: 'secret123',
    database: 'mydb'
});

const userInput = process.argv[2];

http.get('http://insecure-api.com/get-data', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        db.query("INSERT INTO mytable (column1) VALUES ('" + data + "')", (err) => {
            if (err) {
                console.error(err);
            }
            exec(`echo ${userInput}`, (err, stdout) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(stdout);
                }
                db.end();
            });
        });
    });
}).on('error', (err) => {
    console.error(err);
});
