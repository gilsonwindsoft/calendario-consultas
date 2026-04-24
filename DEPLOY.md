# 🩺 Deploy no Coolify

## Estrutura dos arquivos

```
consultas-coolify/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.js
├── .gitignore
└── public/
    └── index.html
```

---

## Passo 1 — Subir para um repositório Git

O Coolify puxa o código de um repositório Git.
Use GitHub, GitLab ou Gitea (qualquer um serve).

1. Crie um repositório (pode ser privado)
2. Faça upload de **todos** os arquivos desta pasta
3. Certifique-se que a pasta `public/` com o `index.html` está incluída

---

## Passo 2 — Criar o projeto no Coolify

1. No Coolify, clique em **"New Resource"**
2. Escolha **"Docker Compose"**
3. Conecte ao seu repositório Git
4. Coolify detecta o `docker-compose.yml` automaticamente

---

## Passo 3 — Configurar o volume (dados persistentes)

O banco SQLite fica salvo no volume `consultas_data` mapeado em `/data`.
O Coolify gerencia o volume automaticamente — os dados sobrevivem a restarts e deploys.

---

## Passo 4 — Configurar domínio

1. Em **"Domains"** no Coolify, adicione seu domínio ou use o subdomínio gerado
2. Ative **HTTPS** (Coolify gera o certificado SSL automaticamente via Let's Encrypt)

---

## Passo 5 — Deploy

Clique em **"Deploy"**. O Coolify vai:
1. Buildar a imagem Docker
2. Instalar as dependências Node.js
3. Subir o container
4. Configurar o domínio com HTTPS

---

## Atualizações futuras

Para atualizar o app basta editar o `public/index.html`,
fazer push no Git e clicar em **"Redeploy"** no Coolify.

Os dados **não são apagados** no redeploy pois ficam no volume separado.

---

## Testar localmente antes do deploy (opcional)

Se tiver Docker instalado na sua máquina:

```bash
docker compose up --build
```

Acesse http://localhost:3000
