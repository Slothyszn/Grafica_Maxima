import { ConsultarServicos } from './listar_servico.js';

export async function InserirServico(event) {
  event.preventDefault();

  const novoServico = {
    nome: document.getElementById("nome").value,
    tipo: document.getElementById("tipo").value,
    variacao: document.getElementById("variacao").value,
    custo_fixo: document.getElementById("custo_fixo").value,
    custo_area: document.getElementById("custo_area").value,
    custo_quantidade: document.getElementById("custo_quantidade").value
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/servicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoServico)
    });

    if (!resposta.ok) throw new Error("Erro ao inserir serviço");

    const data = await resposta.json();
    alert(data.mensagem); // mostra mensagem de sucesso
    ConsultarServicos();    // atualiza lista na tela
  } catch (erro) {
    console.error("Erro ao inserir serviço:", erro);
    alert("Não foi possível inserir o serviço.");
  }
}
