/* Aufbau-Animationen vorbereiten: nur wenn der Browser Bewegung erlaubt.
   Läuft das Animations-Script nicht, wird nach 3 Sekunden alles normal angezeigt. */
(function(){
  try{ if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
  var d=document.documentElement; d.classList.add('rv');
  setTimeout(function(){ if(!window.__rvReady) d.classList.remove('rv'); },3000);
})();
