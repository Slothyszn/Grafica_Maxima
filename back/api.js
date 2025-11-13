import app from './config.js'
import papeis from './endpoints/papeis_endpoints.js'
import maquinas from './endpoints/maquinas_endpoints.js'
const PORT = 3000;

app.use('/api', papeis);
app.use('/api', maquinas);

app.listen(PORT, () => {
  console.log("Server rodando na porta: " + PORT);
});
