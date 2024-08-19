require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

// Cria uma instância do Express
const app = express();

// Define o diretório 'public' como estático para servir arquivos estáticos como HTML, CSS, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para enviar as configurações do Firebase ao frontend
app.get('/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.FB_apiKey,
        authDomain: process.env.FB_authDomain,
        projectId: process.env.FB_projectId,
        storageBucket: process.env.FB_storageBucket,
        messagingSenderId: process.env.FB_messagingSenderId,
        appId: process.env.FB_appId
    });
});

// Middleware para lidar com arquivos e diretórios
app.use((req, res, next) => {
    // Define o caminho absoluto do arquivo solicitado
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    // Verifica se o caminho é um diretório
    fs.stat(filePath, (err, stats) => {
        if (err) {
            // Se o arquivo não for encontrado, retornar erro 404
            if (err.code === 'ENOENT') {
                res.status(404).send('Página não encontrada');
            } else {
                // Em caso de outro erro, retornar erro 500
                res.status(500).send('Erro ao carregar a página.');
            }
        } else if (stats.isDirectory()) {
            // Se o caminho for um diretório, redireciona para index.html dentro do diretório
            filePath = path.join(filePath, 'index.html');
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    // Se o arquivo index.html não for encontrado, retornar erro 404
                    if (err.code === 'ENOENT') {
                        res.status(404).send('Página não encontrada');
                    } else {
                        // Em caso de outro erro, retornar erro 500
                        res.status(500).send('Erro ao carregar a página.');
                    }
                } else {
                    // Envia o conteúdo do arquivo solicitado
                    res.status(200).type('html').send(content);
                }
            });
        } else {
            // Se o caminho não for um diretório, trata o arquivo normalmente
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

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    // Verifica se o erro é por arquivo não encontrado
                    if (err.code === 'ENOENT') {
                        res.status(404).send('Página não encontrada');
                    } else {
                        // Em caso de outro erro, retorna um erro 500
                        res.status(500).send('Erro ao carregar a página.');
                    }
                } else {
                    // Envia o conteúdo do arquivo solicitado
                    res.status(200).type(contentType).send(content);
                }
            });
        }
    });
});

// Define a porta em que o servidor vai escutar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
