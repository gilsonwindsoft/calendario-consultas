# 🩺 Minhas Consultas

Aplicativo web para controle de consultas médicas/terapêuticas e pagamentos. Desenvolvido para uso pessoal e familiar, com visual moderno, interface mobile-first e sincronização em tempo real entre dispositivos.

---

## Funcionalidades

- **Calendário interativo** — visualiza consultas e pagamentos diretamente nos dias do mês, com cores distintas para cada tipo de registro
- **Registro de consultas** — cadastra a data e uma observação opcional (ex: nome do médico, tipo de consulta)
- **Registro de pagamentos** — cadastra data, valor pago e observação (ex: Pix, parcial)
- **Resumo financeiro** — exibe o total de consultas, total pago e saldo devedor em tempo real
- **Histórico** — lista todos os registros agrupados por mês, com opção de exclusão
- **Modal de dia** — ao clicar em um dia do calendário, exibe os detalhes das consultas e pagamentos daquele dia
- **Sincronização automática** — atualiza os dados a cada 30 segundos, mantendo múltiplos dispositivos sincronizados
- **Interface responsiva** — otimizada para uso em celular

---

## Stack

| Camada     | Tecnologia                        |
|------------|-----------------------------------|
| Backend    | Node.js 20 + Express              |
| Banco      | SQLite via `better-sqlite3`       |
| Frontend   | React 18 (via CDN, sem build)     |
| Container  | Docker + Docker Compose           |
| Deploy     | Coolify (ou qualquer host Docker) |

---

## Estrutura do projeto

```
.
├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.js          # API REST + servidor de arquivos estáticos
└── public/
    └── index.html     # SPA React (sem bundler)
```

---

## Rodando localmente

**Pré-requisito:** Docker instalado.

```bash
docker compose up --build
```

Acesse [http://localhost:3000](http://localhost:3000).

Os dados são persistidos no volume Docker `consultas_data` (mapeado em `/data` dentro do container) e **sobrevivem a restarts e rebuilds**.

---

## API

| Método   | Rota                    | Descrição                       |
|----------|-------------------------|---------------------------------|
| `GET`    | `/api/consultas`        | Lista todas as consultas        |
| `POST`   | `/api/consultas`        | Registra uma consulta           |
| `DELETE` | `/api/consultas/:id`    | Remove uma consulta             |
| `GET`    | `/api/pagamentos`       | Lista todos os pagamentos       |
| `POST`   | `/api/pagamentos`       | Registra um pagamento           |
| `DELETE` | `/api/pagamentos/:id`   | Remove um pagamento             |
| `GET`    | `/api/resumo`           | Retorna totais e saldo          |
| `GET`    | `/health`               | Health check do container       |

### Exemplo — registrar consulta

```bash
curl -X POST http://localhost:3000/api/consultas \
  -H "Content-Type: application/json" \
  -d '{"data": "2026-04-24", "valor": 220.00, "observacao": "Dr. Silva"}'
```

### Exemplo — registrar pagamento

```bash
curl -X POST http://localhost:3000/api/pagamentos \
  -H "Content-Type: application/json" \
  -d '{"data": "2026-04-24", "valor": 220.00, "observacao": "Pix"}'
```

---

## Deploy no Coolify

Veja as instruções completas em [DEPLOY.md](DEPLOY.md).

Resumo:

1. Suba o repositório no GitHub/GitLab/Gitea
2. No Coolify, crie um novo recurso do tipo **Docker Compose**
3. Conecte ao repositório — o `docker-compose.yml` é detectado automaticamente
4. Configure o domínio e ative HTTPS (certificado gerado via Let's Encrypt)
5. Clique em **Deploy**

Para atualizar, faça push no Git e clique em **Redeploy**. Os dados não são apagados.

---

## Variáveis de ambiente

| Variável   | Padrão | Descrição            |
|------------|--------|----------------------|
| `PORT`     | `3000` | Porta do servidor    |

---

## Licença

Uso pessoal. Sem licença formal.
