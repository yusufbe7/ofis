import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { Icon } from "../components/ui/Icon";
import { signIn } from "../lib/auth";
import { CONFIG } from "../data/config";

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const ok = await signIn(password);
    setPending(false);
    if (ok) onSuccess();
    else {
      setError("Parol noto'g'ri.");
      setPassword("");
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <div className="logo" style={{ marginBottom: 22 }}>
          <span className="logo-mark" aria-hidden="true">P</span>
          <span className="logo-text">{CONFIG.brand}</span>
        </div>

        <h1 className="dialog-title">Boshqaruv paneli</h1>
        <p className="lede" style={{ fontSize: 14, marginTop: 6, marginBottom: 24 }}>
          Arizalarni ko'rish uchun parolni kiriting.
        </p>

        <Field label="Parol" error={error}>
          {(p) => (
            <Input
              {...p}
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </Field>

        <Button type="submit" variant="primary" block style={{ marginTop: 16 }} disabled={pending || !password}>
          {pending ? "Tekshirilmoqda…" : "Kirish"}
        </Button>

        <a href="/" className="login-back">
          <Icon name="arrow" size={14} className="flip" />Saytga qaytish
        </a>
      </form>
    </div>
  );
}
