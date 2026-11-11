#!/usr/bin/env bash
# Publica a landing page no home-server: o servidor faz git pull da branch e reconstrói a imagem (vite build).
# O pull usa agent forwarding (ssh -A): a chave do GitHub fica só na máquina local.
# Por padrão publica a master; para outra branch: BRANCH=minha-branch ./deploy/deploy.sh
set -euo pipefail

HOST="samuelhipolito@192.168.18.14"
REMOTE_DIR="/opt/apps/shv-digital-landing"
BRANCH="${BRANCH:-master}"

git fetch -q origin "$BRANCH"
if git rev-parse -q --verify "refs/heads/$BRANCH" >/dev/null \
  && [ -n "$(git log "origin/$BRANCH..$BRANCH" --oneline)" ]; then
  echo "Há commits locais não enviados para origin/$BRANCH. Faça git push antes do deploy." >&2
  exit 1
fi

ssh -A "$HOST" "cd $REMOTE_DIR \
  && git fetch -q origin $BRANCH \
  && git checkout -q -B $BRANCH FETCH_HEAD \
  && docker compose -f deploy/docker-compose.yml up -d --build \
  && docker image prune -f >/dev/null"
echo "Deploy concluído: $(git rev-parse --short "origin/$BRANCH")"
