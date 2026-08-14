<p align="center">
  <img src="docs/banner.jpg" alt="jameskill" />
</p>

<p align="center">
  <em><a href="https://claude.ai/claude-code">Claude Code</a>를 위한 개발 생산성 스킬</em>
</p>

<p align="center">
  <a href="#설치"><img src="https://img.shields.io/badge/install-claude%20plugin-1a1a1a?style=flat-square" alt="install" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-1a1a1a?style=flat-square" alt="MIT" /></a>
  <img src="https://img.shields.io/badge/skills-6-1a1a1a?style=flat-square" alt="6 skills" />
</p>

<p align="center">
  <a href="README.md">English</a> | <b>한국어</b>
</p>

---

<img align="right" src="docs/jameskill-hero.jpg" width="220" alt="jameskill character" />

두 개의 기둥 위에 서 있습니다. **`/develop`** — 명령 하나로 개발의 전체 흐름을 끌고 가는 자립형 개발 오케스트레이터, 그리고 구조 자체에 심어진 **컴파운드 엔지니어링** — 매 세션이 다음 세션을 앞당겨 주는 산출물을 저장소에 쌓습니다.

나머지(이슈 트래킹, 점검)는 선택형 유틸리티입니다 — 필수가 아닙니다.

<br clear="right" />

## `/develop`가 툴박스가 아니라 "하나의 스킬"인 이유

에이전트 스킬의 흔한 형태는 툴박스입니다. 규율마다 스킬 하나씩 — 브레인스토밍, 계획, 테스트, 리뷰 — 그리고 어느 순간에 어떤 스킬을 부를지는 당신(또는 모델)의 몫이죠. 호출은 매번 백지에서 시작하고, 한 번도 불리지 않은 규율은 아무것도 지켜주지 못합니다. `/develop`는 이 두 가지를 모두 뒤집습니다:

### 기둥 1 — 명령 하나, 스마트 파이프라인

1. **명령 하나로 전체 파이프라인.** `/develop`(또는 `/develop 로그인 버그 고쳐줘`)만 입력하면 전체 흐름이 돌아갑니다 — 다음에 어떤 하위 스킬을 부를지 고민할 필요가 없습니다.
2. **의도 기반 자동 라우팅.** Clarify(요구사항 질문 단계) 후, 이 작업이 어떤 종류인지 *추론*해서 4개 루트 중 하나를 고릅니다. 당신이 고르는 게 아니라 스킬이 판단합니다.
3. **루트마다 다른 단계 구성.** DIAGNOSE는 수정보다 재현 테스트를 먼저 작성합니다. PROTOTYPE은 TDD를 의도적으로 완화합니다. 이름만 바꾼 같은 흐름이 아니라, 단계 순서 자체가 다릅니다.
4. **무른 언어를 거부하는 검증.** 모든 단계 경계에서 "될 겁니다", "괜찮아 보입니다", "통과한 것 같습니다"를 거부합니다. 검증이란 명령을 실행하고 출력을 직접 확인하는 것입니다.
5. **트래커 없는 코어.** develop 자체는 Notion을 읽지도 쓰지도 않습니다. 이슈 트래킹은 별도의 선택형 기능입니다.
6. **자립형.** 외부 스킬 의존성 0 — 모든 규율이 `skills/develop/references/` 안에 있고, 플러그인과 함께 버전 관리되며 프로젝트별로 수정할 수 있습니다. [ADR 0001](docs/adr/0001-self-contained-orchestrator.md) 참고.

### 기둥 2 — 컴파운드 엔지니어링, 스킬 하나에

`/develop` 세션마다 저장소에 오래가는 산출물이 쌓여, 다음 세션이 앞선 지점에서 출발합니다. **6개 채널, 전부 자동 — 오케스트레이터 하나에 번들**되어 있어 스킬을 조합할 필요가 없습니다. 규율이 코드를 만드는 바로 그 흐름의 일부로 돌아갑니다:

| 채널 | `/develop`가 쌓는 방식 | 무엇이 복리로 쌓이나 |
|---|---|---|
| **플랜 파일** | 자동 — PLAN 루트가 `docs/plans/<github-id>/<feature>.md` 작성 | 재개 가능한 계약서. `/develop docs/plans/<github-id>/<feature>.md`로 세션을 넘어 첫 미완료 태스크부터 재진입합니다. |
| **회귀 테스트** | 자동 — DIAGNOSE 루트가 *최소화된* 재현 테스트를 스위트에 영구 추가 | 버그가 보호막으로 바뀝니다. 수정할 때마다 그물이 촘촘해집니다. |
| **도메인 용어집** | 인라인 — 어느 단계든 용어가 확정되는 순간 CONTEXT.md 항목을 제안, Retrospective가 누락분을 최종 점검 | 세션과 기여자를 가로질러 언어가 일관됩니다. |
| **ADR** | 자동 제안 — 결정이 3중 게이트(되돌리기 어려움 · 맥락 없인 의아함 · 진짜 트레이드오프)를 통과하면 **Retrospective 단계**가 ADR을 제안 | 결정의 역사가 `docs/adr/`에 쌓입니다. 미래 세션이 *왜*를 압니다. |
| **규율 레퍼런스** | 자동 제안 — 새 실패 모드가 드러나면 Retrospective가 `references/<phase>.md` 추가를 제안 | 저장소 안에서 자라는, 편집 가능한 규율. 벤더에 묶이지 않습니다. |
| **거절 기록** | 자동 제안 — 사용자가 이유 있는 거절을 하면 Retrospective가 `.out-of-scope/<concept>.md`를 제안 | Clarify가 세션 시작 시 읽습니다 — 기각된 아이디어가 다시 제안되지 않습니다. |

Retrospective 단계는 Verify와 Finish 사이에서 각 채널을 문턱값과 대조해 제안을 하나씩 올립니다. 자격 있는 채널이 없으면 조용히 통과 — 성과내기용 디포짓은 명시적으로 거부됩니다. [ADR 0007](docs/adr/0007-retrospective-phase.md) 참고.

> 저장소가 시간이 갈수록 *일하기 쉬워집니다*. 그게 컴파운드입니다.

## `/develop` — 개발 오케스트레이터

### 4-way 라우터

Clarify 후 `/develop`는 작업의 종류에 따라 **하나의** 루트를 고릅니다. 각 루트는 의미 있게 다른 단계 구성입니다 — 같은 흐름의 이름 바꾸기가 아닙니다.

| 루트 | 언제 | 단계 구성 | 무엇이 다른가 |
|---|---|---|---|
| **DIRECT** | 작고 닫힌 변경. 커밋 1-4개, 밀접한 파일들. | Build → Peer-review → Verify → Finish | 플랜 파일 생략. 한 방 변경에 격식은 불필요. |
| **PLAN** | 중간 규모 기능. 커밋 5-15개, 상태를 공유하는 파일 2-4개. | 플랜 파일 → 사용자 확인 → 순차 Build | 플랜 파일이 계약이 되고, 세션 간 재개가 그 위에서 돌아갑니다. |
| **DIAGNOSE** | 버그 우선 작업. 재현 절차, 에러 메시지, "고장났어요". | Reproduce → Minimize → Investigate → Fix → Regression-prevent | 재현 테스트를 *먼저* 쓰고, 그 테스트가 회귀 그물로 스위트에 남습니다. |
| **PROTOTYPE** | 버리는 탐색. "이거 어떻게 생겨야 해?", "몇 가지 시도해봐". | 타임박스 변형들(완화된 TDD) → 사용자 리뷰 → Discard 또는 Promote | TDD를 의도적으로 완화. 프로토타입 코드는 `prototype/<name>` 브랜치에 1차 사료로 보존 — 병합은 절대 안 됩니다. Promote = 새 PLAN 실행으로 재시작이지, 졸업이 아닙니다. |

### 유연한 진입과 재개

- **중간 재개** — `/develop docs/plans/<github-id>/<feature>.md`로 플랜에 재진입, Clarify+Route를 건너뛰고 첫 미완료 태스크부터.
- **Clarify 생략** — 이미 스펙이 명확하면 "skip clarify"라고 말하면 됩니다.
- **`/resolve`에서 호출** — Notion 이슈의 제목 + 본문이 Clarify에 자동 주입됩니다.

### 단계 한눈에 보기

```
preflight → clarify → route → build (strict TDD) → peer-review → ship (slot) → verify → retrospective → finish
```

- **집요한 질문, 핑퐁 없이** — 질문은 frontier 라운드로 옵니다(지금 답할 수 있는 질문 전부를 번호 붙여 한 번에, 각각 추천 답 포함). 5-카테고리 모호성 체크리스트가 0이 되어야 Route로 넘어갑니다.
- **엄격한 TDD** — 모든 단위에 RED → GREEN → REFACTOR. 건너뛴 테스트, 주석 처리된 테스트, "TODO: 나중에 테스트" 금지. 테스트는 반증 가능해야 합니다: 어떤 프로덕션 변경이 이 테스트를 깨뜨리는지 말할 수 있어야 합니다.
- **독립 peer-review 서브에이전트** — 작성자의 기억에서 자유로운 신선한 시선. 12-smell 기준선과 3라운드 수정 루프 서킷브레이커 내장.
- **안전한 범위에서 자율** — Build/Verify 중 파국적이지 않은 결정은 멈추는 대신 스스로 판정하고 기록(ruling)합니다. 비가역·보안 결정은 여전히 멈추고 묻습니다.
- **Retrospective** — 세션이 남길 만한 배움을 만들었을 때 ADR / references / CONTEXT.md / `.out-of-scope/` 디포짓을 제안합니다. 아니면 조용히 통과.
- **브랜치 마무리는 명시적** — 로컬 병합 / PR 열기 / 브랜치 유지. Discard는 메뉴에 없습니다: 명시적으로 요청하고 `discard`라는 단어를 직접 입력해야만 실행됩니다.

> 결정 이력: [ADR 0001](docs/adr/0001-self-contained-orchestrator.md) (자립형), [ADR 0005](docs/adr/0005-forge-depth-references.md) (references를 통한 깊이), [ADR 0006](docs/adr/0006-forge-route-expansion.md) (DIAGNOSE + PROTOTYPE), [ADR 0007](docs/adr/0007-retrospective-phase.md) (Retrospective).

---

## 보조 스킬

### 🔬 점검 (alpha)

v2.0에 실리지만 v2.0의 헤드라인은 아닙니다 — 제작자가 매일 쓰지 않고, 도그푸딩에서 실제 발견이 나오지 않았습니다. 원하면 쓸 수 있고, 방향은 출시 후 피드백에 달려 있습니다. [ADR 0004](docs/adr/0004-narrow-v2-to-forge-and-tracker.md) 참고.

| 명령 | 하는 일 |
|---|---|
| `/security` | Supabase RLS 공백, 시크릿 키 클라이언트 노출(Next.js `"use client"` 패러다임), Stripe 웹훅 서명 누락에 대한 v0.1 점검 |
| `/ship` | `/security` 발견을 바탕으로 한 v0.1 보안 GO / NO-GO 배포 판정 (설계상 보안 단일 축 — 다축 종합은 약속하지 않음, [ADR 0010](docs/adr/0010-launch-v0.1-security-only.md) 참고) |

> **프레임워크 주의**: `/security`의 시크릿 키 검사는 Next.js식 클라이언트/서버 경계를 가정합니다. SvelteKit / Nuxt / Remix는 해당 검사에서 거짓 PASS가 나올 수 있습니다 — 프레임워크별 감지가 나오기 전까지 해당 스택은 수동 확인을 권합니다.

### 🗂 Notion 이슈 트래킹 (선택형 연동)

Notion 기반 이슈 라이프사이클. Slack에서 복붙한 버그 리포트 뭉치를 그룹핑된, 코드베이스로 검증된 티켓으로 — 그리고 다시 출하 가능한 수정으로.

| 명령 | 하는 일 |
|---|---|
| `/tracker` | 1회성 Notion 연결 — API 키, 데이터베이스, 속성 매핑, 기본값 |
| `/report` | 프롬프트를 이슈로 파싱, 관련 항목 자동 그룹핑, 코드베이스 검증, 페이지 생성 |
| `/resolve` | 대기 이슈를 골라 `/develop`로 구현하고, 사람이 읽을 수 있는 결과 메모와 함께 상태 갱신 |

**무엇이 다른가** — 이슈 제목이 git 커밋 메시지가 아니라 사용자가 겪는 문제로 쓰입니다. 엔지니어링 맥락 없이도 PM·지원팀·고객이 트래커를 읽을 수 있습니다.

## 설치

```bash
claude plugins marketplace add https://github.com/jameskyeong/jameskill.git
claude plugins install jsk
```

## 빠른 시작

```bash
/develop add a password-reset flow           # 기능 → DIRECT 또는 PLAN 루트
/develop fix: login 500s on empty email      # 버그 → DIAGNOSE 루트
/develop prototype the onboarding layout     # 탐색 → PROTOTYPE 루트
/develop docs/plans/<github-id>/<feature>.md # 진행 중이던 플랜 재개
```

## 요구사항

- [Claude Code](https://claude.ai/claude-code) — 모든 스킬에 필요.
- **`/develop`, `/security`, `/ship`** — 외부 의존성 없음.
- **`/tracker`, `/report`, `/resolve`** — `curl`, `jq`, 그리고 [Notion Internal Integration](https://www.notion.so/my-integrations) 토큰.

## 라이선스

[MIT](LICENSE)
