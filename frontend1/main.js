
const API='https://YOUR-SNAPFLOW-APP.azurewebsites.net/api';
const token=localStorage.getItem('token');

async function register(){
  await fetch(API+'/register',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name:name.value,email:email.value,password:password.value,role:role.value})});
  location.href='login.html';
}

async function login(){
  const r=await fetch(API+'/login',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:email.value,password:password.value})});
  const d=await r.json();
  localStorage.setItem('token',d.token);
  location.href=d.role==='creator'?'creator.html':'index.html';
}

async function upload(){
  const fd=new FormData();
  fd.append('title',title.value);
  fd.append('image',image.files[0]);
  await fetch(API+'/photos',{method:'POST',headers:{Authorization:'Bearer '+token},body:fd});
  location.href='index.html';
}

async function react(id,t){
  await fetch(`${API}/photos/${id}/react/${t}`,{method:'POST',headers:{Authorization:'Bearer '+token}});
  loadFeed();
}

async function comment(e,id){
  if(e.key==='Enter'){
    await fetch(`${API}/photos/${id}/comment`,{method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
      body:JSON.stringify({text:e.target.value})});
    loadFeed();
  }
}

async function share(id){
  await fetch(`${API}/photos/${id}/share`,{method:'POST',headers:{Authorization:'Bearer '+token}});
  loadFeed();
}

async function loadFeed(){
  const r=await fetch(API+'/photos');
  const d=await r.json();
  feed.innerHTML=d.map(p=>`
  <div class="card">
    <img src="${p.url}">
    <h3>${p.title}</h3>
    <p>by ${p.creator}</p>
    <button onclick="react('${p.id}','like')">👍 ${p.reactions.like}</button>
    <button onclick="react('${p.id}','love')">❤️ ${p.reactions.love}</button>
    <button onclick="react('${p.id}','wow')">😮 ${p.reactions.wow}</button>
    <button onclick="react('${p.id}','sad')">😢 ${p.reactions.sad}</button>
    <button onclick="share('${p.id}')">🔗 ${p.shares}</button>
    <input placeholder="Add comment…" onkeydown="comment(event,'${p.id}')">
  </div>`).join('');
}
if(document.getElementById('feed')) loadFeed();
