import app from './config.js'
import papeis from './papeis_endpoints.js'
const PORT = 3000;

app.use('/api', papeis);

app.listen(PORT, () => {
  console.log("Server rodando na porta: " + PORT);
});
