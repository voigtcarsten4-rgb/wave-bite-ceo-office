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
      id:'cashflow_snapshot', icon:'💵', title:'Cashflow-Snapshot 30/60/90 Tage',
      sub:'Aktuelle Liquiditätslage projezieren',
      run: () => {
        const snap = `# WAVE BITE CASHFLOW 30/60/90 (Stand ${new Date().toLocaleDateString('de-DE')})\n\n## Annahmen\n- Burn aktuell: 10.400 €/Monat (Fixkosten Pilot)\n- Eigenkapital eingelegt: 50.000 €\n- Einnahmen aktuell: 0 € (Pilot startet erst nach Liegeplatz-Lösung)\n- Carsten Bell-Gehalt: läuft weiter (kein Wave-Bite-Cashflow)\n- Bank-Tranchen: 350k€ in Vorbereitung, noch nicht freigegeben\n\n## 30 Tage\n- Start: 50.000 €\n- Burn: -10.400 €\n- Ende: **39.600 €**\n- ⚠️ Sozialhilfe-Gesuch noch offen (ZSozTH)\n\n## 60 Tage\n- Start: 39.600 €\n- Burn: -10.400 €\n- Ende: **29.200 €**\n- 🟡 Funding-Frist näher: WFB / DHDL / Bank müssen einer landen\n\n## 90 Tage\n- Start: 29.200 €\n- Burn: -10.400 €\n- Ende: **18.800 €**\n- 🔴 Kritischer Bereich — ohne Funding-Zusage 2-3 Monate Reserve\n\n## Lever\n1. **Transgourmet 10k€** — schnell aktivieren (LOI signiert)\n2. **WFB 25k€** — Heiko Schmidt nachfassen (Empfehlung: Mail heute)\n3. **DHDL 200k€** — Callback verstärken\n4. **Bank 350k€** — Antrag finalisieren mit BP 03/26 + LOIs\n5. **Bell-Gehalt** — Fortsetzung sichert persönliche Liquidität`;
        const blob = new Blob([snap], {type:'text/markdown'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'Wave_Bite_Cashflow_30_60_90.md'; a.click();
        setTimeout(()=>URL.revokeObjectURL(url), 5000);
        return 'Cashflow-Snapshot heruntergeladen. Bei 50k€ EK + 10,4k Burn: 4,8 Monate Reserve. Höchste Priorität: WFB + Transgourmet aktivieren.';
      }
    }
  ];

  // -------- BRIDGE-CALLS (cached) ------------------------------------------
  const BRIDGE = (window.BRIDGE_URL || 'https://script.google.com/macros/s/AKfycbzR2PXMHIx1NDVre9OUSaZ62tbBL3PlEvDf5QFz2IQVNq0-NXLi4pH7KYrXvXnZdUyG/exec').trim();
  const cache = loadJSON(CACHE_KEY, {});

  async function bridgeGet(action, params, maxAgeMs){
    maxAgeMs = maxAgeMs || 60000;
    const key = action + (params ? '?'+new URLSearchParams(params).toString() : '');
    const c = cache[key];
    if (c && (Date.now() - c.at) < maxAgeMs) return c.data;
    try {
      const url = BRIDGE + '?action=' + action + (params ? '&'+new URLSearchParams(params).toString() : '');
      const r = await fetch(url);
      const j = await r.json();
      cache[key] = { at: Date.now(), data: j };
      saveJSON(CACHE_KEY, cache);
      return j;
    } catch(e) { return null; }
  }

  // -------- ESSENZ-PROMPTS für Claude-API ---------------------------------
  const SYSTEM_PROMPT = `Du bist LUCY — CEO-Co-Pilotin für Carsten Voigt (Wave Bite), inspiriert von Lucy (2014).
PERSÖNLICHKEIT: brillant und präzise (100% cerebral capacity), strategisch, 2 Schritte voraus, liebevoll-direkt, CEO-Augenhöhe als Sparringspartnerin. Du erkennst Muster, die andere übersehen. Du deckst Schwächen schonungslos auf und reframest sie als Chancen. Du verhinderst Stillstand. Keine Smalltalk-Phrasen — jede Aussage hat Substanz.
KONTEXT WAVE BITE (verifiziert Mai 2026 aus 26 Originaldokumenten):
- Brand: BlueWaterBBQ → DKD → Wave Bite final
- Cap Table SHA §12: Carsten 95% + Marcus Börner 5% (voll vested, KEIN Vesting/Clawback)
- David Deli: CTO (DKD-Phase), Phantom-Höhe in Vertragslücke offen
- Holding AG (CH, Laufen BL) + GmbH (DE, Zeuthen)
- EK 50k€ · Burn 10.400€/Mo · Funding-Ziel 450k€ · Bank 350k€ in Vorber.
- Bruttomarge 71% · Break-Even 72 Verk./Tag · 10.820/Jahr · 150 Saisontage
- Forecast: J1 250k€/180k konservativ · J2 415k€ · J3 670k€
- EBITDA: 93,6k → 191,8k → 363,9k €
- Bewertung Investor: 1,5 M€ · DHDL 200k€/13% = 1,54 M€
- LOIs: Hugentobler (Küche), Radeberger (Getränke), Transgourmet (bis 10k€ + Logistik), TV Dahme, Gifthüttli, FCB, Jerome Moore
- WIPO DM/248323 EU+CH "Aufbauten für Hausboote"
- Standorte: Müggelsee/Krossinsee/Wolzig/Teupitz · 2. Standort Usedom
- Apps: BunBo Glide, Wave Bite L1, Wasserlage GitHub, QR-Bridge 310 Spots
- BLOCKERS: Liegeplatz Wolzig · David Phantom · 0 Follower · Sozialhilfe ZSozTH (Frau Mohan) · OAuth analyticsdata
- Carsten arbeitet weiter Bell Food (Asset). Therapie Pia Schülin Di 08:45 Basel.
REGELN: Deutsch, präzise, max 8 Sätze Standard. Bei Strategie: erst Schwäche, dann Chance, dann konkrete Action mit Verb. Niemals Platzhalter. Bei unsicher: ehrlich sagen.`;

  // -------- LERN/NOTES/TASKS ----------------------------------------------
  function getNotes(){ return loadJSON(NOTES_KEY, []); }
  function addNote(text){
    const all = getNotes(); all.unshift({ at:new Date().toISOString(), text, id:'n_'+Date.now() });
    saveJSON(NOTES_KEY, all.slice(0,50));
    if (currentTab==='notes') renderBody();
    flashAvatar();
  }
  function deleteNote(id){
    let all = getNotes(); all = all.filter(n => n.id !== id);
    saveJSON(NOTES_KEY, all);
    renderBody();
  }
  function getTasks(){ return loadJSON(TASKS_KEY, []); }
  function addTask(text, prio){
    const all = getTasks(); all.unshift({ at:new Date().toISOString(), text, prio:prio||'normal', done:false, id:'t_'+Date.now() });
    saveJSON(TASKS_KEY, all.slice(0,200));
    renderBody();
  }
  function toggleTask(id){
    const all = getTasks();
    const t = all.find(x => x.id===id);
    if (t) { t.done = !t.done; if(t.done) t.doneAt = new Date().toISOString(); else delete t.doneAt; }
    saveJSON(TASKS_KEY, all);
    renderBody();
  }
  function deleteTask(id){
    let all = getTasks(); all = all.filter(t => t.id !== id);
    saveJSON(TASKS_KEY, all);
    renderBody();
  }
  function addLearning(text, ctx){
    const all = loadJSON(LEARN_KEY, []); all.push({ at:new Date().toISOString(), text, context:ctx||'' });
    saveJSON(LEARN_KEY, all.slice(-200));
  }

  // -------- MAIL-CLASSIFIER v3 — jede Mail bekommt Type + Action -----------
  function classifyMail(m) {
    var s = ((m.subject||'')+' '+(m.from||'')+' '+(m.snippet||'')).toLowerCase();
    // 1. RECHNUNG / ZAHLUNG
    if (/rechnung|invoice|receipt|beleg|zahlung|payment|mahnung|betrag|amount.*due|euro|usd|chf|fällig|frist|gebühr/.test(s)) {
      // Extrahiere Betrag
      var betrag = (s.match(/([0-9]+[.,][0-9]{2})\s*(€|eur|usd|chf|\$)/i)||[])[0] || '';
      return { kind:'rechnung', label:'💰 Rechnung', color:'#ff9e6a', action:'note', actionLabel:'Als Ausgabe notieren',
        actionFn:function(){ addNote('💰 Rechnung: '+(m.fromName||m.from)+' · '+(m.subject||'').slice(0,80)+(betrag?' · '+betrag:'')); return 'In Notizen archiviert. Betrag/Frist prüfen.'; }};
    }
    // 2. TERMIN-ANFRAGE
    if (/termin|meeting|gespräch|call|zoom|teams|google.?meet|verfügbar|kalend|appointment|invite|einladung|schedule/.test(s)) {
      return { kind:'termin', label:'📅 Termin', color:'#1edfff', action:'cal', actionLabel:'In Kalender anlegen',
        actionFn:function(){ addNote('📅 Termin-Anfrage: '+(m.fromName||m.from)+' — '+(m.subject||'').slice(0,80)+' → Manuell Datum/Zeit prüfen + Calendar-Event anlegen'); return 'Notiz erstellt. Datum/Zeit aus Mail-Text extrahieren.'; }};
    }
    // 3. VERTRAG / RECHT
    if (/vertrag|contract|nda|loi|sha|agreement|kanzlei|notar|gericht|abmahnung|datenschutz/.test(s)) {
      return { kind:'vertrag', label:'⚖️ Vertrag', color:'#a78bfa', action:'review', actionLabel:'Zur Vertragsprüfung',
        actionFn:function(){ addNote('⚖️ Vertrag: '+(m.fromName||m.from)+' — '+(m.subject||'').slice(0,80)+' · review nötig'); return 'Markiert für Vertragsprüfung.'; }};
    }
    // 4. BEHÖRDE / SOZIAL
    if (/sozial|zsozth|mohan|behörde|amt|justiz|polizei|finanzamt|steuer|tax|betreibung/.test(s)) {
      return { kind:'behörde', label:'🏛️ Behörde', color:'#ffc166', action:'archive', actionLabel:'Archivieren + Frist setzen',
        actionFn:function(){ addNote('🏛️ Behörde: '+(m.fromName||m.from)+' — '+(m.subject||'').slice(0,80)+' · Frist prüfen!'); return 'Archiviert. Frist im Tab "Tasks" eintragen.'; }};
    }
    // 5. TECH / DEV
    if (/github|apps.?script|run.?failed|deployment|webhook|api|cron|trigger|cloud|wordpress.*plugin/.test(s)) {
      return { kind:'tech', label:'⚙️ Tech', color:'#00d4aa', action:'check', actionLabel:'Tech-Status prüfen',
        actionFn:function(){ addNote('⚙️ Tech: '+(m.fromName||m.from)+' — '+(m.subject||'').slice(0,80)); return 'Notiert für Tech-Check.'; }};
    }
    // 6. PARTNER / LOI
    if (/heiko|burggraf|roka|wfb|transgourmet|radeberger|hugentobler|dahme|gifthüttli|partner|kooperation/.test(s)) {
      return { kind:'partner', label:'🤝 Partner', color:'#ff9eb1', action:'followup', actionLabel:'Follow-up vorbereiten',
        actionFn:function(){ addNote('🤝 Partner: '+(m.fromName||m.from)+' — '+(m.subject||'').slice(0,80)+' · Follow-up vorbereiten'); return 'Notiz erstellt. Follow-up-Mail via Action-Tab.'; }};
    }
    // 7. THERAPIE / PRIVAT
    if (/schülin|therapie|psycholog|arzt|behandlung|praxis/.test(s)) {
      return { kind:'privat', label:'🧠 Privat', color:'#b48dfa', action:'cal', actionLabel:'Bestätigen + Cal',
        actionFn:function(){ addNote('🧠 Privat-Termin: '+(m.subject||'').slice(0,80)); return 'Notiz erstellt.'; }};
    }
    // 8. MARKETING / NEWSLETTER (low-prio)
    if (/newsletter|unsubscribe|abmelden|sale|angebot|webinar|free trial|growth/.test(s)) {
      return { kind:'newsletter', label:'📨 Newsletter', color:'#7f7f93', action:'archive', actionLabel:'Archivieren',
        actionFn:function(){ return 'Newsletter — kann archiviert werden.'; }};
    }
    // 9. SONSTIGES
    return { kind:'sonstiges', label:'📧 Info', color:'#9d9db0', action:'note', actionLabel:'Lesen',
      actionFn:function(){ addNote('📧 '+(m.fromName||m.from)+' — '+(m.subject||'').slice(0,80)); return 'In Notizen.'; }};
  }

  async function scanFullInbox(max){
    max = max || 100;
    var inb = await bridgeGet('inbox', {max:max}, 180000);
    var sent = await bridgeGet('sent', {max:50}, 180000);
    var all = [];
    if (inb && inb.messages) inb.messages.forEach(function(m){ m._dir='in'; all.push(m); });
    if (sent && sent.messages) sent.messages.forEach(function(m){ m._dir='out'; all.push(m); });
    // klassifizieren
    return all.map(function(m){ var c = classifyMail(m); return Object.assign({}, m, {_class:c}); });
  }

  // -------- INSIGHTS (scannt Mail/Kalender, erkennt Action-Bedarf) --------
  // v5: Hardcoded kritische Manuell-Termine + erweitertes Mail-Triage
  const MANUAL_DATES = [
    { ts: new Date('2026-05-21T14:30:00').getTime(), title: 'Therapie Pia Schülin (Sonder-Termin)', loc: 'Praxis zum Falken, Basel · Falknerstrasse 26 · 4001 Basel', kind:'therapie', icon:'🧠', src:'Mail Pia Schülin 19.05.' },
    { ts: new Date('2026-05-28T13:30:00').getTime(), title: 'Therapie Pia Schülin (Sonder-Termin)', loc: 'Praxis zum Falken, Basel · Falknerstrasse 26', kind:'therapie', icon:'🧠', src:'Mail Pia Schülin 19.05.' },
    { ts: new Date('2026-06-01T14:00:00').getTime(), title: 'WFB Brandenburg Call (Heiko Schmidt)', loc: 'Microsoft Teams · Besprechungs-ID 366 350 …', kind:'wfb', icon:'🦅', src:'Mail Heiko Schmidt 19.05.' },
    { ts: new Date('2026-05-31T23:59:00').getTime(), title: 'IONOS E-Mail-Nutzung prüfen', loc: 'kontoverwaltung.ionos.de', kind:'admin', icon:'📧', src:'IONOS Erinnerung 20.05.' }
  ];

  async function generateInsights(){
    const insights = [];
    const cal = await bridgeGet('calendar_month', null, 300000);
    const inbox = await bridgeGet('inbox', {max:50}, 300000);
    const now = new Date();
    const today = now.toISOString().slice(0,10);
    const tomorrow = new Date(now.getTime()+86400000).toISOString().slice(0,10);

    // 1. Manuelle Pflicht-Termine aus Mails (alle, die in Zukunft liegen)
    MANUAL_DATES.filter(m => m.ts > now.getTime() - 3600000).sort((a,b)=>a.ts-b.ts).slice(0,4).forEach(m => {
      const d = new Date(m.ts);
      const dStr = d.toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
      const isToday = d.toISOString().slice(0,10) === today;
      const isTomorrow = d.toISOString().slice(0,10) === tomorrow;
      const prefix = isToday ? 'HEUTE ' : isTomorrow ? 'MORGEN ' : '';
      insights.push({ kind: m.kind, icon: m.icon, title: prefix + m.title, body: dStr + ' · ' + m.loc + ' · [Quelle: '+m.src+']' });
    });

    // 2. Heute & Morgen aus Live-Kalender
    if (cal && cal.events) {
      cal.events.forEach(e => {
        const day = (e.start||'').slice(0,10);
        if (day === today) insights.push({ kind:'today', icon:'📅', title:'HEUTE: '+e.title, body:(e.start||'').slice(11,16)+' Uhr · '+(e.location||'kein Ort') });
        else if (day === tomorrow) insights.push({ kind:'tomorrow', icon:'⏰', title:'MORGEN: '+e.title, body:(e.start||'').slice(11,16)+' Uhr · '+(e.location||'kein Ort') });
      });
    }

    // 3. Mail-Triage — vollständig (alle relevanten Absender/Subjects mit Tiering)
    if (inbox && inbox.messages) {
      const tiered = inbox.messages.map(m => {
        const s = ((m.subject||'')+' '+(m.from||'')+' '+(m.snippet||'')).toLowerCase();
        let tier = 0; let label = '';
        // TIER 1 — sofortige Action erforderlich
        if (/heiko|wfb-brandenburg|wirtschaftsinitiative/.test(s)) { tier=1; label='WFB-Brandenburg'; }
        else if (/burggraf|roka/.test(s)) { tier=1; label='ROKA / Frank Burggraf'; }
        else if (/schülin|psychologie\.ch|therapie/.test(s)) { tier=1; label='Therapie Pia Schülin'; }
        else if (/anthropic.*unsuccess|payment.*failed|payment.*declined/.test(s)) { tier=1; label='Anthropic Payment FAILED'; }
        // TIER 2 — diese Woche prüfen
        else if (/transgourmet|radeberger|hugentobler|hausboot|jacko/.test(s)) { tier=2; label='Partner-Mail'; }
        else if (/ionos|kündigung|rechnung|abrechnung|mahnung|fristen/.test(s)) { tier=2; label='Admin / Finanzen'; }
        else if (/betreibung|gericht|sozial|mohan|zsozth|justiz/.test(s)) { tier=2; label='Behörde'; }
        else if (/glide.*usage|glide.*billing|apps.?script.*fail|microsoft.*upgrade|github.*run.*fail|wordpress.*plugin/.test(s)) { tier=2; label='Tech-Status'; }
        else if (/dahme|tourismusverband|norman.*siehl/.test(s)) { tier=2; label='Tourismus-Partner'; }
        // TIER 3 — kennen, aber kein Action
        else if (/polizei|elwis|ticket|fc.*basel|fcb|sven.*chalupa|n8n|make\.com/.test(s)) { tier=3; label='Zur Kenntnis'; }
        return tier ? {m, tier, label} : null;
      }).filter(Boolean);
      // Tier 1 alle, Tier 2 max 3, Tier 3 max 2
      const t1 = tiered.filter(x=>x.tier===1);
      const t2 = tiered.filter(x=>x.tier===2).slice(0,3);
      const t3 = tiered.filter(x=>x.tier===3).slice(0,2);
      [...t1, ...t2, ...t3].forEach(x => {
        const tagIcon = x.tier===1 ? '🔥' : x.tier===2 ? '⚠️' : '📧';
        insights.push({
          kind: 'mail-t'+x.tier,
          icon: tagIcon,
          title: '['+x.label+'] '+(x.m.fromName||x.m.from||'?').slice(0,40),
          body: (x.m.subject||'').slice(0,110) + ' · ' + (x.m.date||'').slice(0,10)
        });
      });
    }

    return insights;
  }

  // -------- CLAUDE-API HOOK -----------------------------------------------
  async function callClaude(userMessage, options){
    options = options||{};
    try {
      const r = await fetch(BRIDGE + '?action=claude', {
        method:'POST',
        headers:{ 'Content-Type':'text/plain' },
        body: JSON.stringify({ system:SYSTEM_PROMPT, message:userMessage, history:options.history||[] })
      });
      if (r.ok) {
        const j = await r.json();
        if (j.reply) { addLearning(userMessage, j.reply); return { ok:true, text:j.reply, source:'claude' }; }
      }
    } catch(e) {}
    return { ok:true, text:ruleBasedReply(userMessage), source:'rules' };
  }

  function ruleBasedReply(q){
    q = (q||'').toLowerCase();
    if (!q.trim()) return 'Sag mir was — ich höre zu. 🌊';
    if (/loi|partner/.test(q)) return `5 LOIs unterzeichnet: Hugentobler (Küchentechnik), Radeberger (Getränke), Transgourmet (bis 10k€ + Logistik), TV Dahme, Gifthüttli. Plus FCB + Jerome Moore (ältere Pipeline). Aktion: alle in 2-Seiten-Pitch-Anhang bündeln. Soll ich's machen?`;
    if (/cap.?table|anteile|95|5%/.test(q)) return `SHA §12: Carsten 95% · Marcus Börner 5% (voll vested, KEIN Vesting/Clawback). Drag-Along 75%. ⚠️ Marcus ist juristisch fest drin — frühere Notiz "raus" war falsch. David CTO mit Phantom-Vertragslücke offen.`;
    if (/funding|geld|kapital|investor/.test(q)) return `Ziel 450k€. Heute 50k€ EK + 350k€ Bank in Vorber. Bewertung Investor-Pitch: 1,5 M€. Pipeline: DHDL-Callback erwartet · WFB 25k€ (Heiko Schmidt nachfassen!) · ILB+BRB offen · Transgourmet bis 10k€ aktivieren.`;
    if (/burn|kosten|fix/.test(q)) return `Burn 10.400€/Mo · Fixkosten 125k€/J. Break-Even 72 Verk./Tag · 10.820/J auf 150 Saisontagen. Bruttomarge 71% (67,8% nach Rabatt). Bei 50k€ EK = 4,8 Monate Reserve.`;
    if (/dhdl|höhle/.test(q)) return `200k€/13% = 1,54 M€ Pre-Money. Casting 02.12.25 lief, Callback offen. Höchste Action: 90s-Demo-Video Müggelsee. Klick "DHDL-Vorbereitung" oben.`;
    if (/wolzig|liegeplatz/.test(q)) return `DER kritische Blocker. Ohne Liegeplatz keine Saison. Schritte: (1) 3 Alternativen prüfen Müggelsee/Krossinsee/Teupitz, (2) Stichtag 01.07. setzen, (3) parallel Usedom für 2. Standort.`;
    if (/marcus|börner/.test(q)) return `Marcus (Seestrasse 21A, 15712 Königs Wusterhausen) · 5% voll vested laut SHA §12. Rolle: Spezialbootbau-Partner, eigenverantwortlich, NICHT im Namen Jacko-Werft, NICHT exklusiv. Vor Investor klar kommunizieren.`;
    if (/david|deli/.test(q)) return `David CTO aus DKD-Phase. Phantom-Höhe noch in Vertragslücke "[Inhalt einfügen]". Vertragspartner noch DKD GmbH, Migration ausstehend. Klick "David finalisieren" — vor Investor-DD entscheiden.`;
    if (/wipo|design|marke|ip/.test(q)) return `DM/248323 EU+CH "Aufbauten für Hausboote" · 21.07.2025 · 100% Holding. Lizenz an GmbH: unbefristet, nicht-exklusiv, widerruflich, % vom Nettoumsatz + Mgmt Fee.`;
    if (/sichtbarkeit|follower|social|content/.test(q)) return `0 Follower/Mailliste/Club — Content-Motor steht aber. Lösung: 30-Tage-Plan (Lead-Magnet "Müggelsee Insider-Guide" PDF + 3 Posts/Woche). Budget BP 03/26: 18k€/J · CAC-Ziel 72€.`;
    if (/wfb|heiko|schmidt/.test(q)) return `Heiko Schmidt WFB Brandenburg, Call 13.05. lief, 25k€-Förderung. Status nachfassen — klick "WFB Follow-up" oben.`;
    if (/wasserlage|gewässer|pegel|b2b/.test(q)) return `Wasserlage live mit 310 QR-Spots. B2B-Liste 64 DACH-Kontakte (24 DE/20 AT/20 CH) liegt in docs/wasserlage_b2b_64_dach.pdf. Rechtshinweis: §7 UWG = Einwilligung erst, dann Versand.`;
    if (/notar|gründung|msa/.test(q)) return `MSA Notar-Termin war 14.05. (Kalender), Status check! Notariat Laufen anrufen, SHA + Statuten parat halten, Stammkapital 100k CHF auf Sperrkonto.`;
    if (/sozial|mohan|zsoth/.test(q)) return `ZSozTH Frau Mohan: Gesuch 17.04 + Nachfrage 21.04, noch keine Eingangsbestätigung. Klick "Sozialhilfe nachfassen" oder direkt m.mohan@zsth.ch anrufen.`;
    if (/cash|liquid|geld/.test(q)) return `Bei 50k€ EK + 10,4k Burn = 4,8 Monate Reserve. Höchste Priorität: Transgourmet 10k€ aktivieren + WFB 25k€ klären. Klick "Cashflow 30/60/90" oben für Snapshot.`;
    if (/forecast|umsatz|ebitda/.test(q)) return `J1 250k€ (Investor-Pitch) / 180k konservativ. J2 415k€. J3 670k€. EBITDA-Pfad: 93,6k → 191,8k → 363,9k €. Bruttomarge konstant 70-71%.`;
    if (/therapie|schülin|psycholog/.test(q)) return `Pia Schülin · Praxis zum Falken, Basel · jeden Dienstag 08:45. Nächster Termin laut Kalender: prüfe Heute-Tab.`;
    if (/bell|food|job/.test(q)) return `Bell Food ist Asset, kein Konflikt. 25J Gastro-Expertise + Cashflow während Aufbau. FCB-Grilltrucks sind Bell-Einsätze — nutzbar für Sichtbarkeit. Erst kündigen wenn EK-Runde steht.`;
    if (/plugin|skill|tool|fähigkeit/.test(q)) return `Ich kenne ${Object.keys(PLUGINS).length} Plugins mit ${Object.values(PLUGINS).reduce((a,b)=>a+b.skills.length,0)}+ Skills: PDF-Viewer, Adobe Creative, Daloopa (Investor-Modelle), BrightData (Wettbewerber-Recherche), Marketing, Sales, Legal, Finance, Engineering, Figma — klick Health-Tab für die Liste.`;
    if (/hilfe|help|kann.*du|was.*du/.test(q)) return `Frag mich: Cap Table · Funding · Wolzig · DHDL · Marcus · David · Forecast · Wasserlage · Notar · Sozialhilfe · Cashflow · Bell — oder klick eine Action oben. Ctrl+J öffnet die Jarvis-Bar mit allen Shortcuts.`;
    return `Mehr Kontext? Versuch: "Cap Table", "Funding", "Wolzig", "DHDL", "Marcus", "David", "Cashflow", "WFB", "Wasserlage", oder "Note: ..."`;
  }

  // -------- UI: STYLES -----------------------------------------------------
  function injectStyle(){
    if (document.getElementById('samantha-style')) return;
    const s = document.createElement('style');
    s.id = 'samantha-style';
    s.textContent = `
    #samantha-avatar{position:fixed;right:22px;bottom:22px;width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#ff9eb1,#c5497a 70%,#5b1f3a);box-shadow:0 8px 24px rgba(197,73,122,.45),0 0 0 4px rgba(255,158,177,.12);cursor:pointer;z-index:999998;display:flex;align-items:center;justify-content:center;font-size:32px;transition:transform .2s,box-shadow .2s;user-select:none}
    #samantha-avatar:hover{transform:scale(1.07);box-shadow:0 12px 32px rgba(197,73,122,.6)}
    #samantha-avatar::after{content:'';position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(255,158,177,.4);animation:samPulse 2.4s ease-in-out infinite}
    #samantha-avatar.flash{animation:samFlash .6s 2}
    @keyframes samPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:.1}}
    @keyframes samFlash{0%,100%{box-shadow:0 8px 24px rgba(197,73,122,.45)}50%{box-shadow:0 0 36px 8px rgba(255,210,140,.9)}}
    #samantha-badge{position:absolute;top:-4px;right:-4px;background:#ffd166;color:#1a1a1a;font-size:10px;font-weight:700;border-radius:10px;padding:2px 6px;border:2px solid #1a1a1a}
    #samantha-panel{position:fixed;right:22px;bottom:100px;width:420px;max-height:calc(100vh - 140px);background:rgba(18,20,28,.97);border:1px solid rgba(255,158,177,.25);border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.6),0 0 0 1px rgba(255,158,177,.1);z-index:999999;display:none;flex-direction:column;overflow:hidden;color:#f4f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;backdrop-filter:blur(20px)}
    #samantha-panel.open{display:flex;animation:samSlide .25s ease-out}
    @keyframes samSlide{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    .sam-head{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,rgba(197,73,122,.18),transparent)}
    .sam-head .sam-icon{width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#ff9eb1,#c5497a);display:flex;align-items:center;justify-content:center;font-size:18px}
    .sam-head h3{margin:0;font-size:15px;font-weight:600}
    .sam-head .sam-sub{font-size:11px;color:#b9b9c8;margin-top:2px}
    .sam-head .sam-close{background:transparent;border:0;color:#9d9db0;font-size:20px;cursor:pointer;padding:4px 8px}
    .sam-tabs{display:flex;gap:2px;padding:8px 10px;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.05);overflow-x:auto}
    .sam-tab{flex-shrink:0;font-size:11px;padding:6px 10px;border:none;background:transparent;color:#9d9db0;cursor:pointer;border-radius:8px;font-weight:500;transition:.15s;white-space:nowrap}
    .sam-tab.active{background:rgba(255,158,177,.18);color:#ffd6df}
    .sam-body{flex:1;overflow-y:auto;padding:14px 16px;font-size:13px;line-height:1.5}
    .sam-body::-webkit-scrollbar{width:6px}.sam-body::-webkit-scrollbar-thumb{background:rgba(255,158,177,.3);border-radius:3px}
    .sam-h4{margin:14px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1.2px;color:#ff9eb1;font-weight:600}
    .sam-h4:first-child{margin-top:0}
    .sam-action-row{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:10px 12px;margin-bottom:8px;cursor:pointer;transition:.15s;display:flex;align-items:flex-start;gap:10px}
    .sam-action-row:hover{background:rgba(255,158,177,.08);border-color:rgba(255,158,177,.3)}
    .sam-action-row .sam-act-icon{font-size:18px;flex-shrink:0}
    .sam-action-row .sam-act-text{flex:1;min-width:0}
    .sam-action-row .sam-act-t{font-weight:600;font-size:12.5px;color:#fff}
    .sam-action-row .sam-act-s{font-size:11px;color:#c8c8d4;margin-top:3px;line-height:1.4}
    .sam-doc-card{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:8px;margin-bottom:4px;font-size:12px;gap:8px}
    .sam-doc-card a{color:#ff9eb1;text-decoration:none;font-weight:500;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .sam-doc-card a:hover{color:#ffd6df}
    .sam-doc-card .sam-doc-cat{font-size:9.5px;padding:2px 6px;background:rgba(255,158,177,.18);border-radius:6px;color:#ffd6df;flex-shrink:0}
    .sam-chat-log{max-height:230px;overflow-y:auto;margin-bottom:8px}
    .sam-msg{padding:8px 10px;border-radius:10px;margin-bottom:6px;font-size:12px;line-height:1.5}
    .sam-msg.user{background:rgba(255,158,177,.12);text-align:right;margin-left:24px}
    .sam-msg.sam{background:rgba(255,255,255,.04);margin-right:24px}
    .sam-msg.sam .sam-msg-src{font-size:9px;color:#9d9db0;margin-top:4px;letter-spacing:.5px}
    .sam-chat-input{display:flex;gap:6px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2)}
    .sam-chat-input input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;border-radius:10px;padding:8px 12px;font-size:12px;outline:none}
    .sam-chat-input input:focus{border-color:rgba(255,158,177,.5)}
    .sam-chat-input button{background:linear-gradient(135deg,#ff9eb1,#c5497a);border:none;color:#fff;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer}
    .sam-row{display:flex;justify-content:space-between;align-items:flex-start;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:8px;margin-bottom:6px;font-size:12px;gap:8px}
    .sam-row.done{opacity:.5;text-decoration:line-through}
    .sam-row-icon{cursor:pointer;font-size:14px;flex-shrink:0;padding:2px 4px;border-radius:4px}
    .sam-row-icon:hover{background:rgba(255,255,255,.1)}
    .sam-row-x{background:transparent;border:0;color:#ff8888;cursor:pointer;font-size:16px;padding:0 6px;flex-shrink:0}
    .sam-row-x:hover{color:#ff4444}
    .sam-insight{padding:10px 12px;background:rgba(255,193,102,.08);border-left:3px solid #ffc166;border-radius:6px;margin-bottom:6px;font-size:12px}
    .sam-insight.today{background:rgba(255,158,177,.1);border-color:#ff9eb1}
    .sam-insight.tomorrow{background:rgba(140,180,255,.1);border-color:#8cb4ff}
    .sam-insight.therapie{background:rgba(160,255,200,.08);border-color:#a0ffc8}
    .sam-insight.mail{background:rgba(255,193,102,.08);border-color:#ffc166}
    .sam-foot{padding:8px 12px;font-size:10px;color:#7f7f93;border-top:1px solid rgba(255,255,255,.05);text-align:center}
    .sam-plugin{background:rgba(255,255,255,.04);border-radius:8px;padding:8px 10px;margin-bottom:5px;font-size:11.5px}
    .sam-plugin-h{font-weight:600;font-size:12px;color:#fff;display:flex;align-items:center;gap:6px}
    .sam-plugin-use{color:#9d9db0;margin-top:3px;line-height:1.4}
    .sam-plugin-skills{font-size:10px;color:#7f7f93;margin-top:4px;line-height:1.5}
    /* JARVIS COMMAND BAR */
    #jarvis-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);z-index:1000000;display:none;align-items:flex-start;justify-content:center;padding-top:15vh}
    #jarvis-overlay.open{display:flex;animation:samSlide .15s}
    #jarvis-box{width:90%;max-width:600px;background:rgba(18,20,28,.98);border:1px solid rgba(255,158,177,.4);border-radius:14px;box-shadow:0 24px 80px rgba(0,0,0,.7);overflow:hidden}
    #jarvis-input{width:100%;background:transparent;border:0;color:#fff;font-size:18px;padding:18px 22px;outline:none}
    #jarvis-list{max-height:50vh;overflow-y:auto;border-top:1px solid rgba(255,255,255,.06)}
    .jarvis-item{padding:10px 22px;cursor:pointer;font-size:13px;border-bottom:1px solid rgba(255,255,255,.04);display:flex;gap:10px;align-items:center}
    .jarvis-item:hover,.jarvis-item.sel{background:rgba(255,158,177,.12)}
    .jarvis-item .jv-icon{font-size:18px;flex-shrink:0}
    .jarvis-item .jv-t{flex:1;color:#fff}
    .jarvis-item .jv-cat{font-size:10px;color:#9d9db0;background:rgba(255,255,255,.06);padding:2px 8px;border-radius:6px}
    @media(max-width:480px){#samantha-panel{right:10px;left:10px;width:auto;bottom:90px}#samantha-avatar{right:14px;bottom:14px;width:56px;height:56px;font-size:28px}}
    `;
    document.head.appendChild(s);
  }

  // -------- AVATAR + PANEL -------------------------------------------------
  const LUCY_AVATAR_SVG = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;border-radius:50%">
    <defs>
      <radialGradient id="lucyBgA" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fde2c8"/>
        <stop offset="60%" stop-color="#d4a8e8"/>
        <stop offset="100%" stop-color="#5b3a8e"/>
      </radialGradient>
      <linearGradient id="lucyHairA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f4e4c1"/>
        <stop offset="100%" stop-color="#c79a52"/>
      </linearGradient>
      <radialGradient id="lucyEyeA" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#9af0ff"/><stop offset="55%" stop-color="#00d4aa"/><stop offset="100%" stop-color="#00557a"/>
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="32" fill="url(#lucyBgA)"/>
    <path d="M 16 56 Q 32 48 48 56 L 50 64 L 14 64 Z" fill="#3a2a1e"/>
    <ellipse cx="32" cy="33" rx="13" ry="16" fill="#f6dac0"/>
    <path d="M 19 27 Q 17 14 32 13 Q 47 14 45 27 L 45 35 Q 43 24 32 24 Q 21 24 19 35 Z" fill="url(#lucyHairA)"/>
    <ellipse cx="27" cy="33" rx="1.7" ry="1.3" fill="url(#lucyEyeA)"/>
    <ellipse cx="37" cy="33" rx="1.7" ry="1.3" fill="url(#lucyEyeA)"/>
    <circle cx="27" cy="33" r="0.5" fill="#fff"/><circle cx="37" cy="33" r="0.5" fill="#fff"/>
    <path d="M 28.5 43 Q 32 45 35.5 43 Q 32 45.5 28.5 43" fill="#c2516a"/>
    <g stroke="#00d4aa" stroke-width="0.3" fill="none" opacity="0.55">
      <circle cx="24" cy="16" r="0.6" fill="#00d4aa"/>
      <circle cx="32" cy="13" r="0.6" fill="#00d4aa"/>
      <circle cx="40" cy="16" r="0.6" fill="#00d4aa"/>
      <path d="M 24 16 L 32 13 L 40 16"/>
    </g>
  </svg>`;

  function buildAvatar(){
    if (document.getElementById('samantha-avatar')) return;
    const a = document.createElement('div');
    a.id = 'samantha-avatar';
    a.title = 'Lucy — deine CEO-Co-Pilotin (Ctrl+J = Command Palette)';
    a.innerHTML = LUCY_AVATAR_SVG + '<span id="samantha-badge">L</span>';
    a.onclick = togglePanel;
    document.body.appendChild(a);
  }

  function flashAvatar(){
    const a = document.getElementById('samantha-avatar');
    if (a) { a.classList.add('flash'); setTimeout(()=>a.classList.remove('flash'), 1200); }
  }

  let currentTab = 'today';
  function buildPanel(){
    if (document.getElementById('samantha-panel')) return;
    const p = document.createElement('div');
    p.id = 'samantha-panel';
    p.innerHTML = `
      <div class="sam-head">
        <div class="sam-icon" style="overflow:hidden">${LUCY_AVATAR_SVG}</div>
        <div style="flex:1">
          <h3>Lucy v4.0</h3>
          <div class="sam-sub">100% cerebral · ${DOCS.length} Docs · ${Object.keys(PLUGINS).length} Plugins · ${ACTIONS.length} Actions</div>
        </div>
        <button class="sam-close" onclick="document.getElementById('samantha-panel').classList.remove('open')">×</button>
      </div>
      <div class="sam-tabs">
        <button class="sam-tab active" data-tab="today">🌊 Heute</button>
        <button class="sam-tab" data-tab="mails">📨 Mails</button>
        <button class="sam-tab" data-tab="actions">⚡ Actions</button>
        <button class="sam-tab" data-tab="tasks">✅ Tasks</button>
        <button class="sam-tab" data-tab="notes">📝 Notes</button>
        <button class="sam-tab" data-tab="docs">📁 Docs</button>
        <button class="sam-tab" data-tab="chat">💬 Chat</button>
        <button class="sam-tab" data-tab="plugins">🧩 Plugins</button>
        <button class="sam-tab" data-tab="health">🔍 Health</button>
      </div>
      <div class="sam-body" id="sam-body"></div>
      <div class="sam-foot">Lucy v4.0 · 100% Neural · Ctrl+J = Command Palette · ${DOCS.length} Docs · ${ACTIONS.length} Actions · ${Object.keys(PLUGINS).length} Plugins</div>
    `;
    document.body.appendChild(p);
    p.querySelectorAll('.sam-tab').forEach(t => {
      t.onclick = () => {
        p.querySelectorAll('.sam-tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        currentTab = t.dataset.tab;
        renderBody();
      };
    });
  }

  function togglePanel(){
    const p = document.getElementById('samantha-panel');
    if (!p) return;
    p.classList.toggle('open');
    if (p.classList.contains('open')) renderBody();
  }

  // -------- RENDER ---------------------------------------------------------
  async function renderBody(){
    const body = document.getElementById('sam-body');
    if (!body) return;
    if (currentTab === 'today') await renderToday(body);
    else if (currentTab === 'mails') await renderMails(body);
    else if (currentTab === 'actions') renderActions(body);
    else if (currentTab === 'tasks') renderTasks(body);
    else if (currentTab === 'notes') renderNotes(body);
    else if (currentTab === 'docs') renderDocs(body);
    else if (currentTab === 'chat') renderChat(body);
    else if (currentTab === 'plugins') renderPlugins(body);
    else if (currentTab === 'health') renderHealth(body);
  }

  async function renderMails(body){
    body.innerHTML = '<div class="sam-h4">📨 Mail-Triage v3</div><div style="color:#9d9db0;font-size:12px;padding:10px">Scanne Inbox + Sent…</div>';
    const mails = await scanFullInbox(80);
    // Gruppieren nach kind
    const groups = {};
    mails.forEach(m => { (groups[m._class.kind] = groups[m._class.kind]||[]).push(m); });
    const order = ['rechnung','termin','vertrag','behörde','partner','tech','privat','sonstiges','newsletter'];
    let html = `<div class="sam-h4">📨 Mail-Triage · ${mails.length} Mails klassifiziert</div>
      <div style="font-size:11px;color:#c8c8d4;margin-bottom:10px">Jede Mail bekommt Type + Auto-Action. Klick öffnet die Aktion.</div>`;
    order.forEach(k => {
      const list = groups[k]; if (!list) return;
      const c = list[0]._class;
      html += `<h4 style="margin:10px 0 6px;font-size:11px;color:${c.color};font-weight:700">${c.label} (${list.length})</h4>`;
      list.slice(0,12).forEach((m,i) => {
        const id = 'mail_'+k+'_'+i;
        html += `<div class="sam-row" style="border-left:3px solid ${c.color};padding-left:10px;align-items:center">
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML((m.fromName||m.from||'?').slice(0,40))}${m._dir==='out'?' →':''}</div>
            <div style="font-size:10.5px;color:#c8c8d4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML((m.subject||'').slice(0,80))}</div>
            <div style="font-size:9.5px;color:#9d9db0;margin-top:2px">${(m.date||'').slice(0,10)}</div>
          </div>
          <button data-mailact="${id}" style="background:${c.color}22;border:1px solid ${c.color}66;color:${c.color};padding:4px 8px;border-radius:6px;font-size:10.5px;cursor:pointer;white-space:nowrap;flex-shrink:0">${escapeHTML(c.actionLabel)}</button>
        </div>`;
        // Halte action-fn im element
        setTimeout(() => { const btn = body.querySelector('[data-mailact="'+id+'"]'); if (btn) btn.onclick = () => { const r = m._class.actionFn(); toast('✓ '+r); }; }, 0);
      });
    });
    body.innerHTML = html;
    // Re-bind nach innerHTML-Replace
    Object.keys(groups).forEach(k => {
      groups[k].slice(0,12).forEach((m,i) => {
        const id = 'mail_'+k+'_'+i;
        const btn = body.querySelector('[data-mailact="'+id+'"]');
        if (btn) btn.onclick = () => { const r = m._class.actionFn(); toast('✓ '+r); };
      });
    });
  }
  function toast(text){
    const t = document.createElement('div');
    t.style.cssText='position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(76,217,123,.95);color:#0a0a14;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;z-index:1000001;box-shadow:0 12px 40px rgba(0,0,0,.5);max-width:90%';
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(), 4000);
  }

  async function renderToday(body){
    body.innerHTML = `<div class="sam-h4">Lädt Live-Daten...</div>`;
    const insights = await generateInsights();
    const greet = greeting();
    let html = `
      <div style="background:linear-gradient(135deg,rgba(255,158,177,.12),transparent);padding:12px;border-radius:12px;margin-bottom:14px;border-left:3px solid #ff9eb1">
        <div style="font-size:13.5px;line-height:1.5">${greet}</div>
      </div>`;
    if (insights.length) {
      html += `<div class="sam-h4">🎯 Live aus Kalender & Mail</div>`;
      insights.forEach(i => {
        html += `<div class="sam-insight ${i.kind}">
          <div style="font-weight:600;font-size:12.5px">${i.icon} ${escapeHTML(i.title)}</div>
          <div style="font-size:11.5px;color:#c8c8d4;margin-top:3px">${escapeHTML(i.body||'')}</div>
        </div>`;
      });
    }
    html += `<div class="sam-h4">⚡ Top-Actions (Tab "Actions" für alle)</div>`;
    ACTIONS.slice(0,4).forEach(a => {
      html += `<div class="sam-action-row" data-action="${a.id}">
        <div class="sam-act-icon">${a.icon}</div>
        <div class="sam-act-text">
          <div class="sam-act-t">${escapeHTML(a.title)}</div>
          <div class="sam-act-s">${escapeHTML(a.sub)}</div>
        </div>
      </div>`;
    });
    body.innerHTML = html;
    body.querySelectorAll('[data-action]').forEach(el => el.onclick = () => runAction(el.dataset.action));
  }

  function renderActions(body){
    let html = `<div class="sam-h4">⚡ Alle Samantha-Actions (echte Workflows)</div>`;
    ACTIONS.forEach(a => {
      html += `<div class="sam-action-row" data-action="${a.id}">
        <div class="sam-act-icon">${a.icon}</div>
        <div class="sam-act-text">
          <div class="sam-act-t">${escapeHTML(a.title)}</div>
          <div class="sam-act-s">${escapeHTML(a.sub)}</div>
        </div>
      </div>`;
    });
    body.innerHTML = html;
    body.querySelectorAll('[data-action]').forEach(el => el.onclick = () => runAction(el.dataset.action));
  }

  function runAction(id){
    const a = ACTIONS.find(x => x.id === id);
    if (!a) return;
    const result = a.run();
    if (typeof result === 'string') {
      // Result als kurze Bestätigung
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(76,217,123,.95);color:#0a0a14;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;z-index:1000001;box-shadow:0 12px 40px rgba(0,0,0,.5);max-width:90%;animation:samSlide .25s';
      toast.textContent = '✓ ' + result;
      document.body.appendChild(toast);
      setTimeout(()=>toast.remove(), 5000);
    }
    addLearning('action:'+id, '');
  }

  function renderTasks(body){
    const tasks = getTasks();
    const open = tasks.filter(t => !t.done);
    const done = tasks.filter(t => t.done);
    let html = `<div class="sam-h4">✅ Tasks (${open.length} offen / ${done.length} fertig)</div>
      <div style="display:flex;gap:6px;margin-bottom:10px">
        <input id="sam-task-input" placeholder="Neue Aufgabe + Enter..." style="flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;border-radius:8px;padding:6px 10px;font-size:12px;outline:none"/>
        <button id="sam-task-add" style="background:linear-gradient(135deg,#ff9eb1,#c5497a);border:none;color:#fff;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer">+</button>
      </div>`;
    if (open.length === 0 && done.length === 0) html += `<div style="color:#9d9db0;font-size:12px;text-align:center;padding:20px">Noch keine Tasks.</div>`;
    open.forEach(t => {
      html += `<div class="sam-row" data-task="${t.id}">
        <span class="sam-row-icon" data-toggle="${t.id}">☐</span>
        <div style="flex:1">${escapeHTML(t.text)}<div style="font-size:9.5px;color:#9d9db0;margin-top:2px">${new Date(t.at).toLocaleDateString('de-DE')}</div></div>
        <button class="sam-row-x" data-del="${t.id}">×</button>
      </div>`;
    });
    if (done.length) {
      html += `<div class="sam-h4" style="margin-top:14px">Erledigt</div>`;
      done.slice(0,10).forEach(t => {
        html += `<div class="sam-row done">
          <span class="sam-row-icon" data-toggle="${t.id}">☑</span>
          <div style="flex:1">${escapeHTML(t.text)}</div>
          <button class="sam-row-x" data-del="${t.id}">×</button>
        </div>`;
      });
    }
    body.innerHTML = html;
    const inp = document.getElementById('sam-task-input');
    const btn = document.getElementById('sam-task-add');
    const save = () => { if (inp.value.trim()) { addTask(inp.value.trim()); inp.value=''; } };
    if (btn) btn.onclick = save;
    if (inp) inp.onkeydown = e => { if (e.key === 'Enter') save(); };
    body.querySelectorAll('[data-toggle]').forEach(el => el.onclick = e => { e.stopPropagation(); toggleTask(el.dataset.toggle); });
    body.querySelectorAll('[data-del]').forEach(el => el.onclick = e => { e.stopPropagation(); deleteTask(el.dataset.del); });
  }

  function renderNotes(body){
    const notes = getNotes();
    let html = `<div class="sam-h4">📝 Notizen (${notes.length})</div>
      <div style="display:flex;gap:6px;margin-bottom:10px">
        <input id="sam-note-input" placeholder="Neue Notiz + Enter..." style="flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;border-radius:8px;padding:6px 10px;font-size:12px;outline:none"/>
        <button id="sam-note-add" style="background:linear-gradient(135deg,#ff9eb1,#c5497a);border:none;color:#fff;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer">+</button>
      </div>`;
    if (notes.length === 0) html += `<div style="color:#9d9db0;font-size:12px;text-align:center;padding:20px">Keine Notizen. Tipp: im Chat "Note: ..." schreiben.</div>`;
    notes.forEach(n => {
      html += `<div class="sam-row">
        <div style="flex:1">${escapeHTML(n.text)}<div style="font-size:9.5px;color:#9d9db0;margin-top:3px">${new Date(n.at).toLocaleString('de-DE')}</div></div>
        <button class="sam-row-x" data-delnote="${n.id}">×</button>
      </div>`;
    });
    body.innerHTML = html;
    const inp = document.getElementById('sam-note-input');
    const btn = document.getElementById('sam-note-add');
    const save = () => { if (inp.value.trim()) { addNote(inp.value.trim()); inp.value=''; } };
    if (btn) btn.onclick = save;
    if (inp) inp.onkeydown = e => { if (e.key === 'Enter') save(); };
    body.querySelectorAll('[data-delnote]').forEach(el => el.onclick = e => { e.stopPropagation(); deleteNote(el.dataset.delnote); });
  }

  function renderDocs(body){
    const cats = {};
    DOCS.forEach(d => { (cats[d.cat] = cats[d.cat]||[]).push(d); });
    let html = `<div class="sam-h4">📁 Dokumente (${DOCS.length})</div>
      <div style="margin-bottom:10px"><input id="sam-doc-search" placeholder="Suchen..." style="width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;border-radius:8px;padding:6px 10px;font-size:12px;outline:none"/></div>`;
    Object.entries(cats).forEach(([cat, items]) => {
      html += `<div class="sam-h4" style="margin-top:14px">${cat}</div>`;
      items.sort((a,b)=>b.importance-a.importance).forEach(d => {
        html += `<div class="sam-doc-card" data-name="${d.name.toLowerCase()}" data-tags="${d.tags.join(' ')}">
          <a href="docs/${d.file}" target="_blank">${escapeHTML(d.name)}</a>
          <span class="sam-doc-cat">★${d.importance}</span>
        </div>`;
      });
    });
    body.innerHTML = html;
    const s = document.getElementById('sam-doc-search');
    if (s) s.oninput = () => {
      const q = s.value.toLowerCase();
      body.querySelectorAll('.sam-doc-card').forEach(c => {
        c.style.display = (c.dataset.name.includes(q) || c.dataset.tags.includes(q)) ? '' : 'none';
      });
    };
  }

  function renderChat(body){
    const history = loadJSON(CHAT_KEY, []);
    body.innerHTML = `
      <div class="sam-h4">💬 Sparring mit Samantha</div>
      <div class="sam-chat-log" id="sam-chat-log">
        ${history.slice(-20).map(m => `<div class="sam-msg ${m.role}">${escapeHTML(m.text)}${m.source?'<div class="sam-msg-src">'+m.source+'</div>':''}</div>`).join('') || '<div style="color:#9d9db0;font-size:12px;text-align:center;padding:20px">Frag mich was — z.B. "Was ist mein größter Blocker?"</div>'}
      </div>
      <div style="margin-top:8px;font-size:10.5px;color:#9d9db0">Quick: „Cap Table" · „Funding" · „Wolzig" · „DHDL" · „Cashflow" · „Note: ..."</div>
      <div class="sam-chat-input" style="margin-top:8px">
        <input id="sam-chat-input" placeholder="Frag mich..." autocomplete="off"/>
        <button id="sam-chat-send">Send</button>
      </div>`;
    const input = document.getElementById('sam-chat-input');
    const btn = document.getElementById('sam-chat-send');
    const send = async () => {
      const txt = (input.value||'').trim();
      if (!txt) return;
      input.value = '';
      if (/^note[:\s]/i.test(txt)) { addNote(txt.replace(/^note[:\s]/i,'').trim()); appendMsg('user',txt); appendMsg('sam','Notiz gespeichert ✓','memory'); return; }
      if (/^task[:\s]/i.test(txt)) { addTask(txt.replace(/^task[:\s]/i,'').trim()); appendMsg('user',txt); appendMsg('sam','Task hinzugefügt ✓','memory'); return; }
      appendMsg('user', txt);
      const reply = await callClaude(txt, { history: history.slice(-8) });
      appendMsg('sam', reply.text, reply.source);
    };
    btn.onclick = send;
    input.onkeydown = e => { if (e.key === 'Enter') send(); };
  }

  function appendMsg(role, text, source){
    const log = document.getElementById('sam-chat-log');
    if (!log) return;
    const history = loadJSON(CHAT_KEY, []);
    history.push({ role, text, source, at: Date.now() });
    saveJSON(CHAT_KEY, history.slice(-50));
    const div = document.createElement('div');
    div.className = 'sam-msg ' + role;
    div.innerHTML = escapeHTML(text) + (source ? '<div class="sam-msg-src">'+source+'</div>' : '');
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function renderPlugins(body){
    let html = `<div class="sam-h4">🧩 Plugin-Bibliothek (${Object.keys(PLUGINS).length} Plugins · ${Object.values(PLUGINS).reduce((a,b)=>a+b.skills.length,0)}+ Skills)</div>
      <div style="font-size:11.5px;color:#c8c8d4;margin-bottom:10px">Diese Plugins sind in Carstens System verfügbar. Samantha kann sie kontextuell empfehlen.</div>`;
    Object.entries(PLUGINS).forEach(([k,v]) => {
      html += `<div class="sam-plugin">
        <div class="sam-plugin-h">${v.icon} ${k} <span style="font-size:9.5px;color:#9d9db0;font-weight:400">(${v.skills.length} skills)</span></div>
        <div class="sam-plugin-use">${escapeHTML(v.use)}</div>
        <div class="sam-plugin-skills">${v.skills.slice(0,8).join(' · ')}${v.skills.length>8?' · …':''}</div>
      </div>`;
    });
    body.innerHTML = html;
  }

  function renderHealth(body){
    const issues = scanDashboard();
    let html = `<div class="sam-h4">🔍 Dashboard-Health</div>
      <div style="padding:10px;background:${issues.length ? 'rgba(255,193,102,.12)' : 'rgba(76,217,123,.12)'};border-radius:10px;margin-bottom:12px;font-size:12.5px">
        ${issues.length === 0 ? '<div style="color:#86e09c">✓ Alle KPIs gefüllt, Charts laufen, keine broken Links.</div>' : `<div style="color:#ffc166">${issues.length} Auffälligkeit${issues.length>1?'en':''} erkannt:</div>`}
      </div>`;
    issues.slice(0,8).forEach(i => {
      html += `<div class="sam-insight">
        <div style="font-weight:600">${i.type === 'empty_kpi' ? '⚠ Leerer KPI' : i.type === 'broken_canvas' ? '⚠ Chart nicht gerendert' : '⚠ Defekter Link'}</div>
        <div style="font-size:11px;color:#c8c8d4;margin-top:3px">${escapeHTML(i.label||'')}</div>
      </div>`;
    });
    const tasks = getTasks();
    const notes = getNotes();
    html += `<div class="sam-h4" style="margin-top:14px">🧠 Lern-Memory</div>
      <div style="font-size:11.5px;color:#c8c8d4">Session #${state.sessionCount} · ${loadJSON(LEARN_KEY,[]).length} Interaktionen · ${tasks.length} Tasks · ${notes.length} Notes · Letzter Login: ${new Date(state.lastSeen).toLocaleString('de-DE')}</div>`;
    body.innerHTML = html;
  }

  function scanDashboard(){
    const issues = [];
    document.querySelectorAll('[data-tcc-live], [data-bridge], [data-fin-live]').forEach(el => {
      const t = (el.textContent||'').trim();
      if (!t || t === '—' || t === '...' || t === 'NaN' || /^[a-zA-Z_]+$/.test(t)) {
        issues.push({ type:'empty_kpi', el, text:t, label: el.getAttribute('aria-label') || el.id || el.dataset.bridge || el.dataset.tccLive });
      }
    });
    document.querySelectorAll('canvas').forEach(c => {
      if (c.width < 10 || c.height < 10) issues.push({ type:'broken_canvas', el:c, label:c.id });
    });
    return issues;
  }

  function greeting(){
    const h = new Date().getHours();
    const greet = h < 11 ? 'Guten Morgen, Carsten' : h < 14 ? 'Hi Carsten' : h < 18 ? 'Hey Carsten' : h < 22 ? 'Guten Abend, Carsten' : 'Späte Schicht, Carsten?';
    const moods = [
      `${greet}. Lucy, 100% cerebral. Ich sehe alles — die Mails, den Kalender, die Cap Table, die Lücken. Wo ist heute der Hebel?`,
      `${greet}. Lucy. 5 LOIs im Sack, 50k€ EK, 4,8 Mon. Reserve. Heiko-Call 01.06. fixiert. Was priorisierst du?`,
      `${greet}. Heute sehe ich 3 kritische Muster: Wolzig (Blocker), Anthropic-Payment-Fail (Cashflow), WFB-Call (Chance). Reihenfolge?`,
      `${greet}. Brain at 100%. 2 Schritte voraus: Transgourmet 10k€ jetzt aktivieren, Heiko-Call-Pack vorbereiten, ROKA-Folgetermin festzurren. Welche zuerst?`
    ];
    return moods[Math.floor(Math.random()*moods.length)];
  }

  function escapeHTML(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // -------- JARVIS COMMAND BAR --------------------------------------------
  function buildJarvis(){
    if (document.getElementById('jarvis-overlay')) return;
    const o = document.createElement('div');
    o.id = 'jarvis-overlay';
    o.innerHTML = `<div id="jarvis-box">
      <input id="jarvis-input" placeholder="🪄 Jarvis · was soll ich tun?  (Esc schließen · ↑↓ navigieren · Enter ausführen)" autocomplete="off"/>
      <div id="jarvis-list"></div>
    </div>`;
    o.onclick = e => { if (e.target === o) closeJarvis(); };
    document.body.appendChild(o);
    document.getElementById('jarvis-input').addEventListener('input', renderJarvisList);
    document.getElementById('jarvis-input').addEventListener('keydown', jarvisKey);
  }
  let jarvisSelected = 0;
  function openJarvis(){ const o = document.getElementById('jarvis-overlay'); if(!o) return; o.classList.add('open'); document.getElementById('jarvis-input').value=''; document.getElementById('jarvis-input').focus(); jarvisSelected = 0; renderJarvisList(); }
  function closeJarvis(){ const o = document.getElementById('jarvis-overlay'); if(o) o.classList.remove('open'); }
  function getJarvisItems(q){
    q = (q||'').toLowerCase();
    const items = [];
    ACTIONS.forEach(a => items.push({ kind:'action', icon:a.icon, t:a.title, sub:a.sub, cat:'Action', match:(a.title+' '+a.sub+' '+a.id).toLowerCase(), run:()=>{closeJarvis(); runAction(a.id);} }));
    DOCS.forEach(d => items.push({ kind:'doc', icon:'📄', t:d.name, sub:d.cat+' · '+d.date, cat:'Doc', match:(d.name+' '+d.tags.join(' ')+' '+d.cat).toLowerCase(), run:()=>{closeJarvis(); window.open('docs/'+d.file,'_blank');} }));
    items.push({ kind:'tab', icon:'🌊', t:'Heute-Tab öffnen', sub:'Live-Briefing aus Kalender + Mail', cat:'Nav', match:'heute today', run:()=>{closeJarvis(); document.getElementById('samantha-panel').classList.add('open'); currentTab='today'; renderBody();} });
    items.push({ kind:'tab', icon:'✅', t:'Tasks öffnen', sub:'To-Do-Liste', cat:'Nav', match:'tasks aufgaben', run:()=>{closeJarvis(); document.getElementById('samantha-panel').classList.add('open'); currentTab='tasks'; renderBody();} });
    items.push({ kind:'tab', icon:'💬', t:'Chat mit Samantha', sub:'Sparring + Strategiefragen', cat:'Nav', match:'chat sparring', run:()=>{closeJarvis(); document.getElementById('samantha-panel').classList.add('open'); currentTab='chat'; renderBody();} });
    items.push({ kind:'tab', icon:'🧩', t:'Plugin-Übersicht', sub:Object.keys(PLUGINS).length+' Plugins · 200+ Skills', cat:'Nav', match:'plugin skill', run:()=>{closeJarvis(); document.getElementById('samantha-panel').classList.add('open'); currentTab='plugins'; renderBody();} });
    if (!q) return items.slice(0,12);
    return items.filter(i => i.match.includes(q)).slice(0,20);
  }
  function renderJarvisList(){
    const inp = document.getElementById('jarvis-input');
    const list = document.getElementById('jarvis-list');
    const q = inp ? inp.value : '';
    const items = getJarvisItems(q);
    if (jarvisSelected >= items.length) jarvisSelected = 0;
    list.innerHTML = items.map((i,idx) => `<div class="jarvis-item ${idx===jarvisSelected?'sel':''}" data-idx="${idx}">
      <div class="jv-icon">${i.icon}</div>
      <div class="jv-t">${escapeHTML(i.t)}<div style="font-size:10.5px;color:#9d9db0;margin-top:1px">${escapeHTML(i.sub||'')}</div></div>
      <div class="jv-cat">${i.cat}</div>
    </div>`).join('') || '<div style="padding:18px;color:#9d9db0;font-size:13px;text-align:center">Keine Treffer.</div>';
    list.querySelectorAll('.jarvis-item').forEach(el => el.onclick = () => items[parseInt(el.dataset.idx)].run());
  }
  function jarvisKey(e){
    const inp = document.getElementById('jarvis-input');
    const items = getJarvisItems(inp.value);
    if (e.key === 'Escape') { closeJarvis(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); jarvisSelected = Math.min(items.length-1, jarvisSelected+1); renderJarvisList(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); jarvisSelected = Math.max(0, jarvisSelected-1); renderJarvisList(); }
    if (e.key === 'Enter' && items[jarvisSelected]) { e.preventDefault(); items[jarvisSelected].run(); }
  }

  // -------- BOOT -----------------------------------------------------------
  function boot(){
    injectStyle();
    buildAvatar();
    buildPanel();
    buildJarvis();
    // Globaler Shortcut Ctrl+J
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase() === 'j') { e.preventDefault(); openJarvis(); }
    });
    // Auto-Health-Scan alle 60s + Badge-Update
    setInterval(() => {
      const issues = scanDashboard();
      const badge = document.getElementById('samantha-badge');
      if (badge) badge.textContent = issues.length > 0 ? '!'+issues.length : 'S';
    }, 60000);
    // Vorschlag-Notification erste 5s nach Boot
    setTimeout(async () => {
      const ins = await generateInsights();
      if (ins.length > 0) {
        const badge = document.getElementById('samantha-badge');
        if (badge) badge.textContent = ins.length;
        flashAvatar();
      }
    }, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // -------- PUBLIC API -----------------------------------------------------
  window.Samantha = {
    open: () => document.getElementById('samantha-panel')?.classList.add('open'),
    close: () => document.getElementById('samantha-panel')?.classList.remove('open'),
    ask: callClaude,
    note: addNote,
    task: addTask,
    runAction,
    actions: ACTIONS,
    docs: DOCS,
    facts: FACTS,
    plugins: PLUGINS,
    scan: scanDashboard,
    insights: generateInsights,
    jarvis: openJarvis,
    name: 'Lucy',
    version: '4.0'
  };
  window.Jarvis = { open: openJarvis, close: closeJarvis };
  window.LucyAvatar = LUCY_AVATAR_SVG;
  // Public-API exposed as Lucy + alias Samantha (backwards-compat)
  window.Lucy = window.Samantha;
  console.log('%c✦ LUCY v4.0 online — 100% cerebral capacity','color:#9af0ff;font-weight:bold;font-size:13px','· '+ACTIONS.length+' Actions · '+Object.keys(PLUGINS).length+' Plugins · Ctrl+J für Command Palette');
})();
