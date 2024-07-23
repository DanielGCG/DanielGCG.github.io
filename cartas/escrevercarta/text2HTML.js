function generateHTML() {
    var title = document.getElementById('title').value;
    var text = document.getElementById('text').value;
    var color = document.getElementById('color').value;
    var senderName = document.getElementById('senderName').value;
    var recipientName = document.getElementById('recipientName').value;
    var code = document.getElementById('code').value;
    text2HTML(title, text, color, senderName, recipientName, code);
}

function text2HTML(title, text, color, senderName, recipientName, code) {
    // 1: Plain Text Search
    var formattedText = text.replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");

    // 2: Preserve multiple spaces
    formattedText = formattedText.replace(/  /g, ' &nbsp;'); // replace double spaces with space + &nbsp;

    // 3: Line Breaks
    formattedText = formattedText.replace(/\r\n?|\n/g, "<br>");

    // 4: Wrap in Paragraph Tags and table rows
    var lines = formattedText.split("<br>");
    formattedText = lines.map(line => `<tr><td><p>${line.trim() || "&nbsp;"}</p></td></tr>`).join("");

    // 5: Create HTML Blob
    var htmlContent = `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
            </head>
            <body>
                <div id="post">
                    <div class="notebook-paper">
                        <div id="cabecalho">
                            <h1>${title}</h1>
                        </div>
                        <h3 style="text-align: center;">✉️ Cartinha ✉️</h3>
                        <table>
                            <tr><td><p>De: ${senderName}</p></td></tr>
                            <tr><td><p>Para: ${recipientName}</p></td></tr>
                            ${formattedText}
                        </table>
                    </div>
                </div>
            </body>
            <style>
                body {
                    background: ${color};
                    background-size: cover;
                }
                #pagina {
                    position: relative;
                    top: 0;
                    left: 0;
                }
                #cabecalho {
                    text-align: center;
                    font-size: 180%;
                    margin-bottom: 20px;
                }
                #post {
                    position: relative;
                    font-size: 110%;
                    top: -10px;
                    font-family: 'Times New Roman', Times, serif;
                    margin-inline: 30px;
                    text-align: justify;
                }
                .img-play {
                    display: block;
                    margin: 1rem auto;
                    cursor: pointer;
                    width: 200px; /* ajuste conforme necessário */
                    height: auto; /* manter proporção */
                }
                .notebook-paper {
                    border: 1px solid #fbfeaa;
                    padding: 10px;
                    background-color: #fbfeaa;
                }
                .notebook-paper table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .notebook-paper td {
                    padding: 0;
                    margin: 0;
                    border-bottom: 1px solid #ffd700; /* linha de fundo */
                    vertical-align: top;
                }
                .notebook-paper p {
                    margin: 0;
                    padding: 0;
                    line-height: 25px; /* altura da linha pautada */
                    word-wrap: break-word; /* faz o texto quebrar para a próxima linha quando necessário */
                    min-height: 25px; /* garantir altura mínima da linha */
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
