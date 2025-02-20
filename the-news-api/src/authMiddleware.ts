import { verify } from "hono/jwt";
import { Context, Next } from "hono";

type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
};

type AuthContext = Context<Env> & {
  set: (key: "user", value: { userId: string; email: string }) => void;
  get: (key: "user") => { userId: string; email: string } | undefined;
};

export const authMiddleware = async (c: AuthContext, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Token de autenticação ausente ou inválido" }, 401);
    }

    const token = authHeader.split(" ")[1];
    const db = c.env.DB;

    // Busca a sessão no banco
    const session = await db
      .prepare("SELECT user_id, email, expires_at FROM sessions JOIN users ON sessions.user_id = users.id WHERE token = ?")
      .bind(token)
      .first<{ user_id: string; email: string; expires_at: string }>();

    if (!session) {
      return c.json({ error: "Token inválido ou não encontrado!" }, 401);
    }

    // Se a sessão expirou, exclui do banco e retorna erro
    if (new Date(session.expires_at) < new Date()) {
      await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
      return c.json({ error: "Sessão expirada. Faça login novamente." }, 401);
    }

    // Valida o token JWT
    const payload = await verify(token, c.env.JWT_SECRET) as { userId: string; email: string };

    // Armazena os dados do usuário no contexto
    c.set("user", { userId: session.user_id, email: session.email });

    await next();
  } catch (error) {
    return c.json({ error: "Token inválido ou expirado" }, 401);
  }
};