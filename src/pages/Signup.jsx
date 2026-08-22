import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Globe2 } from "lucide-react";
import { authApi, getApiError } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const update = (e) => setForm({...form,[e.target.name]:e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords do not match");
    if (form.password.length < 6) return alert("Password must be at least 6 characters");
    setLoading(true);
    try {
      const { data } = await authApi.signup({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      localStorage.setItem("gt_token", data.token);
      localStorage.setItem("gt_user", JSON.stringify(data));
      localStorage.setItem("gt_logged_in", "true");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert(getApiError(error, "Signup failed."));
    } finally { setLoading(false); }
  };

  return <div className="auth-page">
    <section className="auth-visual"><img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=85" alt="Lake travel"/><div className="auth-overlay"/><div className="auth-copy"><div className="brand light"><div className="brand-mark"><Globe2 size={22}/></div><strong>GlobeTrotter</strong></div><div><span className="eyebrow light-eyebrow">TRAVEL YOUR WAY</span><h1>Your next<br/><em>story awaits.</em></h1><p>Turn ideas into organized, memorable journeys.</p></div></div></section>
    <section className="auth-form-side"><div className="auth-form-wrap"><div className="mobile-brand"><div className="brand-mark"><Globe2 size={21}/></div><strong>GlobeTrotter</strong></div><span className="eyebrow">GET STARTED</span><h2>Create your account.</h2><p className="auth-sub">Start building your personalized travel plans.</p>
      <form onSubmit={submit}>
        <label>Full name</label><input className="text-input" name="name" value={form.name} onChange={update} required />
        <label>Email</label><input className="text-input" name="email" value={form.email} onChange={update} type="email" required />
        <label>Password</label><input className="text-input" name="password" value={form.password} onChange={update} type="password" required />
        <label>Confirm password</label><input className="text-input" name="confirm" value={form.confirm} onChange={update} type="password" required />
        <button className="btn btn-primary full big" type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"} {!loading && <ArrowRight size={18}/>}</button>
      </form><p className="auth-bottom">Already have an account? <Link to="/login">Sign in</Link></p>
    </div></section>
  </div>;
}
