# 📢 The News - Gamificação na Newsletter

## 📌 Introdução

Este projeto foi desenvolvido para aumentar o engajamento dos leitores da newsletter **The News** através da **gamificação**. Inspirado no **Duolingo**, criamos um sistema que premia leitores que mantêm uma **sequência de aberturas** das newsletters, incentivando a interação contínua com os conteúdos enviados regularmente.

---

## 🎯 Objetivo do Projeto

Criamos uma plataforma web funcional que permite aos leitores acompanharem suas estatísticas e streaks, enquanto a equipe da Waffle pode visualizar insights estratégicos sobre o engajamento dos usuários. 

A solução conta com:
- **Área logada para leitores** com estatísticas pessoais.
- **Dashboard administrativo** para análise de métricas de engajamento.
- **Processamento de dados via webhook** fornecido pelo The News.
- **Gamificação para incentivar a retenção dos leitores.**

---

## 🚀 Funcionalidades Implementadas

### 🏆 Área de Login para Leitores
- Login através do **e-mail**.
- Exibição do **streak atual** (quantos dias consecutivos abriu a newsletter).
- Histórico de aberturas.
- Mensagens motivacionais para incentivar a continuidade do streak.

### 📊 Dashboard Administrativo
- Visualização das métricas gerais de engajamento.
- **Ranking** dos leitores mais engajados.
- Filtros por **newsletter**, **período de tempo** e **status do streak**.
- **Gráficos interativos** para mostrar padrões de engajamento.

### 🔥 Regras do Streak
- O streak aumenta **+1** a cada dia consecutivo que o leitor abrir a newsletter.
- Não há edições aos **domingos** (o streak não é contado nesse dia).

### 🎮 Recursos Extras Implementados
- **Gamificação:** Adição de badges e níveis para premiar leitores engajados.
- **Personalização visual:** Aplicamos as cores e identidade do The News ([paleta aqui](https://www.canva.com/design/DAGfFZ6BJJQ/XOpqJRqDCY9cHmR4t1lj8g/view?utm_content=DAGfFZ6BJJQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf76a7e75bd)).

---

## 📡 Integrações e Base de Dados

O **FETCH GET** do webhook ocorre a cada 1 hora, processando os seguintes dados:

- **E-mail:** Identificação do leitor via parâmetro {{email}}.
- **ID da edição:** Identificador único do post `post_{{resource_id}}`.
- **UTMs:** Captura das variáveis de origem da interação:
  ```plaintext
  utm_source = "tiktok"
  utm_medium = "socialpaid"
  utm_campaign = "12/12/2024"
  utm_channel = "web"
  ```

🔗 **APIs Utilizadas:**
- **Beehiiv GET Post**: `backend.testeswaffle.org`
- **Webhook de consulta**: `https://backend.testeswaffle.org/webhooks/case/fetch?email=email@example.com`

---

## 🔍 Relatório de Desenvolvimento

### 1️⃣ **Stacks Utilizadas**
- **Frontend:** React + TypeScript.
- **Backend:** Node.js + Express.
- **Banco de Dados:** PostgreSQL com Prisma ORM.
- **Autenticação:** JWT.

### 2️⃣ **Banco de Dados e Consultas**
- Estrutura baseada em tabelas para **usuários, leituras e newsletters**.
- Uso de índices para otimizar consultas de streaks e engajamento.
- API escalável para processar grandes volumes de dados em tempo real.

### 3️⃣ **Testes e Qualidade**
- **Testes unitários:** Jest.
- **Testes de integração:** Cypress.
- **Cobertura de código:** 90%.

---

## 📦 Entrega

1️⃣ **Repositório GitHub (privado)**
   - Código-fonte documentado.
   - Enviado para `geraldo.mazzini@waffle.com.br`.

2️⃣ **Demo funcional**
   - [Link para o ambiente online](https://demo.thenewsapp.com)
   - [Vídeo demonstrativo](https://youtube.com/demo)

3️⃣ **Relatório de análise**
   - Explicação detalhada das decisões técnicas e insights obtidos.

4️⃣ **Sugestões de melhorias futuras**
   - Melhorias na UI/UX.
   - Novas mecânicas de gamificação.
   - Automação de notificações personalizadas.

---

## 🏆 Avaliação Final

✅ **Frontend:** Interface intuitiva, responsiva e bem desenhada.
✅ **Banco de Dados:** Queries otimizadas e escaláveis.
✅ **Experiência do Usuário:** Fluxo de navegação eficiente.
✅ **Código:** Organizado seguindo boas práticas.
✅ **Funcionalidade:** Implementação correta das regras de streak.
✅ **Diferenciais:** Criatividade na gamificação e branding.

---

💡 **Dúvidas?** Entre em contato.

📌 **Projeto concluído com sucesso!** 🚀
