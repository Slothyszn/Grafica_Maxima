export async function InserirMaquina(event) {
  event.preventDefault();

  const novoMaquina = {
    tipo: document.getElementById("tipo").value,
    variacao: document.getElementById("variacao").value,
    marca: document.getElementById("marca").value ,
    modelo: document.getElementById("modelo").value,
    comprimento_maximo: document.getElementById("comprimento_maximo").value,
    largura_maxima: document.getElementById("largura_maxima").value
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/maquinas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoMaquina)
    });

    if (!resposta.ok) throw new Error("Erro ao inserir maquina");

    const data = await resposta.json();
    alert(data.mensagem); // mostra mensagem de sucesso
  } catch (erro) {
    console.error("Erro ao inserir maquina:", erro);
    alert("Não foi possível inserir o maquina.");
  }
}
