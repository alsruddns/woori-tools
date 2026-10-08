import { getMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";
import { randomInt, secureShuffle, pickUnique, pickUniqueRange } from "@/lib/random";

export type ProcessedText={result:string;download?:Blob};

export async function processText(slug:string,text:string,secondText:string,option:string,amount:number,locale:Locale="ko"):Promise<ProcessedText>{
  const messages=getMessages(locale);
  const lines=text.split(/\r?\n/);let output=text;
  switch(slug){
    case "lotto-number-generator": return {result: pickUnique(Array.from({length:45},(_,i)=>i+1),6).sort((a,b)=>a-b).join(", ")};
    case "random-number": { const [minText,maxText]=text.split(/[\s,]+/); const min=Number(minText),max=Number(maxText); if(!Number.isSafeInteger(min)||!Number.isSafeInteger(max)||min>max)throw new Error("Enter a valid minimum and maximum separated by a comma."); const count=Math.max(1,Math.min(100,Math.trunc(amount)||1)); if(option==="unique"&&count>max-min+1)throw new Error("The range is too small for that many unique numbers."); const values=option==="unique"?pickUniqueRange(min,max,count):Array.from({length:count},()=>randomInt(min,max)); if(option.includes("sort"))values.sort((a,b)=>a-b); return {result:values.join("\n")}; }
    case "random-name-picker": case "random-wheel": case "draw-lots": { const entries=lines.map(s=>s.trim()).filter(Boolean); if(!entries.length)throw new Error(messages.errors.noContent); const count=Math.max(1,Math.min(entries.length,Math.trunc(amount)||1)); return {result:(option==="repeat"?Array.from({length:count},()=>entries[randomInt(0,entries.length-1)]):pickUnique(entries,count)).join("\n")}; }
    case "random-team-maker": case "name-sorter": { const entries=lines.map(s=>s.trim()).filter(Boolean); if(!entries.length)throw new Error(messages.errors.noContent); if(slug==="name-sorter")return {result:entries.sort((a,b)=>a.localeCompare(b,locale,{sensitivity:"base",numeric:true})).join("\n")}; const shuffled=secureShuffle(entries); const teams=Array.from({length:Math.min(entries.length,Math.max(1,Math.trunc(amount)||2))},()=>[] as string[]); shuffled.forEach((name,i)=>teams[i%teams.length].push(name)); return {result:teams.map((team,i)=>`Team ${i+1}\n${team.join("\n")}`).join("\n\n")}; }
    case "random-seat": {const names=secureShuffle(lines.map(s=>s.trim()).filter(Boolean));if(!names.length)throw new Error(messages.errors.noContent);return{result:names.map((name,i)=>`${i+1}. ${name}`).join("\n")};}
    case "duty-picker": {const people=secureShuffle(lines.map(s=>s.trim()).filter(Boolean)),duties=secureShuffle(secondText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean));if(!people.length||!duties.length)throw new Error(messages.errors.noContent);return{result:people.map((person,i)=>`${person} — ${duties[i%duties.length]}`).join("\n")};}
    case "random-order": case "shuffle-lines": return {result:secureShuffle(lines.filter((line)=>line.length>0)).map((line,i)=>slug==="random-order"?`${i+1}. ${line}`:line).join("\n")};
    case "dice-roller": { const sides=Number(option)||6,count=Math.max(1,Math.min(100,Math.trunc(amount)||1)); const rolls=Array.from({length:count},()=>randomInt(1,sides)); return {result:`${rolls.join(", ")}\nTotal: ${rolls.reduce((a,b)=>a+b,0)}`}; }
    case "coin-flip": { const count=Math.max(1,Math.min(1000,Math.trunc(amount)||1)); const heads=Array.from({length:count},()=>randomInt(0,1)).filter(Boolean).length; return {result:`Heads: ${heads}\nTails: ${count-heads}\nHeads ratio: ${(heads/count*100).toFixed(1)}%`}; }
    case "password-generator": case "random-string-generator": { const length=Math.max(4,Math.min(256,Math.trunc(amount)||16)); const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+"; let out=""; for(let i=0;i<length;i++)out+=chars[randomInt(0,chars.length-1)]; return {result:out}; }
    case "character-count":return{result:`${messages.countCharacters}: ${text.length}\n${messages.countCharactersNoSpaces}: ${text.replace(/\s/g,"").length}\n${messages.lineCount}: ${text?lines.length:0}\n${messages.wordCount}: ${(text.trim().match(/\S+/g)||[]).length}`};
    case "remove-spaces":output=option==="all"?text.replace(/\s/g,""):text.replace(/[\t ]{2,}/g," ");break;
    case "remove-line-breaks":output=text.replace(/\s*\r?\n\s*/g," ");break;
    case "remove-duplicate-lines":output=[...new Set(lines)].join("\n");break;
    case "sort-lines":output=lines.sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})*(option==="desc"?-1:1)).join("\n");break;
    case "text-case-converter":output=option==="upper"?text.toLocaleUpperCase():option==="title"?text.toLocaleLowerCase().replace(/\b\p{L}/gu,(character)=>character.toLocaleUpperCase()):text.toLocaleLowerCase();break;
    case "text-compare":{const a=lines,b=secondText.split(/\r?\n/);return{result:[...a.filter((line)=>!b.includes(line)).map((line)=>`− ${line}`),...b.filter((line)=>!a.includes(line)).map((line)=>`+ ${line}`)].join("\n")||messages.sameText};}
    case "reverse-text":output=Array.from(text).reverse().join("");break;
    case "remove-duplicate-words":{const words=text.match(/\S+/g)||[];const seen=new Set<string>();output=words.filter((word)=>{const key=word.toLocaleLowerCase();if(seen.has(key))return false;seen.add(key);return true;}).join(" ");break;}
    case "remove-empty-lines": output=lines.filter(line=>line.trim().length>0).join("\n");break;
    case "add-line-numbers": output=lines.map((line,i)=>`${i+1}. ${line}`).join("\n");break;
    case "remove-line-numbers": output=lines.map(line=>line.replace(/^\s*\d+[.)]?\s*/,"")).join("\n");break;
    case "remove-characters": output=option==="digits"?text.replace(/\d/g,""):option==="latin"?text.replace(/[A-Za-z]/g,""):option==="hangul"?text.replace(/[\uAC00-\uD7AF]/g,""):option==="special"?text.replace(/[^\p{L}\p{N}\s]/gu,""):text.replaceAll(secondText,"");break;
    case "text-repeater": {const count=Math.max(1,Math.min(1000,Math.trunc(amount)||1));if(text.length*count>1_000_000)throw new Error("The generated text is limited to 1,000,000 characters.");output=Array(count).fill(text).join(option||"");break;}
    case "text-to-file": return {result:`${text.length} characters ready to download.`,download:new Blob([text],{type:"text/plain;charset=utf-8"})};
    case "lorem-ipsum": {const count=Math.max(1,Math.min(20,Math.trunc(amount)||3));output=Array.from({length:count},()=>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.").join("\n\n");break;}
    case "regex-tester": {const match=text.match(/^\/(.*)\/([dgimsuvy]*)$/);if(!match)throw new Error("Enter a pattern as /pattern/flags in the first line.");const [pattern,flags]=[match[1],match[2]];if(pattern.length>200||secondText.length>20000)throw new Error("Pattern or sample is too long.");if(/\([^)]*[+*][^)]*\)[+*{]|\\[1-9]/.test(pattern))throw new Error("Nested repetition and backreferences are disabled for safety.");const sample=secondText.slice(0,20000);output=await runRegexInWorker(pattern,flags,sample);break;}
    case "color-converter": {const hex=text.trim().replace(/^#/ ,"");if(!/^[0-9a-f]{3}([0-9a-f])?$|^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex))throw new Error("Enter a 3, 6, or 8 digit HEX color.");const normalized=hex.length===3?hex.split("").map(c=>c+c).join(""):hex;const [r,g,b]=[0,2,4].map(i=>parseInt(normalized.slice(i,i+2),16));output=`HEX: #${normalized.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})`;break;}
    case "barcode-checker": {const code=text.trim();if(!/^\d+$/.test(code)||![12,13].includes(code.length))throw new Error("Enter a 12-digit UPC-A or 13-digit EAN-13 code.");const body=code.slice(0,-1);const sum=Array.from(body,(digit,i)=>Number(digit)*((body.length-i)%2===1?3:1)).reduce((a,b)=>a+b,0);const expected=(10-sum%10)%10;output=`${code.length===13?"EAN-13":"UPC-A"}: ${Number(code.at(-1))===expected?"Valid":"Invalid"}\nExpected check digit: ${expected}`;break;}
    case "sql-formatter": {const {format}=await import("sql-formatter");output=format(text,{language:"sql"});break;}
    case "html-formatter": case "css-formatter": case "javascript-formatter": {const prettier=await import("prettier/standalone");const lang=slug==="html-formatter"?"html":slug==="css-formatter"?"css":"babel";const plugin=slug==="html-formatter"?(await import("prettier/plugins/html")).default:slug==="css-formatter"?(await import("prettier/plugins/postcss")).default:(await import("prettier/plugins/babel")).default;const plugins=slug==="javascript-formatter"?[plugin,(await import("prettier/plugins/estree")).default]:[plugin];output=await prettier.format(text,{parser:lang,plugins,printWidth:100});break;}
    case "cron-parser": {const {CronExpressionParser}=await import("cron-parser");try{const interval=CronExpressionParser.parse(text.trim());const times=Array.from({length:5},()=>interval.next().toDate().toLocaleString(locale));return{result:`${text.trim()}\n\n${locale==="ko"?"다음 실행 시간":locale==="ja"?"次回の実行時刻":locale==="zh"?"接下来的运行时间":"Upcoming run times"}\n${times.map((time,i)=>`${i+1}. ${time}`).join("\n")}`};}catch{throw new Error(locale==="ko"?"5개 또는 6개 필드 Cron 표현식을 입력하세요.":locale==="ja"?"5または6フィールドのCron式を入力してください。":locale==="zh"?"请输入五字段或六字段Cron表达式。":"Enter a valid five or six field cron expression.");}}
    case "json-formatter":case "json-validator":{
      try{const parsed=JSON.parse(text);output=JSON.stringify(parsed,null,option==="minify"?0:2);return slug==="json-validator"?{result:messages.validJson}:{result:output,download:new Blob([output],{type:"application/json"})};}
      catch(error){if(slug==="json-validator")throw new Error(messages.errors.invalidJson);const message=error instanceof Error?error.message:"";const position=message.match(/position (\d+)/i);throw new Error(position?`${messages.errors.invalidJson} (${messages.line}: ${text.slice(0,Number(position[1])).split("\n").length})`:messages.errors.invalidJson);}
    }
    case "json-to-yaml":{const YAML=(await import("yaml")).default;try{output=YAML.stringify(JSON.parse(text));}catch{throw new Error(messages.errors.invalidJson);}break;}
    case "yaml-to-json":{const YAML=(await import("yaml")).default;try{output=JSON.stringify(YAML.parse(text),null,2);}catch{throw new Error(messages.errors.invalidYaml);}break;}
    case "csv-to-json":{const Papa=(await import("papaparse")).default;const parsed=Papa.parse<Record<string,string>>(text,{header:true,skipEmptyLines:true,dynamicTyping:true});if(parsed.errors.length)throw new Error(messages.errors.invalidCsv);output=JSON.stringify(parsed.data,null,2);break;}
    case "json-to-csv":{const Papa=(await import("papaparse")).default;let parsed:unknown;try{parsed=JSON.parse(text);}catch{throw new Error(messages.errors.invalidJson);}if(!Array.isArray(parsed)||parsed.some((row)=>!row||typeof row!=="object"||Array.isArray(row)))throw new Error(messages.jsonArray);output=Papa.unparse(parsed);break;}
    case "base64":output=option==="decode"?new TextDecoder().decode(Uint8Array.from(atob(text.trim()),(character)=>character.charCodeAt(0))):btoa(Array.from(new TextEncoder().encode(text),(byte)=>String.fromCharCode(byte)).join(""));break;
    case "url-encode-decode":output=option==="decode"?decodeURIComponent(text):encodeURIComponent(text);break;
    case "uuid-generator":return{result:Array.from({length:Math.max(1,Math.min(100,Number(amount)||1))},()=>crypto.randomUUID()).join("\n")};
    case "timestamp-converter":{const value=text.trim()?Number(text):Date.now();const milliseconds=option==="date"?(text.trim()?Date.parse(text):Date.now()):option==="seconds"?value*1000:value;if(!Number.isFinite(milliseconds))throw new Error(messages.errors.invalidDate);const date=new Date(milliseconds);if(Number.isNaN(date.getTime()))throw new Error(messages.errors.invalidDate);return{result:`${messages.unixSeconds}: ${Math.floor(milliseconds/1000)}\n${messages.unixMilliseconds}: ${milliseconds}\n${messages.localTime}: ${date.toLocaleString(locale)}\nUTC: ${date.toISOString()}\nISO 8601: ${date.toISOString()}`};}
    default:throw new Error(messages.errors.processing);
  }
  return{result:output,download:new Blob([output],{type:"text/plain;charset=utf-8"})};
}

function runRegexInWorker(pattern:string,flags:string,sample:string):Promise<string>{
  return new Promise((resolve,reject)=>{
    const source=`onmessage=({data})=>{try{const [pattern,flags,sample]=data;const re=new RegExp(pattern,flags.includes('g')?flags:flags+'g');const matches=Array.from(sample.matchAll(re)).slice(0,100).map(m=>m[0]+' (index '+m.index+')');postMessage(matches.join('\\n')||'No matches')}catch{postMessage('Invalid regular expression.')}}`;
    const url=URL.createObjectURL(new Blob([source],{type:"text/javascript"}));const worker=new Worker(url);let settled=false;
    const timeout=window.setTimeout(()=>{settled=true;worker.terminate();URL.revokeObjectURL(url);reject(new Error("Regular expression exceeded the 250 ms time limit."));},250);
    worker.onmessage=({data}:{data:string})=>{if(settled)return;settled=true;window.clearTimeout(timeout);worker.terminate();URL.revokeObjectURL(url);resolve(data)};
    worker.onerror=()=>{if(settled)return;settled=true;window.clearTimeout(timeout);worker.terminate();URL.revokeObjectURL(url);reject(new Error("Regular expression could not be processed."))};worker.postMessage([pattern,flags,sample]);
  });
}
