const db = require('./conf/autenticacao.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Configurações
app.use(cors());
app.use(bodyParser.json());

// Middleware de log
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// Rota health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor rodando!',
    timestamp: new Date().toISOString()
  });
});

// Rota clientes
app.get('/clientes', async (req, res) => {
  try {
    const results = await db.selectFull();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota raiz
app.get('/', async (req, res) => {
  try {
    const results = await db.selectFull();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar cliente por ID
app.get('/clientes/:id', async (req, res) => {
  try {
    const results = await db.selectById(req.params.id);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inserir cliente
app.post('/clientes', async (req, res) => {
  try {
    const { Nome, Idade, UF } = req.body;
    const results = await db.insertCliente(Nome, Idade, UF);
    res.json({ message: 'Cliente criado', id: results.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 ATUALIZAR CLIENTE - CORRIGIDO
app.put('/clientes/:id', async (req, res) => {
  try {
    const { Nome, Idade, UF } = req.body;
    const id = req.params.id;
    
    console.log('📝 Recebendo atualização:', { id, Nome, Idade, UF });
    
    const results = await db.updateCliente(Nome, Idade, UF, id);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json({ 
      message: 'Cliente atualizado com sucesso',
      affectedRows: results.affectedRows 
    });
    
  } catch (error) {
    console.error('❌ Erro em PUT /clientes:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// Deletar cliente
// Deletar cliente - COM LOGS DETALHADOS
app.delete('/clientes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('🗑️ Recebendo requisição DELETE para ID:', id);
    
    const results = await db.deleteById(id);
    console.log('✅ Resultado do delete:', results);
    
    if (results) {
      console.log('🗑️ Cliente excluído com sucesso');
      res.json({ 
        message: 'Cliente deletado com sucesso',
        deleted: true 
      });
    } else {
      console.log('❌ Cliente não encontrado para exclusão');
      res.status(404).json({ 
        error: 'Cliente não encontrado',
        deleted: false 
      });
    }
  } catch (error) {
    console.error('❌ Erro em DELETE /clientes:', error);
    res.status(500).json({ 
      error: 'Erro ao deletar cliente: ' + error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`✅ Health: http://localhost:${port}/health`);
  console.log(`👥 Clientes: http://localhost:${port}/clientes`);
});