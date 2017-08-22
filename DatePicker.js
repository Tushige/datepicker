class DatePicker {
    /********************
     * ABSTRACT FUNCTION
     *
     * The monthly calendar of DatePicker is represented by a 2D array of numbers, where each
     * nested array represents a week in the month, and each element in the week array
     * represents a date in the month. The index position of the week array corresponds
     * to the day in the week. For example, 0->Monday, 1->Tuesday ... 6->Sunday.
     * So, if a week array is [' ', ' ', 1, 2, 3, 4, 5]. It means, the first date of the month
     * is on Wednesday, second date Thursday and so forth.
     */

     /****************
      * REP INVARIANT
      *
      * An element in the week array must be in the range of [1, 31]
      * A week array  must have a size of 7 to represent each day in the week.
      */

    /**
     * @param id (string) : id attribute of a <div>
     * @param callback (function)
     * When a date is selected, the callback function is called with arguments:
     * id, an object with properties 'month', 'day', and 'year'.
     * Example :  {month: 1, day: 30, year: 2016} is the encoding of January 30, 2016
     */
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
        this.monthConversionTable = {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        };
        // REP
        this.calendar = this._constructNewCalendar();
        this.datePicker = document.getElementById(id);
    }
    /**
     * Replaces the the contents of the datePicker's div with HTML that displays
     * a small one-month calendar such as those you might see in a travel
     * reservation website
     *
     * @param date (Date) : selects a particular month
     */
    render(date) {
        this.date = date;
        this._populateCalendar();
        this.datePicker.appendChild(this.calendar);
    }
    /**
     * displays the datePicker
     */
    show() {
        this.calendar.style.display = "block";
    }

    /**
     * removes datePicker from DOM flow
     */
    hide() {
        this.calendar.style.display = "none";
    }
    /**
     * @return (object) : representing a calendar
     */
    _constructNewCalendar() {
        const calendar = document.createElement("div");
        calendar.classList.add("calendar");
        return calendar;
    }

    /**
     * destroys the current calendar and re-renders a new one
     * invoked when date changes
     * @param date (Date object) : representing date the calendar shows
     */
    _reRender(date) {
        // destroy current calendar
        this.datePicker.removeChild(this.calendar);
        // create a new calendar for date
        this.calendar = this._constructNewCalendar();
        // re-render the new calendar
        this.render(date);
        // by default, re-rendered calendar will be visible
        this.show();
    }

    /*
     * populates calendar with dates
     */
    _populateCalendar() {
        const calendar_header = this._getCalendarHeader();
        const calendar_table = this._getCalendarTable();
        this.calendar.appendChild(calendar_header);
        this.calendar.appendChild(calendar_table);
    }

    /**
     * @return (object) : representation of the datePicker header
     * includes back/forward buttons and current date
     */
    _getCalendarHeader() {
        const header = document.createElement("div");
        header.classList.add("datePicker-header");

        // when clicked, goes to previous month
        const leftButton = document.createElement("span");
        leftButton.textContent = "<";
        leftButton.classList.add("header-display-controller");
        leftButton.setAttribute("id", "display-controller-left");
        leftButton.onclick = this._displayControllerClickHandler.bind(this);

        // when clicked, goes to next month
        const rightButton = document.createElement("span");
        rightButton.textContent = ">";
        rightButton.classList.add("header-display-controller");
        rightButton.setAttribute("id", "display-controller-right");
        rightButton.onclick = this._displayControllerClickHandler.bind(this);

        const currDate = document.createElement("span");
        currDate.textContent = `${this.monthConversionTable[this.date.getMonth()]} ${this.date.getFullYear()}`;

        header.appendChild(leftButton);
        header.appendChild(currDate);
        header.appendChild(rightButton);
        return header;
    }

    /**
     * when a display controller is clicked, we change the year/month accordingly
     */
    _displayControllerClickHandler(event) {
        const controllerId = event.target.id;
        if (controllerId === "display-controller-right") {
            this.date = new Date(this.date.getFullYear(), this.date.getMonth()+1);
        } else if (controllerId === "display-controller-left") {
            this.date = new Date(this.date.getFullYear(), this.date.getMonth()-1);
        }
        this._reRender(this.date);
    }
    /**
     * @return (object) : representation of the calendar.
     * includes all the days of the currently selected month and year
     */
    _getCalendarTable() {
        const calendar_table = document.createElement("table");
        const weekList = document.createElement("tr");
        for (const name of ['Mon', 'Tue', 'Wed', "Thu", "Fri", 'Sat', 'Sun']) {
            const th = document.createElement("th");
            th.classList.add("week-day-name");
            th.textContent = name;
            weekList.appendChild(th);
        }
        calendar_table.appendChild(weekList);
        const days = this._getAvailableDaysInMonth(this.date.getFullYear(), this.date.getMonth());
        const monthTable = this._getMonthTable(days);
        const monthTableNodes = this._convertMonthTableToDOMNodes(monthTable);
        for (const week of monthTableNodes) {
            calendar_table.appendChild(week);
        }
        return calendar_table;
    }

    /**
     * @param year (number): 4 digit number representing a year in a calendar
     * @param month (number) number representing a month, beginning with 0 for January to 11 for December
     * @return a 1D array of Object that correspond to each available day
     * in the month. Object has properties 'date', and 'day'.
     * date (number) represents day of month, and is in the range of 1-31
     * day (number) represents day in a week, and is in the range of 0-6 (0 for Monday and 6 for Sunday)
     */
    _getAvailableDaysInMonth(year, month) {
        let dateCopy = new Date(year, month, 1);
        let days = [];
        let i = 0;
        while (dateCopy.getMonth() === month) {
            let d = new Date(dateCopy);
            days.push({
                date: d.getDate(),
                day: d.getDay()
            });
            dateCopy.setDate(dateCopy.getDate()+1);
        }
        return days;
    }

    /**
     * @param days (Array) : Array of Custom Date objects, each corresponding to an available
     * date in a month. Custom date object must have 2 fields: (1) date, (2) day
     * @return 2D array (Array) : each Array element represents a week in the month.
     * Each week is an array that contains (number),
     * where each number represents the day of the month (1-31).
     * invalid day of month is represented by a (string) with 1 space character.
     */
    _getMonthTable(days) {
        let dayIdx = 0; // current index into @param days
        let rowIdx = 0; // current index into monthConversionTable
        let monthConversionTable = [[]]; // object to return
        // assign each date into correct
        while (dayIdx < days.length) {
            for (let col=0; col<7; col++) {
                if (dayIdx <days.length && days[dayIdx].day === col) {
                    // create next week array if current week is completed
                    if (monthConversionTable[rowIdx].length >= 7) {
                        monthConversionTable.push([]);
                        rowIdx++;
                    }
                    monthConversionTable[rowIdx].push(days[dayIdx].date);
                    dayIdx++;
                } else {
                    monthConversionTable[rowIdx].push(' ');
                }
            }
        }
        return monthConversionTable;
    }

    /**
     * @param monthTable (Array) : 2D Array that represents the dates in month
     * @return 2D Array (Array): wraps each date (number) in monthTable in a DOM element <td>
     * and assigns click handler to each date. Wraps each nested array in a DOM element <tr>
     * Doesn't add/remove elements
     */
    _convertMonthTableToDOMNodes(monthTable) {
        const rows = [];
        const monthTableElements = monthTable.map((week) => {
            return week.map((day) => {
                const dayNode = document.createElement("td");
                dayNode.classList.add("calendar-day");
                dayNode.textContent = day;
                dayNode.addEventListener("click", (event) => {
                    this.callback(this.id, {
                        year:this.date.getFullYear(),
                        month: this.date.getMonth()+1,
                        day:day
                    });
                });
                if (this._isCurrentDate(day)) {
                    dayNode.classList.add("current-date");
                }
                return dayNode;
            });
        });
        for (const week of monthTableElements) {
            const row = document.createElement("tr");
            for (const day of week) {
                row.appendChild(day);
            }
            rows.push(row);
        }
        return rows;
    }
    /**
     * @return (boolean) : true if DatePicker's year/month and specified day is today
     *                     false otherwise
     */
    _isCurrentDate(day) {
        const now = new Date();
        return this.date.getFullYear() === now.getFullYear() && this.date.getMonth() === now.getMonth() && day === now.getDay();
    }
}
