/* =============================================================
   인터랙티브 시스템 데모 (임직원 500명 규모(이지케어텍 모델) 예시 데이터)
   각 "만들고 싶은 시스템" 카드를 클릭하면 실제처럼 작동하는 데모가 열립니다.
   ============================================================= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  const rint = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const won = (n) => Math.round(n).toLocaleString("ko-KR");
  const money = (n) => {
    if (n >= 100000000) { const v = n / 100000000; return (v % 1 ? v.toFixed(1) : v) + "억원"; }
    if (n >= 10000) return Math.round(n / 10000).toLocaleString("ko-KR") + "만원";
    return Math.round(n).toLocaleString("ko-KR") + "원";
  };
  const COMPANY = "이지케어텍";
  const THIS_MONTH = "2026년 6월";
  /* 인재 육성 모델 — 재직 500명 · 연 퇴직률 10% 이내 · 상·하반기 인턴 각 20명(연 40명)
     · 3개월 인턴교육 → 정규직 전환 → 입사 1년 현장실무교육 */
  const TALENT = {
    headcount: 500, attritionTarget: 10, attritionActual: 7.4,
    internsPerHalf: 20, internsYear: 40, internTrainMonths: 3,
    fieldTrainMonths: 12, conversionRate: 88, fieldCompletion: 94, coreRetention: 96
  };

  /* ============================================================
     500명 임직원 데이터 생성
     ============================================================ */
  const SUR = "김이박최정강조윤장임한오서신권황안송전홍고문양손배백허남".split("");
  const GIV = ["민준", "서연", "도윤", "하준", "서윤", "예준", "지호", "수아", "지유", "주원",
    "하은", "지훈", "수빈", "예은", "현우", "유진", "민서", "건우", "서현", "우진",
    "지원", "현서", "민재", "채원", "지안", "다은", "준우", "소율", "은우", "지율",
    "재윤", "한결", "예나", "도현", "유나", "시우", "다인", "태은", "가은", "준서"];
  /* 이지케어텍 사업·조직 구조 참조 (HIS 개발·구축·운영, 클라우드, 연구소, 해외, 경영지원) · 재직 500명 */
  const DEPT_DIST = [["HIS개발본부", 130], ["구축본부", 70], ["운영·SM본부", 110], ["클라우드사업부", 45], ["디지털헬스연구소", 30], ["QA본부", 25], ["데이터·AI", 22], ["해외사업부", 15], ["영업·마케팅", 28], ["경영지원본부", 20], ["전략기획실", 5]];
  /* 직급 구조 — 책임 · 파트장 · 팀장 · 본부장 · 연구소장 · 이사 · 전무 · 사업총괄 · 대표이사 */
  const SAL = { "책임": 4400000, "파트장": 5400000, "팀장": 6200000, "본부장": 8600000, "연구소장": 12000000, "이사": 11000000, "전무": 14000000, "사업총괄": 16000000, "대표이사": 20000000 };
  const posPick = () => {
    const r = Math.random() * 1000;
    if (r < 760) return "책임";
    if (r < 880) return "파트장";
    if (r < 945) return "팀장";
    if (r < 975) return "본부장";
    if (r < 990) return "이사";
    if (r < 996) return "전무";
    if (r < 998) return "연구소장";
    if (r < 999) return "사업총괄";
    return "대표이사";
  };

  const EMP = [];
  let _id = 1;
  DEPT_DIST.forEach(([dept, n]) => {
    for (let k = 0; k < n; k++) {
      const pos = posPick();
      const years = rint(1, 16);
      const joinY = 2026 - years;
      const salary = Math.round(SAL[pos] * (0.93 + Math.random() * 0.15) / 10000) * 10000;
      const leaveTotal = 15 + Math.min(10, Math.floor(years / 2));
      const leaveUsed = rint(0, leaveTotal);
      const ptype = Math.random() < 0.6 ? "DB" : "DC";
      const pension = Math.round(salary * 0.083 * years * 12 / 10000) * 10000;
      let loan = null;
      if (years >= 1 && Math.random() < 0.14) {
        const principal = rint(10, 30) * 1000000, months = [24, 36, 48, 60][rint(0, 3)], r = 0.02 / 12;
        const monthly = Math.round(principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
        const paid = rint(1, months - 1);
        const balance = Math.round(principal * (Math.pow(1 + r, months) - Math.pow(1 + r, paid)) / (Math.pow(1 + r, months) - 1));
        const curInterest = Math.round(balance * r), curPrincipal = monthly - curInterest;
        loan = { principal, months, monthly, paid, balance, curInterest, curPrincipal, ltype: ["전세자금", "월세보증금", "주택구입자금"][rint(0, 2)] };
      }
      EMP.push({
        id: _id++, name: pick(SUR) + pick(GIV), dept, pos,
        join: joinY + "." + String(rint(1, 12)).padStart(2, "0"), years,
        salary, leaveTotal, leaveUsed, leaveLeft: leaveTotal - leaveUsed,
        ptype, pension, growth: rint(62, 97), loan,
        skills: { 직무전문성: rint(60, 96), 협업: rint(62, 95), 문제해결: rint(58, 95), 학습속도: rint(60, 97), 리더십: rint(50, 92) }
      });
    }
  });
  const HEADCOUNT = EMP.length;
  const sum = (arr, f) => arr.reduce((a, b) => a + f(b), 0);
  const avg = (arr, f) => Math.round(sum(arr, f) / arr.length);

  /* ============================================================
     공통 UI 빌더
     ============================================================ */
  function statCards(items) {
    const wrap = el("div", "app-stats");
    items.forEach((it) => {
      wrap.appendChild(el("div", "app-stat" + (it.accent ? " app-stat--accent" : ""),
        `<div class="app-stat__label">${it.label}</div>
         <div class="app-stat__value">${it.value}${it.unit ? `<small>${it.unit}</small>` : ""}</div>
         ${it.sub ? `<div class="app-stat__sub">${it.sub}</div>` : ""}`));
    });
    return wrap;
  }
  function panel(title, sub) {
    const p = el("div", "app-panel");
    if (title) p.appendChild(el("div", "app-panel__title", `<span>${title}</span>${sub ? `<small>${sub}</small>` : ""}`));
    return p;
  }
  function tableWrap(head, rows) {
    const wrap = el("div", "app-tablewrap");
    const t = el("table", "app-table");
    t.innerHTML = `<thead><tr>${head.map((h) => `<th${h.cls ? ` class="${h.cls}"` : ""}>${h.t}</th>`).join("")}</tr></thead>`;
    const tb = el("tbody");
    rows.forEach((r) => tb.appendChild(r));
    t.appendChild(tb);
    wrap.appendChild(t);
    return wrap;
  }
  function pill(text, type) { return `<span class="pill pill--${type}">${text}</span>`; }
  function deptBars(map, fmt) {
    const wrap = el("div", "deptbars");
    const max = Math.max(...Object.values(map));
    Object.entries(map).forEach(([k, v]) => {
      const row = el("div");
      row.innerHTML = `<div class="deptbar__top"><span>${k}</span><b>${fmt ? fmt(v) : v}</b></div><div class="minibar"><i style="width:${(v / max * 100).toFixed(0)}%"></i></div>`;
      wrap.appendChild(row);
    });
    return wrap;
  }
  let _toastT;
  function toast(msg) {
    let t = $("#appToast");
    if (!t) { t = el("div", "toast"); t.id = "appToast"; document.body.appendChild(t); }
    t.textContent = msg; requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function badge(text) { return el("div", "app-badge", `${COMPANY} · 임직원 ${HEADCOUNT}명 · ${text}`); }
  /* 휴대폰 촬영 사진(JPG/PDF) 첨부 → 자동 인식·기록 (시뮬레이션) */
  function attachField(onRecognize, kind) {
    const wrap = el("div", "app-field");
    wrap.innerHTML = `<label>📎 증빙 사진/PDF 첨부 <span style="color:#b91c1c;font-weight:700">· 필수</span> <span style="color:var(--muted);font-weight:500">· 휴대폰 촬영</span></label>`;
    const input = el("input"); input.type = "file"; input.accept = "image/jpeg,image/png,application/pdf"; input.style.cssText = "font-size:.8rem;max-width:210px";
    const info = el("div"); info.style.cssText = "font-size:.76rem;color:#16a34a;font-weight:600;margin-top:5px;min-height:15px";
    const prev = el("img"); prev.style.cssText = "display:none;margin-top:8px;max-width:130px;max-height:96px;border-radius:8px;border:1px solid var(--line);object-fit:cover";
    input.onchange = () => {
      if (!input.files.length) return;
      const f = input.files[0];
      if (f.type.indexOf("image/") === 0) { prev.src = URL.createObjectURL(f); prev.style.display = "block"; } else { prev.style.display = "none"; }
      if (kind === "doc") { info.textContent = `✓ '${f.name}' 증빙 확인 — 자동 첨부·기록됨`; return; }
      const amt = rint(3, 20) * 10000, day = String(rint(1, 28)).padStart(2, "0");
      info.textContent = `✓ '${f.name}' 자동 인식 — 금액 ${won(amt)}원 · 날짜 2026-06-${day} 추출됨`;
      if (onRecognize) onRecognize(amt);
    };
    wrap.appendChild(input); wrap.appendChild(info); wrap.appendChild(prev);
    return wrap;
  }

  /* 현재 시각 스탬프(처리 이력용) — 데모 기준월(2026-06)에 시:분 표시 */
  function nowStamp() {
    const d = new Date(); const p = (n) => String(n).padStart(2, "0");
    return `06.30 ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  /* 위임전결 규정(예시) — 금액 구간별 전결권자 자동 결재선 라우팅 (Flowable/BPM식 조건 분기) */
  function delegationLine(applicant, amount) {
    if (!amount || amount <= 500000) return { line: [{ role: "기안", name: applicant }, { role: "팀장(전결)", name: "김도현" }], rule: "50만원 이하 · 팀장 전결" };
    if (amount <= 3000000) return { line: [{ role: "기안", name: applicant }, { role: "팀장", name: "김도현" }, { role: "본부장(전결)", name: "이서준" }], rule: "300만원 이하 · 본부장 전결" };
    return { line: [{ role: "기안", name: applicant }, { role: "팀장", name: "김도현" }, { role: "본부장", name: "이서준" }, { role: "대표이사", name: "오세현" }], rule: "300만원 초과 · 대표이사 결재" };
  }
  /* 처리 이력(감사 추적) 타임라인 HTML (Odoo chatter·Flowable history식) */
  function historyHtml(hist) {
    if (!hist || !hist.length) return "";
    const rows = hist.map((h) => {
      const c = h.action === "반려" ? "#dc2626" : h.action === "상신" ? "var(--accent-deep)" : "#16a34a";
      return `<div style="display:flex;gap:10px;align-items:baseline;padding:7px 0;border-bottom:1px dashed var(--line)"><span style="flex:none;width:84px;font-size:.72rem;color:var(--muted)">${h.time}</span><span style="flex:none;width:110px;font-size:.77rem;font-weight:700;color:var(--ink)">${h.who}</span><span style="flex:none;width:42px;font-size:.74rem;font-weight:800;color:${c}">${h.action}</span><span style="font-size:.78rem;color:var(--text)">${h.comment || ""}</span></div>`;
    }).join("");
    return `<div class="app-panel" style="margin-top:14px"><div class="app-panel__title">🧾 처리 이력 (감사 추적)</div><div style="padding:2px 2px 0">${rows}</div></div>`;
  }

  /* 다단계 전자결재 품의서 팝업 (경비·복리후생·근태 공용)
     — 위임전결(금액 기준 자동 결재선)·결재 의견·반려 사유·처리 이력(감사 추적)·회계 전표 자동 분개
       (오픈소스 우수 OA/HR 패턴 참고: Frappe HR · 芋道 ruoyi-vue-pro/Flowable · Odoo Approvals) */
  function approvalPopup(opts) {
    // opts: { docName, title, fields, line, onDone, amount?, autoDelegate?, journal?{debit,credit} }
    let line = opts.line, delegationRule = "";
    if (opts.amount && opts.autoDelegate) { const d = delegationLine((line[0] && line[0].name) || "기안자", opts.amount); line = d.line; delegationRule = d.rule; }
    const total = line.length;
    let step = 1, rejected = false;
    const hist = [{ time: nowStamp(), who: (line[0] && line[0].name) || "기안자", action: "상신", comment: "문서 상신·기안" }];
    const ov = el("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:600;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(6,21,40,0.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)";
    const win = el("div");
    win.style.cssText = "background:#fff;border-radius:18px;max-width:580px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 40px 90px rgba(4,16,31,.5);animation:appIn .35s var(--ease)";
    function close() { ov.remove(); }
    function render() {
      const allDone = !rejected && step >= total;
      const stamps = line.map((a, i) => {
        const done = i < step && !rejected, cur = i === step && !allDone && !rejected, rej = rejected && i === step;
        const lbl = rej ? "반려" : done ? "✓승인" : cur ? "결재중" : "대기";
        const bd = rej ? "#dc2626" : done ? "#16a34a" : cur ? "var(--accent)" : "var(--line)";
        const bg = rej ? "rgba(220,38,38,.08)" : done ? "rgba(22,163,74,.08)" : cur ? "var(--accent-soft)" : "#fff";
        const cl = rej ? "#dc2626" : done ? "#16a34a" : cur ? "var(--accent-deep)" : "var(--muted)";
        return `<div style="text-align:center;flex:1;min-width:62px"><div style="width:54px;height:54px;margin:0 auto;border-radius:13px;border:2px solid ${bd};display:grid;place-items:center;background:${bg};color:${cl};font-size:.66rem;font-weight:800">${lbl}</div><div style="font-size:.73rem;color:var(--ink);font-weight:700;margin-top:6px">${a.role}</div><div style="font-size:.69rem;color:var(--muted)">${a.name}</div></div>`;
      }).join('<div style="align-self:flex-start;margin-top:20px;color:var(--silver-3);font-weight:700">›</div>');
      const deleg = delegationRule ? `<div style="margin:0 0 14px;font-size:.78rem;color:var(--accent-deep);background:var(--accent-soft);border-radius:9px;padding:8px 12px">🧭 <b>위임전결 규정 자동 적용</b> — ${delegationRule}</div>` : "";
      const journalHtml = (allDone && opts.journal && opts.amount) ? `<div class="app-panel" style="margin-top:14px"><div class="app-panel__title">📒 회계 전표 (자동 분개)</div><div class="detail-list"><div><span>(차변) ${opts.journal.debit}</span><b>${won(opts.amount)}원</b></div><div><span>(대변) ${opts.journal.credit}</span><b>${won(opts.amount)}원</b></div></div><div style="font-size:.72rem;color:var(--muted);margin-top:6px">※ 결재 완료 시 회계 전표가 자동 생성됩니다 (Frappe HR식 결재–회계 연동).</div></div>` : "";
      const opinion = (!allDone && !rejected) ? `<div class="app-field" style="margin-top:14px"><label>결재 의견 <span style="color:var(--muted);font-weight:500">· 반려 시 사유 필수</span></label><textarea class="appr-cmt" rows="2" style="width:100%;resize:vertical;font-family:inherit" placeholder="의견을 입력하세요 (승인 시 선택 · 반려 시 사유 필수)"></textarea></div>` : "";
      const ctrl = rejected
        ? `<span style="color:#dc2626;font-weight:800">✕ 반려되었습니다</span><button class="appr-done btn-sm btn-sm--no">닫기</button>`
        : allDone
          ? `<span style="color:#16a34a;font-weight:800">✓ 결재가 완료되었습니다</span><button class="appr-done btn-sm btn-sm--ok">확인·기록</button>`
          : `<button class="appr-rej btn-sm btn-sm--no">반려</button><button class="appr-next btn-sm btn-sm--p">${line[step].role} 승인</button>`;
      win.innerHTML = `<div style="padding:18px 22px;background:var(--grad-navy);color:#fff;display:flex;justify-content:space-between;align-items:center"><div><div style="font-weight:800;font-size:1.12rem">📄 ${opts.docName}</div><div style="font-size:.76rem;color:#9fb2cd;margin-top:2px">${opts.title} · 다단계 전자결재</div></div><button class="appr-x" style="width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;flex-shrink:0">✕</button></div><div style="padding:22px"><div style="display:flex;gap:4px;margin-bottom:18px;overflow-x:auto;padding-bottom:4px">${stamps}</div>${deleg}<div class="app-panel"><div class="app-panel__title">품의 내용</div><div class="detail-list">${opts.fields.map((f) => `<div><span>${f[0]}</span><b>${f[1]}</b></div>`).join("")}</div></div>${journalHtml}${historyHtml(hist)}${opinion}<div style="margin-top:16px;display:flex;justify-content:flex-end;align-items:center;gap:10px">${ctrl}</div></div>`;
      win.querySelector(".appr-x").onclick = close;
      const next = win.querySelector(".appr-next");
      if (next) next.onclick = () => { const a = line[step]; const cmt = ((win.querySelector(".appr-cmt") || {}).value || "").trim(); hist.push({ time: nowStamp(), who: `${a.role} ${a.name}`, action: "승인", comment: cmt || "검토 후 승인" }); step++; toast(`${a.role} 결재 승인 (${step - 1}/${total - 1}단계)`); render(); };
      const rej = win.querySelector(".appr-rej");
      if (rej) rej.onclick = () => { const cmt = ((win.querySelector(".appr-cmt") || {}).value || "").trim(); if (!cmt) { toast("반려 사유를 입력해 주세요."); const t = win.querySelector(".appr-cmt"); if (t) t.focus(); return; } const a = line[step]; hist.push({ time: nowStamp(), who: `${a.role} ${a.name}`, action: "반려", comment: cmt }); rejected = true; toast("품의가 반려되었습니다."); render(); };
      const doneBtn = win.querySelector(".appr-done");
      if (doneBtn) doneBtn.onclick = () => { if (!rejected && opts.onDone) opts.onDone({ history: hist }); close(); };
    }
    ov.onclick = (e) => { if (e.target === ov) close(); };
    render();
    ov.appendChild(win); document.body.appendChild(ov);
  }

  /* 결재 상태 코드 → 한글 라벨 */
  function statusLabel(s) { return s === "done" ? "승인 완료" : s === "rej" ? "반려" : "승인 대기"; }

  /* 문서 종류별 문서번호(예시) — 내용 기반으로 안정적으로 생성 */
  function docNumber(name) {
    const s = String(name || "");
    let pfx = "DOC";
    if (/급여|명세/.test(s)) pfx = "PY"; else if (/세무|신고/.test(s)) pfx = "TX";
    else if (/퇴직연금/.test(s)) pfx = "PN"; else if (/교육/.test(s)) pfx = "ED";
    else if (/역량|평가/.test(s)) pfx = "EV"; else if (/예산/.test(s)) pfx = "BG";
    else if (/지출|경비/.test(s)) pfx = "EX"; else if (/휴가|근태|연차/.test(s)) pfx = "HR";
    else if (/의료/.test(s)) pfx = "MD"; else if (/경조/.test(s)) pfx = "CG"; else if (/복리/.test(s)) pfx = "WF";
    let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return `${pfx}-2026-${String(1000 + (h % 9000))}`;
  }

  /* 원본 문서(신청양식) HTML — 회사명·제목·문서번호·결재란·신청내용·서명란을 갖춘 정식 양식 */
  function formDocHtml(opts) {
    const today = "2026-06-30";
    const docNo = opts.docNo || docNumber(opts.docName);
    const applicant = opts.applicant || (() => {
      const f = (opts.fields || []).find((x) => /신청자|기안자|근로자|성명|지급 대상/.test(x[0]));
      return f ? String(f[1]) : "________";
    })();
    // 결재란: line이 있으면 그 진행상태로, 없으면 기안/검토/승인 기본 칸
    const cols = (opts.line && opts.line.length) ? opts.line
      : [{ role: "기안", name: applicant === "________" ? "" : applicant, state: "current" }, { role: "검토", name: "", state: "wait" }, { role: "승인", name: "", state: "wait" }];
    const roleCells = cols.map((a) => `<td style="border:1px solid #cbd5e1;background:#eef2f7;font-size:.64rem;font-weight:700;color:#475569;text-align:center;padding:3px 6px">${a.role}</td>`).join("");
    const stampCells = cols.map((a) => {
      const lbl = a.state === "done" ? "✓승인" : a.state === "rej" ? "반려" : a.state === "current" ? "결재중" : "";
      const col = a.state === "done" ? "#16a34a" : a.state === "rej" ? "#dc2626" : a.state === "current" ? "#2a76bd" : "#94a3b8";
      return `<td style="border:1px solid #cbd5e1;width:60px;height:40px;text-align:center;vertical-align:middle;font-size:.7rem;font-weight:800;color:${col}">${lbl}</td>`;
    }).join("");
    const nameCells = cols.map((a) => `<td style="border:1px solid #cbd5e1;font-size:.62rem;color:#64748b;text-align:center;padding:2px 4px">${a.name || ""}</td>`).join("");
    const rows = (opts.fields || []).map((f) => `<tr><th style="border:1px solid var(--line);background:var(--bg-soft);text-align:left;padding:9px 12px;font-weight:700;color:var(--ink);width:36%;font-size:.84rem;vertical-align:top">${f[0]}</th><td style="border:1px solid var(--line);padding:9px 12px;color:var(--text);font-size:.88rem">${f[1]}</td></tr>`).join("");
    // 처리 이력(감사 추적) — 결재란 상태로부터 합성
    const baseTimes = ["09:10", "10:25", "11:40", "14:05", "16:20"];
    const synth = [{ t: "06.30 " + baseTimes[0], who: (cols[0].name || applicant), act: "상신", c: "문서 상신·기안" }];
    cols.forEach((a, i) => { if (i === 0) return; if (a.state === "done") synth.push({ t: "06.30 " + (baseTimes[i] || "17:00"), who: a.role + " " + (a.name || ""), act: "승인", c: "검토 후 승인" }); else if (a.state === "rej") synth.push({ t: "06.30 " + (baseTimes[i] || "17:00"), who: a.role + " " + (a.name || ""), act: "반려", c: "반려" }); });
    const histRows = synth.map((h) => { const c = h.act === "반려" ? "#dc2626" : h.act === "상신" ? "#2a76bd" : "#16a34a"; return `<div style="display:flex;gap:10px;align-items:baseline;padding:6px 0;border-bottom:1px dashed var(--line)"><span style="flex:none;width:84px;font-size:.72rem;color:var(--muted)">${h.t}</span><span style="flex:none;width:120px;font-size:.76rem;font-weight:700;color:var(--ink)">${h.who}</span><span style="flex:none;width:42px;font-size:.74rem;font-weight:800;color:${c}">${h.act}</span><span style="font-size:.78rem;color:var(--text)">${h.c}</span></div>`; }).join("");
    const histBlock = `<div style="margin-top:18px"><div style="font-size:.82rem;font-weight:800;color:var(--ink);border-bottom:2px solid var(--ink);padding-bottom:5px;margin-bottom:4px">처리 이력 (감사 추적)</div>${histRows}</div>`;
    const journalBlock = (opts.journal && opts.amount) ? `<div style="margin-top:18px"><div style="font-size:.82rem;font-weight:800;color:var(--ink);border-bottom:2px solid var(--ink);padding-bottom:5px;margin-bottom:8px">회계 전표 (자동 분개)</div><table style="width:100%;border-collapse:collapse;font-size:.84rem"><tr><th style="border:1px solid var(--line);background:var(--bg-soft);padding:7px 10px;width:55%;text-align:left;font-weight:700;color:var(--ink)">(차변) ${opts.journal.debit}</th><td style="border:1px solid var(--line);padding:7px 10px;text-align:right;font-weight:700;color:var(--ink)">${won(opts.amount)}원</td></tr><tr><th style="border:1px solid var(--line);background:var(--bg-soft);padding:7px 10px;text-align:left;font-weight:700;color:var(--ink)">(대변) ${opts.journal.credit}</th><td style="border:1px solid var(--line);padding:7px 10px;text-align:right;font-weight:700;color:var(--ink)">${won(opts.amount)}원</td></tr></table><div style="font-size:.72rem;color:var(--muted);margin-top:6px">※ 결재 완료 시 회계 전표가 자동 생성됩니다 (Frappe HR식 결재–회계 연동).</div></div>` : "";
    return `<div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:28px 30px;box-shadow:0 2px 10px rgba(0,0,0,.05)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div style="font-size:.74rem;color:var(--muted);font-weight:700;padding-top:4px">${COMPANY}</div>
          <table style="border-collapse:collapse"><tr><td rowspan="3" style="border:1px solid #cbd5e1;background:#eef2f7;font-size:.6rem;font-weight:800;color:#475569;writing-mode:vertical-rl;letter-spacing:.25em;padding:8px 4px;text-align:center">결재</td>${roleCells}</tr><tr>${stampCells}</tr><tr>${nameCells}</tr></table>
        </div>
        <h3 style="text-align:center;font-family:var(--serif);font-size:1.45rem;font-weight:800;color:var(--ink);letter-spacing:.3em;margin:4px 0 14px">${opts.docName}</h3>
        <div style="display:flex;justify-content:space-between;font-size:.76rem;color:var(--muted);border-top:2px solid var(--ink);border-bottom:1px solid var(--line);padding:7px 2px;margin-bottom:14px"><span>문서번호 · ${docNo}</span><span>작성일 · ${today}</span></div>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        ${opts.note ? `<div style="margin-top:12px;font-size:.8rem;color:var(--text);line-height:1.6">${opts.note}</div>` : ""}
        ${journalBlock}
        ${histBlock}
        <div style="text-align:center;margin-top:20px;font-size:.92rem;color:var(--ink);font-weight:600">위 내용과 같이 신청합니다.</div>
        <div style="text-align:right;margin-top:8px;font-size:.82rem;color:var(--text)">${today} &nbsp;&nbsp; 신청인 <b>${applicant}</b> (인)</div>
        <div style="margin-top:14px;font-size:.72rem;color:var(--muted);border-top:1px dashed var(--line);padding-top:8px">※ 본 문서는 시스템 시연용 예시 데이터로 자동 생성된 <b>원본 문서</b> 미리보기입니다.</div>
      </div>`;
  }

  /* 더블클릭 시 열리는 문서 팝업.
     - opts.extraHtml 있음(처리 진행 등) → 단계/타임라인 레이아웃
     - 그 외(신청 문서) → 정식 양식(원본 문서) 레이아웃 */
  function docPopup(opts) {
    const ov = el("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:600;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(6,21,40,0.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)";
    const win = el("div");
    win.style.cssText = "background:#fff;border-radius:18px;max-width:640px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 40px 90px rgba(4,16,31,.5);animation:appIn .35s var(--ease)";
    function close() { ov.remove(); }
    let bodyInner;
    if (opts.extraHtml) {
      const fieldsHtml = (opts.fields || []).map((f) => `<div><span>${f[0]}</span><b>${f[1]}</b></div>`).join("");
      bodyInner = `${fieldsHtml ? `<div class="app-panel"><div class="app-panel__title">${opts.fieldsTitle || "신청 내역"}</div><div class="detail-list">${fieldsHtml}</div></div>` : ""}${opts.extraHtml}`;
    } else {
      bodyInner = formDocHtml(opts);
    }
    win.innerHTML =
      `<div style="padding:18px 22px;background:var(--grad-navy);color:#fff;display:flex;justify-content:space-between;align-items:center"><div><div style="font-weight:800;font-size:1.12rem">📄 ${opts.docName}</div><div style="font-size:.76rem;color:#9fb2cd;margin-top:2px">${opts.title || ""} · ${opts.kind || "원본 문서"}</div></div><button class="doc-x" style="width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;flex-shrink:0">✕</button></div>` +
      `<div style="padding:22px;background:var(--bg-soft)">${bodyInner}<div style="margin-top:18px;display:flex;justify-content:flex-end"><button class="doc-ok btn-sm btn-sm--p">닫기</button></div></div>`;
    win.querySelector(".doc-x").onclick = close;
    win.querySelector(".doc-ok").onclick = close;
    ov.onclick = (e) => { if (e.target === ov) close(); };
    ov.appendChild(win); document.body.appendChild(ov);
    return { close, win };
  }

  /* 표 아래 더블클릭 안내 문구 */
  function dblHint(msg) {
    const n = el("div");
    n.style.cssText = "font-size:.76rem;color:var(--muted);margin-top:9px";
    n.innerHTML = "💡 " + (msg || "품의서 <b>행을 더블클릭</b>하면 신청내역이 팝업으로 열립니다.");
    return n;
  }

  /* 사용 근로자(대상자) 선택 옵션 — 대리상신 지원 (병가·출장 등) */
  function empOpts() {
    return `<option>이미연 (경영지원본부 · 책임)</option>` + EMP.slice(0, 60).map((e) => `<option>${e.name} (${e.dept} · ${e.pos})</option>`).join("");
  }
  /* 모든 시스템에 모바일 결재 안내 (보안 환경 대응) */
  function appendMobileNote(root) {
    const n = el("div");
    n.style.cssText = "margin-top:18px;padding:14px 16px;border:1px solid rgba(82,157,227,0.28);border-radius:12px;background:var(--accent-soft);font-size:.83rem;color:var(--ink-2);line-height:1.65";
    n.innerHTML = `<b style="color:var(--accent-deep)">📱 모바일 지원</b> — 외부 노트북 반입이 제한된 보안 개발 환경에서도 <b>기안·상신·승인·결재를 휴대폰</b>으로 처리하고, 촬영한 <b>사진(JPG·PDF)</b>은 자동 인식되어 신청서에 기록됩니다.`;
    root.appendChild(n);
  }
  /* DOM 노드 → PDF 저장 (html2canvas + jsPDF) */
  function pdfFromNode(node, filename) {
    const lib = window.jspdf;
    if (!window.html2canvas || !lib) { toast("PDF 모듈을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요."); return; }
    toast("PDF 생성 중…");
    window.html2canvas(node, { scale: 2, backgroundColor: "#ffffff" }).then((canvas) => {
      const img = canvas.toDataURL("image/jpeg", 0.96);
      const pdf = new lib.jsPDF("p", "mm", "a4");
      const pw = 210, ph = 297, ih = canvas.height * pw / canvas.width;
      let leftH = ih, pos = 0;
      pdf.addImage(img, "JPEG", 0, pos, pw, ih); leftH -= ph;
      while (leftH > 0) { pos -= ph; pdf.addPage(); pdf.addImage(img, "JPEG", 0, pos, pw, ih); leftH -= ph; }
      pdf.save(filename);
      toast("PDF를 내려받았습니다.");
    }).catch(() => toast("PDF 생성 중 오류가 발생했습니다."));
  }

  /* ============================================================
     모달 프레임워크
     ============================================================ */
  const modal = el("div", "app-modal"); modal.id = "appModal";
  modal.innerHTML =
    `<div class="app-window" role="dialog" aria-modal="true">
       <div class="app-window__head">
         <div><div class="app-window__title"><span class="ic"></span><span class="ttl"></span></div><div class="app-window__desc"></div></div>
         <button class="app-window__close" aria-label="닫기">✕</button>
       </div>
       <div class="app-window__body"></div>
     </div>`;
  document.body.appendChild(modal);
  const body = $(".app-window__body", modal);
  let current = null;
  function openApp(id) {
    const app = APPS[id]; if (!app) return;
    current = id;
    $(".app-window__title .ic", modal).textContent = app.ic;
    $(".app-window__title .ttl", modal).textContent = app.title;
    $(".app-window__desc", modal).textContent = app.desc;
    body.innerHTML = ""; body.scrollTop = 0;
    app.render(body);
    appendRegs(id, body);
    appendMobileNote(body);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeApp() { modal.classList.remove("open"); document.body.style.overflow = ""; current = null; }
  function refresh() { if (current) { body.innerHTML = ""; APPS[current].render(body); } }
  $(".app-window__close", modal).addEventListener("click", closeApp);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeApp(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeApp(); });
  document.addEventListener("click", (e) => { const card = e.target.closest("[data-app]"); if (card) openApp(card.dataset.app); });

  /* ============================================================
     1) 휴가 관리 자동화
     ============================================================ */
  const leaveReqSeed = [
    { name: "정서연", dept: "HIS개발본부", type: "연차", days: 2, period: "06.24~06.25", status: "wait" },
    { name: "김도윤", dept: "영업·마케팅", type: "반차", days: 0.5, period: "06.23 오후", status: "wait" },
    { name: "박하준", dept: "전략기획실", type: "연차", days: 3, period: "06.30~07.02", status: "wait" }
  ];
  let leaveReqs = leaveReqSeed.map((x) => ({ ...x }));

  function appLeave(root) {
    leaveReqs = leaveReqSeed.map((x) => ({ ...x }));
    root.appendChild(badge("근태·연차 관리"));
    const usedRate = Math.round(sum(EMP, (e) => e.leaveUsed) / sum(EMP, (e) => e.leaveTotal) * 100);
    root.appendChild(statCards([
      { label: "전체 임직원", value: HEADCOUNT, unit: "명" },
      { label: "평균 잔여 연차", value: avg(EMP, (e) => e.leaveLeft), unit: "일" },
      { label: "연차 사용률", value: usedRate, unit: "%", accent: true },
      { label: "승인 대기", value: leaveReqs.filter((r) => r.status === "wait").length, unit: "건", sub: "결재 필요" }
    ]));

    const grid = el("div", "app-row app-row--3-2");
    /* 신청/결재 패널 */
    const left = panel("휴가 신청 및 결재", THIS_MONTH);
    const form = el("form", "app-form");
    const opts = EMP.slice(0, 40).map((e) => `<option>${e.name} (${e.dept})</option>`).join("");
    form.innerHTML =
      `<div class="app-field"><label>신청자</label><select name="emp">${opts}</select></div>
       <div class="app-field"><label>유형</label><select name="type"><option>연차</option><option>반차</option><option>경조사</option></select></div>
       <div class="app-field"><label>일수</label><input name="days" type="number" min="0.5" step="0.5" value="1" style="width:90px"></div>
       <button class="btn-sm btn-sm--p" type="submit">휴가 신청</button>`;
    left.appendChild(form);
    const reqWrap = el("div"); reqWrap.style.marginTop = "16px";
    left.appendChild(reqWrap);
    left.appendChild(dblHint());

    function rowFor(r, idx) {
      const tr = el("tr");
      const act = r.status === "wait"
        ? `<div class="btn-row"><button class="btn-sm btn-sm--ok" data-ok="${idx}">승인</button><button class="btn-sm btn-sm--no" data-no="${idx}">반려</button></div>`
        : r.status === "done" ? pill("승인 완료", "done") : pill("반려", "rej");
      tr.innerHTML = `<td class="name">${r.name}</td><td>${r.dept}</td><td>${r.type}</td><td class="center">${r.days}일</td><td>${r.period || "-"}</td><td>${act}</td>`;
      tr.style.cursor = "pointer"; tr.title = "더블클릭: 신청내역 보기";
      tr.ondblclick = () => docPopup({
        docName: "휴가 신청 품의서", title: "근태·연차 관리",
        fields: [["신청자", r.name], ["부서", r.dept], ["휴가 종류", r.type], ["사용 일수", r.days + "일"], ["기간", r.period || "-"], ["처리 상태", statusLabel(r.status)]]
      });
      return tr;
    }
    function drawReqs() {
      reqWrap.innerHTML = "";
      reqWrap.appendChild(tableWrap(
        [{ t: "신청자" }, { t: "부서" }, { t: "유형" }, { t: "일수", cls: "center" }, { t: "기간" }, { t: "처리" }],
        leaveReqs.map((r, i) => rowFor(r, i))
      ));
      $$("[data-ok]", reqWrap).forEach((b) => b.onclick = () => { leaveReqs[+b.dataset.ok].status = "done"; toast("휴가가 승인되었습니다. 잔여 연차가 자동 반영됩니다."); updateWait(); drawReqs(); });
      $$("[data-no]", reqWrap).forEach((b) => b.onclick = () => { leaveReqs[+b.dataset.no].status = "rej"; toast("휴가가 반려되었습니다."); updateWait(); drawReqs(); });
    }
    function updateWait() {
      const w = leaveReqs.filter((r) => r.status === "wait").length;
      $$(".app-stat", root)[3].querySelector(".app-stat__value").innerHTML = `${w}<small>건</small>`;
    }
    form.onsubmit = (e) => {
      e.preventDefault();
      const f = e.target;
      const name = f.emp.value.split(" (")[0], dept = f.emp.value.match(/\((.*)\)/)[1];
      approvalPopup({
        docName: "휴가 신청 품의서", title: "근태·연차 관리",
        fields: [["기안자", f.emp.value], ["휴가 종류", f.type.value], ["사용 일수", f.days.value + "일"], ["신청 구분", "신규 신청"]],
        line: [{ role: "기안", name }, { role: "파트장", name: "오세훈" }, { role: "팀장", name: "김도현" }, { role: "본부장", name: "이서준" }],
        onDone: () => { leaveReqs.unshift({ name, dept, type: f.type.value, days: +f.days.value, period: "신규 신청", status: "done" }); toast("휴가 신청이 다단계 결재 완료되어 승인되었습니다."); updateWait(); drawReqs(); }
      });
    };
    drawReqs();

    /* 부서별 사용 현황 */
    const right = panel("부서별 연차 사용률");
    const byDept = {};
    DEPT_DIST.forEach(([d]) => { const list = EMP.filter((e) => e.dept === d); byDept[d] = Math.round(sum(list, (e) => e.leaveUsed) / sum(list, (e) => e.leaveTotal) * 100); });
    right.appendChild(deptBars(byDept, (v) => v + "%"));

    grid.appendChild(left); grid.appendChild(right);
    root.appendChild(grid);
  }

  /* ============================================================
     2) 급여 자동화 시스템
     ============================================================ */
  function appPayroll(root) {
    root.appendChild(badge("급여 정산 · " + THIS_MONTH));
    const totalBase = sum(EMP, (e) => e.salary);
    const totalDeduct = Math.round(totalBase * 0.094 + totalBase * 0.035);
    const totalNet = totalBase - totalDeduct;
    root.appendChild(statCards([
      { label: "지급 대상", value: HEADCOUNT, unit: "명" },
      { label: "총 지급액(세전)", value: money(totalBase) },
      { label: "총 공제액", value: money(totalDeduct), sub: "4대보험 + 소득세" },
      { label: "실지급 합계", value: money(totalNet), accent: true }
    ]));

    const grid = el("div", "app-row app-row--3-2");
    const left = panel("급여 명세 — 행을 클릭하면 명세서가 열립니다", THIS_MONTH + " 귀속");
    const rows = EMP.map((e) => {
      const allowance = Math.round(e.salary * (0.05 + Math.random() * 0.12) / 1000) * 1000;
      const gross = e.salary + allowance;
      const ins = Math.round(gross * 0.094 / 10) * 10;
      const tax = Math.round(gross * 0.035 / 10) * 10;
      const loanRepay = e.loan ? e.loan.monthly : 0;
      const net = gross - ins - tax - loanRepay;
      e._pay = { allowance, gross, ins, tax, loanRepay, net };
      const tr = el("tr");
      tr.style.cursor = "pointer";
      tr.innerHTML = `<td class="name">${e.name}</td><td>${e.dept} · ${e.pos}</td><td class="num">${won(e.salary)}</td><td class="num">${won(allowance)}</td><td class="num">${won(ins + tax + loanRepay)}</td><td class="num">${won(net)}</td>`;
      tr.onclick = () => showSlip(e);
      tr.title = "더블클릭: 급여명세서 팝업";
      tr.ondblclick = () => {
        const p = e._pay;
        const fields = [["성명", e.name], ["소속/직급", e.dept + " · " + e.pos], ["귀속", THIS_MONTH], ["기본급", won(e.salary) + "원"], ["제수당", won(p.allowance) + "원"], ["지급 합계", won(p.gross) + "원"], ["4대보험", "- " + won(p.ins) + "원"], ["소득세 등", "- " + won(p.tax) + "원"]];
        if (e.loan) fields.push(["주택자금 대출 상환", "- " + won(e.loan.monthly) + "원"]);
        fields.push(["실지급액", won(p.net) + "원"]);
        docPopup({ docName: e.name + " 급여명세서", title: "급여 관리 · " + THIS_MONTH, kind: "급여명세서", fieldsTitle: "급여명세서", fields });
      };
      return tr;
    });
    left.appendChild(tableWrap(
      [{ t: "성명" }, { t: "소속/직급" }, { t: "기본급", cls: "num" }, { t: "수당", cls: "num" }, { t: "공제", cls: "num" }, { t: "실지급", cls: "num" }],
      rows
    ));
    left.appendChild(dblHint("급여 명세 행을 <b>더블클릭</b>하면 급여명세서가 팝업으로 열립니다."));
    const closeBtn = el("button", "btn-sm btn-sm--p", "이번 달 급여 마감 확정");
    closeBtn.style.marginTop = "14px";
    closeBtn.onclick = () => { closeBtn.textContent = "✓ 6월 급여 마감 완료"; closeBtn.disabled = true; toast("급여가 마감되어 이체 대기 상태로 전환되었습니다."); };
    left.appendChild(closeBtn);

    const right = panel("급여명세서");
    const slip = el("div"); slip.innerHTML = `<p class="app-note">왼쪽 명단에서 직원을 선택하세요.</p>`;
    right.appendChild(slip);
    function showSlip(e) {
      const p = e._pay;
      slip.innerHTML =
        `<div style="font-weight:800;color:var(--ink);font-size:1.05rem;margin-bottom:4px">${e.name} <span style="font-weight:600;color:var(--muted);font-size:.85rem">${e.dept} · ${e.pos}</span></div>
         <div style="font-size:.78rem;color:var(--muted);margin-bottom:14px">${THIS_MONTH} 급여명세서 · 입사 ${e.join}</div>
         <div class="detail-list">
           <div><span>기본급</span><b>${won(e.salary)}원</b></div>
           <div><span>제수당</span><b>${won(p.allowance)}원</b></div>
           <div><span>지급 합계</span><b>${won(p.gross)}원</b></div>
           <div><span>4대보험</span><b>- ${won(p.ins)}원</b></div>
           <div><span>소득세 등</span><b>- ${won(p.tax)}원</b></div>
           ${e.loan ? `<div><span>주택자금 대출 상환</span><b>- ${won(e.loan.monthly)}원</b></div>` : ""}
           <div class="total"><span>실지급액</span><b>${won(p.net)}원</b></div>
         </div>
         ${e.loan ? `<div style="margin-top:14px;padding:14px;background:var(--bg-soft);border-radius:10px"><div style="font-weight:700;color:var(--ink);font-size:.9rem;margin-bottom:8px">🏠 주택자금 대출 상환 안내 <span style="font-weight:500;color:var(--muted);font-size:.78rem">· 원리금균등 · 연 2%</span></div><div class="detail-list"><div><span>대출 종류</span><b>${e.loan.ltype}</b></div><div><span>대출 원금</span><b>${won(e.loan.principal)}원</b></div><div><span>월 상환액(원리금)</span><b>${won(e.loan.monthly)}원</b></div><div><span>　└ 원금</span><b>${won(e.loan.curPrincipal)}원</b></div><div><span>　└ 이자(연 2%)</span><b>${won(e.loan.curInterest)}원</b></div><div><span>상환 회차</span><b>${e.loan.paid} / ${e.loan.months}회</b></div><div class="total"><span>대출 잔액</span><b>${won(e.loan.balance)}원</b></div></div><div style="font-size:.74rem;color:var(--muted);margin-top:8px">※ 계산방식: 매월 이자 = 대출잔액 × (2% ÷ 12), 원금 = 월상환액 − 이자. 급여에서 자동 공제됩니다.</div></div>` : ""}`;
    }
    grid.appendChild(left); grid.appendChild(right);
    root.appendChild(grid);
  }

  /* ============================================================
     3) 세무 신고 자동화
     ============================================================ */
  function appTax(root) {
    root.appendChild(badge("원천세·세무 신고 · " + THIS_MONTH));
    const base = sum(EMP, (e) => e.salary);
    const taxes = [
      { name: "원천세 (근로소득)", amount: Math.round(base * 0.035 / 1000) * 1000, due: "07.10", status: "wait" },
      { name: "지방소득세", amount: Math.round(base * 0.0035 / 1000) * 1000, due: "07.10", status: "wait" },
      { name: "4대보험 (사업주 부담)", amount: Math.round(base * 0.105 / 1000) * 1000, due: "07.10", status: "wait" },
      { name: "부가가치세 (예정)", amount: 18400000, due: "07.25", status: "wait" }
    ];
    const stat = statCards([
      { label: "이번 달 신고 항목", value: taxes.length, unit: "건" },
      { label: "총 납부 예정액", value: money(sum(taxes, (t) => t.amount)), accent: true },
      { label: "신고 완료", value: 0, unit: "/ " + taxes.length, sub: "마감 전" },
      { label: "다음 마감일", value: "07.10", sub: "원천세 등" }
    ]);
    root.appendChild(stat);

    const p = panel("세무 신고 현황", THIS_MONTH + " 귀속");
    const wrap = el("div");
    p.appendChild(wrap);
    function draw() {
      wrap.innerHTML = "";
      const rows = taxes.map((t, i) => {
        const tr = el("tr");
        const act = t.status === "done" ? pill("신고 완료", "done")
          : `<button class="btn-sm btn-sm--p" data-i="${i}">신고하기</button>`;
        tr.innerHTML = `<td class="name">${t.name}</td><td class="num">${won(t.amount)}원</td><td class="center">${t.due}</td><td>${act}</td>`;
        tr.style.cursor = "pointer"; tr.title = "더블클릭: 신고서 내역";
        tr.ondblclick = () => docPopup({ docName: t.name + " 신고서", title: "원천세·세무 신고 관리", kind: "세무 신고서", fields: [["신고 항목", t.name], ["납부 금액", won(t.amount) + "원"], ["마감일", t.due], ["귀속", THIS_MONTH], ["상태", t.status === "done" ? "신고 완료" : "신고 대기"]] });
        return tr;
      });
      wrap.appendChild(tableWrap([{ t: "신고 항목" }, { t: "금액", cls: "num" }, { t: "마감일", cls: "center" }, { t: "처리" }], rows));
      wrap.appendChild(dblHint("신고 항목을 <b>더블클릭</b>하면 신고서 내역이 팝업으로 열립니다."));
      $$("[data-i]", wrap).forEach((b) => b.onclick = () => { taxes[+b.dataset.i].status = "done"; updateDone(); toast(taxes[+b.dataset.i].name + " 신고가 완료되었습니다."); draw(); });
    }
    function updateDone() {
      const d = taxes.filter((t) => t.status === "done").length;
      $$(".app-stat", root)[2].querySelector(".app-stat__value").innerHTML = `${d}<small>/ ${taxes.length}</small>`;
    }
    draw();
    const allBtn = el("button", "btn-sm btn-sm--p", "전체 일괄 신고");
    allBtn.style.marginTop = "14px";
    allBtn.onclick = () => { taxes.forEach((t) => t.status = "done"); updateDone(); toast("모든 세무 신고가 완료되었습니다."); draw(); };
    p.appendChild(allBtn);
    root.appendChild(p);
  }

  /* ============================================================
     4) 퇴직연금 관리 대시보드
     ============================================================ */
  function appPension(root) {
    root.appendChild(badge("퇴직연금(DB·DC) 관리"));
    const db = EMP.filter((e) => e.ptype === "DB"), dc = EMP.filter((e) => e.ptype === "DC");
    root.appendChild(statCards([
      { label: "총 적립금", value: money(sum(EMP, (e) => e.pension)), accent: true },
      { label: "DB형 가입", value: db.length, unit: "명", sub: money(sum(db, (e) => e.pension)) },
      { label: "DC형 가입", value: dc.length, unit: "명", sub: money(sum(dc, (e) => e.pension)) },
      { label: "1인 평균 적립", value: money(avg(EMP, (e) => e.pension)) }
    ]));
    const grid = el("div", "app-row app-row--3-2");
    const left = panel("가입자별 적립 현황", "근속연수 기준 적립");
    const sorted = [...EMP].sort((a, b) => b.pension - a.pension).slice(0, 40);
    left.appendChild(tableWrap(
      [{ t: "성명" }, { t: "소속" }, { t: "유형", cls: "center" }, { t: "입사일", cls: "center" }, { t: "근속", cls: "center" }, { t: "적립금", cls: "num" }],
      sorted.map((e) => { const tr = el("tr"); tr.innerHTML = `<td class="name">${e.name}</td><td>${e.dept}</td><td class="center">${pill(e.ptype, e.ptype === "DB" ? "info" : "gray")}</td><td class="center">${e.join}</td><td class="center">${e.years}년</td><td class="num">${won(e.pension)}원</td>`; tr.style.cursor = "pointer"; tr.title = "더블클릭: 퇴직연금 적립 내역서"; tr.ondblclick = () => docPopup({ docName: e.name + " 퇴직연금 적립 내역서", title: "퇴직연금(DB·DC) 관리", kind: "적립 내역서", fields: [["성명", e.name], ["소속", e.dept], ["가입 유형", e.ptype + "형"], ["입사일", e.join], ["근속", e.years + "년"], ["적립금", won(e.pension) + "원"]] }); return tr; })
    ));
    left.appendChild(dblHint("가입자 행을 <b>더블클릭</b>하면 퇴직연금 적립 내역서가 팝업으로 열립니다."));
    const right = panel("부서별 적립금");
    const byDept = {};
    DEPT_DIST.forEach(([d]) => byDept[d] = sum(EMP.filter((e) => e.dept === d), (e) => e.pension));
    right.appendChild(deptBars(byDept, (v) => money(v)));
    grid.appendChild(left); grid.appendChild(right);
    root.appendChild(grid);
  }

  /* ============================================================
     5) 직원 교육 관리 시스템
     ============================================================ */
  let courses = [
    { name: "신입 인턴 입문교육 (3개월 과정)", cap: 40, enrolled: 38 },
    { name: "정규직 현장실무교육 (OJT · 1년)", cap: 80, enrolled: 72 },
    { name: "정보보안 교육 (전사 필수)", cap: 500, enrolled: 482 },
    { name: "의료정보(HIS·BESTCare) 도메인", cap: 150, enrolled: 131 },
    { name: "클라우드·AI 활용 실무", cap: 90, enrolled: 76 },
    { name: "리더십 양성 과정", cap: 40, enrolled: 33 },
    { name: "직무 역량 심화 과정", cap: 120, enrolled: 98 },
    { name: "커뮤니케이션·협업 워크숍", cap: 60, enrolled: 44 }
  ];
  function appTraining(root) {
    courses = courses.map((c) => ({ ...c }));
    root.appendChild(badge("인재개발(HRD)"));
    function totals() { return { e: sum(courses, (c) => c.enrolled), cap: sum(courses, (c) => c.cap) }; }
    const t0 = totals();
    void t0;
    root.appendChild(statCards([
      { label: "연간 인턴 채용", value: TALENT.internsYear, unit: "명", sub: "상·하반기 각 20명", accent: true },
      { label: "정규직 전환율", value: TALENT.conversionRate, unit: "%", sub: "3개월 인턴교육 후" },
      { label: "현장교육 이수율", value: TALENT.fieldCompletion, unit: "%", sub: "입사 1년 실무교육" },
      { label: "전사 교육 이수율", value: 92, unit: "%" }
    ]));
    const pipe = panel("인재 육성 단계 — 인턴 채용부터 핵심인재까지");
    const steps = [
      ["인턴 채용", "상·하반기 각 20명", "연 40명"],
      ["인턴 교육", "3개월 집중 양성", "3개월"],
      ["정규직 전환", "평가 후 전환", "전환율 88%"],
      ["현장 실무교육", "입사 1년 OJT", "12개월"],
      ["핵심인재 육성", "역량·리더십 개발", "유지율 96%"]
    ];
    const flow = el("div"); flow.style.cssText = "display:flex;align-items:stretch;gap:8px;flex-wrap:wrap";
    steps.forEach((s, i) => {
      const c = el("div"); c.style.cssText = "flex:1;min-width:120px;background:var(--bg-soft-2);border:1px solid var(--line);border-radius:12px;padding:14px;text-align:center";
      c.innerHTML = `<div style="font-size:.7rem;color:var(--accent-deep);font-weight:700">STEP ${i + 1}</div><div style="font-weight:700;color:var(--ink);margin:5px 0 3px;font-size:.92rem">${s[0]}</div><div style="font-size:.75rem;color:var(--muted)">${s[1]}</div><div style="font-size:.8rem;color:var(--accent-deep);font-weight:700;margin-top:6px">${s[2]}</div>`;
      flow.appendChild(c);
    });
    pipe.appendChild(flow); root.appendChild(pipe);
    const segP = panel("핀셋 교육 대상 — 전 직원 맞춤 역량강화", "신규 입사자뿐 아니라 재직자·퇴직 예정자·위험관리대상자까지");
    const segs = [
      ["🌱 신규 입사자", "인턴·신입 온보딩, 직무 기본 역량", "연 40명"],
      ["📈 재직 근로자", "직무 심화·리더십 등 지속 역량강화", "전 직원"],
      ["🤝 퇴직 예정자", "지식 전수·인생 2막 설계 지원", "18명"],
      ["🎯 위험관리대상자", "저평가자 맞춤 핀셋 교육·역량 회복", "82명"]
    ];
    const sg = el("div"); sg.style.cssText = "display:grid;grid-template-columns:repeat(2,1fr);gap:10px";
    segs.forEach((s) => { const d = el("div"); d.style.cssText = "background:var(--bg-soft-2);border:1px solid var(--line);border-radius:12px;padding:14px 16px"; d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="color:var(--ink);font-size:.95rem">${s[0]}</b><span style="font-size:.74rem;color:var(--accent-deep);font-weight:700">${s[2]}</span></div><div style="font-size:.82rem;color:var(--muted);margin-top:5px">${s[1]}</div>`; sg.appendChild(d); });
    segP.appendChild(sg); root.appendChild(segP);
    const p = panel("교육 과정 — 신청하면 즉시 반영됩니다", THIS_MONTH);
    const wrap = el("div"); p.appendChild(wrap);
    function draw() {
      wrap.innerHTML = "";
      const rows = courses.map((c, i) => {
        const rate = Math.round(c.enrolled / c.cap * 100);
        const full = c.enrolled >= c.cap;
        const tr = el("tr");
        tr.innerHTML =
          `<td class="name">${c.name}</td>
           <td class="center">${c.enrolled} / ${c.cap}</td>
           <td><div style="display:flex;align-items:center;gap:8px"><div class="minibar"><i class="${rate >= 90 ? "ok" : ""}" style="width:${rate}%"></i></div><span style="font-size:.78rem;color:var(--muted)">${rate}%</span></div></td>
           <td>${full ? pill("마감", "gray") : `<button class="btn-sm btn-sm--p" data-i="${i}">신청</button>`}</td>`;
        tr.style.cursor = "pointer"; tr.title = "더블클릭: 교육 신청서/현황";
        tr.ondblclick = () => docPopup({ docName: c.name + " 신청서", title: "인재개발(HRD)", kind: "교육 신청서", fields: [["과정명", c.name], ["신청 현황", c.enrolled + " / " + c.cap + "명"], ["충족률", rate + "%"], ["상태", full ? "정원 마감" : "신청 가능"]] });
        return tr;
      });
      wrap.appendChild(tableWrap([{ t: "과정명" }, { t: "신청/정원", cls: "center" }, { t: "충족률" }, { t: "신청" }], rows));
      wrap.appendChild(dblHint("교육 과정을 <b>더블클릭</b>하면 신청서/현황이 팝업으로 열립니다."));
      $$("[data-i]", wrap).forEach((b) => b.onclick = () => { const c = courses[+b.dataset.i]; if (c.enrolled < c.cap) { c.enrolled++; toast(`'${c.name}' 교육 신청이 완료되었습니다.`); draw(); } });
    }
    draw();
    root.appendChild(p);
  }

  /* ============================================================
     6) 직원 성장 추적 대시보드
     ============================================================ */
  function appGrowth(root) {
    root.appendChild(badge("피플 애널리틱스"));
    root.appendChild(statCards([
      { label: "평균 성장 지수", value: avg(EMP, (e) => e.growth), accent: true },
      { label: "고성장 인원", value: EMP.filter((e) => e.growth >= 88).length, unit: "명", sub: "성장지수 88+" },
      { label: "승진 후보", value: EMP.filter((e) => e.growth >= 90 && e.years >= 3).length, unit: "명", sub: "성장+근속 기준" },
      { label: "분석 대상", value: HEADCOUNT, unit: "명" }
    ]));
    const grid = el("div", "app-row app-row--3-2");
    const left = panel("성장 지수 상위 명단 — 행 클릭 시 역량 상세", "부서 필터");
    const filter = el("select"); filter.className = "app-tab"; filter.style.cssText = "padding:7px 12px;margin-bottom:12px";
    filter.innerHTML = `<option value="">전체 부서</option>` + DEPT_DIST.map(([d]) => `<option>${d}</option>`).join("");
    left.appendChild(filter);
    const tbl = el("div"); left.appendChild(tbl);
    function drawTable() {
      tbl.innerHTML = "";
      let list = EMP.filter((e) => !filter.value || e.dept === filter.value).sort((a, b) => b.growth - a.growth).slice(0, 30);
      tbl.appendChild(tableWrap(
        [{ t: "성명" }, { t: "소속/직급" }, { t: "근속", cls: "center" }, { t: "성장지수" }],
        list.map((e) => { const tr = el("tr"); tr.style.cursor = "pointer"; tr.innerHTML = `<td class="name">${e.name}</td><td>${e.dept} · ${e.pos}</td><td class="center">${e.years}년</td><td><div style="display:flex;align-items:center;gap:8px"><div class="minibar"><i class="${e.growth >= 88 ? "ok" : ""}" style="width:${e.growth}%"></i></div><b style="font-size:.82rem;color:var(--ink)">${e.growth}</b></div></td>`; tr.onclick = () => showSkill(e); tr.title = "더블클릭: 역량 분석 리포트"; tr.ondblclick = () => docPopup({ docName: e.name + " 역량 분석 리포트", title: "피플 애널리틱스", kind: "역량 리포트", fields: [["성명", e.name], ["소속/직급", e.dept + " · " + e.pos], ["근속", e.years + "년"], ["성장지수", String(e.growth)]].concat(Object.entries(e.skills).map(([k, v]) => ["역량 · " + k, String(v)])) }); return tr; })
      ));
      tbl.appendChild(dblHint("명단 행을 <b>더블클릭</b>하면 역량 분석 리포트가 팝업으로 열립니다."));
    }
    filter.onchange = drawTable; drawTable();
    const right = panel("역량 상세");
    const detail = el("div"); detail.innerHTML = `<p class="app-note">명단에서 직원을 선택하세요.</p>`;
    right.appendChild(detail);
    function showSkill(e) {
      detail.innerHTML = `<div style="font-weight:800;color:var(--ink);font-size:1.05rem">${e.name}</div><div style="font-size:.8rem;color:var(--muted);margin-bottom:16px">${e.dept} · ${e.pos} · 성장지수 ${e.growth}</div>`;
      const bars = el("div", "deptbars");
      Object.entries(e.skills).forEach(([k, v]) => { const r = el("div"); r.innerHTML = `<div class="deptbar__top"><span>${k}</span><b>${v}</b></div><div class="minibar"><i class="${v >= 85 ? "ok" : v < 65 ? "warn" : ""}" style="width:${v}%"></i></div>`; bars.appendChild(r); });
      detail.appendChild(bars);
    }
    grid.appendChild(left); grid.appendChild(right);
    root.appendChild(grid);
  }

  /* ============================================================
     7) 결재 프로세스 관리 시스템
     ============================================================ */
  const apprSeed = [
    { type: "휴가", who: "이서윤 (클라우드사업부)", detail: "연차 2일 (06.30~07.01)", amt: 0 },
    { type: "지출결의", who: "박지호 (영업·마케팅)", detail: "고객사 미팅 식대", amt: 184000 },
    { type: "구매요청", who: "최수아 (HIS개발본부)", detail: "개발 모니터 3대", amt: 1290000 },
    { type: "출장", who: "정예준 (영업·마케팅)", detail: "부산 출장 (1박2일)", amt: 320000 },
    { type: "교육비", who: "강하은 (데이터·AI)", detail: "데이터 분석 자격 교육", amt: 450000 },
    { type: "지출결의", who: "윤지훈 (운영·SM본부)", detail: "서버 부품 긴급 구매", amt: 760000 }
  ];
  function appApproval(root) {
    let appr = apprSeed.map((x) => ({ ...x, status: "wait" }));
    root.appendChild(badge("전자결재 · 결재함"));
    const stat = statCards([
      { label: "결재 대기", value: appr.length, unit: "건", accent: true },
      { label: "승인 완료", value: 0, unit: "건" },
      { label: "반려", value: 0, unit: "건" },
      { label: "대기 금액 합계", value: money(sum(appr, (a) => a.amt)) }
    ]);
    root.appendChild(stat);
    const p = panel("결재 대기 문서", "본인 결재선 도착 문서");
    const wrap = el("div"); p.appendChild(wrap);
    function counts() {
      $$(".app-stat", root)[0].querySelector(".app-stat__value").innerHTML = `${appr.filter((a) => a.status === "wait").length}<small>건</small>`;
      $$(".app-stat", root)[1].querySelector(".app-stat__value").innerHTML = `${appr.filter((a) => a.status === "done").length}<small>건</small>`;
      $$(".app-stat", root)[2].querySelector(".app-stat__value").innerHTML = `${appr.filter((a) => a.status === "rej").length}<small>건</small>`;
    }
    function draw() {
      wrap.innerHTML = "";
      const rows = appr.map((a, i) => {
        const act = a.status === "wait"
          ? `<div class="btn-row"><button class="btn-sm btn-sm--ok" data-ok="${i}">승인</button><button class="btn-sm btn-sm--no" data-no="${i}">반려</button></div>`
          : a.status === "done" ? pill("승인", "done") : pill("반려", "rej");
        const tr = el("tr");
        tr.innerHTML = `<td>${pill(a.type, "info")}</td><td class="name">${a.who}</td><td>${a.detail}</td><td class="num">${a.amt ? won(a.amt) + "원" : "-"}</td><td>${act}</td>`;
        tr.style.cursor = "pointer"; tr.title = "더블클릭: 해당 품의서 열기";
        tr.ondblclick = () => {
          const st = a.status;
          const applicant = (a.who || "").split(" (")[0];
          // 금액이 있으면 위임전결 규정으로 결재선 자동 라우팅, 없으면 기본 3단계
          const base = a.amt ? delegationLine(applicant, a.amt).line : [{ role: "기안", name: applicant }, { role: "팀장", name: "김도현" }, { role: "본부장", name: "이서준" }];
          const line = base.map((node, i) => ({ ...node, state: i === 0 ? "done" : st === "done" ? "done" : st === "rej" ? (i === 1 ? "rej" : "wait") : (i === 1 ? "current" : "wait") }));
          const debitBy = { 지출결의: "해당 비용", 구매요청: "비품·소모품(자산)", 출장: "여비교통비", 교육비: "교육훈련비" };
          const journal = a.amt ? { debit: debitBy[a.type] || "비용", credit: "미지급금" } : null;
          docPopup({
            docName: a.type + " 품의서", title: "전자결재 워크플로우", kind: "결재 문서", line, amount: a.amt || 0, journal,
            fields: [["문서 종류", a.type], ["기안자", a.who], ["내용", a.detail], ["금액", a.amt ? won(a.amt) + "원" : "-"], ["결재 상태", statusLabel(st)]]
          });
        };
        return tr;
      });
      wrap.appendChild(tableWrap([{ t: "종류" }, { t: "기안자" }, { t: "내용" }, { t: "금액", cls: "num" }, { t: "결재" }], rows));
      wrap.appendChild(dblHint("결재 대기 문서를 <b>더블클릭</b>하면 해당 품의서(결재선·내용)가 팝업으로 열립니다."));
      $$("[data-ok]", wrap).forEach((b) => b.onclick = () => { appr[+b.dataset.ok].status = "done"; toast("결재를 승인했습니다."); counts(); draw(); });
      $$("[data-no]", wrap).forEach((b) => b.onclick = () => { appr[+b.dataset.no].status = "rej"; toast("결재를 반려했습니다."); counts(); draw(); });
    }
    draw();
    const allBtn = el("button", "btn-sm btn-sm--ok", "대기 문서 일괄 승인");
    allBtn.style.marginTop = "14px";
    allBtn.onclick = () => { appr.forEach((a) => { if (a.status === "wait") a.status = "done"; }); toast("대기 중인 모든 결재를 승인했습니다."); counts(); draw(); };
    p.appendChild(allBtn);
    root.appendChild(p);
  }

  /* ============================================================
     8) 예산 승인 시스템
     ============================================================ */
  function appBudget(root) {
    root.appendChild(badge("부서 예산 관리 · 2026년"));
    const budgets = [
      { dept: "HIS개발본부", total: 480000000, used: 352000000 },
      { dept: "운영·SM본부", total: 360000000, used: 298000000 },
      { dept: "데이터·AI", total: 220000000, used: 141000000 },
      { dept: "영업·마케팅", total: 300000000, used: 264000000 },
      { dept: "전략기획실", total: 160000000, used: 92000000 },
      { dept: "경영지원본부", total: 180000000, used: 110000000 }
    ];
    const tot = sum(budgets, (b) => b.total), used = sum(budgets, (b) => b.used);
    root.appendChild(statCards([
      { label: "총 배정 예산", value: money(tot), accent: true },
      { label: "집행액", value: money(used) },
      { label: "잔여 예산", value: money(tot - used) },
      { label: "집행률", value: Math.round(used / tot * 100), unit: "%" }
    ]));
    const grid = el("div", "app-row app-row--2");
    const left = panel("부서별 예산 집행 현황");
    left.appendChild(tableWrap(
      [{ t: "부서" }, { t: "배정", cls: "num" }, { t: "집행", cls: "num" }, { t: "집행률" }],
      budgets.map((b) => { const r = Math.round(b.used / b.total * 100); const tr = el("tr"); tr.innerHTML = `<td class="name">${b.dept}</td><td class="num">${money(b.total)}</td><td class="num">${money(b.used)}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="minibar"><i class="${r >= 90 ? "warn" : ""}" style="width:${r}%"></i></div><span style="font-size:.78rem;color:var(--muted)">${r}%</span></div></td>`; return tr; })
    ));
    const right = panel("예산 추가 신청 결재");
    const reqs = [
      { dept: "HIS개발본부", item: "AI API 사용량 증설", amt: 12000000, status: "wait" },
      { dept: "영업·마케팅", item: "하반기 전시회 참가비", amt: 8500000, status: "wait" },
      { dept: "운영·SM본부", item: "보안 솔루션 라이선스", amt: 15000000, status: "wait" }
    ];
    const wrap = el("div"); right.appendChild(wrap);
    function draw() {
      wrap.innerHTML = "";
      const rows = reqs.map((q, i) => {
        const act = q.status === "wait" ? `<div class="btn-row"><button class="btn-sm btn-sm--ok" data-ok="${i}">승인</button><button class="btn-sm btn-sm--no" data-no="${i}">반려</button></div>` : q.status === "done" ? pill("승인", "done") : pill("반려", "rej");
        const tr = el("tr"); tr.innerHTML = `<td class="name">${q.dept}</td><td>${q.item}</td><td class="num">${won(q.amt)}원</td><td>${act}</td>`;
        tr.style.cursor = "pointer"; tr.title = "더블클릭: 신청내역 보기";
        tr.ondblclick = () => docPopup({ docName: "예산 추가 신청 품의서", title: "예산 편성·집행 관리", fields: [["부서", q.dept], ["신청 항목", q.item], ["신청 금액", won(q.amt) + "원"], ["결재 상태", statusLabel(q.status)]] });
        return tr;
      });
      wrap.appendChild(tableWrap([{ t: "부서" }, { t: "항목" }, { t: "금액", cls: "num" }, { t: "결재" }], rows));
      wrap.appendChild(dblHint());
      $$("[data-ok]", wrap).forEach((b) => b.onclick = () => { reqs[+b.dataset.ok].status = "done"; toast("예산 추가 신청을 승인했습니다."); draw(); });
      $$("[data-no]", wrap).forEach((b) => b.onclick = () => { reqs[+b.dataset.no].status = "rej"; toast("예산 신청을 반려했습니다."); draw(); });
    }
    draw();
    grid.appendChild(left); grid.appendChild(right);
    root.appendChild(grid);
  }

  /* ============================================================
     9) 비용 관리 시스템
     ============================================================ */
  function appExpense(root) {
    root.appendChild(badge("경비 처리·지출 · " + THIS_MONTH));
    let expenses = [
      { who: "김서연", dept: "영업·마케팅", cat: "접대비", item: "고객사 미팅 식대", amt: 184000 },
      { who: "정하준", dept: "HIS개발본부", cat: "비품", item: "키보드/마우스", amt: 96000 },
      { who: "이미연", dept: "경영지원본부", cat: "사무용품", item: "복합기 토너", amt: 138000 },
      { who: "정파트장", dept: "운영·SM본부", cat: "장비", item: "네트워크 케이블", amt: 220000 },
      { who: "박도윤", dept: "데이터·AI", cat: "교육", item: "온라인 강의 구독", amt: 330000 },
      { who: "최예준", dept: "클라우드사업부", cat: "소프트웨어", item: "디자인 툴 라이선스", amt: 264000 }
    ];
    const cats = ["접대비", "비품", "사무용품", "장비", "교육", "소프트웨어", "교통비"];
    const stat = statCards([
      { label: "이번 달 비용", value: money(sum(expenses, (e) => e.amt)), accent: true },
      { label: "처리 건수", value: expenses.length, unit: "건" },
      { label: "최다 항목", value: "접대비", sub: "분류 기준" },
      { label: "전월 대비", value: "-6%", sub: "절감" }
    ]);
    root.appendChild(stat);
    const grid = el("div", "app-row app-row--3-2");
    const left = panel("비용 내역 — 등록 시 즉시 합산됩니다");
    const form = el("form", "app-form");
    form.innerHTML =
      `<div class="app-field"><label>사용 근로자 <span style="color:var(--muted);font-weight:500">· 대리상신 가능</span></label><select name="emp">${empOpts()}</select></div>
       <div class="app-field"><label>부서(비용센터)</label><select name="dept">${DEPT_DIST.map(([d]) => `<option>${d}</option>`).join("")}</select></div>
       <div class="app-field"><label>분류</label><select name="cat">${cats.map((c) => `<option>${c}</option>`).join("")}</select></div>
       <div class="app-field"><label>내용</label><input name="item" placeholder="예: 회식비" required></div>
       <div class="app-field"><label>금액(원)</label><input name="amt" type="number" min="1000" step="1000" value="50000"></div>
       <button class="btn-sm btn-sm--p" type="submit">비용 등록</button>`;
    form.insertBefore(attachField((amt) => { form.amt.value = amt; }), form.firstChild);
    left.appendChild(form);
    const proxyNote = el("div"); proxyNote.style.cssText = "font-size:.76rem;color:var(--muted);margin-top:9px";
    proxyNote.innerHTML = "📌 병가·출장 등으로 본인 신청이 어려운 경우, <b>사용 근로자</b>를 선택해 대리상신할 수 있습니다.";
    left.appendChild(proxyNote);
    const tbl = el("div"); tbl.style.marginTop = "16px"; left.appendChild(tbl);
    const right = panel("분류별 지출");
    const catBox = el("div"); right.appendChild(catBox);
    function drawCat() {
      const m = {}; cats.forEach((c) => m[c] = 0); expenses.forEach((e) => m[e.cat] = (m[e.cat] || 0) + e.amt);
      Object.keys(m).forEach((k) => { if (!m[k]) delete m[k]; });
      catBox.innerHTML = ""; catBox.appendChild(deptBars(m, (v) => money(v)));
    }
    function drawTbl() {
      tbl.innerHTML = "";
      tbl.appendChild(tableWrap([{ t: "근로자" }, { t: "부서" }, { t: "분류" }, { t: "내용" }, { t: "금액", cls: "num" }],
        expenses.map((e) => {
          const tr = el("tr"); tr.innerHTML = `<td class="name">${e.who || "—"}</td><td>${e.dept}</td><td>${pill(e.cat, "info")}</td><td>${e.item}</td><td class="num">${won(e.amt)}원</td>`;
          tr.style.cursor = "pointer"; tr.title = "더블클릭: 신청내역 보기";
          tr.ondblclick = () => docPopup({ docName: "지출 품의서", title: "경비 처리·지출 관리", fields: [["사용 근로자", e.who || "—"], ["부서(비용센터)", e.dept], ["분류", e.cat], ["내용", e.item], ["지출 금액", won(e.amt) + "원"]] });
          return tr;
        })));
      tbl.appendChild(dblHint());
    }
    form.onsubmit = (ev) => {
      ev.preventDefault(); const f = ev.target;
      const emp = f.emp.value, empName = emp.split(" (")[0];
      approvalPopup({
        docName: "지출 품의서", title: "경비 처리·지출 관리",
        fields: [["사용 근로자", emp], ["부서(비용센터)", f.dept.value], ["분류", f.cat.value], ["내용", f.item.value], ["지출 금액", won(+f.amt.value) + "원"]],
        line: [{ role: "기안", name: empName }, { role: "팀장", name: "김도현" }, { role: "본부장", name: "이서준" }, { role: "경영지원본부장", name: "정한울" }],
        amount: +f.amt.value, autoDelegate: true, journal: { debit: f.cat.value + " (비용)", credit: "미지급금" },
        onDone: () => {
          expenses.unshift({ who: empName, dept: f.dept.value, cat: f.cat.value, item: f.item.value, amt: +f.amt.value });
          $$(".app-stat", root)[0].querySelector(".app-stat__value").textContent = money(sum(expenses, (e) => e.amt));
          $$(".app-stat", root)[1].querySelector(".app-stat__value").innerHTML = `${expenses.length}<small>건</small>`;
          toast("지출 품의가 다단계 결재 완료되어 비용에 반영되었습니다."); f.item.value = ""; drawTbl(); drawCat();
        }
      });
    };
    drawTbl(); drawCat();
    grid.appendChild(left); grid.appendChild(right);
    root.appendChild(grid);
  }

  /* ============================================================
     10) 경영 보고 자동화 시스템
     ============================================================ */
  function appReport(root) {
    root.appendChild(badge("경영 리포트 자동화"));
    const intro = el("div", "app-panel");
    intro.innerHTML = `<div class="app-panel__title"><span>월간 경영 보고서 자동 생성</span><small>${THIS_MONTH}</small></div>
      <p style="color:var(--text);font-size:.92rem;margin-bottom:16px">인사·급여·교육·비용·성장 데이터를 한 번에 모아 경영진용 요약 보고서를 자동으로 만듭니다.</p>`;
    const genBtn = el("button", "btn-sm btn-sm--p", "보고서 생성하기");
    intro.appendChild(genBtn);
    const dlBtn = el("button", "btn-sm btn-sm--ghost", "PDF로 내려받기");
    dlBtn.style.marginLeft = "8px"; dlBtn.style.display = "none";
    intro.appendChild(dlBtn);
    root.appendChild(intro);
    const out = el("div"); out.style.marginTop = "16px"; root.appendChild(out);

    const base = sum(EMP, (e) => e.salary);
    const data = {
      인건비: money(base),
      평균근속: (sum(EMP, (e) => e.years) / HEADCOUNT).toFixed(1) + "년",
      연차사용률: Math.round(sum(EMP, (e) => e.leaveUsed) / sum(EMP, (e) => e.leaveTotal) * 100) + "%",
      교육이수율: "92%",
      평균성장지수: avg(EMP, (e) => e.growth),
      퇴직연금적립: money(sum(EMP, (e) => e.pension)),
      예산집행률: "78%",
      비용전월대비: "-6%"
    };
    genBtn.onclick = () => {
      genBtn.textContent = "✓ 생성 완료"; genBtn.disabled = true; dlBtn.style.display = "inline-block";
      out.innerHTML = "";
      const hdr = el("div"); hdr.style.cssText = "padding:4px 2px 16px;border-bottom:2px solid var(--ink);margin-bottom:18px";
      hdr.innerHTML = `<div style="font-family:var(--serif);font-size:1.3rem;font-weight:700;color:var(--ink)">${COMPANY} · ${THIS_MONTH} 월간 경영 보고서</div><div style="font-size:.8rem;color:var(--muted);margin-top:5px">생성일 ${new Date().toISOString().slice(0, 10)} · 임직원 ${HEADCOUNT}명 · 예시 데이터</div>`;
      out.appendChild(hdr);
      out.appendChild(statCards([
        { label: "총 인건비", value: data.인건비, accent: true },
        { label: "평균 근속", value: data.평균근속 },
        { label: "평균 성장지수", value: data.평균성장지수 },
        { label: "퇴직연금 적립", value: data.퇴직연금적립 }
      ]));
      const sections = [
        ["인사", [["임직원 수", HEADCOUNT + "명"], ["평균 근속", data.평균근속], ["연차 사용률", data.연차사용률]]],
        ["급여", [["총 인건비", data.인건비], ["1인 평균", money(avg(EMP, (e) => e.salary)) + " /월"]]],
        ["교육·성장", [["교육 이수율", data.교육이수율], ["평균 성장지수", data.평균성장지수], ["승진 후보", EMP.filter((e) => e.growth >= 90 && e.years >= 3).length + "명"]]],
        ["재무", [["예산 집행률", data.예산집행률], ["비용 전월 대비", data.비용전월대비], ["퇴직연금 적립금", data.퇴직연금적립]]]
      ];
      const grid = el("div", "app-row app-row--2");
      sections.forEach(([t, rows]) => {
        const p = panel(t);
        const dl = el("div", "detail-list");
        rows.forEach(([k, v]) => dl.appendChild(el("div", null, `<span>${k}</span><b>${v}</b>`)));
        p.appendChild(dl); grid.appendChild(p);
      });
      out.appendChild(grid);
      toast("경영 보고서가 생성되었습니다.");
    };
    dlBtn.onclick = () => {
      const jspdfLib = window.jspdf;
      if (!window.html2canvas || !jspdfLib) { toast("PDF 모듈을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요."); return; }
      const label = dlBtn.textContent; dlBtn.textContent = "PDF 생성 중…"; dlBtn.disabled = true;
      const note = el("div"); note.style.cssText = "margin-top:14px;font-size:.78rem;color:var(--muted)";
      note.textContent = "※ 본 수치는 시스템 시연을 위한 예시 데이터입니다.";
      out.appendChild(note);
      window.html2canvas(out, { scale: 2, backgroundColor: "#ffffff", useCORS: true }).then((canvas) => {
        const img = canvas.toDataURL("image/jpeg", 0.96);
        const pdf = new jspdfLib.jsPDF("p", "mm", "a4");
        const pw = 210, ph = 297;
        const ih = canvas.height * pw / canvas.width;
        let heightLeft = ih, position = 0;
        pdf.addImage(img, "JPEG", 0, position, pw, ih); heightLeft -= ph;
        while (heightLeft > 0) { position -= ph; pdf.addPage(); pdf.addImage(img, "JPEG", 0, position, pw, ih); heightLeft -= ph; }
        pdf.save(`${COMPANY}_경영보고서_2026-06.pdf`);
        note.remove(); dlBtn.textContent = label; dlBtn.disabled = false;
        toast("PDF 보고서를 내려받았습니다.");
      }).catch(() => { note.remove(); dlBtn.textContent = label; dlBtn.disabled = false; toast("PDF 생성 중 오류가 발생했습니다."); });
    };
  }

  /* ============================================================
     11) KPI 관리 대시보드
     ============================================================ */
  function appKpi(root) {
    root.appendChild(badge("KPI 경영 대시보드 · " + THIS_MONTH));
    const persp = [
      { key: "재무", name: "재무", icon: "💰", weight: 30 },
      { key: "고객", name: "고객", icon: "🤝", weight: 25 },
      { key: "내부", name: "내부 프로세스", icon: "⚙️", weight: 20 },
      { key: "성장", name: "학습·성장(인재)", icon: "🌱", weight: 25 }
    ];
    const pn = { 재무: "재무", 고객: "고객", 내부: "내부 프로세스", 성장: "학습·성장(인재)" };
    const kpis = [
      { bsc: "재무", name: "연간 매출", target: "760억원", actual: "712억원", rate: 94 },
      { bsc: "재무", name: "영업이익률", target: "9.0%", actual: "8.4%", rate: 93 },
      { bsc: "재무", name: "인당 매출(생산성)", target: "1.50억", actual: "1.42억", rate: 95 },
      { bsc: "재무", name: "프로젝트 수익률", target: "25%", actual: "27%", rate: 108 },
      { bsc: "고객", name: "고객 유지율", target: "95%", actual: "97%", rate: 102 },
      { bsc: "고객", name: "HIS 유지보수 갱신율", target: "95%", actual: "97%", rate: 102 },
      { bsc: "고객", name: "고객 만족도(NPS)", target: "45", actual: "42", rate: 93 },
      { bsc: "고객", name: "신규 수주", target: "24건", actual: "21건", rate: 88 },
      { bsc: "내부", name: "프로젝트 납기 준수율", target: "95%", actual: "91%", rate: 96 },
      { bsc: "내부", name: "인력 가동률(Utilization)", target: "85%", actual: "88%", rate: 104 },
      { bsc: "내부", name: "시스템 안정성(SLA)", target: "99.5%", actual: "99.4%", rate: 100 },
      { bsc: "내부", name: "클라우드 전환 고객", target: "20개", actual: "18개", rate: 90 },
      { bsc: "성장", name: "연간 퇴직률(≤10%)", target: "≤10%", actual: "7.4%", rate: 126 },
      { bsc: "성장", name: "핵심인재 유지율", target: "95%", actual: "96%", rate: 101 },
      { bsc: "성장", name: "직원 몰입도(eNPS)", target: "30", actual: "34", rate: 113 },
      { bsc: "성장", name: "교육 이수율", target: "90%", actual: "94%", rate: 104 },
      { bsc: "성장", name: "인턴 정규직 전환율", target: "85%", actual: "88%", rate: 104 }
    ];
    const pAvg = (key) => { const l = kpis.filter((x) => x.bsc === key); return Math.round(l.reduce((a, b) => a + b.rate, 0) / l.length); };
    const overall = Math.round(persp.reduce((a, p) => a + pAvg(p.key) * p.weight, 0) / 100);
    root.appendChild(statCards([
      { label: "관리 KPI", value: kpis.length, unit: "개", sub: "4대 관점(BSC)" },
      { label: "종합 달성률", value: overall + "%", accent: true, sub: "관점 가중 합산" },
      { label: "목표 달성", value: kpis.filter((k) => k.rate >= 100).length, unit: "개", sub: "100% 이상" },
      { label: "주의 · 미달", value: kpis.filter((k) => k.rate < 100).length, unit: "개", sub: "보완 필요" }
    ]));

    const pp = panel("균형성과표(BSC) — 4대 관점별 달성률", "전사 전략을 재무·고객·프로세스·인재 관점으로 균형 있게 관리");
    const pgrid = el("div"); pgrid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px";
    persp.forEach((p) => {
      const sc = pAvg(p.key), tone = sc >= 100 ? "ok" : sc >= 90 ? "" : "warn";
      const card = el("div"); card.style.cssText = "background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px";
      card.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:1.3rem">${p.icon}</span><span style="font-size:.7rem;color:var(--muted);font-weight:600">가중 ${p.weight}%</span></div><div style="font-size:.84rem;color:var(--ink);font-weight:600;margin:9px 0 4px">${p.name}</div><div style="font-size:1.5rem;font-weight:800;color:var(--ink)">${sc}<small style="font-size:.9rem;color:var(--silver-3)">%</small></div><div class="minibar" style="margin-top:8px"><i class="${tone}" style="width:${(Math.min(sc, 120) / 120 * 100).toFixed(0)}%"></i></div>`;
      pgrid.appendChild(card);
    });
    pp.appendChild(pgrid); root.appendChild(pp);

    const trendP = panel("월별 종합 달성률 추이", "최근 6개월");
    const tvals = [94, 96, 98, 99, 101, overall], tlabs = ["1월", "2월", "3월", "4월", "5월", "6월"];
    const tmax = Math.max(...tvals);
    const spark = el("div"); spark.style.cssText = "display:flex;align-items:flex-end;gap:14px;height:130px";
    tvals.forEach((v, i) => {
      const col = el("div"); col.style.cssText = "flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;justify-content:flex-end;height:100%";
      col.innerHTML = `<b style="font-size:.8rem;color:var(--ink)">${v}%</b><div style="width:100%;max-width:46px;height:${(v / tmax * 88).toFixed(0)}px;background:var(--grad-blue);border-radius:7px 7px 0 0"></div><span style="font-size:.76rem;color:var(--muted)">${tlabs[i]}</span>`;
      spark.appendChild(col);
    });
    trendP.appendChild(spark);
    root.appendChild(trendP);

    const p = panel("KPI 상세 — 관점별로 필터할 수 있습니다");
    const filter = el("select", "app-tab"); filter.style.cssText = "padding:7px 12px;margin-bottom:14px";
    filter.innerHTML = `<option value="">전체 관점</option>` + persp.map((x) => `<option value="${x.key}">${pn[x.key]}</option>`).join("");
    p.appendChild(filter);
    const tbl = el("div"); p.appendChild(tbl);
    function draw() {
      tbl.innerHTML = "";
      const list = kpis.filter((k) => !filter.value || k.bsc === filter.value);
      tbl.appendChild(tableWrap(
        [{ t: "관점" }, { t: "KPI" }, { t: "목표", cls: "num" }, { t: "실적", cls: "num" }, { t: "달성률" }, { t: "상태" }],
        list.map((k) => {
          const st = k.rate >= 100 ? ["달성", "done", "ok"] : k.rate >= 90 ? ["주의", "wait", ""] : ["미달", "rej", "warn"];
          const tr = el("tr");
          tr.innerHTML = `<td>${pill(pn[k.bsc], "info")}</td><td class="name">${k.name}</td><td class="num">${k.target}</td><td class="num">${k.actual}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="minibar"><i class="${st[2]}" style="width:${(Math.min(k.rate, 120) / 120 * 100).toFixed(0)}%"></i></div><b style="font-size:.8rem;color:var(--ink)">${k.rate}%</b></div></td><td>${pill(st[0], st[1])}</td>`;
          return tr;
        })
      ));
    }
    filter.onchange = draw; draw();
    root.appendChild(p);
  }

  /* ============================================================
     12) 업무 자동화 시스템
     ============================================================ */
  function appAutomation(root) {
    root.appendChild(badge("업무 자동화(RPA)"));
    const autos = [
      { name: "급여 자동 계산", trig: "매월 25일", saved: 8, last: "06.25", on: true },
      { name: "세무 신고 자료 생성", trig: "매월 1일", saved: 6, last: "06.01", on: true },
      { name: "휴가 잔여 자동 정산", trig: "매일 자정", saved: 9, last: "오늘 00:00", on: true },
      { name: "월 마감 리포트 생성", trig: "매월 말일", saved: 5, last: "05.31", on: true },
      { name: "경비 자동 분류", trig: "실시간", saved: 12, last: "방금 전", on: true },
      { name: "4대보험 신고 알림", trig: "매월 10일", saved: 1, last: "06.10", on: false }
    ];
    let processed = 1284;
    root.appendChild(statCards([
      { label: "활성 자동화", value: autos.filter((a) => a.on).length, unit: "개", accent: true },
      { label: "이번 달 절감 시간", value: autos.filter((a) => a.on).reduce((s, a) => s + a.saved, 0), unit: "시간" },
      { label: "자동 처리 건수", value: processed.toLocaleString("ko-KR"), unit: "건" },
      { label: "오류", value: 0, unit: "건", sub: "안정 운영 중" }
    ]));
    function updateStats() {
      const s = $$(".app-stat", root);
      s[0].querySelector(".app-stat__value").innerHTML = `${autos.filter((a) => a.on).length}<small>개</small>`;
      s[1].querySelector(".app-stat__value").innerHTML = `${autos.filter((a) => a.on).reduce((x, a) => x + a.saved, 0)}<small>시간</small>`;
      s[2].querySelector(".app-stat__value").innerHTML = `${processed.toLocaleString("ko-KR")}<small>건</small>`;
    }
    const p = panel("자동화 작업 — 지금 실행하거나, 켜고 끌 수 있습니다");
    const wrap = el("div"); p.appendChild(wrap);
    function draw() {
      wrap.innerHTML = "";
      wrap.appendChild(tableWrap(
        [{ t: "자동화 작업" }, { t: "실행 주기" }, { t: "절감", cls: "center" }, { t: "마지막 실행" }, { t: "상태" }, { t: "실행" }],
        autos.map((a, i) => {
          const tr = el("tr");
          tr.innerHTML = `<td class="name">${a.name}</td><td>${a.trig}</td><td class="center">${a.saved}h/월</td><td>${a.last}</td><td>${a.on ? pill("활성", "done") : pill("일시정지", "gray")}</td><td><div class="btn-row"><button class="btn-sm btn-sm--p" data-run="${i}" ${a.on ? "" : "disabled"}>실행</button><button class="btn-sm btn-sm--ghost" data-tog="${i}">${a.on ? "끄기" : "켜기"}</button></div></td>`;
          return tr;
        })
      ));
      $$("[data-run]", wrap).forEach((b) => b.onclick = () => { const a = autos[+b.dataset.run]; a.last = "방금 전"; processed += rint(3, 18); updateStats(); toast(`'${a.name}' 자동화를 실행했습니다.`); draw(); });
      $$("[data-tog]", wrap).forEach((b) => b.onclick = () => { const a = autos[+b.dataset.tog]; a.on = !a.on; updateStats(); toast(`'${a.name}'를 ${a.on ? "활성화" : "일시정지"}했습니다.`); draw(); });
    }
    draw();
    root.appendChild(p);
  }

  /* ============================================================
     13) 지식 공유 · 멘토링 시스템
     ============================================================ */
  function appKnowledge(root) {
    root.appendChild(badge("지식 공유 · 멘토링"));
    const mentors = [
      { mentor: "박팀장 (HIS개발본부)", mentee: "김책임 (HIS개발본부)", field: "백엔드 개발", done: 6, total: 10 },
      { mentor: "이파트장 (운영·SM본부)", mentee: "정책임 (운영·SM본부)", field: "클라우드 운영", done: 4, total: 8 },
      { mentor: "최본부장 (데이터·AI)", mentee: "강책임 (데이터·AI)", field: "데이터 분석", done: 7, total: 10 },
      { mentor: "윤팀장 (전략기획실)", mentee: "한책임 (전략기획실)", field: "서비스 기획", done: 3, total: 8 },
      { mentor: "임파트장 (경영지원본부)", mentee: "오책임 (경영지원본부)", field: "회계 실무", done: 5, total: 6 }
    ];
    let posts = [
      { title: "신규 입사자를 위한 개발 환경 세팅 가이드", author: "박팀장", likes: 42, tag: "개발" },
      { title: "월 마감 빠르게 끝내는 체크리스트", author: "임파트장", likes: 35, tag: "회계" },
      { title: "장애 대응 회고 — 무엇을 배웠나", author: "이팀장", likes: 51, tag: "인프라" },
      { title: "데이터 시각화 사내 표준 제안", author: "최본부장", likes: 28, tag: "데이터" }
    ];
    root.appendChild(statCards([
      { label: "진행 중 멘토링", value: mentors.length, unit: "쌍", accent: true },
      { label: "멘토링 참여율", value: 84, unit: "%" },
      { label: "이번 분기 지식 공유", value: posts.length * 9, unit: "건" },
      { label: "평균 만족도", value: "4.6", unit: "/5" }
    ]));
    const p1 = panel("멘토링 현황 — 회차를 완료 처리할 수 있습니다");
    const w1 = el("div"); p1.appendChild(w1);
    function draw1() {
      w1.innerHTML = "";
      w1.appendChild(tableWrap(
        [{ t: "멘토" }, { t: "멘티" }, { t: "분야" }, { t: "진행" }, { t: "처리" }],
        mentors.map((m, i) => {
          const rate = Math.round(m.done / m.total * 100), done = m.done >= m.total;
          const tr = el("tr");
          tr.innerHTML = `<td class="name">${m.mentor}</td><td>${m.mentee}</td><td>${m.field}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="minibar"><i class="${done ? "ok" : ""}" style="width:${rate}%"></i></div><span style="font-size:.78rem;color:var(--muted)">${m.done}/${m.total}</span></div></td><td>${done ? pill("수료", "done") : `<button class="btn-sm btn-sm--p" data-i="${i}">회차 완료</button>`}</td>`;
          return tr;
        })
      ));
      $$("[data-i]", w1).forEach((b) => b.onclick = () => { const m = mentors[+b.dataset.i]; if (m.done < m.total) { m.done++; toast(`${m.mentor} · ${m.mentee} 멘토링 회차를 완료했습니다.`); draw1(); } });
    }
    draw1(); root.appendChild(p1);
    const p2 = panel("사내 지식 공유 — '도움돼요'를 눌러보세요");
    const w2 = el("div"); p2.appendChild(w2);
    function draw2() {
      w2.innerHTML = "";
      w2.appendChild(tableWrap(
        [{ t: "제목" }, { t: "작성" }, { t: "분류" }, { t: "도움돼요", cls: "center" }],
        posts.map((po, i) => { const tr = el("tr"); tr.innerHTML = `<td class="name">${po.title}</td><td>${po.author}</td><td>${pill(po.tag, "info")}</td><td class="center"><button class="btn-sm btn-sm--ghost" data-l="${i}">👍 ${po.likes}</button></td>`; return tr; })
      ));
      $$("[data-l]", w2).forEach((b) => b.onclick = () => { posts[+b.dataset.l].likes++; draw2(); });
    }
    draw2(); root.appendChild(p2);
  }

  /* ============================================================
     14) 보안 관리 시스템
     ============================================================ */
  function appSecurity(root) {
    root.appendChild(badge("보안·접근통제"));
    let blocked = 128;
    root.appendChild(statCards([
      { label: "민감정보 보호율", value: "99.8", unit: "%", accent: true },
      { label: "접근 권한 점검", value: 97, unit: "%" },
      { label: "감사 로그 적용", value: 99, unit: "%" },
      { label: "비인가 접근 차단", value: blocked, unit: "건" }
    ]));
    const perms = [
      { name: "김책임 (HIS개발본부)", level: "일반", scope: "개발 데이터", on: true },
      { name: "이팀장 (경영지원본부)", level: "관리자", scope: "급여·인사 정보", on: true },
      { name: "박본부장 (데이터·AI)", level: "관리자", scope: "분석 데이터", on: true },
      { name: "최책임 (영업·마케팅)", level: "일반", scope: "고객 정보(제한)", on: true },
      { name: "협력업체 계정", level: "외부", scope: "임시 접근", on: false }
    ];
    const p1 = panel("직원 권한 관리 — 접근 권한을 켜고 끌 수 있습니다");
    const w1 = el("div"); p1.appendChild(w1);
    function draw1() {
      w1.innerHTML = "";
      w1.appendChild(tableWrap(
        [{ t: "대상" }, { t: "권한등급" }, { t: "접근 범위" }, { t: "상태" }, { t: "제어" }],
        perms.map((pm, i) => { const tr = el("tr"); tr.innerHTML = `<td class="name">${pm.name}</td><td>${pill(pm.level, pm.level === "관리자" ? "info" : pm.level === "외부" ? "wait" : "gray")}</td><td>${pm.scope}</td><td>${pm.on ? pill("허용", "done") : pill("차단", "rej")}</td><td><button class="btn-sm ${pm.on ? "btn-sm--no" : "btn-sm--ok"}" data-i="${i}">${pm.on ? "차단" : "허용"}</button></td>`; return tr; })
      ));
      $$("[data-i]", w1).forEach((b) => b.onclick = () => { const pm = perms[+b.dataset.i]; pm.on = !pm.on; toast(`${pm.name} 접근을 ${pm.on ? "허용" : "차단"}했습니다.`); draw1(); });
    }
    draw1(); root.appendChild(p1);
    /* 정보 유출 위험 모니터링 (DLP) — 대량 다운로드·외부 전송 + 퇴직예정/고위험 인물 */
    const dlp = [
      { who: "김책임", dept: "데이터·AI", act: "고객 데이터 대량 다운로드 1,240건", risk: "높음", retire: true },
      { who: "이팀장", dept: "운영·SM본부", act: "대용량 파일 외부 메일 전송 시도", risk: "높음", retire: false },
      { who: "박책임", dept: "HIS개발본부", act: "심야 시간대 대량 조회·반출", risk: "중간", retire: true },
      { who: "최책임", dept: "영업·마케팅", act: "USB 외부 반출 시도 차단", risk: "중간", retire: false },
      { who: "정책임", dept: "구축본부", act: "권한 외 폴더 반복 접근", risk: "낮음", retire: false }
    ];
    const pd = panel("정보 유출 위험 모니터링 (DLP)", "대량 다운로드·외부 전송 탐지 · 퇴직 예정자/고위험 인물 집중 감시");
    pd.appendChild(tableWrap(
      [{ t: "대상자" }, { t: "부서" }, { t: "탐지 행위" }, { t: "위험도" }, { t: "퇴직예정", cls: "center" }, { t: "처리" }],
      dlp.map((d) => { const rl = d.risk === "높음" ? "rej" : d.risk === "중간" ? "wait" : "gray"; const tr = el("tr"); tr.innerHTML = `<td class="name">${d.who}</td><td>${d.dept}</td><td>${d.act}</td><td>${pill(d.risk, rl)}</td><td class="center">${d.retire ? pill("예정", "wait") : "-"}</td><td>${d.risk === "높음" ? pill("자동 차단", "rej") : pill("검토", "info")}</td>`; return tr; })
    ));
    const dn = el("div"); dn.style.cssText = "margin-top:12px;padding:12px 14px;background:rgba(185,28,28,0.06);border-radius:10px;font-size:.82rem;color:var(--ink-2);line-height:1.6";
    dn.innerHTML = "🔎 <b>퇴직을 앞두거나 외부 유출 위험이 있는 인물</b>의 대량 다운로드·외부 전송을 집중 모니터링하고, 고위험 행위는 자동 차단·즉시 보고합니다.";
    pd.appendChild(dn); root.appendChild(pd);
    const p2 = panel("실시간 보안 이벤트");
    const events = [
      { t: "비인가 IP 접근 차단", lv: "높음", time: "방금 전" },
      { t: "권한 외 데이터 조회 시도 차단", lv: "높음", time: "3분 전" },
      { t: "신규 기기 로그인 (MFA 인증)", lv: "보통", time: "12분 전" },
      { t: "대량 다운로드 감지 → 검토", lv: "보통", time: "28분 전" },
      { t: "정기 보안 점검 완료", lv: "정보", time: "1시간 전" }
    ];
    const w2 = el("div"); p2.appendChild(w2);
    w2.appendChild(tableWrap(
      [{ t: "이벤트" }, { t: "등급" }, { t: "시각" }],
      events.map((ev) => { const tr = el("tr"); const lv = ev.lv === "높음" ? "rej" : ev.lv === "보통" ? "wait" : "gray"; tr.innerHTML = `<td class="name">${ev.t}</td><td>${pill(ev.lv, lv)}</td><td>${ev.time}</td>`; return tr; })
    ));
    const scan = el("button", "btn-sm btn-sm--p", "전체 보안 점검 실행"); scan.style.marginTop = "14px";
    scan.onclick = () => { blocked += rint(1, 5); $$(".app-stat", root)[3].querySelector(".app-stat__value").innerHTML = `${blocked}<small>건</small>`; toast("전체 보안 점검을 실행했습니다. 이상 없음."); };
    p2.appendChild(scan); root.appendChild(p2);
  }

  /* ============================================================
     15) 복리후생 신청 시스템 (이지웰 선택복리 연동)
     ============================================================ */
  function appWelfare(root) {
    root.appendChild(badge("복리후생 · 선택복리(이지웰) 연동"));
    root.appendChild(statCards([
      { label: "1인당 연 복지포인트", value: 150, unit: "만P", accent: true, sub: "이지웰 선택복리" },
      { label: "전사 포인트 사용률", value: 73, unit: "%" },
      { label: "이번 달 복지 신청", value: 142, unit: "건" },
      { label: "경조금 지급(YTD)", value: "8,400", unit: "만원" }
    ]));
    const tabs = el("div", "app-tabs");
    const names = ["선택복리(이지웰)", "의료비 신청", "교통비 신청", "경조금 신청", "주택자금 대출"];
    const content = el("div");
    const renderers = [tabEzwel, tabMedical, tabTransport, tabCongrat, tabHousingLoan];
    function setTab(i) {
      $$(".app-tab", tabs).forEach((t, k) => t.classList.toggle("active", k === i));
      content.innerHTML = ""; renderers[i](content);
    }
    names.forEach((n, i) => { const t = el("button", "app-tab" + (i === 0 ? " active" : ""), n); t.onclick = () => setTab(i); tabs.appendChild(t); });
    root.appendChild(tabs); root.appendChild(content); setTab(0);

    function tabEzwel(c) {
      const me = { give: 1500000, use: 1095000 };
      const pm = panel("내 복지포인트 (이지웰 연동)");
      pm.appendChild(el("div", null, `<div class="detail-list"><div><span>연간 부여 포인트</span><b>${won(me.give)} P</b></div><div><span>사용 포인트</span><b>${won(me.use)} P</b></div><div class="total"><span>잔여 포인트</span><b>${won(me.give - me.use)} P</b></div></div>`));
      c.appendChild(pm);
      const p = panel("임직원별 복지포인트 조회", "부여·사용·잔액");
      p.appendChild(tableWrap([{ t: "성명" }, { t: "소속" }, { t: "부여액", cls: "num" }, { t: "사용액", cls: "num" }, { t: "잔액", cls: "num" }],
        EMP.slice(0, 40).map((e) => {
          const give = 1500000 + (e.years >= 10 ? 500000 : 0);
          const use = Math.round(give * (0.4 + Math.random() * 0.55) / 10000) * 10000;
          const tr = el("tr"); tr.innerHTML = `<td class="name">${e.name}</td><td>${e.dept}</td><td class="num">${won(give)}</td><td class="num">${won(use)}</td><td class="num">${won(give - use)}</td>`; return tr;
        })));
      c.appendChild(p);
    }
    function reqTab(c, title, cats, seed, privacy) {
      const p = panel(title + " — 신청하면 목록에 즉시 반영됩니다");
      const list = seed.slice();
      const form = el("form", "app-form");
      form.innerHTML = `<div class="app-field"><label>사용 근로자 <span style="color:var(--muted);font-weight:500">· 대리상신 가능</span></label><select name="emp">${empOpts()}</select></div><div class="app-field"><label>항목</label><select name="cat">${cats.map((x) => `<option>${x}</option>`).join("")}</select></div><div class="app-field"><label>금액(원)</label><input name="amt" type="number" min="1000" step="1000" value="30000"></div><div class="app-field"><label>비고</label><input name="memo" placeholder="예: 병원명/노선"></div><button class="btn-sm btn-sm--p" type="submit">신청</button>`;
      form.insertBefore(attachField((amt) => { form.amt.value = amt; }), form.firstChild);
      p.appendChild(form);
      const proxyNote = el("div"); proxyNote.style.cssText = "font-size:.76rem;color:var(--muted);margin-top:9px"; proxyNote.innerHTML = "📌 병가 등으로 본인 신청이 어려운 경우, <b>사용 근로자</b>를 선택해 대리상신할 수 있습니다."; p.appendChild(proxyNote);
      if (privacy) { const pn = el("div"); pn.style.cssText = "font-size:.78rem;color:#b45309;background:#fef3c7;border:1px solid #fcd34d;border-radius:9px;padding:9px 12px;margin-top:9px;line-height:1.55"; pn.innerHTML = "🔒 <b>개인정보 보호</b> — 의료 등 민감 정보 노출을 막기 위해 <b>상신 근로자 본인과 복리후생 담당자만</b> 다단계 결재합니다."; p.appendChild(pn); }
      const tbl = el("div"); tbl.style.marginTop = "14px"; p.appendChild(tbl);
      function draw() { tbl.innerHTML = ""; tbl.appendChild(tableWrap([{ t: "신청자" }, { t: "항목" }, { t: "금액", cls: "num" }, { t: "상태" }], list.map((r) => { const tr = el("tr"); tr.innerHTML = `<td class="name">${r.who}</td><td>${pill(r.cat, "info")}</td><td class="num">${won(r.amt)}원</td><td>${r.status === "done" ? pill("승인", "done") : pill("접수", "wait")}</td>`; tr.style.cursor = "pointer"; tr.title = "더블클릭: 신청내역 보기"; tr.ondblclick = () => docPopup({ docName: title + " 품의서", title: "복리후생 신청", fields: [["신청자", r.who], ["항목", r.cat], ["신청 금액", won(r.amt) + "원"], ["상태", r.status === "done" ? "승인 완료" : "접수"]] }); return tr; }))); tbl.appendChild(dblHint()); }
      form.onsubmit = (ev) => {
        ev.preventDefault(); const f = ev.target;
        approvalPopup({
          docName: title + " 품의서", title: "복리후생 신청",
          fields: [["사용 근로자", f.emp.value], ["구분", f.cat.value], ["신청 금액", won(+f.amt.value) + "원"]],
          line: privacy
            ? [{ role: "기안", name: f.emp.value.split(" (")[0] }, { role: "복리후생 담당자", name: "한지민" }]
            : [{ role: "기안", name: f.emp.value.split(" (")[0] }, { role: "팀장", name: "김도현" }, { role: "인사팀장", name: "한지민" }, { role: "경영지원본부장", name: "정한울" }],
          onDone: () => { list.unshift({ who: f.emp.value, cat: f.cat.value, amt: +f.amt.value, status: "done" }); toast(title + " 신청이 다단계 결재 완료되었습니다."); draw(); }
        });
      };
      draw(); c.appendChild(p);
    }
    function tabMedical(c) { reqTab(c, "의료비 신청", ["본인 진료", "가족 진료", "건강검진", "약제비"], [{ who: "김서연 (HIS개발본부)", cat: "건강검진", amt: 180000, status: "done" }, { who: "박도윤 (운영·SM본부)", cat: "본인 진료", amt: 46000, status: "wait" }], true); }
    function tabTransport(c) { reqTab(c, "교통비 신청", ["출퇴근 교통비", "출장 교통비", "유류비"], [{ who: "정하준 (영업·마케팅)", cat: "출장 교통비", amt: 62000, status: "done" }, { who: "최예준 (구축본부)", cat: "출퇴근 교통비", amt: 120000, status: "wait" }]); }
    function tabCongrat(c) {
      const RULES = [["본인 결혼", "500,000원 + 화환", 500000], ["자녀 출산(첫째)", "300,000원", 300000], ["자녀 출산(둘째 이상)", "500,000원", 500000], ["배우자 사망", "1,000,000원 + 화환", 1000000], ["직계존비속 사망", "500,000원 + 화환", 500000], ["자녀 결혼", "300,000원", 300000]];
      const p = panel("경조금 신청 — 규정에 따라 금액이 자동 적용됩니다");
      const list = [{ who: "강하은 (데이터·AI)", reason: "자녀 출산(첫째)", amt: 300000, status: "done" }];
      const form = el("form", "app-form");
      form.innerHTML = `<div class="app-field"><label>사용 근로자 <span style="color:var(--muted);font-weight:500">· 대리상신 가능</span></label><select name="emp">${empOpts()}</select></div><div class="app-field"><label>경조 사유</label><select name="reason">${RULES.map((r, i) => `<option value="${i}">${r[0]} — ${r[1]}</option>`).join("")}</select></div><div class="app-field"><label>발생일</label><input name="date" type="date" value="2026-06-20"></div><button class="btn-sm btn-sm--p" type="submit">경조금 신청</button>`;
      form.insertBefore(attachField(null, "doc"), form.firstChild);
      p.appendChild(form);
      const proxyNote = el("div"); proxyNote.style.cssText = "font-size:.76rem;color:var(--muted);margin-top:9px"; proxyNote.innerHTML = "📌 경조사 당사자가 직접 신청이 어려운 경우, <b>사용 근로자</b>를 선택해 대리상신할 수 있습니다."; p.appendChild(proxyNote);
      const congPriv = el("div"); congPriv.style.cssText = "font-size:.78rem;color:#b45309;background:#fef3c7;border:1px solid #fcd34d;border-radius:9px;padding:9px 12px;margin-top:9px;line-height:1.55"; congPriv.innerHTML = "🔒 <b>개인정보 보호</b> — 경조사 등 민감 정보 노출을 막기 위해 <b>상신 근로자 본인과 복리후생 담당자만</b> 다단계 결재합니다."; p.appendChild(congPriv);
      const tbl = el("div"); tbl.style.marginTop = "14px"; p.appendChild(tbl);
      function draw() { tbl.innerHTML = ""; tbl.appendChild(tableWrap([{ t: "신청자" }, { t: "사유" }, { t: "지급액", cls: "num" }, { t: "상태" }], list.map((r) => { const tr = el("tr"); tr.innerHTML = `<td class="name">${r.who}</td><td>${r.reason}</td><td class="num">${won(r.amt)}원</td><td>${r.status === "done" ? pill("지급완료", "done") : pill("접수", "wait")}</td>`; tr.style.cursor = "pointer"; tr.title = "더블클릭: 신청내역 보기"; tr.ondblclick = () => docPopup({ docName: "경조금 신청 품의서", title: "복리후생 신청", fields: [["신청자", r.who], ["경조 사유", r.reason], ["지급액", won(r.amt) + "원"], ["상태", r.status === "done" ? "지급완료" : "접수"]] }); return tr; }))); tbl.appendChild(dblHint()); }
      form.onsubmit = (ev) => {
        ev.preventDefault(); const r = RULES[+ev.target.reason.value];
        approvalPopup({
          docName: "경조금 신청 품의서", title: "복리후생 신청",
          fields: [["사용 근로자", ev.target.emp.value], ["경조 사유", r[0]], ["지급액", won(r[2]) + "원 (규정 자동 적용)"]],
          line: [{ role: "기안", name: ev.target.emp.value.split(" (")[0] }, { role: "복리후생 담당자", name: "한지민" }],
          onDone: () => { list.unshift({ who: ev.target.emp.value, reason: r[0], amt: r[2], status: "done" }); toast(`경조금 ${r[0]} 다단계 결재 완료 (${won(r[2])}원)`); draw(); }
        });
      };
      draw(); c.appendChild(p);
    }
    function tabHousingLoan(c) {
      const TYPES = ["전세자금 대여", "월세보증금 대여", "주택구입자금 대여"];
      const STEPS = ["대여금 신청", "관리자 승인", "대출계약서 전자결재", "전자지출결의서 자동 생성"];
      let req = null;
      const info = el("div"); info.style.cssText = "font-size:.88rem;color:var(--text);margin-bottom:14px;line-height:1.65";
      info.innerHTML = "<b>근속 1년 이상</b> 재직자 대상 · <b>한도 인당 3,000만원</b> · <b>이자 연 2%</b> · 급여에서 <b>원리금 균등 상환</b>(급여명세서에 상환액·잔액 표시). <b>신청 → 관리자 승인 → 대출계약서 전자결재 → 전자지출결의서 자동 생성</b> 순으로 처리됩니다.";
      c.appendChild(info);
      const fp = panel("주택자금 대여 신청 — 증빙은 휴대폰 사진/JPG로 업로드");
      const form = el("form", "app-form");
      form.innerHTML = `<div class="app-field"><label>사용 근로자 <span style="color:var(--muted);font-weight:500">· 대리상신 가능</span></label><select name="emp">${empOpts()}</select></div><div class="app-field"><label>대출 종류</label><select name="type">${TYPES.map((t) => `<option>${t}</option>`).join("")}</select></div><div class="app-field"><label>신청 금액(원) · 한도 3,000만</label><input name="amt" type="number" min="1000000" max="30000000" step="1000000" value="30000000" style="min-width:150px"></div><div class="app-field"><label>상환 기간</label><select name="term"><option value="24">24개월</option><option value="36">36개월</option><option value="48" selected>48개월</option><option value="60">60개월</option></select></div>`;
      const docs = el("div"); docs.style.cssText = "display:flex;flex-wrap:wrap;gap:14px;width:100%;margin-top:2px";
      ["보증보험증권", "임대차계약서", "본인 실거주 확인 증빙"].forEach((d) => docs.appendChild(attachDoc(d)));
      form.appendChild(docs);
      const submitBtn = el("button", "btn-sm btn-sm--p", "대여금 신청"); submitBtn.type = "submit"; form.appendChild(submitBtn);
      fp.appendChild(form);
      const calc = el("div"); calc.style.cssText = "font-size:.86rem;color:var(--text);margin-top:10px;padding:10px 14px;background:var(--accent-soft);border-radius:10px";
      function updateCalc() {
        const amt = Math.min(30000000, +form.amt.value || 0), months = +form.term.value, r = 0.02 / 12;
        const monthly = amt > 0 ? Math.round(amt * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)) : 0;
        calc.innerHTML = `예상 월 상환액(원리금) <b style="color:var(--accent-deep)">${won(monthly)}원</b> · 총 이자 ${won(monthly * months - amt)}원 · 총 상환 ${won(monthly * months)}원 <span style="color:var(--muted);font-size:.78rem">(연 2% · 원리금균등)</span>`;
      }
      form.addEventListener("input", updateCalc); updateCalc();
      fp.appendChild(calc); c.appendChild(fp);
      const sp = panel("처리 진행 상태", "더블클릭하면 단계별 승인·대출계약서·지출결의서를 팝업으로 봅니다"); const stepBox = el("div"); sp.appendChild(stepBox); c.appendChild(sp);
      sp.style.cursor = "pointer"; sp.title = "더블클릭: 단계별 처리 내역(승인·대출계약서·지출결의서) 팝업";
      sp.ondblclick = () => loanProgressPopup();
      function drawSteps() {
        stepBox.innerHTML = "";
        if (!req) { stepBox.innerHTML = `<p class="app-note">신청서를 작성하고 '대여금 신청'을 누르면 진행 상태가 단계별로 표시됩니다.</p>`; return; }
        const steps = el("div"); steps.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px";
        STEPS.forEach((s, i) => {
          const done = i < req.step, cur = i === req.step;
          const st = el("div"); st.style.cssText = `flex:1;min-width:130px;border:1px solid ${done ? "#16a34a" : cur ? "var(--accent)" : "var(--line)"};border-radius:10px;padding:12px;text-align:center;background:${done ? "rgba(22,163,74,0.08)" : cur ? "var(--accent-soft)" : "#fff"}`;
          st.innerHTML = `<div style="font-size:.7rem;color:var(--muted);font-weight:700">STEP ${i + 1}</div><div style="font-weight:700;color:var(--ink);font-size:.85rem;margin-top:3px">${s}</div><div style="font-size:.74rem;margin-top:4px;color:${done ? "#16a34a" : cur ? "var(--accent-deep)" : "var(--muted)"}">${done ? "완료" : cur ? "진행 중" : "대기"}</div>`;
          steps.appendChild(st);
        });
        stepBox.appendChild(steps);
        const sum = el("div"); sum.style.cssText = "font-size:.88rem;color:var(--text);margin-bottom:12px"; sum.innerHTML = `신청 내역 — <b>${req.type}</b> · ${won(req.amt)}원`; stepBox.appendChild(sum);
        if (req.step === 1) { const b = el("button", "btn-sm btn-sm--ok", "관리자 승인"); b.onclick = () => { req.step = 2; toast("관리자가 대여 신청을 승인했습니다."); drawSteps(); }; stepBox.appendChild(b); }
        else if (req.step === 2) { const b = el("button", "btn-sm btn-sm--p", "대출계약서 전자결재"); b.onclick = () => { req.step = 3; toast("회사–직원 간 대출계약서가 전자결재되었습니다."); drawSteps(); }; stepBox.appendChild(b); }
        else if (req.step === 3) { const b = el("button", "btn-sm btn-sm--p", "전자지출결의서 자동 생성"); b.onclick = () => { req.step = 4; toast("대출계약서 내용으로 전자지출결의서가 자동 생성되었습니다."); drawSteps(); }; stepBox.appendChild(b); }
        else {
          const d = el("div"); d.style.cssText = "background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px;margin-top:6px";
          d.innerHTML = `<div style="font-weight:700;color:var(--ink);margin-bottom:10px">전자지출결의서 (자동 생성) <span style="font-size:.72rem;color:#16a34a;font-weight:700;margin-left:6px">✓ 대출계약서 연동</span></div><div class="detail-list"><div><span>지출 항목</span><b>${req.type}</b></div><div><span>지급 대상</span><b>${req.emp}</b></div><div><span>계약 근거</span><b>주택자금 대출계약서 (전자결재 완료)</b></div><div><span>증빙</span><b>보증보험증권·임대차계약서·실거주 증빙 첨부</b></div><div><span>상환 조건</span><b>${req.term}개월 · 연 2% · 급여 원리금 상환</b></div><div class="total"><span>지출 금액</span><b>${won(req.amt)}원</b></div></div>`;
          stepBox.appendChild(d);
        }
      }
      form.onsubmit = (ev) => { ev.preventDefault(); req = { emp: ev.target.emp.value, type: ev.target.type.value, amt: Math.min(30000000, +ev.target.amt.value), term: +ev.target.term.value, step: 1 }; toast("대여금 신청이 접수되어 관리자 승인 대기로 등록되었습니다."); drawSteps(); };
      drawSteps();
      function attachDoc(label) {
        const w = el("div", "app-field"); w.style.minWidth = "190px";
        w.innerHTML = `<label>📎 ${label} <span style="color:#b91c1c;font-weight:700">· 필수</span> <span style="color:var(--muted);font-weight:500">· 사진/JPG</span></label>`;
        const inp = el("input"); inp.type = "file"; inp.accept = "image/jpeg,image/png,application/pdf"; inp.style.cssText = "font-size:.78rem;max-width:180px";
        const inf = el("div"); inf.style.cssText = "font-size:.74rem;color:#16a34a;font-weight:600;margin-top:4px;min-height:14px";
        const pv = el("img"); pv.style.cssText = "display:none;margin-top:6px;max-width:120px;max-height:88px;border-radius:8px;border:1px solid var(--line);object-fit:cover";
        inp.onchange = () => { if (!inp.files.length) return; const f = inp.files[0]; if (f.type.indexOf("image/") === 0) { pv.src = URL.createObjectURL(f); pv.style.display = "block"; } else { pv.style.display = "none"; } inf.textContent = `✓ '${f.name}' 업로드·확인`; };
        w.appendChild(inp); w.appendChild(inf); w.appendChild(pv); return w;
      }
      /* 처리진행상태 더블클릭 → 단계별 승인·대출계약서·지출결의서 팝업 */
      function loanProgressPopup() {
        if (!req) {
          docPopup({ docName: "주택자금 대여 처리 진행 상태", title: "복리후생 · 주택자금 대출", kind: "처리 진행", extraHtml: `<p style="color:var(--muted);font-size:.9rem;margin:0">아직 신청 내역이 없습니다. 위에서 '대여금 신청'을 누르면 단계별 처리 내역(승인·대출계약서·지출결의서)이 표시됩니다.</p>` });
          return;
        }
        const rate = 0.02 / 12, n = req.term;
        const monthly = Math.round(req.amt * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1));
        const blocks = STEPS.map((s, i) => {
          const done = i < req.step, cur = i === req.step;
          const tag = done ? "✓ 완료" : cur ? "진행 중" : "대기";
          const col = done ? "#16a34a" : cur ? "var(--accent-deep)" : "var(--muted)";
          let detail = "";
          if (i === 0) {
            detail = `<div class="detail-list"><div><span>대출 종류</span><b>${req.type}</b></div><div><span>신청자</span><b>${req.emp}</b></div><div><span>신청 금액</span><b>${won(req.amt)}원</b></div><div><span>상환 조건</span><b>${req.term}개월 · 연 2% · 원리금 균등</b></div></div>`;
          } else if (i === 1) {
            detail = req.step >= 2
              ? `<div style="color:#16a34a;font-weight:700;font-size:.88rem">✓ 관리자 승인 완료 — 대여 적격(근속 1년 이상·한도 내) 확인</div>`
              : `<div style="color:var(--muted);font-size:.86rem">관리자 승인 대기 중입니다.</div>`;
          } else if (i === 2) {
            detail = req.step >= 3
              ? `<div style="font-weight:700;color:var(--ink);margin-bottom:8px">📑 회사–직원 간 대출계약서 <span style="font-size:.72rem;color:#16a34a;font-weight:700;margin-left:6px">✓ 전자결재 완료</span></div><div class="detail-list"><div><span>대주(貸主)</span><b>${COMPANY}</b></div><div><span>차주(借主)</span><b>${req.emp}</b></div><div><span>대출 종류</span><b>${req.type}</b></div><div><span>대출 원금</span><b>${won(req.amt)}원</b></div><div><span>이자율</span><b>연 2% (원리금 균등)</b></div><div><span>상환 방법</span><b>급여 공제 · ${req.term}개월</b></div><div class="total"><span>월 상환액</span><b>${won(monthly)}원</b></div></div>`
              : `<div style="color:var(--muted);font-size:.86rem">관리자 승인 후 대출계약서를 전자결재합니다.</div>`;
          } else if (i === 3) {
            detail = req.step >= 4
              ? `<div style="font-weight:700;color:var(--ink);margin-bottom:8px">🧾 전자지출결의서 (자동 생성) <span style="font-size:.72rem;color:#16a34a;font-weight:700;margin-left:6px">✓ 대출계약서 연동</span></div><div class="detail-list"><div><span>지출 항목</span><b>${req.type}</b></div><div><span>지급 대상</span><b>${req.emp}</b></div><div><span>계약 근거</span><b>주택자금 대출계약서 (전자결재 완료)</b></div><div><span>증빙</span><b>보증보험증권·임대차계약서·실거주 증빙</b></div><div class="total"><span>지출 금액</span><b>${won(req.amt)}원</b></div></div>`
              : `<div style="color:var(--muted);font-size:.86rem">대출계약서 전자결재가 끝나면 지출결의서가 자동 생성됩니다.</div>`;
          }
          return `<div style="border:1px solid ${done ? "rgba(22,163,74,.4)" : cur ? "var(--accent)" : "var(--line)"};border-radius:12px;padding:14px 16px;margin-bottom:10px;background:${done ? "rgba(22,163,74,.05)" : cur ? "var(--accent-soft)" : "#fff"}"><div style="display:flex;justify-content:space-between;align-items:center;${detail ? "margin-bottom:10px" : ""}"><div style="font-weight:800;color:var(--ink);font-size:.92rem">STEP ${i + 1} · ${s}</div><span style="font-weight:800;font-size:.78rem;color:${col}">${tag}</span></div>${detail}</div>`;
        }).join("");
        docPopup({ docName: "주택자금 대여 처리 진행 상태", title: "복리후생 · 주택자금 대출", kind: `${Math.min(req.step, STEPS.length)}/${STEPS.length}단계 진행`, extraHtml: blocks });
      }
    }
  }

  /* ============================================================
     최신 개정 규정 — 모든 관리 시스템에 함께 제공 (회사 전체 규정 안내)
     ============================================================ */
  const REGS = {
    leave: [["연차유급휴가 규정", "2026.01", "연차 발생·사용·촉진 기준 및 신청 절차"], ["근태관리 규정", "2025.11", "근무시간·지각·연장근로 처리 기준"]],
    payroll: [["급여 규정", "2026.01", "임금 구성·지급일·공제 항목 기준"], ["통상임금·수당 규정", "2025.10", "연장·야간·휴일근로 수당 산정 기준"]],
    tax: [["원천징수 안내", "2026.01", "근로소득 원천세 신고·납부 절차"], ["연말정산 안내", "2025.12", "소득·세액공제 제출 서류 및 일정"]],
    pension: [["퇴직연금 운영규정", "2025.09", "DB·DC 운영, 적립·수령 기준"]],
    training: [["교육훈련 규정", "2026.01", "교육 운영·이수·비용 지원 기준"], ["인턴 운영규정", "2026.01", "상·하반기 인턴 채용 및 3개월 교육·전환 기준"], ["현장실무교육(OJT) 규정", "2026.01", "정규직 입사 후 1년 육성 과정 운영"]],
    growth: [["인사평가 규정", "2025.12", "성과·역량 평가 기준 및 등급"], ["승진·승격 규정", "2025.12", "승진 요건·심사 절차"]],
    approval: [["전자결재 규정", "2026.01", "기안·결재선·전결 기준"], ["위임전결 규정", "2025.11", "직급별 전결 권한"]],
    budget: [["예산관리 규정", "2026.01", "예산 편성·집행·이월 기준"]],
    expense: [["경비처리 규정", "2026.01", "지출결의·증빙·정산 기준"], ["법인카드 사용규정", "2025.10", "사용 한도·금지 항목"]],
    kpi: [["성과관리(KPI) 규정", "2026.01", "KPI 설정·평가·보상 연계 기준"]],
    automation: [["업무 자동화 운영지침", "2026.01", "자동화 대상·승인·점검 기준"]],
    knowledge: [["멘토링 운영규정", "2025.12", "멘토 매칭·활동·보상 기준"], ["지식공유 가이드", "2025.11", "문서화·공유 절차"]],
    security: [["정보보안 규정", "2026.02", "정보 등급·접근통제·반출 기준"], ["개인정보보호 규정", "2026.02", "수집·이용·파기 및 민감(의료)정보 보호"], ["접근권한 관리규정", "2026.01", "최소권한·권한 부여/회수 절차"]],
    report: [["경영보고 규정", "2026.01", "보고 주기·양식·승인 기준"]],
    evaluation: [["인사평가 규정", "2026.01", "평가 등급·절차·이의신청 기준"], ["성과·역량 평가 운영지침", "2026.01", "직무별 KPI·OKR·역량 혼합 및 다면평가 기준"]],
    policy: [["취업규칙", "2026.01", "근로조건·복무·휴가 등 전반"], ["모성보호·일·가정 양립 규정", "2026.01", "출산·육아휴직·근로시간 단축 기준"]],
    welfare: [["복리후생 규정", "2026.01", "복지제도 전반 운영 기준"], ["선택적 복리후생(이지웰) 운영규정", "2026.01", "연간 복지포인트 부여·사용 기준"], ["경조금 지급규정", "2025.12", "경조사별 지급액·증빙 기준"], ["의료비·교통비 지원규정", "2025.12", "지원 항목·한도·신청 절차"], ["주택자금 대여 규정", "2026.01", "1년 이상 재직자 대상 전세·월세보증금·구입자금 대여 기준·한도·상환"]]
  };
  function appendRegs(id, root) {
    const regs = REGS[id]; if (!regs) return;
    const p = panel("📋 관련 규정 · 최신 개정", "이 시스템과 관련된 사내 규정을 함께 안내합니다");
    const wrap = el("div"); p.appendChild(wrap);
    regs.forEach((r) => {
      const row = el("div"); row.style.cssText = "border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-bottom:8px;background:#fff;cursor:pointer";
      row.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><div style="font-weight:600;color:var(--ink);font-size:.92rem">${r[0]}</div><div style="display:flex;align-items:center;gap:8px">${pill(r[1] + " 개정", "info")}<span class="reg-toggle" style="color:var(--accent-deep);font-size:.8rem;font-weight:700">전문 보기 ▾</span></div></div><div class="reg-sum" style="display:none;margin-top:9px;font-size:.85rem;color:var(--text);border-top:1px dashed var(--line);padding-top:9px">${r[2]}<div style="margin-top:6px;color:var(--muted);font-size:.78rem">※ 데모용 요약입니다. 실제 시스템에서는 항상 최신 개정 규정 전문이 연결됩니다.</div></div>`;
      row.onclick = () => { const s = row.querySelector(".reg-sum"); const t = row.querySelector(".reg-toggle"); const open = s.style.display === "none"; s.style.display = open ? "block" : "none"; t.textContent = open ? "전문 닫기 ▴" : "전문 보기 ▾"; };
      wrap.appendChild(row);
    });
    root.appendChild(p);
  }

  /* ============================================================
     16) 성과·역량 평가관리 (상시평가 + KPI·OKR·역량 혼합 · 9-Box · 다면평가)
     ============================================================ */
  function appEvaluation(root) {
    root.appendChild(badge("성과·역량 평가 · 상시평가 + KPI·OKR 혼합"));
    root.appendChild(statCards([
      { label: "평가 대상", value: HEADCOUNT, unit: "명", accent: true },
      { label: "상시평가 진행률", value: 96, unit: "%", sub: "1:1·OKR 누적 기반" },
      { label: "핵심인재(9-Box)", value: 58, unit: "명", sub: "고성과·고잠재" },
      { label: "위험관리대상자", value: 82, unit: "명", sub: "→ 핀셋 교육 연계" }
    ]));
    const tabs = el("div", "app-tabs");
    const names = ["평가 모델(직무 맞춤)", "9-Box 인재맵", "다면평가(360°)", "결과·Calibration", "개인 평가 리포트"];
    const content = el("div");
    const R = [tabModel, tabNineBox, tabMulti, tabResult, tabPersonal];
    function setTab(i) { $$(".app-tab", tabs).forEach((t, k) => t.classList.toggle("active", k === i)); content.innerHTML = ""; R[i](content); }
    names.forEach((n, i) => { const t = el("button", "app-tab" + (i === 0 ? " active" : ""), n); t.onclick = () => setTab(i); tabs.appendChild(t); });
    root.appendChild(tabs); root.appendChild(content); setTab(0);

    function tabModel(c) {
      const intro = el("div"); intro.style.cssText = "font-size:.88rem;color:var(--text);margin-bottom:14px;line-height:1.65";
      intro.innerHTML = "연 1회 '평가 이벤트'가 아니라 <b>상시 누적 데이터</b>(1:1 미팅 기록·OKR 진척률·동료 피드백·협업 데이터)를 기반으로 평가합니다. 직무·부서 특성에 따라 KPI·OKR·역량 비중을 <b>유연하게 혼합</b>합니다.";
      c.appendChild(intro);
      const models = [["개발·연구직 (HIS개발·연구소)", 25, 45, 30, "도전 목표·기술 역량 중심"], ["영업·마케팅직", 55, 25, 20, "정량 성과(KPI) 중심"], ["운영·유지보수(SM)직", 50, 20, 30, "안정 운영·SLA 중심"], ["전략기획직", 30, 50, 20, "전략 목표(OKR) 중심"], ["경영지원·관리직", 40, 15, 45, "정확성·역량 중심"]];
      const mb = (v, cls) => `<div style="display:flex;align-items:center;gap:6px"><div class="minibar" style="min-width:54px"><i class="${cls}" style="width:${v}%"></i></div><span style="font-size:.76rem;color:var(--ink)">${v}%</span></div>`;
      const p = panel("직무·부서 특성별 평가 모델 — KPI · OKR · 역량 혼합 비중");
      p.appendChild(tableWrap([{ t: "직무군" }, { t: "KPI" }, { t: "OKR" }, { t: "역량" }, { t: "특성" }],
        models.map((m) => { const tr = el("tr"); tr.innerHTML = `<td class="name">${m[0]}</td><td>${mb(m[1], "")}</td><td>${mb(m[2], "ok")}</td><td>${mb(m[3], "warn")}</td><td style="font-size:.82rem;color:var(--muted)">${m[4]}</td>`; return tr; })));
      c.appendChild(p);
    }
    function tabNineBox(c) {
      const p = panel("9-Box 인재 매트릭스 — 성과 × 잠재력", "핵심인재 식별 · 승계/육성 대상 구분");
      const cells = [[12, "육성 필요", "mid"], [28, "성장 잠재", "mid"], [58, "핵심인재", "core"], [22, "개선 필요", "mid"], [120, "안정 기여", "mid"], [64, "고성과자", "good"], [38, "위험관리", "risk"], [52, "분발 필요", "mid"], [16, "전문가형", "mid"]];
      const grid = el("div"); grid.style.cssText = "display:grid;grid-template-columns:auto repeat(3,1fr);gap:8px;align-items:stretch";
      grid.appendChild(el("div"));
      ["성과 낮음", "성과 보통", "성과 높음"].forEach((h) => grid.appendChild(el("div", null, `<div style="text-align:center;font-size:.74rem;color:var(--muted);font-weight:600">${h}</div>`)));
      const rl = ["잠재력 高", "잠재력 中", "잠재력 低"];
      cells.forEach((cell, i) => {
        if (i % 3 === 0) grid.appendChild(el("div", null, `<div style="display:flex;align-items:center;height:100%;font-size:.74rem;color:var(--muted);font-weight:600;white-space:nowrap">${rl[i / 3]}</div>`));
        const bg = cell[2] === "core" ? "rgba(82,157,227,0.16)" : cell[2] === "good" ? "rgba(47,125,91,0.12)" : cell[2] === "risk" ? "rgba(185,28,28,0.1)" : "#fff";
        const bd = cell[2] === "core" ? "var(--accent)" : cell[2] === "risk" ? "#b91c1c" : "var(--line)";
        grid.appendChild(el("div", null, `<div style="background:${bg};border:1px solid ${bd};border-radius:12px;padding:12px;text-align:center"><div style="font-size:1.4rem;font-weight:800;color:var(--ink)">${cell[0]}</div><div style="font-size:.76rem;color:var(--text);margin-top:2px">${cell[1]}</div></div>`));
      });
      p.appendChild(grid);
      const lg = el("div"); lg.style.cssText = "margin-top:12px;font-size:.8rem;color:var(--muted)"; lg.innerHTML = "🔵 핵심인재(승계 후보) · 🟢 고성과자 · 🔴 위험관리(핀셋 교육 대상)";
      p.appendChild(lg); c.appendChild(p);
    }
    function tabMulti(c) {
      const p = panel("다면평가(360°) — 평가자 구성·응답 현황");
      const raters = [["본인(자기평가)", 10, 98], ["1차 평가자(상사)", 40, 96], ["동료(Peer)", 25, 88], ["협업 부서", 15, 82], ["하위자(직책자 대상)", 10, 79]];
      p.appendChild(tableWrap([{ t: "평가 주체" }, { t: "반영 비중", cls: "center" }, { t: "응답률" }],
        raters.map((r) => { const tr = el("tr"); tr.innerHTML = `<td class="name">${r[0]}</td><td class="center">${r[1]}%</td><td><div style="display:flex;align-items:center;gap:8px"><div class="minibar"><i class="${r[2] >= 90 ? "ok" : ""}" style="width:${r[2]}%"></i></div><span style="font-size:.78rem;color:var(--muted)">${r[2]}%</span></div></td>`; return tr; })));
      const ai = el("div"); ai.style.cssText = "margin-top:12px;padding:12px 14px;background:var(--accent-soft);border-radius:10px;font-size:.82rem;color:var(--ink-2);line-height:1.6";
      ai.innerHTML = "🤖 <b>AI 지원</b> — 누적 피드백을 요약해 평가 코멘트 초안을 생성하고, 평가자 간 관대화·중심화 <b>편향을 점검</b>합니다.";
      p.appendChild(ai); c.appendChild(p);
    }
    function tabResult(c) {
      const grades = [["S", 42], ["A", 148], ["B", 228], ["C", 62], ["D", 20]]; const risk = 82;
      const p = panel("평가 등급 분포 · Calibration", "C·D 등급은 핀셋 교육 대상으로 자동 분류");
      const gmax = Math.max(...grades.map((g) => g[1]));
      const gb = el("div", "deptbars");
      grades.forEach(([g, n]) => { const isR = (g === "C" || g === "D"); const r = el("div"); r.innerHTML = `<div class="deptbar__top"><span>${g}등급 ${isR ? '<span style="color:#b91c1c">· 위험관리</span>' : ""}</span><b>${n}명</b></div><div class="minibar"><i class="${isR ? "warn" : ""}" style="width:${(n / gmax * 100).toFixed(0)}%"></i></div>`; gb.appendChild(r); });
      p.appendChild(gb);
      const cal = el("div"); cal.style.cssText = "margin-top:12px;font-size:.82rem;color:var(--muted)"; cal.innerHTML = "※ 부서 간 평가 형평성을 위해 <b>Calibration(등급 조정 회의)</b>으로 분포를 보정합니다.";
      p.appendChild(cal);
      const btn = el("button", "btn-sm btn-sm--p", "위험관리대상자 핀셋 교육 배정"); btn.style.marginTop = "14px";
      btn.onclick = () => toast(`C·D 등급 ${risk}명에게 직무별 맞춤(핀셋) 역량강화 교육을 배정했습니다.`);
      p.appendChild(btn); c.appendChild(p);
    }
    function tabPersonal(c) {
      const sample = EMP.slice(0, 40);
      const sel = el("select", "app-tab"); sel.style.cssText = "padding:8px 12px;margin-bottom:14px;max-width:340px";
      sel.innerHTML = sample.map((e, i) => `<option value="${i}">${e.name} · ${e.dept} · ${e.pos}</option>`).join("");
      const card = el("div");
      function draw() {
        const e = sample[+sel.value];
        const kpi = Math.max(40, e.growth - rint(0, 8)), okr = Math.min(100, e.growth + rint(-5, 8)), comp = e.skills.직무전문성;
        const total = Math.round((kpi + okr + comp) / 3);
        const grade = total >= 90 ? "S" : total >= 82 ? "A" : total >= 72 ? "B" : total >= 62 ? "C" : "D";
        const opinion = comp >= 85 ? "직무 전문성과 협업이 우수하며 안정적으로 목표를 달성함." : total < 72 ? "목표 대비 성과 보완이 필요하여, 직무 맞춤 핀셋 교육 대상으로 권고함." : "기대 수준의 성과를 보이며, 도전 목표(OKR) 강화 시 성장 여력이 큼.";
        card.innerHTML = "";
        const rep = el("div"); rep.style.cssText = "background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px";
        rep.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid var(--ink);padding-bottom:12px;margin-bottom:16px;gap:12px"><div><div style="font-family:var(--serif);font-size:1.2rem;font-weight:700;color:var(--ink)">개인 평가 리포트 — ${e.name}</div><div style="font-size:.82rem;color:var(--muted);margin-top:3px">${e.dept} · ${e.pos} · 입사 ${e.join} · ${THIS_MONTH} 평가</div></div><div style="text-align:center"><div style="font-size:.72rem;color:var(--muted)">종합 등급</div><div style="font-size:2rem;font-weight:800;color:var(--accent-deep);line-height:1.1">${grade}</div></div></div>
          <div class="bars"><div class="bar"><div class="bar__top"><span>KPI · 정량 성과</span><b>${kpi}</b></div><div class="bar__track"><div class="bar__fill" style="width:${kpi}%"></div></div></div><div class="bar"><div class="bar__top"><span>OKR · 목표 달성</span><b>${okr}</b></div><div class="bar__track"><div class="bar__fill alt" style="width:${okr}%"></div></div></div><div class="bar"><div class="bar__top"><span>역량 평가</span><b>${comp}</b></div><div class="bar__track"><div class="bar__fill green" style="width:${comp}%"></div></div></div></div>
          <div style="margin-top:16px;padding:14px;background:var(--bg-soft);border-radius:10px;font-size:.86rem;color:var(--text);line-height:1.6"><b style="color:var(--ink)">종합 의견</b><br>${opinion}</div>`;
        card.appendChild(rep);
        const btns = el("div"); btns.style.cssText = "margin-top:14px;display:flex;gap:8px;flex-wrap:wrap";
        const pdfBtn = el("button", "btn-sm btn-sm--p", "PDF로 생성");
        const mailBtn = el("button", "btn-sm btn-sm--ghost", "이메일 전송");
        pdfBtn.onclick = () => pdfFromNode(rep, `평가리포트_${e.name}.pdf`);
        mailBtn.onclick = () => { const subj = encodeURIComponent(`[${COMPANY}] ${e.name} ${THIS_MONTH} 평가 리포트`); const bd = encodeURIComponent(`${e.name} (${e.dept} · ${e.pos})\n종합 등급: ${grade}\nKPI ${kpi} / OKR ${okr} / 역량 ${comp}\n\n종합 의견: ${opinion}\n\n※ 시스템 시연용 예시 데이터입니다.`); window.location.href = `mailto:?subject=${subj}&body=${bd}`; toast(`${e.name}님 평가 리포트를 이메일로 전송합니다.`); };
        btns.appendChild(pdfBtn); btns.appendChild(mailBtn); card.appendChild(btns);
      }
      sel.onchange = draw;
      c.appendChild(sel); c.appendChild(card); draw();
    }
  }

  /* ============================================================
     17) 정책·제도 사용설명서 (직원용 · 군별 안내)
     ============================================================ */
  function appPolicy(root) {
    root.appendChild(badge("정책·제도 사용설명서"));
    const intro = el("div"); intro.style.cssText = "font-size:.88rem;color:var(--text);margin-bottom:14px;line-height:1.65";
    intro.innerHTML = "<b>근로기준법</b>과 <b>일·가정 양립</b>, 정부·지자체 <b>지원 정책</b>을 직원 군별로 정리한 사용설명서입니다. (형식: 서울시 청년정책 사용설명서 참고 · 카드를 누르면 신청·활용 방법이 펼쳐지고, <b>🔗 해당 정부정책 공식 사이트</b>로 바로 이동할 수 있습니다)";
    root.appendChild(intro);
    const POLICY = {
      "전 직원(공통)": [
        { cat: "근로기준법", name: "연차유급휴가", target: "전 직원", desc: "1년간 80% 이상 출근 시 15일 + 근속 가산(최대 25일).", basis: "근로기준법 제60조", how: "사내 근태·연차 시스템에서 신청 → 결재 승인. 미사용 연차는 수당 또는 사용 촉진제도 적용." },
        { cat: "근로기준법", name: "법정 근로시간·연장근로", target: "전 직원", desc: "1주 40시간(1일 8시간), 연장근로 주 12시간 한도, 가산수당 지급.", basis: "근로기준법 제50·53·56조", how: "초과근무 사전 신청·승인. 연장·야간·휴일근로 가산수당 자동 산정." },
        { cat: "근로기준법", name: "휴게·주휴일", target: "전 직원", desc: "4시간당 30분 휴게, 주 1회 이상 유급 주휴일 보장.", basis: "근로기준법 제54·55조", how: "근태 규정에 따라 자동 적용." },
        { cat: "정부정책", name: "퇴직연금(DB·DC)", target: "1년 이상 재직", desc: "근속 1년 이상 퇴직급여를 DB·DC형으로 적립·운용.", basis: "근로자퇴직급여보장법", how: "퇴직연금 운용 대시보드에서 적립·수익 현황 조회." }
      ],
      "청년 근로자": [
        { cat: "정부정책", name: "청년내일채움공제", target: "만 15~34세 중소기업 정규직", desc: "2년 근속 시 본인·기업·정부 적립으로 목돈을 마련.", basis: "고용노동부", how: "운영기관·워크넷으로 가입 신청. 인사팀이 기업 부담분을 처리." },
        { cat: "정부정책", name: "청년도약계좌", target: "만 19~34세, 소득요건 충족", desc: "5년 납입 시 정부기여금·비과세로 자산 형성.", basis: "금융위원회", how: "취급 은행 앱에서 가입, 소득·가구 요건 확인." },
        { cat: "정부정책", name: "국민취업지원제도", target: "청년 구직자", desc: "취업지원서비스 + 구직촉진수당 지급.", basis: "고용노동부", how: "고용센터·워크넷에서 신청." },
        { cat: "서울시", name: "서울시 청년월세 지원", target: "만 19~39세 무주택 청년", desc: "월세 일부를 일정 기간 지원.", basis: "서울특별시", how: "청년몽땅정보통에서 신청·서류 제출." }
      ],
      "육아기 근로자": [
        { cat: "일·가정양립", name: "출산전후휴가", target: "임신·출산 근로자", desc: "출산 전후 90일(다태아 120일) 휴가, 급여 지원.", basis: "근로기준법 제74조", how: "인사팀 신청 → 고용보험 급여 신청 연계." },
        { cat: "일·가정양립", name: "육아휴직", target: "만 8세·초2 이하 자녀", desc: "자녀 1명당 최대 1년, 육아휴직급여 지원.", basis: "남녀고용평등법 제19조", how: "전자결재 신청, 고용보험 급여 신청 안내." },
        { cat: "일·가정양립", name: "육아기 근로시간 단축", target: "육아기 근로자", desc: "주 15~35시간으로 단축 근무, 급여 일부 지원.", basis: "남녀고용평등법 제19조의2", how: "신청·승인 후 근태 반영." },
        { cat: "일·가정양립", name: "배우자 출산휴가", target: "배우자 출산 근로자", desc: "10일 유급 휴가.", basis: "남녀고용평등법 제18조의2", how: "출산일 기준 신청." },
        { cat: "일·가정양립", name: "가족돌봄휴가·휴직", target: "가족 돌봄 필요 근로자", desc: "연 10일 가족돌봄휴가 / 최대 90일 휴직.", basis: "남녀고용평등법 제22조의2", how: "사유 발생 시 신청." }
      ],
      "중장년 근로자": [
        { cat: "정부정책", name: "내일배움카드(직업훈련)", target: "재직자 포함 국민", desc: "직무·자기계발 훈련비를 카드로 지원.", basis: "고용노동부", how: "HRD-Net에서 카드 발급·과정 수강." },
        { cat: "정부정책", name: "중장년 새출발 크레딧", target: "만 45세 이상", desc: "생애경력설계·전직·재취업 지원.", basis: "고용노동부", how: "중장년내일센터 상담·신청." },
        { cat: "정부정책", name: "계속고용장려금", target: "정년 이후 계속고용", desc: "정년 도달 근로자 계속고용 시 기업 지원.", basis: "고용노동부", how: "인사팀이 요건 확인·신청." },
        { cat: "정부정책", name: "노후준비 서비스", target: "중장년 근로자", desc: "재무·건강·여가·대인관계 등 노후 설계 지원.", basis: "국민연금공단", how: "노후준비 상담 예약." }
      ]
    };
    const groups = Object.keys(POLICY);
    const tabs = el("div", "app-tabs"); const content = el("div");
    function setTab(i) { $$(".app-tab", tabs).forEach((t, k) => t.classList.toggle("active", k === i)); content.innerHTML = ""; drawGroup(groups[i]); }
    groups.forEach((g, i) => { const t = el("button", "app-tab" + (i === 0 ? " active" : ""), g); t.onclick = () => setTab(i); tabs.appendChild(t); });
    root.appendChild(tabs); root.appendChild(content); setTab(0);
    function catTone(c) { return c === "근로기준법" ? "info" : c === "일·가정양립" ? "done" : c === "서울시" ? "wait" : "gray"; }
    /* 정책명 → 해당 정부정책 공식 사이트 [표시명, URL] */
    function policyLink(p) {
      const M = {
        "연차유급휴가": ["고용노동부", "https://www.moel.go.kr"],
        "법정 근로시간·연장근로": ["고용노동부", "https://www.moel.go.kr"],
        "휴게·주휴일": ["고용노동부", "https://www.moel.go.kr"],
        "퇴직연금(DB·DC)": ["근로복지공단 퇴직연금", "https://pension.comwel.or.kr"],
        "청년내일채움공제": ["고용24(워크넷)", "https://www.work24.go.kr"],
        "청년도약계좌": ["서민금융진흥원", "https://ylaccount.kinfa.or.kr"],
        "국민취업지원제도": ["국민취업지원제도", "https://www.kua.go.kr"],
        "서울시 청년월세 지원": ["서울 청년몽땅정보통", "https://youth.seoul.go.kr"],
        "출산전후휴가": ["고용보험(모성보호)", "https://www.ei.go.kr"],
        "육아휴직": ["고용보험(모성보호)", "https://www.ei.go.kr"],
        "육아기 근로시간 단축": ["고용보험(모성보호)", "https://www.ei.go.kr"],
        "배우자 출산휴가": ["고용보험(모성보호)", "https://www.ei.go.kr"],
        "가족돌봄휴가·휴직": ["고용노동부", "https://www.moel.go.kr"],
        "내일배움카드(직업훈련)": ["HRD-Net", "https://www.hrd.go.kr"],
        "중장년 새출발 크레딧": ["노사발전재단", "https://www.nosa.or.kr"],
        "계속고용장려금": ["고용24(워크넷)", "https://www.work24.go.kr"],
        "노후준비 서비스": ["국민연금 노후준비", "https://csa.nps.or.kr"]
      };
      return M[p.name] || ["정부24", "https://www.gov.kr"];
    }
    function drawGroup(g) {
      const grid = el("div"); grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:14px";
      POLICY[g].forEach((p) => {
        const link = policyLink(p);
        const card = el("div"); card.style.cssText = "background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px;cursor:pointer;transition:border-color .2s";
        card.innerHTML = `<span class="pill pill--${catTone(p.cat)}">${p.cat}</span><h4 style="font-family:var(--serif);font-size:1.05rem;font-weight:700;color:var(--ink);margin:10px 0 6px">${p.name}</h4><div style="font-size:.78rem;color:var(--accent-deep);font-weight:600;margin-bottom:7px">대상 · ${p.target}</div><p style="font-size:.86rem;color:var(--text);line-height:1.55">${p.desc}</p><div style="font-size:.76rem;color:var(--muted);margin-top:8px">근거 · ${p.basis}</div><a class="plink" href="${link[1]}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:5px;margin-top:10px;font-size:.8rem;font-weight:700;color:var(--accent-deep)">🔗 ${link[0]} 정책 사이트 ↗</a><div class="phow" style="display:none;margin-top:10px;padding-top:10px;border-top:1px dashed var(--line);font-size:.84rem;color:var(--text);line-height:1.6"><b style="color:var(--ink)">신청·활용 방법</b><br>${p.how}</div><div class="ptoggle" style="margin-top:10px;font-size:.8rem;color:var(--accent-deep);font-weight:700">신청·활용 방법 보기 ▾</div>`;
        card.onclick = () => { const h = card.querySelector(".phow"); const t = card.querySelector(".ptoggle"); const open = h.style.display === "none"; h.style.display = open ? "block" : "none"; t.textContent = open ? "접기 ▴" : "신청·활용 방법 보기 ▾"; };
        const lk = card.querySelector(".plink"); if (lk) lk.addEventListener("click", (e) => e.stopPropagation());
        grid.appendChild(card);
      });
      content.appendChild(grid);
    }
  }

  /* ============================================================
     18) AI 이직 예측 · 인재 유지 (Retention)
     ============================================================ */
  function appRetention(root) {
    root.appendChild(badge("AI 이직 예측 · 인재 유지"));
    root.appendChild(statCards([
      { label: "이직 위험군", value: 82, unit: "명", accent: true, sub: "AI 예측(6개월)" },
      { label: "평균 잔류 확률", value: 91, unit: "%" },
      { label: "핵심인재 위험", value: 6, unit: "명", sub: "즉시 케어 필요" },
      { label: "분기 유지 성공", value: 47, unit: "명", sub: "리텐션 후 잔류" }
    ]));
    const risks = [
      { name: "정하준", dept: "HIS개발본부", lv: "높음", signal: "보상 격차 · 성장 정체", action: "보상 재검토 + 경력개발 면담" },
      { name: "김서연", dept: "영업·마케팅", lv: "높음", signal: "장기 미승진 · 몰입도 하락", action: "승진 트랙 제시 + 핵심 프로젝트 배치" },
      { name: "박도윤", dept: "데이터·AI", lv: "중간", signal: "시장 수요 高 · 보상 민감", action: "리텐션 보너스 + 1:1 케어" },
      { name: "최예준", dept: "클라우드사업부", lv: "중간", signal: "번아웃 신호 · 야근 과다", action: "업무 재배분 + 휴식 권장" },
      { name: "강하은", dept: "구축본부", lv: "낮음", signal: "안정적 · 성장 욕구", action: "교육·멘토링 기회 제공" }
    ];
    const p = panel("이직 위험 직원 · 추천 리텐션 액션", "AI가 보상·성장·몰입·근태 신호를 종합 분석");
    const wrap = el("div"); p.appendChild(wrap);
    function draw() {
      wrap.innerHTML = "";
      wrap.appendChild(tableWrap(
        [{ t: "직원" }, { t: "부서" }, { t: "위험도" }, { t: "주요 신호" }, { t: "추천 액션" }, { t: "조치" }],
        risks.map((r, i) => { const lv = r.lv === "높음" ? "rej" : r.lv === "중간" ? "wait" : "gray"; const tr = el("tr"); tr.innerHTML = `<td class="name">${r.name}</td><td>${r.dept}</td><td>${pill(r.lv, lv)}</td><td style="font-size:.84rem">${r.signal}</td><td style="font-size:.84rem;color:var(--accent-deep)">${r.action}</td><td>${r.done ? pill("진행", "done") : `<button class="btn-sm btn-sm--p" data-i="${i}">리텐션 실행</button>`}</td>`; return tr; })
      ));
      $$("[data-i]", wrap).forEach((b) => b.onclick = () => { risks[+b.dataset.i].done = true; toast(`${risks[+b.dataset.i].name}님 리텐션 플랜을 실행했습니다.`); draw(); });
    }
    draw();
    const ai = el("div"); ai.style.cssText = "margin-top:12px;padding:12px 14px;background:var(--accent-soft);border-radius:10px;font-size:.82rem;color:var(--ink-2);line-height:1.6";
    ai.innerHTML = "🤖 <b>AI 예측</b> — 보상 경쟁력·성장 정체·몰입도·근태·근속 패턴을 학습해 6개월 내 이직 가능성을 점수화하고, 직원별 맞춤 리텐션 액션을 추천합니다.";
    p.appendChild(ai); root.appendChild(p);
  }

  /* ============================================================
     19) 인건비·보상 시뮬레이터 (What-if 손익)
     ============================================================ */
  function appCompSim(root) {
    root.appendChild(badge("인건비·보상 시뮬레이터 · 시나리오 경영"));
    const baseCost = sum(EMP, (e) => e.salary) * 12, revenue = 71200000000, baseOp = Math.round(revenue * 0.084), avgSalary = baseCost / HEADCOUNT;
    root.appendChild(statCards([
      { label: "현재 연 인건비", value: money(baseCost), accent: true },
      { label: "인건비율", value: (baseCost / revenue * 100).toFixed(1), unit: "%" },
      { label: "영업이익률(현재)", value: "8.4", unit: "%" },
      { label: "영업이익(현재)", value: money(baseOp) }
    ]));
    const p = panel("What-if 시뮬레이션 — 값을 바꾸면 즉시 손익에 반영됩니다", "급여 인상·신규 채용·성과급 재원 시나리오");
    const form = el("div", "app-form");
    form.innerHTML = `<div class="app-field"><label>일괄 인상률(%)</label><input id="sim_raise" type="number" min="0" max="20" step="0.5" value="4"></div><div class="app-field"><label>신규 채용(명)</label><input id="sim_hire" type="number" min="0" max="100" step="5" value="20"></div><div class="app-field"><label>성과급 재원(인건비의 %)</label><input id="sim_bonus" type="number" min="0" max="20" step="1" value="5"></div>`;
    p.appendChild(form);
    const out = el("div"); out.style.marginTop = "16px"; p.appendChild(out);
    function calc() {
      const raise = +form.querySelector("#sim_raise").value / 100, hire = +form.querySelector("#sim_hire").value, bonus = +form.querySelector("#sim_bonus").value / 100;
      const raised = baseCost * (1 + raise), newHire = hire * avgSalary * 0.85, bonusCost = raised * bonus;
      const newCost = raised + newHire + bonusCost, delta = newCost - baseCost, newOp = baseOp - delta, newOpRate = newOp / revenue * 100;
      out.innerHTML = `<div class="app-row app-row--2"><div class="app-panel"><div class="app-panel__title">시나리오 인건비</div><div class="detail-list"><div><span>인상 반영</span><b>${money(raised)}</b></div><div><span>신규 채용 ${hire}명</span><b>+ ${money(newHire)}</b></div><div><span>성과급 재원</span><b>+ ${money(bonusCost)}</b></div><div class="total"><span>총 인건비</span><b>${money(newCost)}</b></div></div></div><div class="app-panel"><div class="app-panel__title">손익 영향(추정)</div><div class="detail-list"><div><span>인건비 증가</span><b style="color:#b91c1c">+ ${money(delta)}</b></div><div><span>인건비율</span><b>${(newCost / revenue * 100).toFixed(1)}%</b></div><div><span>영업이익(추정)</span><b>${money(newOp)}</b></div><div class="total"><span>영업이익률(추정)</span><b style="color:${newOpRate >= 8 ? "#15803d" : "#b91c1c"}">${newOpRate.toFixed(1)}%</b></div></div></div></div>`;
    }
    form.addEventListener("input", calc); calc();
    root.appendChild(p);
  }

  /* ============================================================
     20) 조직 네트워크 분석(ONA) · 협업 인텔리전스
     ============================================================ */
  function appONA(root) {
    root.appendChild(badge("조직 네트워크 분석(ONA) · 협업 인텔리전스"));
    root.appendChild(statCards([
      { label: "협업 밀도", value: "0.62", accent: true, sub: "전사 네트워크" },
      { label: "핵심 연결자", value: 14, unit: "명", sub: "부서 간 다리" },
      { label: "사일로 경고", value: 2, unit: "곳", sub: "고립 위험" },
      { label: "부서 간 협업", value: 78, unit: "점" }
    ]));
    const connectors = [
      { name: "이팀장", dept: "경영지원본부", role: "부서 간 핵심 허브", reach: "7개 부서" },
      { name: "박본부장", dept: "데이터·AI", role: "기술–현업 연결", reach: "5개 부서" },
      { name: "정파트장", dept: "운영·SM본부", role: "운영–개발 가교", reach: "4개 부서" }
    ];
    const p1 = panel("핵심 연결자(Key Connector)", "협업 흐름의 허브 — 이탈 시 조직 리스크 큼");
    p1.appendChild(tableWrap([{ t: "직원" }, { t: "부서" }, { t: "역할" }, { t: "연결 범위" }], connectors.map((c) => { const tr = el("tr"); tr.innerHTML = `<td class="name">${c.name}</td><td>${c.dept}</td><td>${c.role}</td><td>${c.reach}</td>`; return tr; })));
    root.appendChild(p1);
    const silos = [["해외사업부 ↔ 본사", "협업 빈도 낮음 · 정보 단절 위험", "높음"], ["QA본부 ↔ HIS개발본부", "피드백 루프 지연", "중간"]];
    const p2 = panel("협업 사일로 경고", "부서 간 소통이 약한 구간 — 우선 개선 대상");
    p2.appendChild(tableWrap([{ t: "구간" }, { t: "진단" }, { t: "위험도" }], silos.map((s) => { const lv = s[2] === "높음" ? "rej" : "wait"; const tr = el("tr"); tr.innerHTML = `<td class="name">${s[0]}</td><td style="font-size:.85rem">${s[1]}</td><td>${pill(s[2], lv)}</td>`; return tr; })));
    const note = el("div"); note.style.cssText = "margin-top:12px;padding:12px 14px;background:var(--accent-soft);border-radius:10px;font-size:.82rem;color:var(--ink-2);line-height:1.6";
    note.innerHTML = "🕸️ <b>ONA</b> — 협업 도구·회의·결재 흐름(메타데이터)을 익명 분석해 협업 네트워크를 시각화하고, 핵심 연결자와 소통 사일로를 찾아 조직 설계를 돕습니다.";
    p2.appendChild(note); root.appendChild(p2);
  }

  /* ============================================================
     앱 등록
     ============================================================ */
  const APPS = {
    leave: { ic: "🗓️", title: "근태·연차 관리", desc: "연차 신청 → 전자결재 → 잔여 자동 반영", render: appLeave },
    payroll: { ic: "💳", title: "급여 관리", desc: "100명 급여 산정 · 명세서 · 마감", render: appPayroll },
    tax: { ic: "🧾", title: "원천세·세무 신고 관리", desc: "원천세·부가세 신고 자료 자동 집계", render: appTax },
    pension: { ic: "🏦", title: "퇴직연금 운용 대시보드", desc: "DB·DC 적립금 현황 시각화", render: appPension },
    training: { ic: "🎓", title: "인재개발(HRD) 관리", desc: "교육과정·이수·역량개발 통합 관리", render: appTraining },
    growth: { ic: "🌱", title: "피플 애널리틱스 대시보드", desc: "성과·역량·성장 지표 분석", render: appGrowth },
    evaluation: { ic: "🏅", title: "성과·역량 평가관리", desc: "상시평가 · KPI·OKR·역량 혼합 · 9-Box · 다면평가 · 개인 리포트(PDF·메일)", render: appEvaluation },
    approval: { ic: "✅", title: "전자결재 워크플로우", desc: "기안·결재선·승인 이력 관리", render: appApproval },
    budget: { ic: "💰", title: "예산 편성·집행 관리", desc: "부서 예산 집행·추가 편성 결재", render: appBudget },
    expense: { ic: "🧮", title: "경비 처리·지출 관리", desc: "지출결의·분류별 집계", render: appExpense },
    welfare: { ic: "🎁", title: "복리후생 신청 시스템", desc: "이지웰 선택복리·의료비·교통비·경조금·주택자금 대출", render: appWelfare },
    policy: { ic: "📘", title: "정책·제도 사용설명서", desc: "근로기준법 · 일·가정 양립 · 정부 지원 정책 (군별 안내)", render: appPolicy },
    kpi: { ic: "📊", title: "KPI 경영 대시보드", desc: "전사·부서 KPI 목표 대비 실적 추적", render: appKpi },
    retention: { ic: "🧲", title: "AI 이직 예측 · 인재 유지", desc: "이직 위험 예측 · 직원별 맞춤 리텐션 액션", render: appRetention },
    compsim: { ic: "💹", title: "인건비·보상 시뮬레이터", desc: "인상·채용·성과급 시나리오의 손익 영향 시뮬레이션", render: appCompSim },
    ona: { ic: "🕸️", title: "조직 네트워크 분석(ONA)", desc: "협업 네트워크의 핵심 연결자·사일로 진단", render: appONA },
    automation: { ic: "⚙️", title: "업무 자동화(RPA) 허브", desc: "반복 업무 자동 실행 · 절감 효과 측정", render: appAutomation },
    knowledge: { ic: "🤝", title: "지식경영 · 멘토링", desc: "멘토링 현황 · 사내 지식 공유", render: appKnowledge },
    security: { ic: "🛡️", title: "보안 · 접근통제 관리", desc: "계정 권한 관리 · 보안 관제", render: appSecurity },
    report: { ic: "📑", title: "경영 리포트 자동화", desc: "전사 데이터 요약 리포트 자동 생성", render: appReport }
  };
})();
