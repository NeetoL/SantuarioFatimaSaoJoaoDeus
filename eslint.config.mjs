import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Dados mockados só podem ser lidos pelos repositórios (camada Infrastructure).
      // Páginas e componentes passam sempre pelos casos de uso.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/mocks', '@/mocks/*'],
              message: 'Use os casos de uso do módulo (camada Application). Só a Infrastructure lê os mocks.',
            },
          ],
        },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'separate-type-imports' }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    },
  },
  {
    files: ['src/modules/*/Infrastructure/**', 'src/shared/Infrastructure/banco/semente.ts', 'src/mocks/**', '**/*.test.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts', 'legado/**']),
]);

export default eslintConfig;
