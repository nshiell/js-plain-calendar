var selectedEvents = [];

function Month(today, startOnDay, events, $output, showDateFunction) {
    var epochToday = today.getTime()/1000|0;
    
    var monthLengths = [
        /*jan*/ 31,
        /*feb*/ (today.getFullYear() % 4) ? 28 : 29,
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
    var lengthOfMonth = monthLengths[today.getMonth()];

    if (!startOnDay) {
        startOnDay = 0;
    }
    var daysToPrepend = today.getDay() - (today.getDate() % 7) + 1 - startOnDay;
    var lastMonth = today.getMonth() - 1;
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
    
    var calendarTable = document.createElement('table');
    
    
    
    var dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    var days = (startOnDay)
        ? [].concat(dayNames.slice(startOnDay), dayNames.slice(0, startOnDay))
        : dayNames;
    
    days = days.map(function (day) {return day.charAt(0).toUpperCase() + day.substr(1)});
    
    var header = document.createElement('tr');
    calendarTable.appendChild(header);
    for (var i in days) {
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode(days[i]));
        header.appendChild(cell);
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
            if (eventsForDate.length) {
                showDateFunction(eventsForDate);
            }
        };
        cell.onmouseout = function () {showDateFunction(selectedEvents)};
        cell.onclick = function () {
            if (eventsForDate.length) {
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

    var row = null;
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
    
    $output.appendChild(calendarTable);
}