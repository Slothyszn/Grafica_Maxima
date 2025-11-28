export async function InserirConfig(event) {
  event.preventDefault();

  const id_color = document.getElementById("id_color").value.trim();
  const id_impres = document.getElementById("id_impres").value.trim();
  const custo_acerto = document.getElementById("custo_acerto").value.trim();
  const custo_m2i = document.getElementById("custo_m2i").value.trim();

  if (!id_color || !id_impres) {
    alert("Preencha colorimetria e impressora!");
    return;
  }

  const novo = { id_color, id_impres, custo_acerto, custo_m2i };

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/configs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo)
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.mensagem || "Erro ao inserir config");
    }

    const data = await resposta.json().catch(() => ({}));
    alert(`Config adicionada com sucesso! ID: ${data.id || ''}`);

    document.getElementById("id_color").value = "";
    document.getElementById("id_impres").value = "";
    document.getElementById("custo_acerto").value = "";
    document.getElementById("custo_m2i").value = "";
  } catch (erro) {
    console.error("Erro ao inserir config:", erro);
    alert(`Não foi possível inserir a config: ${erro.message}`);
  }
}
