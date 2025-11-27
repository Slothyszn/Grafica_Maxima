export async function InserirImpressao(event) {
  event.preventDefault();

  function extrairID(campo) {
    return Number(document.getElementById(campo).value.split(" | ")[0]);
  }

  const id_sub = extrairID("id_sub");
  const cod_frente = extrairID("cod_frente");
  const cod_verso = extrairID("cod_verso");
  const id_impres = extrairID("id_impres");


  const velo = Number(document.getElementById("velo").value);
  const n_pass = Number(document.getElementById("n_pass").value);


  // VALIDAÇÃO COMPLETA
  if (
    Number.isNaN(id_sub) ||
    Number.isNaN(cod_frente) ||
    Number.isNaN(cod_verso) ||
    Number.isNaN(id_impres) ||
    Number.isNaN(velo)
  ) {
    alert("Preencha todos os campos!");
    return;
  }

  const novaImpressao = {
    id_sub,
    cod_frente,
    cod_verso,
    id_impres,
    velo,
    // custo_hora,
    // custo_exced ///////// POR ENQUANTO NAO, MAS VC VAI USAR, depois que fizer o calculo
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/impressao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaImpressao)
    });

    const dados = await fetch("http://localhost:3000/api/impressao");
    const data = await dados.json();

    if (!resposta.ok) {
      throw new Error(data.erro || "Erro ao inserir impressão");
    }

    alert(`Impressão adicionada! ID: ${data.id_imp}`);

    document.querySelector("form").reset();

  } catch (erro) {
    console.error("Erro ao inserir impressão:", erro);
    alert("Erro ao inserir impressão: " + erro.message);
  }
}
