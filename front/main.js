// ------------------------------
// 📦 Importações dos módulos
// ------------------------------

// Papeis
import { ConsultarPapeis, desaparecerPapeis, carregarOpcoesPapeis } from '../modulos/modulos-papeis/listar_papeis.js';
import { InserirPapel } from '../modulos/modulos-papeis/inserir_papel.js';
import { habilitarEdicao } from '../modulos/modulos-papeis/editar_papel.js';
import { carregarPapeisParaExcluir, excluirPapel } from '../modulos/modulos-papeis/deletar_papel.js';

// Maquinas

import { InserirMaquina } from '../modulos/modulos-maquina/inserir_maquina.js';
import { ConsultarMaquinas, desaparecerMaquinas, carregarOpcoesMaquinas} from '../modulos/modulos-maquina/listar_maquina.js'
import { habilitarEdicaoMaquina } from '../modulos/modulos-maquina/editar_maquina.js'
import { carregarMaquinasParaExcluir, excluirMaquina } from '../modulos/modulos-maquina/deletar_maquina.js'

// Fornecedores

import { carregarFornecedoresParaExcluir, excluirFornecedor} from '../modulos/modulos-fornecedor/deletar_fornecedor.js'
import { habilitarEdicaoFornecedor } from '../modulos/modulos-fornecedor/editar_fornecedor.js'
import { InserirFornecedor } from '../modulos/modulos-fornecedor/inserir_fornecedor.js'
import { ConsultarFornecedores, carregarOpcoesFornecedores, desaparecerFornecedores, configurarBuscaFornecedores } from '../modulos/modulos-fornecedor/listar_fornecedor.js'

// Categorias
import { carregarCategoriasParaExcluir, excluirCategoria } from '../modulos/modulos-categoria/deletar_categoria.js'
import { habilitarEdicaoCategoria } from '../modulos/modulos-categoria/editar_categoria.js'
import { InserirCategoria } from '../modulos/modulos-categoria/inserir_categoria.js'
import { ConsultarCategorias, carregarOpcoesCategorias, desaparecerCategorias, configurarBuscaCategorias } from '../modulos/modulos-categoria/listar_categoria.js'

// Colorimetria
import { carregarColorimetriaParaExcluir, excluirColorimetria } from '../modulos/modulos-colorimetria/deletar_colorimetria.js'
import { habilitarEdicaoColorimetria } from '../modulos/modulos-colorimetria/editar_colorimetria.js'
import { InserirColorimetria } from '../modulos/modulos-colorimetria/inserir_colorimetria.js'
import { ConsultarColorimetria, carregarOpcoesColorimetria, desaparecerColorimetria, configurarBuscaColorimetria } from '../modulos/modulos-colorimetria/listar_colorimetria.js'

// Configurações
import { carregarConfigsParaExcluir, excluirConfig } from '../modulos/modulos-config/deletar_config.js'
import { habilitarEdicaoConfig } from '../modulos/modulos-config/editar_config.js'
import { InserirConfig } from '../modulos/modulos-config/inserir_config.js'
import { ConsultarConfigs, carregarOpcoesConfigs, desaparecerConfigs, configurarBuscaConfigs, carregarTabelasExternasConfig } from '../modulos/modulos-config/listar_config.js'

// Impressoras
import { carregarImpressorasParaExcluir, excluirImpressora } from '../modulos/modulos-impressora/deletar_impressora.js'
import { habilitarEdicaoImpressora } from '../modulos/modulos-impressora/editar_impressora.js'
import { InserirImpressora } from '../modulos/modulos-impressora/inserir_impressora.js'
import { ConsultarImpressoras, carregarOpcoesImpressoras, desaparecerImpressoras, configurarBuscaImpressoras } from '../modulos/modulos-impressora/listar_impressora.js'

// Substrato

import { carregarTabelasExternasSubstrato, ConsultarSubstratos, carregarOpcoesSubstratos} from '../modulos/modulos-substrato/listar_substrato.js'
import { InserirSubstrato } from '../modulos/modulos-substrato/inserir_substrato.js'
import { habilitarEdicaoSubstrato } from '../modulos/modulos-substrato/editar_substrato.js'
import { excluirSubstrato } from '../modulos/modulos-substrato/deletar_substrato.js'


// Fornecimentos 
import { carregarFornecimentosParaExcluir, excluirFornecimento } from '../modulos/modulos-fornecimento/deletar_fornecimento.js';
import { habilitarEdicaoFornecimento } from '../modulos/modulos-fornecimento/editar_fornecimento.js';
import { InserirFornecimento } from '../modulos/modulos-fornecimento/inserir_fornecimento.js';
import { ConsultarFornecimentos, desaparecerFornecimentos, carregarOpcoesFornecimentos, carregarTabelasExternasFornecimento, configurarBuscaFornecimentos } from '../modulos/modulos-fornecimento/listar_fornecimento.js';
 
// Serviços

import { carregarServicosParaExcluir, excluirServico} from '../modulos/modulos-servico/deletar_servico.js'
import { habilitarEdicaoServico } from '../modulos/modulos-servico/editar_servico.js'
import { InserirServico } from '../modulos/modulos-servico/inserir_servico.js'
import { ConsultarServicos, carregarOpcoesServicos, desaparecerServicos} from '../modulos/modulos-servico/listar_servico.js'


// Formatos

import { ConsultarFormatos, carregarOpcoesFormatos } from '../modulos/modulos-formato/listar_formatos.js'
import { InserirFormato } from '../modulos/modulos-formato/inserir_formatos.js'
import { habilitarEdicaoFormato } from '../modulos/modulos-formato/editar_formatos.js'
import { excluirFormato } from '../modulos/modulos-formato/deletar_formatos.js'


// Familias 

import { ConsultarFamilias, carregarOpcoesFamilias } from '../modulos/modulos-familia/listar_familia.js'
import {InserirFamilia } from '../modulos/modulos-familia/inserir_familia.js'
import { habilitarEdicaoFamilia} from '../modulos/modulos-familia/editar_familia.js'
import { excluirFamilia } from '../modulos/modulos-familia/deletar_familia.js'

// Itens

import { ConsultarItens, carregarOpcoesItens, carregarTabelasExternasItens } from '../modulos/modulos-item/listar_item.js'
import { InserirItem } from '../modulos/modulos-item/inserir_item.js'
import { habilitarEdicaoItem } from '../modulos/modulos-item/editar_item.js'
import { excluirItem } from '../modulos/modulos-item/deletar_item.js'


// Dimensao 

import { ConsultarDimensoes, carregarOpcoesDimensoes} from '../modulos/modulos-dimensao/listar_dimensao.js'
import { InserirDimensao } from '../modulos/modulos-dimensao/inserir_dimensao.js'
import { habilitarEdicaoDimensao } from '../modulos/modulos-dimensao/editar_dimensao.js'
import { excluirDimensao } from '../modulos/modulos-dimensao/deletar_dimensao.js'

// Orcamento 

import { ConsultarOrcamentos, carregarOpcoesOrcamentos} from '../modulos/modulos-orcamento/listar_orcamento.js'
import { InserirOrcamento } from '../modulos/modulos-orcamento/inserir_orcamento.js'
import { habilitarEdicaoOrcamento } from '../modulos/modulos-orcamento/editar_orcamento.js'
import { excluirOrcamento } from '../modulos/modulos-orcamento/deletar_orcamento.js'

// Produto

import { ConsultarProdutos, carregarOpcoesProdutos, carregarTabelasExternasProduto } from '../modulos/modulos-produto/listar_produto.js'
import { InserirProduto } from '../modulos/modulos-produto/inserir_produto.js'
import { habilitarEdicaoProduto } from '../modulos/modulos-produto/editar_produto.js'
import { excluirProduto } from '../modulos/modulos-produto/deletar_produto.js'

// Impressao

import { ConsultarImpressao, carregarOpcoesImpressao, carregarTabelasExternasImpressao, configurarBuscaImpressao } from '../modulos/modulos-impressao/listar_impressao.js'
import { InserirImpressao } from '../modulos/modulos-impressao/inserir_impressao.js';
import { habilitarEdicaoImpressao } from '../modulos/modulos-impressao/editar_impressao.js'
import { excluirImpressao } from '../modulos/modulos-impressao/deletar_impressao.js'

////////////////////////////////////////////////////////////////

// ------------------------------
// 📑 Detectar qual página está sendo carregada
// ------------------------------
const url = window.location.pathname;

// ------------------------------
// 📄 Página de Papéis
// ------------------------------
if (url.includes("papeis")) {

    const btnConsulta = document.getElementById("btn-consulta");
    const btnDesapareca = document.getElementById("btn-desapareca");
    const formPapel = document.getElementById("form-papel");
    const tipoPapel = document.getElementById("tipoPapel");
    const btnExcluir = document.getElementById("btnExcluir");

    if (btnConsulta) btnConsulta.addEventListener("click", ConsultarPapeis);
    if (btnDesapareca) btnDesapareca.addEventListener("click", desaparecerPapeis);
    if (formPapel) formPapel.addEventListener("submit", InserirPapel);
    if (tipoPapel) tipoPapel.addEventListener("change", habilitarEdicao);
    if (btnExcluir) btnExcluir.addEventListener("click", excluirPapel);

    window.addEventListener("DOMContentLoaded", carregarOpcoesPapeis);
    window.onload = carregarPapeisParaExcluir;
}

// ------------------------------
// ⚙️ Página de Máquinas
// ------------------------------
if (url.includes("maquinas")) {

    const formMaquina = document.getElementById("form-maquina");
    const btnConsulta = document.getElementById("btn-consulta-maquinas");
    const btnDesapareca = document.getElementById("btn-desapareca-maquinas");
    const tipoMaquina = document.getElementById("tipoMaquina");
    const btnExcluir = document.getElementById("btnExcluir");


    if (formMaquina) formMaquina.addEventListener("submit", InserirMaquina);
    if (btnConsulta) btnConsulta.addEventListener("click", ConsultarMaquinas);
    if (btnDesapareca) btnDesapareca.addEventListener("click", desaparecerMaquinas);
    if (tipoMaquina) tipoMaquina.addEventListener("change", habilitarEdicaoMaquina);
    if (btnExcluir) btnExcluir.addEventListener("click", excluirMaquina);

    window.addEventListener("DOMContentLoaded", carregarOpcoesMaquinas);
    window.onload = carregarMaquinasParaExcluir;

}

// ------------------------------
// Página de Fornecedores
// ------------------------------


if (url.includes("fornecedores")) {

  const formFornecedor = document.getElementById("form-fornecedor");
  const btnConsulta = document.getElementById("btn-consulta-fornecedores");
  const btnDesapareca = document.getElementById("btn-desapareca-fornecedores");
  const tipoFornecedor = document.getElementById("tipoFornecedor");
  const btnExcluir = document.getElementById("btnExcluir");

  if (formFornecedor) formFornecedor.addEventListener("submit", InserirFornecedor);
  if (btnConsulta) btnConsulta.addEventListener("click", ConsultarFornecedores);
  if (btnDesapareca) btnDesapareca.addEventListener("click", desaparecerFornecedores);
  if (tipoFornecedor) tipoFornecedor.addEventListener("change", habilitarEdicaoFornecedor);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirFornecedor);

  window.addEventListener("DOMContentLoaded", carregarOpcoesFornecedores);
  window.addEventListener("DOMContentLoaded", configurarBuscaFornecedores);
  window.onload = carregarFornecedoresParaExcluir;
}

// ------------------------------
// Página de Categorias
// ------------------------------
if (url.includes("categoria")) {
  const formCategoria = document.getElementById("form-categoria");
  const tipoCategoria = document.getElementById("tipoCategoria");
  const btnExcluirCat = document.getElementById("btnExcluir");
  const btnConsultaCat = document.getElementById("btn-consulta-categorias");
  const btnDesaparecaCat = document.getElementById("btn-desapareca-categorias");

  if (formCategoria) formCategoria.addEventListener("submit", InserirCategoria);
  if (btnConsultaCat) btnConsultaCat.addEventListener("click", ConsultarCategorias);
  if (btnDesaparecaCat) btnDesaparecaCat.addEventListener("click", desaparecerCategorias);
  if (tipoCategoria) tipoCategoria.addEventListener("change", habilitarEdicaoCategoria);
  if (btnExcluirCat) btnExcluirCat.addEventListener("click", excluirCategoria);

  window.addEventListener("DOMContentLoaded", carregarOpcoesCategorias);
  window.addEventListener("DOMContentLoaded", configurarBuscaCategorias);
  window.onload = carregarCategoriasParaExcluir;
}

// ------------------------------
// Página de Colorimetria
// ------------------------------
if (url.includes("colorimetria")) {
  const formColor = document.getElementById("form-colorimetria");
  const tipoColor = document.getElementById("tipoColorimetria");
  const btnExcluirColor = document.getElementById("btnExcluir");
  const btnConsultaColor = document.getElementById("btn-consulta-colorimetria");
  const btnDesaparecaColor = document.getElementById("btn-desapareca-colorimetria");

  if (formColor) formColor.addEventListener("submit", InserirColorimetria);
  if (btnConsultaColor) btnConsultaColor.addEventListener("click", ConsultarColorimetria);
  if (btnDesaparecaColor) btnDesaparecaColor.addEventListener("click", desaparecerColorimetria);
  if (tipoColor) tipoColor.addEventListener("change", habilitarEdicaoColorimetria);
  if (btnExcluirColor) btnExcluirColor.addEventListener("click", excluirColorimetria);

  window.addEventListener("DOMContentLoaded", carregarOpcoesColorimetria);
  window.addEventListener("DOMContentLoaded", configurarBuscaColorimetria);
  window.onload = carregarColorimetriaParaExcluir;
}

// ------------------------------
// Página de Configurações
// ------------------------------
if (url.includes("config")) {
  const formConfig = document.getElementById("form-config");
  const tipoConfig = document.getElementById("tipoConfig");
  const btnExcluirConfig = document.getElementById("btnExcluir");
  const btnConsultaConfig = document.getElementById("btn-consulta-configs");
  const btnDesaparecaConfig = document.getElementById("btn-desapareca-configs");

  if (formConfig) formConfig.addEventListener("submit", InserirConfig);
  if (btnConsultaConfig) btnConsultaConfig.addEventListener("click", ConsultarConfigs);
  if (btnDesaparecaConfig) btnDesaparecaConfig.addEventListener("click", desaparecerConfigs);
  if (tipoConfig) tipoConfig.addEventListener("change", habilitarEdicaoConfig);
  if (btnExcluirConfig) btnExcluirConfig.addEventListener("click", excluirConfig);

  window.addEventListener("DOMContentLoaded", carregarOpcoesConfigs);
  window.addEventListener("DOMContentLoaded", configurarBuscaConfigs);
  window.addEventListener("DOMContentLoaded", carregarTabelasExternasConfig);
  window.onload = carregarConfigsParaExcluir;
}

// ------------------------------
// Página de Impressoras
// ------------------------------
if (url.includes("impressoras")) {
  const formImpressora = document.getElementById("form-impressora");
  const tipoImpressora = document.getElementById("tipoImpressora");
  const btnExcluirImpr = document.getElementById("btnExcluir");
  const btnConsultaImpr = document.getElementById("btn-consulta-impressoras");
  const btnDesaparecaImpr = document.getElementById("btn-desapareca-impressoras");

  if (formImpressora) formImpressora.addEventListener("submit", InserirImpressora);
  if (btnConsultaImpr) btnConsultaImpr.addEventListener("click", ConsultarImpressoras);
  if (btnDesaparecaImpr) btnDesaparecaImpr.addEventListener("click", desaparecerImpressoras);
  if (tipoImpressora) tipoImpressora.addEventListener("change", habilitarEdicaoImpressora);
  if (btnExcluirImpr) btnExcluirImpr.addEventListener("click", excluirImpressora);

  window.addEventListener("DOMContentLoaded", carregarOpcoesImpressoras);
  window.addEventListener("DOMContentLoaded", configurarBuscaImpressoras);
  window.onload = carregarImpressorasParaExcluir;
}



// ------------------------------
// ⚙️ Página de Substrato
// ------------------------------


if (url.includes("substrato")) {
   const formSubstrato = document.getElementById("form-substrato");
   const tipoSubstrato = document.getElementById("tipoSubstrato");
   const btnExcluirSubstrato = document.getElementById("btnExcluirSubstrato");
   const btnConsultaSubstrato = document.getElementById("btn-consulta-substrato");
   const btnSalvarAlteracao = document.getElementById("btnSalvarAlteracao")
   const btnExcluir = document.getElementById("btnExcluir");

if (formSubstrato) formSubstrato.addEventListener("submit", InserirSubstrato);
   if (btnConsultaSubstrato) btnConsultaSubstrato.addEventListener("click", ConsultarSubstratos);
   if (tipoSubstrato) tipoSubstrato.addEventListener("change", habilitarEdicaoSubstrato);
   if (btnExcluirSubstrato) btnExcluirSubstrato.addEventListener("click", excluirSubstrato);
   if (btnExcluir) btnExcluir.addEventListener("click", excluirSubstrato);

  window.addEventListener("DOMContentLoaded", carregarOpcoesSubstratos);
  window.addEventListener("DOMContentLoaded", ConsultarSubstratos);
  window.addEventListener("DOMContentLoaded", carregarTabelasExternasSubstrato);
  window.addEventListener("DOMContentLoaded", carregarOpcoesCategorias);
}


// ------------------------------
// ⚙️ Página de Fornecimentos
// ------------------------------


if (url.includes("fornecimentos")) {

  const formFornecimento = document.getElementById("form-fornecimento");
  const btnConsulta = document.getElementById("btn-consulta-fornecimentos");
  const btnDesapareca = document.getElementById("btn-desapareca-fornecimentos");
  const tipoFornecimento = document.getElementById("fornecimentoEditar");
  const btnExcluir = document.getElementById("btnExcluir");

  if (formFornecimento) formFornecimento.addEventListener("submit", InserirFornecimento);
  if (btnConsulta) btnConsulta.addEventListener("click", ConsultarFornecimentos);
  if (btnDesapareca) btnDesapareca.addEventListener("click", desaparecerFornecimentos);
  if (tipoFornecimento) tipoFornecimento.addEventListener("change", habilitarEdicaoFornecimento);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirFornecimento);

  // ------------------------------
  // Carregar datalists de inserção e edição
  // ------------------------------
  window.addEventListener("DOMContentLoaded", () => {
    carregarOpcoesFornecimentos();       // datalist de edição/exclusão
    carregarFornecimentosParaExcluir();  // datalist de exclusão
    carregarOpcoesFornecedores();        // datalist do formulário de adicionar (fornecedor)
    carregarTabelasExternasFornecimento();
    configurarBuscaFornecimentos();
  });
}

// ------------------------------
// Página de Fornecedores
// ------------------------------

if (url.includes("servicos")) {

  const formServico = document.getElementById("form-servico");
  const btnDesapareca = document.getElementById("btn-desapareca-servicos");
  const tipoServico = document.getElementById("tipoServico");
  const btnExcluir = document.getElementById("btnExcluir");

  if (formServico) formServico.addEventListener("submit", InserirServico);
  if (btnDesapareca) btnDesapareca.addEventListener("click", desaparecerServicos);
  if (tipoServico) tipoServico.addEventListener("change", habilitarEdicaoServico);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirServico);


   // Carregar datalists e lista de exclusão quando a página estiver pronta
  window.addEventListener("DOMContentLoaded", carregarOpcoesServicos);
  window.addEventListener("DOMContentLoaded", ConsultarServicos);
  window.onload = carregarServicosParaExcluir;

}

// FORMATOS

if (url.includes("formato")) {

  const formFormato = document.getElementById('form-formato');
  const tipoFormato = document.getElementById('formatoEditar');
  const btnExcluir = document.getElementById("btnExcluir");

  if (formFormato) formFormato.addEventListener('submit', InserirFormato);
  if (tipoFormato) tipoFormato.addEventListener('change', habilitarEdicaoFormato);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirFormato);

  window.addEventListener("DOMContentLoaded", ConsultarFormatos);
  window.addEventListener("DOMContentLoaded", carregarOpcoesFormatos);
}


// FAMILIAS

if (url.includes("familia")) {

  const formFamilia = document.getElementById('form-familia');
  const tipoFamilia = document.getElementById('tipoFamilia');
  const btnExcluir = document.getElementById('btnExcluir');

  if (formFamilia) formFamilia.addEventListener('submit', InserirFamilia);
  if (tipoFamilia) tipoFamilia.addEventListener('change', habilitarEdicaoFamilia);
  if (btnExcluir) btnExcluir.addEventListener('click', excluirFamilia);

  window.addEventListener("DOMContentLoaded", () => {
    ConsultarFamilias();
    carregarOpcoesFamilias();
  });
}

// Itens

if (url.includes("item")) {

  const formItem = document.getElementById("form-item");
  const itemEditar = document.getElementById("itemEditar");
  const btnExcluir = document.getElementById("btnExcluir");

  

  if (formItem) {
    formItem.addEventListener("submit", async (event) => {
      event.preventDefault();

      const tipo = document.getElementById("tipo").value;

      const id_ref = document.getElementById("id_ref").value;
      const quant = Number(document.getElementById("quant").value);

      const cmpr = Number(document.getElementById("cmpr")?.value || document.getElementById("cmpr_imp")?.value || 0);
      const larg = Number(document.getElementById("larg")?.value || document.getElementById("larg_imp")?.value || 0);

      if (cmpr <= 0 || larg <= 0) {
        alert("Preencha comprimento e largura corretamente!");
        return;
      }

      const dimensao = tipo === "produto"
        ? {
            cmpr: cmpr / 100,
            larg: larg / 100,
            mrg_branca: Number(document.getElementById("mrg_branca")?.value || 0),
            mrg_interna: Number(document.getElementById("mrg_interna")?.value || 0),
            mrg_sangria: Number(document.getElementById("mrg_sangria")?.value || 0),
            mrg_espaco: Number(document.getElementById("mrg_espaco")?.value || 0),
          }
        : {
            cmpr,
            larg,
            mrg_branca: Number(document.getElementById("mrg_branca_imp")?.value || 0),
            mrg_interna: Number(document.getElementById("mrg_interna_imp")?.value || 0),
            mrg_sangria: Number(document.getElementById("mrg_sangria_imp")?.value || 0),
            mrg_espaco: Number(document.getElementById("mrg_espaco_imp")?.value || 0),
          };

      let refImpressao = null;

      if (tipo === "impressao") {
        refImpressao = {
          impressora: Number(document.getElementById("id_impres").value),
          cod_frente: Number(document.getElementById("cod_frente").value),
          cod_verso: Number(document.getElementById("cod_verso").value),
          velo: document.getElementById("velo").value + " iph"
        };
      }

      const id_item = document.getElementById("id_item")?.value 
                  || document.getElementById("itemEditar")?.value 
                  || null;

      const payload = {
        id_item: Number(id_item),   // 🔥 obrigatório
        tipo,
        id_ref: tipo === "impressao" ? refImpressao : Number(id_ref),
        quant,
        dimensao
      };


      // ===============================
      // 🔥 1) CALCULAR ITEM
      // ===============================
      const res = await fetch("http://localhost:3000/api/calculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensagem || "Erro no cálculo");

      // ===============================
      // 🔥 2) SOMAR AO ORÇAMENTO
      // ===============================
      const id_orc_raw = document.getElementById("id_orc").value;
      const id_orc = id_orc_raw.split("|")[0].trim();

      await fetch(`http://localhost:3000/api/orcamentos/${id_orc}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

    });

  }

  if (itemEditar) itemEditar.addEventListener("change", habilitarEdicaoItem);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirItem);

  window.addEventListener("DOMContentLoaded", () => {
    ConsultarItens();
    carregarOpcoesItens();
    carregarTabelasExternasItens();
    carregarTabelasExternasImpressao();
  });
}



// Dimensao 

if (url.includes("dimensao")) {

  const formDimensao = document.getElementById("form-dimensao");
  const tipoDimensao = document.getElementById("dimensaoSelecionada");
  const btnExcluir = document.getElementById("btnExcluirDimensao");

  if (formDimensao) formDimensao.addEventListener("submit", InserirDimensao);
  if (tipoDimensao) tipoDimensao.addEventListener("change", habilitarEdicaoDimensao);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirDimensao);
  

  window.addEventListener("DOMContentLoaded", () => {
    ConsultarDimensoes();
    carregarOpcoesDimensoes();
  })
}

// Orçamento

if (url.includes("orcamento")) {

  const formOrcamento = document.getElementById("form-orcamento");
  const orcEditar = document.getElementById("orcEditar");
  const btnExcluir = document.getElementById("btnExcluirOrc");

  if (formOrcamento) formOrcamento.addEventListener("submit", InserirOrcamento);
  if (orcEditar) orcEditar.addEventListener("change", habilitarEdicaoOrcamento);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirOrcamento);

  window.addEventListener("DOMContentLoaded", () => {
    ConsultarOrcamentos();
    carregarOpcoesOrcamentos();
  })
}

// Produtos

if (url.includes("produtos")) {

  const formProduto = document.getElementById("form-produto");
  const tipoProduto = document.getElementById("tipoProduto");
  const btnExcluir = document.getElementById("btnExcluir");

  if (formProduto) formProduto.addEventListener("submit", InserirProduto);
  if (tipoProduto) tipoProduto.addEventListener('change', habilitarEdicaoProduto);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirProduto);

  window.addEventListener("DOMContentLoaded", () => {
    ConsultarProdutos();
    carregarOpcoesProdutos();
    carregarTabelasExternasProduto();
  })
}

// impressao


if (url.includes("impressao")) {

  const formImpressao = document.getElementById("form-impressao");
  const editar = document.getElementById("impressaoEditar");
  const btnExcluir = document.getElementById("btnExcluir");

  if (formImpressao) formImpressao.addEventListener("submit", InserirImpressao);
  if (editar) editar.addEventListener("change", habilitarEdicaoImpressao);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirImpressao);

  window.addEventListener("DOMContentLoaded", () => {
    ConsultarImpressao();
    carregarOpcoesImpressao();;
    carregarTabelasExternasImpressao();
  })
}

