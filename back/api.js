const express = require('express');
const fs = require('fs');
const cors = require('cors');
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

// Rota para listar os papeis
app.get('/api/papeis', (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('papeis.json', 'utf-8'));
    res.json(dados);
  } catch (erro) {
    console.error("Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


// Rota para adicionar novo papel
app.post('/api/papeis', (req, res) => {
  try {
    const novoPapel = req.body;

    // Lê o arquivo JSON 
    const dados = JSON.parse(fs.readFileSync('papeis.json', 'utf-8'));

    // Garante que existe a lista "Papel"
    if (!Array.isArray(dados.Papel)) {
      dados.Papel = [];
    }

    // Adiciona o novo papel no array 
    dados.Papel.push(novoPapel);

    // Salva de volta no mesmo arquivo
    fs.writeFileSync('papeis.json', JSON.stringify(dados, null, 2), 'utf-8');

    console.log("Novo papel adicionado com sucesso!");
    res.json({ mensagem: "Novo dado salvo com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

app.put('/api/papeis/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync('papeis.json', 'utf-8'));
    const papel = dados.Papel.find(p => p.id_papel == id);

    if (!papel) return res.status(404).json({ mensagem: "Papel não encontrado" });

    papel[campo] = novoValor;

    fs.writeFileSync('papeis.json', JSON.stringify(dados, null, 2), 'utf-8');
    res.json({ mensagem: "Papel atualizado com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

app.listen(PORT, () => {
  console.log("Server rodando na porta: " + PORT);
});
