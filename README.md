# 🏋️ PR-Tracker

Aplicativo *mobile-first* para registrar e acompanhar **recordes pessoais (PRs) de carga** na musculação, com histórico, gráficos de evolução e autenticação de usuários.

![Java](https://img.shields.io/badge/Java-17+-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

---

## 📌 Sobre o projeto

O **PR Gym** nasceu como um projeto pessoal e acadêmico para praticar desenvolvimento backend com Java e Spring Boot, resolvendo um problema real: saber, de forma simples, qual é o meu melhor desempenho em cada exercício e como ele evolui ao longo do tempo.

Cada usuário possui sua própria conta e enxerga apenas os seus registros.

## ✨ Funcionalidades

- 🔐 Cadastro e login com **autenticação JWT**
- 📋 Cadastro de exercícios por grupo muscular
- 📝 Registro de treinos (carga, repetições e data)
- 🏆 Cálculo automático de **PR** e recálculo ao editar ou excluir registros
- 📈 Gráficos de evolução por exercício (Chart.js)
- 🕘 Histórico de registros
- 📊 Dashboard com resumo dos recordes
- 📱 Interface responsiva (celular e desktop)

## 🧮 Como o PR é calculado

O PR de um exercício é o registro com o maior **1RM estimado**, calculado pela fórmula de Epley:

```
1RM = carga × (1 + repetições / 30)
```

Exercícios de peso corporal não possuem carga (`null`) e são avaliados pelo **máximo de repetições**.

## 📐 Regras de negócio

- Grupos musculares são fixos: Peito, Costas, Pernas, Ombro, Braço, Abdômen e Panturrilha
- O nome do exercício é único (sem diferenciar maiúsculas de minúsculas)
- Exercícios que já possuem registros não podem ser excluídos
- Exercícios são compartilhados; registros, histórico, dashboard e gráficos são **isolados por usuário**
- Ao registrar um novo PR, o PR anterior deixa de ser marcado como recorde

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Java 17+, Spring Boot, Spring Security |
| Autenticação | JWT (JJWT 0.12.6) |
| Banco de dados | PostgreSQL (Neon) em produção · H2 em desenvolvimento |
| Frontend | HTML, CSS e JavaScript puro, servidos pelo Spring Boot |
| Gráficos | Chart.js |
| Deploy | Docker + Render |

## 🗂️ Estrutura do projeto

```
src/main/
├── java/com/rafael/pr_gym_backend/
│   ├── controller/     # Endpoints REST
│   ├── service/        # Regras de negócio (ex.: PRCalculatorService)
│   ├── repository/     # Acesso a dados (Spring Data JPA)
│   ├── model/          # Entidades (User, Exercise, Record...)
│   ├── dto/            # Objetos de requisição/resposta
│   └── security/       # JwtUtil, JwtAuthFilter, SecurityConfig
└── resources/
    ├── static/         # Frontend (HTML, css/, js/)
    └── application*.properties
```

## 🚀 Como executar localmente

### Pré-requisitos

- JDK 17 ou superior
- Git

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/UtiyamaRafael/PR-Tracker.git
cd PR-Tracker

# 2. Execute a aplicação (usa H2 em memória por padrão)
./mvnw spring-boot:run        # Linux/macOS
mvnw.cmd spring-boot:run      # Windows
```

Acesse **http://localhost:8080**.

## 🔧 Variáveis de ambiente (produção)

Nenhum segredo deve ser versionado. Em produção, configure:

| Variável | Descrição |
|---|---|
| `SPRING_PROFILES_ACTIVE` | Perfil ativo (`prod`) |
| `DATABASE_URL` | URL de conexão do PostgreSQL |
| `DATABASE_USERNAME` | Usuário do banco |
| `DATABASE_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens JWT |

## 🔌 Endpoints principais

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/api/auth/register` | Cria uma conta | Não |
| POST | `/api/auth/login` | Autentica e retorna o token | Não |
| — | `/api/exercises` | CRUD de exercícios | Sim |
| — | `/api/records` | CRUD de registros de treino | Sim |

Rotas protegidas exigem o cabeçalho:

```
Authorization: Bearer <token>
```

## 🐳 Deploy

A aplicação é empacotada com Docker e publicada no **Render**, utilizando um banco PostgreSQL hospedado no **Neon**.

## 🗺️ Próximos passos

- [ ] Testes automatizados de isolamento de dados entre usuários
- [ ] Recuperação e redefinição de senha completas
- [ ] Integração total do frontend com a API (remover dados fictícios)
- [ ] Testes unitários e de integração para as regras de PR

## 👤 Autor

**Rafael Utiyama**
Estudante de Ciência da Computação · Foco em desenvolvimento backend

[![GitHub](https://img.shields.io/badge/GitHub-UtiyamaRafael-181717?logo=github)](https://github.com/utiyamaRafael)
