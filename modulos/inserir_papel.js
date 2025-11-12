import { ConsultarPapeis } from './listar_papeis.js';

export async function InserirPapel(event) {
  event.preventDefault();

  const novoPapel = {
    nome: document.getElementById("nome").value,
    form9: document.getElementById("form9").value,
    form8: document.getElementById("form8").value,
    form6: document.getElementById("form6").value,
    form4: document.getElementById("form4").value,
    form3: document.getElementById("form3").value,
    form2: document.getElementById("form2").value,
    unit: document.getElementById("unit").value,
    form: document.getElementById("form").value,
    quantPac: document.getElementById("quantPac").value,
    "pac": document.getElementById("pac").value
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/papeis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoPapel)
    });

    if (!resposta.ok) throw new Error("Erro ao inserir papel");

    const data = await resposta.json();
    alert(data.mensagem); // mostra mensagem de sucesso
    ConsultarPapeis();    // atualiza lista na tela
  } catch (erro) {
    console.error("Erro ao inserir papel:", erro);
    alert("Não foi possível inserir o papel.");
  }
}
