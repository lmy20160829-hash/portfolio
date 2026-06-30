/* =============================================================
   이미연 — 더 좋은 일하는 방식이, 더 좋은 회사를 만듭니다
   데이터 기반 대시보드 · SVG 차트 · 인터랙션
   ============================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  /* ============================================================
     데이터
     ============================================================ */
  const D = {
    /* 커리어 타임라인 */
    career: [
      { year: "현재", title: "AI · 소프트웨어 학습", desc: "오랜 현장 경험 위에 기술을 더해, 더 나은 업무 시스템을 직접 설계합니다.", type: "final" },
      { year: "2023.04 ~ 2026.01", title: "이지케어텍 인재경영팀", desc: "급여 · 보상과 세무를 중심으로 인사 업무를 수행하며, 사람과 제도를 함께 챙겼습니다." },
      { year: "2022 ~ 2023", title: "경영 전문성 강화 · 학위 취득", desc: "회계·재경 실무 위에 경영학을 더해, 숫자를 넘어 경영의 시야를 넓혔습니다." },
      { year: "2008 ~ 2021", title: "코스닥 상장사 재경팀 · 13년", desc: "이지케어텍 재경팀에서 회계 결산 · 세무 · 급여 · 퇴직연금 · 공시까지 재경 업무 전반을 책임졌습니다." },
      { year: "2002 ~ 2007", title: "회계 · 자금 실무로 출발", desc: "대기업(삼성중공업)과 회계법인에서 회계 · 자금 · 급여의 기본기를 단단히 다졌습니다.", type: "milestone" }
    ],

    /* 만들고 싶은 시스템 */
    /* 경영진 관점 — 의사결정·관리·보고 (상단) */
    execSystems: [
      { ic: "📊", t: "KPI 경영 대시보드", d: "전사·부서 KPI의 목표 대비 실적을 시각화해 성과를 추적합니다.", app: "kpi" },
      { ic: "📑", t: "경영 리포트 자동화", d: "전사 데이터를 집계해 경영진용 리포트를 자동 생성합니다.", app: "report" },
      { ic: "🌱", t: "피플 애널리틱스 대시보드", d: "성과·역량·성장 지표를 분석해 인재 데이터를 한눈에 제공합니다.", app: "growth" },
      { ic: "🏅", t: "성과·역량 평가관리", d: "상시평가 기반으로 직무·부서 특성에 맞춰 KPI·OKR·역량평가를 혼합합니다.", app: "evaluation" },
      { ic: "🧲", t: "AI 이직 예측·인재 유지", d: "이직 위험을 미리 예측하고 직원별 맞춤 리텐션 액션을 추천합니다.", app: "retention" },
      { ic: "💹", t: "인건비·보상 시뮬레이터", d: "인상·채용·성과급 시나리오가 손익에 미치는 영향을 즉시 시뮬레이션합니다.", app: "compsim" },
      { ic: "🕸️", t: "조직 네트워크 분석(ONA)", d: "협업 네트워크에서 핵심 연결자와 소통 사일로를 찾아 조직 설계를 돕습니다.", app: "ona" },
      { ic: "✅", t: "전자결재 워크플로우", d: "기안·결재선·승인 이력을 표준화해 결재를 빠르고 투명하게 합니다.", app: "approval" },
      { ic: "💰", t: "예산 편성·집행 관리", d: "부서별 예산 편성과 집행 승인, 집행률을 통합 관리합니다.", app: "budget" },
      { ic: "🧾", t: "원천세·세무 신고 관리", d: "원천세·부가세 신고 자료를 자동 집계하고 신고 일정을 관리합니다.", app: "tax" },
      { ic: "⚙️", t: "업무 자동화(RPA) 허브", d: "반복 업무를 자동 실행해 처리 시간과 절감 효과를 측정합니다.", app: "automation" }
    ],
    /* 직원·운영 — 최종 보고서의 기반이 되는 실무 시스템 (하단) */
    opsSystems: [
      { ic: "🗓️", t: "근태·연차 관리", d: "연차 신청·승인·잔여를 전자결재로 자동화하고 근태 현황을 한눈에 관리합니다.", app: "leave" },
      { ic: "💳", t: "급여 관리", d: "급여 산정·공제·명세서 발행까지 정산 프로세스를 자동화합니다.", app: "payroll" },
      { ic: "🎁", t: "복리후생 신청 시스템", d: "이지웰 선택복리·의료비·교통비·경조금·주택자금 대출 신청을 한곳에서.", app: "welfare" },
      { ic: "📘", t: "정책·제도 사용설명서", d: "근로기준법·일가정양립·정부 지원 정책을 직원 군별로 쉽게 안내합니다.", app: "policy" },
      { ic: "🎓", t: "인재개발(HRD) 관리", d: "인턴 3개월 교육·1년 현장실무교육 등 인재 육성을 통합 관리합니다.", app: "training" },
      { ic: "🏦", t: "퇴직연금 운용 대시보드", d: "DB·DC 적립금 현황과 운용 지표를 실시간으로 시각화합니다.", app: "pension" },
      { ic: "🧮", t: "경비 처리·지출 관리", d: "지출결의부터 경비 분류·정산까지 비용 처리를 효율화합니다.", app: "expense" }
    ],

    /* 업무 프로세스 개선 (상태 라벨 숨김) */
    processImprove: [
      { ic: "🔁", t: "반복되는 수작업 줄이기", d: "사람이 매번 하던 단순 작업을 자동화합니다.", status: "" },
      { ic: "⚡", t: "결재 과정 빠르게", d: "결재가 멈추지 않고 빠르게 흐르도록 합니다.", status: "" },
      { ic: "🔗", t: "부서 간 소통 지연 줄이기", d: "부서 사이에 정보가 늦게 도는 일을 줄입니다.", status: "" },
      { ic: "📤", t: "정보 공유 속도 개선", d: "필요한 정보를 더 빠르게 나눕니다.", status: "" },
      { ic: "📝", t: "보고서 준비 시간 단축", d: "보고서를 만드는 데 드는 시간을 줄입니다.", status: "" },
      { ic: "📅", t: "월 마감 속도 개선", d: "매달 마감 업무를 더 빠르게 끝냅니다.", status: "" },
      { ic: "🧹", t: "불필요한 행정 업무 줄이기", d: "꼭 필요하지 않은 행정 일을 덜어냅니다.", status: "" },
      { ic: "🧭", t: "경영진의 빠른 의사결정 지원", d: "결정에 필요한 정보를 제때 제공합니다.", status: "" }
    ],
    processGoals: [
      { label: "반복 업무 감소", value: 40, unit: "%", sub: "수작업 자동화 목표" },
      { label: "결재 시간 단축", value: 50, unit: "%", sub: "결재 처리 시간 목표" },
      { label: "보고 준비 단축", value: 30, unit: "%", sub: "보고서 준비 시간 목표" },
      { label: "월 마감 단축", value: 25, unit: "%", sub: "마감 소요 시간 목표" }
    ],

    /* 직원 성장 시스템 */
    growthSystem: [
      { ic: "🎓", t: "교육과정(LMS) 관리", d: "사내 교육과정을 체계적으로 운영·관리합니다.", app: "training" },
      { ic: "📊", t: "교육 참여 분석", d: "과정별 참여·이수 현황을 시각화합니다.", app: "training" },
      { ic: "📈", t: "역량 진단·개발 관리", d: "직무 역량의 성장 과정을 진단하고 기록합니다.", app: "growth" },
      { ic: "🧭", t: "핵심인재·리더십 파이프라인", d: "차세대 리더 후보를 조기에 식별하고 육성합니다.", app: "growth" },
      { ic: "📋", t: "승진 역량·승계 관리", d: "승진 준비도와 승계 계획을 관리합니다.", app: "growth" },
      { ic: "🌱", t: "개인별 성장 플랜(IDP)", d: "구성원별 맞춤 성장 계획을 지원합니다.", app: "growth" }
    ],

    /* 지식 공유 문화 */
    knowledgeShare: [
      { ic: "👨‍🏫", t: "사내 멘토링 관리", d: "선후배 멘토링 매칭과 진행을 관리합니다.", app: "knowledge" },
      { ic: "🔄", t: "지식경영(KM) 대시보드", d: "조직 내 지식 공유 활동을 시각화합니다.", app: "knowledge" },
      { ic: "🎓", t: "교육 이수 관리", d: "교육 참여와 이수 현황을 관리합니다.", app: "training" },
      { ic: "🤝", t: "멘토링 성과 분석", d: "멘토링 참여와 성과를 추적합니다.", app: "knowledge" },
      { ic: "📚", t: "학습 조직 문화 지원", d: "지속 학습 문화가 자리 잡도록 지원합니다.", app: "knowledge" },
      { ic: "🗄️", t: "핵심 지식·노하우 관리", d: "조직의 핵심 지식과 노하우를 체계적으로 보존합니다.", app: "knowledge" }
    ],

    /* 경영 지원 대시보드 */
    mgmtSummary: [
      { label: "전체 임직원", value: 500, unit: "명", icon: "👥", tone: "blue" },
      { label: "연간 퇴직률", value: 7.4, unit: "%", icon: "📉", tone: "green", sub: "목표 10% 이내 달성" },
      { label: "인턴 정규직 전환율", value: 88, unit: "%", icon: "🎓", tone: "yellow", sub: "연 40명 채용" },
      { label: "현장교육 이수율", value: 94, unit: "%", icon: "🌱", tone: "amber", sub: "입사 1년 실무교육" }
    ],
    revenueBars: [
      { label: "HIS 개발·판매", value: 57, unit: "%" },
      { label: "운영·유지보수(SM)", value: 41, unit: "%" },
      { label: "클라우드 서비스", value: 2, unit: "%" }
    ],
    mgmtRadial: [
      { label: "직원 만족도", value: 88 },
      { label: "핵심인재 유지율", value: 96, unit: "%" },
      { label: "교육 이수율", value: 92, unit: "%" }
    ],
    mgmtTrend: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      series: [
        { name: "생산성 지수", color: "#2a76bd", values: [72, 75, 79, 83, 88, 92] },
        { name: "직원 만족도", color: "#d98a3d", values: [80, 82, 85, 88, 90, 92] }
      ]
    },
    mgmtBars: [
      { label: "정보 공유 속도", value: 91 },
      { label: "의사결정 지원 만족", value: 87 },
      { label: "보고 준비 시간 단축", value: 84 },
      { label: "비용 효율", value: 88 }
    ],
    talentFunnel: [
      { label: "연간 인턴 채용", value: 40, max: 40, display: "40명" },
      { label: "정규직 전환율", value: 88, unit: "%" },
      { label: "현장교육 이수율", value: 94, unit: "%" },
      { label: "핵심인재 유지율", value: 96, unit: "%" }
    ],
    /* Tableau형 대시보드 — KPI 타일·히트맵·부서 성과·평가 분포 */
    mgmtKpis6: [
      { label: "전체 임직원", value: 500, unit: "명", icon: "👥", tone: "blue" },
      { label: "매출 (YTD)", value: "712억", icon: "💰", tone: "green" },
      { label: "영업이익률", value: 8.4, unit: "%", icon: "📈", tone: "blue" },
      { label: "연간 퇴직률", value: 7.4, unit: "%", icon: "📉", tone: "amber", sub: "목표 10% 이내" },
      { label: "직원 만족도", value: 88, icon: "😊", tone: "yellow" },
      { label: "핵심인재 유지율", value: 96, unit: "%", icon: "⭐", tone: "green" }
    ],
    deptHeatmap: {
      cols: ["성과지수", "만족도", "교육이수율", "이직위험"], dir: [1, 1, 1, -1],
      rows: [
        ["연구소", [92, 91, 95, 9]],
        ["운영·SM본부", [86, 90, 94, 12]],
        ["경영지원본부", [87, 89, 93, 11]],
        ["클라우드사업부", [90, 88, 90, 15]],
        ["HIS개발본부", [88, 86, 92, 18]],
        ["구축본부", [84, 82, 88, 22]],
        ["영업·마케팅", [82, 79, 85, 28]]
      ]
    },
    deptPerf: [
      { label: "연구소", value: 92 }, { label: "클라우드사업부", value: 90 }, { label: "HIS개발본부", value: 88 },
      { label: "경영지원본부", value: 87 }, { label: "운영·SM본부", value: 86 }, { label: "구축본부", value: 84 }, { label: "영업·마케팅", value: 82 }
    ],
    gradeDist: [
      { label: "S 등급", value: 42, max: 228, display: "42명" }, { label: "A 등급", value: 148, max: 228, display: "148명" },
      { label: "B 등급", value: 228, max: 228, display: "228명" }, { label: "C 등급", value: 62, max: 228, display: "62명" }, { label: "D 등급", value: 20, max: 228, display: "20명" }
    ],

    /* 보안 관리 시스템 */
    security: [
      { ic: "🔐", t: "데이터 접근 권한 통제", d: "데이터 접근을 권한 기반으로 통제합니다.", app: "security" },
      { ic: "🪪", t: "계정·권한(IAM) 관리", d: "직원별 권한을 최소 권한 원칙으로 관리합니다.", app: "security" },
      { ic: "🛡️", t: "내부 정보 보안 관리", d: "민감 정보를 안전하게 보호합니다.", app: "security" },
      { ic: "📺", t: "보안 관제 대시보드", d: "보안 상태와 이상 징후를 실시간으로 모니터링합니다.", app: "security" },
      { ic: "📜", t: "감사 로그(Audit) 관리", d: "모든 접근·처리 이력을 감사 로그로 관리합니다.", app: "security" },
      { ic: "🗝️", t: "접근 통제 정책 관리", d: "접근 권한 정책을 통합 관리합니다.", app: "security" }
    ],
    securityStats: [
      { label: "정보 보호율", value: 99, unit: "%", sub: "민감 정보 보호 목표" },
      { label: "접근 권한 점검", value: 97, unit: "%", sub: "권한 적정성 점검" },
      { label: "감사 로그 적용", value: 99, unit: "%", sub: "기록 보관 범위" }
    ]
  };

  /* ============================================================
     화면 진입 애니메이션 등록
     ============================================================ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting && e.target.__cb) { e.target.__cb(); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  const onView = (node, cb) => { if (reduce) { cb(); return; } node.__cb = cb; io.observe(node); };

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function countTo(node, target, { decimals = 0, unit = "", prefix = "" } = {}) {
    if (reduce) { node.textContent = prefix + target.toFixed(decimals) + unit; return; }
    const dur = 1400, start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      node.textContent = prefix + (target * easeOut(p)).toFixed(decimals) + unit;
      if (p < 1) requestAnimationFrame(frame); else node.textContent = prefix + target.toFixed(decimals) + unit;
    }
    requestAnimationFrame(frame);
  }

  /* ============================================================
     렌더러
     ============================================================ */
  function renderStats(box, items) {
    items.forEach((it) => {
      const card = el("div", "stat-card" + (it.tone ? " tone-" + it.tone : ""));
      const isNum = typeof it.value === "number";
      const dec = isNum && !Number.isInteger(it.value) ? 1 : 0;
      card.innerHTML =
        `${it.icon ? `<div class="stat-card__chip">${it.icon}</div>` : ""}
         <div class="stat-card__label">${it.label}</div>
         <div class="stat-card__value${isNum ? "" : " is-text"}">${isNum ? `<span class="num">0</span>` : it.value}${it.unit ? `<span class="unit">${it.unit}</span>` : ""}</div>
         ${it.sub ? `<div class="stat-card__sub">${it.trend ? `<span class="trend-up"></span>` : ""}${it.sub}</div>` : ""}`;
      box.appendChild(card);
      if (isNum) onView(card, () => countTo($(".num", card), it.value, { decimals: dec }));
    });
  }

  function renderRadial(box, items) {
    const C = 2 * Math.PI * 58;
    items.forEach((it) => {
      const dec = !Number.isInteger(it.value) ? 1 : 0;
      const card = el("div", "radial-card");
      card.innerHTML =
        `<div class="radial">
           <svg viewBox="0 0 132 132">
             <circle class="radial__track" cx="66" cy="66" r="58"></circle>
             <circle class="radial__bar" cx="66" cy="66" r="58" stroke-dasharray="${C}" stroke-dashoffset="${C}"></circle>
           </svg>
           <div class="radial__num"><span class="num">0</span></div>
         </div>
         <h4>${it.label}</h4>
         ${it.note ? `<p>${it.note}</p>` : ""}`;
      box.appendChild(card);
      onView(card, () => {
        $(".radial__bar", card).style.strokeDashoffset = C * (1 - it.value / 100);
        countTo($(".num", card), it.value, { decimals: dec, unit: it.unit === "%" ? "%" : "" });
      });
    });
  }

  function renderBars(box, items) {
    items.forEach((it) => {
      const max = it.max || 100;
      const pct = Math.min((it.value / max) * 100, 100);
      const shown = it.display != null ? it.display : it.value + (it.unit || "");
      const tone = pct >= 90 ? "green" : pct >= 75 ? "" : "alt";
      const row = el("div", "bar");
      row.innerHTML =
        `<div class="bar__top"><span>${it.label}</span><b>${shown}</b></div>
         <div class="bar__track"><div class="bar__fill ${tone}"></div></div>`;
      box.appendChild(row);
      onView(row, () => { $(".bar__fill", row).style.width = pct + "%"; });
    });
  }

  function renderModules(box, items) {
    items.forEach((it, i) => {
      const status = it.status === undefined ? (it.app ? "데모 열기 →" : "구상안") : it.status;
      const m = el("article", "module" + (it.app ? " module--app" : ""));
      if (it.app) { m.setAttribute("data-app", it.app); m.setAttribute("role", "button"); m.setAttribute("tabindex", "0"); }
      m.innerHTML =
        `<div class="module__top">
           <div class="module__ic">${it.ic}</div>
           <div class="module__no">${String(i + 1).padStart(2, "0")}</div>
         </div>
         <h4>${it.t}</h4><p>${it.d}</p>
         ${status ? `<div class="module__status">${status}</div>` : ""}`;
      if (it.app) m.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); m.click(); } });
      box.appendChild(m);
    });
  }

  function renderTimeline(box, items) {
    const wrap = el("div", "timeline");
    items.forEach((it) => {
      const node = el("div", "tnode reveal" + (it.type === "milestone" ? " tnode--milestone" : it.type === "final" ? " tnode--final" : ""));
      node.innerHTML =
        `<div class="tnode__year">${it.year}</div>
         <div class="tnode__card"><h4>${it.title}</h4><p>${it.desc}</p></div>`;
      wrap.appendChild(node);
    });
    box.appendChild(wrap);
  }

  /* SVG 선 그래프 */
  function renderLine(box, cfg) {
    const W = 600, H = 260, pad = { l: 12, r: 12, t: 18, b: 28 };
    const dark = !!box.closest(".section--dark");
    const grid = dark ? "rgba(255,255,255,0.08)" : "rgba(10,37,64,0.07)";
    const lbl = dark ? "#8fa6c6" : "#8694a8";
    const max = cfg.max || Math.max(...cfg.series.flatMap((s) => s.values)) * 1.12;
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const xs = (i) => pad.l + (iw * i) / (cfg.labels.length - 1);
    const ys = (v) => pad.t + ih * (1 - v / max);
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "none");
    let inner = "";
    for (let g = 0; g <= 4; g++) { const y = pad.t + (ih * g) / 4; inner += `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="${grid}" stroke-width="1"/>`; }
    cfg.labels.forEach((l, i) => { inner += `<text x="${xs(i)}" y="${H - 8}" fill="${lbl}" font-size="11" text-anchor="middle">${l}</text>`; });
    cfg.series.forEach((s, si) => {
      const pts = s.values.map((v, i) => `${xs(i)},${ys(v)}`);
      const line = `M ${pts.join(" L ")}`;
      const area = `M ${pad.l},${pad.t + ih} L ${pts.join(" L ")} L ${W - pad.r},${pad.t + ih} Z`;
      const gid = "ln" + si;
      inner += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="${s.color}" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs>`;
      inner += `<path class="ln-area" d="${area}" fill="url(#${gid})" opacity="0"/>`;
      inner += `<path class="ln-line" d="${line}" fill="none" stroke="${s.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      s.values.forEach((v, i) => { inner += `<circle class="ln-dot" cx="${xs(i)}" cy="${ys(v)}" r="3.5" fill="${s.color}" opacity="0"/>`; });
    });
    svg.innerHTML = inner;
    box.appendChild(svg);
    if (cfg.series.length > 1) {
      const lg = el("div", "chart-legend");
      lg.innerHTML = cfg.series.map((s) => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join("");
      box.appendChild(lg);
    }
    onView(box, () => {
      $$(".ln-line", svg).forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)";
        requestAnimationFrame(() => { p.style.strokeDashoffset = "0"; });
      });
      setTimeout(() => {
        $$(".ln-area", svg).forEach((a) => { a.style.transition = "opacity 0.9s ease"; a.style.opacity = "1"; });
        $$(".ln-dot", svg).forEach((d, i) => { setTimeout(() => { d.style.transition = "opacity 0.4s ease"; d.style.opacity = "1"; }, i * 40); });
      }, 700);
    });
  }

  /* SVG 막대 그래프 */
  function renderBarChart(box, cfg) {
    const W = 600, H = 260, pad = { l: 14, r: 14, t: 18, b: 30 };
    const dark = !!box.closest(".section--dark");
    const grid = dark ? "rgba(255,255,255,0.08)" : "rgba(10,37,64,0.07)";
    const lbl = dark ? "#8fa6c6" : "#8694a8";
    const max = cfg.max || Math.max(...cfg.values) * 1.18;
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const n = cfg.values.length, bw = (iw / n) * 0.5;
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    let inner = `<defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="${cfg.color}" stop-opacity="1"/>
                  <stop offset="100%" stop-color="${cfg.color}" stop-opacity="0.55"/></linearGradient></defs>`;
    for (let g = 0; g <= 4; g++) { const y = pad.t + (ih * g) / 4; inner += `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="${grid}" stroke-width="1"/>`; }
    cfg.values.forEach((v, i) => {
      const cx = pad.l + (iw * (i + 0.5)) / n;
      const h = ih * (v / max), y = pad.t + ih - h;
      inner += `<rect class="bc-bar" x="${cx - bw / 2}" y="${pad.t + ih}" width="${bw}" height="0" rx="6" fill="url(#barGrad)" data-y="${y}" data-h="${h}"/>`;
      inner += `<text x="${cx}" y="${y - 8}" fill="${lbl}" font-size="12" font-weight="700" text-anchor="middle">${v}${cfg.unit || ""}</text>`;
      inner += `<text x="${cx}" y="${H - 9}" fill="${lbl}" font-size="11" text-anchor="middle">${cfg.labels[i]}</text>`;
    });
    svg.innerHTML = inner;
    box.appendChild(svg);
    onView(box, () => {
      $$(".bc-bar", svg).forEach((r, i) => {
        setTimeout(() => {
          r.style.transition = "y 0.9s cubic-bezier(0.22,1,0.36,1), height 0.9s cubic-bezier(0.22,1,0.36,1)";
          r.setAttribute("y", r.dataset.y); r.setAttribute("height", r.dataset.h);
        }, i * 80);
      });
    });
  }

  /* ============================================================
     [data-render] 디스패치
     ============================================================ */
  /* --- 부서×지표 히트맵 (Tableau형) --- */
  function renderHeatmap(box, cfg) {
    const wrap = el("div", "heatmap");
    wrap.style.setProperty("--hmcols", cfg.cols.length);
    let html = `<div class="hm-row"><div class="hm-label"></div>${cfg.cols.map((c) => `<div class="hm-colh">${c}</div>`).join("")}</div>`;
    cfg.rows.forEach(([label, vals]) => {
      html += `<div class="hm-row"><div class="hm-label">${label}</div>${vals.map((v, i) => {
        const good = cfg.dir[i] < 0 ? 100 - v : v;
        let bg, fg;
        if (good >= 88) { bg = "#dcfce7"; fg = "#15803d"; }
        else if (good >= 80) { bg = "#cfeafe"; fg = "#0b6bb0"; }
        else if (good >= 72) { bg = "#fef3c7"; fg = "#a16207"; }
        else { bg = "#fee2e2"; fg = "#b91c1c"; }
        return `<div class="hm-cell" style="background:${bg};color:${fg}"><b>${v}</b></div>`;
      }).join("")}</div>`;
    });
    wrap.innerHTML = html;
    box.appendChild(wrap);
  }

  const MAP = { stats: renderStats, radial: renderRadial, bars: renderBars, modules: renderModules, timeline: renderTimeline, line: renderLine, bar: renderBarChart, heatmap: renderHeatmap };
  const KEY = {
    "timeline:career": D.career,
    "modules:execSystems": D.execSystems,
    "modules:opsSystems": D.opsSystems,
    "bars:revenue": D.revenueBars,
    "bars:talentFunnel": D.talentFunnel,
    "stats:mgmtKpis6": D.mgmtKpis6,
    "heatmap:deptHeatmap": D.deptHeatmap,
    "bars:deptPerf": D.deptPerf,
    "bars:gradeDist": D.gradeDist,
    "modules:processImprove": D.processImprove,
    "modules:growthSystem": D.growthSystem,
    "modules:knowledgeShare": D.knowledgeShare,
    "modules:security": D.security,
    "stats:processGoals": D.processGoals,
    "stats:security": D.securityStats,
    "stats:mgmtSummary": D.mgmtSummary,
    "radial:mgmt": D.mgmtRadial,
    "bars:mgmt": D.mgmtBars,
    "line:mgmtTrend": D.mgmtTrend
  };
  $$("[data-render]").forEach((box) => {
    const spec = box.getAttribute("data-render");
    const [type] = spec.split(":");
    const fn = MAP[type], data = KEY[spec];
    if (fn && data) fn(box, data);
  });

  /* 레이디얼 공통 그라데이션 */
  const gdefs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  gdefs.setAttribute("width", "0"); gdefs.setAttribute("height", "0"); gdefs.style.position = "absolute";
  gdefs.innerHTML = `<defs><linearGradient id="radGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2a76bd"/><stop offset="100%" stop-color="#529DE3"/></linearGradient></defs>`;
  document.body.appendChild(gdefs);

  /* ============================================================
     스크롤 등장
     ============================================================ */
  const revObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((n) => revObs.observe(n));

  /* ============================================================
     네비게이션
     ============================================================ */
  const nav = $("#nav"), scrollbar = $("#scrollbar");
  const links = $$(".nav__link");
  const sections = links.map((l) => $("#" + l.dataset.target)).filter(Boolean);
  function onScroll() {
    const st = window.scrollY;
    nav.classList.toggle("scrolled", st > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollbar.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { const id = e.target.id; links.forEach((l) => l.classList.toggle("active", l.dataset.target === id)); }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  const toggle = $("#navToggle"), menu = $("#navMenu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navMenu a").forEach((a) => a.addEventListener("click", () => {
    menu.classList.remove("open"); toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
  }));

  /* ============================================================
     히어로 캔버스 — 연결된 노드 메시
     ============================================================ */
  if (!reduce) {
    const cv = $("#hero-canvas"), ctx = cv.getContext("2d");
    let w, h, dpr, nodes = [];
    const mouse = { x: -999, y: -999 };
    function size() {
      w = cv.clientWidth; h = cv.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.round((w * h) / 24000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.6 + 0.6
      }));
    }
    size();
    window.addEventListener("resize", size);
    cv.addEventListener("mousemove", (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    cv.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const nd of nodes) {
        nd.x += nd.vx; nd.y += nd.vy;
        if (nd.x < 0 || nd.x > w) nd.vx *= -1;
        if (nd.y < 0 || nd.y > h) nd.vy *= -1;
        const dx = nd.x - mouse.x, dy = nd.y - mouse.y, dm = Math.hypot(dx, dy);
        if (dm < 130) { nd.x += (dx / dm) * 0.6; nd.y += (dy / dm) * 0.6; }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 128) {
            ctx.strokeStyle = `rgba(120,170,255,${0.16 * (1 - d / 128)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const nd of nodes) {
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(159,192,255,0.7)"; ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
