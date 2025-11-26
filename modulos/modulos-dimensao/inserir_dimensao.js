// ---------------------------------------------
// INSERIR – Adicionar nova dimensão
// ---------------------------------------------
export async function InserirDimensao(event) {
  event.preventDefault();

  // pegar valores do formulário
  const cmpr = document.getElementById("cmpr").value.trim();
  const larg = document.getElementById("larg").value.trim();
  const mrg_interna = document.getElementById("mrg_interna").value.trim();
  const mrg_sangria = document.getElementById("mrg_sangria").value.trim();
  const mrg_branca = document.getElementById("mrg_branca").value.trim();
  const mrg_espaco = document.getElementById("mrg_espaco").value.trim();

  // validação mínima
  if (!cmpr || !larg) {
    alert("Preencha comprimento e largura!");
    return;
  }

  const novaDimensao = { cmpr, larg, mrg_interna, mrg_sangria, mrg_branca, mrg_espaco };

  try {
    const resposta = await fetch("http://localhost:3000/api/dimensoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaDimensao)
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.mensagem || "Erro ao inserir dimensão");
    }

    const data = await resposta.json().catch(() => ({}));
    alert(`Dimensão adicionada com sucesso! ID: ${data.id_dim || ''}`);

    // limpar formulário
    document.getElementById("cmpr").value = "";
    document.getElementById("larg").value = "";
    document.getElementById("mrg_interna").value = "";
    document.getElementById("mrg_sangria").value = "";
    document.getElementById("mrg_branca").value = "";
    document.getElementById("mrg_espaco").value = "";

  } catch (erro) {
    console.error("Erro ao inserir dimensão:", erro);
    alert(`Não foi possível inserir a dimensão: ${erro.message}`);
  }
}
