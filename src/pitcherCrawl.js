const axios = require('axios');
const fs = require('fs');
const { JSDOM } = require('jsdom');

let fetchUrl = 'https://baseball-data.com/player/[team]/p.html';
let teamList = ['g', 'yb', 't', 'c', 'd', 's', 'l', 'h', 'e', 'm', 'f', 'bs'];
const summaryFile = 'pitcher_summary.txt';
const detailFile = 'pitcher_detail.txt'

let summary = {};
let detail = {};

try{
  fs.writeFileSync(summaryFile,"");
  fs.writeFileSync(detailFile,"");
  (async() => {
    for (let i = 0; i < teamList.length; i++) {
      // if (i > 0) {return} // コメントを外したら、最初のチームだけ取得する動作確認モード
      // 対象のチームの投手リストページを取得する
      const team = teamList[i];
      console.log(`START[${team}]`);
      const res = await axios.get(fetchUrl.replace('[team]',　team));
      const dom = new JSDOM(res.data);
      const player = dom.window.document.querySelectorAll('tr');
      
      for (let i = 1; i < player.length; i++) {
        // if (i > 5) {continue}     // コメントを外したら、最初の5人だけ取得する動作確認モード
        // サマリ情報を出力
        const uniq = getUniqueStr();
        summary['ID'] = uniq;
        summary['背番号'] = player[i].children[0].firstChild.textContent.trim();
        summary['名前'] = player[i].children[1].firstChild.textContent.trim();
        summary['守備'] = player[i].children[2].firstChild.textContent.trim();
        summary['生年月日'] = player[i].children[3].firstChild.textContent.trim();
        summary['投打'] = player[i].children[9].firstChild.textContent.trim();
        summary['球団'] = team;
        fs.appendFileSync(summaryFile,JSON.stringify(summary));
        fs.appendFileSync(summaryFile,",\n");

        // 詳細ページにアクセス
        const href = player[i].children[1].firstChild.href
        const res = await axios.get(href)
        const dom = new JSDOM(res.data);
        const table = dom.window.document.querySelectorAll('table')[3];
        if (!table) { continue }
        const dataCount = table.children[1].children.length;
        const total = table.children[1].children[dataCount-1];

        // 年度別成績を出力
        for (let i = 0; i < dataCount-1; i++) {
          detail['ID'] = uniq;
          detail['年度'] = table.children[1].children[i].children[0].textContent;
          detail['試合'] = table.children[1].children[i].children[2].textContent;
          detail['勝利'] = table.children[1].children[i].children[3].textContent;
          detail['敗北'] = table.children[1].children[i].children[4].textContent;
          detail['セーブ'] = table.children[1].children[i].children[5].textContent;
          detail['ホールド'] = table.children[1].children[i].children[6].textContent;
          detail['HP'] = table.children[1].children[i].children[7].textContent;
          detail['完投'] = table.children[1].children[i].children[8].textContent;
          detail['完封勝'] = table.children[1].children[i].children[9].textContent;
          detail['無四球'] = table.children[1].children[i].children[10].textContent;
          detail['打者'] = table.children[1].children[i].children[11].textContent;
          detail['投球回'] = table.children[1].children[i].children[12].textContent;
          detail['被安打'] = table.children[1].children[i].children[13].textContent;
          detail['被本塁打'] = table.children[1].children[i].children[14].textContent;
          detail['与四球'] = table.children[1].children[i].children[15].textContent;
          detail['与死球'] = table.children[1].children[i].children[16].textContent;
          detail['奪三振'] = total.children[17].textContent;
          detail['暴投'] = table.children[1].children[i].children[18].textContent;
          detail['ボーク'] = table.children[1].children[i].children[19].textContent;
          detail['失点'] = table.children[1].children[i].children[20].textContent;
          detail['自責点'] = table.children[1].children[i].children[21].textContent;
          detail['防御率'] = table.children[1].children[i].children[22].textContent;
          detail['WHIP'] = table.children[1].children[i].children[23].textContent;
          fs.appendFileSync(detailFile,JSON.stringify(detail));
          fs.appendFileSync(detailFile,",\n");
        }

        // 通算成績を出力
        detail['ID'] = uniq;
        detail['年度'] = total.children[0].textContent;
        detail['試合'] = total.children[1].textContent;
        detail['勝利'] = total.children[2].textContent;
        detail['敗北'] = total.children[3].textContent;
        detail['セーブ'] = total.children[4].textContent;
        detail['ホールド'] = total.children[5].textContent;
        detail['HP'] = total.children[6].textContent;
        detail['完投'] = total.children[7].textContent;
        detail['完封勝'] = total.children[8].textContent;
        detail['無四球'] = total.children[9].textContent;
        detail['打者'] = total.children[10].textContent;
        detail['投球回'] = total.children[11].textContent;
        detail['被安打'] = total.children[12].textContent;
        detail['被本塁打'] = total.children[13].textContent;
        detail['与四球'] = total.children[14].textContent;
        detail['与死球'] = total.children[15].textContent;
        detail['奪三振'] = total.children[16].textContent;
        detail['暴投'] = total.children[17].textContent;
        detail['ボーク'] = total.children[18].textContent;
        detail['失点'] = total.children[19].textContent;
        detail['自責点'] = total.children[20].textContent;
        detail['防御率'] = total.children[21].textContent;
        detail['WHIP'] = total.children[22].textContent;
        fs.appendFileSync(detailFile,JSON.stringify(detail));
        fs.appendFileSync(detailFile,",\n");
      }
      console.log(`END[${team}]`);
    }
  })();
} catch(e) {
    console.log("err");
    console.log(e);
}


// ユニーク文字列を生成
function getUniqueStr(myStrong){
  var strong = 1000;
  if (myStrong) strong = myStrong;
  return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}
