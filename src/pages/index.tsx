import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

const example = `settings:
  general:
    properties:
      hostname:
        title: Server name
        type: string
        default: "Counter-Strike: Source Server"
        apply: live
        write:
          - { target: serverCfg, key: hostname }   # cstrike/cfg/server.cfg
          - { target: console,   key: hostname }   # and live over RCON`;

const features = [
  {
    title: 'Any game, not just the popular ones',
    body: 'Cvar files, INI and JSON, binary configs, the Windows registry, script-language configs, HTTP APIs and startup prompts. If a server can be configured, a definition can describe it.',
  },
  {
    title: 'Any panel',
    body: 'One definition serves every panel. Panels render a form from the JSON Schema and apply changes through an adapter that knows what needs a restart and what can change live.',
  },
  {
    title: 'Safe to share',
    body: 'Secrets stay out of values documents, definitions are reviewed for what they can touch before install, and registries are signed. Permissions let hosts decide who changes what.',
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>UnifiedGSC · draft 0.1</p>
          <h1 className={styles.title}>{siteConfig.title}</h1>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/spec">
              Read the config spec
            </Link>
            <Link className="button button--secondary button--lg" to="/games">
              Browse example games
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className="container margin-vert--xl">
          <div className="row">
            {features.map((f) => (
              <div key={f.title} className="col col--4 margin-bottom--lg">
                <h2 className={styles.featureTitle}>{f.title}</h2>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="container margin-bottom--xl">
          <div className="row">
            <div className="col col--5">
              <h2>One setting, every place it lives</h2>
              <p>
                A game definition is a JSON Schema with a few extra keywords. Each setting says where it is
                written and when a change takes effect. The same definition drives the form a panel shows, the
                files an adapter writes, and the live-state checks that spot drift.
              </p>
              <p>
                <Link to="/live-state">The live-state spec</Link> builds on the same definitions to report players,
                maps and drift from a running server.
              </p>
            </div>
            <div className="col col--7">
              <CodeBlock language="yaml" title="counter-strike-source.game.yaml">
                {example}
              </CodeBlock>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
