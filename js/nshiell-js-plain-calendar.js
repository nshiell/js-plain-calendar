/**
 * @param Date             today    1st of the month
 */
function Month(today) {
    this.today = today;
}

/**
 * @param DomObject           $output          The object to draw the calendar to (with events)
 * @param Number|undefined    startOnDay       0 - Sunday, 1 - Monday...
 * @param []|undefined        events           Events for dates
 * @param function|undefined  showDateFunction Function to call for show hiding events for date
 * @param String|[]|undefined dayLocale        'en_GB' | ['Mon', Tues'...] | or Use Browser locale
 */
Month.prototype.drawCalendar = function ($output, startOnDay, events, showDateFunction, dayLocale) {
    var selectedEvents = [];
    var dayNames = (function (today) {
        if (dayLocale instanceof Array) {
            if (dayLocale.length < 7) {
                throw 'dayLocale is < 7 elements';
            }
            return dayLocale;
        }

        var days = [];
        var firstDayNo = null;
        for (var i = 0; i < 7; i++) {
            if (firstDayNo === null) {
                firstDayNo = today.getDay();
            }
            today.setDate(today.getDate() + 1);
            var day = today.toLocaleString(dayLocale, { weekday: "long" });
            days.push(day);
        }
        return days.slice(6 - firstDayNo).concat(days.slice(0, 6 - firstDayNo));
    })(this.today);

    var epochToday = this.today.getTime()/1000|0;

    var monthLengths = [
        /*jan*/ 31,
        /*feb*/ (this.today.getFullYear() % 4) ? 28 : 29,
        /*mar*/ 31,
        /*apr*/ 30,
        /*may*/ 31,
        /*jun*/ 30,
        /*jul*/ 31,
        /*aug*/ 31,
        /*sep*/ 30,
        /*oct*/ 31,
        /*nov*/ 30,
        /*dec*/ 31];
    // Sunday is day "0"
    // date 1 = 1
    var lengthOfMonth = monthLengths[this.today.getMonth()];

    if (!startOnDay) {
        startOnDay = 0;
    }
    var daysToPrepend = this.today.getDay() - (this.today.getDate() % 7) + 1 - startOnDay;
    var lastMonth = this.today.getMonth() - 1;
    if (lastMonth == -1) {
        lastMonth = 11;
    }

    var lastMonthLength = monthLengths[lastMonth];
    
    if (startOnDay > 6) {
        startOnDay = 0;
    }
    
    var daysToAppend = 7 + startOnDay - (lengthOfMonth + daysToPrepend) % 7;
    if (daysToAppend == 7) {
        daysToAppend = 0;
    } else if (daysToAppend > 7) {
        daysToAppend-= 7;
    }
    
    var isHTml = $output.appendChild;
    
    
    // START
    var days = (startOnDay)
        ? [].concat(dayNames.slice(startOnDay), dayNames.slice(0, startOnDay))
        : dayNames;

    // Headers
    if (isHTml) {
        var calendarTable = document.createElement('table');
        
        var header = document.createElement('tr');
        calendarTable.appendChild(header);
        for (var i in days) {
            var cell = document.createElement('th');
            cell.appendChild(document.createTextNode(days[i]));
            header.appendChild(cell);
        }
    } else {
        var cellWidth = 12;
        var header0 = [];
        var headers = [];
        days.forEach(function(e) {
            var cell = $output.padText(e, cellWidth, 'BOLD');
            header0.push($output.getHorizontalLine(cell.replace(
                /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')));
            headers.push(cell);
        });

        $output.drawRow(headers, header0, true);
    }
    
    
    
    
    
    
    
    
    function getEventsForDate(epochDate) {
        var eventsForDate = [];
        for (var j in events) {
            var event = events[j];
            if (event.dateStart) {
                if (event.dateStart < epochDate + 86400) {
                    if (!event.dateEnd) {
                        eventsForDate.push(event);
                    } else if (event.dateEnd > epochDate) {
                        eventsForDate.push(event);
                    }
                }
            }
        }

        return eventsForDate;
    }
    
    function cellDrawer(date, i, row, type) {
        if (!(i % 7)) {
            row = document.createElement('tr');
            calendarTable.appendChild(row);
        }
        var epochDate = epochToday + ((date - 1) * 86400);
        
        var eventsForDate = getEventsForDate(epochDate);
        
        var cell = document.createElement('td');

        cell.onmouseover = function () {
            if (eventsForDate.length && showDateFunction) {
                showDateFunction(eventsForDate);
            }
        };
        cell.onmouseout = function () {
            if (showDateFunction) {
                showDateFunction(selectedEvents)
            }
        };
        cell.onclick = function () {
            if (eventsForDate.length && showDateFunction) {
                selectedEvents = eventsForDate;
                showDateFunction(eventsForDate);
            }
        };

        cell.appendChild(document.createTextNode(date));
        
        if (type) {
            cell.className = 'out-of-month';
        }
        if (eventsForDate.length) {
            cell.className+= ' events';
        }
        
        row.appendChild(cell);
        
        return row;
    }
    
    function cellDrawerCli(date, i, row, type) {
        if (!(i % 7)) {
            if (row.length) {
                $output.drawRow(row, header0);
            }
            row = [];
        }
        var epochDate = epochToday + ((date - 1) * 86400);
        
        var eventsForDate = getEventsForDate(epochDate);
        // ?? events
        var date1 = date+'';
        
        //cell.appendChild(document.createTextNode(date));
        
        var style = 'BOLD';
        if (type) {
            style = '';
            //date1 = '.' + date + '.';
            //cell.className = 'out-of-month';
        }
        if (eventsForDate.length) {
            date1 = '{' + date + '}';
            //cell.className+= ' events';
        }

        var date1 = $output.padText(date1, cellWidth, style);
        row.push(date1);
        
        return row;
    }

    if (isHTml) {
        var row = null;
    } else {
        cellDrawer = cellDrawerCli;
        var row = [];
    }
    var addExtraRow = false;
    
    if (daysToPrepend + 1 < 1) {
        addExtraRow = true;
    }
    
    
    for (var i = 0; true; i++) {
        var date = i;

        if (addExtraRow) {
            date-= 7;
        }

        if (date < daysToPrepend) {
            var type = 1;
            date = lastMonthLength - daysToPrepend + date + 1;
        } else if (date - daysToPrepend + 1 > lengthOfMonth) {
            if (!(i % 7)) {
                break;
            }
            var type = 2;
            date = (date - lengthOfMonth - daysToPrepend) + 1;
        } else {
            date-= daysToPrepend - 1;
            var type = 0;
        }

        row = cellDrawer(date, i, row, type);
    }

    
    
    
    if (isHTml) {
        $output.appendChild(calendarTable);
    } else {
        $output.drawRow(row, header0);
        $output.drawRowFooter(header0);
    }
}

if (typeof module !== 'undefined' && module.exports !== 'undefined') {
    module.exports = Month;
}