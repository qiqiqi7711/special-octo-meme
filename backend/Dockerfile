# 「破茧」FastAPI 后端镜像。运行环境变量从平台（或 --env-file）注入，不在镜像内硬编码密钥。
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
