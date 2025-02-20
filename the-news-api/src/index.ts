import { Hono } from "hono";
import { sign } from "hono/jwt";
import { authMiddleware } from "./auth.middleware";

type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
};

export const app = new Hono<Env>();

// 📨 Webhook para registrar abertura de newsletter
app.get("/", async (c) => {
  try {
    const email = c.req.query("email");
    const id = c.req.query("id");

    if (!email || !id) {
      return c.json({ error: "Parâmetros email e id são obrigatórios" }, 400);
    }

    const db = c.env.DB;

    // Verifica se o usuário já existe
    let user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<{ id: string; email: string; streak: number; last_opened: string | null }>();

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

// 🔐 Login via e-mail (sem senha)
app.post("/auth/login", async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email || typeof email !== "string") {
      return c.json({ error: "O e-mail é obrigatório e deve ser uma string válida." }, 400);
    }

    const db = c.env.DB;
    const user = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first<{ id: string }>();

    if (!user) {
      return c.json({ error: "Usuário não encontrado! Certifique-se de que abriu a newsletter pelo menos uma vez." }, 404);
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

// 🔎 Buscar estatísticas do usuário (Rota protegida)
app.get("/user", authMiddleware, async (c) => {
  try {
    const user = c.get("jwtPayload") as { userId: string; email: string };

    if (!user) {
      return c.json({ error: "Usuário não autenticado" }, 401);
    }

    const db = c.env.DB;
    const userData = await db.prepare("SELECT email, streak, last_opened FROM users WHERE id = ?").bind(user.userId).first<{ email: string; streak: number; last_opened: string | null }>();

    if (!userData) {
      return c.json({ error: "Usuário não encontrado." }, 404);
    }

    const historyResult = await db.prepare("SELECT opened_at FROM newsletters WHERE user_id = ? ORDER BY opened_at DESC")
      .bind(user.userId).all<{ opened_at: string }>();

    return c.json({
      email: user.email,
      streak: userData.streak,
      lastOpened: userData.last_opened,
      history: historyResult.results?.map(entry => entry.opened_at) ?? [],
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do usuário:", error);
    return c.json({ error: "Erro interno ao buscar estatísticas do usuário" }, 500);
  }
});

// 🛠 Função utilitária para verificar streak consecutivo
function checkIfConsecutive(lastOpened: string | null, today: Date): boolean {
  if (!lastOpened) return false;
  const lastDate = new Date(lastOpened);
  const difference = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  return difference === 1;
}

export default app;