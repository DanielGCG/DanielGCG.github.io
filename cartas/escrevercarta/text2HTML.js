// Função para gerar HTML e fazer upload
function generateHTML() {
    var title = document.getElementById('title').value;
    var text = document.getElementById('text').value;
    var color = document.getElementById('color').value;
    var senderName = document.getElementById('senderName').value;
    var senderEmail = document.getElementById('senderEmail').value;
    var recipientName = document.getElementById('recipientName').value;
    var recipientEmail = document.getElementById('recipientEmail').value;
    text2HTML(title, text, color, senderName, senderEmail, recipientName, recipientEmail);
}

function text2HTML(title, text, color, senderName, senderEmail, recipientName, recipientEmail) {
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
    var htmlContent = "<html><head><title>" + title + "</title><style>body {background: " + color + "; background-size: cover;} #pagina {position: relative; top: 0; left: 0;} #cabecalho {position: relative; text-align: center; font-size: 180%;} #post {position: relative; font-size: 110%; top: -10px; font-family: 'Times New Roman', Times, serif; margin-inline: 30px; text-justify: newspaper;} .sender-recipient {margin: 20px 0;} .sender, .recipient {margin-bottom: 10px;} .sender-email, .recipient-email {font-style: italic;}</style></head><body><div id='pagina'><div id='cabecalho'><h1>" + title + "</h1></div><div class='sender-recipient'><div class='sender'><strong>From:</strong> " + senderName + (senderEmail ? " (<span class='sender-email'>" + senderEmail + "</span>)" : "") + "</div><div class='recipient'><strong>To:</strong> " + recipientName + (recipientEmail ? " (<span class='recipient-email'>" + recipientEmail + "</span>)" : "") + "</div></div><div id='post'>" + formattedText + "</div></div></body></html>";
    var blob = new Blob([htmlContent], { type: 'text/html' });

    // 6: Create a link element to download the blob
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formatted_text.html';

    // 7: Append the link to the body and click it to trigger the download
    document.body.appendChild(link);
    link.click();

    // 8: Remove the link from the document
    document.body.removeChild(link);
}
