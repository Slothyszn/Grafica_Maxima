import app from './config.js'
import papeis from './endpoints/papeis_endpoints.js'
import fornecedores from './endpoints/fornecedor_endpoints.js'
import categorias from './endpoints/categoria_endpoints.js'
import colorimetria from './endpoints/colorimetria_endpoints.js'
import impressoras from './endpoints/impressora_endpoints.js'
import configs from './endpoints/config_endpoints.js'
import fornecimento from './endpoints/fornecimento_endpoints.js'
import servico from './endpoints/servicos_endpoints.js'
import familia from './endpoints/familia_endpoints.js'
import substrato from './endpoints/substrato_endpoints.js'
import formato from './endpoints/formato_endpoints.js'
import item from './endpoints/item_endpoints.js'
import dimensao from './endpoints/dimensao_endpoints.js'
import orcamento from './endpoints/orcamento_endpoints.js'
import produtos from './endpoints/produtos_endpoints.js'
import impressao from './endpoints/impressao_endpoint.js'
import maoObra from './endpoints/maoObra_endpoints.js'
import calculo from './endpoints/calculos.js'
const PORT = 3000;

app.use('/api', familia);
app.use('/api', papeis);
app.use('/api', fornecedores);
app.use('/api', categorias);
app.use('/api', colorimetria);
app.use('/api', impressoras);
app.use('/api', configs);
app.use('/api', fornecimento);
app.use('/api', servico);
app.use('/api', substrato);
app.use('/api', formato);
app.use('/api', item);
app.use('/api', dimensao);
app.use('/api', orcamento);
app.use('/api', produtos);
app.use('/api', impressao);
app.use('/api', maoObra);
app.use('/api', calculo);

app.listen(PORT, () => {
  console.log("Server rodando na porta: " + PORT);
});
