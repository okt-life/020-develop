function doGet(e) {
    Logger.log( Utilities.jsonStringify(e) );
    if (!e.parameter.page) {
        return HtmlService.createTemplateFromFile('top-page').evaluate();
    }
    return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
}

function getScriptUrl() {
    var url = ScriptApp.getService().getUrl();
    return url;
}

function gssDay(name,startdata,finishdata){
//スプレッドシートの情報を取得する処理を記入
  var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  var length=values.length;
  var day = [];
  var time=[];
  var startdata=Date.parse( startdata.replace( /-/g, '/') ) / 1000;
  var finishdata=Date.parse( finishdata.replace( /-/g, '/') ) / 1000;
  for(var i=1;i<length;i++){
    //名前が一致しているか
    if(name==values[i][1]){
      //スプレッドシートから取得した時間をタイムスタンプに変換
      var timedata=values[i][0].getTime()/1000;
        //開始日以上、終了日未満の時間を取得
        if(startdata<=timedata && finishdata>=timedata){
          var dates = new Date(timedata * 1000);
          var date=dates.toLocaleDateString();
          var dateTime=dates.toLocaleTimeString('ja-JP')
          day.push(date);
          time.push(dateTime)
       }
    }
  }
  return [day,time];
}

function gssText(name,free){
//スプレッドシートの情報を取得する処理を記入
  var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  var names = values[1][1];
  var classes = values[1][2];
  var titles = values[1][3];
  var impressions = values[1][4];
  return [names,classes,titles,impressions];
}
