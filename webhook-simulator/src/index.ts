import { Hono } from "hono";

const app = new Hono();

const TARGET_API = "https://the-news-api.joaopedrobraga-07.workers.dev/webhook/newsletter-open";

// Função para gerar e-mails com nomes de pessoas reais
const generateRandomEmail = () => {
	const firstNames = ["João", "Maria", "Carlos", "Ana", "Pedro", "Lucas", "Mariana", "Fernanda"];
	const lastNames = ["Silva", "Souza", "Costa", "Pereira", "Oliveira", "Santos", "Lima", "Gomes"];
  
	const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
	const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
	// Converte os nomes para minúsculas e os combina com um ponto
	const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@teste.com`;
	return email;
};

// Função para gerar IDs aleatórios de newsletters
const generateRandomId = () => `post_${Math.floor(Math.random() * 100000)}`;

// Função para enviar o webhook simulado
const sendWebhookRequest = async () => {
	const email = generateRandomEmail();
	const id = generateRandomId();
	const url = `${TARGET_API}?email=${email}&id=${id}`;
  
	console.log(`Enviando webhook para ${url}`);
  
	try {
	  const response = await fetch(url, { method: "GET" });
  
	  // **Corrigindo erro ao tentar parsear um HTML como JSON**
	  const contentType = response.headers.get("content-type");
	  if (!contentType || !contentType.includes("application/json")) {
		console.error("Resposta não é JSON! Código de erro:", response.status);
		console.error("Resposta recebida:", await response.text()); // Exibe erro real
		return;
	  }
  
	  const data = await response.json();
	  console.log("Resposta recebida:", data);
	} catch (error) {
	  console.error("Erro ao enviar webhook:", error);
	}
  };

// **💡 Corrigindo a exportação da função `scheduled`**
export default {
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    console.log("Executando webhook automático via cron...");
    await sendWebhookRequest();
  },
};

// Endpoint para testes manuais no navegador/Postman
app.get("/", async (c) => {
  await sendWebhookRequest();
  return c.json({ message: "Webhook Simulado Disparado!" });
});

// Exporta a API do Hono
export { app };
