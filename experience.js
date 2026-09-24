(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wa = message => 'https://wa.me/5548996996920?text=' + encodeURIComponent(message);
  const animate = element => {
    if (!reduced.matches && element.animate) element.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
  };
  $('.menu-toggle').addEventListener('click', () => {
    const open = $('nav').classList.toggle('open');
    $('.menu-toggle').setAttribute('aria-expanded',String(open));
    $('.menu-toggle').setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  });
  const closeMenu=()=>{$('nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')};
  $$('nav a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  const services = [
    {caption:'Locação de geradores',text:'Informe o local, o período de uso e os equipamentos que precisam de energia para consultar a locação.',image:'locacao-trailer.png',label:'Consultar locação',topic:'locação de geradores'},
    {caption:'Venda de geradores',text:'Consulte os equipamentos disponíveis para compra e peça orientação sobre a aplicação do gerador.',image:'gerapro5.webp',label:'Consultar venda',topic:'venda de geradores'},
    {caption:'Manutenção de geradores',text:'Atendimento preventivo e corretivo. Informe a marca, o modelo e o que precisa ser verificado no equipamento.',image:'gerapro.webp',label:'Solicitar manutenção',topic:'manutenção de geradores'}
  ];
  const tabs=$$('[data-service]');
  function selectService(index,focus=false) {
    const item=services[index];
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1});
    $('#service-panel').setAttribute('aria-labelledby',tabs[index].id);
    $('#service-image').src='assets/'+item.image;
    $('#service-image').alt='Equipamento Gerapro para '+item.topic;
    $('#service-caption').textContent=item.caption;
    $('#service-text').textContent=item.text;
    $('#service-link').textContent=item.label;
    $('#service-link').href=wa('Olá, gostaria de mais informações sobre '+item.topic+'.');
    animate($('#service-panel'));
    if(focus)tabs[index].focus();
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectService(index));
    tab.addEventListener('keydown',e=>{
      let next=index;
      if(['ArrowDown','ArrowRight'].includes(e.key))next=(index+1)%3;
      else if(['ArrowUp','ArrowLeft'].includes(e.key))next=(index+2)%3;
      else if(e.key==='Home')next=0;
      else if(e.key==='End')next=2;
      else return;
      e.preventDefault();selectService(next,true);
    });
  });
  const allModes=['venda','locacao','manutencao'];
  const products=[
    {brand:'Gerapro',image:'gerapro5.webp',modes:allModes},
    {brand:'Buffalo',image:'buffalo1.webp',modes:allModes},
    {brand:'Toyama',image:'toyama1.webp',modes:allModes},
    {brand:'Gerapro',image:'gerapro2.webp',modes:['locacao','manutencao']},
    {brand:'Gerapro',image:'gerapro3.webp',modes:['locacao','manutencao']},
    {brand:'Gerapro',image:'gerapro.webp',modes:['locacao','manutencao']}
  ];
  const modeLabels={venda:'Venda',locacao:'Locação',manutencao:'Manutenção'};
  let available=products.map((_,i)=>i),selected=0;
  products.forEach((product,i)=>{
    const button=document.createElement('button');
    button.type='button';button.dataset.product=String(i);
    button.setAttribute('aria-label','Selecionar equipamento '+(i+1)+': '+product.brand);
    const image=document.createElement('img');image.src='assets/'+product.image;image.alt='';image.loading='lazy';image.width=120;image.height=70;
    button.append(image,document.createTextNode(String(i+1).padStart(2,'0')+' / '+product.brand));
    button.addEventListener('click',()=>selectProduct(i));
    $('.product-thumbs').append(button);
  });
  function selectProduct(index,withMotion=true){
    selected=index;
    const p=products[index],modes=p.modes.map(m=>modeLabels[m]).join(' · ');
    $('#product-image').src='assets/'+p.image;$('#product-image').alt='Gerador '+p.brand;
    $('.product-brand-back').textContent=p.brand.toUpperCase();
    $('#product-name').textContent='Gerador '+p.brand;
    $('#product-modes').textContent=modes;
    $('#product-count').textContent=String(available.indexOf(index)+1).padStart(2,'0')+' / '+String(available.length).padStart(2,'0');
    $('#product-quote').href=wa('Olá, gostaria de mais informações sobre o gerador '+p.brand+'. Referência da imagem: '+new URL('assets/'+p.image,location.href).href);
    $$('[data-product]').forEach((button,i)=>{button.hidden=!available.includes(i);button.setAttribute('aria-pressed',String(i===index))});
    if(withMotion){animate($('#product-image'));animate($('#product-name'))}
  }
  function nextProduct(direction){selectProduct(available[(available.indexOf(selected)+direction+available.length)%available.length])}
  $('#product-prev').addEventListener('click',()=>nextProduct(-1));
  $('#product-next').addEventListener('click',()=>nextProduct(1));
  $$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter;
    available=products.map((p,i)=>filter==='todos'||p.modes.includes(filter)?i:-1).filter(i=>i>=0);
    $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    selectProduct(available.includes(selected)?selected:available[0]);
  }));
  let start=null;
  $('.product-art').addEventListener('touchstart',e=>{start={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
  $('.product-art').addEventListener('touchend',e=>{
    if(!start)return;
    const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)nextProduct(dx<0?1:-1);
    start=null;
  },{passive:true});
  selectProduct(0,false);
  const dialog=$('#product-dialog');
  $('.zoom-button').addEventListener('click',()=>{
    $('#detail-image').src=$('#product-image').src;$('#detail-image').alt=$('#product-image').alt;
    $('#detail-title').textContent=$('#product-name').textContent;$('#detail-modes').textContent=$('#product-modes').textContent;
    $('#detail-quote').href=$('#product-quote').href;
    dialog.showModal();document.body.style.overflow='hidden';
  });
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';$('.zoom-button').focus()});
  $$('.faq-q').forEach((q,i)=>{
    q.id='faq-q-'+i;q.nextElementSibling.id='faq-a-'+i;q.setAttribute('aria-controls','faq-a-'+i);
    q.nextElementSibling.setAttribute('role','region');q.nextElementSibling.setAttribute('aria-labelledby',q.id);
    q.addEventListener('click',()=>{
      const open=q.getAttribute('aria-expanded')==='true';
      $$('.faq-q').forEach(b=>{b.setAttribute('aria-expanded','false');b.nextElementSibling.style.maxHeight='0px'});
      if(!open){q.setAttribute('aria-expanded','true');q.nextElementSibling.style.maxHeight=q.nextElementSibling.scrollHeight+'px'}
    });
  });
  // Each section resets only after its untransformed bounds leave the viewport.
  if('IntersectionObserver' in window){
    $$('main > section').forEach(section=>{
      section.querySelectorAll('.faq-item').forEach((el,i)=>{el.dataset.motion='';el.style.setProperty('--delay',i*80+'ms')});
    });
    const sections=$$('main > section');
    const motion=new IntersectionObserver(entries=>entries.forEach(entry=>{
      entry.target.querySelectorAll('[data-motion]').forEach(el=>el.classList.toggle('built',entry.isIntersecting));
    }),{threshold:0});
    sections.forEach(s=>motion.observe(s));
    document.documentElement.classList.add('motion-enabled');
  }
  const chapters=$$('.chapter');
  let queued=false;
  function updateScroll(){
    queued=false;
    const max=document.documentElement.scrollHeight-innerHeight;
    $('.reading-progress').style.transform='scaleX('+(max?scrollY/max:0)+')';
    let active=0,best=Infinity;
    chapters.forEach((chapter,i)=>{const rect=chapter.getBoundingClientRect(),distance=Math.abs(rect.top+rect.height/2-innerHeight/2);if(distance<best){best=distance;active=i}});
    chapters.forEach((chapter,i)=>chapter.classList.toggle('active',i===active));
    $('#story-number').textContent=String(active+1).padStart(2,'0');
    $('.story-tracker i').style.width=((active+1)/3*100)+'%';
  }
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateScroll)}},{passive:true});
  addEventListener('resize',()=>{
    $('.service-tabs').setAttribute('aria-orientation',innerWidth<=700?'horizontal':'vertical');
    $$('.faq-q[aria-expanded=true]').forEach(q=>q.nextElementSibling.style.maxHeight=q.nextElementSibling.scrollHeight+'px');
    updateScroll();
  });
  $('.service-tabs').setAttribute('aria-orientation',innerWidth<=700?'horizontal':'vertical');
  updateScroll();
})();
