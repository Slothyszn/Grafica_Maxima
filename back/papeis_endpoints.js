import fs from 'fs';
import express from 'express';
const router = express.Router();

router.get('/papeis', (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('papeis.json', 'utf-8'));
    res.json(dados);
  } catch (erro) {
    console.error("Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


// Rota para adicionar novo papel
router.post('/papeis', (req, res) => {
  try {
    const novoPapel = req.body;
    const dados = JSON.parse(fs.readFileSync('papeis.json', 'utf-8'));

    if (!Array.isArray(dados.Papel)) dados.Papel = [];

    // calcula o maior número atual e soma 1
    const ultimoNumero = dados.Papel.length > 0
      ? Math.max(...dados.Papel.map(p => parseInt(p.id_papel.slice(1))))
      : 0;

    const novoId = "P" + String(ultimoNumero + 1).padStart(3, "0");


    novoPapel.id_papel = novoId;

    // reorganiza para salvar o id no topo
    const papelOrdenado = {
      id_papel: novoPapel.id_papel,
      nome: novoPapel.nome,
      form9: novoPapel.form9,
      form8: novoPapel.form8,
      form6: novoPapel.form6,
      form4: novoPapel.form4,
      form3: novoPapel.form3,
      form2: novoPapel.form2,
      unit: novoPapel.unit,
      form: novoPapel.form,
      quantPac: novoPapel.quantPac,
      pac: novoPapel.pac
    };

    dados.Papel.push(papelOrdenado);

    fs.writeFileSync('papeis.json', JSON.stringify(dados, null, 2), 'utf-8');

    console.log(`✅ Novo papel ${novoId} adicionado com sucesso!`);
    res.json({ mensagem: `Papel ${novoId} salvo com sucesso!`, id: novoId });
  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

router.put('/papeis/:id', (req, res) => {
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

// Rota para deletar um papel pelo nome
router.delete('/papeis/nome/:nome', (req, res) => {
  try {
    const { nome } = req.params;

    const dados = JSON.parse(fs.readFileSync('papeis.json', 'utf-8'));
    const index = dados.Papel.findIndex(p => p.nome === nome);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Papel não encontrado" });
    }

    // Remove o papel do array
    dados.Papel.splice(index, 1);

    // Salva novamente
    fs.writeFileSync('papeis.json', JSON.stringify(dados, null, 2), 'utf-8');

    res.json({ mensagem: "Papel removido com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


export default router;