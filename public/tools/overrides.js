/* Napojenie webu na editor layoutov.
   Do stranky staci pridat jediny riadok, najlepsie do <head>:

       <script src="tools/overrides.js"></script>

   Robi dve veci:
     1) prilinkuje css/overrides.css (pozicie, velkosti, font-size, tokeny)
     2) doplni textove upravy z css/overrides.json (dvojklik v editore)

   Cez file:// fetch neprejde — vtedy sa ticho preskoci a stranka vyzera
   ako povodne. Na to je serve.ps1.
*/
(function () {
  var zaklad = document.currentScript
    ? document.currentScript.src.replace(/tools\/overrides\.js.*$/, "")
    : "";

  var l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = zaklad + "css/overrides.css";
  document.head.appendChild(l);

  fetch(zaklad + "css/overrides.json")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (ov) {
      if (!ov || !ov.content) return;
      var uprav = function () {
        for (var sel in ov.content) {
          var el = document.querySelector(sel);
          if (el) el.innerHTML = ov.content[sel];
        }
      };
      if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", uprav);
      else uprav();
    })
    .catch(function () {});
})();
