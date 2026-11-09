import type { Demo } from "../kit/demo.ts";
import { ThemeSwitch } from "../kit/primitives/theme-switch/index.tsx";
import { demos } from "./demos.gen.ts";
import { groupDemos } from "./groups.ts";
import { current, demoPath } from "./route.ts";

function Sidebar() {
  return (
    <nav class="g-side" aria-label="Components">
      <a class="g-brand" href="#/">
        preact-kit
      </a>
      {groupDemos(demos).map(({ title, demos: items }) => {
        return (
          <section key={title}>
            <h3 class="g-side-title">{title}</h3>
            <ul>
              {items.map((demo) => {
                const active = current.value === demo.name.toLowerCase();
                return (
                  <li key={demo.name}>
                    <a href={demoPath(demo.name)} class={active ? "g-link g-link-on" : "g-link"} aria-current={active ? "page" : undefined}>
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
  const demo = demos.find((item) => item.name.toLowerCase() === current.value);
  return (
    <div class="g-shell">
      <Sidebar />
      <main class="g-main">
        {demo ? (
          <DemoView demo={demo} />
        ) : (
          <article>
            <h1>preact-kit</h1>
            <p class="muted">{demos.length} component(s). Pick one on the left.</p>
          </article>
        )}
      </main>
    </div>
  );
}
