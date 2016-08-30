/*
策略出处: https://www.botvs.com/strategy/12977
策略名称: 从第三方网站获取K线
策略作者: 数·狂
策略描述:

对于不支持获取K线数据的平台（目前只写了BitVC期货、BTCC），如果在策略开始时必须获取足够多的K线，使用本模板则可从第三方网站直接获得平台的历史K线数据。
注意：
K线数据每3秒更新一次，因此无法高频调用。
仅适用于实盘交易。
作者不保证第三方数据准确性和程序正确性，仅供学习参考。

*/


$.AltRecords = function(exchange, timeframe, size, includeLastBar) {
    var symbol;
    var info;
    var record = [];
    if (!size) size="";
    // 目前只支持以下两个交易所，其余交易所接口可参考https://www.btc123.com/api
    if (exchange.GetName().indexOf('Futures_BitVC') != -1) { 
        symbol = "bitvcbtccnyfuture";
    }
    else if (exchange.GetName().indexOf('BTCC') != -1) {
        symbol = "btcchinabtccny";
    }
    
    if (symbol) {
        info = JSON.parse(HttpQuery('https://www.btc123.com/market/kline?symbol='+symbol+'&type='+timeframe+'&size='+(includeLastBar ? size : size+1)));
        if (info && info.isSuc) {
            info = JSON.parse(info.datas.data);
        }
        else {
            Log("获取K线时发生错误:", info.des ? info.des : "网络错误");
            return;
        }
        for (var i = 0; i < (includeLastBar ? info.length : info.length-1); i++) {
            record.push({"Time": info[i][0], "Open": info[i][1], "High": info[i][2], "Low": info[i][3], "Close": info[i][4], "Volume": info[i][5]});
        }
        return record;
    }
    return exchange.GetRecords(); // 不支持的交易所采用默认方式处理（忽略所有参数，如时间周期、长度等）。
};

function main() {
    Log(exchange.GetName());
    var rec = $.AltRecords(exchange, "5min", 100); // 获取5分钟K线, 100条, 不含最后一条Bar
    if (rec) Log(rec.length, rec[rec.length-1]);
    rec = $.AltRecords(exchange, "4hour", 100, 1); // 获取4小时K线, 100条, 含最后一条Bar
    if (rec) Log(rec.length, rec[rec.length-1]);
}
