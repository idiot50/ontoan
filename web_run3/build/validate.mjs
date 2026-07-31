// validate.mjs <file.json>  — kiểm 1 batch (mảng unit) hoặc content.json ({units:[...]})
import fs from 'fs';
const f=process.argv[2];
const raw=JSON.parse(fs.readFileSync(f,'utf8'));
const units=Array.isArray(raw)?raw:raw.units;
const norm=s=>String(s).replace(/[‘’ʼ`´]/g,"'").replace(/\s+/g,' ').trim().toLowerCase();
let issues=0,exs=0; const seenFiles=new Set();
for(const u of units){
  if(!(u.unit&&u.label&&u.title&&Array.isArray(u.exercises))){console.log('❌ unit thiếu trường',u.unit);issues++;continue;}
  for(const ex of u.exercises){
    exs++; const id=`u${u.unit}/${ex.file} [${ex.type}]`; const D=ex.data||{};
    if(!ex.file||!ex.type||!D){console.log('❌',id,'thiếu file/type/data');issues++;continue;}
    const fk=`${u.unit}/${ex.file}`; if(seenFiles.has(fk)){console.log('❌ trùng file',fk);issues++;} seenFiles.add(fk);
    if(ex.type==='mcq'){ if(!D.questions||!D.questions.length){console.log('❌',id,'không có questions');issues++;continue;}
      D.questions.forEach((q,i)=>{ if(!Array.isArray(q.choices)||q.choices.length<3){console.log('❌',id,'Q'+i,'<3 choices');issues++;} if(!(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.choices.length)){console.log('❌',id,'Q'+i,'answer out of range');issues++;} });
    }else if(ex.type==='dropdown'){ let n=0; (D.lines||[]).forEach(l=>l.forEach(t=>{if(t.dd){n++; if(!Array.isArray(t.dd.choices)||t.dd.choices.length<2){console.log('❌',id,'dd <2 choices');issues++;} if(!(t.dd.answer>=0&&t.dd.answer<t.dd.choices.length)){console.log('❌',id,'dd answer out of range');issues++;}}})); if(!n){console.log('❌',id,'0 dropdown');issues++;}
    }else if(ex.type==='gapfill'){ const gaps=[]; (D.lines||[]).forEach(l=>l.forEach(t=>{if(t.gap!==undefined)gaps.push(String(t.gap));})); if(!gaps.length){console.log('❌',id,'0 gap');issues++;}
      if(D.wordpool&&D.wordpool.length){ const pool=D.wordpool.map(norm).sort(),need=gaps.map(norm).sort(); if(JSON.stringify(pool)!==JSON.stringify(need)){console.log('❌',id,'wordpool≠tập đáp án',JSON.stringify({pool,need}));issues++;} }
    }else if(ex.type==='pickword'){ const per=(D.sentences||[]).map(s=>s.filter(t=>t.sel&&t.sel.correct).length); if(!per.length){console.log('❌',id,'0 sentence');issues++;} per.forEach((n,i)=>{if(n!==1)console.log('⚠️',id,'câu',i,'có',n,'correct (mode one cần =1)')&&issues++;});
    }else if(ex.type==='group'){ if(!(D.groups&&D.groups.length>=2)){console.log('❌',id,'cần ≥2 nhóm');issues++;} (D.groups||[]).forEach(g=>{if(!g.title||!g.items||!g.items.length){console.log('❌',id,'nhóm rỗng/thiếu title');issues++;}});
    }else if(ex.type==='matching'){ if(!(D.pairs&&D.pairs.length>=2)){console.log('❌',id,'cần ≥2 cặp');issues++;} (D.pairs||[]).forEach((p,i)=>{if(!p.left||!p.right){console.log('❌',id,'cặp',i,'thiếu left/right');issues++;}});
    }else{console.log('❌',id,'type lạ:',ex.type);issues++;}
  }
}
console.log(`\n${f}: ${units.length} unit · ${exs} bài · ${issues} vấn đề`);
process.exit(issues?1:0);
