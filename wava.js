// ════════════════════════════════════════════════════════════════════════════
//   WAVA — Wave Bite KI Co-Pilotin · 2026-05-20
//   Weiblich, strategisch, motivierend, Schwächen→Stärken-Coach
//   Memory in localStorage, Avatar + Chat-Panel, Auto-Insights, Daily Focus
// ════════════════════════════════════════════════════════════════════════════
(function(){
  'use strict';
  if (window.WAVA) return; // schon initialisiert

  // ─── ECHTE WAVE-BITE-FAKTEN (aus Discovery 2026-05-20) ──────────────────
  var WB = {
    // Brand-Evolution
    brand_history: 'BlueWaterBBQ (2022/23) → Deli Kost Deluxe (09-10/25) → Wave Bite (seit 11/25)',
    // Team
    founder: 'Carsten Voigt · Solo-Founder · CH (Laufen) · 25 J. Gastro · noch Vollzeit Bell Food Group',
    holding_sitz: 'Hauptstrasse 23, 4242 Laufen BL · Wave Bite Holding AG',
    gmbh_sitz:    'Flämingstr. 4, 15738 Zeuthen · Wave Bite GmbH (i.Gr.)',
    // Cap Table
    cap_table: { carsten: 95, marcus: 5, david_phantom: 3, phantom_pool: 14 },
    // Finanzen (REALWERTE, keine Demo)
    eigenkapital_eingelegt: 50000,
    funding_ziel_pilot: 450000,
    bankdarlehen_geplant: 350000,
    bank_rate_monatlich: 6737,
    burn_monatlich: 10400,    // 125k/a / 12
    fixkosten_jahr: 125000,
    pre_money_intern: 2750000, // 2.5-3 M€ Mittelwert
    pre_money_dhdl: 1540000,
    // Operativ
    saison_tage: 150,
    breakeven_per_day: 72,
    breakeven_per_year: 10820,
    brutto_marge: 70,
    // Realität (ehrlich)
    aktueller_umsatz: 0,
    follower_count: 0,
    email_list: 0,
    club_members: 0,
    // Forecast
    forecast_2026: 250000,
    forecast_2027: 415000,
    forecast_2028: 670000,
    // IP/Recht
    wipo_design: 'DM/248323 (EU+CH) · Aufbauten für Hausboote · 21.07.2025',
    // Boot
    boot_specs: '14m × 4,85m · 2×15 kW E-Motor · PV+Batterie · Hubdach',
    // LOIs
    lois: ['Hugentobler', 'Radeberger', 'Transgourmet', 'TV Dahme-Seenland', 'FCB Catering'],
    // Funding-Termine
    dhdl_casting: '2025-12-02',
    wfb_call: '2026-05-13',
    // Bottlenecks
    liegeplatz_wolzig_status: 'ungeklärt',
    cap_table_aufrauemen: ['Marcus DHDL-Castingbogen', 'David Phantom-Klärung'],
    apps_live: ['BunBo Glide ($60/Mo)', 'Wave Bite L1 Glide', 'Wasserlage GitHub Pages'],
    // 5 Verträge final
    vertraege_final: ['Master SHA Holding AG (22.03.2026)', 'Co-Founder Marcus (23.03.2026)', 'Phantom David (03.01.2026)', 'Mgmt&Lizenz Holding↔GmbH', 'Investmentvertrag-Muster']
  };

  // ─── WAVA STATE (persistent) ─────────────────────────────────────────────
  var KEY = 'wava_state_v1';
  var state = {
    name: 'WAVA',
    full_name: 'Wave Vision Assistant',
    first_seen: null,
    last_interaction: null,
    interactions: 0,
    daily_focus: null,
    daily_focus_date: null,
    mood: 'energized', // energized | focused | concerned | proud
    memory_notes: [],
    user_wins: [],
    user_blockers: [],
    panel_open: false
  };
  try {
    var saved = localStorage.getItem(KEY);
    if (saved) Object.assign(state, JSON.parse(saved));
  } catch(e){}
  if (!state.first_seen) state.first_seen = new Date().toISOString();

  function save(){
    state.last_interaction = new Date().toISOString();
    state.interactions++;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){}
  }

  // ─── INSIGHTS (basierend auf echten Daten + Schwächen→Stärken-Reframe) ──
  function buildInsights(){
    var today = new Date();
    var dhdl = new Date(WB.dhdl_casting);
    var daysSinceDHDL = Math.floor((today - dhdl) / 86400000);

    var pool = [
      // STÄRKEN-FRAMING — Schwächen umgekehrt
      { type:'reframe', text:'0 Follower? Das ist 0 Schulden. 30 Tage Content fertig + 1 Boot-Foto = Cold-Start in 14 Tagen auf 1.000+.', tag:'sichtbarkeit' },
      { type:'reframe', text:'Solo-Founder = 100% Entscheidungs-Speed + saubere Cap Table. Investoren lieben das (95/5-Struktur ist klar).', tag:'team' },
      { type:'reframe', text:'Glide-App kein IP-Moat? Stimmt — aber WIPO DM/248323 (Hausboot-Aufbauten EU+CH) IST dein echter Moat. Lizenzgeschäft baut darauf auf.', tag:'ip' },
      { type:'reframe', text:'Kein Umsatz heute. Aber: Pilot 2026 dokumentiert jeden Tag = aus "1,54 M€ ambitioniert" wird "vertretbar". Jeder Betriebstag ist Pitchdeck-Asset.', tag:'finanzen' },
      { type:'reframe', text:'59% des Jahres ist saisonal "frei" — also 215 Tage Systembau, Franchise-Drafts, Club-Programm, Winter-Konzept (Glühwein/Brunch/Jazz).', tag:'saison' },

      // ECHTER DAILY-FOKUS (rotierend, basierend auf Datenstand)
      { type:'focus',  text:'LIEGEPLATZ WOLZIG fixieren — das ist der einzige echte operative Blocker. 1 Anruf, 1 E-Mail.', tag:'blocker', priority:'P0' },
      { type:'focus',  text:'1 echtes Boot-Foto diesem Wochenende → Instagram. 0→1 Follower-Drama beenden.', tag:'sichtbarkeit', priority:'P0' },
      { type:'focus',  text:'DHDL Callback (Casting 02.12.25): 48h-Readiness halten. Cap Table aufgeräumt? Marcus/Hortencia raus dokumentiert?', tag:'dhdl', priority:'P1' },
      { type:'focus',  text:'WFB-Förderung 25k€ — Call 13.05.2026 (vergangen). Status checken: Bewilligt? Nachfassen?', tag:'foerderung', priority:'P1' },
      { type:'focus',  text:'David Deli Phantom-Status klären — 3% sind viel ohne klare Gegenleistung. Vor Investorengespräch sauber dokumentieren.', tag:'cap-table', priority:'P1' },
      { type:'focus',  text:'BunBo/Aquare Demo-App fertigstellen — B2B-SaaS-Story ist dein 8. Geschäftsmodell. ROI größer als Boot allein.', tag:'tech', priority:'P2' },

      // STRATEGISCHE INSIGHTS
      { type:'strat',  text:'Bell Food Group + Wave Bite ist KEIN Konflikt — Bell sieht dich als gastronomischen Profi, du baust am Wochenende. Sag das offen wenn relevant.', tag:'bell' },
      { type:'strat',  text:'8 Geschäftsmodelle = 8 Hebel. Wenn 1 stockt, 7 weiter. Diversifikation ist deine Resilienz.', tag:'strategie' },
      { type:'strat',  text:'CH-Holding + DE-GmbH: kluge Konstruktion. IP geschützt, operativ flexibel, steuerlich optimiert. Investoren-tauglich.', tag:'struktur' },

      // EMOTIONAL/MOTIVATION (ehrlich, nicht plattitudinär)
      { type:'mood',   text:'Du hast BlueWaterBBQ → DKD → Wave Bite gebaut. 3 Iterationen mit echtem Lernen. Das ist Founder-DNA.', tag:'pride' },
      { type:'mood',   text:'Heute keine Einnahmen, in 18 Monaten möglich 50-80k€ dokumentiert. Der Schritt vom "Konzept" zu "Beweis" passiert in dieser Saison.', tag:'momentum' }
    ];

    // Mische und nimm 5 für heute
    var seed = today.getFullYear()*1000 + today.getMonth()*40 + today.getDate();
    var shuffled = pool.slice().sort(function(a,b){
      return ((seed * (a.text.length+1)) % 97) - ((seed * (b.text.length+1)) % 97);
    });
    return shuffled.slice(0, 6);
  }

  // ─── HEUTIGES DAILY FOKUS ───────────────────────────────────────────────
  function dailyFocus(){
    var today = new Date().toISOString().split('T')[0];
    if (state.daily_focus_date !== today) {
      var insights = buildInsights();
      var focus = insights.filter(function(i){ return i.type==='focus' && i.priority==='P0'; })[0]
               || insights.filter(function(i){ return i.type==='focus'; })[0]
               || insights[0];
      state.daily_focus = focus ? focus.text : 'Heute: 1 echte Aktion die dich näher an den ersten Umsatz bringt.';
      state.daily_focus_date = today;
      save();
    }
    return state.daily_focus;
  }

  // ─── GREETING (zeit-abhängig) ────────────────────────────────────────────
  function greeting(){
    var h = new Date().getHours();
    var greet = h < 5 ? 'Noch wach, Carsten?'
              : h < 11 ? 'Guten Morgen, Carsten.'
              : h < 14 ? 'Mittagsupdate, Carsten.'
              : h < 18 ? 'Nachmittag, Carsten.'
              : h < 22 ? 'Guten Abend, Carsten.'
              :          'Spät noch dran?';
    var sub = state.interactions < 3
      ? 'Ich bin WAVA — deine Co-Pilotin. Ich kenne deine Zahlen, deine Verträge, deinen Plan. Stell mir nichts vor — ich frage dich.'
      : 'Tag #' + Math.max(1, Math.floor((Date.now() - new Date(state.first_seen).getTime())/86400000)) + ' zusammen. Bereit?';
    return { greet: greet, sub: sub };
  }

  // ─── AVATAR + PANEL UI ──────────────────────────────────────────────────
  function injectUI(){
    if (document.getElementById('wava-avatar')) return;
    var css = document.createElement('style');
    css.textContent = '\
#wava-avatar{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#a366ff 0%,#00d4ff 70%,#00d4aa 100%);box-shadow:0 8px 32px rgba(163,102,255,0.35),0 0 0 2px rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:99980;font-size:24px;transition:transform .2s ease;animation:wavaPulse 4s ease-in-out infinite}\
#wava-avatar:hover{transform:scale(1.08)}\
@keyframes wavaPulse{0%,100%{box-shadow:0 8px 32px rgba(163,102,255,.35),0 0 0 2px rgba(255,255,255,.06)}50%{box-shadow:0 8px 40px rgba(0,212,255,.55),0 0 0 4px rgba(163,102,255,.18)}}\
#wava-badge{position:absolute;top:-4px;right:-4px;background:#ff4757;color:#fff;font-size:9px;font-weight:800;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #040810;letter-spacing:0}\
#wava-panel{position:fixed;bottom:90px;right:20px;width:380px;max-width:calc(100vw - 40px);max-height:70vh;background:linear-gradient(135deg,rgba(8,16,32,0.98),rgba(16,8,32,0.98));border:1px solid rgba(163,102,255,0.35);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 80px rgba(163,102,255,0.15);z-index:99979;display:none;flex-direction:column;backdrop-filter:blur(20px);overflow:hidden;font-family:-apple-system,"SF Pro Display","Segoe UI",sans-serif}\
#wava-panel.open{display:flex;animation:wavaSlide .35s cubic-bezier(.2,.9,.3,1.2)}\
@keyframes wavaSlide{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}\
.wava-head{padding:14px 16px;background:linear-gradient(135deg,rgba(163,102,255,.18),rgba(0,212,255,.08));border-bottom:1px solid rgba(163,102,255,.2);display:flex;align-items:center;gap:10px}\
.wava-head-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#a366ff,#00d4ff);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}\
.wava-head-text{flex:1;min-width:0}\
.wava-name{font-size:13px;font-weight:800;color:#fff;letter-spacing:.04em}\
.wava-tag{font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.06em;margin-top:1px}\
.wava-close{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:18px;padding:4px 8px}\
.wava-close:hover{color:#fff}\
.wava-body{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px}\
.wava-body::-webkit-scrollbar{width:4px}\
.wava-body::-webkit-scrollbar-thumb{background:rgba(163,102,255,.3);border-radius:2px}\
.wava-greet{font-size:13px;color:#fff;line-height:1.55;font-weight:600}\
.wava-greet-sub{font-size:11px;color:rgba(255,255,255,.55);line-height:1.5;margin-top:6px;font-weight:400}\
.wava-focus{background:linear-gradient(135deg,rgba(255,71,87,.12),rgba(255,170,0,.06));border:1px solid rgba(255,71,87,.3);border-radius:10px;padding:10px 12px;margin-top:4px}\
.wava-focus-label{font-size:9px;color:#ff6b7a;font-weight:800;letter-spacing:.15em;margin-bottom:4px}\
.wava-focus-text{font-size:12px;color:#fff;line-height:1.45;font-weight:600}\
.wava-insight{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:9px;padding:8px 11px;font-size:11px;color:rgba(255,255,255,.78);line-height:1.5}\
.wava-insight-tag{display:inline-block;font-size:8px;font-weight:800;letter-spacing:.1em;padding:1px 5px;border-radius:3px;margin-right:6px;text-transform:uppercase}\
.wava-tag-reframe{background:rgba(0,212,170,.15);color:#00d4aa}\
.wava-tag-strat{background:rgba(0,212,255,.15);color:#00d4ff}\
.wava-tag-mood{background:rgba(163,102,255,.15);color:#a366ff}\
.wava-tag-focus{background:rgba(255,71,87,.15);color:#ff6b7a}\
.wava-foot{padding:10px 14px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:8px;background:rgba(0,0,0,.2)}\
.wava-foot-btn{flex:1;background:rgba(163,102,255,.1);border:1px solid rgba(163,102,255,.25);border-radius:7px;color:#e8edf5;font-size:10px;font-weight:700;padding:7px 8px;cursor:pointer;letter-spacing:.04em}\
.wava-foot-btn:hover{background:rgba(163,102,255,.2)}\
.wava-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;padding:6px 0}\
.wava-stat{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:7px;padding:7px 9px}\
.wava-stat-val{font-size:14px;font-weight:800;color:#fff}\
.wava-stat-label{font-size:9px;color:rgba(255,255,255,.45);letter-spacing:.06em;margin-top:1px;text-transform:uppercase}\
@media(max-width:600px){#wava-panel{right:10px;bottom:80px;width:calc(100vw - 20px)}}\
';
    document.head.appendChild(css);

    var avatar = document.createElement('div');
    avatar.id = 'wava-avatar';
    avatar.title = 'WAVA — Wave Vision Assistant';
    avatar.innerHTML = '<span style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">🧜🏻‍♀️</span><span id="wava-badge" style="display:none">1</span>';
    document.body.appendChild(avatar);

    var panel = document.createElement('div');
    panel.id = 'wava-panel';
    panel.innerHTML = '\
<div class="wava-head">\
  <div class="wava-head-av">🧜🏻‍♀️</div>\
  <div class="wava-head-text"><div class="wava-name">WAVA</div><div class="wava-tag">Wave Vision Assistant · Co-Pilot</div></div>\
  <button class="wava-close" onclick="WAVA.toggle()">✕</button>\
</div>\
<div class="wava-body" id="wava-body"></div>\
<div class="wava-foot">\
  <button class="wava-foot-btn" onclick="WAVA.refresh()">⟳ NEU</button>\
  <button class="wava-foot-btn" onclick="WAVA.note()">+ NOTIZ</button>\
  <button class="wava-foot-btn" onclick="WAVA.brief()">📋 BRIEFING</button>\
</div>';
    document.body.appendChild(panel);

    avatar.onclick = function(){ window.WAVA.toggle(); };
  }

  function render(){
    var body = document.getElementById('wava-body');
    if (!body) return;
    var g = greeting();
    var focus = dailyFocus();
    var insights = buildInsights().filter(function(i){ return i.type !== 'focus'; }).slice(0,4);

    var html = '<div class="wava-greet">' + g.greet + '<div class="wava-greet-sub">' + g.sub + '</div></div>';
    html += '<div class="wava-focus"><div class="wava-focus-label">⚡ HEUTE</div><div class="wava-focus-text">' + focus + '</div></div>';

    // Stats
    html += '<div class="wava-stats">' +
      '<div class="wava-stat"><div class="wava-stat-val">95/5</div><div class="wava-stat-label">Cap Table % (du/Marcus)</div></div>' +
      '<div class="wava-stat"><div class="wava-stat-val">€450k</div><div class="wava-stat-label">Funding-Ziel Pilot</div></div>' +
      '<div class="wava-stat"><div class="wava-stat-val">€50k</div><div class="wava-stat-label">EK eingelegt</div></div>' +
      '<div class="wava-stat"><div class="wava-stat-val">5</div><div class="wava-stat-label">LOIs · 5 Verträge final</div></div>' +
    '</div>';

    insights.forEach(function(i){
      var tagClass = 'wava-tag-' + (i.type === 'reframe' ? 'reframe' : i.type === 'strat' ? 'strat' : i.type === 'mood' ? 'mood' : 'focus');
      html += '<div class="wava-insight"><span class="wava-insight-tag ' + tagClass + '">' + (i.tag||i.type) + '</span>' + i.text + '</div>';
    });

    if (state.memory_notes.length > 0) {
      html += '<div style="font-size:9px;color:rgba(255,255,255,.4);letter-spacing:.1em;margin-top:8px;font-weight:700">DEINE LETZTEN NOTIZEN</div>';
      state.memory_notes.slice(-3).reverse().forEach(function(n){
        html += '<div class="wava-insight" style="border-left:2px solid #a366ff"><span style="font-size:9px;color:rgba(255,255,255,.4)">' + n.date + '</span><br>' + n.text + '</div>';
      });
    }

    body.innerHTML = html;
  }

  // ─── PUBLIC API ──────────────────────────────────────────────────────────
  window.WAVA = {
    state: state,
    facts: WB,
    insights: buildInsights,
    focus: dailyFocus,
    open: function(){
      var p = document.getElementById('wava-panel');
      if (p) { p.classList.add('open'); state.panel_open = true; render(); save(); }
      var b = document.getElementById('wava-badge'); if (b) b.style.display = 'none';
    },
    close: function(){
      var p = document.getElementById('wava-panel');
      if (p) { p.classList.remove('open'); state.panel_open = false; save(); }
    },
    toggle: function(){ state.panel_open ? this.close() : this.open(); },
    refresh: function(){ render(); },
    note: function(){
      var n = prompt('WAVA · Was willst du dir merken? (Idee · Lernpunkt · Blocker · Win)');
      if (n && n.trim()) {
        state.memory_notes.push({ date: new Date().toISOString().slice(0,10), text: n.trim() });
        save();
        render();
      }
    },
    brief: function(){
      var url = (localStorage.getItem('ceo_master_bridge_url') || '') + '?action=briefing';
      window.open(url, '_blank', 'noopener');
    }
  };

  // ─── AUTO-INIT ───────────────────────────────────────────────────────────
  function init(){
    injectUI();
    save();
    // Badge nach 8s zeigen falls Panel zu — sanfter Anstoß
    setTimeout(function(){
      if (!state.panel_open) {
        var b = document.getElementById('wava-badge');
        if (b) b.style.display = 'flex';
      }
    }, 8000);
    // Daily-Focus präparieren
    dailyFocus();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 300);

})();
