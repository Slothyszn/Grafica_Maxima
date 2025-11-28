export async function InserirColorimetria(event) {
  event.preventDefault();

  const cod = document.getElementById("cod").value.trim();
  const num_cores = document.getElementById("num_cores").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (!cod || !num_cores) {
    alert("Preencha os campos obrigatórios (cod e num_cores)!");
    return;
  }

  const nova = { cod, num_cores, descricao };

  try {
    const resposta = await fetch("http://localhost:3000/api/colorimetria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nova)
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.mensagem || "Erro ao inserir colorimetria");
    }

    const data = await resposta.json().catch(() => ({}));
    alert(`Colorimetria inserida com sucesso! ID: ${data.id || data.id_color || ''}`);

    document.getElementById("cod").value = "";
    document.getElementById("num_cores").value = "";
    document.getElementById("descricao").value = "";
  } catch (erro) {
    console.error("Erro ao inserir colorimetria:", erro);
    alert(`Não foi possível inserir a colorimetria: ${erro.message}`);
  }
}
