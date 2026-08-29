# Vehicle Management API

## Requisitos

- Node.js 20+

## Tecnologias

- TypeScript
- Express
- Zod
- Vitest

## Instalação

```bash
npm install
npm run dev
```

## Testes

```bash
npm test
npm run test:coverage
```

## Endpoints

### Veículos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /vehicles | Cadastrar veículo |
| GET | /vehicles | Listar veículos |
| GET | /vehicles?color= | Filtrar por cor |
| GET | /vehicles?brand= | Filtrar por marca |
| GET | /vehicles/:id | Buscar por ID |
| PUT | /vehicles/:id | Atualizar |
| DELETE | /vehicles/:id | Excluir |

### Motoristas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /drivers | Cadastrar motorista |
| GET | /drivers | Listar motoristas |
| GET | /drivers?name= | Filtrar por nome |
| GET | /drivers/:id | Buscar por ID |
| PUT | /drivers/:id | Atualizar |
| DELETE | /drivers/:id | Excluir |

### Utilizações

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /usages | Registrar utilização |
| GET | /usages | Listar utilizações |
| PATCH | /usages/:id/finish | Finalizar utilização |

## Regras de negócio

- Um veículo só pode ser utilizado por um motorista por vez
- Um motorista não pode utilizar mais de um veículo ao mesmo tempo
- Conflitos retornam status 409

## Decisões técnicas

- Persistência em memória: os dados são perdidos ao reiniciar o servidor
- `crypto.randomUUID()` para geração de IDs, sem dependência externa
- Filtros utilizam correspondência parcial e são case-insensitive
- Unicidade de placa não foi implementada pois não consta nos requisitos

## Exemplos

### Cadastrar veículo
```bash
curl -X POST http://localhost:3000/vehicles \
  -H "Content-Type: application/json" \
  -d '{"plate":"ABC-1234","color":"red","brand":"Toyota"}'
```

### Cadastrar motorista
```bash
curl -X POST http://localhost:3000/drivers \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva"}'
```

### Registrar utilização
```bash
curl -X POST http://localhost:3000/usages \
  -H "Content-Type: application/json" \
  -d '{"vehicleId":"<id>","driverId":"<id>","reason":"Viagem de negócios"}'
```

### Finalizar utilização
```bash
curl -X PATCH http://localhost:3000/usages/<id>/finish
```

## Documentação

Swagger disponível em `http://localhost:3000/docs`
