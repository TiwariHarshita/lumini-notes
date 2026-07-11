import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Sparkles,
  StickyNote,
  UserRound,
} from "lucide-react";

import AnimatedBackground from "./AnimatedBackground";
import "./LoginScreen.css";

const benefits = [
  {
    icon: CalendarDays,
    text: "Plan events in a visual calendar",
  },
  {
    icon: StickyNote,
    text: "Keep clean, searchable notes",
  },
  {
    icon: CheckCircle2,
    text: "Track your day without clutter",
  },
];

export default function LoginScreen({
  onEmailLogin,
  demoMode,
  onDemo,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [sending, setSending] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError("Enter your name.");
      return;
    }

    if (!cleanEmail) {
      setError(
        "Enter your email address."
      );
      return;
    }

    setSending(true);
    setError("");

    try {
      await onEmailLogin(
        cleanName,
        cleanEmail
      );

      setSent(true);
    } catch (loginError) {
      console.error(loginError);

      setError(
        loginError?.message ||
          "Could not send the login link. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  function handleDemo() {
    onDemo(name.trim() || "Lumina User");
  }

  function tryAnotherEmail() {
    setSent(false);
    setError("");
  }

  return (
    <main className="login-page">
      <AnimatedBackground />

      <motion.section
        className="login-card"
        initial={{
          opacity: 0,
          y: 28,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="login-visual">
          <motion.div
            className="mini-calendar"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="mini-calendar-top">
              <span>May</span>
              <Sparkles size={18} />
            </div>

            <div className="mini-grid">
              {Array.from(
                { length: 28 },
                (_, index) => (
                  <span
                    key={index}
                    className={
                      [8, 13, 19, 24].includes(
                        index
                      )
                        ? "marked"
                        : ""
                    }
                  >
                    {index + 1}
                  </span>
                )
              )}
            </div>
          </motion.div>

          <div className="floating-note note-a">
            Design review
            <br />
            <small>10:30 AM</small>
          </div>

          <div className="floating-note note-b">
            Read 20 pages
          </div>

          <div className="floating-note note-c">
            Idea: habit board
          </div>
        </div>

        <div className="login-content">
          <div className="brand-row">
            <div className="brand-mark">
              <Sparkles size={19} />
            </div>

            <span>Lumina</span>
          </div>

          <p className="eyebrow">
            A calmer way to plan
          </p>

          <h1>
            Give every day a little
            more shape.
          </h1>

          <p className="login-subtitle">
            Notes, events and daily focus
            in one warm, minimal workspace.
          </p>

          <div className="benefit-list">
            {benefits.map(
              ({
                icon: Icon,
                text,
              }) => (
                <div
                  className="benefit"
                  key={text}
                >
                  <span>
                    <Icon size={17} />
                  </span>

                  <p>{text}</p>
                </div>
              )
            )}
          </div>

          {sent ? (
            <motion.div
              className="email-sent-container"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div className="email-sent-box">
                <span className="email-sent-icon">
                  <Check size={20} />
                </span>

                <div>
                  <strong>
                    Check your email
                  </strong>

                  <p>
                    Hi{" "}
                    <strong>{name}</strong>,
                    we sent a login link to{" "}
                    <strong>{email}</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="try-another-email"
                onClick={tryAnotherEmail}
              >
                Use another email
              </button>
            </motion.div>
          ) : (
            <form
              className="email-login-form"
              onSubmit={handleSubmit}
            >
              <label htmlFor="login-name">
                Your name
              </label>

              <div className="email-input-wrapper">
                <UserRound size={18} />

                <input
                  id="login-name"
                  type="text"
                  value={name}
                  placeholder="Enter your name"
                  autoComplete="name"
                  maxLength={60}
                  required
                  onChange={(event) => {
                    setName(
                      event.target.value
                    );

                    setError("");
                  }}
                />
              </div>

              <label htmlFor="login-email">
                Email address
              </label>

              <div className="email-input-wrapper">
                <Mail size={18} />

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  onChange={(event) => {
                    setEmail(
                      event.target.value
                    );

                    setError("");
                  }}
                />
              </div>

              {error && (
                <p className="login-error">
                  {error}
                </p>
              )}

              <button
                className="google-btn email-submit-button"
                type="submit"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <LoaderCircle
                      className="login-spinner"
                      size={19}
                    />

                    Sending login link...
                  </>
                ) : (
                  <>
                    <Mail size={19} />

                    Continue with email
                  </>
                )}
              </button>
            </form>
          )}

          {demoMode && !sent && (
            <button
              className="demo-btn"
              type="button"
              onClick={handleDemo}
            >
              Preview without setup
            </button>
          )}

          <p className="login-footnote">
            Routine Redefined
          </p>
        </div>
      </motion.section>
    </main>
  );
}