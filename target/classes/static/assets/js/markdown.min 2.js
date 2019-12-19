// Released under MIT license
// Copyright (c) 2009-2010 Dominic Baggott
!function(b){function c(){return"Markdown.mk_block( "+uneval(this.toString())+", "+uneval(this.trailing)+", "+uneval(this.lineNumber)+" )"}function d(){var a=require("util");return"Markdown.mk_block( "+a.inspect(this.toString())+", "+a.inspect(this.trailing)+", "+a.inspect(this.lineNumber)+" )"}function e(a){for(var b=0,c=-1;-1!==(c=a.indexOf("\n",c+1));)b++;return b}function f(a,b){function c(a){this.len_after=a,this.name="close_"+b}var d=a+"_state",e="strong"==a?"em_state":"strong_state";return function(f,g){if(this[d][0]==b)return this[d].shift(),[f.length,new c(f.length-b.length)];var h=this[e].slice(),i=this[d].slice();this[d].unshift(b);var j=this.processInline(f.substr(b.length)),k=j[j.length-1];this[d].shift();if(k instanceof c){j.pop();var l=f.length-k.len_after;return[l,[a].concat(j)]}return this[e]=h,this[d]=i,[b.length,b]}}function g(a){for(var b=a.split(""),c=[""],d=!1;b.length;){var e=b.shift();switch(e){case" ":d?c[c.length-1]+=e:c.push("");break;case"'":case'"':d=!d;break;case"\\":e=b.shift();default:c[c.length-1]+=e}}return c}function h(a){return q(a)&&a.length>1&&"object"==typeof a[1]&&!q(a[1])?a[1]:void 0}function i(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function j(a){if("string"==typeof a)return i(a);var b=a.shift(),c={},d=[];for(!a.length||"object"!=typeof a[0]||a[0]instanceof Array||(c=a.shift());a.length;)d.push(j(a.shift()));var e="";for(var f in c)e+=" "+f+'="'+i(c[f])+'"';return"img"==b||"br"==b||"hr"==b?"<"+b+e+"/>":"<"+b+e+">"+d.join("")+"</"+b+">"}function k(a,b,c){var d;c=c||{};var e=a.slice(0);"function"==typeof c.preprocessTreeNode&&(e=c.preprocessTreeNode(e,b));var f=h(e);if(f){e[1]={};for(d in f)e[1][d]=f[d];f=e[1]}if("string"==typeof e)return e;switch(e[0]){case"header":e[0]="h"+e[1].level,delete e[1].level;break;case"bulletlist":e[0]="ul";break;case"numberlist":e[0]="ol";break;case"listitem":e[0]="li";break;case"para":e[0]="p";break;case"markdown":e[0]="html",f&&delete f.references;break;case"code_block":e[0]="pre",d=f?2:1;var g=["code"];g.push.apply(g,e.splice(d,e.length-d)),e[d]=g;break;case"inlinecode":e[0]="code";break;case"img":e[1].src=e[1].href,delete e[1].href;break;case"linebreak":e[0]="br";break;case"link":e[0]="a";break;case"link_ref":e[0]="a";var i=b[f.ref];if(!i)return f.original;delete f.ref,f.href=i.href,i.title&&(f.title=i.title),delete f.original;break;case"img_ref":e[0]="img";var i=b[f.ref];if(!i)return f.original;delete f.ref,f.src=i.href,i.title&&(f.title=i.title),delete f.original}if(d=1,f){for(var j in e[1]){d=2;break}1===d&&e.splice(d,1)}for(;d<e.length;++d)e[d]=k(e[d],b,c);return e}function l(a){for(var b=h(a)?2:1;b<a.length;)"string"==typeof a[b]?b+1<a.length&&"string"==typeof a[b+1]?a[b]+=a.splice(b+1,1)[0]:++b:(l(a[b]),++b)}var m=b.Markdown=function(a){switch(typeof a){case"undefined":this.dialect=m.dialects.Gruber;break;case"object":this.dialect=a;break;default:if(!(a in m.dialects))throw new Error("Unknown Markdown dialect '"+String(a)+"'");this.dialect=m.dialects[a]}this.em_state=[],this.strong_state=[],this.debug_indent=""};b.parse=function(a,b){var c=new m(b);return c.toTree(a)},b.toHTML=function(a,c,d){var e=b.toHTMLTree(a,c,d);return b.renderJsonML(e)},b.toHTMLTree=function(a,b,c){"string"==typeof a&&(a=this.parse(a,b));var d=h(a),e={};d&&d.references&&(e=d.references);var f=k(a,e,c);return l(f),f};var n=m.mk_block=function(a,b,e){1==arguments.length&&(b="\n\n");var f=new String(a);return f.trailing=b,f.inspect=d,f.toSource=c,void 0!=e&&(f.lineNumber=e),f};m.prototype.split_blocks=function(a,b){a=a.replace(/(\r\n|\n|\r)/g,"\n");var c,d=/([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,f=[],g=1;for(null!=(c=/^(\s*\n)/.exec(a))&&(g+=e(c[0]),d.lastIndex=c[0].length);null!==(c=d.exec(a));)"\n#"==c[2]&&(c[2]="\n",d.lastIndex--),f.push(n(c[1],c[2],g)),g+=e(c[0]);return f},m.prototype.processBlock=function(a,b){var c=this.dialect.block,d=c.__order__;if("__call__"in c)return c.__call__.call(this,a,b);for(var e=0;e<d.length;e++){var f=c[d[e]].call(this,a,b);if(f)return(!q(f)||f.length>0&&!q(f[0]))&&this.debug(d[e],"didn't return a proper array"),f}return[]},m.prototype.processInline=function(a){return this.dialect.inline.__call__.call(this,String(a))},m.prototype.toTree=function(a,b){var c=a instanceof Array?a:this.split_blocks(a),d=this.tree;try{for(this.tree=b||this.tree||["markdown"];c.length;){var e=this.processBlock(c.shift(),c);e.length&&this.tree.push.apply(this.tree,e)}return this.tree}finally{b&&(this.tree=d)}},m.prototype.debug=function(){var a=Array.prototype.slice.call(arguments);a.unshift(this.debug_indent),"undefined"!=typeof print&&print.apply(print,a),"undefined"!=typeof console&&"undefined"!=typeof console.log&&console.log.apply(null,a)},m.prototype.loop_re_over_block=function(a,b,c){for(var d,e=b.valueOf();e.length&&null!=(d=a.exec(e));)e=e.substr(d[0].length),c.call(this,d);return e},m.dialects={},m.dialects.Gruber={block:{atxHeader:function(a,b){var c=a.match(/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/);if(c){var d=["header",{level:c[1].length}];return Array.prototype.push.apply(d,this.processInline(c[2])),c[0].length<a.length&&b.unshift(n(a.substr(c[0].length),a.trailing,a.lineNumber+2)),[d]}},setextHeader:function(a,b){var c=a.match(/^(.*)\n([-=])\2\2+(?:\n|$)/);if(c){var d="="===c[2]?1:2,e=["header",{level:d},c[1]];return c[0].length<a.length&&b.unshift(n(a.substr(c[0].length),a.trailing,a.lineNumber+2)),[e]}},code:function(a,b){var c=[],d=/^(?: {0,3}\t| {4})(.*)\n?/;if(a.match(d)){a:for(;;){var e=this.loop_re_over_block(d,a.valueOf(),function(a){c.push(a[1])});if(e.length){b.unshift(n(e,a.trailing));break a}if(!b.length)break a;if(!b[0].match(d))break a;c.push(a.trailing.replace(/[^\n]/g,"").substring(2)),a=b.shift()}return[["code_block",c.join("\n")]]}},horizRule:function(a,b){var c=a.match(/^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/);if(c){var d=[["hr"]];return c[1]&&d.unshift.apply(d,this.processBlock(c[1],[])),c[3]&&b.unshift(n(c[3])),d}},lists:function(){function a(a){return new RegExp("(?:^("+i+"{0,"+a+"} {0,3})("+f+")\\s+)|(^"+i+"{0,"+(a-1)+"}[ ]{0,4})")}function b(a){return a.replace(/ {0,3}\t/g,"    ")}function c(a,b,c,d){if(b)return void a.push(["para"].concat(c));var e=a[a.length-1]instanceof Array&&"para"==a[a.length-1][0]?a[a.length-1]:a;d&&a.length>1&&c.unshift(d);for(var f=0;f<c.length;f++){var g=c[f],h="string"==typeof g;h&&e.length>1&&"string"==typeof e[e.length-1]?e[e.length-1]+=g:e.push(g)}}function d(a,b){for(var c=new RegExp("^("+i+"{"+a+"}.*?\\n?)*$"),d=new RegExp("^"+i+"{"+a+"}","gm"),e=[];b.length>0&&c.exec(b[0]);){var f=b.shift(),g=f.replace(d,"");e.push(n(g,f.trailing,f.lineNumber))}return e}function e(a,b,c){var d=a.list,e=d[d.length-1];if(!(e[1]instanceof Array&&"para"==e[1][0]))if(b+1==c.length)e.push(["para"].concat(e.splice(1,e.length-1)));else{var f=e.pop();e.push(["para"].concat(e.splice(1,e.length-1)),f)}}var f="[*+-]|\\d+\\.",g=/[*+-]/,h=new RegExp("^( {0,3})("+f+")[ 	]+"),i="(?: {0,3}\\t| {4})";return function(f,i){function j(a){var b=g.exec(a[2])?["bulletlist"]:["numberlist"];return n.push({list:b,indent:a[1]}),b}var k=f.match(h);if(k){for(var l,m,n=[],p=j(k),q=!1,r=[n[0].list];;){for(var s=f.split(/(?=\n)/),t="",u=0;u<s.length;u++){var v="",w=s[u].replace(/^\n/,function(a){return v=a,""}),x=a(n.length);if(k=w.match(x),void 0!==k[1]){t.length&&(c(l,q,this.processInline(t),v),q=!1,t=""),k[1]=b(k[1]);var y=Math.floor(k[1].length/4)+1;if(y>n.length)p=j(k),l.push(p),l=p[1]=["listitem"];else{var z=!1;for(m=0;m<n.length;m++)if(n[m].indent==k[1]){p=n[m].list,n.splice(m+1,n.length-(m+1)),z=!0;break}z||(y++,y<=n.length?(n.splice(y,n.length-y),p=n[y-1].list):(p=j(k),l.push(p))),l=["listitem"],p.push(l)}v=""}w.length>k[0].length&&(t+=v+w.substr(k[0].length))}t.length&&(c(l,q,this.processInline(t),v),q=!1,t="");var A=d(n.length,i);A.length>0&&(o(n,e,this),l.push.apply(l,this.toTree(A,[])));var B=i[0]&&i[0].valueOf()||"";if(!B.match(h)&&!B.match(/^ /))break;f=i.shift();var C=this.dialect.block.horizRule(f,i);if(C){r.push.apply(r,C);break}o(n,e,this),q=!0}return r}}}(),blockquote:function(a,b){if(a.match(/^>/m)){var c=[];if(">"!=a[0]){for(var d=a.split(/\n/),e=[],f=a.lineNumber;d.length&&">"!=d[0][0];)e.push(d.shift()),f++;var g=n(e.join("\n"),"\n",a.lineNumber);c.push.apply(c,this.processBlock(g,[])),a=n(d.join("\n"),a.trailing,f)}for(;b.length&&">"==b[0][0];){var i=b.shift();a=n(a+a.trailing+i,i.trailing,a.lineNumber)}var j=a.replace(/^> ?/gm,""),k=(this.tree,this.toTree(j,["blockquote"])),l=h(k);return l&&l.references&&(delete l.references,r(l)&&k.splice(1,1)),c.push(k),c}},referenceDefn:function(a,b){var c=/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;if(a.match(c)){h(this.tree)||this.tree.splice(1,0,{});var d=h(this.tree);void 0===d.references&&(d.references={});var e=this.loop_re_over_block(c,a,function(a){a[2]&&"<"==a[2][0]&&">"==a[2][a[2].length-1]&&(a[2]=a[2].substring(1,a[2].length-1));var b=d.references[a[1].toLowerCase()]={href:a[2]};void 0!==a[4]?b.title=a[4]:void 0!==a[5]&&(b.title=a[5])});return e.length&&b.unshift(n(e,a.trailing)),[]}},para:function(a,b){return[["para"].concat(this.processInline(a))]}}},m.dialects.Gruber.inline={__oneElement__:function(a,b,c){var d,e;b=b||this.dialect.inline.__patterns__;var f=new RegExp("([\\s\\S]*?)("+(b.source||b)+")");if(d=f.exec(a),!d)return[a.length,a];if(d[1])return[d[1].length,d[1]];var e;return d[2]in this.dialect.inline&&(e=this.dialect.inline[d[2]].call(this,a.substr(d.index),d,c||[])),e=e||[d[2].length,d[2]]},__call__:function(a,b){function c(a){"string"==typeof a&&"string"==typeof e[e.length-1]?e[e.length-1]+=a:e.push(a)}for(var d,e=[];a.length>0;)d=this.dialect.inline.__oneElement__.call(this,a,b,e),a=a.substr(d.shift()),o(d,c);return e},"]":function(){},"}":function(){},__escape__:/^\\[\\`\*_{}\[\]()#\+.!\-]/,"\\":function(a){return this.dialect.inline.__escape__.exec(a)?[2,a.charAt(1)]:[1,"\\"]},"![":function(a){var b=a.match(/^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/);if(b){b[2]&&"<"==b[2][0]&&">"==b[2][b[2].length-1]&&(b[2]=b[2].substring(1,b[2].length-1)),b[2]=this.dialect.inline.__call__.call(this,b[2],/\\/)[0];var c={alt:b[1],href:b[2]||""};return void 0!==b[4]&&(c.title=b[4]),[b[0].length,["img",c]]}return b=a.match(/^!\[(.*?)\][ \t]*\[(.*?)\]/),b?[b[0].length,["img_ref",{alt:b[1],ref:b[2].toLowerCase(),original:b[0]}]]:[2,"!["]},"[":function s(a){var b=String(a),c=m.DialectHelpers.inline_until_char.call(this,a.substr(1),"]");if(!c)return[1,"["];var s,d,e=1+c[0],f=c[1];a=a.substr(e);var g=a.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);if(g){var h=g[1];if(e+=g[0].length,h&&"<"==h[0]&&">"==h[h.length-1]&&(h=h.substring(1,h.length-1)),!g[3])for(var i=1,j=0;j<h.length;j++)switch(h[j]){case"(":i++;break;case")":0==--i&&(e-=h.length-j,h=h.substring(0,j))}return h=this.dialect.inline.__call__.call(this,h,/\\/)[0],d={href:h||""},void 0!==g[3]&&(d.title=g[3]),s=["link",d].concat(f),[e,s]}return g=a.match(/^\s*\[(.*?)\]/),g?(e+=g[0].length,d={ref:(g[1]||String(f)).toLowerCase(),original:b.substr(0,e)},s=["link_ref",d].concat(f),[e,s]):1==f.length&&"string"==typeof f[0]?(d={ref:f[0].toLowerCase(),original:b.substr(0,e)},s=["link_ref",d,f[0]],[e,s]):[1,"["]},"<":function(a){var b;return null!=(b=a.match(/^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/))?b[3]?[b[0].length,["link",{href:"mailto:"+b[3]},b[3]]]:"mailto"==b[2]?[b[0].length,["link",{href:b[1]},b[1].substr("mailto:".length)]]:[b[0].length,["link",{href:b[1]},b[1]]]:[1,"<"]},"`":function(a){var b=a.match(/(`+)(([\s\S]*?)\1)/);return b&&b[2]?[b[1].length+b[2].length,["inlinecode",b[3]]]:[1,"`"]},"  \n":function(a){return[3,["linebreak"]]}},m.dialects.Gruber.inline["**"]=f("strong","**"),m.dialects.Gruber.inline.__=f("strong","__"),m.dialects.Gruber.inline["*"]=f("em","*"),m.dialects.Gruber.inline._=f("em","_"),m.buildBlockOrder=function(a){var b=[];for(var c in a)"__order__"!=c&&"__call__"!=c&&b.push(c);a.__order__=b},m.buildInlinePatterns=function(a){var b=[];for(var c in a)if(!c.match(/^__.*__$/)){var d=c.replace(/([\\.*+?|()\[\]{}])/g,"\\$1").replace(/\n/,"\\n");b.push(1==c.length?d:"(?:"+d+")")}b=b.join("|"),a.__patterns__=b;var e=a.__call__;a.__call__=function(a,c){return void 0!=c?e.call(this,a,c):e.call(this,a,b)}},m.DialectHelpers={},m.DialectHelpers.inline_until_char=function(a,b){for(var c=0,d=[];;){if(a.charAt(c)==b)return c++,[c,d];if(c>=a.length)return null;var e=this.dialect.inline.__oneElement__.call(this,a.substr(c));c+=e[0],d.push.apply(d,e.slice(1))}},m.subclassDialect=function(a){function b(){}function c(){}return b.prototype=a.block,c.prototype=a.inline,{block:new b,inline:new c}},m.buildBlockOrder(m.dialects.Gruber.block),m.buildInlinePatterns(m.dialects.Gruber.inline),m.dialects.Maruku=m.subclassDialect(m.dialects.Gruber),m.dialects.Maruku.processMetaHash=function(a){for(var b=g(a),c={},d=0;d<b.length;++d)if(/^#/.test(b[d]))c.id=b[d].substring(1);else if(/^\./.test(b[d]))c["class"]?c["class"]=c["class"]+b[d].replace(/./," "):c["class"]=b[d].substring(1);else if(/\=/.test(b[d])){var e=b[d].split(/\=/);c[e[0]]=e[1]}return c},m.dialects.Maruku.block.document_meta=function(a,b){if(!(a.lineNumber>1)&&a.match(/^(?:\w+:.*\n)*\w+:.*$/)){h(this.tree)||this.tree.splice(1,0,{});var c=a.split(/\n/);for(p in c){var d=c[p].match(/(\w+):\s*(.*)$/),e=d[1].toLowerCase(),f=d[2];this.tree[1][e]=f}return[]}},m.dialects.Maruku.block.block_meta=function(b,c){var d=b.match(/(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/);if(d){var e,f=this.dialect.processMetaHash(d[2]);if(""===d[1]){var g=this.tree[this.tree.length-1];if(e=h(g),"string"==typeof g)return;e||(e={},g.splice(1,0,e));for(a in f)e[a]=f[a];return[]}var i=b.replace(/\n.*$/,""),j=this.processBlock(i,[]);e=h(j[0]),e||(e={},j[0].splice(1,0,e));for(a in f)e[a]=f[a];return j}},m.dialects.Maruku.block.definition_list=function(a,b){var c,d,e=/^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,f=["dl"];if(d=a.match(e)){for(var g=[a];b.length&&e.exec(b[0]);)g.push(b.shift());for(var h=0;h<g.length;++h){var d=g[h].match(e),i=d[1].replace(/\n$/,"").split(/\n/),j=d[2].split(/\n:\s+/);for(c=0;c<i.length;++c)f.push(["dt",i[c]]);for(c=0;c<j.length;++c)f.push(["dd"].concat(this.processInline(j[c].replace(/(\n)\s+/,"$1"))))}return[f]}},m.dialects.Maruku.block.table=function t(a,b){var c,d,e=function(a,b){b=b||"\\s",b.match(/^[\\|\[\]{}?*.+^$]$/)&&(b="\\"+b);for(var c,d=[],e=new RegExp("^((?:\\\\.|[^\\\\"+b+"])*)"+b+"(.*)");c=a.match(e);)d.push(c[1]),a=c[2];return d.push(a),d},f=/^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,g=/^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/;if(d=a.match(f))d[3]=d[3].replace(/^\s*\|/gm,"");else if(!(d=a.match(g)))return;var t=["table",["thead",["tr"]],["tbody"]];d[2]=d[2].replace(/\|\s*$/,"").split("|");var h=[];for(o(d[2],function(a){a.match(/^\s*-+:\s*$/)?h.push({align:"right"}):a.match(/^\s*:-+\s*$/)?h.push({align:"left"}):a.match(/^\s*:-+:\s*$/)?h.push({align:"center"}):h.push({})}),d[1]=e(d[1].replace(/\|\s*$/,""),"|"),c=0;c<d[1].length;c++)t[1][1].push(["th",h[c]||{}].concat(this.processInline(d[1][c].trim())));return o(d[3].replace(/\|\s*$/gm,"").split("\n"),function(a){var b=["tr"];for(a=e(a,"|"),c=0;c<a.length;c++)b.push(["td",h[c]||{}].concat(this.processInline(a[c].trim())));t[2].push(b)},this),[t]},m.dialects.Maruku.inline["{:"]=function(a,b,c){if(!c.length)return[2,"{:"];var d=c[c.length-1];if("string"==typeof d)return[2,"{:"];var e=a.match(/^\{:\s*((?:\\\}|[^\}])*)\s*\}/);if(!e)return[2,"{:"];var f=this.dialect.processMetaHash(e[1]),g=h(d);g||(g={},d.splice(1,0,g));for(var i in f)g[i]=f[i];return[e[0].length,""]},m.dialects.Maruku.inline.__escape__=/^\\[\\`\*_{}\[\]()#\+.!\-|:]/,m.buildBlockOrder(m.dialects.Maruku.block),m.buildInlinePatterns(m.dialects.Maruku.inline);var o,q=Array.isArray||function(a){return"[object Array]"==Object.prototype.toString.call(a)};o=Array.prototype.forEach?function(a,b,c){return a.forEach(b,c)}:function(a,b,c){for(var d=0;d<a.length;d++)b.call(c||a,a[d],d,a)};var r=function(a){for(var b in a)if(hasOwnProperty.call(a,b))return!1;return!0};b.renderJsonML=function(a,b){b=b||{},b.root=b.root||!1;var c=[];if(b.root)c.push(j(a));else for(a.shift(),!a.length||"object"!=typeof a[0]||a[0]instanceof Array||a.shift();a.length;)c.push(j(a.shift()));return c.join("\n\n")}}(function(){return"undefined"==typeof exports?(window.markdown={},window.markdown):exports}());