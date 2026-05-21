/* ============================================================
   LUCY — CEO Co-Pilotin Wave Bite
   Version 4.0 · 2026-05-21 (vorher: Samantha → Lucy-Identität)
   Inspired by "Lucy" (2014) · 100% cerebral capacity
   Persönlichkeit: brillant · präzise · strategisch · CEO-Augenhöhe ·
   sieht Zusammenhänge, die andere übersehen · liebevoll-direkt ·
   2 Schritte voraus · niemals oberflächlich
   v4: Lucy-Identität · USS Enterprise Hero · 14 Actions · Mail-Triage v2
   ============================================================ */
(function(){
  'use strict';
  if (window.SAMANTHA_LOADED) return;
  window.SAMANTHA_LOADED = true;

  // -------- SERVICE-WORKER AUTO-KILL (verhindert Cache-Probleme) ---------
  (async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) {
          // Behalte nur explizit erlaubte SW (z.B. eigene PWA falls vorhanden)
          await r.unregister();
        }
        if (regs.length) console.log('🧹 Samantha: '+regs.length+' alte Service-Worker entfernt');
      }
      if (window.caches) {
        const keys = await caches.keys();
        for (const k of keys) if (/wava|cache-v1|workbox/i.test(k)) await caches.delete(k);
      }
    } catch(e) { /* silent */ }
  })();

  // -------- STATE & MEMORY -------------------------------------------------
  const LSK = 'samantha_state_v1';
  const NOTES_KEY = 'samantha_notes_v1';
  const LEARN_KEY = 'samantha_learnings_v1';
  const TASKS_KEY = 'samantha_tasks_v1';
  const CHAT_KEY = 'samantha_chat_v1';
  const CACHE_KEY = 'samantha_bridge_cache_v1';

  const state = JSON.parse(localStorage.getItem(LSK) || '{}');
  state.openedAt = Date.now();
  state.sessionCount = (state.sessionCount || 0) + 1;
  state.lastSeen = new Date().toISOString();
  localStorage.setItem(LSK, JSON.stringify(state));

  function loadJSON(key, def){ try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(def))}catch(_){return def} }
  function saveJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)) }

  // -------- WAVE-BITE-WISSENSBASIS (verifiziert aus 26 Originalen) ---------
  const FACTS = {
    brand_evolution: 'BlueWaterBBQ (2022/23) → Deli Kost Deluxe (09-10/2025) → Wave Bite (seit 11/2025, final)',
    founder: 'Carsten Voigt — Solo-Founder, Hauptstrasse 23, 4242 Laufen BL, Küchenchef, 25 J. Gastro',
    cap_table: 'Carsten 95% · Marcus Börner 5% (SHA §12: voll vested, KEIN Vesting/Clawback)',
    drag_along: '75%',
    eigenkapital: 50_000, funding_ziel: 450_000, bankdarlehen: 350_000,
    fixkosten_pa: 125_000, burn_monat: 10_400,
    bruttomarge: 0.71, bruttomarge_rabatt: 0.678,
    avg_warenkorb: 15.00, db_pro_verkauf: 11.55,
    break_even_verkaeufe_jahr: 10_820, break_even_tag: 72, saisontage: 150,
    pre_money: 1_500_000,
    dhdl: '200k€ für 13% (1,54 M€ Pre-Money)',
    forecast: { J1:250_000, J1_konservativ:180_000, J2:415_000, J3:670_000 },
    ebitda: { J1:93_650, J2:191_866, J3:363_964 },
    boot: '14m × 4,85m Solar-Hybrid · 2×15 kW E-Motoren · PV+Batterie · Hubdach',
    reviere: 'Müggelsee · Krossinsee · Wolzig · Teupitz',
    standort_2: 'Usedom (innerhalb 3 J.)',
    wipo: 'DM/248323 EU+CH "Aufbauten für Hausboote" · 21.07.2025',
    apps: 'BunBo Glide · Wave Bite L1 · Wasserlage GitHub · QR-Bridge 310 Spots',
    bell_food: 'Carsten weiterhin Vollzeit Bell Food (Asset, kein Konflikt, FCB-Grilltrucks)',
    therapie: 'Pia Schülin · Praxis zum Falken, Basel · DI-Termine pausiert · Sonderr-Termine: Do 21.05.2026 14:30 + Mi 28.05.2026 13:30 (E-Mail 19.05.)',
    wfb_call: 'Heiko Schmidt WFB · Folge-Call 01.06.2026 14:00 Microsoft Teams (Einladung raus 19.05.)',
    roka: 'Frank Burggraf · ROKA Werk · Gespräch 20.05. gelaufen — Anhänge gesendet · Follow-up offen',
    sozialhilfe: 'ZSozTH (Frau M. Mohan, m.mohan@zsth.ch) — Status nachfassen'
  };

  // -------- DOKUMENTEN-INDEX -----------------------------------------------
  const DOCS = [
    { id:'faktenbuch', name:'🌊 Wave Bite Faktenbuch (Master-Referenz)', file:'WAVE_BITE_FAKTENBUCH_2026-05-21.md', cat:'Master', tags:['master','fakten'], date:'21.05.2026', importance:5 },
    { id:'sha', name:'Master SHA Holding AG', file:'finale/sha_master.pdf', cat:'Verträge', tags:['sha','holding','cap table'], date:'22.03.2026', importance:5 },
    { id:'cofounder', name:'Co-Founder Agreement Marcus Börner', file:'finale/cofounder_marcus.pdf', cat:'Verträge', tags:['marcus','5%','vesting'], date:'23.03.2026', importance:5 },
    { id:'phantom', name:'David Deli Phantom Shares', file:'finale/phantom_david.pdf', cat:'Verträge', tags:['phantom','david'], date:'03.01.2026', importance:5 },
    { id:'lizenz', name:'Management-/Lizenzvertrag Holding↔GmbH', file:'finale/lizenz_holding_gmbh.pdf', cat:'Verträge', tags:['lizenz'], date:'22.03.2026', importance:4 },
    { id:'governance', name:'Governance Holding', file:'finale/governance_holding_v2.pdf', cat:'Verträge', tags:['governance'], date:'23.03.2026', importance:4 },
    { id:'vertragslandkarte', name:'Vertragslandkarte', file:'finale/vertragslandkarte.pdf', cat:'Verträge', tags:['übersicht'], date:'02.01.2026', importance:3 },
    { id:'investor_op', name:'Investor Onepager', file:'finale/investor_onepager_v2.pdf', cat:'Pitch', tags:['investor','pitch'], date:'10.03.2026', importance:5 },
    { id:'onepager', name:'Wave Bite Onepager', file:'finale/onepager_v2.pdf', cat:'Pitch', tags:['onepager'], date:'10.03.2026', importance:4 },
    { id:'foerderlogik', name:'Förderlogik Onepager', file:'finale/foerderlogik_onepager.pdf', cat:'Pitch', tags:['förderung'], date:'23.03.2026', importance:4 },
    { id:'bp03', name:'Businessplan 03/2026', file:'finale/businessplan_03_26.pdf', cat:'Pitch', tags:['bp','final'], date:'10.03.2026', importance:5 },
    { id:'bp01', name:'Businessplan 01/2026 (alt)', file:'finale/businessplan_01_26.pdf', cat:'Pitch', tags:['bp','alt'], date:'06.01.2026', importance:2 },
    { id:'loi_hug', name:'LOI Hugentobler — Küchentechnik', file:'finale/loi_hugentobler.pdf', cat:'LOIs', tags:['loi'], date:'27.03.2026', importance:5 },
    { id:'loi_rad', name:'LOI Radeberger — Getränke', file:'finale/loi_radeberger.pdf', cat:'LOIs', tags:['loi'], date:'27.03.2026', importance:5 },
    { id:'loi_tra', name:'LOI Transgourmet — bis 10k€', file:'finale/loi_transgourmet.pdf', cat:'LOIs', tags:['loi','10000'], date:'27.03.2026', importance:5 },
    { id:'loi_tv', name:'LOI TV Dahme-Seenland', file:'finale/loi_tv_dahme.pdf', cat:'LOIs', tags:['loi','tourismus'], date:'15.04.2026', importance:4 },
    { id:'gifthuettli', name:'Referenz Gifthüttli', file:'finale/referenz_gifthuettli.pdf', cat:'LOIs', tags:['referenz'], date:'12.04.2026', importance:3 },
    { id:'event_strat', name:'Event Strategie Dossier', file:'finale/event_strategie.pdf', cat:'Operations', tags:['events'], date:'20.11.2025', importance:4 },
    { id:'club', name:'Wave Bite Club Programm', file:'finale/club_programm.pdf', cat:'Operations', tags:['club'], date:'20.11.2025', importance:4 },
    { id:'material', name:'Geräte- & Materialbedarf', file:'finale/material_bedarf.pdf', cat:'Operations', tags:['capex'], date:'01.12.2025', importance:3 },
    { id:'kalk', name:'Angebot & Kalkulationen', file:'finale/angebot_kalkulation.pdf', cat:'Operations', tags:['kalkulation'], date:'01.12.2025', importance:4 },
    { id:'angebot_v1', name:'Wave Bite Angebot V1', file:'finale/angebot_v1.pdf', cat:'Operations', tags:['angebot'], date:'29.11.2025', importance:2 },
    { id:'dienstplan', name:'Dienstplan 4 Wochen', file:'finale/dienstplan.pdf', cat:'Operations', tags:['team'], date:'07.01.2026', importance:2 },
    { id:'wipo', name:'WIPO Design DM/248323', file:'finale/wipo_design_248323.pdf', cat:'IP', tags:['wipo','ip'], date:'21.07.2025', importance:5 },
    { id:'ag_anmeld', name:'AG Anmeldung (CH)', file:'finale/ag_anmeldung.pdf', cat:'IP', tags:['ag','schweiz'], date:'10.2025', importance:3 },
    { id:'umfrage2', name:'Umfrage V2', file:'finale/umfrage_v2.pdf', cat:'Research', tags:['markt'], date:'21.01.2026', importance:3 },
    { id:'umfrage1', name:'Umfrage V1', file:'finale/umfrage_v1.pdf', cat:'Research', tags:['markt'], date:'21.01.2026', importance:2 },
    { id:'b2b_wasser', name:'📋 B2B-Wasserlage-Liste (64 DACH-Kontakte)', file:'wasserlage_b2b_64_dach.pdf', cat:'Marketing', tags:['b2b','wasserlage','64','dach','marinas'], date:'17.04.2026', importance:5 },
    { id:'briefing', name:'CEO Briefing 22.04.2026 (Snapshot)', file:'ceo_briefing_22.04.pdf', cat:'Master', tags:['briefing'], date:'22.04.2026', importance:3 }
  ];

  // -------- PLUGIN-BIBLIOTHEK (alle bekannten Skills im System) ------------
  const PLUGINS = {
    'pdf-viewer': { icon:'📄', skills:['annotate','fill-form','open','sign','view-pdf'], use:'Verträge unterschreiben (SHA, LOIs), Formulare ausfüllen, Annotationen' },
    'adobe-creative': { icon:'🎨', skills:['batch-edit-photos','create-social-variations','edit-quick-cut','design-from-template','resize-photos-videos','retouch-portraits'], use:'Marketing-Material: Social-Posts, Flyer, Sizzle-Reel für DHDL-Demo' },
    'small-business': { icon:'💼', skills:['business-pulse','call-list','cash-flow-snapshot','close-month','content-strategy','contract-review','crm-cleanup','customer-pulse','handle-complaint','invoice-chase','lead-triage','margin-analyzer','monday-brief','plan-payroll','price-check','quarterly-review','run-campaign','sales-brief','tax-prep','ticket-deflector','smb-router'], use:'Operativer SMB-Modus: Cashflow, Margin, Leads, Steuern' },
    'bigdata': { icon:'📊', skills:['catalyst-monitor','company-brief','country-analysis','country-sector-analysis','cross-sector','earnings-digest','earnings-preview','earnings-quality-screen','earnings-reaction','g7-comparison','investment-memo','moat-governance-review','peer-comparables','quick-take','regional-comparison','risk-assessment','scenario-analysis','sector-analysis','sector-playbook','thematic-research','valuation-snapshot','variant-perception','financial-research-analyst'], use:'Investor-Research: Sektor-Analyse mobile Gastro, Bewertungs-Benchmarks' },
    'daloopa': { icon:'📈', skills:['build-model','bull-bear','comp-sheet','dcf','earnings','ib-deck','industry','tearsheet','unit-economics','working-capital','research-note'], use:'Investor-Finanzmodelle: DCF, Comp-Sheet, IB-Deck für DHDL/WFB' },
    'brand-voice': { icon:'🗣️', skills:['discover-brand','enforce-voice','generate-guidelines','brand-voice-enforcement','guideline-generation'], use:'Wave-Bite-Markensprache: konsistent in allen LinkedIn-Posts, Mails, Pitch' },
    'marketing': { icon:'📣', skills:['brand-review','campaign-plan','content-creation','performance-report','draft-content','competitive-brief','email-sequence','seo-audit'], use:'Wasserlage-B2B-Kampagne, DHDL-Awareness, SEO wave-bite.com' },
    'sales': { icon:'💰', skills:['account-research','call-prep','call-summary','competitive-intelligence','daily-briefing','draft-outreach','forecast','pipeline-review','create-an-asset'], use:'Investor-Outreach, WFB-Call-Prep, Sponsor-Pipeline' },
    'legal': { icon:'⚖️', skills:['brief','legal-response','meeting-briefing','legal-risk-assessment','compliance-check','review-contract','triage-nda','vendor-check','signature-request'], use:'SHA-Review, NDA-Triage, DSGVO-Check für Wasserlage-Mailing' },
    'finance': { icon:'💵', skills:['audit-support','close-management','financial-statements','journal-entry','reconciliation','variance-analysis','sox-testing'], use:'Buchhaltung Holding↔GmbH, Variance vs. BP, Monatsabschluss' },
    'product-management': { icon:'🎯', skills:['brainstorm','competitive-brief','product-brainstorming','metrics-review','roadmap-update','sprint-planning','stakeholder-update','synthesize-research','write-spec'], use:'BunBo/Aquare Roadmap, App-Sprints, Investor-Updates' },
    'engineering': { icon:'⚙️', skills:['architecture','code-review','debug','deploy-checklist','documentation','incident-response','standup','system-design','tech-debt','testing-strategy'], use:'Apps Script, Wasserlage-Code, CEO Office Wartung' },
    'figma': { icon:'🖌️', skills:['create-new-file','code-connect','generate-design','generate-diagram','generate-library','use-figma'], use:'Pitch-Deck Updates, Wave Bite Branding-System' },
    'enterprise-search': { icon:'🔍', skills:['search','digest','knowledge-synthesis','search-strategy','source-management'], use:'Cross-System Suche: Mails+Drive+Notion+Asana' },
    'design': { icon:'🎨', skills:['design-handoff','accessibility-review','design-critique','research-synthesis','design-system','ux-copy','user-research'], use:'BunBo UI Critique, Wave Bite Design-System' },
    'operations': { icon:'⚡', skills:['capacity-plan','change-request','compliance-tracking','process-doc','process-optimization','risk-assessment','runbook','status-report','vendor-review'], use:'Risiko-Matrix, SOPs für Saisonstart, Vendor-Reviews' },
    'data': { icon:'📊', skills:['analyze','create-viz','build-dashboard','data-context-extractor','sql-queries','statistical-analysis','validate-data','write-query','explore-data','data-visualization'], use:'GA4-Datenanalyse, Wasserlage-KPIs, QR-Scan-Stats' },
    'adspirer': { icon:'🎯', skills:['campaign-performance','keyword-research','ad-campaign-best-practices'], use:'Google/Meta-Ads für Wave Bite Awareness' },
    'brightdata': { icon:'🌐', skills:['scrape','search','data-feeds','competitive-intel','seo-audit','scraper-builder','design-mirror'], use:'Wettbewerber-Recherche, SERP-Analyse, B2B-Anreicherung' },
    'postiz': { icon:'📅', skills:['postiz'], use:'Social-Media-Posts auf 28 Kanälen scheduled (LinkedIn, IG, FB, X)' },
    'zoom': { icon:'📞', skills:['build-zoom-bot','build-zoom-meeting-app','rest-api','rtms','scribe','team-chat','webhooks'], use:'Investor-Calls aufzeichnen, Auto-Transkripte' },
    'cowork': { icon:'🔧', skills:['cowork-plugin-customizer','create-cowork-plugin'], use:'Eigene Plugins bauen z.B. Wave-Bite-Plugin' },
    'productivity': { icon:'✅', skills:['start','update','task-management','memory-management'], use:'TASKS.md-Workflow, Working-Memory CLAUDE.md' }
  };

  // -------- ACTIONS — ECHTE WORKFLOWS --------------------------------------
  const ACTIONS = [
    {
      id:'bob_antrag', icon:'💰', title:'ILB/BAB-Förderantrag vorbereiten',
      sub:'Brandenburg-Investitionsbank — Antragspaket aus Förderlogik-Onepager + BP 03/26',
      run: () => {
        const txt = `# ILB BRANDENBURG — FÖRDERANTRAG WAVE BITE\n\n**Stand:** ${new Date().toLocaleDateString('de-DE')}\n\n## 1. Projektkern (aus Förderlogik-Onepager)\nWave Bite ist eine kombinierte Plattform aus schwimmender Premium-Gastronomie, Eventbetrieb und digitaler App-Infrastruktur mit Skalierungspotenzial (Franchise & Plattformmodell).\n\n## 2. Investitionsstruktur (Pilot 450.000 €)\n- Plattform, Ausbau & Technik: 250.000 €\n- Gastrogeräte & Ausstattung: 150.000 €\n- Marketing & Pre-Opening: 20.000 €\n- Liquidität & Reserven: 30.000 €\n\n## 3. Förderfähige Module\n- [x] Boot & Infrastruktur (Technik, Sicherheit, Energie PV)\n- [x] Gastronomie & Betrieb (Geräte, Küche)\n- [x] Digitalisierung (App, Systeme, Plattform)\n- [x] Marketing & Tourismusintegration\n- [x] Nachhaltigkeit & Energie (PV, Batterie)\n\n## 4. Wirtschaftliche Basis (verifiziert BP 03/26)\n- Ø Bruttomarge: **71%** (67,8% nach Club-Rabatt)\n- Tagesumsatz Plan: ~1.500 €\n- Ziel Jahr 1: **250.000 €** (Investor-Pitch) bzw. 180.000 € konservativ\n- EBITDA J1: 93.650 € · J2: 191.866 € · J3: 363.964 €\n- Break-Even: 72 Verkäufe/Tag · 10.820/Jahr auf 150 Saisontagen\n\n## 5. Rechtsstruktur\n- Wave Bite Holding AG (CH, Laufen BL) — 100% IP-Inhaberin\n- Wave Bite GmbH (DE, Flämingstr. 4, 15738 Zeuthen) — Antragsteller, operativ\n- Lizenzvertrag Holding↔GmbH (% vom Nettoumsatz + Mgmt Fee)\n\n## 6. WIPO-Designschutz\n- DM/248323 EU+CH "Aufbauten für Hausboote" — eingetragen 21.07.2025\n\n## 7. Partner-LOIs (unterzeichnet)\n- Hugentobler (Küchentechnik)\n- Radeberger Gruppe (Getränke-Sachsponsoring)\n- Transgourmet (bis 10.000 € finanziell + Versorgung)\n- TV Dahme-Seenland (Tourismus-Stellungnahme)\n- Gifthüttli (Referenz)\n\n## 8. Eigenmittel & Gesellschafterkapital\n- Eigenkapital eingelegt: 50.000 €\n- Founder: Carsten Voigt 95% + Marcus Börner 5% (voll vested)\n- Plus Bankdarlehen geplant: 350.000 € @ 5% / 5 J = 6.737 €/Monat\n\n## 9. Förderpfad-Kombination (Strategie)\n- ILB (Investitionsförderung Land Brandenburg)\n- BAB Brandenburg (Bürgschaftsbank, falls 350k€-Darlehen)\n- Digitalisierungs-/Plattformförderung\n- Energie & Nachhaltigkeit (PV/Batterie)\n- Regionale Tourismusförderung (TV Dahme-LOI verknüpfen)\n- Optional: BAFA-Beratung (Strukturvorbereitung)\n\n## 10. Offene Klärungspunkte für ILB-Termin\n- [ ] Konkretes ILB-Programm-Mapping (Förderquote je Modul)\n- [ ] Antragspfad & Zeitachse (Frühjahr 2026 vs. Q3)\n- [ ] Sicherheitenanforderungen (Bürgschaftsbank?)\n- [ ] Risiken bei Ablehnung — Plan B (HTGF? Bank only?)\n- [ ] Schnittstelle zu WFB Brandenburg 25k€ (Heiko Schmidt)\n\n## 11. Nächste Schritte\n- [ ] ILB-Erstgespräch-Termin buchen (förderbank-brandenburg.de)\n- [ ] Termin Heiko Schmidt WFB (Status 13.05. Call)\n- [ ] BP 03/26 + Investor-Onepager als Anlage vorbereiten\n- [ ] Förderlogik-Onepager finalisieren\n- [ ] Falls erforderlich: BAB-Bürgschaftsantrag parallel\n\n---\n*Auto-generiert von Samantha aus Förderlogik-Onepager + BP 03/26 + LOI-Bestand.*`;
        const blob = new Blob([txt], {type:'text/markdown'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'ILB_BAB_Foerderantrag_Wave_Bite_'+new Date().toISOString().slice(0,10)+'.md';
        a.click(); setTimeout(()=>URL.revokeObjectURL(url), 5000);
        addNote('ILB/BAB-Förderantrag vorbereitet (Download .md). Nächster Schritt: ILB-Termin buchen.');
        return 'Antragspaket erstellt — heruntergeladen als .md. Öffnet sich in jedem Editor. Nächster Schritt: ILB-Erstgespräch buchen.';
      }
    },
    {
      id:'b2b_wasserlage', icon:'📧', title:'B2B-Wasserlage-Kampagne starten (64 DACH-Kontakte)',
      sub:'Marinas + Yachtclubs + Bootsschulen + Werften aus DE/AT/CH — rechtskonform mit Einwilligung',
      run: () => {
        window.open('docs/wasserlage_b2b_64_dach.pdf', '_blank');
        const mail = `Betreff: Kostenlose Wasser- & Pegelinfos für Ihre Mitglieder/Gäste — Wave Bite Wasserlage\n\nGuten Tag,\n\nich bin Carsten Voigt, Founder von Wave Bite. Wir betreiben seit 2025 eine offene Wasserlage-Plattform (https://voigtcarsten4-rgb.github.io/wasserlage), die Live-Pegelstände, ELWIS-Hinweise und Revierinformationen für Berlin-Brandenburg bündelt — und derzeit auf den DACH-Raum erweitert wird.\n\nDa [Marina/Club/Schule-Name] direkt am Wasser arbeitet, würde ich gerne ein kurzes Feedback einholen:\n• Wären Live-Pegel-/Reviewinfos für Ihre Mitglieder/Gäste relevant?\n• Hätten Sie Interesse, Ihren Standort als verifizierte Quelle zu hinterlegen?\n• Welche Datenpunkte fehlen Ihnen aktuell am häufigsten?\n\nDie Plattform ist und bleibt kostenlos. Ein Link auf Ihrer Website oder eine Erwähnung in Ihrem Newsletter würde uns helfen — im Gegenzug bauen wir gerne Ihre wichtigsten Spots prominent ein.\n\nFreue mich auf eine kurze Rückmeldung.\n\nHerzliche Grüße\nCarsten Voigt\nFounder, Wave Bite\ninfo@wave-bite.com · wave-bite.com\n\n---\n⚠️ Hinweis: Diese Mail wurde an eine öffentlich verfügbare Kontaktadresse Ihrer Organisation gesendet. Sollten Sie keine weitere Kommunikation wünschen, antworten Sie bitte mit "Bitte austragen".`;
        try { navigator.clipboard.writeText(mail); } catch(_){}
        addNote('B2B-Wasserlage-Kampagne gestartet: 64 Kontakte (24 DE / 20 AT / 20 CH). Mail-Vorlage in Zwischenablage. Rechtshinweis: §7 UWG = Einwilligung vor Versand prüfen.');
        return 'PDF geöffnet · Mail-Vorlage in Zwischenablage kopiert · Rechtshinweis: erst Einwilligung, dann Versand. Empfehlung: erste 5 Marinas persönlich anschreiben statt Massenversand.';
      }
    },
    {
      id:'wfb_followup', icon:'📞', title:'WFB Brandenburg — Status nachfassen (Heiko Schmidt)',
      sub:'Call lief am 13.05.2026 · 25k€-Förderung · Status checken',
      run: () => {
        const mail = `Betreff: Wave Bite — Anschluss an unser Gespräch vom 13.05.\n\nLieber Herr Schmidt,\n\nherzlichen Dank für unser Gespräch am 13.05. zu Wave Bite. Wie besprochen folgen hier kompakt die nächsten Punkte aus meiner Sicht:\n\n1) Förderpfad: Für die WFB-Förderung über 25.000 € warte ich auf Ihre Rückmeldung zu Programm-Mapping und Antragspfad. Gibt es bereits einen empfohlenen nächsten Schritt?\n\n2) Anlagen: Businessplan 03/2026, Investor-Onepager, Förderlogik-Onepager und alle 5 LOIs (Hugentobler, Radeberger, Transgourmet bis 10k€, TV Dahme, Gifthüttli) liegen bereit — auf Wunsch sende ich sie direkt.\n\n3) Stand: WIPO-Designschutz DM/248323 (EU+CH) eingetragen, Holding AG (CH) + GmbH (DE, Zeuthen) in Gründung. Cap Table sauber: Carsten 95% + Marcus Börner 5% (voll vested).\n\n4) Termin: Falls hilfreich, schlage ich für nächste Woche einen kurzen Folgetermin vor — z.B. Mi 27.05. oder Do 28.05. nachmittags.\n\nIch freue mich auf Ihre Rückmeldung.\n\nMit besten Grüßen\nCarsten Voigt\nWave Bite Holding AG i.Gr. + Wave Bite GmbH i.Gr.\ninfo@wave-bite.com`;
        try { navigator.clipboard.writeText(mail); } catch(_){}
        addNote('WFB-Follow-up an Heiko Schmidt vorbereitet (in Zwischenablage). Anhängen: BP 03/26 + Investor-Onepager + LOIs.');
        return 'Follow-up-Mail in Zwischenablage. Termin-Vorschläge Mi 27.05. / Do 28.05. Anhänge bereit: BP, Onepager, LOIs.';
      }
    },
    {
      id:'dhdl_prep', icon:'🦈', title:'DHDL Callback-Vorbereitung',
      sub:'200k€ für 13% · 90s-Demo-Video Müggelsee · Pitch üben',
      run: () => {
        const plan = `# DHDL CALLBACK-VORBEREITUNG\n\n## Pitch-Kern (60s)\n"Wave Bite ist Premium-Gastronomie auf Solar-Hybrid-Booten — und gleichzeitig die digitale Plattform für 2.000 Marinas, 2.300 Campingplätze und 2.000 Freibäder in Deutschland.\n\nWir kombinieren echte Marge (71% brutto) mit echtem Schutz (WIPO-Design DM/248323 EU+CH).\n\n5 LOIs (Radeberger, Transgourmet, Hugentobler, TV Dahme, Gifthüttli) und 3 Standorte unterzeichnet. Erste Saison 2026 mit Pilotboot, zweiter Standort Usedom in Vorbereitung.\n\nWir suchen 200.000 € für 13% — kombiniert mit 350k€ Bank und 50k€ Eigenkapital. Bewertung 1,54 M€."\n\n## Demo-Material\n- [ ] 90s-Video Müggelsee (Drohnenshot + Boot-Visualisierung + LOI-Fact-Card)\n- [ ] 1-Pager Investor (liegt in docs/finale/investor_onepager_v2.pdf)\n- [ ] WIPO-Designurkunde als Beweisstück (docs/finale/wipo_design_248323.pdf)\n- [ ] 3 Bratwürste + 3 Pulled-Pork-Burger im Studio (DB 71-79%)\n\n## Antworten auf erwartete Fragen\n**"Wer macht die Bratwurst, wenn du bei Bell arbeitest?"**\n→ Bell ist Asset (25 J. Gastro-Expertise + Cashflow während Aufbau). Erst kündigen wenn EK-Runde steht.\n\n**"Was, wenn der Liegeplatz Wolzig nicht kommt?"**\n→ 3 Alternativstandorte definiert (Müggelsee, Krossinsee, Teupitz). Stichtag 01.07.\n\n**"Warum nicht einfach Foodtruck?"**\n→ Boot = Premium-Positionierung + WIPO-Designschutz + B2B-Wasserlage als Pull-Marketing. Foodtruck ist commodity, Boot ist Brand.\n\n**"Wie skaliert das?"**\n→ Plattform-Layer (BunBo App + Wasserlage) für 2.000+ Standorte. Franchise V1 Aug 2026.\n\n**"Was ist mit Marcus 5%?"**\n→ SHA §12: voll vested, kein Vesting/Clawback. Marcus ist Bootsbau-Partner Jacko-Werft, fest drin.\n\n## Pre-Recording Checks\n- [ ] Investor-Pitch-Hosen rausgesucht\n- [ ] Bell-Logo entfernt von allen Marketing-Assets\n- [ ] info@wave-bite.com Auto-Responder geprüft\n- [ ] LinkedIn auf "Founder Wave Bite" gesetzt`;
        const blob = new Blob([plan], {type:'text/markdown'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'DHDL_Callback_Prep.md'; a.click();
        setTimeout(()=>URL.revokeObjectURL(url), 5000);
        return 'DHDL-Pitch-Prep heruntergeladen. 60s-Pitch geübt? Demo-Video Müggelsee fehlt noch — höchste Priorität.';
      }
    },
    {
      id:'notar_msa', icon:'⚖️', title:'Notar buchen — MSA Wave Bite AG (Termin 14.05. überfällig)',
      sub:'Kalendereintrag war 14.05. — Status checken',
      run: () => {
        addNote('Notar-Termin MSA Wave Bite AG: 14.05. Kalender-Eintrag war überfällig. Action: Notariat anrufen + Termin bestätigen oder neu setzen.');
        const recipe = `# NOTAR-BUCHUNG MSA WAVE BITE AG\n\n## Was wird beurkundet\nGründung Wave Bite Holding AG (CH, Laufen BL, Hauptstrasse 23) + ggf. Wave Bite GmbH (DE, Zeuthen).\n\n## Vorbereitung\n- [ ] Gesellschaftsvertrag/Statuten finalisiert (SHA + Articles)\n- [ ] Aktionärsbindungsvertrag (= Master SHA, liegt in docs/finale/sha_master.pdf)\n- [ ] Stammkapital 100.000 CHF (CH AG) — auf Sperrkonto eingezahlt\n- [ ] Domizil/Sitz: Hauptstrasse 23, 4242 Laufen BL\n- [ ] Verwaltungsrat: mind. 1 Person (Carsten als alleiniger VR?)\n- [ ] Revisionsstelle: opted out (kleines KMU) oder bestimmt\n- [ ] Geschäftszweck eintragsfähig formuliert (Premium-Floating-Gastro + IP + Lizensierung)\n\n## Notariat-Optionen Baselland\n- Notariat Laufen (lokal, kennt die Strukturen)\n- Notariat Basel-Stadt (höhere Kapazität)\n- Online-Beurkundung CH (eIDAS)\n\n## Nächste Schritte\n1. Notariat Laufen anrufen — Erstbuchung\n2. SHA + Statuten als PDF einsenden\n3. Stammkapital-Einzahlungsbeleg vorbereiten\n4. Termin innerhalb 2 Wochen anstreben`;
        try { navigator.clipboard.writeText(recipe); } catch(_){}
        return 'Notar-Recipe in Zwischenablage + Notiz erstellt. Schritt 1: Notariat Laufen anrufen.';
      }
    },
    {
      id:'social_post', icon:'📱', title:'LinkedIn-Post on-brand vorbereiten',
      sub:'Brand-Voice + DHDL-Awareness + Wave-Bite-Storytelling',
      run: () => {
        const post = `🌊 25 Jahre Küchenchef. Jetzt baue ich mein eigenes Restaurant — auf dem Wasser.\n\nWave Bite ist Premium-Gastro auf einem Solar-Hybrid-Boot, das in Müggelsee, Krossinsee und Wolzig startet. Bratwurst mit 80% DB. Cold-Brew mit 86%. Frühstücks-Bowls mit weißem Tischtuch. Und eine digitale Plattform, die irgendwann 2.000 Marinas in Deutschland verbindet.\n\n5 LOIs unterzeichnet (Radeberger, Transgourmet, Hugentobler, TV Dahme, Gifthüttli). WIPO-Design eingetragen (EU+CH). Holding AG (CH) + GmbH (DE) in Gründung.\n\n50k€ Eigenkapital drin. 450k€ Funding-Ziel. DHDL-Callback steht aus.\n\nWas mir am meisten fehlt: Marinas, Bootsschulen und Yachtclubs, die meine Wasserlage-Seite (live unter wasserlage.wave-bite.com) als Quelle teilen. Wer einen Standort am Wasser hat — schreibt mir.\n\n#waterfront #gastronomy #DHDL #startup #boatbusiness`;
        try { navigator.clipboard.writeText(post); } catch(_){}
        addNote('LinkedIn-Post vorbereitet (in Zwischenablage). Vor Posten: Bild aussuchen (Bootskizze oder echtes Foto), Tags prüfen.');
        return 'Post in Zwischenablage. Tipp: Posten Di/Do 09:30 für maximale Reichweite.';
      }
    },
    {
      id:'david_finalize', icon:'🤝', title:'David Deli — Phantom-Klausel finalisieren',
      sub:'Vertragslücke "[Inhalt einfügen]" schließen vor Investor-DD',
      run: () => {
        addNote('David Phantom-Vertrag: Vertragslücken in §2.x, §3.x, §4.x, §5.x, §6.x, §7.x füllen. Phantom-Höhe entscheiden: 2% / 3% / 5%? Migration DKD→Wave Bite Holding/GmbH dokumentieren.');
        const plan = '## David Deli Phantom-Finalisierung\n\n**Status:** Vertrag in docs/finale/phantom_david.pdf ist Scan ohne Textebene. DOCX-Version in Downloads hat Platzhalter "[Inhalt einfügen]".\n\n**Offene Punkte:**\n1. Phantom-Höhe final: 2% / 3% / 5%?\n2. Vesting-Mechanismus oder fix?\n3. Vertragspartner: Migration von "Deli Kost Deluxe GmbH" auf Wave Bite Holding/GmbH\n4. Auszahlungs-Trigger (Exit-Event? Liquidation? Dividende?)\n5. Verhältnis zu Marcus 5% (im SHA §12 explizit "ohne weitere Optionen/Phantom 5% gedeckelt" — wie passt David rein?)\n\n**Empfehlung:**\n- Direktgespräch mit David, klare Ja/Nein-Entscheidung\n- Entweder: 2-3% Phantom mit Exit-Trigger, sauber migriert auf Wave Bite GmbH\n- Oder: Auszahlung als Honorar/Aufwandsentschädigung für DKD-Phase, sauber raus\n\n**Termin-Vorschlag:** Anruf David diese Woche, Vertrag bis 31.05. final.';
        try { navigator.clipboard.writeText(plan); } catch(_){}
        return 'Action-Plan in Zwischenablage + Notiz. Step 1: David anrufen diese Woche.';
      }
    },
    {
      id:'sozialhilfe', icon:'🏛️', title:'Sozialhilfe ZSozTH — Frau Mohan nachfassen',
      sub:'Gesuch 17.04 · Nachfrage 21.04 · keine Eingangsbestätigung',
      run: () => {
        const mail = `Betreff: Status Gesuch Sozialhilfe — Carsten Voigt, eingereicht 17.04.2026\n\nSehr geehrte Frau Mohan,\n\nam 17.04.2026 habe ich mein Gesuch um Sozialhilfe eingereicht und am 21.04.2026 nochmals nachgefragt. Bislang habe ich keine Eingangsbestätigung erhalten.\n\nKönnten Sie mir bitte kurz mitteilen, ob das Gesuch eingegangen ist und wann mit einer Rückmeldung zu rechnen ist? Falls Unterlagen fehlen, ergänze ich diese umgehend.\n\nFalls hilfreich, stehe ich gerne für ein kurzes telefonisches Gespräch zur Verfügung.\n\nMit freundlichen Grüßen\nCarsten Voigt\nHauptstrasse 23, 4242 Laufen BL\nvoigtcarsten4@gmail.com`;
        try { navigator.clipboard.writeText(mail); } catch(_){}
        addNote('Sozialhilfe ZSozTH Frau Mohan nachgefasst (Mail in Zwischenablage). Bei keiner Antwort innerhalb 3 Werktage: anrufen.');
        return 'Nachfass-Mail in Zwischenablage. Adresse: m.mohan@zsth.ch';
      }
    },
    {
      id:'schuelin_confirm', icon:'🧠', title:'Therapie-Termine Pia Schülin bestätigen',
      sub:'Do 21.05. 14:30 + Mi 28.05. 13:30 · Praxis zum Falken, Basel',
      run: () => {
        const mail = `Betreff: AW: Vorübergehende Pause der Therapie — Terminbestätigung\n\nLiebe Frau Schülin,\n\nherzlichen Dank für Ihre Nachricht. Ich bestätige die beiden Sonder-Termine:\n\n• Donnerstag, 21.05.2026 um 14:30 Uhr\n• Mittwoch, 28.05.2026 um 13:30 Uhr\n\nbeide in der Praxis zum Falken in Basel.\n\nFalls ich noch Vorbereitendes mitbringen soll, lassen Sie es mich bitte wissen.\n\nMit freundlichen Grüssen\nCarsten Voigt`;
        try { navigator.clipboard.writeText(mail); } catch(_) {}
        addNote('Therapie-Bestätigung Schülin: Do 21.05. 14:30 + Mi 28.05. 13:30 (Praxis zum Falken). Mail in Zwischenablage.');
        return 'Bestätigungsmail in Zwischenablage. Adresse: pia.schuelin@psychologie.ch';
      }
    },
    {
      id:'heiko_callprep', icon:'🦅', title:'WFB-Call 01.06.2026 14:00 vorbereiten',
      sub:'Microsoft Teams · Heiko Schmidt · Folgeschritt zum Austausch',
      run: () => {
        const prep = `# WFB BRANDENBURG CALL · 01.06.2026 14:00\n\n## Anlass\nHeiko Schmidt hat am 19.05. den Folge-Call bestätigt (\"Einladung zum Call am 01.06. um 14 Uhr ist raus\"). Teams-Besprechungs-ID: 366 350 …\n\n## Ziel des Calls\nKonkrete nächste Schritte WFB ↔ Wave Bite festzurren. WFB ist Tier-1-Strategiepartner.\n\n## Vorzubereitende Punkte (auf Carstens Seite)\n- [ ] BP 03/2026 + Investor-Onepager als PDF-Anhang bereit halten\n- [ ] Förderlogik-Onepager (ILB / BRB / BAFA-Pfad)\n- [ ] 5 LOIs als Anlage (Hugentobler, Radeberger, Transgourmet bis 10k€, TV Dahme, Gifthüttli)\n- [ ] Standort-Karten Müggelsee/Krossinsee/Wolzig/Teupitz + Plan B Usedom\n- [ ] Zeitplan Pilot Saison 2026 (frühestens nach Liegeplatz-Lösung)\n- [ ] Kapitalbedarf-Aufteilung: 450k Pilot · 350k Bank in Vorber. · 50k EK eingelegt\n\n## Fragen, die ICH stellen werde\n1. Welches WFB-Förderprogramm passt am besten zur Pilot-Struktur?\n2. Gibt es eine WFB-Empfehlung für die ILB-Antragsstellung?\n3. Welche Vernetzung mit Tourismus-Brandenburg ist sinnvoll (TV Dahme als Anker)?\n4. Mögliche Ko-Finanzierung mit BAB Brandenburg (Bürgschaft auf das 350k-Darlehen)?\n5. Welche WFB-Veranstaltungen zwischen Juni–September wären Pflicht-Auftritte?\n\n## Fragen, die er stellen könnte (Antworten vorbereitet)\n- \"Wie weit ist der Liegeplatz?\" → 3 Alternativen, Stichtag 01.07., Plan B Usedom\n- \"Status DHDL?\" → Callback offen aus Staffel 19 (Feb–Apr 2026), Pitch finalisiert\n- \"Wie schaut Cap Table aus?\" → SHA §12: 95% Carsten / 5% Marcus voll vested\n- \"Welche Marge?\" → 71% brutto, 67,8% nach Club-Rabatt, Break-Even 72/Tag\n\n## Nach dem Call\n- [ ] Followup-Mail mit Memo + nächsten Schritten innerhalb 24h\n- [ ] Aktualisierung CRM + Faktenbuch\n- [ ] Falls Förderpfad konkret → ILB-Antragsmappe spätestens KW24`;
        const blob = new Blob([prep], {type:'text/markdown'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'WFB_Call_01062026_Prep.md'; a.click();
        setTimeout(()=>URL.revokeObjectURL(url), 5000);
        addNote('WFB-Call 01.06. 14:00 Vorbereitung: Brief generiert. Anhänge: BP, Onepager, 5 LOIs.');
        return 'Call-Prep heruntergeladen. Teams-Link aus Mail: 366 350 338 281 537';
      }
    },
    {
      id:'roka_followup', icon:'🤝', title:'ROKA Werk (Frank Burggraf) Follow-up',
      sub:'Gespräch 20.05. gelaufen · Anhänge gesendet · Termin festzurren',
      run: () => {
        const mail = `Betreff: Wave Bite × ROKA — Folgetermin & Status\n\nHallo Frank,\n\ndanke nochmal für das offene Gespräch gestern. Wie versprochen folgen hier kompakt die nächsten Punkte:\n\n1) Ich habe dir die Anlagen (Businessplan 03/26, Investor-Onepager, WIPO-Designurkunde) bereits zugeschickt — falls etwas fehlt, sag Bescheid.\n2) Für den nächsten konkreten Schritt schlage ich vor, einen 30-min-Termin in KW22 oder KW23 zu finden, in dem wir die mögliche Kooperation (Bootsbau/Komponenten/Marketing-Partnerschaft) festzurren. Vorschläge: Mi 27.05. oder Do 28.05. nachmittags, oder eine Woche später Mi 03.06. / Do 04.06.\n3) Bei Bedarf kann ich euer Werk besuchen — sag mir einfach, was für euch passt.\n\nFreue mich auf eure Rückmeldung!\n\nBeste Grüße\nCarsten`;
        try { navigator.clipboard.writeText(mail); } catch(_) {}
        addNote('ROKA-Followup an Frank Burggraf vorbereitet (Zwischenablage). Termin-Vorschläge: Mi 27.05. / Do 28.05. / Mi 03.06. / Do 04.06.');
        return 'Followup-Mail in Zwischenablage. 4 Termin-Vorschläge integriert.';
      }
    },
    {
      id:'anthropic_pay', icon:'🚨', title:'Anthropic Payment Failed — Kreditkarte prüfen',
      sub:'$21.62 + $32.43 unsuccessful — Claude-API gefährdet',
      run: () => {
        window.open('https://console.anthropic.com/settings/billing', '_blank');
        addNote('Anthropic Payment 2× failed (21,62 + 32,43 USD). Kreditkarte in Console aktualisieren — sonst API-Stop. Tab geöffnet.');
        return 'Anthropic-Console geöffnet. Karte aktualisieren oder neue hinterlegen.';
      }
    },
    {
      id:'apps_script_fix', icon:'⚙️', title:'Wave_Bite_WaterInfos Apps Script reparieren',
      sub:'Apps Script meldet Run-Failures — Daten-Pipeline kaputt',
      run: () => {
        window.open('https://script.google.com/home/projects/1mH7NmlaGx72KFH6kxD5DkOz0ga8B_YIktiqbWnbeUK3j2u1jNyODPm2J/edit', '_blank');
        addNote('Wave_Bite_WaterInfos Apps Script: Run failed mehrfach (19.05., 20.05.). Trigger-Logs prüfen, Quota-Limits checken, evtl. OAuth-Scope.');
        return 'Apps Script Editor geöffnet (QR-Bridge-Projekt). Executions-Tab → letzte Failures inspizieren.';
      }
    },
    {
      id:'cd_schuelin', icon:'📝', title:'Brief Pia Schülin (Corporate Design)',
      sub:'Wave-Bite-Corporate-Stil · Helvetica · Holding-Header · PDF-ready',
      run: () => {
        corporateMailFor({
          betreff:'Bestätigung der Sondertermine',
          an:'Frau Pia Schülin, eidg. anerkannte Psychotherapeutin · Praxis zum Falken, Basel',
          anrede:'Liebe Frau Schülin,',
          paragraphen:[
            'herzlichen Dank für Ihre Nachricht vom 19.05.2026 und die Terminierung trotz der vorübergehenden Pause.',
            'Ich bestätige hiermit gerne beide Sondertermine in Ihrer Praxis zum Falken in Basel:<br><br>• <strong>Donnerstag, 21. Mai 2026 um 14:30 Uhr</strong><br>• <strong>Mittwoch, 28. Mai 2026 um 13:30 Uhr</strong>',
            'Sollten Sie spezifische Unterlagen oder Vorbereitendes von mir benötigen, lassen Sie es mich bitte wissen.',
          ],
          ps:'Eine Antwort ist nicht erforderlich, sofern keine Änderungen bestehen.'
        });
        return 'Brief im Wave-Bite-Corporate-Design im neuen Tab geöffnet. Strg+P → PDF speichern → Mail-Anhang.';
      }
    },
    {
      id:'cd_heiko', icon:'📝', title:'Brief WFB Brandenburg (Heiko Schmidt) — Corporate',
      sub:'Folge-Anhang zum Call 01.06.2026 · Wave-Bite-Briefkopf',
      run: () => {
        corporateMailFor({
          betreff:'Vorbereitung zum Folge-Call am 01.06.2026, 14:00 Uhr',
          an:'Herrn Heiko Schmidt · Wirtschaftsinitiative Brandenburg WFB',
          anrede:'Sehr geehrter Herr Schmidt,',
          paragraphen:[
            'vielen Dank für die Bestätigung des Folge-Termins via Microsoft Teams. Ich freue mich auf den Austausch.',
            'Zur Vorbereitung erhalten Sie anbei kompakt zusammengefasst die wichtigsten Eckpunkte:<br><br>• <strong>Funding-Ziel Pilot:</strong> 450.000 € (EK 50k eingelegt · Bankdarlehen 350k in Vorbereitung)<br>• <strong>Bruttomarge:</strong> 71% · Break-Even bei 72 Verkäufen/Tag (10.820/Jahr) auf 150 Saisontagen<br>• <strong>Forecast J1–J3:</strong> 250k → 415k → 670k € Umsatz · EBITDA 93,6k → 191,8k → 363,9k €<br>• <strong>5 LOIs unterzeichnet:</strong> Hugentobler · Radeberger · Transgourmet (bis 10k€) · TV Dahme-Seenland · Gifthüttli<br>• <strong>WIPO Design DM/248323</strong> (EU+CH) eingetragen 21.07.2025<br>• <strong>Rechtsstruktur:</strong> Wave Bite Holding AG (CH, Laufen BL) + GmbH (DE, Zeuthen)',
            'Im Anhang finden Sie den Businessplan 03/2026, den Investor-Onepager sowie den Förderlogik-Onepager. Falls Sie weitere Unterlagen vorab benötigen, sende ich diese gerne zu.',
            'Für den Call habe ich folgende Punkte vorbereitet, die wir gemeinsam klären könnten:<br><br>1. Welches WFB-Förderprogramm passt strukturell am besten zum Wave-Bite-Konzept? Welche Voraussetzungen sind nötig, welche Programme greifen ineinander?<br>2. Welche nächsten Schritte empfehlen Sie auf WFB-Seite, um den Pilot Saison 2026 abzusichern?<br>3. Gibt es konkrete Anschluss­möglichkeiten an Brandenburger Unternehmer, Standortpartner (TV Dahme-Seenland) und Co-Investoren?'
          ],
          ps:'Über Ihre Einschätzung und konkrete Empfehlungen freue ich mich sehr.'
        });
        return 'Brief im Wave-Bite-Corporate-Design im neuen Tab geöffnet. Strg+P → PDF speichern → Mail-Anhang.';
      }
    }
  ]; // ACTIONS

  // -------- EXPORT — global available for index.html ----------------------
  window.Lucy = window.Lucy || {};
  window.Lucy.FACTS = FACTS;
  window.Lucy.DOCS = DOCS;
  window.Lucy.PLUGINS = PLUGINS;
  window.Lucy.ACTIONS = ACTIONS;
  window.Lucy.runAction = function(id){
    var a = ACTIONS.find(function(x){return x.id===id;});
    if (!a || typeof a.run !== 'function') return 'Action nicht gefunden: ' + id;
    try { return a.run(); } catch(e) { console.error(e); return 'Fehler beim Ausführen: ' + e.message; }
  };
  window.Lucy.listActions = function(){
    return ACTIONS.map(function(a){ return { id:a.id, icon:a.icon, title:a.title, sub:a.sub }; });
  };

  // Helper used by some actions (no-op if not defined elsewhere)
  if (typeof window.addNote !== 'function') {
    window.addNote = function(t){
      try {
        var k='samantha_notes_v1';
        var arr=JSON.parse(localStorage.getItem(k)||'[]');
        arr.unshift({at:new Date().toISOString(), text:t});
        localStorage.setItem(k, JSON.stringify(arr.slice(0,500)));
      } catch(e){}
    };
  }
  if (typeof window.corporateMailFor !== 'function') {
    window.corporateMailFor = function(o){
      try {
        var html = '<!doctype html><html><head><meta charset="utf-8"><title>'+(o.betreff||'Brief')+'</title>'+
          '<style>body{font-family:Georgia,serif;max-width:720px;margin:2rem auto;padding:2rem;color:#111;line-height:1.55}'+
          'h1{color:#0a4d68;font-size:1.2rem;border-bottom:2px solid #0a4d68;padding-bottom:.4rem}'+
          'header{display:flex;justify-content:space-between;font-size:.85rem;color:#555;margin-bottom:1.5rem}'+
          'p{margin:.9rem 0}.ps{margin-top:1.5rem;font-style:italic;color:#444}</style></head><body>'+
          '<header><div><strong>Wave Bite Holding AG</strong><br>Hauptstrasse 23<br>4242 Laufen BL</div>'+
          '<div>Carsten Voigt<br>voigtcarsten4@gmail.com<br>'+new Date().toLocaleDateString('de-DE')+'</div></header>'+
          '<div style="margin:1rem 0;color:#444">'+(o.an||'')+'</div>'+
          '<h1>'+(o.betreff||'')+'</h1>'+
          '<p>'+(o.anrede||'')+'</p>'+
          (o.paragraphen||[]).map(function(p){return '<p>'+p+'</p>';}).join('')+
          (o.ps?'<p class="ps">PS: '+o.ps+'</p>':'')+
          '<p style="margin-top:2rem">Mit freundlichen Grüssen<br><strong>Carsten Voigt</strong></p>'+
          '</body></html>';
        var w = window.open('','_blank');
        if (w && w.document) { w.document.write(html); w.document.close(); }
      } catch(e){ console.error(e); }
    };
  }

  // ====================================================================
  // LUCY UI — Floating Avatar + Side Panel (5 Tabs)
  // Heute · Erweiterungen · Actions · Docs · Notizen
  // ====================================================================
  function injectLucyUI(){
    if (document.getElementById('lucy-fab')) return;
    if (!document.body) return setTimeout(injectLucyUI, 50);
    var css = ''
      + '#lucy-fab{position:fixed;right:1.2rem;bottom:1.2rem;width:62px;height:62px;border-radius:50%;'
      + 'background:radial-gradient(circle at 35% 30%,#fde2c8 0%,#d4a8e8 55%,#5b3a8e 100%);'
      + 'border:2px solid rgba(154,240,255,.55);box-shadow:0 0 28px rgba(154,240,255,.45),0 6px 22px rgba(0,0,0,.55);'
      + 'cursor:pointer;z-index:1500000;display:flex;align-items:center;justify-content:center;'
      + 'font-size:1.9rem;line-height:1;transition:transform .25s ease, box-shadow .25s ease;}'
      + '#lucy-fab:hover{transform:scale(1.07);box-shadow:0 0 36px rgba(154,240,255,.75),0 8px 28px rgba(0,0,0,.6);}'
      + '#lucy-fab .pulse{position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(0,212,170,.55);animation:lucyPulse 2.4s ease-out infinite;}'
      + '@keyframes lucyPulse{0%{transform:scale(.9);opacity:.9}100%{transform:scale(1.45);opacity:0}}'
      + '#lucy-panel{position:fixed;right:1.2rem;bottom:5.6rem;width:380px;max-width:94vw;max-height:78vh;'
      + 'background:linear-gradient(180deg,rgba(8,16,28,.97),rgba(2,8,16,.98));border:1px solid rgba(0,200,255,.28);'
      + 'border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.75),0 0 32px rgba(0,200,255,.12);'
      + 'color:#cce8ff;font-family:"JetBrains Mono","Inter",system-ui,sans-serif;z-index:1500001;'
      + 'display:none;flex-direction:column;overflow:hidden;}'
      + '#lucy-panel.open{display:flex;animation:lucyIn .28s ease-out;}'
      + '@keyframes lucyIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}'
      + '#lucy-panel .l-head{display:flex;align-items:center;gap:.6rem;padding:.85rem 1rem;border-bottom:1px solid rgba(0,200,255,.18);background:rgba(0,30,60,.4);}'
      + '#lucy-panel .l-head .av{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fde2c8 0%,#d4a8e8 55%,#5b3a8e 100%);display:flex;align-items:center;justify-content:center;font-size:1.1rem;}'
      + '#lucy-panel .l-head .nm{font-weight:700;letter-spacing:.18em;font-size:.85rem;color:#9af0ff;}'
      + '#lucy-panel .l-head .st{font-size:.55rem;letter-spacing:.25em;color:#00d4aa;}'
      + '#lucy-panel .l-close{margin-left:auto;background:transparent;border:1px solid rgba(255,255,255,.18);color:#cce8ff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:.9rem;}'
      + '#lucy-panel .l-tabs{display:flex;border-bottom:1px solid rgba(0,200,255,.15);background:rgba(0,0,0,.35);}'
      + '#lucy-panel .l-tabs button{flex:1;background:transparent;border:none;color:#8fa8c2;padding:.55rem .3rem;font-size:.6rem;letter-spacing:.15em;cursor:pointer;border-bottom:2px solid transparent;font-family:inherit;}'
      + '#lucy-panel .l-tabs button.active{color:#9af0ff;border-bottom-color:#00d4aa;background:rgba(0,212,170,.06);}'
      + '#lucy-panel .l-body{flex:1;overflow-y:auto;padding:.85rem 1rem;font-size:.72rem;line-height:1.55;}'
      + '#lucy-panel .l-body::-webkit-scrollbar{width:6px}#lucy-panel .l-body::-webkit-scrollbar-thumb{background:rgba(0,200,255,.25);border-radius:3px}'
      + '#lucy-panel .l-item{padding:.55rem .6rem;border:1px solid rgba(0,200,255,.12);border-radius:7px;margin-bottom:.45rem;background:rgba(0,40,80,.18);cursor:pointer;transition:all .18s ease;}'
      + '#lucy-panel .l-item:hover{border-color:rgba(0,212,170,.45);background:rgba(0,212,170,.08);}'
      + '#lucy-panel .l-item .t{font-weight:700;color:#9af0ff;font-size:.74rem;display:flex;align-items:center;gap:.4rem}'
      + '#lucy-panel .l-item .s{color:#8fa8c2;font-size:.62rem;margin-top:.2rem}'
      + '#lucy-panel .l-grp{font-size:.55rem;letter-spacing:.2em;color:#5e8ab0;margin:.6rem 0 .35rem;text-transform:uppercase;}'
      + '#lucy-panel input.l-inp{width:100%;background:rgba(0,0,0,.4);border:1px solid rgba(0,200,255,.22);color:#cce8ff;padding:.45rem .55rem;border-radius:6px;font-size:.7rem;font-family:inherit;margin-bottom:.5rem;}'
      + '@media (max-width:600px){#lucy-panel{right:.6rem;left:.6rem;width:auto;bottom:5rem;}}';
    var st = document.createElement('style'); st.id='lucy-css'; st.textContent = css;
    document.head.appendChild(st);
    var fab = document.createElement('button');
    fab.id = 'lucy-fab'; fab.title = 'Lucy oeffnen (Ctrl+J)';
    fab.innerHTML = '<span class="pulse"></span><span>🧜🏻‍♀️</span>';
    document.body.appendChild(fab);
    var pnl = document.createElement('div');
    pnl.id = 'lucy-panel';
    pnl.innerHTML = '<div class="l-head"><div class="av">🧜🏻‍♀️</div><div><div class="nm">LUCY</div><div class="st">CEREBRAL · 100%</div></div><button class="l-close" type="button" aria-label="Schliessen">✕</button></div><div class="l-tabs"><button data-tab="heute" class="active">HEUTE</button><button data-tab="ext">ERWEITER.</button><button data-tab="act">ACTIONS</button><button data-tab="docs">DOCS</button><button data-tab="notes">NOTIZEN</button></div><div class="l-body" id="lucy-body"></div>';
    document.body.appendChild(pnl);
    var state = { tab: 'heute' };
    function render(){
      var b = document.getElementById('lucy-body'); if (!b) return;
      var html = '';
      if (state.tab === 'heute'){
        var d = new Date(); var wd = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][d.getDay()];
        html += '<div class="l-grp">Heute · '+wd+', '+d.toLocaleDateString('de-DE')+'</div>';
        html += '<div class="l-item"><div class="t">🔴 MVP App-Demo fertigstellen</div><div class="s">Hoechste Prioritaet · DHDL-Vorbereitung</div></div>';
        html += '<div class="l-item"><div class="t">🟡 Investor-Pitch aktualisieren</div><div class="s">Pre-Money 1,5 M€ · Faktenbuch-Daten</div></div>';
        html += '<div class="l-item"><div class="t">🔵 Wasserlage KPIs pruefen</div><div class="s">GA4-Streams · QR-Scans · Downloads</div></div>';
        html += '<div class="l-grp">Permanente Blocker</div>';
        html += '<div class="l-item" style="border-color:rgba(255,100,100,.35)"><div class="t">⚠ Liegeplatz Wolzig</div><div class="s">Heiko Schmidt (WFB) nachfassen</div></div>';
        html += '<div class="l-item" style="border-color:rgba(255,200,80,.35)"><div class="t">⚠ David Deli Phantom</div><div class="s">Vertragsluecke schliessen</div></div>';
        html += '<div class="l-item" style="border-color:rgba(255,200,80,.35)"><div class="t">⚠ Sichtbarkeit</div><div class="s">Social-Cadence wiederherstellen</div></div>';
        b.innerHTML = html;
      } else if (state.tab === 'ext'){
        html += '<div class="l-grp">Aktive Erweiterungen / Plugins</div>';
        var P = (window.Lucy && window.Lucy.PLUGINS) || {};
        var keys = Object.keys(P);
        if (!keys.length){
          html += '<div class="l-item"><div class="t">📄 PDF Viewer</div><div class="s">PDFs lesen, annotieren, unterschreiben</div></div>'
                + '<div class="l-item"><div class="t">📈 Daloopa Finance</div><div class="s">DCF · Comps · Earnings · Models</div></div>'
                + '<div class="l-item"><div class="t">🎙️ Brand Voice</div><div class="s">Voice-Guidelines · Content-Enforcement</div></div>'
                + '<div class="l-item"><div class="t">🎨 Figma</div><div class="s">Design · Libraries · Code Connect</div></div>'
                + '<div class="l-item"><div class="t">🏪 Small Business</div><div class="s">Cash-Flow · Margin · Tax · Invoice</div></div>'
                + '<div class="l-item"><div class="t">🔍 Enterprise Search</div><div class="s">Cross-Source Search · Daily Digest</div></div>'
                + '<div class="l-item"><div class="t">📤 Postiz</div><div class="s">Social-Media-Posting (28+ Kanaele)</div></div>'
                + '<div class="l-item"><div class="t">🌈 Adobe Creative</div><div class="s">Photo · Video · Design · Templates</div></div>';
        } else {
          keys.forEach(function(k){
            var v = P[k] || {};
            html += '<div class="l-item"><div class="t">'+(v.icon?v.icon+' ':'')+k+'</div><div class="s">'+(v.desc||v.use||'aktiv')+'</div></div>';
          });
        }
        html += '<div class="l-grp">Tracking & Bridges</div>';
        html += '<div class="l-item"><div class="t">🔗 Apps Script Bridge V3.2</div><div class="s">Gmail · Calendar · GA4 · Claude · Research</div></div>';
        html += '<div class="l-item"><div class="t">📊 GA4 Multi-Stream</div><div class="s">Website · Wasserlage · BunBo · L1</div></div>';
        b.innerHTML = html;
      } else if (state.tab === 'act'){
        var A = (window.Lucy && typeof window.Lucy.listActions === 'function') ? window.Lucy.listActions() : [];
        html += '<div class="l-grp">'+A.length+' verfuegbare Actions</div>';
        if (!A.length) html += '<div class="s">Keine Actions registriert.</div>';
        A.forEach(function(a){
          html += '<div class="l-item" data-act="'+a.id+'"><div class="t">'+(a.icon||'✨')+' '+a.title+'</div><div class="s">'+(a.sub||'')+'</div></div>';
        });
        b.innerHTML = html;
        Array.prototype.forEach.call(b.querySelectorAll('[data-act]'), function(el){
          el.addEventListener('click', function(){
            var id = el.getAttribute('data-act');
            var r = window.Lucy.runAction(id);
            if (r && typeof r === 'string'){
              var msg = document.createElement('div'); msg.className='l-item'; msg.style.borderColor='rgba(0,212,170,.5)';
              msg.innerHTML = '<div class="t">✓ '+(id)+'</div><div class="s">'+r+'</div>';
              b.insertBefore(msg, b.firstChild.nextSibling);
            }
          });
        });
      } else if (state.tab === 'docs'){
        var D = (window.Lucy && window.Lucy.DOCS) || [];
        html += '<div class="l-grp">'+D.length+' Dokumente</div>';
        if (!D.length) html += '<div class="s">Faktenbuch noch nicht geladen.</div>';
        D.forEach(function(d){
          var p = d.path || d.file || '';
          html += '<div class="l-item"><div class="t">📄 '+(d.title||d.name||'Doc')+'</div><div class="s">'+(d.tag||d.cat||'')+(p?' · <a href="'+p+'" target="_blank" style="color:#9af0ff">oeffnen</a>':'')+'</div></div>';
        });
        b.innerHTML = html;
      } else if (state.tab === 'notes'){
        var arr = [];
        try { arr = JSON.parse(localStorage.getItem('samantha_notes_v1')||'[]'); } catch(e){}
        html += '<input class="l-inp" id="lucy-note-in" placeholder="Neue Notiz · Enter speichert" />';
        html += '<div class="l-grp">'+arr.length+' Notizen</div>';
        arr.slice(0,40).forEach(function(n){
          var dt = ''; try { dt = new Date(n.at).toLocaleString('de-DE'); } catch(e){}
          html += '<div class="l-item"><div class="t">'+(n.text||'').replace(/</g,'&lt;')+'</div><div class="s">'+dt+'</div></div>';
        });
        b.innerHTML = html;
        var inp = document.getElementById('lucy-note-in');
        if (inp) inp.addEventListener('keydown', function(e){
          if (e.key === 'Enter' && inp.value.trim()){ window.addNote(inp.value.trim()); inp.value=''; render(); }
        });
      }
    }
    fab.addEventListener('click', function(){ pnl.classList.toggle('open'); if (pnl.classList.contains('open')) render(); });
    pnl.querySelector('.l-close').addEventListener('click', function(){ pnl.classList.remove('open'); });
    Array.prototype.forEach.call(pnl.querySelectorAll('.l-tabs button'), function(btn){
      btn.addEventListener('click', function(){
        Array.prototype.forEach.call(pnl.querySelectorAll('.l-tabs button'), function(x){ x.classList.remove('active'); });
        btn.classList.add('active'); state.tab = btn.getAttribute('data-tab'); render();
      });
    });
    document.addEventListener('keydown', function(e){
      if ((e.ctrlKey||e.metaKey) && e.key === 'j'){ e.preventDefault(); fab.click(); }
      else if (e.key === 'Escape' && pnl.classList.contains('open')){ pnl.classList.remove('open'); }
    });
    window.Lucy.open = function(){ if (!pnl.classList.contains('open')){ pnl.classList.add('open'); render(); } };
    window.Lucy.close = function(){ pnl.classList.remove('open'); };
    window.Lucy.toggle = function(){ fab.click(); };
    window.Lucy.say = function(msg){
      if (!msg) return; window.Lucy.open();
      var b = document.getElementById('lucy-body');
      if (b){
        var m = document.createElement('div'); m.className='l-item'; m.style.borderColor='rgba(0,212,170,.55)';
        m.innerHTML = '<div class="t">🧜🏻‍♀️ Lucy</div><div class="s">'+String(msg).replace(/</g,'&lt;')+'</div>';
        b.insertBefore(m, b.firstChild);
      }
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectLucyUI);
  else injectLucyUI();

  console.log('🌊 Lucy v4.1 geladen — '+ACTIONS.length+' Actions, '+(typeof DOCS!=="undefined"?DOCS.length:0)+' Docs, UI online');
})();
