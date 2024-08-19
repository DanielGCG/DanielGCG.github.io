from flask import Flask, request, jsonify
from enviar import enviar_tweet
import os

app = Flask(__name__)

@app.route('/send-tweet', methods=['POST'])
def send_tweet():
    data = request.json
    mensagem = data.get('mensagem', 'Mensagem padrão')
    try:
        enviar_tweet(mensagem)
        return jsonify({"status": "success", "message": "Tweet enviado com sucesso!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
