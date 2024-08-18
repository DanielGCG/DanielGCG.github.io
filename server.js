const http = require('http');
const fs = require('fs');
const path = require('path');

// Cria um servidor HTTP
const server = http.createServer((req, res) => {
  // Define o caminho absoluto do arquivo solicitado
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // Define o tipo de conteúdo de acordo com a extensão do arquivo
  let contentType = 'text/html';
  if (filePath.endsWith('.css')) {
    contentType = 'text/css';
  } else if (filePath.endsWith('.js')) {
    contentType = 'application/javascript';
  } else if (filePath.endsWith('.png')) {
    contentType = 'image/png';
  } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
    contentType = 'image/jpeg';
  } else if (filePath.endsWith('.gif')) {
    contentType = 'image/gif';
  }

  // Lê o arquivo solicitado
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Verifica se o erro é por arquivo não encontrado
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Página não encontrada');
      } else {
        // Em caso de outro erro, retorna um erro 500
        res.writeHead(500);
        res.end('Erro ao carregar a página.');
      }
    } else {
      // Envia o conteúdo do arquivo solicitado
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Define a porta em que o servidor vai escutar
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
