import brightness from '@system.brightness';

export default{
    data:{
        srcDays: [],
        srcMonths: [],
        weeks: [],

        todayDay: 0,
        todayMonth: 0,
        todayYear: 0,
        currentMonth: "",
        currentYear: "",
        firstDay: "",
        daysInMonth: "",
    },

    onInit() {

        this.fillConstData();

        let today = new Date();
        this.todayDay = today.getDate();
        this.todayMonth = today.getMonth();
        this.todayYear = today.getFullYear();

        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();

        brightness.setKeepScreenOn({keepScreenOn: true});

        this.showCalendar(this.currentMonth, this.currentYear);
    },

    fillConstData() {
        this.srcDays = [
                this.$t('strings.mon'),
                this.$t('strings.tue'),
                this.$t('strings.wed'),
                this.$t('strings.thu'),
                this.$t('strings.fri'),
                this.$t('strings.sat'),
                this.$t('strings.sun')
        ];
        this.srcMonths = [
                this.$t('strings.jan'),
                this.$t('strings.feb'),
                this.$t('strings.mar'),
                this.$t('strings.apr'),
                this.$t('strings.may'),
                this.$t('strings.jun'),
                this.$t('strings.jul'),
                this.$t('strings.aug'),
                this.$t('strings.sep'),
                this.$t('strings.oct'),
                this.$t('strings.nov'),
                this.$t('strings.dec'),
        ];
    },

    showCalendar(month, year) {

        this.firstDay = (new Date(year, month)).getDay();
        //console.debug("first: "+ this.firstDay);
        this.daysInMonth = 32 - new Date(year, month, 32).getDate();

        let date = 1;
        let first = this.firstDay - 1;
        if (this.firstDay == 0) first = 6; // fix if 1st day is Sunday
        //console.debug("first: "+ first);
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
                        let today = '#FFE182';
                        let color = wdayColor;

                        if (j < 5)
                            color = wdayColor;
                        else
                            color = wendColor;

                        if (date == this.todayDay && this.todayMonth == month && this.todayYear == year)
                            color = today;

                        weeksLocal[i][j] = { txt: date, bcolor: color};
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
        else if (e.direction == "down")
            this.nextYear();
        else if (e.direction == "up")
            this.prevYear();

    },

    next() {
        this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        this.showCalendar(this.currentMonth, this.currentYear);
    },

    previous() {
        this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
        this.showCalendar(this.currentMonth, this.currentYear);
    },

    nextYear() {
        this.currentYear = this.currentYear + 1;
        this.showCalendar(this.currentMonth, this.currentYear);
    },

    prevYear() {
        this.currentYear = this.currentYear - 1;
        this.showCalendar(this.currentMonth, this.currentYear);
    },
}