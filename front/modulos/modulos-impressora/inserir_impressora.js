export async function InserirImpressora(event) {
  event.preventDefault();

  const tecno = document.getElementById("tecno").value;
  const tipo = document.getElementById("tipo").value;
  const med_velo = document.getElementById("med_velo").value;
  const nome = document.getElementById("nome_impressora").value.trim();
  const custo_hora = document.getElementById("custo_hora").value.trim();
  const velo_max = document.getElementById("velo_max") ? document.getElementById("velo_max").value.trim() : '';
  const compr_max = document.getElementById("compr_max") ? document.getElementById("compr_max").value.trim() : '';
  const larg_max = document.getElementById("larg_max") ? document.getElementById("larg_max").value.trim() : '';
  const gram_max = document.getElementById("gram_max") ? document.getElementById("gram_max").value.trim() : '';
  const esp_max = document.getElementById("esp_max") ? document.getElementById("esp_max").value.trim() : '';

  if (!nome) {
    alert("Preencha o nome da impressora!");
    return;
  }

  const nova = { tecno, tipo, med_velo, nome, custo_hora, velo_max, compr_max, larg_max, gram_max, esp_max };

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/impressoras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nova)
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.mensagem || "Erro ao inserir impressora");
    }

    const data = await resposta.json().catch(() => ({}));
    alert(`Impressora inserida com sucesso! ID: ${data.id || ''}`);

    document.getElementById("tecno").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("med_velo").value = "";
    document.getElementById("nome_impressora").value = "";
    document.getElementById("custo_hora").value = "";
    if (document.getElementById("velo_max")) document.getElementById("velo_max").value = "";
    if (document.getElementById("compr_max")) document.getElementById("compr_max").value = "";
    if (document.getElementById("larg_max")) document.getElementById("larg_max").value = "";
    if (document.getElementById("gram_max")) document.getElementById("gram_max").value = "";
    if (document.getElementById("esp_max")) document.getElementById("esp_max").value = "";
  } catch (erro) {
    console.error("Erro ao inserir impressora:", erro);
    alert(`Não foi possível inserir a impressora: ${erro.message}`);
  }
}
