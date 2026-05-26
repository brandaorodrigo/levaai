# install

install **dependencies**
```bash
npm install
```

# run

run the project in different environments

**development**
```bash
npm start
```

**staging**
```bash
npm staging
```

**production**
```bash
npm production
```

# api

```url
https://levaai-api.onrender.com/api/docs
```


# motorista

32988393224
levaai123


# TODO 

1 - No endpoint /locations/cep -> se buscar um Bairro que nao pode ja retornar um erro e nao devolver endereço nem em partes
2 - No endpoint nao pode exigir CEP quase ninguem sabe o proprio CEP
3 - Preciso de um endpoint que retorne para o passageiro a corrida que ele está nesse momento, nao pode ser baseada em ID pq o cliente pode fechar o site e reabrir e eu perder o ID da corrida.
4 - Preciso de um endpoint que faça o mesmo para o motorista e retorne a corrida atual dele sem precisar de passar ID, pelos mesmos motivos.
5 - Nesse retorno da corrida atual preciso que esteja o status dela (para eu saber se ela esta em andamento ou se ja foi finalizada pelo motorista - se for finalizada eu vou mostrar o avaliar)
