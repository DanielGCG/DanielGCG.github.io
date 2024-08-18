const http = require('http');
const fs = require('fs');
const path = require('path');

// Cria um servidor HTTP
const server = http.createServer((req, res) => {
  // Define o caminho absoluto do arquivo index.html
  const filePath = path.join(__dirname, 'index.html');

  // Lê o arquivo index.html
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Em caso de erro, retorna uma mensagem de erro
      res.writeHead(500);
      res.end('Erro ao carregar a página.');
    } else {
      // Caso contrário, envia o conteúdo do index.html
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

// Define a porta em que o servidor vai escutar
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});