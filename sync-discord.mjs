import fs from 'node:fs/promises';
const token=process.env.DISCORD_BOT_TOKEN;
const guild=process.env.DISCORD_GUILD_ID;
if(!token||!guild) throw new Error('Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID');
let after='';let real=0,total=0;let pages=0;
for(;;){
  const u=new URL(`https://discord.com/api/v10/guilds/${guild}/members`);u.searchParams.set('limit','1000');if(after)u.searchParams.set('after',after);
  const r=await fetch(u,{headers:{Authorization:`Bot ${token}`,Accept:'application/json','User-Agent':'ValorisCommunity/GitHubPages/1.0'}});
  if(!r.ok) throw new Error(`Discord ${r.status}: ${await r.text()}`);
  const members=await r.json(); total+=members.length; real+=members.filter(m=>!m?.user?.bot).length; pages++;
  if(members.length<1000) break; after=members.at(-1)?.user?.id; if(!after||pages>100) break;
}
const now=new Date().toISOString();
await fs.mkdir('data',{recursive:true});
let hist=[];try{hist=JSON.parse(await fs.readFile('data/member-history.json','utf8'))}catch{}
hist.push({at:now,members:real,total,bots:total-real});
const cutoff=Date.now()-45*86400000;hist=hist.filter(x=>new Date(x.at).getTime()>=cutoff);
await fs.writeFile('data/discord.json',JSON.stringify({ok:true,members:real,total,bots:total-real,updatedAt:now,source:'github-actions'},null,2)+'\n');
await fs.writeFile('data/member-history.json',JSON.stringify(hist,null,2)+'\n');
const v={version:'GITHUB-'+now.slice(0,10),build:'github-pages',updatedAt:now};
await fs.writeFile('public/version.json',JSON.stringify(v,null,2)+'\n');
console.log(`Synced ${real} real members (${total} total, ${total-real} bots).`);
