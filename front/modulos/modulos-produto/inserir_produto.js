export async function InserirProduto(event) {
  event.preventDefault();

  const id_fam = document.getElementById("id_familia").value.trim();
  const id_categ = document.getElementById("id_categoria").value.trim();
  const custo_m2 = document.getElementById("custo_m2").value.trim();

  if (!id_fam || !id_categ || !custo_m2) {
    alert("Preencha todos os campos!");
    return;
  }

  const novo = { id_fam, id_categ, custo_m2 };

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao inserir produto");
    }

    const data = await resposta.json();
    alert(`Produto inserido! ID: ${data.id_prod}`);

    // Limpar campos do formulário
    document.getElementById("id_familia").value = "";
    document.getElementById("id_categoria").value = "";
    document.getElementById("custo_m2").value = "";

    // Atualizar lista de produtos/datalist
    if (typeof carregarOpcoesProdutos === "function") {
      carregarOpcoesProdutos();
    }

  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar produto.");
  }
}
