#Responsible for signing, encoding and decoding JWT tokens
import jwt
import time

JWT_SECRET = "60d89b4292e495b00d1b"
JWT_ALGORITHM = "HS256"

def token_response(token: str):
    return {
        "access_token": token
    }
    
def signJWT(user_id: str):
    payload = {
        "user_id": user_id,
        "expires": time.time() + 600
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    print(token)
    return token

def decodeJWT(token: str):
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except:
        return {}