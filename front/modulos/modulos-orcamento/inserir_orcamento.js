// ---------------------------------------------
// INSERIR – Adicionar novo orçamento
// ---------------------------------------------
export async function InserirOrcamento(event) {
  event.preventDefault();

  const nome_cli = document.getElementById("nome_cli_inserir").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const perc_lucro = parseFloat(document.getElementById("perc_lucro_inserir").value.trim()) || 0;
  const adicional = parseFloat(document.getElementById("adicional_inserir").value.trim()) || 0;
  const dt_criacao = document.getElementById("dt_criacao_inserir").value;
  const dt_limite = document.getElementById("dt_limite_inserir").value;

  if (!nome_cli) return alert("Preencha o nome do cliente!");

  const novoOrcamento = { nome_cli, telefone, perc_lucro, adicional, dt_criacao, dt_limite };

  try {
    const resposta = await fetch("http://localhost:3000/api/orcamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoOrcamento) // NÃO enviamos id_orc
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.erro || "Erro ao inserir orçamento");
    }

    const data = await resposta.json().catch(() => ({}));
    alert(`Orçamento adicionado com sucesso! ID: ${data.id_orc || ''}`);

    document.getElementById("form-orcamento").reset();
  } catch (erro) {
    console.error("Erro ao inserir orçamento:", erro);
    alert(`Não foi possível inserir o orçamento: ${erro.message}`);
  }
}
