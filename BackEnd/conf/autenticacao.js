"use strict";
const mysql = require('mysql');

const cn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
});

cn.connect(function (err) {
    if (err) {
        console.log('❌ Erro ao conectar no MySQL: ' + err);
    } else {
        console.log('✅ Conectado ao MySQL com sucesso!');
    }
});

async function selectFull() {
    const query = 'SELECT * FROM Clientes';    
    return new Promise((resolve, reject) => {
        cn.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(JSON.parse(JSON.stringify(results)));
        });
    });
}

async function insertCliente(Nome, Idade, UF) {
    const query = 'INSERT INTO Clientes (Nome, Idade, UF) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
        cn.query(query, [Nome, Idade, UF], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

async function selectById(id) {
    const query = 'SELECT * FROM Clientes WHERE id = ?';
    return new Promise((resolve, reject) => {
        cn.query(query, [id], (err, results) => {
            if (err) reject(err);
            else resolve(JSON.parse(JSON.stringify(results)));
        });
    });
}

async function deleteById(id) {
    console.log('🗑️ Executando DELETE no banco para ID:', id);
    
    const query = 'DELETE FROM Clientes WHERE id = ?';
    return new Promise((resolve, reject) => {
        cn.query(query, [id], (err, results) => {
            if (err) {
                console.error('❌ Erro no DELETE:', err);
                reject(err);
            } else {
                console.log('✅ Resultado do DELETE:', results);
                resolve(results.affectedRows > 0);
            }
        });
    });
}

async function updateCliente(Nome, Idade, UF, ID) {
    console.log('📊 Executando UPDATE no banco:', { Nome, Idade, UF, ID });
    
    const query = 'UPDATE Clientes SET Nome = ?, Idade = ?, UF = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        cn.query(query, [Nome, Idade, UF, ID], (err, results) => {
            if (err) {
                console.error('❌ Erro no UPDATE:', err);
                reject(err);
            } else {
                console.log('✅ UPDATE realizado com sucesso:', results);
                resolve(results);
            }
        });
    });     
}   

module.exports = { selectFull, selectById, deleteById, insertCliente, updateCliente }