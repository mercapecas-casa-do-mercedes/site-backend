# MercaPeças Backend

Este é o repositório da API do MercaPeças, desenvolvida utilizando Express, TypeScript e seguindo boas práticas de desenvolvimento de software, como o Princípio de Responsabilidade Única (SRP) e arquitetura modular por funcionalidade (feature).

---

## 🚀 Como Iniciar o Projeto

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Clonar o Repositório
Abra o seu terminal e execute o comando:
```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Instalar as Dependências
Instale todos os pacotes necessários rodando:
```bash
npm install
```

### 3. Executar o Servidor em Ambiente de Desenvolvimento
Para rodar a aplicação em modo de desenvolvimento com recarregamento automático (live-reload):
```bash
npm run dev
```
O servidor estará disponível por padrão em: **`http://localhost:3000`**

### 4. Compilar e Rodar em Produção
Se precisar gerar o código otimizado em JavaScript para produção:
```bash
# Compila o TypeScript para a pasta /dist
npm run build

# Inicia o servidor usando os arquivos compilados
npm run start
```

---

## 🏛️ Arquitetura do Projeto

Nossa aplicação adota uma **arquitetura modular focada em funcionalidades (features)**. O principal objetivo é organizar o código de acordo com o domínio do negócio e as funcionalidades do sistema, em vez de agrupar por tipo de arquivo técnico (como pastas globais separadas para `controllers`, `services` ou `routes`).

Dessa forma, mantemos **arquivos curtos** e que respeitam o **Princípio de Responsabilidade Única (SRP)**, facilitando a legibilidade e a manutenção.

### Estrutura de Pastas Esperada
```text
src/
├── modules/              # Funcionalidades e regras de negócio encapsuladas
│   ├── email/
│   │   ├── email.controller.ts
│   │   ├── email.service.ts
│   │   ├── email.routes.ts
│   │   ├── email.schema.ts
│   │   └── email.types.ts
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts
│   │
│   └── products/
│       ├── product.controller.ts
│       ├── product.service.ts
│       ├── product.repository.ts
│       ├── product.routes.ts
│       └── product.schema.ts
│
├── shared/               # Componentes, erros, middlewares e utilitários globais
│   ├── errors/
│   ├── middlewares/
│   └── utils/
│
├── config/               # Configurações globais (banco de dados, variáveis de ambiente, etc)
│
├── app.ts                # Inicialização e configuração do Express
└── server.ts             # Inicialização do servidor HTTP e definição da porta
```

### Relação com Domain-Driven Design (DDD)
Esta forma de organização modular aproxima-se dos conceitos de **DDD (Domain-Driven Design)**. Em sistemas mais robustos e complexos, essa ideia se estende dividindo a aplicação em contextos de negócio bem delimitados:

```text
Sistema (MercaPeças)
├── Produtos       # Módulo para listagem, estoque e detalhes de peças
├── Clientes       # Módulo para perfil do comprador e vendedor
├── Pedidos        # Módulo para carrinho, checkout e histórico
├── Financeiro     # Módulo para pagamentos e faturamento
└── Autenticação   # Módulo para logins, tokens e permissões
```

---

## 📌 Padronização de Commits (Conventional Commits)

Adotamos a especificação de **Conventional Commits** para manter o histórico do Git limpo, semântico e fácil de ler. 

Cada mensagem de commit deve seguir a estrutura básica:
```text
<tipo>[escopo opcional]: <descrição curta>

[corpo opcional]
[rodapé opcional]
```

### Tipos de Commits Aceitos:
* **`feat`**: Introdução de uma nova funcionalidade (ex: `feat(products): adiciona busca de peças por nome`).
* **`fix`**: Correção de um bug (ex: `fix(auth): corrige expiração do token JWT`).
* **`docs`**: Alterações apenas na documentação (ex: `docs: adiciona guia de arquitetura no README`).
* **`style`**: Alterações que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula ausente, etc).
* **`refactor`**: Alteração de código que não corrige um bug nem adiciona uma funcionalidade (ex: `refactor(email): divide método de envio de email em funções menores`).
* **`test`**: Adição de testes ausentes ou correção de testes existentes.
* **`chore`**: Atualizações de tarefas de build, pacotes, configurações de ferramentas, etc. (ex: `chore: atualiza dependências no package.json`).

### Exemplos Práticos:
```bash
git commit -m "feat(health): adiciona endpoint GET /health para monitoramento"
git commit -m "fix(auth): resolve problema de CORS na rota de login"
git commit -m "docs: cria o README do projeto"
```

---

## 📧 Módulo de E-mails

A API de e-mails utiliza o SDK do **Resend** para envio transacional e está localizada em `src/modules/email/`.

### Variáveis de Ambiente Necessárias
Adicione as seguintes chaves ao seu `.env` antes de inicializar o servidor:
```env
RESEND_API_KEY=sua_chave_aqui
RESEND_FROM=remetente@seu-dominio-verificado.com
MAIL_TO=destinatario@exemplo.com

# Origens autorizadas para CORS (opcional em desenvolvimento, valor padrão: http://localhost:5173)
# Em produção, você pode definir múltiplos domínios separados por vírgula.
CORS_ORIGIN=http://localhost:5173,https://meudominio.com
```

### Endpoints Disponíveis

#### `POST /email`
Envia um e-mail de contato contendo os dados do cliente e a mensagem. O e-mail de retorno (`reply-to`) é automaticamente configurado para o e-mail do cliente, facilitando a resposta direta.

**Payload Requisitado:**
```json
{
  "fullName": "João Silva",
  "email": "joao@example.com",
  "phone": "+55 11 99999-9999",
  "message": "Gostaria de mais informações sobre o painel de instrumentos do Civic 2018."
}
```

**Respostas:**
- `201 Created`: E-mail enviado com sucesso (retorna o `id` do Resend).
- `400 Bad Request`: Payload inválido ou incompleto.
- `502 Bad Gateway`: Falha de comunicação com o provedor Resend.

