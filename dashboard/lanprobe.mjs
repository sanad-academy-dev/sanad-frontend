import { spawn } from "node:child_process";
import fs from "node:fs"; import http from "node:http"; import os from "node:os"; import path from "node:path";
import { WebSocket } from "ws";
const URL_ = "http://localhost:3001/request-visit/elite-vet-dev";
const PORT = 9477;
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new",
	`--remote-debugging-port=${PORT}`, "--no-first-run", "--disable-gpu", "--window-size=500,900",
	`--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(),"chr-"))}`, "about:blank"]);
chrome.stderr.on("data", () => {});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = (p) => new Promise((res, rej) => http.get({host:"127.0.0.1",port:PORT,path:p},(x)=>{let b="";x.on("data",d=>b+=d);x.on("end",()=>res(JSON.parse(b)));}).on("error",rej));
let t; for (let i=0;i<60;i++){ try{ t=(await getJson("/json/list")).find(x=>x.type==="page"); if(t) break; }catch{} await sleep(500); }
const ws = new WebSocket(t.webSocketDebuggerUrl,{maxPayload:256*1024*1024});
let id=0; const pend=new Map(); const errs=[]; const failed=[];
ws.on("message",(raw)=>{ const m=JSON.parse(raw.toString());
	if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id);}
	if(m.method==="Runtime.exceptionThrown") errs.push("EXC: "+(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text));
	if(m.method==="Runtime.consoleAPICalled"&&m.params.type==="error") errs.push("ERR: "+m.params.args.map(a=>a.value??a.description).join(" "));
	if(m.method==="Log.entryAdded") errs.push("LOG["+m.params.entry.level+"]: "+m.params.entry.text+" "+(m.params.entry.url??""));
	if(m.method==="Network.loadingFailed") failed.push(`${m.params.errorText} ${m.params.type}`);
	if(m.method==="Network.responseReceived") failed.push(`${m.params.response.status} ${m.params.response.url.replace("http://localhost:3001","").slice(0,95)}`);
});
const send=(method,params={})=>new Promise(r=>{const mid=++id;pend.set(mid,r);ws.send(JSON.stringify({id:mid,method,params}));});
await new Promise(r=>ws.on("open",r));
await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable"); await send("Log.enable");
await send("Page.navigate",{url:URL_}); await sleep(30000);
const info = await send("Runtime.evaluate",{expression:`JSON.stringify({url:location.href, ready:document.readyState, bodyLen:document.body.innerHTML.length, text:document.body.innerText.slice(0,120), html:document.body.innerHTML.slice(0,300)})`,returnByValue:true});
console.log("INFO:", info.result?.value);
console.log("\nFAILED REQUESTS:"); [...new Set(failed)].slice(0,10).forEach(f=>console.log("  "+f));
console.log("\nERRORS:"); [...new Set(errs)].slice(0,8).forEach(e=>console.log("  "+e.slice(0,300)));
ws.close(); chrome.kill(); process.exit(0);
