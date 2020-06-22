function doGet(e) {
    Logger.log(Utilities.jsonStringify(e));
    if (!e.parameter.page) {
        return HtmlService.createTemplateFromFile('top-page').evaluate();
    }
    return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
}

function getScriptUrl() {
    var url = ScriptApp.getService().getUrl();
    return url;
}

function gssDay(name, startdata, finishdata) {
    //スプレッドシートの情報を取得する処理を記入
    var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    var length = values.length;
    var day = [];
    var time = [];
    var impression = [];
    var title = [];
    var day_impression = [];
    var time_impression=[];
    var startdata = Date.parse(startdata.replace(/-/g, '/')) / 1000;
    var finishdata = Date.parse(finishdata.replace(/-/g, '/')) / 1000;
    for (var i = 1; i < length; i++) {
        //名前が一致しているか
        if (name == values[i][1]) {
            //スプレッドシートから取得した時間をタイムスタンプに変換
            var timedata = values[i][0].getTime() / 1000;
            var dates = new Date(timedata * 1000);
            //開始日以上、終了日未満の時間を取得
            if (startdata <= timedata && finishdata >= timedata) {
                var month_string = (dates.getMonth() + 1).toString().padStart(2, '0');
                var day_string = dates.getDate().toString().padStart(2, '0');
                var string_date = month_string + day_string + "感想";
                //var hiragana_ver=month_string+day_string+"かんそう";
                impression.push(string_date);
                var date = dates.toLocaleDateString();
                var dateTime = dates.toLocaleTimeString('ja-JP');
                day.push(date);
                time.push(dateTime);
                title.push(values[i][3]);


            }
        }
    }

    //重複を削除
    var impressions = impression.filter(function (x, i, self) {
        return self.indexOf(x) === i;
    });
    
    for (var i = 0; i < impressions.length; i++) {
        if (title.indexOf(impressions[i]) != -1) {
            day_impression.push(day[title.indexOf(impressions[i])]);
            time_impression.push(time[title.indexOf(impressions[i])]);
        }
    }
    startdata = new Date(startdata * 1000);
    finishdata = new Date(finishdata * 1000);
    startdata = startdata.toLocaleString();
    finishdata = finishdata.toLocaleString();

    return [day, time, startdata, finishdata, day_impression,time_impression];
}

function gssText(name, free) {
    //スプレッドシートの情報を取得する処理を記入
    var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    var names = values[1][1];
    var classes = values[1][2];
    var titles = values[1][3];
    var impressions = values[1][4];
    return [names, classes, titles, impressions];
}
