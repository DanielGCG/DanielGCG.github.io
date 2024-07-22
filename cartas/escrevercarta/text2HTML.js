// Função para gerar HTML e fazer upload
function generateHTML() {
    var title = document.getElementById('title').value;
    var text = document.getElementById('text').value;
    var color = document.getElementById('color').value;
    var senderName = document.getElementById('senderName').value;
    var recipientName = document.getElementById('recipientName').value;
    var code = document.getElementById('code').value
    text2HTML(title, text, color, senderName, recipientName, code);
}

function text2HTML(title, text, color, senderName, recipientName, code) {
    // 1: Plain Text Search
    var formattedText = text.replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");

    // 2: Line Breaks
    formattedText = formattedText.replace(/\r\n?|\n/g, "<br>");

    // 3: Paragraphs
    formattedText = formattedText.replace(/<br>\s*<br>/g, "</p><p>");

    // 4: Wrap in Paragraph Tags
    formattedText = "<p>" + formattedText + "</p>";

    // 5: Create HTML Blob
    var htmlContent = `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
            </head>

            <body>
                <div id="pagina">
                    <div id="cabecalho">
                        <h1>${title}</h1>
                    </div>
                    
                    <div id="post">
                        <p>De: ${senderName}</p>
                        <p>Para: ${recipientName}</p>
                    </div>
                    
                    <div id="post">
                        <h3 style="text-align: center;">💌 Mensagem 💌</h3>
                        ${text}
                    </div>
                </div>
            </body>

            <style>

                body{
                    background: ${color};
                    background-size: cover;
                }

                #pagina{
                    position:relative;
                    top: 0;
                    left: 0;
                }

                #cabecalho{
                    position: relative;
                    text-align: center;
                    font-size:180%;
                }

                #post{
                    position:relative;
                    font-size:110%;
                    top: -10px;
                    font-family: 'Times New Roman', Times, serif;
                    margin-inline: 30px;
                    text-justify: newspaper;
                }

                .img-play {
                        display: block;
                        margin: 1rem auto;
                        cursor: pointer;
                        cursor: help;
                        width: 200px; /* ajuste conforme necessário */
                        height: auto; /* manter proporção */
                    }
            </style>
        </html>
        `;
    var blob = new Blob([htmlContent], { type: 'text/html' });

    // 6: Create a link element to download the blob
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = code;

    // 7: Append the link to the body and click it to trigger the download
    document.body.appendChild(link);
    link.click();

    // 8: Remove the link from the document
    document.body.removeChild(link);
}