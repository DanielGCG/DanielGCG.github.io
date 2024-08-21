require('dotenv').config();
const fetch = require('node-fetch').default;
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

// Cria uma instância do Express
const app = express();

// Adiciona o middleware CORS
app.use(cors());

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

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

// Configura a autenticação OAuth 1.0a
const oauth = OAuth({
    consumer: {
        key: process.env.TWITTER_CONSUMER_KEY,
        secret: process.env.TWITTER_CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
});

// Rota para enviar um tweet
app.post('/send-tweet', async (req, res) => {
    const { text } = req.body;

    const token = {
        key: process.env.TW_ACCESS_TOKEN,
        secret: process.env.TW_ACCESS_TOKEN_SECRET
    };

    const request_data = {
        url: 'https://api.twitter.com/1.1/statuses/update.json',
        method: 'POST',
        data: { status: text }
    };

    try {
        const authHeader = oauth.toHeader(oauth.authorize(request_data, token)).Authorization;

        const response = await fetch(request_data.url, {
            method: request_data.method,
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(request_data.data)
        });

        if (response.ok) {
            const result = await response.json();
            res.json(result);
        } else {
            const error = await response.json();
            console.error('Twitter API Error:', error); // Log detalhado do erro
            res.status(response.status).json(error);
        }
    } catch (error) {
        console.error('Erro ao enviar o tweet:', error); // Log detalhado do erro
        res.status(500).json({ error: 'Erro ao enviar o tweet' });
    }
});

// Middleware para lidar com arquivos e diretórios
app.use((req, res, next) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send('Página não encontrada');
            } else {
                res.status(500).send('Erro ao carregar a página.');
            }
        } else if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        res.status(404).send('Página não encontrada');
                    } else {
                        res.status(500).send('Erro ao carregar a página.');
                    }
                } else {
                    res.status(200).type('html').send(content);
                }
            });
        } else {
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
                    if (err.code === 'ENOENT') {
                        res.status(404).send('Página não encontrada');
                    } else {
                        res.status(500).send('Erro ao carregar a página.');
                    }
                } else {
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
