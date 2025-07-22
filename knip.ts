import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  "entry": [
    "src/**/page.tsx",
    "src/app/components/ui/**/*",
    "src/**/layout.tsx",
    "src/app/globals.css"
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
  "project": ["src/**/*.ts"],
  "ignoreDependencies": ['@dagrejs/dagre', 'eslint', 'eslint-config-next'],
}

export default config
