const axios = require('axios');
const fs = require('fs');
const { JSDOM } = require('jsdom');

let listUrl = 'https://baseball.yahoo.co.jp/npb/teams/1/memberlist?kind=p';
const file = 'result.txt';

let detail = {};

try{
  axios.get(listUrl).then((res)=>{
    const dom = new JSDOM(res.data);
    const player = dom.window.document.querySelectorAll('.bb-playerTable__data--player');
    const number = dom.window.document.querySelectorAll('.bb-playerTable__data--number');
    (async () => {
      for(let i = 0; i < 5; i++){
        if(i>5){return}
        detail['名前'] = player[i].children[0].firstChild.textContent.trim();
        detail['背番号'] = number[i].textContent;
        const href = player[i].children[0].getAttribute('href');
        console.log(detail['名前'])
        console.log(href)
        const detailUrl = `https://baseball.yahoo.co.jp${href}`;
        const res = await axios.get(detailUrl)
        const dom = new JSDOM(res.data);
        const data = dom.window.document.querySelectorAll('.bb-profile__list');

        data.forEach((d)=>{
          const key = d.children[0].firstChild.textContent;
          const val = d.children[1].firstChild ? d.children[1].firstChild.textContent : '';
          detail[key] = val;
        })
        console.log(detail)

        fs.appendFileSync(file,JSON.stringify(detail));
        fs.appendFileSync(file,"\n");
      }
    })();
  })
} catch(e) {
    console.log("err");
    console.log(e);
}