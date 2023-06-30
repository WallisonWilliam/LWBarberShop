# Como rodar a API de forma local?

Primeiro digite no terminal os seguintes comandos:

`pip install fastapi`

`pip install uvicorn`

`pip install sqlmodel`

Agora que você ja baixou tudo certinho, está na hora de rodar, utilize o comando `uvicorn main:app --reload --host 0.0.0.0 --port 8000`, e agora você pode acessar a API em http://127.0.0.1:8000 e a documentação em http://127.0.0.1:8000/docs.