var Month = require('../js/nshiell-js-plain-calendar.js');

var today = new Date(1970, 0, 1);

function commandLineOutputer() {
    // Border unicode CONSTS
    // See https://en.wikipedia.org/wiki/List_of_Unicode_characters
    var V = '\u2502';   // |
    var TL = '\u250C';  // |``
    var TR = '\u2510';  // ``|
    var VR = '\u251C';  // |-
    var VL = '\u2524';  // -|
    var VH = '\u253C';  // +
    var BL = '\u2514';  // |_
    var BR = '\u2518';  // _|
    var H = '\u2500';   // |
    var HD = '\u252C';  // T
    var HU = '\u2534';  // _|_
    var Hs = H+H+H+H+H+H+H+H+H+H+H+H+H+H+H+H+H+H+H;
        Hs+= Hs;
        Hs+= Hs;
    var spaces = '                               ';
    spaces+= spaces;
    spaces+= spaces;

    this.drawRow = function (cells, borderCellParts, isTop) {
        if (isTop) {
            console.log(TL + borderCellParts.join(HD) + TR);
        } else {
            console.log(VR + borderCellParts.join(VH) + VL);
        }
        console.log(V + cells.join(V) + V);
    }

    this.drawRowFooter = function (borderCellParts) {
        console.log(BL + borderCellParts.join(HU) + BR);
    }

    this.padText = function (text, cellWidth, style) {
        text = text + '';
        var padding = (cellWidth - text.length) / 2;
        
        var prefix = (style) ? '\033[1m' : '';
        var suffix = (style) ? '\033[m' : '';
        
        return prefix
            + spaces.substring(0, Math.floor(padding))
            + text
            + spaces.substring(0, Math.ceil(padding))
            + suffix;
    }

    this.getHorizontalLine = function(text) {
        return Hs.substring(0, text.length);
    }
}

var days = undefined;
// nodejs doesn't support locale for day names, so we can provide the names
/*var days = [
'יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי','יום חמישי', 'יום שישי', 'יום שבת'
];*/

new Month(today).drawCalendar(
    new commandLineOutputer(),
    undefined,
    undefined,
    undefined,
    days);