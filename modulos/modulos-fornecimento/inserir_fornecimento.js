export async function InserirFornecimento(event) {
  event.preventDefault();

  try {
    const fornecedores = await (await fetch("http://localhost:3000/api/fornecedores")).json();
    const materiais = await (await fetch("http://localhost:3000/api/materiais")).json();

    const nomeFornecedor = document.getElementById("nome_fornecedor").value;
    const nomeMaterial = document.getElementById("nome_material").value;

    const fornecedor = fornecedores.Fornecedor.find(f => f.nome === nomeFornecedor);
    const material = materiais.Material.find(m => m.nome === nomeMaterial);

    if (!fornecedor) return alert("Fornecedor não encontrado!");
    if (!material) return alert("Material não encontrado!");

    const novoFornecimento = {
      id_fornecedor: fornecedor.id,
      id_material: material.id,
      comprimento_base: document.getElementById("comprimento_base").value,
      largura_base: document.getElementById("largura_base").value,
      unidades: document.getElementById("unidades").value,
      custo_total: document.getElementById("custo_total").value,
      custo_unitario_estimado: document.getElementById("custo_unitario_estimado").value
    };

    const resposta = await fetch("http://localhost:3000/api/fornecimentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFornecimento)
    });

    if (!resposta.ok) throw new Error("Erro ao inserir fornecimento");

    const data = await resposta.json();
    alert(data.mensagem);
  } catch (erro) {
    console.error("Erro ao inserir fornecimento:", erro);
    alert("Não foi possível inserir o fornecimento.");
  }
}
