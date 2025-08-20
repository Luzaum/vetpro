# Deploy no Netlify

## Configuração

O projeto está configurado para deploy no Netlify com as seguintes configurações:

### Arquivo netlify.toml
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18
- **Redirects**: Configurado para SPA (Single Page Application)

### Variáveis de Ambiente (Opcionais)
Se você quiser usar as funcionalidades de IA, configure as seguintes variáveis de ambiente no Netlify:

- `VITE_GEMINI_API_KEY`: Chave da API do Google Gemini
- `VITE_OPENAI_API_KEY`: Chave da API do OpenAI

## Como fazer o Deploy

1. **Conecte seu repositório ao Netlify**
2. **Configure as variáveis de ambiente** (se necessário)
3. **Deploy automático** será feito a cada push para a branch principal

## Problemas Resolvidos

- ✅ Removido arquivo `fix_literary_reviews.js` que usava módulos Node.js incompatíveis
- ✅ Corrigido erro de TypeScript em `services/geminiService.ts`
- ✅ Configurado `netlify.toml` para build correto
- ✅ Atualizado `.gitignore` para excluir arquivos desnecessários

## Build Local

Para testar o build localmente:

```bash
npm install
npm run build
```

O build deve gerar a pasta `dist/` com os arquivos otimizados para produção.
