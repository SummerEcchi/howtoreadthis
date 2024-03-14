let msg = new SpeechSynthesisUtterance();
let speech = window.speechSynthesis; 
let infos = document.querySelector(".delivery-infos");
let rawText = document.querySelector("textarea");
let pasteBtn = document.querySelector(".pastestart");
let parseBtn = document.querySelector(".parsestart");


msg.text = "无朗读文本"
msg.pitch = 1
msg.rate = 1
msg.volume = 10
msg.lang = 'zh-CN' 

infos.addEventListener("click", function(e) {
   if (e.target.tagName == "BUTTON") {
      msg.text = e.target.innerText;
      speech.speak(msg);
   }
})

pasteBtn.addEventListener("click", function(e) {   
   navigator.clipboard.readText().then((copyText) => {
      rawText.value = copyText;

      let parseRes = msgParse(copyText);
      fillElem(parseRes);

      if (parseRes.length == 1) {
         msg.text = copyText;
         speech.speak(msg);
      }
   })
})

// parseBtn.addEventListener("click", function(e) {   
//    rawText.focus();
//    document.execCommand("paste");

//    let parseRes = msgParse(rawText.value);
//    fillElem(parseRes);

//    if (parseRes.length == 1) {
//       msg.text = rawText.value;
//       speech.speak(msg);
//    }
// })

parseBtn.addEventListener("click", function(e) {   
   let parseRes = msgParse(rawText.value);
   fillElem(parseRes);

   if (parseRes.length == 1) {
      msg.text = rawText.value;
      speech.speak(msg);
   }
})

function msgParse(text) {
   // [[房号或备注, 货物, 货物或其它信息], [房号或备注, 货物, 货物或其它信息]]
   let result = [];
   let firpat = /(^\d. .*\n*)/gm;
   let secpat = /\d. \D*(\d.*\d )(.*)/;
   
   let a = text.match(firpat);
   
   // 未识别出楼号/房号
   if (a == null) {
      result.push(["未识别出楼号/房号", [text]])
      return result;
   }
   
   // 仅识别出一条信息，接龙也许出错了
   if (a.length == 1) {
      result.push(["接龙也许出错了", [a[0]]]);
      return result;
   }

   for (let i = 0; i < a.length; i++) {
      let temp = [];
      let temp2 = [];
      let b = a[i].match(secpat);
      temp.push(b[1]);
      
      let c = b[2].split(/\uff0c|。/);
      c.forEach(element => {
         if (element != "") temp2.push(element);
      });
      
      temp.push(temp2);
      result.push(temp);
   }
   
   return result;
}

function fillElem(customs) {
   infos.innerText = "";
   
   customs.forEach((e) => {
      let info = document.createElement("div")
      let h1 = document.createElement("h1");
      let buttons = document.createElement("div");

      info.className = "single-info";
      buttons.className = "buttons";

      h1.innerText = e[0];
      
      e[1].forEach((e2) => {
         let button = document.createElement("button");
         
         button.innerText = e2;
         
         buttons.appendChild(button);
      })

      info.appendChild(h1);
      info.appendChild(buttons);
      infos.appendChild(info);
   })
}