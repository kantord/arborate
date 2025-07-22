import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  "entry": [
    "src/app/forests/**/page.tsx",
    "src/app/components/ui/**/*",
    "src/app/forests/**/layout.tsx",
    "eslint.config.mjs",
    "next.config.ts",
    "src/app/globals.css"
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
  "project": ["src/**/*.ts"]
}

export default config
