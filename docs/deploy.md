# Deploy

A landing page roda no home-server da SHV Digital e é publicada em **https://shvdigital.com.br** (`www.shvdigital.com.br` redireciona para o domínio principal).

## Arquitetura

```
Usuário ──HTTPS──▶ Cloudflare ──Tunnel──▶ cloudflared ──cloudflared-net──▶ shv-digital-landing (nginx:alpine)
                                                                            └─ serve o dist/ gerado (vite build + prerender) no build da imagem
```

| Item | Valor |
| --- | --- |
| Servidor | `shvdigitalserver` — `ssh samuelhipolito@192.168.18.14` |
| Pasta no servidor | `/opt/apps/shv-digital-landing` (clone do repo) |
| Container | `shv-digital-landing` (imagem `shv-digital-landing`, base `nginx:alpine`, sem porta exposta no host) |
| Rede Docker | `cloudflared-net` (externa, compartilhada com o tunnel) |
| Tunnel | container `cloudflared`, config em `/opt/apps/cloudflared/config.yaml` |
| Hostnames no tunnel | `shvdigital.com.br` e `www.shvdigital.com.br` → `http://shv-digital-landing:80` |
| DNS | `CNAME @` e `CNAME www` → `dd27de5e-950f-4424-9e3c-d36dde5c63ce.cfargotunnel.com` (proxied), na zona `shvdigital.com.br` |

O site **não precisa de `.env`**: sem `SITE_URL`, o build usa `https://shvdigital.com.br/` (`src/seo.js`).

Arquivos de deploy no repo:

- `deploy/Dockerfile` — multi-stage: `node:22-alpine` roda `npm ci && npm run build`, `nginx:alpine` serve `dist/`.
- `deploy/docker-compose.yml` — build da imagem e container na `cloudflared-net`.
- `deploy/nginx/default.conf` — um `index.html` por idioma (`/pt-BR/`, `/en/`, `/es/`, sem fallback de SPA), 404 real, redirect de `/en` → `/en/`, `/EN/`, `/ES/` e `/pt-br/` para a forma canônica, `www` → domínio principal, gzip, cache de 1 ano para `/assets/` (hash no nome), 7 dias para imagens e `no-cache` para o HTML.
- `deploy/deploy.sh` — script de publicação.

Assim como o `ll-nails-landing`, o site precisa de build: o `git pull` sozinho não atualiza nada, quem publica é o `docker compose up -d --build`.

## Publicando uma atualização

1. Commit e push da branch a publicar (por padrão, `master`).
2. Na raiz do repo, na máquina local:

   ```bash
   ./deploy/deploy.sh                       # publica a master
   BRANCH=minha-branch ./deploy/deploy.sh   # publica outra branch
   ```

O script aborta se houver commits locais não enviados, faz `git fetch` + checkout da branch no servidor (via `ssh -A`), reconstrói a imagem, recria o container e remove imagens antigas. O build roda antes da troca, então o downtime é de ~1 segundo.

### Por que `ssh -A`?

O servidor **não** tem chave própria com acesso ao GitHub. O `deploy.sh` usa agent forwarding: a chave da máquina local (`ssh-add -l` deve listá-la) autentica o `git fetch` e nunca é copiada para o servidor. Para atualizar manualmente, conecte com `ssh -A samuelhipolito@192.168.18.14`.

## Configuração inicial (já feita)

1. `ssh -A samuelhipolito@192.168.18.14 'git clone git@github.com:SHV-Digital/offical-landing-page.git /opt/apps/shv-digital-landing'`
2. `docker compose -f deploy/docker-compose.yml up -d --build` na pasta clonada.
3. No `/opt/apps/cloudflared/config.yaml`, antes do `http_status:404` final:

   ```yaml
   - hostname: shvdigital.com.br
     service: http://shv-digital-landing:80

   - hostname: www.shvdigital.com.br
     service: http://shv-digital-landing:80
   ```

   e `docker restart cloudflared`.
4. DNS na zona `shvdigital.com.br` (Cloudflare): `CNAME @` e `CNAME www` para `dd27de5e-950f-4424-9e3c-d36dde5c63ce.cfargotunnel.com`, proxied. **Não alterar os registros MX/TXT** (e-mail do Google Workspace).

> O `cert.pem` do `cloudflared` no servidor pertence à zona `shvdigital.cloud`. Por isso `cloudflared tunnel route dns` **não** serve para `shvdigital.com.br` (criaria o registro na zona errada): o DNS desse domínio é criado pelo painel da Cloudflare.

## Validação

```bash
curl -sI https://shvdigital.com.br/            # 200
curl -sI https://shvdigital.com.br/en/         # 200
curl -sI https://shvdigital.com.br/en          # 301 → /en/
curl -sI https://www.shvdigital.com.br/        # 301 → https://shvdigital.com.br/
curl -s  https://shvdigital.com.br/sitemap.xml | head
```

Commit publicado no servidor:

```bash
ssh samuelhipolito@192.168.18.14 'git -C /opt/apps/shv-digital-landing log --oneline -1'
```
