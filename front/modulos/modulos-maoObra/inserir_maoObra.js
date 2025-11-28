// ---------------------------------------------
// INSERIR – Nova mão de obra
// ---------------------------------------------
export async function InserirMaoObra(event) {
  event.preventDefault();

  const id_serv = document.getElementById("id_serv").value.trim();
  const id_item = document.getElementById("id_item").value.trim();

  if (!id_serv || !id_item) {
    alert("Preencha todos os campos!");
    return;
  }

  const novo = { id_serv, id_item };

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/maoObras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });

    if (!resposta.ok) {
      const erroData = await resposta.json();
      throw new Error(erroData.erro || "Erro ao inserir mão de obra");
    }

    const data = await resposta.json();
    alert(`Mão de obra inserida! Serviço: ${data.id_serv}, Item: ${data.id_item}`);

    // Limpa campos
    document.getElementById("id_serv").value = "";
    document.getElementById("id_item").value = "";

    // Atualiza lista/datalist
    if (typeof carregarOpcoesMaoObra === "function") carregarOpcoesMaoObra();
    if (typeof ConsultarMaoObra === "function") ConsultarMaoObra();

  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar mão de obra.");
  }
}
