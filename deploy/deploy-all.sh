#!/usr/bin/env bash
# 「破茧」一键部署：单台 Ubuntu/Debian 服务器同时承载 前端(nginx) + 后端(uvicorn)。
# 效果：一个网址 http://<公网IP>/ 即可随时访问；前后端同源，无跨域、无混合内容问题。
#
# 前置（在阿里云/腾讯云控制台完成）：
#   1. 购买一台轻量应用服务器或 ECS，镜像选 Ubuntu 22.04+。
#   2. 在「安全组 / 防火墙」放行 80 端口（以及 22 SSH）。
#
# 用法（以 root 运行，任选其一）：
#   # A. 直接在线执行（密钥用环境变量传入，不会写进 shell 历史文件之外的日志）：
#   curl -fsSL https://raw.githubusercontent.com/qiqiqi7711/special-octo-meme/main/deploy/deploy-all.sh \
#     | LLM_API_KEY="..." SEARCH_API_KEY="..." bash
#
#   # B. 先克隆再执行：
#   git clone https://github.com/qiqiqi7711/special-octo-meme.git /tmp/poc
#   LLM_API_KEY="..." SEARCH_API_KEY="..." sudo bash /tmp/poc/deploy/deploy-all.sh
#
# 说明：LLM_API_KEY / SEARCH_API_KEY 若不传，脚本会写空模板，之后手动编辑 /etc/poc.env 并重启服务即可。
set -euo pipefail

REPO_URL="https://github.com/qiqiqi7711/special-octo-meme.git"
APP_DIR="/opt/poc"
ENV_FILE="/etc/poc.env"
SERVICE="poc-backend"
PORT=8000
NODE_MAJOR=20

echo "==> 1/7 安装系统依赖"
apt-get update -y
apt-get install -y git python3 python3-venv python3-pip nginx curl ca-certificates gnupg

echo "==> 2/7 安装 Node.js ${NODE_MAJOR}（构建前端用）"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/v//;s/\..*//')" -lt 18 ]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
echo "    node $(node -v)"

echo "==> 3/7 克隆仓库"
if [ -d "$APP_DIR/.git" ]; then
  (cd "$APP_DIR" && git pull --ff-only)
else
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "==> 4/7 后端：虚拟环境 + 依赖"
python3 -m venv "$APP_DIR/backend/.venv"
"$APP_DIR/backend/.venv/bin/pip" install --upgrade pip -q
"$APP_DIR/backend/.venv/bin/pip" install -r "$APP_DIR/backend/requirements.txt" -q

echo "==> 5/7 写入环境变量"
if [ -n "${LLM_API_KEY:-}" ]; then
  cat > "$ENV_FILE" <<EOF
LLM_API_KEY=${LLM_API_KEY}
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL=deepseek-v4.1-flash
SEARCH_PROVIDER=tavily
SEARCH_API_KEY=${SEARCH_API_KEY:-}
CORS_ORIGINS=*
EOF
  echo "    已写入密钥。"
else
  if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" <<'EOF'
LLM_API_KEY=
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL=deepseek-v4.1-flash
SEARCH_PROVIDER=tavily
SEARCH_API_KEY=
CORS_ORIGINS=*
EOF
  fi
  echo "    ⚠ 未检测到密钥，已写入空模板。请执行："
  echo "      nano $ENV_FILE   （填入 LLM_API_KEY / SEARCH_API_KEY）"
  echo "      systemctl restart $SERVICE"
fi

echo "==> 6/7 前端：构建静态产物"
(cd "$APP_DIR/frontend" && npm ci && npm run build)

echo "==> 7/7 配置 nginx 与 systemd"
cat > "/etc/systemd/system/$SERVICE.service" <<EOF
[Unit]
Description=PoC Backend (FastAPI)
After=network.target

[Service]
WorkingDirectory=$APP_DIR/backend
EnvironmentFile=$ENV_FILE
ExecStart=$APP_DIR/backend/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port $PORT
Restart=always

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/nginx/sites-available/poc <<EOF
server {
    listen 80 default_server;
    server_name _;
    root $APP_DIR/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
ln -sf /etc/nginx/sites-available/poc /etc/nginx/sites-enabled/poc
rm -f /etc/nginx/sites-enabled/default

systemctl daemon-reload
systemctl enable --now "$SERVICE"
nginx -t && systemctl restart nginx

echo ""
echo "=================================================="
echo " 部署完成 ✅"
echo "   本机自检：curl http://localhost/api/health"
echo "   外网访问：http://<公网IP>/   （安全组需已放行 80 端口）"
echo "=================================================="
