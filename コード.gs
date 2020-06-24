function doGet(e) {
    Logger.log(Utilities.jsonStringify(e));
    if (!e.parameter.page) {
        return HtmlService.createTemplateFromFile('top-page').evaluate().setTitle('振り返りシステム');
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
    var impression_zenkaku = [];
    var title = [];
    var day_impression = [];
    var time_impression = [];
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
                var string=month_string + day_string;
                var string_date = hankakutoZenkaku(string) + "感想";
                //var string_date_zenkaku=hankakutoZenkaku(string)+ "感想";
                impression.push(string_date);
                //impression_zenkaku.push(string_date_zenkaku);
                var date = dates.toLocaleDateString();
                var dateTime = dates.toLocaleTimeString('ja-JP');
                day.push(date);
                time.push(dateTime);
                title.push(hankakutoZenkaku(values[i][3]));


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

    return [day, time, startdata, finishdata, day_impression, time_impression];
}


function gssText(name, free, startdata, finishdata) {
    //スプレッドシートの情報を取得する処理を記入
    var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    var length = values.length;
    var impressions = [];
    var impressions_sum = [];
    var titles = [];
    var titles_sum = [];
    var day_impression = [];
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
                impressions.push(values[i][4]);
                titles.push(values[i][3]);
                day_impression.push(dates.toLocaleString());
            }
        }
    }


    for (var i = 0; i < impressions.length; i++) {
        if (impressions[i].indexOf(free) != -1 || titles[i].indexOf(free) != -1) {
            impressions_sum.push(impressions[i]);
            titles_sum.push(titles[i]);
        }
    }

    return [impressions_sum, titles_sum,day_impression];
}
/*
function gssText(name, free) {
    //スプレッドシートの情報を取得する処理を記入
    var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    var names = values[1][1];
    var classes = values[1][2];

    var names = values[1][1];
    var day = values[1][0];

    var comments = [];
    var days = [];
    var titles = [];

    //名前、タイトル、感想取得
    for (let i = 0; i < 15; i++) {



        var day = values[i][0];
        var impressions = values[i][4];
        var title = values[i][3];

        if (impressions.indexOf(free) == false) {


            comments.push('<br>' + impressions + '<br>');
            days.push('<br>' + day + '<br>');
            titles.push('<br>' + title + '<br>');

        }
    }
    return [days, titles, comments, comments.length];
}
*/
function getPdca(name) {
    var sheet = SpreadsheetApp.openById("1Tnb0ZdZn1LSrPFr-doEdeE7jeQeCLT-TCzKIx8lnCdE").getDataRange().getValues();
    var length = sheet[0].length;
    var id = [];
    var names = [];
    var ap = [];
    var tasks = [];
    var targets = [];
    //for(let i=0;)
    return [id, names, ap, tasks, targets];
}

function getPass(employee_number, pass, name) {
    var sheet_insert = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ユーザー');
    var sheet_see = sheet_insert.getDataRange().getValues();
    var length = sheet_see.length;
    var employee_numbers = [];
    var passes = [];
    var flag = 0;
    employee_number = Number(employee_number);
    pass = String(pass);
    if (employee_number != "" && pass != "") {
        for (var i = 0; i < length; i++) {
            employee_numbers.push(sheet_see[i][1]);
            passes.push(sheet_see[i][2]);
        }
        if (employee_numbers.indexOf(employee_number) == -1) {
            sheet_insert.getRange(length + 1, 4).setValue(name);
            sheet_insert.getRange(length + 1, 3).setValue(pass);
            sheet_insert.getRange(length + 1, 2).setValue(employee_number);
            sheet_insert.getRange(length + 1, 1).setValue(length);
            flag = 2;
        } else if (passes[employee_numbers.indexOf(employee_number)] == pass) {
            flag = 1;
        } else {
            flag = 3;
        }
    }
    return [flag, name];

}

////山岸pdca

function doPost(postdata) {

    var sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var time = new Date();

    var ap = postdata.parameters.ap.toString();
    var name = postdata.parameters.name.toString();
    var target = postdata.parameters.target.toString();
    var p = postdata.parameters.p.toString();
    var d = postdata.parameters.d.toString();
    var c = postdata.parameters.c.toString();
    var a = postdata.parameters.a.toString();

    sh.appendRow([time, ap, name, target, p, d, c, a]);

    var resultpage = HtmlService.createTemplateFromFile("result");
    return resultpage.evaluate();
}


function hankakutoZenkaku(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}
