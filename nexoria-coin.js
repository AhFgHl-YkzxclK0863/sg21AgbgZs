/* NEXORIA koin 💵 — pasang di game lain (battleshoot.html, transformers.html, dst):
   <script src="nexoria-coin.js"></script>   (taruh sebelum </body>, satu folder dengan index.html)
   +N 💵 per detik (sesuai level Shop di Nexoria; dasar 0,5/d) selama pemain benar-benar aktif (ada sentuhan/klik/tombol dalam 8 detik terakhir, tab terlihat). */
(function(){
  var CFG={apiKey:"AIzaSyBp4P3nv9w1xYEH_9wNPxq2E-no292ugDM",authDomain:"server-taher.firebaseapp.com",databaseURL:"https://server-taher-default-rtdb.firebaseio.com",projectId:"server-taher",storageBucket:"server-taher.firebasestorage.app",messagingSenderId:"79596136495",appId:"1:79596136495:web:93779c3b3983376253beda",measurementId:"G-K1BF1T4PM3"};
  var user='';try{user=(localStorage.getItem('nexoria_user')||'').trim();}catch(e){}
  if(!/^[A-Za-z0-9_]{3,16}$/.test(user)){try{user=(new URLSearchParams(location.search).get('u')||'').trim();}catch(e){}}
  if(!/^[A-Za-z0-9_]{3,16}$/.test(user))return;
  var key=user.toLowerCase(),db=null,pend=0,rate=.5,incWatch=false,lastAct=Date.now(),lastFlush=Date.now();
  function load(src,cb){var s=document.createElement('script');s.src=src;s.onload=cb;s.onerror=function(){};document.head.appendChild(s);}
  function ready(){
    try{
      if(typeof firebase==='undefined'||typeof firebase.database!=='function')return false;
      if(!firebase.apps.length)firebase.initializeApp(window.NEXORIA_FB||CFG);
      db=firebase.database();watchRate();return true;
    }catch(e){return false;}
  }
  if(!ready()){
    load('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',function(){
      load('https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js',ready);
    });
  }
  /* penghasilan per detik: Lv0 0,5/d · Lv1 5/d · Lv2 10/d · Lv3 20/d … (dibeli di Shop Nexoria, disimpan di incomeLv) */
  function watchRate(){
    if(incWatch||!db)return;incWatch=true;
    try{db.ref('nexoria/users/'+key+'/incomeLv').on('value',function(sn){var l=Math.max(0,Math.min(25,Math.floor(+sn.val()||0)));rate=l<=0?.5:5*Math.pow(2,l-1);});}catch(e){}
  }
  function act(){lastAct=Date.now();}
  ['pointerdown','pointermove','touchstart','touchmove','keydown','wheel'].forEach(function(e){addEventListener(e,act,{passive:true});});
  function flush(){
    var n=Math.floor(pend);
    if(n<=0||!db)return;
    pend-=n;lastFlush=Date.now();
    try{db.ref('nexoria/users/'+key+'/coins').set(firebase.database.ServerValue.increment(n)).catch(function(){pend+=n;});}catch(e){pend+=n;}
  }
  setInterval(function(){
    if(!document.hidden&&Date.now()-lastAct<8000)pend+=rate*2;
    if(pend>=5||(pend>=1&&Date.now()-lastFlush>12000))flush();
  },2000);
  addEventListener('pagehide',flush);
  document.addEventListener('visibilitychange',function(){if(document.hidden)flush();});
})();
