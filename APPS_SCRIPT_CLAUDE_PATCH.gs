/* ===========================================================
   APPS SCRIPT BRIDGE V3.3 — CLAUDE PROXY PATCH
   Erweitert CEO_MASTER_BRIDGE_V3.gs um:
     - POST  /exec?action=claude   → Anthropic Sonnet (echtes Claude)
     - GET   /exec?action=research → optional Google CSE

   VORAUSSETZUNG (Skript-Eigenschaften):
     ANTHROPIC_API_KEY  = sk-ant-…  (bereits gesetzt ✓)
     CLAUDE_MODEL       = optional, default 'claude-sonnet-4-5-20250929'
     GOOGLE_CSE_KEY     = optional, fuer action=research
     GOOGLE_CSE_CX      = optional, fuer action=research

   INSTALLATION:
     1. Apps Script Editor oeffnen:
        https://script.google.com/home/projects/1r1fRIJDTg9Ee3oV9rAxSKz-iSrclECXw3ZtSCpQqPHW-j-nI2nvfFcQL/edit
     2. NEUE Datei "Claude.gs" anlegen (+ neben "Files")
     3. Diesen Inhalt komplett einfuegen
     4. In bestehender doPost(e) folgendes ergaenzen (am Anfang):
          if (action === 'claude') return _claudeJson(callClaude_(JSON.parse(e.postData.contents||'{}')));
     5. Bereitstellen → Bereitstellung verwalten → Bearbeiten → Neue Version → Veroeffentlichen
     6. Test:  curl -X POST -d '{"message":"Hallo"}' '/exec?action=claude'
   =========================================================== */

function callClaude_(payload) {
  var key = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!key) return { ok:false, error:'ANTHROPIC_API_KEY missing in Script Properties' };

  var model = PropertiesService.getScriptProperties().getProperty('CLAUDE_MODEL') || 'claude-sonnet-4-5-20250929';
  var system = payload.system || 'Du bist Lucy, CEO-Co-Pilotin von Carsten.';
  var msg    = payload.message || '';
  var history = Array.isArray(payload.history) ? payload.history : [];

  // Anthropic Messages API benoetigt user/assistant Turns
  var messages = [];
  history.slice(-10).forEach(function(h){
    if (h && h.role && h.content) messages.push({ role: h.role, content: String(h.content) });
  });
  messages.push({ role: 'user', content: String(msg) });

  var body = {
    model: model,
    max_tokens: 800,
    system: system,
    messages: messages
  };

  try {
    var resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });
    var code = resp.getResponseCode();
    var txt  = resp.getContentText();
    if (code !== 200) return { ok:false, error: 'HTTP '+code+' '+txt.slice(0,400) };
    var j = JSON.parse(txt);
    var reply = (j.content && j.content[0] && j.content[0].text) || '';
    return { ok:true, reply: reply, model: model, usage: j.usage || null };
  } catch (e) {
    return { ok:false, error: String(e).slice(0,400) };
  }
}

function _claudeJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: Google Custom Search Engine fuer Deep-Research
function doResearch_(q) {
  var key = PropertiesService.getScriptProperties().getProperty('GOOGLE_CSE_KEY');
  var cx  = PropertiesService.getScriptProperties().getProperty('GOOGLE_CSE_CX');
  if (!key || !cx) return { ok:false, error:'CSE not configured' };
  try {
    var url = 'https://www.googleapis.com/customsearch/v1?key='+encodeURIComponent(key)
            + '&cx='+encodeURIComponent(cx)
            + '&q='+encodeURIComponent(q);
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions:true });
    if (resp.getResponseCode() !== 200) return { ok:false, error: 'HTTP '+resp.getResponseCode() };
    var j = JSON.parse(resp.getContentText());
    var items = (j.items||[]).slice(0,5).map(function(it){
      return { title: it.title, link: it.link, snippet: it.snippet };
    });
    return { ok:true, items: items };
  } catch (e) {
    return { ok:false, error: String(e).slice(0,400) };
  }
}

/* ===========================================================
   ANPASSUNG IN doPost(e) — DIESEN BLOCK AN DEN ANFANG SETZEN:
   ===========================================================
function doPost(e) {
  var action = (e && e.parameter && e.parameter.action) || '';
  try {
    if (action === 'claude') {
      var p = {};
      try { p = JSON.parse(e.postData.contents || '{}'); } catch (_) {}
      return _claudeJson(callClaude_(p));
    }
    // ... bestehende doPost-Logik
  } catch (err) {
    return _claudeJson({ ok:false, error: String(err) });
  }
}

   UND IN doGet(e) FALLS GET-Variante gewuenscht:
   if (action === 'research') {
     return _claudeJson(doResearch_(e.parameter.q || ''));
   }
   =========================================================== */

// SELBSTTEST (in Apps Script Editor: Funktion auswaehlen, Run klicken)
function testClaude() {
  var r = callClaude_({
    system: 'Antworte in genau einem Satz.',
    message: 'Sag Hallo Carsten.'
  });
  Logger.log(JSON.stringify(r, null, 2));
}
