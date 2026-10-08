import { getMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";

export type ProcessedText={result:string;download?:Blob};

export async function processText(slug:string,text:string,secondText:string,option:string,amount:number,locale:Locale="ko"):Promise<ProcessedText>{
  const messages=getMessages(locale);
  const lines=text.split(/\r?\n/);let output=text;
  switch(slug){
    case "character-count":return{result:`${messages.countCharacters}: ${text.length}\n${messages.countCharactersNoSpaces}: ${text.replace(/\s/g,"").length}\n${messages.lineCount}: ${text?lines.length:0}\n${messages.wordCount}: ${(text.trim().match(/\S+/g)||[]).length}`};
    case "remove-spaces":output=option==="all"?text.replace(/\s/g,""):text.replace(/[\t ]{2,}/g," ");break;
    case "remove-line-breaks":output=text.replace(/\s*\r?\n\s*/g," ");break;
    case "remove-duplicate-lines":output=[...new Set(lines)].join("\n");break;
    case "sort-lines":output=lines.sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})*(option==="desc"?-1:1)).join("\n");break;
    case "text-case-converter":output=option==="upper"?text.toLocaleUpperCase():option==="title"?text.toLocaleLowerCase().replace(/\b\p{L}/gu,(character)=>character.toLocaleUpperCase()):text.toLocaleLowerCase();break;
    case "text-compare":{const a=lines,b=secondText.split(/\r?\n/);return{result:[...a.filter((line)=>!b.includes(line)).map((line)=>`− ${line}`),...b.filter((line)=>!a.includes(line)).map((line)=>`+ ${line}`)].join("\n")||messages.sameText};}
    case "reverse-text":output=Array.from(text).reverse().join("");break;
    case "remove-duplicate-words":{const words=text.match(/\S+/g)||[];const seen=new Set<string>();output=words.filter((word)=>{const key=word.toLocaleLowerCase();if(seen.has(key))return false;seen.add(key);return true;}).join(" ");break;}
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
