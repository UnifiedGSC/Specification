// Generates one page per example game definition into games/, plus an index.
// Runs before every build (npm run build) so the pages never drift from the YAML.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defsDir = path.join(root, 'examples', 'definitions');
const valuesDir = path.join(root, 'examples', 'values');
const outDir = path.join(root, 'games');

// Inline code that survives tables: backticks inside become a longer fence, pipes are escaped.
function code(value) {
  if (value === undefined || value === null || value === '') return '';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const fence = text.includes('`') ? '``' : '`';
  const pad = text.startsWith('`') || text.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${text.replace(/\|/g, '\\|').replace(/\n/g, ' ')}${pad}${fence}`;
}

// Plain text in a table cell or paragraph: no raw HTML, no table breaks.
function text(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|')
    .replace(/\n+/g, ' ');
}

function table(headers, rows) {
  if (!rows.length) return '';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
    '',
  ].join('\n');
}

function* leaves(node, prefix = []) {
  for (const [name, p] of Object.entries(node.properties ?? {})) {
    if (p && 'write' in p) yield [[...prefix, name].join('.'), p];
    else if (p && p.type === 'object') yield* leaves(p, [...prefix, name]);
  }
}

function typeOf(p) {
  if (p.kind === 'identityList') return 'identity list';
  if (p.kind === 'contentRef') return `content (${p.source ?? ''})`;
  if (p.enum) return `one of ${p.enum.map((v) => code(v)).join(', ')}`;
  if (p.oneOf?.every((o) => 'const' in o)) return `one of ${p.oneOf.length} options`;
  let t = p.type ?? '';
  if (t === 'array') t = `list of ${p.items?.type ?? 'items'}`;
  const range = [p.minimum !== undefined ? `≥ ${p.minimum}` : '', p.maximum !== undefined ? `≤ ${p.maximum}` : '']
    .filter(Boolean)
    .join(', ');
  return range ? `${t} (${range})` : t;
}

function writesTo(p) {
  const targets = [...new Set((p.write ?? []).map((w) => w.target))];
  return targets.length ? targets.map((t) => code(t)).join(', ') : '(adapter only)';
}

function classesOf(dotted, p, game) {
  const c = new Set(p.classes ?? []);
  if (p.writeOnly) c.add('credential');
  const infra = new Set(
    [...Object.values(game.ports ?? {}), ...Object.values(game.paths ?? {})].map((x) => x?.setting).filter(Boolean),
  );
  if (infra.has(dotted)) c.add('infrastructure');
  if (p.kind === 'identityList') c.add('identity');
  if (p.kind === 'contentRef') c.add('content');
  if (p.apply === 'worldCreate') c.add('destructive');
  if (p.derivedFrom) c.add('derived');
  return [...c].sort().join(', ');
}

function page(file, game, examples) {
  const g = game.game;
  const d = game.definition ?? {};
  const out = [];
  const slug = g.id;
  out.push('---');
  out.push(`title: ${JSON.stringify(g.name)}`);
  out.push(`sidebar_label: ${JSON.stringify(g.name + (d.status === 'partial' ? ' (partial)' : ''))}`);
  out.push(`slug: /${slug}`);
  out.push(`description: ${JSON.stringify(`The ${g.name} reference definition for the Game Server Config Standard.`)}`);
  out.push('custom_edit_url: null');
  out.push('---');
  out.push('');
  out.push(`# ${text(g.name)}`);
  out.push('');
  if (d.status === 'partial') {
    out.push(':::note Partial definition');
    out.push('');
    out.push('This definition covers one feature of the spec, not the whole game.');
    out.push('');
    out.push(':::');
    out.push('');
  }
  out.push(`Generated from [\`${file}\`](https://github.com/UnifiedGSC/Specification/blob/main/examples/definitions/${file}). Items marked \`# verify\` in the source are from memory and still need checking against a real server.`);
  out.push('');

  const steam = g.steam ? Object.entries(g.steam).map(([k, v]) => `${k} ${code(v)}`).join(', ') : '';
  const settings = [...leaves(game.settings ?? {})];
  const facts = [
    ['Definition', `${code(d.id)} ${code(d.version)}`],
    ['Game ID', code(g.id)],
    ['Engine', text(g.engine) + (g.implementation ? ` (${text(g.implementation)})` : '')],
    ['Platforms', (g.platforms ?? []).map((p) => code(p)).join(', ')],
    ...(steam ? [['Steam', steam]] : []),
    ...(g.versions?.supported ? [['Game versions', code(g.versions.supported)]] : []),
    ['Settings', String(settings.length)],
    ['License', code(d.license)],
  ];
  for (const [k, v] of facts) out.push(`- **${k}:** ${v}`);
  out.push('');

  const ports = Object.entries(game.ports ?? {});
  if (ports.length) {
    out.push('## Ports');
    out.push('');
    out.push(table(['Port', 'Default', 'Protocol', 'Purpose', 'Exposure', 'Setting', 'Speaks'], ports.map(([name, p]) => [
      code(name),
      p.default !== undefined ? code(p.default) : p.offset !== undefined ? `game ${p.offset >= 0 ? '+' : ''}${p.offset}` : p.sameAs ? `same as ${code(p.sameAs)}` : '',
      text(p.protocol),
      text(p.purpose),
      text(p.exposure),
      code(p.setting),
      (p.speaks ?? []).map((s) => code(s)).join(', '),
    ])));
  }

  const targets = Object.entries(game.targets ?? {});
  if (targets.length) {
    out.push('## Targets');
    out.push('');
    out.push(table(['Target', 'Type', 'Format', 'Where'], targets.map(([name, t]) => [
      code(name),
      text(t.type ?? 'file'),
      text(t.format ?? ''),
      code(t.path ?? t.baseUrl ?? t.within ?? t.hive ?? ''),
    ])));
  }

  if (settings.length) {
    out.push('## Settings');
    out.push('');
    const groups = new Map();
    for (const [dotted, p] of settings) {
      const group = dotted.split('.')[0];
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push([dotted, p]);
    }
    for (const [group, items] of groups) {
      const title = game.settings.properties[group]?.title ?? group;
      out.push(`### ${text(title)}`);
      out.push('');
      out.push(table(['Setting', 'Title', 'Type', 'Default', 'Applies', 'Written to', 'Classes'], items.map(([dotted, p]) => [
        code(dotted),
        text(p.title),
        typeOf(p),
        p.writeOnly ? '(secret)' : code(p.default),
        text(p.apply ?? 'restart'),
        writesTo(p),
        text(classesOf(dotted, p, game)),
      ])));
    }
  }

  const st = game.state;
  if (st) {
    out.push('## Live state');
    out.push('');
    const rows = [];
    for (const q of st.queries ?? []) rows.push(['Query', `${code(q.protocol)} on ${code(q.port)}`, text(q.every)]);
    for (const [name, c] of Object.entries(st.console ?? {})) rows.push(['Console poll', code(c.command), text(c.every)]);
    if (st.logs) rows.push(['Log', code(st.logs.source?.file ?? 'stdout'), Object.keys(st.logs.events ?? {}).map((e) => code(e)).join(', ')]);
    const reports = Object.keys(st.reports ?? {});
    if (reports.length) rows.push(['Drift', 'reported settings', reports.map((r) => code(r)).join(', ')]);
    if (st.perProcess) rows.push(['Per process', 'one state per process', '']);
    out.push(table(['Source', 'What', 'Detail'], rows));
  }

  if (examples.length) {
    out.push('## Example values');
    out.push('');
    for (const f of examples) out.push(`- [\`${f}\`](https://github.com/UnifiedGSC/Specification/blob/main/examples/values/${f})`);
    out.push('');
  }

  out.push('## Definition source');
  out.push('');
  out.push('<details>');
  out.push(`<summary>${text(file)}</summary>`);
  out.push('');
  const src = fs.readFileSync(path.join(defsDir, file), 'utf8');
  const fence = src.includes('```') ? '````' : '```';
  out.push(`${fence}yaml title="${file}"`);
  out.push(src.trimEnd());
  out.push(fence);
  out.push('');
  out.push('</details>');
  out.push('');
  return out.join('\n');
}

fs.rmSync(outDir, {recursive: true, force: true});
fs.mkdirSync(outDir, {recursive: true});

const valuesFiles = fs.existsSync(valuesDir) ? fs.readdirSync(valuesDir) : [];
const files = fs.readdirSync(defsDir).filter((f) => f.endsWith('.game.yaml')).sort();
const index = [];
for (const file of files) {
  const game = yaml.load(fs.readFileSync(path.join(defsDir, file), 'utf8'));
  const id = game.definition?.id;
  const examples = valuesFiles.filter((f) => {
    try {
      const v = yaml.load(fs.readFileSync(path.join(valuesDir, f), 'utf8'));
      return v?.definitionId === id || (!v?.definitionId && v?.game === game.game.id);
    } catch {
      return false;
    }
  });
  fs.writeFileSync(path.join(outDir, `${game.game.id}.md`), page(file, game, examples));
  index.push(game);
}

const rows = index
  .sort((a, b) => a.game.name.localeCompare(b.game.name))
  .map((g) => [
    `[${text(g.game.name)}](./${g.game.id}.md)`,
    text(g.game.engine),
    code(g.definition?.version),
    g.definition?.status === 'partial' ? 'partial' : 'full',
    String([...leaves(g.settings ?? {})].length),
    g.state ? 'yes' : '',
  ]);
fs.writeFileSync(
  path.join(outDir, 'index.md'),
  [
    '---',
    'title: Example games',
    'sidebar_label: Overview',
    'sidebar_position: 0',
    'slug: /',
    'custom_edit_url: null',
    '---',
    '',
    '# Example games',
    '',
    'Reference definitions written while designing the spec. Each one exists because the game breaks a naive design somewhere: binary config files, script-language configs, HTTP-only settings, startup prompts, multi-process clusters. Pages are generated from the YAML in `examples/definitions`.',
    '',
    table(['Game', 'Engine', 'Version', 'Coverage', 'Settings', 'Live state'], rows),
  ].join('\n'),
);
console.log(`generated ${files.length} game pages`);
