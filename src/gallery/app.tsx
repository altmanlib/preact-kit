import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import type { Demo } from "../kit/demo.ts";
import { IconButton } from "../kit/primitives/actions/icon-button/index.tsx";
import { ThemeSwitch } from "../kit/primitives/foundations/theme-switch/index.tsx";
import { demos } from "./demos.ts";
import { groupDemos } from "./groups.ts";
import { current, demoPath } from "./route.ts";

function MenuGlyph({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 4l8 8M12 4L4 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 5h10M3 8h10M3 11h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  );
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav class="g-side" id="gallery-nav" aria-label="Components">
      <a class="g-brand" href="#/" onClick={onNavigate}>
        preact-kit
      </a>
      {groupDemos(demos).map(({ title, demos: items }) => {
        return (
          <section key={title}>
            <p class="g-side-title">{title}</p>
            <ul>
              {items.map((demo) => {
                const active = current.value === demo.name.toLowerCase();
                return (
                  <li key={demo.name}>
                    <a
                      href={demoPath(demo.name)}
                      class={active ? "g-link g-link-on" : "g-link"}
                      aria-current={active ? "page" : undefined}
                      onClick={onNavigate}
                    >
                      {demo.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <div class="g-theme">
        <ThemeSwitch />
      </div>
    </nav>
  );
}

function DemoView({ demo }: { demo: Demo }) {
  return (
    <article class="enter" key={demo.name}>
      <h1>{demo.name}</h1>
      <p class="muted">{demo.summary}</p>
      {demo.examples.map((example) => (
        <section class="g-example" key={example.title}>
          <h2>{example.title}</h2>
          {example.note ? <p class="muted">{example.note}</p> : null}
          <div class="g-stage">{example.render()}</div>
        </section>
      ))}
    </article>
  );
}

export function App() {
  const navOpen = useSignal(false);
  const closeNav = () => {
    navOpen.value = false;
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && navOpen.value) {
        navOpen.value = false;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    closeNav();
  }, [current.value]);

  const demo = demos.find((item) => item.name.toLowerCase() === current.value);
  return (
    <>
      <a class="g-skip" href="#main">
        Skip to content
      </a>
      <div class={navOpen.value ? "g-shell g-nav-open" : "g-shell"}>
        {navOpen.value ? <div class="g-nav-backdrop" onClick={closeNav} /> : null}
        <header class="g-bar">
          <IconButton
            label={navOpen.value ? "Close menu" : "Open menu"}
            aria-expanded={navOpen.value}
            aria-controls="gallery-nav"
            onClick={() => {
              navOpen.value = !navOpen.value;
            }}
          >
            <MenuGlyph open={navOpen.value} />
          </IconButton>
          <a class="g-brand" href="#/" onClick={closeNav}>
            preact-kit
          </a>
        </header>
        <Sidebar onNavigate={closeNav} />
        <main class="g-main" id="main">
          {demo ? (
            <DemoView demo={demo} />
          ) : (
            <article>
              <h1>preact-kit</h1>
              <p class="muted">{demos.length} component(s). Choose one from the navigation to view its examples.</p>
            </article>
          )}
        </main>
      </div>
    </>
  );
}
