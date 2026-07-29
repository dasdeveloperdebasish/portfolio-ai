import {
  PROFILE,
  STATS,
  SERVICES,
  FEATURED,
  PROJECTS,
  STACK,
} from "@/lib/content";
import ChatWidget from "./components/ChatWidget";
import Reveal from "./components/Reveal";

export default function Home() {
  const a = PROFILE.accent;
  return (
    <>
      <nav>
        <a href="#" className="logo">
          {PROFILE.name.split(" ")[0]}
          <span style={{ color: a }}>.</span>
        </a>
        <ul className="nav-links">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a
              href={`mailto:${PROFILE.email}`}
              className="nav-cta"
              style={{ background: a }}
            >
              Work with me
            </a>
          </li>
        </ul>
      </nav>

      <header className="hero">
        <div className="watermark">AI</div>
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow" style={{ color: a }}>
              ● {PROFILE.role} · {PROFILE.location}
            </div>
            <h1>
              {PROFILE.tagline1}
              <br />
              <span style={{ color: a }}>{PROFILE.tagline2}</span>
            </h1>
            <p>{PROFILE.intro}</p>
            <div className="btns">
              <a
                href={`mailto:${PROFILE.email}`}
                className="btn-a"
                style={{ background: a }}
              >
                Start a project →
              </a>
              <a href="#work" className="btn-b">
                See the work
              </a>
            </div>
          </div>
          <div className="photo-frame">
            <img src={PROFILE.photo} alt={PROFILE.name} />
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="stats">
          {STATS.map((s, i) => (
            <div className="stat" key={i}>
              <div className="n" style={s.highlight ? { color: a } : {}}>
                {s.value}
              </div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section id="services">
        <div className="wrap">
          <Reveal>
            <div className="sec-eyebrow" style={{ color: a }}>
              What I do
            </div>
            <h2>I solve real business problems.</h2>
          </Reveal>
          <div className="svc-grid">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="svc">
                  <i className={`ti ti-${s.icon}`} style={{ color: a }}></i>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          <Reveal>
            <div className="sec-eyebrow" style={{ color: a }}>
              Selected work
            </div>
            <h2>Things I have built.</h2>
          </Reveal>

          {FEATURED && (
            <>
              <Reveal>
                <div
                  className="featured"
                  style={{
                    borderColor: `${a}44`,
                    background: `linear-gradient(135deg,${a}10,transparent)`,
                  }}
                >
                  <div>
                    <span
                      className="ftag"
                      style={{ background: `${a}26`, color: a }}
                    >
                      {FEATURED.tag}
                    </span>
                    <h3>{FEATURED.title}</h3>
                    <p>{FEATURED.desc}</p>
                    <a
                      className="demo-link"
                      href={FEATURED.demoUrl}
                      style={{ color: a }}
                    >
                      {FEATURED.demoLabel}
                    </a>
                  </div>
                  <div className="preview">
                    <div className="ph">{FEATURED.previewName}</div>
                    <div className="bd">
                      {FEATURED.previewQuestion}
                      <br />
                      <span style={{ color: "#075E54" }}>
                        {FEATURED.previewAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
              <div style={{ height: 28 }} />
            </>
          )}

          <div className="work-grid">
            {PROJECTS.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="work">
                  <div className="k" style={{ color: a }}>
                    {p.kind}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="pills">
                    {p.pills.map((x, j) => (
                      <span className="pill" key={j}>
                        {x}
                      </span>
                    ))}
                  </div>
                  <div className="tags">
                    {p.tags.map((x, j) => (
                      <span className="tag" key={j}>
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="stack">
        <div className="wrap">
          <Reveal>
            <div className="sec-eyebrow" style={{ color: a }}>
              Tech stack
            </div>
            <h2>What I work with.</h2>
          </Reveal>
          <div className="stack-grid">
            {STACK.map((g, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="sg">
                  <div className="gl" style={{ color: a }}>
                    {g.group}
                  </div>
                  <div className="sw">
                    {g.items.map((x, j) => (
                      <span className="sk" key={j}>
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="wrap">
          <Reveal>
            <div className="contact">
              <div className="sec-eyebrow" style={{ color: a }}>
                Get in touch
              </div>
              <h2>Let&apos;s build something.</h2>
              <p>
                Want to automate your business, build an app, or hire me? I
                reply within 24 hours — or chat with my AI assistant in the
                corner.
              </p>
              <a className="c-email" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <div className="c-links">
                <a
                  className="cl"
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener"
                >
                  LinkedIn
                </a>
                <a
                  className="cl"
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
                <a className="cl" href={`tel:${PROFILE.phone}`}>
                  {PROFILE.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer>
        {PROFILE.name} · {PROFILE.role} · {PROFILE.location} · Available
        Worldwide
      </footer>

      <ChatWidget />
    </>
  );
}
