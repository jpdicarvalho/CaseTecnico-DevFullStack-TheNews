import { Hono } from 'hono';

type Env = {
	Bindings: {
	  DB: D1Database;
	};
  };

export const app = new Hono<Env>();

// Rota para verificar se a API está rodando
//app.get('/', (c) => c.text('API The News - Gamificação 🚀'));

// Webhook para registrar abertura de newsletter
app.get('/', async (c) => {
	try {
	  const email = c.req.query("email");
	  const id = c.req.query("id");
  
	  if (!email || !id) {
		return c.json({ error: "Parâmetros email e id são obrigatórios" }, 400);
	  }
  
	  const db = c.env.DB;
  
	  type User = {
		id: string;
		email: string;
		streak: number;
		last_opened: string | null;
	  };
  
	  // Verifica se o usuário já existe
	  let user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<User>();
  
	  if (!user) {
		// Criar usuário se não existir
		const newUserId = crypto.randomUUID();
		await db.prepare("INSERT INTO users (id, email, streak, last_opened) VALUES (?, ?, ?, ?)")
		  .bind(newUserId, email, 1, new Date().toISOString()).run();
		
		user = { id: newUserId, email, streak: 1, last_opened: new Date().toISOString() };
	  } else {
		// Verifica se o streak deve ser incrementado
		const isConsecutive = checkIfConsecutive(user.last_opened, new Date());
  
		await db.prepare("UPDATE users SET streak = ?, last_opened = ? WHERE email = ?")
		  .bind(isConsecutive ? user.streak + 1 : 1, new Date().toISOString(), email).run();
		
		user.streak = isConsecutive ? user.streak + 1 : 1;
		user.last_opened = new Date().toISOString();
	  }
  
	  // Verificar se essa abertura já foi registrada
	  const existingNewsletter = await db.prepare("SELECT * FROM newsletters WHERE id = ? AND user_id = ?")
		.bind(id, user.id).first();
  
	  if (!existingNewsletter) {
		// Registrar abertura da newsletter apenas se ainda não existir
		await db.prepare("INSERT INTO newsletters (id, user_id, opened_at) VALUES (?, ?, ?)")
		  .bind(id, user.id, new Date().toISOString()).run();
	  }
  
	  return c.json({
		message: "Webhook recebido e processado com sucesso!",
		email: user.email,
		streak: user.streak,
		lastOpened: user.last_opened
	  }, 200);
	} catch (error) {
	  console.error("Erro ao processar webhook:", error);
	  return c.json({ error: "Erro interno ao processar webhook" }, 500);
	}
  });
  
   

// Rota para buscar estatísticas do usuário
app.get('/user/:email', async (c) => {
  const email = c.req.param('email');
  const db = c.env.DB;

  const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!user) return c.json({ error: "Usuário não encontrado" }, 404);

  const history = await db.prepare("SELECT opened_at FROM newsletters WHERE user_id = ? ORDER BY opened_at DESC")
    .bind(user.id).all();

  return c.json({
    email: user.email,
    streak: user.streak,
    lastOpened: user.last_opened,
    history: history.results,
  });
});

// Rota para Dashboard Administrativo
app.get('/admin/dashboard', async (c) => {
  const db = c.env.DB;

  // Número total de usuários
  const totalUsers = await db.prepare("SELECT COUNT(*) AS count FROM users").first();

  // Ranking dos leitores mais engajados
  const ranking = await db.prepare("SELECT email, streak FROM users ORDER BY streak DESC LIMIT 10").all();

  return c.json({
    totalUsers: totalUsers?.count ?? 0,
    ranking: ranking.results,
  });
});

// Função para verificar se a abertura foi consecutiva
function checkIfConsecutive(lastOpened: string | null, today: Date): boolean {
  if (!lastOpened) return false;
  
  const lastDate = new Date(lastOpened);
  const difference = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return difference === 1;
}

export default app;