import brightness from '@system.brightness';
let numbers, newNumbers;

export default{
    data:{
        srcDays: ["M", "T", "W", "T", "F", "S", "S"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        weeks: "",

        currentDisplay: "",
        currentMonth: "",
        currentYear: "",
        firstDay: "",
        daysInMonth: "",
    },

    onInit() {
        let today = new Date();
        this.currentMonth = today.getMonth();
        this.currentDisplay = this.months[this.currentMonth]
        this.currentYear = today.getFullYear();

        brightness.setKeepScreenOn({keepScreenOn: true});

        this.showCalendar(this.currentMonth, this.currentYear);
    },

    showCalendar(month, year) {
        this.firstDay = (new Date(year, month)).getDay();
        console.debug("first day: "+ this.firstDay);
        this.daysInMonth = 32 - new Date(year, month, 32).getDate();

        let date = 1;
        let first = this.firstDay - 1;
        let daysInMonth = this.daysInMonth;
        let weeksLocal = [['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''], ['','','','','','','']];
        if (first < 7 && daysInMonth < 32 && weeksLocal.length < 7) {
            for (var i = 0; i < weeksLocal.length; i++) {
                var week = weeksLocal[i];
                for (var j = 0; j < week.length; j++) {
                    if (i == 0 && j < first) {
                        weeksLocal[i][j] = { txt: '', bcolor: '#c6c6c6' };
                    } else if (date <= daysInMonth) {
                        let wdayColor = '#c6c6c6';
                        let wendColor = '#a6a6a6';
                        if (j < 5)
                            weeksLocal[i][j] = { txt: date, bcolor: wdayColor};
                        else
                            weeksLocal[i][j] = { txt: date, bcolor: wendColor};
                        date++;
                    } else {
                        break;
                    }
                }
            }
            this.weeks = weeksLocal;
        }

    },

    touchMove(e) {
        if (e.direction == "right")
            this.previous();
        else if (e.direction == "left")
            this.next();
    },

    next() {
        this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        this.currentDisplay = this.months[this.currentMonth]
        this.showCalendar(this.currentMonth, this.currentYear);
    },

    previous() {
        this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
        this.currentDisplay = this.months[this.currentMonth]
        this.showCalendar(this.currentMonth, this.currentYear);
    },

    selectYear(e) { // Handle the swipe event.
        if (e.direction == "right") // Swipe right to exit.
        {
            this.currentYear += 1;
            this.showCalendar(this.currentMonth, this.currentYear);
        }
        else if (e.direction == "left") {
            this.currentYear -= 1;
            this.showCalendar(this.currentMonth, this.currentYear);
        }
    },
}