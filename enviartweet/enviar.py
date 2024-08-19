import tweepy
import os

# Recupere as credenciais da API do Twitter a partir das variáveis de ambiente
TW_API_KEY = os.getenv('TW_API_KEY')
TW_API_SECRET_KEY = os.getenv('TW_API_SECRET_KEY')
TW_ACCESS_TOKEN = os.getenv('TW_ACCESS_TOKEN')
TW_ACCESS_TOKEN_SECRET = os.getenv('TW_ACCESS_TOKEN_SECRET')

# Autenticação na API do Twitter
auth = tweepy.OAuth1UserHandler(TW_API_KEY, TW_API_SECRET_KEY, TW_ACCESS_TOKEN, TW_ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

# Enviar um tweet
def enviar_tweet(mensagem):
    try:
        api.update_status(mensagem)
        print("Tweet enviado com sucesso!")
    except Exception as e:
        print(f"Erro ao enviar tweet: {e}")
