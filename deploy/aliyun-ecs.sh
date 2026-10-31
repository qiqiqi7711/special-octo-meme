#!/usr/bin/env bash
# 在阿里云 ECS（Ubuntu 22.04+）上部署「破茧」FastAPI 后端。
#
# 前置：你已在阿里云控制台创建好一台 ECS（推荐用学生券/科创包 2核2G 及以上），
#       并已在其「安全组」放行 8000 端口（以及 22 SSH）。
# 用法：把本脚本与仓库一起传到服务器后，以 root 运行：
#   chmod +x deploy/aliyun-ecs.sh && sudo ./deploy/aliyun-ecs.sh
set -euo pipefail

REPO_URL="https://github.com/qiqiqi7711/special-octo-meme.git"
APP_DIR="/opt/poc-backend"
ENV_FILE="/etc/poc-backend.env"
SERVICE="poc-backend"
PORT=8000

echo "==> 安装系统依赖"
apt-get update -y
apt-get install -y git python3 python3-venv python3-pip

echo "==> 克隆仓库"
if [ -d "$APP_DIR/.git" ]; then
  (cd "$APP_DIR" && git pull --ff-only)
else
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "==> 创建虚拟环境并安装依赖"
python3 -m venv "$APP_DIR/.venv"
"$APP_DIR/.venv/bin/pip" install --upgrade pip
"$APP_DIR/.venv/bin/pip" install -r "$APP_DIR/backend/requirements.txt"

echo "==> 写入环境变量模板（请编辑 $ENV_FILE 填入密钥）"
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'EOF'
LLM_API_KEY=
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL=qwen-plus
SEARCH_PROVIDER=tavily
SEARCH_API_KEY=
CORS_ORIGINS=*
EOF
fi
echo "    请编辑 $ENV_FILE，填入 LLM_API_KEY 与 SEARCH_API_KEY 后执行：systemctl restart $SERVICE"

echo "==> 创建 systemd 服务"
cat > "/etc/systemd/system/$SERVICE.service" <<EOF
[Unit]
Description=PoC Backend (FastAPI)
After=network.target

[Service]
WorkingDirectory=$APP_DIR/backend
EnvironmentFile=$ENV_FILE
ExecStart=$APP_DIR/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port $PORT
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now "$SERVICE"

echo "==> 完成"
echo "    健康检查：curl http://localhost:$PORT/api/health"
echo "    外网访问：http://<ECS公网IP>:$PORT/api/health  （记得安全组放行 $PORT）"
