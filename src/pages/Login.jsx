import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Globe2, Lock, Mail } from "lucide-react";
import { authApi, getApiError } from "../services/api";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("demo@globetrotter.app");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login({ email: email.trim(), password });
      localStorage.setItem("gt_token", data.token);
      localStorage.setItem("gt_user", JSON.stringify(data));
      localStorage.setItem("gt_logged_in", "true");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      alert(getApiError(error, "Login failed. Check your email and password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85" alt="Travel landscape" />
        <div className="auth-overlay" />
        <div className="auth-copy">
          <div className="brand light"><div className="brand-mark"><Globe2 size={22}/></div><strong>GlobeTrotter</strong></div>
          <div><span className="eyebrow light-eyebrow">YOUR JOURNEY STARTS HERE</span><h1>Plan less.<br/><em>Experience more.</em></h1><p>Design beautiful multi-city journeys, keep your budget in check, and make every stop count.</p></div>
          <div className="auth-quote">“The world is a book and those who do not travel read only one page.”</div>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="mobile-brand"><div className="brand-mark"><Globe2 size={21}/></div><strong>GlobeTrotter</strong></div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Let's continue your journey.</h2>
          <p className="auth-sub">Sign in to access your trips and plan your next adventure.</p>
          <form onSubmit={submit}>
            <label>Email address</label>
            <div className="input-icon"><Mail size={17}/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></div>
            <label>Password</label>
            <div className="input-icon"><Lock size={17}/><input value={password} onChange={e=>setPassword(e.target.value)} type={show ? "text":"password"} required /><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>
            <div className="form-row"><label className="check"><input type="checkbox"/> Remember me</label><Link to="/login">Forgot password?</Link></div>
            <button className="btn btn-primary full big" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"} {!loading && <ArrowRight size={18}/>}</button>
          </form>
          <p className="auth-bottom">Don't have an account? <Link to="/signup">Create one</Link></p>
        </div>
      </section>
    </div>
  );
}
