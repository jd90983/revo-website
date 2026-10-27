(function(){
  var app=document.querySelector('#explore-app .rv-app');
  if(!app) return;
  var screens=app.querySelectorAll('.rv-screen');
  var tabs=app.querySelectorAll('.rv-tabbar [data-tab]');
  var tabbar=app.querySelector('.rv-tabbar');
  var toast=document.getElementById('rv-toast');
  var deleteModal=document.getElementById('rv-delete-modal');
  var history=['dashboard'];
  var TAB_SCREENS={dashboard:1,calls:1,settings:1};

  /* ----- fictional call data ----- */
  var CALLS={
    c1:{phone:'(512) 555-0148',time:'2:14 PM',job:'AC Repair',sched:'Schedule: October 22, 2026 • 10:00 AM',addr:'742 S Broadway, Los Angeles, CA 90014',src:'Google Ads - HVAC',name:'John Smith',f1l:'System Type',f1:'Central AC',f2l:'Unit Age',f2:'8 years',issue:'Blowing warm air',extral:'Thermostat',extra:'Smart thermostat',tech:'David Wilson'},
    c2:{phone:'(555) 987-6543',time:'9:15 AM',job:'Information-only',sched:'No appointment needed',addr:'Caller did not share an address',src:'Texas Service Line',name:'Priya Natarajan',f1l:'Asked about',f1:'Maintenance plan pricing',f2l:'Follow-up',f2:'Text sent with plan options',issue:'Wanted to compare annual plans',extral:'Outcome',extra:'Info sent via SMS',tech:'Unassigned'},
    c3:{phone:'(555) 246-8135',time:'8:30 AM',job:'Furnace Repair',sched:'Schedule: October 23, 2026 • 8:00 AM',addr:'1180 Lamar St, Dallas, TX 75202',src:'Meta Ads - Locksmith',name:'Maria Lopez',f1l:'System Type',f1:'Gas furnace',f2l:'Unit Age',f2:'12 years',issue:'No heat, pilot light out',extral:'Access',extra:'Side gate, dog in yard',tech:'Calvin Steward'},
    c4:{phone:'(555) 369-2580',time:'7:15 AM',job:'Missed call',sched:'Revo texted a callback link',addr:'—',src:'Los Angeles Service Line',name:'Unknown caller',f1l:'Duration',f1:'0s',f2l:'Follow-up',f2:'SMS sent at 7:16 AM',issue:'Caller hung up before answering',extral:'Status',extra:'Waiting for reply',tech:'Unassigned'}
  };

  function setText(id,v){var el=document.getElementById(id);if(el)el.textContent=v;}
  function fillCall(id){
    var c=CALLS[id]||CALLS.c1;
    setText('rv-c-phone',c.phone);setText('rv-c-phone2',c.phone);setText('rv-c-time',c.time);setText('rv-c-job',c.job);
    setText('rv-c-sched',c.sched);setText('rv-c-addr',c.addr);setText('rv-c-addr2',c.addr);setText('rv-c-src',c.src);
    setText('rv-c-name',c.name);setText('rv-c-f1',c.f1);setText('rv-c-f2',c.f2);setText('rv-c-issue',c.issue);setText('rv-c-extra',c.extra);
    var kv=document.querySelectorAll('.rv-kv div b');
    if(kv[2])kv[2].textContent=c.f1l;if(kv[3])kv[3].textContent=c.f2l;if(kv[6])kv[6].textContent=c.extral;
    var tech=document.getElementById('rv-c-tech');if(tech)tech.firstChild.textContent=c.tech+' ';
    var body=document.getElementById('rv-call-body');if(body)body.scrollTop=0;
    var play=document.getElementById('rv-play');
    if(play){
      play.classList.remove('is-playing');
      play.setAttribute('aria-pressed','false');
      if(play.firstElementChild) play.firstElementChild.textContent='Play Call Recording';
    }
    closeDeleteModal();
  }

  function openDeleteModal(){
    if(!deleteModal) return;
    deleteModal.hidden=false;
    app.classList.add('is-modal-open');
    // Next frame so CSS can transition from the closed state
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        deleteModal.classList.add('is-open');
      });
    });
  }
  function closeDeleteModal(){
    if(!deleteModal || deleteModal.hidden) return;
    deleteModal.classList.remove('is-open');
    app.classList.remove('is-modal-open');
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(function(){
      deleteModal.hidden=true;
    }, reduce ? 0 : 240);
  }

  function show(name,push){
    var target=app.querySelector('[data-screen="'+name+'"]');if(!target)return;
    screens.forEach(function(s){s.classList.remove('is-active')});
    target.classList.add('is-active');
    var body=target.querySelector('.rv-screen__body');if(body)body.scrollTop=0;
    tabbar.style.display=TAB_SCREENS[name]?'flex':'none';
    tabs.forEach(function(t){t.setAttribute('aria-current',t.dataset.tab===name?'page':'false')});
    if(push!==false){ if(TAB_SCREENS[name])history=[name]; else history.push(name); }
  }
  function back(){ if(history.length>1)history.pop(); show(history[history.length-1],false); }
  function say(msg){ toast.textContent=msg;toast.classList.add('is-on');clearTimeout(say.t);say.t=setTimeout(function(){toast.classList.remove('is-on')},2400); }

  /* ----- delegated clicks inside the app ----- */
  app.addEventListener('click',function(e){
    var go=e.target.closest('[data-go]');
    if(go){ if(go.dataset.go==='call')fillCall(go.dataset.arg); show(go.dataset.go); return; }
    if(e.target.closest('[data-back]')){ back(); return; }
    var tab=e.target.closest('[data-tab]'); if(tab){ show(tab.dataset.tab); return; }
    var sa=e.target.closest('[data-selall]');
    if(sa){
      var on=sa.dataset.selall==='on';
      app.querySelectorAll('#rv-jobtypes .rv-toggle').forEach(function(t){t.setAttribute('aria-checked',on?'true':'false')});
      app.querySelectorAll('.rv-selall').forEach(function(b){b.classList.toggle('is-on',b===sa)});
      setText('rv-active-count',on?13:0); say(on?'All 13 job types active':'All job types paused'); return;
    }
    var tg=e.target.closest('.rv-toggle');
    if(tg){
      if(tg.dataset.toast){ say(tg.dataset.toast); return; }
      var on=tg.getAttribute('aria-checked')==='true'; tg.setAttribute('aria-checked',on?'false':'true');
      var n=app.querySelectorAll('#rv-jobtypes .rv-toggle[aria-checked="true"]').length; setText('rv-active-count',n);
      app.querySelectorAll('.rv-selall').forEach(function(b){b.classList.toggle('is-on',(b.dataset.selall==='on'&&n===13)||(b.dataset.selall==='off'&&n===0))});
      say((on?'Paused: ':'Active: ')+tg.getAttribute('aria-label')); return;
    }
    var m=e.target.closest('[data-metric]');
    if(m){
      m.parentNode.querySelectorAll('[role=tab]').forEach(function(b){b.setAttribute('aria-selected','false')}); m.setAttribute('aria-selected','true');
      var key=m.dataset.metric;
      var callsBox=document.getElementById('rv-metric-calls'), donut=document.getElementById('rv-metric-donut');
      if(key==='calls'){ setText('rv-metric-label','Total Calls Today'); callsBox.hidden=false; donut.hidden=true; return; }
      var sets={quality:[['Emergency lockouts',52,'#3b82f6'],['Service inquiries',31,'#10b981'],['Spam calls',17,'#ff6900']],
                behavior:[['First-time callers',44,'#3b82f6'],['Repeat callers',38,'#10b981'],['Urgent calls',18,'#ff6900']]}[key];
      setText('rv-metric-label','What kind of calls are coming in'); callsBox.hidden=true; donut.hidden=false;
      var lg=document.getElementById('rv-legend'); lg.innerHTML=sets.map(function(r){return '<li><i style="background:'+r[2]+'"></i>'+r[0]+'<b>'+r[1]+'%</b></li>'}).join('');
      var svg=document.getElementById('rv-donut-svg'); svg.querySelectorAll('.seg').forEach(function(c){c.remove()});
      var C=2*Math.PI*38, off=0;
      sets.forEach(function(r){ var len=C*r[1]/100-2; var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('class','seg');c.setAttribute('cx',50);c.setAttribute('cy',50);c.setAttribute('r',38);c.setAttribute('stroke',r[2]);
        c.setAttribute('stroke-dasharray',len+' '+(C-len));c.setAttribute('stroke-dashoffset',-off);svg.appendChild(c);off+=C*r[1]/100; });
      return;
    }
    if(e.target.closest('[data-rv-modal-close]')){
      closeDeleteModal();
      return;
    }
    if(e.target.closest('#rv-delete-call')){
      openDeleteModal();
      return;
    }
    if(e.target.closest('#rv-play')){
      say('Call recordings play in the app. Download Revo to listen.');
      return;
    }
    var t=e.target.closest('[data-toast]'); if(t){ say(t.dataset.toast); }
  });

  /* ----- "Things to try" shortcuts outside the phone ----- */
  function goToDemoScreen(name, arg){
    if(name==='call') fillCall(arg || 'c1');
    show('dashboard');
    show(name);
  }
  document.querySelectorAll('#explore-app .rv-demo__try [data-go]').forEach(function(b){
    b.addEventListener('click',function(){ goToDemoScreen(b.dataset.go, b.dataset.arg); });
  });
  var demoSelect=document.getElementById('rv-demo-select');
  var demoSelectMenu=document.getElementById('rv-demo-select-menu');
  var demoSelectValue=demoSelect && demoSelect.querySelector('.rv-demo__select-value');
  var demoText=document.querySelector('#explore-app .rv-demo__text');
  function closeDemoSelect(){
    if(!demoSelect || !demoSelectMenu) return;
    demoSelect.setAttribute('aria-expanded','false');
    demoSelectMenu.hidden=true;
    if(demoText) demoText.classList.remove('is-select-open');
  }
  function openDemoSelect(){
    if(!demoSelect || !demoSelectMenu) return;
    demoSelect.setAttribute('aria-expanded','true');
    demoSelectMenu.hidden=false;
    if(demoText) demoText.classList.add('is-select-open');
  }
  if(demoSelect && demoSelectMenu){
    demoSelect.addEventListener('click',function(e){
      e.stopPropagation();
      if(demoSelect.getAttribute('aria-expanded')==='true') closeDemoSelect();
      else openDemoSelect();
    });
    demoSelectMenu.querySelectorAll('[role="option"]').forEach(function(opt){
      opt.addEventListener('click',function(e){
        e.stopPropagation();
        demoSelectMenu.querySelectorAll('[role="option"]').forEach(function(o){ o.removeAttribute('aria-selected'); });
        opt.setAttribute('aria-selected','true');
        if(demoSelectValue) demoSelectValue.textContent=opt.textContent.trim();
        demoSelect.classList.add('has-value');
        closeDemoSelect();
        goToDemoScreen(opt.getAttribute('data-go'), opt.getAttribute('data-arg'));
      });
    });
    document.addEventListener('click',function(e){
      if(!e.target.closest('.rv-demo__select-wrap')) closeDemoSelect();
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape') closeDemoSelect();
    });
  }

  /* ----- entrance, hint cursor and looping auto tour ----- */
  (function(){
    var wrap=document.querySelector('#explore-app .rv-phone-wrap');
    var cursor=document.getElementById('rv-cursor'), badge=document.getElementById('rv-tour-badge');
    if(!wrap||!cursor) return;
    var timers=[], touring=false, userTook=false, idleT=null;
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function at(el){ if(!el)return; var r=el.getBoundingClientRect(), a=app.getBoundingClientRect(); var sx=a.width/app.offsetWidth; cursor.style.left=((r.left-a.left)/sx+r.width/(2*sx))+'px'; cursor.style.top=((r.top-a.top)/sx+r.height/(2*sx))+'px'; }
    function wait(ms,fn){ timers.push(setTimeout(function(){ if(!userTook)fn(); },ms)); }
    function clearAll(){ timers.forEach(clearTimeout); timers=[]; }
    function hideCursor(){ cursor.classList.remove('is-on','is-tap'); badge.classList.remove('is-on'); }
    function tap(el,fn){ at(el); wait(650,function(){ cursor.classList.add('is-tap'); wait(150,function(){ cursor.classList.remove('is-tap'); el.click(); if(fn)fn(); }); }); }
    var tabs=function(n){return app.querySelector('.rv-tabbar [data-tab="'+n+'"]')};

    function armIdle(){ clearTimeout(idleT); if(userTook)return; idleT=setTimeout(startTour,5000); }
    function startTour(){
      if(userTook||touring)return; touring=true;
      cursor.classList.add('is-on'); badge.classList.add('is-on');
      tap(tabs('calls'),function(){ wait(2400,function(){
        tap(tabs('settings'),function(){ wait(2400,function(){
          tap(tabs('dashboard'),function(){ wait(700,function(){
            hideCursor(); touring=false; armIdle();   /* loop after 5s on Home */
          });});
        });});
      });});
    }
    function showHint(){
      var jt=app.querySelector('.rv-screen[data-screen="dashboard"] .rv-two [data-go="job-types"]');
      cursor.classList.add('is-on'); at(jt);
      /* keep the hint until the tour starts or the user acts */
    }
    function takeOver(){ if(userTook)return; userTook=true; clearTimeout(idleT); clearAll(); hideCursor(); cursor.classList.add('is-user'); app.classList.add('is-user'); }
    /* mouse-following cursor (always available; smaller once the user is in control) */
    var fine=window.matchMedia('(pointer:fine)').matches;
    if(fine){
      /* While the tour or the hint is running, the orange cursor belongs to the demo; hovering
         does not cancel it. The moment the user taps/scrolls, takeOver() hands the cursor to the mouse. */
      app.addEventListener('pointermove',function(e){
        if(!userTook)return;
        var a=app.getBoundingClientRect(), sx=a.width/app.offsetWidth;
        cursor.style.left=((e.clientX-a.left)/sx)+'px'; cursor.style.top=((e.clientY-a.top)/sx)+'px';
        cursor.classList.add('is-on');
      });
      app.addEventListener('pointerleave',function(){ if(userTook)cursor.classList.remove('is-on'); });
      app.addEventListener('pointerdown',function(){ cursor.classList.add('is-tap'); });
      app.addEventListener('pointerup',function(){ cursor.classList.remove('is-tap'); });
    }
    ['pointerdown','keydown','wheel','touchstart'].forEach(function(ev){ app.addEventListener(ev,takeOver,{passive:true,capture:true}); });
    document.querySelectorAll('#explore-app .rv-demo__try button').forEach(function(b){ b.addEventListener('pointerdown',takeOver); });
    if(demoSelect){ demoSelect.addEventListener('pointerdown',takeOver); }
    if(demoSelectMenu){ demoSelectMenu.addEventListener('pointerdown',takeOver); }

    function enter(){
      wrap.classList.add('is-in');
      wait(reduce?0:900,function(){ showHint(); armIdle(); });
    }
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ io.disconnect(); enter(); } },{threshold:.15});
      io.observe(wrap);
    } else enter();
  })();

  /* keep page scroll from hijacking when the user reaches the end of a screen */
  app.addEventListener('wheel',function(e){
    var body=e.target.closest('.rv-screen__body, #rv-call-body'); if(!body)return;
    var atTop=body.scrollTop===0&&e.deltaY<0, atBottom=body.scrollTop+body.clientHeight>=body.scrollHeight-1&&e.deltaY>0;
    if(!(atTop||atBottom))e.stopPropagation();
  },{passive:true});
})();
