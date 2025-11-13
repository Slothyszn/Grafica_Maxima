export async function InserirMaterial(event) {
  event.preventDefault();

  const novoMaterial = {
    nome: document.getElementById("nome").value,
    tipo: document.getElementById("tipo").value,
    variacao: document.getElementById("variacao").value,
    gramatura: document.getElementById("gramatura").value,
    espessura: document.getElementById("espessura").value,
    custo_unitario: document.getElementById("custo_unitario").value,
    custo_area: document.getElementById("custo_area").value
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/materiais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoMaterial)
    });

    if (!resposta.ok) throw new Error("Erro ao inserir Material");

    const data = await resposta.json();
    alert(data.mensagem); // mostra mensagem de sucesso
  } catch (erro) {
    console.error("Erro ao inserir material:", erro);
    alert("Não foi possível inserir o material.");
  }
}
