import { useState, useMemo } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const COLORS = {
  navy: "#0B1D3A",
  navyMid: "#122347",
  navyLight: "#1C3260",
  accent: "#2B8EF0",
  accentDark: "#1A6FCC",
  accentLight: "#E8F3FE",
  teal: "#17B08A",
  tealLight: "#E3F8F2",
  amber: "#F0A500",
  amberLight: "#FFF4DC",
  red: "#E8394A",
  redLight: "#FDECEA",
  green: "#2EA44F",
  greenLight: "#E6F4EA",
  gray50: "#F7F8FA",
  gray100: "#EEF0F4",
  gray200: "#D8DCE5",
  gray400: "#98A0B4",
  gray600: "#5A6478",
  gray800: "#2C3347",
  white: "#FFFFFF",
};

// ─── DATA ────────────────────────────────────────────────────────
const SPECIALIZED_ROLES = ["BC", "NICU", "CL", "SCL", "OR", "ORS"];
const GENERAL_ROLES = ["T", "Beds"];
const ALL_ROLES = [...SPECIALIZED_ROLES, ...GENERAL_ROLES];

const ROLE_LABELS = {
  BC: "Birthing / C-Section",
  NICU: "NICU",
  CL: "Cath Lab",
  SCL: "Stock Cath Lab",
  OR: "Operating Room",
  ORS: "OR Set-Up",
  T: "Transport",
  Beds: "Bed Cleans",
};

const SHIFT_BLOCKS = ["Days", "Evenings", "Nights", "Weekends"];

const SHIFT_TIMES = {
  Days: "07:00 – 15:00",
  Evenings: "15:00 – 23:00",
  Nights: "23:00 – 07:00",
  Weekends: "07:00 – 19:00",
};

const UNITS = ["Labour & Delivery", "NICU", "Cath Lab", "OR / Surgical", "Transport"];

// trainingLevel: "full" = Fully Trained (green), "soft" = Soft Trained (yellow), "general" = general role (no level)
const INITIAL_STAFF = [
  { id: 1, name: "Sarah Okafor", role: "RN", unit: "Labour & Delivery", email: "s.okafor@hospital.ca", phone: "416-555-0101", specializations: [{ role: "BC", level: "full" }, { role: "NICU", level: "soft" }, { role: "T", level: "general" }], shiftPrefs: ["Days", "Evenings"], availability: ["Days", "Evenings", "Nights"], hoursThisWeek: 24, lastShift: "2025-04-28", status: "available" },
  { id: 2, name: "Marcus Chen", role: "RN", unit: "Cath Lab", email: "m.chen@hospital.ca", phone: "416-555-0102", specializations: [{ role: "CL", level: "full" }, { role: "SCL", level: "full" }, { role: "OR", level: "soft" }], shiftPrefs: ["Days"], availability: ["Days", "Weekends"], hoursThisWeek: 36, lastShift: "2025-04-29", status: "on-shift" },
  { id: 3, name: "Priya Nair", role: "RPN", unit: "OR / Surgical", email: "p.nair@hospital.ca", phone: "416-555-0103", specializations: [{ role: "OR", level: "full" }, { role: "ORS", level: "soft" }, { role: "T", level: "general" }], shiftPrefs: ["Evenings", "Nights"], availability: ["Evenings", "Nights", "Weekends"], hoursThisWeek: 16, lastShift: "2025-04-27", status: "available" },
  { id: 4, name: "James Whitfield", role: "RN", unit: "NICU", email: "j.whitfield@hospital.ca", phone: "416-555-0104", specializations: [{ role: "NICU", level: "full" }, { role: "BC", level: "soft" }], shiftPrefs: ["Nights"], availability: ["Nights", "Weekends"], hoursThisWeek: 12, lastShift: "2025-04-26", status: "available" },
  { id: 5, name: "Anika Sharma", role: "PSW", unit: "Transport", email: "a.sharma@hospital.ca", phone: "416-555-0105", specializations: [{ role: "T", level: "general" }, { role: "Beds", level: "general" }], shiftPrefs: ["Days", "Weekends"], availability: ["Days", "Evenings", "Weekends"], hoursThisWeek: 28, lastShift: "2025-04-29", status: "available" },
  { id: 6, name: "David Osei", role: "RN", unit: "Labour & Delivery", email: "d.osei@hospital.ca", phone: "416-555-0106", specializations: [{ role: "BC", level: "full" }, { role: "NICU", level: "full" }, { role: "OR", level: "soft" }], shiftPrefs: ["Days", "Evenings"], availability: ["Days", "Evenings"], hoursThisWeek: 40, lastShift: "2025-04-30", status: "off" },
  { id: 7, name: "Linda Tran", role: "RPN", unit: "Cath Lab", email: "l.tran@hospital.ca", phone: "416-555-0107", specializations: [{ role: "CL", level: "soft" }, { role: "SCL", level: "full" }], shiftPrefs: ["Evenings", "Nights"], availability: ["Evenings", "Nights"], hoursThisWeek: 20, lastShift: "2025-04-28", status: "available" },
  { id: 8, name: "Omar Farouk", role: "RN", unit: "OR / Surgical", email: "o.farouk@hospital.ca", phone: "416-555-0108", specializations: [{ role: "OR", level: "full" }, { role: "ORS", level: "full" }, { role: "CL", level: "soft" }], shiftPrefs: ["Days"], availability: ["Days", "Weekends"], hoursThisWeek: 32, lastShift: "2025-04-29", status: "available" },
  { id: 9, name: "Fatima Al-Hassan", role: "PSW", unit: "Transport", email: "f.alhassan@hospital.ca", phone: "416-555-0109", specializations: [{ role: "T", level: "general" }, { role: "Beds", level: "general" }], shiftPrefs: ["Nights", "Weekends"], availability: ["Nights", "Weekends"], hoursThisWeek: 8, lastShift: "2025-04-25", status: "available" },
  { id: 10, name: "Kevin Mensah", role: "RN", unit: "NICU", email: "k.mensah@hospital.ca", phone: "416-555-0110", specializations: [{ role: "NICU", level: "full" }, { role: "BC", level: "soft" }, { role: "T", level: "general" }], shiftPrefs: ["Days", "Weekends"], availability: ["Days", "Weekends"], hoursThisWeek: 24, lastShift: "2025-04-27", status: "available" },
];

const INITIAL_VACANCIES = [
  { id: 1, unit: "Labour & Delivery", shift: "Nights", date: "2025-04-30", requiredRole: "BC", urgency: "critical", filledBy: null },
  { id: 2, unit: "Cath Lab", shift: "Evenings", date: "2025-04-30", requiredRole: "CL", urgency: "high", filledBy: null },
  { id: 3, unit: "OR / Surgical", shift: "Days", date: "2025-05-01", requiredRole: "OR", urgency: "medium", filledBy: null },
];

const COVERAGE_DATA = {
  BC:   { Days: 75, Evenings: 60, Nights: 40, Weekends: 50 },
  NICU: { Days: 80, Evenings: 70, Nights: 55, Weekends: 65 },
  CL:   { Days: 70, Evenings: 45, Nights: 30, Weekends: 40 },
  SCL:  { Days: 65, Evenings: 50, Nights: 35, Weekends: 45 },
  OR:   { Days: 85, Evenings: 60, Nights: 25, Weekends: 55 },
  ORS:  { Days: 90, Evenings: 65, Nights: 40, Weekends: 60 },
  T:    { Days: 95, Evenings: 80, Nights: 70, Weekends: 75 },
  Beds: { Days: 90, Evenings: 85, Nights: 75, Weekends: 80 },
};

const THRESHOLDS = { BC: 60, NICU: 60, CL: 50, SCL: 50, OR: 60, ORS: 60, T: 70, Beds: 70 };

// ─── HELPERS FOR SPECIALIZATION FORMAT ───────────────────────────
function getSpecLevel(staff, roleCode) {
  const found = staff.specializations.find(s => s.role === roleCode);
  return found ? found.level : null;
}
function hasRole(staff, roleCode) {
  return staff.specializations.some(s => s.role === roleCode);
}

// ─── SCORING ENGINE ──────────────────────────────────────────────
function scoreCandidate(staff, vacancy) {
  const isGeneral = vacancy.requiredRole === "T" || vacancy.requiredRole === "Beds";
  const isQualified = isGeneral ? true : hasRole(staff, vacancy.requiredRole);
  if (!isQualified) return null;
  if (staff.status === "on-shift") return null;

  let score = 0;
  const breakdown = {};

  // 1. Qualification match (40%) — full trained scores highest, soft trained partial
  const level = getSpecLevel(staff, vacancy.requiredRole);
  const qualScore = level === "full" ? 40 : level === "soft" ? 28 : isGeneral ? 20 : 0;
  breakdown.qualification = qualScore;
  score += qualScore;

  // 2. Availability (25%)
  const availScore = staff.availability.includes(vacancy.shift) ? 25 : 0;
  if (availScore === 0) return null;
  breakdown.availability = availScore;
  score += availScore;

  // 3. Shift preference (20%)
  const prefScore = staff.shiftPrefs.includes(vacancy.shift) ? 20 : 8;
  breakdown.preference = prefScore;
  score += prefScore;

  // 4. Hours balance (10%) — favor lower hours
  const hoursScore = staff.hoursThisWeek <= 20 ? 10 : staff.hoursThisWeek <= 32 ? 6 : 2;
  breakdown.hours = hoursScore;
  score += hoursScore;

  // 5. Recency — days since last shift (5%) — favor longer rest
  const daysSince = Math.floor((new Date("2025-04-30") - new Date(staff.lastShift)) / 86400000);
  const recencyScore = daysSince >= 3 ? 5 : daysSince >= 1 ? 3 : 1;
  breakdown.recency = recencyScore;
  score += recencyScore;

  return { staff, score, breakdown, isTopPick: false };
}

// ─── HELPERS ─────────────────────────────────────────────────────
function initials(name) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function coverageColor(pct, threshold) {
  if (pct >= threshold + 15) return { bg: "#E6F4EA", text: "#2EA44F", border: "#2EA44F" };
  if (pct >= threshold) return { bg: "#FFF4DC", text: "#B07D00", border: "#F0A500" };
  return { bg: "#FDECEA", text: "#C42A3A", border: "#E8394A" };
}

const AVATAR_COLORS = [
  ["#E8F3FE","#1A6FCC"], ["#E3F8F2","#0F7B62"], ["#FFF4DC","#A07000"],
  ["#FDECEA","#C42A3A"], ["#EEF0F4","#3A4560"],
];
function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

const STATUS_CONFIG = {
  "available":  { label: "Available",  bg: "#E6F4EA", text: "#2EA44F" },
  "on-shift":   { label: "On shift",   bg: "#E8F3FE", text: "#1A6FCC" },
  "off":        { label: "Off",        bg: "#EEF0F4", text: "#5A6478" },
};

const URGENCY_CONFIG = {
  critical: { label: "Critical", bg: "#FDECEA", text: "#C42A3A" },
  high:     { label: "High",     bg: "#FFF4DC", text: "#A07000" },
  medium:   { label: "Medium",   bg: "#E8F3FE", text: "#1A6FCC" },
};

// ─── COMPONENTS ──────────────────────────────────────────────────

function Badge({ children, bg, text, style = {} }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 600, padding: "2px 8px",
      borderRadius: 99, background: bg, color: text, ...style
    }}>
      {children}
    </span>
  );
}

// Training level badge for specialized roles
const TRAINING_CONFIG = {
  full: { label: "Fully Trained", bg: "#E6F4EA", text: "#1A7A3C", border: "#2EA44F" },
  soft: { label: "Soft Trained",  bg: "#FFF8E1", text: "#8A6000", border: "#F0A500" },
  general: { label: "General",    bg: "#EEF0F4", text: "#5A6478", border: "#D8DCE5" },
};

function SpecBadge({ roleCode, level, showLabel = false }) {
  const cfg = TRAINING_CONFIG[level] || TRAINING_CONFIG.general;
  const isSpec = SPECIALIZED_ROLES.includes(roleCode);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 700,
      padding: "2px 8px", borderRadius: 99,
      background: isSpec ? cfg.bg : TRAINING_CONFIG.general.bg,
      color: isSpec ? cfg.text : TRAINING_CONFIG.general.text,
      border: `1.5px solid ${isSpec ? cfg.border : TRAINING_CONFIG.general.border}`,
    }}>
      {roleCode}
      {isSpec && showLabel && (
        <span style={{ fontWeight: 600, fontSize: 10, opacity: 0.85 }}>· {cfg.label}</span>
      )}
    </span>
  );
}

function Avatar({ name, id, size = 36 }) {
  const [bg, fg] = avatarColor(id);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      color: fg, display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.33, flexShrink: 0, fontFamily: "inherit",
    }}>
      {initials(name)}
    </div>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: COLORS.white, border: `1px solid ${COLORS.gray200}`,
      borderRadius: 12, padding: "1rem 1.25rem", ...style,
      cursor: onClick ? "pointer" : "default",
      transition: "border-color .15s",
    }}>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: accent ? accent + "18" : COLORS.gray50,
      borderRadius: 10, padding: "12px 14px",
      border: `1px solid ${accent ? accent + "33" : COLORS.gray200}`,
    }}>
      <div style={{ fontSize: 11, color: accent || COLORS.gray400, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent || COLORS.gray800, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: ".7px", marginBottom: 10 }}>{children}</div>;
}

// ─── SIDEBAR NAV ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "vacancies", label: "Open vacancies", icon: "⚠" },
  { id: "staff", label: "Staff directory", icon: "◫" },
  { id: "coverage", label: "Coverage grid", icon: "▦" },
  { id: "admin", label: "Admin", icon: "⚙" },
];

function Sidebar({ page, setPage }) {
  return (
    <div style={{
      width: 210, background: COLORS.navy, display: "flex", flexDirection: "column",
      padding: "0 0 1rem", flexShrink: 0, minHeight: "100vh",
    }}>
      <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: `1px solid ${COLORS.navyLight}` }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.5px", fontFamily: "'Georgia', serif" }}>
          Pro<span style={{ color: COLORS.accent }}>Shift</span>
        </div>
        <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 2 }}>Hospital Ops Platform</div>
      </div>
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem" }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: page === item.id ? COLORS.accentLight : "transparent",
            color: page === item.id ? COLORS.accentDark : COLORS.gray400,
            fontWeight: page === item.id ? 600 : 400, fontSize: 13,
            marginBottom: 2, transition: "all .15s", textAlign: "left",
          }}>
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "0 0.75rem", borderTop: `1px solid ${COLORS.navyLight}`, paddingTop: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name="Admin User" id={99} size={30} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.white }}>Admin User</div>
            <div style={{ fontSize: 10, color: COLORS.gray400 }}>Supervisor</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────
function Dashboard({ staff, vacancies, setPage, setSelectedVacancy }) {
  const available = staff.filter(s => s.status === "available").length;
  const onShift = staff.filter(s => s.status === "on-shift").length;
  const openVacancies = vacancies.filter(v => !v.filledBy).length;
  const critical = vacancies.filter(v => !v.filledBy && v.urgency === "critical").length;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gray800, letterSpacing: "-0.3px" }}>Good morning</div>
        <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 3 }}>Thursday, April 30, 2025 · All units overview</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: "1.5rem" }}>
        <MetricCard label="Total staff" value={staff.length} sub="registered" />
        <MetricCard label="Available now" value={available} sub="ready to assign" accent={COLORS.teal} />
        <MetricCard label="On shift" value={onShift} sub="currently working" accent={COLORS.accent} />
        <MetricCard label="Open vacancies" value={openVacancies} sub={critical > 0 ? `${critical} critical` : "no critical"} accent={openVacancies > 0 ? COLORS.red : COLORS.green} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        <div>
          <SectionLabel>Open vacancies — action required</SectionLabel>
          {vacancies.filter(v => !v.filledBy).map(v => (
            <Card key={v.id} style={{ marginBottom: 10, borderLeft: `3px solid ${URGENCY_CONFIG[v.urgency].text}` }} onClick={() => { setSelectedVacancy(v); setPage("vacancies"); }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Badge bg={URGENCY_CONFIG[v.urgency].bg} text={URGENCY_CONFIG[v.urgency].text}>{URGENCY_CONFIG[v.urgency].label}</Badge>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray800 }}>{v.unit}</span>
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.gray600 }}>
                    <strong>{v.shift}</strong> shift · {SHIFT_TIMES[v.shift]} · requires <strong>{ROLE_LABELS[v.requiredRole]}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 3 }}>{v.date}</div>
                </div>
                <button style={{
                  background: COLORS.accent, color: COLORS.white, border: "none",
                  borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  Find staff →
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <SectionLabel>Quick coverage snapshot</SectionLabel>
          <Card style={{ padding: "12px 14px" }}>
            {SPECIALIZED_ROLES.map(role => {
              const pct = COVERAGE_DATA[role].Days;
              const col = coverageColor(pct, THRESHOLDS[role]);
              return (
                <div key={role} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, fontSize: 11, fontWeight: 700, color: COLORS.gray600 }}>{role}</div>
                  <div style={{ flex: 1, height: 6, background: COLORS.gray100, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: col.border, borderRadius: 3, transition: "width .4s" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: col.text, width: 34, textAlign: "right" }}>{pct}%</div>
                </div>
              );
            })}
            <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 6, borderTop: `1px solid ${COLORS.gray100}`, paddingTop: 6 }}>Days shift coverage · specialized roles only</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── VACANCIES + SMART SUGGEST ───────────────────────────────────
function VacanciesPage({ staff, vacancies, setVacancies, selectedVacancy, setSelectedVacancy }) {
  const [assignedMsg, setAssignedMsg] = useState(null);

  const open = vacancies.filter(v => !v.filledBy);
  const filled = vacancies.filter(v => v.filledBy);
  const active = selectedVacancy || (open.length > 0 ? open[0] : null);

  const candidates = useMemo(() => {
    if (!active) return [];
    const scored = staff
      .map(s => scoreCandidate(s, active))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    if (scored.length > 0) scored[0].isTopPick = true;
    return scored;
  }, [active, staff]);

  function assign(staffMember) {
    setVacancies(prev => prev.map(v =>
      v.id === active.id ? { ...v, filledBy: staffMember.name } : v
    ));
    setAssignedMsg(`${staffMember.name} assigned to ${active.unit} ${active.shift} shift`);
    setSelectedVacancy(null);
    setTimeout(() => setAssignedMsg(null), 4000);
  }

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gray800, marginBottom: 4, letterSpacing: "-0.3px" }}>Open vacancies</div>
      <div style={{ fontSize: 13, color: COLORS.gray400, marginBottom: "1.5rem" }}>Select a vacancy to see smart-ranked candidates</div>

      {assignedMsg && (
        <div style={{ background: COLORS.greenLight, border: `1px solid ${COLORS.green}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: COLORS.green, fontWeight: 500, marginBottom: 12 }}>
          ✓ {assignedMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
        {/* Vacancy list */}
        <div>
          <SectionLabel>Open shifts ({open.length})</SectionLabel>
          {open.map(v => (
            <Card key={v.id} onClick={() => setSelectedVacancy(v)} style={{
              marginBottom: 8, cursor: "pointer",
              borderLeft: `3px solid ${URGENCY_CONFIG[v.urgency].text}`,
              background: active?.id === v.id ? COLORS.accentLight : COLORS.white,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <Badge bg={URGENCY_CONFIG[v.urgency].bg} text={URGENCY_CONFIG[v.urgency].text}>{URGENCY_CONFIG[v.urgency].label}</Badge>
                <span style={{ fontSize: 11, color: COLORS.gray400 }}>{v.date}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray800 }}>{v.unit}</div>
              <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 2 }}>{v.shift} · {ROLE_LABELS[v.requiredRole]}</div>
            </Card>
          ))}

          {filled.length > 0 && (
            <>
              <SectionLabel style={{ marginTop: 12 }}>Filled shifts ({filled.length})</SectionLabel>
              {filled.map(v => (
                <Card key={v.id} style={{ marginBottom: 8, opacity: 0.7 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray800 }}>{v.unit} · {v.shift}</div>
                  <div style={{ fontSize: 11, color: COLORS.green, marginTop: 2 }}>✓ Filled by {v.filledBy}</div>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Smart suggest panel */}
        <div>
          {active ? (
            <>
              <div style={{ background: COLORS.navy, borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: COLORS.gray400, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Vacant shift</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.white }}>{active.unit}</div>
                    <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 3 }}>
                      {active.shift} · {SHIFT_TIMES[active.shift]} · {active.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 4 }}>Required skill</div>
                    <div style={{ background: COLORS.accent, color: COLORS.white, padding: "4px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                      {active.requiredRole} — {ROLE_LABELS[active.requiredRole]}
                    </div>
                  </div>
                </div>
              </div>

              <SectionLabel>Smart-ranked candidates ({candidates.length} qualified)</SectionLabel>

              {candidates.length === 0 && (
                <Card style={{ textAlign: "center", padding: "2rem" }}>
                  <div style={{ fontSize: 14, color: COLORS.gray400 }}>No qualified available staff found for this shift.</div>
                </Card>
              )}

              {candidates.map((c, i) => {
                const [bg, fg] = avatarColor(c.staff.id);
                const statusCfg = STATUS_CONFIG[c.staff.status];
                return (
                  <Card key={c.staff.id} style={{
                    marginBottom: 10,
                    border: c.isTopPick ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.gray200}`,
                    background: c.isTopPick ? COLORS.accentLight : COLORS.white,
                  }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ position: "relative" }}>
                        <Avatar name={c.staff.name} id={c.staff.id} size={42} />
                        {c.isTopPick && (
                          <div style={{
                            position: "absolute", top: -6, right: -6,
                            background: COLORS.accent, color: COLORS.white,
                            fontSize: 9, fontWeight: 700, padding: "1px 5px",
                            borderRadius: 99, whiteSpace: "nowrap",
                          }}>TOP</div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray800 }}>{c.staff.name}</span>
                            <span style={{ fontSize: 12, color: COLORS.gray400, marginLeft: 8 }}>{c.staff.role} · {c.staff.unit}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 18, fontWeight: 800, color: c.isTopPick ? COLORS.accent : COLORS.gray600 }}>{c.score}%</span>
                            <button onClick={() => assign(c.staff)} style={{
                              background: c.isTopPick ? COLORS.accent : COLORS.white,
                              color: c.isTopPick ? COLORS.white : COLORS.accent,
                              border: `1.5px solid ${COLORS.accent}`, borderRadius: 8,
                              padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                            }}>Assign</button>
                          </div>
                        </div>

                        {/* Score breakdown */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                          {[
                            ["Qual", c.breakdown.qualification, 40],
                            ["Avail", c.breakdown.availability, 25],
                            ["Pref", c.breakdown.preference, 20],
                            ["Hours", c.breakdown.hours, 10],
                            ["Rest", c.breakdown.recency, 5],
                          ].map(([lbl, val, max]) => (
                            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4, background: COLORS.gray50, borderRadius: 6, padding: "3px 8px" }}>
                              <span style={{ fontSize: 10, color: COLORS.gray400 }}>{lbl}</span>
                              <div style={{ width: 28, height: 3, background: COLORS.gray200, borderRadius: 2 }}>
                                <div style={{ width: `${(val/max)*100}%`, height: "100%", background: COLORS.accent, borderRadius: 2 }} />
                              </div>
                              <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.gray600 }}>{val}/{max}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <Badge bg={statusCfg.bg} text={statusCfg.text}>{statusCfg.label}</Badge>
                          {c.staff.specializations.map(s => (
                            <SpecBadge key={s.role} roleCode={s.role} level={s.level} />
                          ))}
                          <Badge bg={COLORS.gray100} text={COLORS.gray600}>{c.staff.hoursThisWeek}h this week</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          ) : (
            <Card style={{ textAlign: "center", padding: "3rem", color: COLORS.gray400 }}>
              <div style={{ fontSize: 15 }}>Select a vacancy to view smart-ranked candidates</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STAFF DIRECTORY ─────────────────────────────────────────────
function StaffDirectory({ staff }) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterSpec, setFilterSpec] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.unit.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || s.role === filterRole;
    const matchSpec = filterSpec === "All" || s.specializations.includes(filterSpec);
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchRole && matchSpec && matchStatus;
  });

  if (selectedStaff) return <StaffProfile staff={selectedStaff} onBack={() => setSelectedStaff(null)} />;

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gray800, marginBottom: 4, letterSpacing: "-0.3px" }}>Staff directory</div>
      <div style={{ fontSize: 13, color: COLORS.gray400, marginBottom: "1.25rem" }}>{staff.length} registered staff members</div>

      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or unit…" style={{
          flex: 1, minWidth: 180, padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.gray200}`,
          fontSize: 13, outline: "none", background: COLORS.white, color: COLORS.gray800,
        }} />
        {[
          ["Role", ["All","RN","RPN","PSW"], filterRole, setFilterRole],
          ["Specialization", ["All",...ALL_ROLES], filterSpec, setFilterSpec],
          ["Status", ["All","available","on-shift","off"], filterStatus, setFilterStatus],
        ].map(([label, opts, val, set]) => (
          <select key={label} value={val} onChange={e => set(e.target.value)} style={{
            padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.gray200}`,
            fontSize: 13, background: COLORS.white, color: COLORS.gray800, cursor: "pointer", outline: "none",
          }}>
            {opts.map(o => <option key={o} value={o}>{label === "Status" ? (o === "All" ? "All statuses" : STATUS_CONFIG[o]?.label || o) : (o === "All" ? `All ${label.toLowerCase()}s` : (ROLE_LABELS[o] || o))}</option>)}
          </select>
        ))}
      </div>

      <div style={{ border: `1px solid ${COLORS.gray200}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 80px 1fr 1fr 120px 80px",
          background: COLORS.gray50, padding: "9px 16px",
          fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: ".5px",
          borderBottom: `1px solid ${COLORS.gray200}`,
        }}>
          <span>Name</span><span>Role</span><span>Unit</span><span>Specializations</span><span>Shift prefs</span><span>Status</span>
        </div>
        {filtered.map((s, i) => {
          const statusCfg = STATUS_CONFIG[s.status];
          return (
            <div key={s.id} onClick={() => setSelectedStaff(s)} style={{
              display: "grid", gridTemplateColumns: "2fr 80px 1fr 1fr 120px 80px",
              padding: "12px 16px", borderBottom: i < filtered.length-1 ? `1px solid ${COLORS.gray100}` : "none",
              cursor: "pointer", alignItems: "center",
              transition: "background .1s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={s.name} id={s.id} size={32} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray800 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.gray400 }}>{s.hoursThisWeek}h this week</div>
                </div>
              </div>
              <div><Badge bg={COLORS.accentLight} text={COLORS.accentDark}>{s.role}</Badge></div>
              <div style={{ fontSize: 12, color: COLORS.gray600 }}>{s.unit}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {s.specializations.slice(0, 3).map(sp => (
                  <SpecBadge key={sp.role} roleCode={sp.role} level={sp.level} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray600 }}>{s.shiftPrefs.join(", ")}</div>
              <div><Badge bg={statusCfg.bg} text={statusCfg.text}>{statusCfg.label}</Badge></div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: COLORS.gray400, fontSize: 13 }}>No staff match your filters.</div>
        )}
      </div>
    </div>
  );
}

// ─── STAFF PROFILE ───────────────────────────────────────────────
function StaffProfile({ staff: s, onBack }) {
  const statusCfg = STATUS_CONFIG[s.status];
  const [bg, fg] = avatarColor(s.id);
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.accent, fontSize: 13, cursor: "pointer", marginBottom: "1rem", padding: 0, fontWeight: 500 }}>
        ← Back to directory
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: "1.25rem" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>
              {initials(s.name)}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gray800 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: COLORS.gray600, marginTop: 2 }}>{s.role} · {s.unit}</div>
              <div style={{ marginTop: 6 }}><Badge bg={statusCfg.bg} text={statusCfg.text}>{statusCfg.label}</Badge></div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.gray100}`, paddingTop: "1rem" }}>
            {[["Email", s.email], ["Phone", s.phone], ["Hours this week", `${s.hoursThisWeek}h`], ["Last shift", s.lastShift]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span style={{ color: COLORS.gray400 }}>{k}</span>
                <span style={{ color: COLORS.gray800, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionLabel>Specializations & training</SectionLabel>
          {/* Legend */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            {Object.entries(TRAINING_CONFIG).map(([key, cfg]) => (
              <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, padding: "2px 7px", borderRadius: 99, background: cfg.bg, color: cfg.text, border: `1.5px solid ${cfg.border}`, fontWeight: 700 }}>
                {cfg.label}
              </span>
            ))}
          </div>
          {s.specializations.map(sp => (
            <div key={sp.role} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray800 }}>{sp.role}</span>
                <span style={{ fontSize: 12, color: COLORS.gray400, marginLeft: 8 }}>{ROLE_LABELS[sp.role]}</span>
              </div>
              <SpecBadge roleCode={sp.role} level={sp.level} showLabel={true} />
            </div>
          ))}
          <div style={{ marginTop: "1rem" }}>
            <SectionLabel>Shift preferences</SectionLabel>
            <div style={{ display: "flex", gap: 6 }}>
              {SHIFT_BLOCKS.map(block => (
                <div key={block} style={{
                  padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                  background: s.shiftPrefs.includes(block) ? COLORS.accentLight : COLORS.gray100,
                  color: s.shiftPrefs.includes(block) ? COLORS.accentDark : COLORS.gray400,
                  border: `1px solid ${s.shiftPrefs.includes(block) ? COLORS.accent + "44" : COLORS.gray200}`,
                }}>{block}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <SectionLabel>Availability</SectionLabel>
            <div style={{ display: "flex", gap: 6 }}>
              {SHIFT_BLOCKS.map(block => (
                <div key={block} style={{
                  padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                  background: s.availability.includes(block) ? COLORS.greenLight : COLORS.gray100,
                  color: s.availability.includes(block) ? COLORS.green : COLORS.gray400,
                }}>{block}</div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── COVERAGE GRID ───────────────────────────────────────────────
function CoverageGrid() {
  const [selectedShift, setSelectedShift] = useState("Days");
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gray800, marginBottom: 4, letterSpacing: "-0.3px" }}>Coverage grid</div>
      <div style={{ fontSize: 13, color: COLORS.gray400, marginBottom: "1.25rem" }}>Percentage of on-shift staff certified per role per time block</div>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
        {SHIFT_BLOCKS.map(b => (
          <button key={b} onClick={() => setSelectedShift(b)} style={{
            padding: "7px 16px", borderRadius: 8, border: `1px solid ${selectedShift === b ? COLORS.accent : COLORS.gray200}`,
            background: selectedShift === b ? COLORS.accentLight : COLORS.white,
            color: selectedShift === b ? COLORS.accentDark : COLORS.gray600,
            fontWeight: selectedShift === b ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{b}</button>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px repeat(4,1fr)", borderBottom: `1px solid ${COLORS.gray100}` }}>
          <div style={{ padding: "10px 16px", background: COLORS.gray50, fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: ".5px" }}>Role</div>
          {SHIFT_BLOCKS.map(b => (
            <div key={b} style={{ padding: "10px 16px", background: b === selectedShift ? COLORS.accentLight : COLORS.gray50, fontSize: 11, fontWeight: 700, color: b === selectedShift ? COLORS.accentDark : COLORS.gray400, textTransform: "uppercase", letterSpacing: ".5px", textAlign: "center", borderLeft: `1px solid ${COLORS.gray100}` }}>
              {b}
            </div>
          ))}
        </div>
        {ALL_ROLES.map((role, ri) => (
          <div key={role} style={{ display: "grid", gridTemplateColumns: "200px repeat(4,1fr)", borderBottom: ri < ALL_ROLES.length-1 ? `1px solid ${COLORS.gray100}` : "none" }}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray800 }}>{role}</div>
              <div style={{ fontSize: 11, color: COLORS.gray400 }}>{ROLE_LABELS[role]}</div>
              {SPECIALIZED_ROLES.includes(role) && <Badge bg={COLORS.accentLight} text={COLORS.accentDark} style={{ marginTop: 4, fontSize: 10 }}>Specialized</Badge>}
            </div>
            {SHIFT_BLOCKS.map(block => {
              const pct = COVERAGE_DATA[role][block];
              const col = coverageColor(pct, THRESHOLDS[role]);
              const isSelected = block === selectedShift;
              return (
                <div key={block} style={{ padding: "14px 16px", textAlign: "center", borderLeft: `1px solid ${COLORS.gray100}`, background: isSelected ? col.bg + "66" : "transparent" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: col.text }}>{pct}%</div>
                  <div style={{ height: 4, background: COLORS.gray100, borderRadius: 2, margin: "6px 8px" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: col.border, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.gray400 }}>min {THRESHOLDS[role]}%</div>
                </div>
              );
            })}
          </div>
        ))}
      </Card>
      <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 12 }}>
        {[["Above threshold", COLORS.green, COLORS.greenLight], ["At risk", COLORS.amber, COLORS.amberLight], ["Below minimum", COLORS.red, COLORS.redLight]].map(([lbl, text, bg]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1.5px solid ${text}` }} />
            <span style={{ color: COLORS.gray600 }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────
function AdminPanel({ staff, setStaff }) {
  const [regLink] = useState("proshift.app/register/pvt-hosp-2025-abc123");
  const [copied, setCopied] = useState(false);
  const [showAddVacancy, setShowAddVacancy] = useState(false);
  const [newVacancy, setNewVacancy] = useState({ unit: UNITS[0], shift: "Days", requiredRole: "BC", date: "2025-05-01", urgency: "medium" });

  function copy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const pendingCount = 2;

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gray800, marginBottom: "1.5rem", letterSpacing: "-0.3px" }}>Admin panel</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        <Card>
          <SectionLabel>Staff registration link</SectionLabel>
          <div style={{ fontSize: 13, color: COLORS.gray600, marginBottom: 10, lineHeight: 1.5 }}>
            Share this link with staff to let them self-register. You approve each submission before they appear in the system.
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <div style={{ flex: 1, background: COLORS.gray50, border: `1px solid ${COLORS.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: COLORS.accent, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {regLink}
            </div>
            <button onClick={copy} style={{ background: copied ? COLORS.green : COLORS.accent, color: COLORS.white, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
          <div style={{ background: COLORS.amberLight, border: `1px solid ${COLORS.amber}33`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#8a6200" }}>
            <strong>{pendingCount} pending registrations</strong> awaiting approval
          </div>
        </Card>

        <Card>
          <SectionLabel>Add a vacant shift</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["Unit", "unit", UNITS],
              ["Shift", "shift", SHIFT_BLOCKS],
              ["Required role", "requiredRole", ALL_ROLES],
              ["Urgency", "urgency", ["medium","high","critical"]],
            ].map(([label, key, opts]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 12, color: COLORS.gray600, width: 110, flexShrink: 0 }}>{label}</label>
                <select value={newVacancy[key]} onChange={e => setNewVacancy(p => ({ ...p, [key]: e.target.value }))} style={{
                  flex: 1, padding: "6px 10px", borderRadius: 8, border: `1px solid ${COLORS.gray200}`,
                  fontSize: 12, background: COLORS.white, color: COLORS.gray800, outline: "none",
                }}>
                  {opts.map(o => <option key={o} value={o}>{ROLE_LABELS[o] || o}</option>)}
                </select>
              </div>
            ))}
            <button style={{ background: COLORS.accent, color: COLORS.white, border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
              Create vacancy
            </button>
          </div>
        </Card>

        <Card>
          <SectionLabel>Task thresholds — specialized roles</SectionLabel>
          <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 10 }}>Minimum % of on-shift staff required per specialized role</div>
          {SPECIALIZED_ROLES.map(role => (
            <div key={role} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 40, fontSize: 12, fontWeight: 700, color: COLORS.gray800 }}>{role}</div>
              <div style={{ flex: 1, fontSize: 11, color: COLORS.gray400 }}>{ROLE_LABELS[role]}</div>
              <div style={{ background: COLORS.accentLight, color: COLORS.accentDark, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6 }}>
                {THRESHOLDS[role]}%
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionLabel>Units</SectionLabel>
          {UNITS.map((u, i) => (
            <div key={u} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < UNITS.length-1 ? `1px solid ${COLORS.gray100}` : "none", fontSize: 13, color: COLORS.gray800 }}>
              <span>{u}</span>
              <Badge bg={COLORS.gray100} text={COLORS.gray600}>{STAFF_COUNT_BY_UNIT[u] || 0} staff</Badge>
            </div>
          ))}
          <button style={{ width: "100%", background: COLORS.white, color: COLORS.accent, border: `1.5px dashed ${COLORS.accent}`, borderRadius: 8, padding: "7px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 10 }}>
            + Add unit
          </button>
        </Card>
      </div>
    </div>
  );
}

const STAFF_COUNT_BY_UNIT = INITIAL_STAFF.reduce((acc, s) => {
  acc[s.unit] = (acc[s.unit] || 0) + 1; return acc;
}, {});

// ─── ROOT APP ────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [staff] = useState(INITIAL_STAFF);
  const [vacancies, setVacancies] = useState(INITIAL_VACANCIES);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard staff={staff} vacancies={vacancies} setPage={setPage} setSelectedVacancy={setSelectedVacancy} />;
      case "vacancies": return <VacanciesPage staff={staff} vacancies={vacancies} setVacancies={setVacancies} selectedVacancy={selectedVacancy} setSelectedVacancy={setSelectedVacancy} />;
      case "staff": return <StaffDirectory staff={staff} />;
      case "coverage": return <CoverageGrid />;
      case "admin": return <AdminPanel staff={staff} setStaff={() => {}} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.gray50, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <Sidebar page={page} setPage={setPage} />
      <main style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto", maxWidth: "100%" }}>
        {renderPage()}
      </main>
    </div>
  );
}
