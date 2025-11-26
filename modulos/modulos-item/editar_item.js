export async function habilitarEdicaoItem() {
  const selecionado = document.getElementById("itemEditar").value;
  if (!selecionado) return;

  const idSelecionado = selecionado.split(" | ")[0];

  try {
    const resposta = await fetch("http://localhost:3000/api/itens");
    const dados = await resposta.json();
    const itens = Array.isArray(dados) ? dados : dados.Item || [];

    const item = itens.find(i => String(i.id_item) === String(idSelecionado));
    if (!item) return alert("Item não encontrado");

    const formEditar = document.getElementById("editar-item");
    if (formEditar) formEditar.style.display = "block";

    const campoSelect = document.getElementById("campoEditar");
    const novoValorInput = document.getElementById("novoValor");

    if (campoSelect && novoValorInput) {
      campoSelect.addEventListener("change", async () => {
        const campo = campoSelect.value;

        // limpa antes
        novoValorInput.removeAttribute("list");
        novoValorInput.placeholder = "Novo valor";

        let listaId = [];
        let datalistId = "";

        if (campo === "id_orc") {
          const res = await fetch("http://localhost:3000/api/orcamentos");
          const dadosOrc = await res.json();
          listaId = dadosOrc.Orcamento.map(o => o.id_orc);
          datalistId = "listaOrcEdit";
          novoValorInput.placeholder = "Escolha o orçamento (ID)";
        }

        if (campo === "id_ref") {
          if (item.tipo === "impressao") {
            const res = await fetch("http://localhost:3000/api/impressao");
            const dadosImp = await res.json();
            listaId = dadosImp.Impressao.map(i => i.id_imp);
            datalistId = "listaImpEdit";
            novoValorInput.placeholder = "Escolha a impressão (ID)";
          }

          if (item.tipo === "produto") {
            const res = await fetch("http://localhost:3000/api/produtos");
            const dadosProd = await res.json();
            listaId = dadosProd.Produto.map(p => p.id_prod);
            datalistId = "listaProdEdit";
            novoValorInput.placeholder = "Escolha o produto (ID)";
          }

          if (item.tipo === "servico") {
            const res = await fetch("http://localhost:3000/api/servicos");
            const dadosServ = await res.json();
            listaId = dadosServ.Servico.map(s => s.id_serv);
            datalistId = "listaServEdit";
            novoValorInput.placeholder = "Escolha o serviço (ID)";
          }
        }

        // cria ou atualiza datalist
        if (listaId.length > 0 && datalistId) {
          let datalist = document.getElementById(datalistId);
          if (!datalist) {
            datalist = document.createElement("datalist");
            datalist.id = datalistId;
            document.body.appendChild(datalist);
          }
          datalist.innerHTML = ""; // limpa opções antigas
          listaId.forEach(id => {
            const option = document.createElement("option");
            option.value = id;
            datalist.appendChild(option);
          });

          novoValorInput.setAttribute("list", datalistId);
        }
      });
    }


    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value.trim();

      if (!campo || !novoValor) return alert("Escolha o campo e o novo valor.");

      const payload = { campo, novoValor };

      try {
        const respostaPut = await fetch(`http://localhost:3000/api/itens/${item.id_item}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!respostaPut.ok) {
          const erroData = await respostaPut.json().catch(() => ({}));
          throw new Error(erroData.mensagem || "Falha ao atualizar item.");
        }

        alert("Item atualizado com sucesso!");
        if (formEditar) formEditar.style.display = "none";

      } catch (erro) {
        console.error("Erro ao atualizar item:", erro);
        alert(`Erro: ${erro.message}`);
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar itens:", erro);
    alert("Erro ao carregar itens.");
  }
}
