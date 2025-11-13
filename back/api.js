import app from './config.js'
import papeis from './endpoints/papeis_endpoints.js'
import maquinas from './endpoints/maquinas_endpoints.js'
import fornecedores from './endpoints/fornecedor_endpoints.js'
import materiais from './endpoints/materiais.js'
const PORT = 3000;

app.use('/api', papeis);
app.use('/api', maquinas);
app.use('/api', fornecedores);
app.use('/api', materiais);

app.listen(PORT, () => {
  console.log("Server rodando na porta: " + PORT);
});
