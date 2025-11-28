// listar_fornecedor.js

// Consulta e exibe todos os fornecedores
export async function ConsultarFornecedores() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/fornecedores");
    const dados = await resposta.json();
    const fornecedores = Array.isArray(dados) ? dados : dados.Fornecedor || [];

    const lista = fornecedores.map(f => f.nome).join("<br>");
    document.getElementById("resultado-fornecedores").innerHTML = lista;
  } catch (erro) {
    console.error("❌ Erro ao consultar fornecedores:", erro);
    document.getElementById("resultado-fornecedores").innerHTML = "<li>Erro ao carregar fornecedores</li>";
  }
}

// Faz as informações sumirem
export async function desaparecerFornecedores() {
  document.getElementById("resultado-fornecedores").textContent = '';
}

// Carrega opções do datalist para o input
export async function carregarOpcoesFornecedores() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/fornecedores");
    const dados = await resposta.json();
    const fornecedores = Array.isArray(dados) ? dados : dados.Fornecedor || [];

    const datalist = document.getElementById("listaFornecedores");
    datalist.innerHTML = ""; // limpa antes de inserir

    fornecedores.forEach(fornecedor => {
      const option = document.createElement("option");
      option.value = fornecedor.nome;
      datalist.appendChild(option);
    });

    console.log("✅ Opções de fornecedores carregadas:", fornecedores.length);
  } catch (erro) {
    console.error("❌ Erro ao carregar opções de fornecedores:", erro);
  }
}

// Configura a barra de pesquisa com lista inicial + filtro
export async function configurarBuscaFornecedores() {
    const input = document.getElementById("busca");
    const tabelaBody = document.querySelector("#resultado tbody");

    // Função para renderizar os fornecedores na tabela
    function renderizarTabela(fornecedores) {
        if (!fornecedores.length) {
            tabelaBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhum resultado encontrado</td></tr>`;
            return;
        }

        tabelaBody.innerHTML = fornecedores.map(f => `
            <tr>
                <td>${f.id_forn}</td>
                <td>${f.nome}</td>
                <td>${f.contato}</td>
            </tr>
        `).join("");
    }

    // 1️⃣ Carrega todos inicialmente
    try {
        const resInicial = await fetch("https://grafica-maxima.onrender.com/api/fornecedores");
        const dados = await resInicial.json();
        const fornecedores = Array.isArray(dados) ? dados : dados.Fornecedor || [];
        renderizarTabela(fornecedores);
    } catch (erro) {
        tabelaBody.innerHTML = `<tr><td colspan="3">Erro ao carregar fornecedores</td></tr>`;
        console.error(erro);
    }

    // 2️⃣ Atualiza conforme digita
    input.addEventListener("input", async () => {
        const termo = input.value.trim();

        if (!termo) {
            try {
                const res = await fetch("https://grafica-maxima.onrender.com/api/fornecedores");
                const dados = await res.json();
                const fornecedores = Array.isArray(dados) ? dados : dados.Fornecedor || [];
                renderizarTabela(fornecedores);
            } catch (erro) {
                tabelaBody.innerHTML = `<tr><td colspan="3">Erro ao carregar fornecedores</td></tr>`;
                console.error(erro);
            }
            return;
        }

        try {
            const res = await fetch(`https://grafica-maxima.onrender.com/api/fornecedores/buscar?q=${encodeURIComponent(termo)}`);
            const dados = await res.json();
            renderizarTabela(dados);
        } catch (erro) {
            tabelaBody.innerHTML = `<tr><td colspan="3">Erro na busca</td></tr>`;
            console.error(erro);
        }
    });
}
