# Interviewer

Notion에 정리한 면접 질문을 기반으로 CS 면접과 컬처핏 면접을 연습할 수 있는 웹 애플리케이션입니다.

## 주요 기능

| 페이지 | 경로 | 설명 |
|--------|------|------|
| CS 공부 | `/browse` | 전체 CS 질문과 답변을 목록으로 확인 |
| CS 면접 | `/quiz` | 즐겨찾기한 CS 질문을 랜덤으로 면접 연습 |
| 컬처핏 목록 | `/culture` | 컬처핏 질문과 답변을 목록으로 확인 |
| 컬처핏 면접 | `/culture-quiz` | 즐겨찾기한 컬처핏 질문으로 면접 연습 |

## 기술 스택

- React 18 + React Router 6
- TanStack React Query 5
- Vite 6 (개발 서버 / 빌드)
- Express (프로덕션 서버 / Notion API 프록시)

---

## 시작하기

### 1. 저장소 Fork & Clone

```bash
# GitHub에서 Fork 버튼 클릭 후
git clone https://github.com/<your-username>/interviewer.git
cd interviewer
```

### 2. Notion API 키 발급

1. [Notion Developers](https://www.notion.so/my-integrations) 페이지에 접속합니다.
2. **새 API 통합 만들기(New integration)** 를 클릭합니다.
3. 이름을 입력하고 (예: `interviewer`) 연결할 워크스페이스를 선택합니다.
4. **유형**은 `Internal`로 설정합니다.
5. **기능(Capabilities)** 에서 아래 권한을 확인합니다:
   - Read content
   - Update content
   - Read comments (선택)
6. 생성 후 표시되는 **Internal Integration Secret** (`ntn_` 또는 `secret_`으로 시작)을 복사합니다.

### 3. Notion 데이터베이스 생성

**두 개의 데이터베이스**가 필요합니다: CS 질문용, 컬처핏 질문용.

#### CS 질문 데이터베이스

Notion에서 새 데이터베이스(테이블)를 만들고 아래 속성을 추가합니다:

| 속성 이름 | 타입 | 설명 |
|-----------|------|------|
| `제목` | Title (제목) | 면접 질문 |
| `면접 답변` | Text (텍스트) | 짧은 면접 답변 |
| `카테고리` | Select (선택) | 질문 분류 (예: 네트워크, OS, DB 등) |
| `즐겨찾기` | Checkbox (체크박스) | 면접 모드에 포함할 질문 체크 |

> CS 질문은 페이지 본문(블록)에 상세 내용을 작성하면 "자세히 보기"로 확인할 수 있습니다.

#### 컬처핏 질문 데이터베이스

동일한 구조로 별도의 데이터베이스를 만듭니다:

| 속성 이름 | 타입 | 설명 |
|-----------|------|------|
| `제목` | Title (제목) | 면접 질문 |
| `면접 답변` | Text (텍스트) | 면접 답변 |
| `카테고리` | Select (선택) | 질문 분류 (예: 자기소개, 갈등 해결 등) |
| `즐겨찾기` | Checkbox (체크박스) | 면접 모드에 포함할 질문 체크 |

> 컬처핏은 페이지 본문을 사용하지 않으며, `면접 답변` 속성만 표시됩니다.

#### 데이터 입력 예시

**CS 질문:**

| 제목 | 면접 답변 | 카테고리 | 즐겨찾기 |
|------|-----------|----------|----------|
| TCP와 UDP의 차이점은? | TCP는 연결 지향적이고 신뢰성을 보장하며... | 네트워크 | ✅ |
| 프로세스와 스레드의 차이는? | 프로세스는 독립적인 메모리 공간을 가지고... | OS | ✅ |

**컬처핏 질문:**

| 제목 | 면접 답변 | 카테고리 | 즐겨찾기 |
|------|-----------|----------|----------|
| 팀에서 갈등이 생기면 어떻게 해결하나요? | 먼저 상대방의 입장을 충분히 경청하고... | 협업 | ✅ |
| 본인의 강점은 무엇인가요? | 꾸준함과 문제 해결 능력이라고 생각합니다... | 자기소개 | ☐ |

### 4. 데이터베이스에 통합 연결

각 데이터베이스 페이지에서:

1. 우측 상단 **···** 메뉴 클릭
2. **연결(Connections)** 항목에서 2단계에서 만든 통합을 검색하여 추가

> 이 단계를 빠뜨리면 API 호출 시 권한 오류가 발생합니다.

### 5. 데이터베이스 ID 확인

Notion 데이터베이스 페이지를 브라우저에서 열면 URL이 다음과 같은 형식입니다:

```
https://www.notion.so/<워크스페이스>/<데이터베이스ID>?v=...
```

`<데이터베이스ID>` 부분(32자리 영숫자)을 복사합니다. CS용, 컬처핏용 각각 복사합니다.

### 6. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다:

```bash
# Notion API 시크릿 키
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxx

# CS 질문 데이터베이스 ID
VITE_NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 컬처핏 질문 데이터베이스 ID
VITE_NOTION_CULTUREFIT_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> `VITE_` 접두사가 붙은 변수는 프론트엔드에서 접근 가능하고, `NOTION_API_KEY`는 서버에서만 사용됩니다.

### 7. 의존성 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### 프로덕션 빌드 및 실행

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

프로덕션 서버는 `http://localhost:3000`에서 실행됩니다 (`PORT` 환경 변수로 변경 가능).

---

## 면접 모드 사용법

1. Notion 데이터베이스에서 연습하고 싶은 질문의 **즐겨찾기**를 체크합니다.
2. 앱에서 **CS 면접** 또는 **컬처핏 면접** 페이지로 이동합니다.
3. 질문이 랜덤 순서로 출제되며, 머릿속으로 답변을 정리한 뒤 **정답 보기**를 눌러 확인합니다.
4. CS 면접에서는 **자세히 보기**로 Notion 페이지 본문의 상세 내용도 확인할 수 있습니다.

---

## 프로젝트 구조

```
interviewer/
├── src/
│   ├── api/notion.js            # Notion API 호출
│   ├── hooks/useQuestions.js     # React Query 커스텀 훅
│   ├── components/               # 공통 컴포넌트
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   ├── BottomNav.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── NotionRenderer.jsx
│   │   └── Loading.jsx
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── HomePage.jsx
│   │   ├── BrowsePage.jsx
│   │   ├── QuizPage.jsx
│   │   ├── CultureFitPage.jsx
│   │   └── CultureFitQuizPage.jsx
│   ├── styles/global.css
│   ├── App.jsx
│   └── main.jsx
├── server.js                     # Express 프로덕션 서버
├── vite.config.js
├── package.json
└── .env                          # 환경 변수 (git 제외)
```
