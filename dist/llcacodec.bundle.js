"use strict";var llcacodec=(()=>{var T=Object.defineProperty;var Ae=Object.getOwnPropertyDescriptor;var ye=Object.getOwnPropertyNames;var Ie=Object.prototype.hasOwnProperty;var _e=(e,t)=>{for(var r in t)T(e,r,{get:t[r],enumerable:!0})},$e=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of ye(t))!Ie.call(e,i)&&i!==r&&T(e,i,{get:()=>t[i],enumerable:!(n=Ae(t,i))||n.enumerable});return e};var Be=e=>$e(T({},"__esModule",{value:!0}),e);var ze={};_e(ze,{CONWAY_LIFE_RULE_DATA:()=>L,default:()=>Xe,getLifeRuleFormat:()=>S,getLifeStringFormat:()=>J,isLifeStringFormat:()=>Se,isValidLifeRule:()=>D,makeLifeRule:()=>w,readLifeRule:()=>g,readLifeString:()=>De,writeLifeString:()=>Ne});var m=class{constructor(t=[]){this.map=new Map;this._length=0,t.forEach(r=>this.add(r[0],r[1]))}clear(t=!1){t?this.map=new Map:[...this.map.values()].forEach(r=>r.clear()),this._length=0}get length(){return this._length}getTuples(){let t=new Array(this.length),r=0;return this.forEach(n=>{t[r]=n,r++}),t}forEach(t){this.map.forEach((r,n)=>r.forEach(i=>t([n,i])))}add(t,r){var n,i;((n=this.map.get(t))==null?void 0:n.has(r))===!1?((i=this.map.get(t))==null||i.add(r),this._length+=1):this.map.has(t)===!1&&(this.map.set(t,new Set([r])),this._length+=1)}remove(t,r){let n;(n=this.map.get(t))&&n.has(r)&&(n.delete(r),this._length-=1,n.size===0&&this.map.delete(t))}has(t,r){var n;return((n=this.map.get(t))==null?void 0:n.has(r))||!1}hasAll(t){return t.every(r=>this.has(r[0],r[1]))}hasAllExact(t){return t.length===this.length&&this.hasAll(t)}combine(...t){let r=new m;return r.push(this,...t),r}push(...t){t.forEach(r=>Array.isArray(r)?this.add(r[0],r[1]):r.forEach(n=>this.add(n[0],n[1])))}*[Symbol.iterator](){for(let t of this.map)for(let r of t[1])yield[t[0],r]}equals(t){if(this.length!==t.length)return!1;for(let r of this)if(t.has(r[0],r[1])===!1)return!1;return!0}};function K(e){try{return e(),!1}catch(t){return!0}}var Me=48,Te=57;function R(e){return e.length===1&&e.charCodeAt(0)>=Me&&e.charCodeAt(0)<=Te}var k=e=>e.trim()!==""&&!isNaN(e);function F(e){for(let t=0;t<e.length;t++)if(t===0){if(!R(e[t])&&e[t]!=="-")return!1}else if(!R(e[t]))return!1;return!0}function P(e){if(e.length===0)throw new Error("Cannot create bounding box over empty area");let t=e[0][1],r=e[0][1],n=e[0][0],i=e[0][0];for(let o=0;o<e.length;o++)t=Math.min(t,e[o][1]),n=Math.min(n,e[o][0]),r=Math.max(r,e[o][1]),i=Math.max(i,e[o][0]);return{x:n,y:r,width:Math.abs(i-n)+1,height:Math.abs(r-t)+1}}function C(e){if(e.length===0)return[];let t=P(e),r=Array.from({length:t.height},()=>new Array(t.width).fill(0));return e.forEach(n=>{r[t.y-n[1]][n[0]-t.x]=1}),r}function ke(e){return typeof e=="object"&&e!==null&&"stack"in e&&typeof e.stack=="string"&&"message"in e&&typeof e.message=="string"}function Q(e){return ke(e)?e.message:typeof e=="string"?e:"toString"in e?e.toString():""}function Z(e){let t=new m,r=[];for(let n=0;n<e.length;n++)t.has(e[n][0],e[n][1])||(r.push([...e[n]]),t.add(e[n][0],e[n][1]));return r}var N="#Life 1.06";function U(e){return e.trim().startsWith(N)}function ee(e){let t=[];t.push(N+`
`);let r=new m;for(let n=0;n<e.liveCoordinates.length;n++){let[i,o]=e.liveCoordinates[n];r.has(i,o)||(t.push(`${i} ${o}
`),r.add(i,o))}return t.join("")}function te(e){if(!e.trim().startsWith(N))throw new Error(`Could not read Life 1.06 string. Error at Line 1: does not begin with appropriate header. Must be "${N}" ${e}`);let t=[],r=new m,n=e.split(`
`),i=!1;for(let o=1;o<n.length;o++){let a=n[o].trim().split(" ").filter(s=>s.length>0);if(a.length!==2){if(a.length===0){i=!0;continue}throw new Error(`Invalid Life 1.06 string. Error at Line ${o}. There must be an X and a Y position only on subsequent lines after the Life 1.06 Header 
${e}
 `)}if(i)throw new Error(`Invalid Life 1.06 string: 
${e}
 Error at Line ${o}. X and Y Values must be on subsequent lines`);if(F(a[0])&&F(a[1])){let[s,l]=[Number.parseInt(a[0]),Number.parseInt(a[1])];r.has(s,l)||(r.add(s,l),t.push([s,l]))}else throw new Error(`Invalid Life 1.06 string. Error at Line ${o}. Cell positions must be integers ( got ${a[0]} and ${a[1]}) 
${e}
 `)}return{format:"life 1.06",liveCoordinates:t}}function p(e,t){if(t.length!==1)throw new Error(`[llcacodec::isNextChar Cannot query for next ${t.length} length character. Character must have a length of 1`);if(t===" ")throw new Error("[llcacodec::isNextChar Cannot query for next whitespace character");let r=0;for(;r<e.length;){if(e[r]!==" ")return e[r]===t;r++}throw new Error("")}function c(e,t=""){if(t.length>1)throw new Error(`[llcacodec::readChar Cannot read next ${t.length} length character. Character must have a length of 1]`);if(t===" ")throw new Error("[llcacodec::readChar Cannot read whitespace character]");if(t===void 0)throw new Error("[llcacodec::readChar Cannot read undefined]");let r=0;for(;r<e.length;){if(e[r]!==" "){if(t!==""&&t!==e[r])throw new Error(`[llcacodec::readChar Failed to read next character as ${t}, got ${e[r]}]`);return[e[r],r+1<e.length?e.substring(r+1):""]}r++}throw new Error("[strRead::readChar] Reached end of string and could not read any next characters")}function h(e,t){if(typeof t=="string"){let r=t.split("");if(r.length===0)throw new Error("Cannot read 0 characters from a string");let n=e;for(let i=0;i<r.length;i++){let[,o]=c(n,r[i]);n=o}return[r,n]}else if(typeof t=="number"){if(Number.isInteger(t)){if(t<0)throw new Error("Cannot read a negative amount of characters from a string")}else throw new Error("Cannot read a non-integer amount of characters from a string");let r=[],n=e;for(let i=0;i<t;i++){let[o,a]=c(n);n=a,r.push(o)}return[r,n]}else throw new Error("Passed in non-string non-number value to charOrCount of readChars")}function b(e,t){if(t.length===0)throw new Error("[llcacodec::isNextChars Cannot check if next characters in string is empty");let r=0,n=0;for(;r<e.length&&n<t.length;){if(t[n]===" ")throw new Error("[llcacodec::isNextChars Cannot check if next character in string is whitespace");if(e[r]!==" ")if(e[r]===t[n])n++;else return!1;r++}return n===t.length}function Fe(e){let[t,r]=V(e);if(k(t)){let n=Number(t);if(!isNaN(n))return[n,r];throw new Error(`[llcacodec::readNumber Number String ${t} incorrectly converted to NaN]`)}throw new Error(`[llcacodec::readNumber Number String ${t} is not a numerical string]`)}function H(e,t){if(t<0)throw new Error("Cannot read a negative amount of numbers");if(!Number.isInteger(t))throw new Error("Cannot read a decimal number of numbers");let r=[],n=e;for(let i=0;i<t;i++){let[o,a]=Fe(n);r.push(o),n=a}return[r,n]}function re(e,t){let[r,n]=H(e,t);if(r.every(i=>Number.isInteger(i)))return[r,n];throw new Error(`Cannot read ${t} integers: Found non integer values: ${r.map((i,o)=>[o,i]).filter(i=>!Number.isInteger(i[1]))} `)}function W(e){let t=!1,r=0,n=[];for(;r<e.length;){let o=e[r];if(o===" ")if(n.length===0){r++;continue}else break;else if(o==="-")if(n.length===0)n.push("-");else break;else if(o===".")if(t===!1)n.push("."),t=!0;else break;else if(R(o))n.push(o);else{if(n.length===0)throw new Error(`Could not read cramped number (Encountered invalid char ${o} at index ${r} of string "${e}")`);break}r++}let i=n.join("");if(k(i)){let o=Number(i);if(!isNaN(o))return[o,r<e.length?e.substring(r):""];throw new Error(`Cramped Number read as NaN (got "${i}" ) ( passed in: "${e}" )`)}throw new Error(`Cramped Number not evaluated to numeric string (got ${i} ) ( passed in: ${e})`)}function V(e){let t=0,r=-1;for(;t<e.length;){if(e[t]===" ")if(r===-1){t++;continue}else return[t>0?e.substring(r,t):"",t<e.length?e.substring(t):""];r===-1&&(r=t),t++}if(r===-1)throw new Error(`[llcacodec::readNext could not read sequence, no beginning to a non-whitespace sequence could be found (data: ${e})]`);return[e.substring(r,t),t<e.length?e.substring(t):""]}var oe=["."],O=["O","*"];function ae(e){let t=[];if("matrix"in e)t=e.matrix;else{for(let o=0;o<e.liveCoordinates.length;o++)if(!Number.isInteger(e.liveCoordinates[o][0])||!Number.isInteger(e.liveCoordinates[o][1]))throw new Error(`Attempted to write plain text with Invalid Coordinates: Coordinates must all be integers (Error at coordinate #${o} x: ${e.liveCoordinates[o][0]} y: ${e.liveCoordinates[o][1]} `);t=C(e.liveCoordinates)}let r=[];r.push("!Name: "+e.name+`
`),e.description.length>0&&(typeof e.description=="string"?e.description.replace("\r","").split(`
`).forEach(a=>r.push(`!${a}
`)):e.description.flatMap(a=>a.split(`
`)).forEach(a=>r.push(`!${a}
`))),r.push(`!
`);let n=t.length,i=Math.max(...t.map(o=>o.length));for(let o=0;o<n;o++){for(let a=0;a<i;a++)a>=t[o].length?r.push("."):r.push(t[o][a]===0?".":"O");r.push(`
`)}return r.join("")}function Y(e){try{return j(e),!0}catch(t){return!1}}function j(e){if(e.length===0)throw new Error("[llcacodec] Attempted to pass in empty string toward Plain Text Decoder");let t=e.replace("\r","").split(`
`).map(o=>o.trim());if(t.length===0)throw new Error(`[llcacodec] Could not find any unique lines in plain text string "${e}"`);let r={format:"plaintext",name:"",description:[],matrix:[],liveCoordinates:[]};if(p(t[0],"!")){let[,o]=c(t[0],"!");if(b(o,"Name:")){let[,a]=h(o,"Name:");r.name=a.trim()}else r.name=o.trim()}else{let o=e.trim();if(v(o))return{format:"plaintext",name:"",description:[],matrix:ie(o),liveCoordinates:ne(o)};throw new Error(`[llcacodec::readPlaintextString] attempted to read invalid plain text string ${e}. ${e} could neither be determined to be a plaintext string nor a plaintext diagram`)}let n=1;for(;p(t[n],"!");){let[,o]=c(t[n],"!");o.trim().length>0&&r.description.push(o.trim()),n++}let i=t.slice(n).join(`
`);if(v(i))r.liveCoordinates=ne(i),r.matrix=ie(i);else throw new Error("[llcacodec::readPlaintextString could not read final section of Plaintext string as Plaintext diagram]");return r}function ne(e){if(!v(e))throw new Error(`[llcacodec::readPlaintextDiagramToXY] attempted to read invalid plaintext diagram ${e}`);return e.split(`
`).flatMap((r,n)=>r.split("").map((i,o)=>O.some(a=>a===i)?[o,-n]:[]).filter(i=>i.length>0))}function ie(e){if(!v(e))throw new Error(`[llcacodec::readPlaintextDiagramToXY] attempted to read invalid plaintext diagram ${e}`);let t=e.trim().replace("\r","").split(`
`),r=Math.max(...t.map(n=>n.length));return t.map(n=>{let i=new Array(r);for(let o=0;o<r;o++)if(o>=n.length)i[o]=0;else if(O.some(a=>a===n[o]))i[o]=1;else if(oe.some(a=>a===n[o]))i[o]=0;else if(n[o]!==" "&&n[o]!=="\r")throw new Error(`[llcacodec::readPlaintextDiagramToMatrix Found invalid character (UTF-8 code: ${n[o].charCodeAt(0)})`);return i})}function v(e){return e.split("").every(t=>oe.some(r=>r===t)||O.some(r=>r===t)||t===" "||t===`
`||t==="\r")}var L=()=>({birth:[3],survival:[2,3]});function x({birth:e,survival:t}){return t.some(r=>r<0||r>8)?"Survival neighborhood rules must be between 0 and 8":e.some(r=>r<0||r>8)?"Birth neighborhood rules must be between 0 and 8":t.some(r=>isNaN(r))?"Survival neighborhood rules cannot contain NaN":e.some(r=>isNaN(r))?"Birth neighborhood rules cannot contain NaN":t.some(r=>!Number.isInteger(r))?"Survival neighborhood rules must be integer values":e.some(r=>!Number.isInteger(r))?"Birth neighborhood rules must be integer values":t.length>8?"Can only have 8 maximum survival rules":e.length>8?"Can only have 8 maximum birth rules":t.length!==new Set(t).size?"Not all survival rules are unique":e.length!==new Set(e).size?"Not all birth rules are unique":""}function E(e){return x(e)===""}var A="B3/S23";function Pe(e){let t=e.split("/");if(t.length<2)return`Not able to split string into birth and survival counts, format must include a forward slash (B/S Notation: B<NUMS>/S<NUMS>) (got: ${e})`;if(t.length>2)return`Not able to split string into birth and survival counts, format must include a forward slash (b/s Notation: B<NUMS>/S<NUMS>) (got: ${e})`;if(t[0].charAt(0).toLowerCase()!=="b"||t[1].charAt(0).toLowerCase()!=="s")return`B and S not declared correctly, please switch to B<NUMS>/S<NUMS>  (b/s Notation: B<NUMS>/S<NUMS>) (got: ${e})`;let r=t[0].substring(1).split("").map(i=>Number.parseInt(i)),n=t[1].substring(1).split("").map(i=>Number.parseInt(i));return r.some(i=>isNaN(i))||n.some(i=>isNaN(i))?`Must include numbers after B and after /S B<NUMS>/S<NUMS>. Found NaN (b/s Notation: B<NUMS>/S<NUMS>) (got: ${e})`:r.some(i=>i<0||i>8)||n.some(i=>i<0||i>8)?`All rule numbers must lie in the range 0 <= num <= 8 (b/s Notation: B<NUMS>/S<NUMS>) (got: ${e})`:new Set(r).size!==r.length||new Set(n).size!==n.length?`Replicate number on one side of B<NUMS>/S<NUMS>. All numbers must be unique (b/s Notation: B<NUMS>/S<NUMS>) (got: ${e})`:""}function y(e){return Pe(e)===""}function se(e){let{birth:t,survival:r}=e;if(E(e))return`B${[...t].sort((n,i)=>n-i).join("")}/S${[...r].sort((n,i)=>n-i).join("")}`;throw new Error(`Cannot make new life string from (birth: [${t}]) and (survival: [${r}]): ${x(e)}`)}function le(e){if(y(e)){let t={birth:[],survival:[]},[r,n]=e.split("/");for(let i=1;i<r.length;i++){let o=Number.parseInt(r.charAt(i));t.birth.push(o)}for(let i=1;i<n.length;i++){let o=Number.parseInt(n.charAt(i));t.survival.push(o)}return t}throw new Error("")}var q="23/3";function ue(e){let t=e.split("/");if(t.length!==2)return`Not able to split s/b life-like rule string into birth and survival counts, format must include a forward slash <Survival Digits>/<Birth Digits> (got: ${e})`;let r=[],n=[];return t[0].length>0&&(t[0][0].toUpperCase()==="S"?r.push(...t[0].substring(1).split("").map(i=>Number.parseInt(i))):r.push(...t[0].split("").map(i=>Number.parseInt(i)))),t[1].length>0&&(t[1][0].toUpperCase()==="B"?n.push(...t[1].substring(1).split("").map(i=>Number.parseInt(i))):n.push(...t[1].split("").map(i=>Number.parseInt(i)))),r.some(i=>isNaN(i))||n.some(i=>isNaN(i))?`Must include only numbers before and after the slash "/" in S/B notation (<Survival Digits>/<Birth Digits>) (got: ${e})`:r.some(i=>i===9)||n.some(i=>i===9)?`9 is an invalid input for s/b notation string (got: ${e})`:new Set(r).size!==r.length||new Set(n).size!==n.length?`Replicate number on side of <Survival Digits>/<Birth Digits> (got ${e})`:""}function I(e){return ue(e)===""}function fe(e){let{birth:t,survival:r}=e;if(E(e))return`${[...r].sort((n,i)=>n-i).map(n=>n.toString()).join("")}/${[...t].sort((n,i)=>n-i).map(n=>n.toString()).join("")}`;throw new Error(`[makeSBLifeString] Error while creating lifeString from (${JSON.stringify(e)}), ${x(e)}`)}function ce(e){if(I(e)){let t=e.split("/");return{survival:t[0].substring(t[0].length>0&&t[0][0].toUpperCase()==="S"?1:0).split("").map(r=>Number.parseInt(r)),birth:t[1].substring(t[1].length>0&&t[1][0].toUpperCase()==="B"?1:0).split("").map(r=>Number.parseInt(r))}}throw new Error(`[readSBRuleString] Error while parsing s/b notation ruleString: ${ue(e)}`)}var ge=131071;function me(e){return Number.isInteger(e)?e>ge?`Life integer is an integer greater than maximum value of 2^16 - 1 (${ge})`:e<0?"Life integer is an integer less than 0":"":"Life integer is not an integer value"}function _(e){return me(e)===""}function he(e){if(_(e)){let t=e&255,r=(e&65280)>>9,n={birth:[],survival:[]};for(let i=0;i<=8;i++)t&1<<i&&n.birth.push(i),r&1<<i&&n.survival.push(i);return n}throw new Error(`Could not read life rule integer: ${me(e)}`)}function de(e){if(E(e)){let n=0,{birth:i,survival:o}=e;return i.forEach(a=>{n|=1<<a+0}),o.forEach(a=>{n|=1<<a+9}),n}throw new Error(`Could not make life rule integer from ${JSON.stringify(e)}: ${x(e)}`)}function D(e,t=""){let r=t===""?S(e):t;if(r==="N/A")return!1;if(typeof e=="number")return r!=="int"?!1:_(e);if(typeof e=="string")switch(r){case"b/s":return y(e);case"s/b":return I(e)}return!1}function S(e){if(typeof e=="string"){if(y(e))return"b/s";if(I(e))return"s/b"}else if(typeof e=="number"&&_(e))return"int";return"N/A"}function g(e,t=""){let r=t===""?S(e):t;if(r==="N/A")throw new Error(`Could not parse Life String: ${e}, could not find a fitting format (Available formats are "b/s", "s/b", and "int"), read at https://conwaylife.com/wiki/Rulestring https://conwaylife.com/wiki/Rule_integer)`);if(typeof e=="number"){if(t!=="int"&&t!=="")throw new Error(`Could not read rule ${e} in requested format ${t}, as the integer value ${e} cannot be in the ${t} string format`);return he(e)}switch(r){case"b/s":return le(e);case"s/b":return ce(e)}throw new Error(`Could not parse Life String: ${e}, could not find a fitting format (Available formats are "b/s", "s/b", and "int"), read at https://conwaylife.com/wiki/Rulestring https://conwaylife.com/wiki/Rule_integer)`)}function w(e,t){try{switch(t){case"b/s":return se(e);case"s/b":return fe(e);case"int":return de(e)}}catch(r){throw new Error(`Could not make life rule string from life rule data object: (${JSON.stringify(e)}) : ${Q(r)}`)}}function pe(e,t){let r=g(e);return w(r,t)}var $="b",B="o",G="$",M="!",Ue=["0","1","2","3","4","5","6","7","8","9"],He=[$,B,G,M,...Ue,`
`,"\r"];function We(e){return He.some(t=>t===e)}function Ve(e,t=[0,0]){let r=0,n=[],i={liveCoordinates:[],pattern:"",endingIndex:0,topleft:[...t]},o=[...t];for(;We(e[r])&&r<e.length;){if(e[r]===M)return i.pattern=e.substring(0,r),i.endingIndex=r,i;if(R(e[r]))n.push(e[r]);else if(e[r]===B||e[r]===$){let a=n.length===0?1:Number.parseInt(n.join(""));if(n=[],isNaN(a))throw new Error("");if(e[r]===B)for(let s=0;s<a;s++)i.liveCoordinates.push([...o]),o[0]++;else e[r]===$&&(o[0]+=a)}else if(e[r]===G){let a=n.length===0?1:Number.parseInt(n.join(""));n=[],o[0]=t[0],o[1]-=a}r++}if(r===e.length-1)return i.pattern=e,i.endingIndex=e.length-1,i;throw new Error(`Unexpected ending to RLE Data. Ended at char (${e[r]} at index ${r} of ${e.length})`)}function Le(e){let t=e.trim(),r={width:0,height:0,ruleString:null,rule:null,full:t},[,n]=h(t,"x="),[i,o]=W(n);r.width=i;let[,a]=h(o,",y="),[s,l]=W(a);if(r.height=s,b(l,",rule=")){let[,f]=h(l,",rule="),[u,d]=V(f);if(D(u))r.rule=g(u),r.ruleString=u;else throw new Error(`Invalid Rule found in RLE Data while parsing RLE Header Line: "${u}" ( passed in "${e}") `)}return r}function X(e){let t=e.trim().split(`
`);for(let r=0;r<t.length;r++)if(!t[r].trim().startsWith("#")&&r<t.length-1)return!K(()=>Le(t[r].trim()));return!1}function xe(e){let t=e.trim().split(`
`),r=0,n={format:"rle",comments:[],name:"",creationData:"",topleft:[0,0],foundTopLeft:!1,width:0,height:0,ruleString:A,rule:L(),liveCoordinates:[],hashLines:[]};for(;p(t[r],"#");){let[,s]=c(t[r],"#"),[l,f]=c(s),u=f.trim();if(u.length>0)if(l==="C"||l==="c")n.comments.push(u);else if(l==="N")n.name=u;else if(l==="O")n.creationData=u;else if(l==="P"||l==="R"){let[[d,ve]]=H(f,2);n.topleft=[d,ve],n.foundTopLeft=!0}else l==="r"&&(n.ruleString=u,n.rule=g(u));n.hashLines.push({content:f.trim(),id:l,full:t[r].trim()}),r++}let i=Le(t[r]);n.width=i.width,n.height=i.height,i.ruleString!==null&&i.rule!==null&&(n.rule=i.rule,n.ruleString=i.ruleString),r++;let o=t.slice(r).join(`
`),a=Ve(o,n.topleft);if(n.liveCoordinates=a.liveCoordinates,a.endingIndex+1!==o.length-1){let l=o.substring(a.endingIndex+1).split(`
`);n.comments.push(...l.map(f=>f.trim()).filter(f=>f.length>0))}return n}function Oe(e,t){if(e.length!==1)throw new Error(`[llcacodec] Cannot RLE Encode character ${e} with a length of ${e.length}. Length of character must be 1`);if(t<0||!Number.isInteger(t))throw new Error(`[llcacodec] Cannot RLE Encode character ${e} with a count of ${t}. The count must be an integer greater than or equal to 1`);return t===0?"":t===1?e:`${t}${e}`}function Ee(e){let t=[];for(let o=0;o<e.length;o++){let a=!1,s=[];for(let l=0;l<e[o].length;l++)if(e[o][l]===1)a=!0,s.push(B);else if(e[o][l]===0)s.push($);else throw new Error(`[llcacodec] Cannot write RLE data where matrix has values that are not 0 or 1 ( got ${e[o][l]} at row ${o} and col ${l}) `);a&&t.push(...s),t.push(G)}t.push(M);let r=[],n=t[0],i=1;for(let o=1;o<t.length;o++)t[o]===n?i++:(r.push(Oe(n,i)),n=t[o],i=1);return r.push(M),r.join("")}function Ye(e){return e.length===0?"":Ee(C(e))}var be=70;function we(e){let t=e.comments!==void 0?[...e.comments]:[],r=e.creationData!==void 0?e.creationData:"",n=e.name!==void 0?e.name:"",i=A;e.rule!==void 0&&(typeof e.rule=="string"||typeof e.rule=="number"?i=pe(e.rule,"b/s"):i=w(e.rule,"b/s"));let o=[0,0],a=0,s=0;if("matrix"in e)a=Math.max(...e.matrix.map(u=>u.length)),s=e.matrix.length,o=e.topleft;else if("liveCoordinates"in e){let u=P(e.liveCoordinates);a=u.width,s=u.height,o=[u.x,u.y]}let l=[];n!==""&&l.push(`#N ${n}`),r!==""&&l.push(`#O ${r}`);let f=[];for(let u=0;u<t.length;u++)for(let d=0;d<t[u].length;d+=be)f.push(t[u].substring(d,Math.min(t[u].length,d+be)));return f.forEach(u=>l.push(`#C ${u}`)),l.push(`x = ${a}, y = ${s}, rule = ${i}`),l.push("matrix"in e?Ee(e.matrix):Ye(e.liveCoordinates)),l.join(`
`)}var Re="#Life 1.05";var je="*";function qe(e){let t=e.split(`
`).map(u=>u.trim()),r=t[0],[,n]=h(r,"#P"),[[i,o]]=re(n,2),a=-o,s=1,l=[];for(;s<t.length&&!b(t[s],"#P");){for(let u=0;u<t[s].length;u++)t[s][u]===je&&l.push([i+u,a-(s-1)]);s++}let f=C(l);return{x:i,y:a,width:f.length!==0?f[0].length:0,height:f.length,pattern:f,liveCoordinates:l}}function Ge(e){let t=e.trim().split(`
`),r=[],n=-1;for(let i=0;i<t.length;i++)b(t[i].trim(),"#P")&&(n!==-1&&r.push(t.slice(n,i).join(`
`)),n=i);return n!==-1&&r.push(t.slice(n,t.length).join(`
`)),r}function z(e){return e.trim().startsWith(Re)}function Ce(e){e=e.replace("\r","");let t={format:"life 1.05",cellBlocks:[],liveCoordinates:[],descriptions:[],rule:null,parsedRule:null,hashLines:[]},r=e.split(`
`);if(!r[0].trim().startsWith(Re))throw new Error('[llcacodec::readLife105String given Life105String does not begin with the required Life 1.05 header "#Life 1.05"]');let i=1;for(;p(r[i],"#");){let[,a]=c(r[i],"#"),[s,l]=c(a),f=l.trim();if(s==="D")t.descriptions.push(f);else if(s==="R")t.rule=f,t.parsedRule=g(f);else if(s==="N")t.rule=q,t.parsedRule=L();else if(s==="P")break;t.hashLines.push({id:s,content:f,full:r[i].trim()}),i++}let o=Ge(r.slice(i).join(`
`));for(let a=0;a<o.length;a++){let s=qe(o[a]);t.cellBlocks.push(s),t.liveCoordinates.push(...s.liveCoordinates)}return t.liveCoordinates=Z(t.liveCoordinates),t}function De(e,t=""){if(t===void 0)throw new Error("[llcacodec]: Cannot parse undefined life file");switch(t===""?J(e):t){case"plaintext":return j(e);case"life 1.06":return te(e);case"rle":return xe(e);case"life 1.05":return Ce(e);case"":throw new Error("[llcacodecjs] Could not read life file: matching life file format could not be found")}}function Se(e,t){switch(t){case"life 1.06":return U(e);case"life 1.05":return z(e);case"plaintext":return Y(e);case"rle":return X(e)}}function J(e){return U(e)?"life 1.06":z(e)?"life 1.05":X(e)?"rle":Y(e)?"plaintext":""}function Ne(e){switch(e.format){case"life 1.06":return ee(e);case"plaintext":return ae(e);case"rle":return we(e)}}var Xe={readLifeString:De,writeLifeString:Ne,isLifeStringFormat:Se,getLifeStringFormat:J,makeLifeRule:w,isValidLifeRule:D,getLifeRuleFormat:S,readLifeRule:g};return Be(ze);})();
/**
 * @file api.ts
 * @description The public API for the llcacodec library
 * @author Jacoby Johnson
 * @version 0.1.4
 * @date April 9th, 2023
 * @license MIT
 */
//# sourceMappingURL=llcacodec.bundle.js.map