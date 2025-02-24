import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign } from "hono/jwt";
import { authMiddleware } from "./auth.middleware";

type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
};

export const app = new Hono<Env>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST"],
    allowHeaders: ["Authorization", "Content-Type"],
  })
);

// Webhook para registrar abertura de newsletter
app.get("/webhook/newsletter-open", async (c) => {
  try {
    const email = c.req.query("email");
    const id = c.req.query("id");

    // Validação dos parâmetros obrigatórios
    if (!email || !id) {
      return c.json({ error: "Parâmetros email e id são obrigatórios." }, 400);
    }

    const db = c.env.DB;

    // Verifica se o usuário já existe
    let user = await db.prepare("SELECT id, email, streak, last_opened FROM users WHERE email = ?")
      .bind(email)
      .first<{ id: string; email: string; streak: number; last_opened: string | null }>();

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

    // Registra a abertura da newsletter no banco
    const existingNewsletter = await db.prepare("SELECT id FROM newsletters WHERE id = ? AND user_id = ?")
      .bind(id, user.id)
      .first();

    if (!existingNewsletter) {
      await db.prepare("INSERT INTO newsletters (id, user_id, opened_at) VALUES (?, ?, ?)")
        .bind(id, user.id, new Date().toISOString()).run();
    }

    console.log(`Webhook processado: email=${user.email}, id=${id}`);

    return c.json({
      message: "Webhook recebido e processado com sucesso!",
      email: user.email,
      streak: user.streak,
      lastOpened: user.last_opened,
    }, 200);
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return c.json({ error: "Erro interno ao processar webhook." }, 500);
  }
});


// Login via e-mail (sem senha)
app.post("/auth/login", async (c) => {
  try {
    const { email } = await c.req.json();
    console.log(email)
    if (!email || typeof email !== "string") {
      return c.json({ message: "O e-mail é obrigatório e deve ser uma string válida." }, 400);
    }

    const db = c.env.DB;
    const user = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first<{ id: string }>();

    if (!user) {
      return c.json({ message: "Hummm... Parece que você ainda não abriu nehuma newsletter." }, 404);
    }

    const expiresIn = 4 * 60 * 60; // 4 horas
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    const token = await sign({ userId: user.id, email, exp: Math.floor(Date.now() / 1000) + expiresIn }, c.env.JWT_SECRET);

    await db.prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET token = excluded.token, expires_at = excluded.expires_at")
      .bind(user.id, token, expiresAt).run();

    return c.json({ message: "Login bem-sucedido!", token, expiresAt }, 200);
  } catch (error) {
    console.error("Erro ao processar login:", error);
    return c.json({ error: "Erro interno ao processar login" }, 500);
  }
});

// Buscar estatísticas do usuário (Rota protegida)
app.get("/user", authMiddleware, async (c) => {
  try {
    const user = c.get("jwtPayload") as { userId: string; email: string };
    if (!user) return c.json({ error: "Usuário não autenticado" }, 401);

    const db = c.env.DB;
    const userData = await db.prepare(
      "SELECT email, streak, last_opened FROM users WHERE id = ?"
    ).bind(user.userId).first<{ email: string; streak: number; last_opened: string | null }>();

    if (!userData) return c.json({ error: "Usuário não encontrado." }, 404);

    const historyResult = await db.prepare(
      "SELECT opened_at FROM newsletters WHERE user_id = ? ORDER BY opened_at DESC"
    ).bind(user.userId).all<{ opened_at: string }>();

    return c.json({
      email: user.email,
      streak: userData.streak,
      lastOpened: userData.last_opened,
      history: historyResult.results?.map(entry => entry.opened_at) ?? [],
      message: getMotivationalMessage(userData.streak) // Nova mensagem motivacional
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do usuário:", error);
    return c.json({ error: "Erro interno ao buscar estatísticas do usuário" }, 500);
  }
});

//Rota para obter a streak do usuário
app.get("/streak", authMiddleware, async (c) => {
  try {
    // Obtém o usuário autenticado
    const user = c.get("jwtPayload") as { userId: string; email: string };

    if (!user) {
      return c.json({ error: "Usuário não autenticado" }, 401);
    }

    const db = c.env.DB;

    // Busca o streak e o histórico de aberturas do usuário
    const userData = await db.prepare(
      "SELECT streak, last_opened FROM users WHERE id = ?"
    ).bind(user.userId).first<{ streak: number; last_opened: string | null }>();

    if (!userData) {
      return c.json({ error: "Usuário não encontrado." }, 404);
    }

    // Busca o histórico de aberturas do usuário
    const historyResult = await db.prepare(
      "SELECT opened_at FROM newsletters WHERE user_id = ? ORDER BY opened_at DESC"
    ).bind(user.userId).all<{ opened_at: string }>();

    return c.json({
      email: user.email,
      streak: userData.streak,
      lastOpened: userData.last_opened,
      history: historyResult.results?.map(entry => entry.opened_at) ?? [],
    });
  } catch (error) {
    console.error("Erro ao buscar streak:", error);
    return c.json({ error: "Erro interno ao buscar streak do usuário" }, 500);
  }
});

// Rota para filtrar dados no dashboard administrativo
app.get("/admin/dashboard", authMiddleware, async (c) => {
  try {
    const db = c.env.DB;

    // Captura os filtros enviados na URL
    const period = c.req.query("period"); // Ex: 24, 48, 72...
    const status = c.req.query("streakStatus"); // Ex: "Ativo" ou "Inativo"
    const newsletterId = c.req.query("newsletterId"); // Ex: "post_123456"

    let query = `
      SELECT users.email, users.streak, users.last_opened, newsletters.id as newsletter_id, newsletters.opened_at
      FROM users
      INNER JOIN newsletters ON users.id = newsletters.user_id
      WHERE 1=1
    `;
    const params: string[] = [];

    // Filtro por período de tempo (últimas X horas/dias)
    if (period) {
      query += " AND newsletters.opened_at >= DATETIME('now', ? || ' hours')";
      params.push(`-${period}`);
    }

    // Filtro por status do streak (Ativo/Inativo)
    if (status === "Ativo") {
      query += " AND users.streak > 1 AND users.last_opened >= DATE('now', '-7 days')";
    } else if (status === "Inativo") {
      query += " AND users.streak = 1 AND users.last_opened < DATE('now', '-7 days')";
    }

    // Filtro por newsletter específica
    if (newsletterId) {
      query += " AND newsletters.id = ?";
      params.push(newsletterId);
    }

    // Executa a query com os filtros aplicados
    const results = await db.prepare(query).bind(...params).all();

    return c.json({
      message: "Dados filtrados com sucesso",
      data: results.results,
    });
  } catch (error) {
    console.error("Erro ao buscar dados filtrados:", error);
    return c.json({ error: "Erro interno ao buscar dados." }, 500);
  }
});

// Função para verificar se a abertura foi consecutiva
function checkIfConsecutive(lastOpened: string | null, today: Date): boolean {
  if (!lastOpened) return false;
  
  const lastDate = new Date(lastOpened);
  const difference = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return difference === 1;
}

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Comece hoje e mantenha sua sequência!";
  if (streak < 3) return "Ótimo começo! Continue assim!";
  if (streak < 7) return "Você está indo bem! Uma semana de conquistas!";
  if (streak < 14) return "Incrível! Duas semanas seguidas!";
  return "Você é uma lenda! Continue firme!";
}

export default app;