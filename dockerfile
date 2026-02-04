# --- 1단계: Build React App ---
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 후 의존성 설치
COPY package*.json ./
# 빌드를 위해 모든 의존성 설치 (devDependencies 포함)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# 전체 코드 복사 및 빌드
COPY . .
RUN npm run build

# --- 2단계: Production 서버 ---
FROM node:20-alpine

# 정적 파일 서버 설치
RUN npm install -g serve

# 보안을 위한 non-root 사용자 생성
RUN addgroup -g 1001 -S nodegroup && \
    adduser -S -u 1001 -G nodegroup nodeuser

WORKDIR /app

# 빌드된 파일만 복사 (Vite는 dist 폴더에 빌드)
COPY --from=builder /app/dist ./build

# 파일 소유권 변경
RUN chown -R nodeuser:nodegroup /app

# non-root 사용자로 전환
USER nodeuser

# 포트 노출
EXPOSE 3000

# serve를 사용해서 정적 파일 서빙
CMD ["serve", "-s", "build", "-l", "3000"]
