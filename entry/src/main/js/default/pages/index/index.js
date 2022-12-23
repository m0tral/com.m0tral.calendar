import storage from '@system.storage';

export default{
    data:{
        srcDays: [],
        srcMonths: [],

        weeks0: [['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''], ['','','','','','','']],
        weeks1: [['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''], ['','','','','','','']],
        weeks2: [['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''], ['','','','','','','']],

        pageIndex: 1,

        todayDay: 0,
        todayMonth: 0,
        todayYear: 0,
        currentMonth: 0,
        currentYear: 0,
        firstDay: 0,
        daysInMonth: 0,

        updating: false,
        showSettings: false,


        themeSelected: 0,

        swState0: true,
        swState1: false,
        swState2: false,

        daysBackColor: "#1E578A",
        foreColor: "",
        foreColorWend: "",

        key: "theme",
    },

    onInit() {

        storage.get(
            {
                key: this.key,
                success: (e) => {
                    let value = parseInt(e.value);
                    this.updateSwitches(value);
                },
            });

        this.daysBackColor = "#1E578A";
        this.fillConstData();

        let today = new Date();
        this.todayDay = today.getDate();
        this.todayMonth = today.getMonth();
        this.todayYear = today.getFullYear();

        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();

        //brightness.setKeepScreenOn({keepScreenOn: true});
        this.bindData();
    },

    bindData() {
        this.showCalendar(0, this.currentMonth-1, this.currentYear);
        this.showCalendar(1, this.currentMonth, this.currentYear);
        this.showCalendar(2, this.currentMonth+1, this.currentYear);
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

        for (var i = 0; i < this.weeks0.length; i++) {
            var week = this.weeks0[i];
            for (var j = 0; j < week.length; j++) {
                week[j] = { txt: '', today: false };
            }
        }
        for (var i = 0; i < this.weeks1.length; i++) {
            var week = this.weeks1[i];
            for (var j = 0; j < week.length; j++) {
                week[j] = { txt: '', today: false };
            }
        }
        for (var i = 0; i < this.weeks2.length; i++) {
            var week = this.weeks2[i];
            for (var j = 0; j < week.length; j++) {
                week[j] = { txt: '', today: false };
            }
        }
    },

    showCalendar(pageIndex, month, year) {

        if (this.updating) return;
        this.updating = true;

        if (month == 12) {
            year = year + 1;
            month = 0;
        }
        else if (month == -1) {
            year = year - 1;
            month = 11;
        }

        //console.debug("page mm/yy: "+ pageIndex +", " + month +"/"+ year);

        this.firstDay = (new Date(year, month)).getDay();
        //console.debug("first: "+ this.firstDay);
        this.daysInMonth = 32 - new Date(year, month, 32).getDate();

        let date = 1;
        let first = this.firstDay - 1;
        if (this.firstDay == 0) first = 6; // fix if 1st day is Sunday
        //console.debug("first: "+ first);
        let daysInMonth = this.daysInMonth;
        let weeksLocal;

        if (pageIndex == 0) weeksLocal = this.weeks0;
        if (pageIndex == 1) weeksLocal = this.weeks1;
        if (pageIndex == 2) weeksLocal = this.weeks2;

        //let wdayColor = this.getBackColor();
        //let wendColor = this.getWendColor();
        //let today = this.getBackColorToday();
        //let bcolor = this.getBackColor();

        this.foreColor = this.getForeColor();
        this.foreColorWend = this.getForeColorWend();

        if (first < 7 && daysInMonth < 32 && weeksLocal.length < 7) {
            for (var i = 0; i < weeksLocal.length; i++) {
                var week = weeksLocal[i];
                for (var j = 0; j < week.length; j++) {
                    if ((i == 0 && j < first) || (date > daysInMonth)) {
                        if (j > 4) {
                            week[j].txt = '';
                            week[j].today = false;
                        }
                        else {
                            week[j].txt = '';
                            week[j].today = false;
                        }
                    } else if (date <= daysInMonth) {

                        week[j].txt = date;

                        if (date == this.todayDay && this.todayMonth == month && this.todayYear == year) {
                            week[j].today = true;
                        }
                        else {
                            week[j].today = false;
                        }

                        date++;
                    } else {
                        break;
                    }
                }
            }

            this.updating = false;
        }
    },

    pageChange(e) {
        if (this.pageIndex == 1 && e.index == 2) {  // [x]-[o]>[p]
            this.showCalendar(0, this.currentMonth+1, this.currentYear);
        }
        if (this.pageIndex == 1 && e.index == 0) {  // [p]<[o]-[x]
            this.showCalendar(2, this.currentMonth-1, this.currentYear);
        }
        if (this.pageIndex == 2 && e.index == 0) { //  [p]-[x]-[o]>
            this.showCalendar(1, this.currentMonth+1, this.currentYear);
        }
        if (this.pageIndex == 0 && e.index == 1) { //  [o]>[p]-[x]
            this.showCalendar(2, this.currentMonth+1, this.currentYear);
        }
        if (this.pageIndex == 0 && e.index == 2) { // <[o]-[x]-[p]
            this.showCalendar(1, this.currentMonth-1, this.currentYear);
        }
        if (this.pageIndex == 2 && e.index == 1) { //  [x]-[p]<[o]
            this.showCalendar(0, this.currentMonth-1, this.currentYear);
        }

        // required to make force refresh UI
        //if (e.index == 0) this.weeks0 = this.weeks0;
        //if (e.index == 1) this.weeks1 = this.weeks1;
        //if (e.index == 2) this.weeks2 = this.weeks2;

        //console.debug("pageIndex change: "+ e.index);
        this.pageIndex = e.index;
    },

    touchMove(e) {
        if (e.direction == "right")     this.previous();
        else if (e.direction == "left") this.next();
        if (e.direction == "down")      this.nextYear();
        else if (e.direction == "up")   this.prevYear();
    },

    next() {
        this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
    },

    previous() {
        this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    },

    nextYear() {
        this.currentYear = this.currentYear + 1;
        this.showCalendar(0, this.currentMonth-1, this.currentYear);
        this.showCalendar(1, this.currentMonth, this.currentYear);
        this.showCalendar(2, this.currentMonth+1, this.currentYear);

    },

    prevYear() {
        this.currentYear = this.currentYear - 1;
        this.showCalendar(0, this.currentMonth-1, this.currentYear);
        this.showCalendar(1, this.currentMonth, this.currentYear);
        this.showCalendar(2, this.currentMonth+1, this.currentYear);
    },

    onSettings() {
        this.showSettings = true;
    },
    exitSettings() {
        this.showSettings = false;
    },
    updateSwitches(index) {

        this.themeSelected = index;

        if (index == 0) { this.swState0 = true; this.swState1 = false; this.swState2 = false; }
        if (index == 1) { this.swState1 = true; this.swState0 = false; this.swState2 = false; }
        if (index == 2) { this.swState2 = true; this.swState0 = false; this.swState1 = false; }

        this.setDayBackColor();
    },
    switchChange(index) {
        this.updateSwitches(index);
        storage.set({key: this.key, value: index });
        this.bindData();
    },
    setDayBackColor() {
        if (this.themeSelected == 0) this.daysBackColor = "#1E578A";
        if (this.themeSelected == 1) this.daysBackColor = "#AA1E578A";
        if (this.themeSelected == 2) this.daysBackColor = "#551E578A";
    },
    getCellBackColor(isToday, isWeekEnd) {
        if (isToday)
            return this.getBackColorToday();

        if (isWeekEnd)
            return this.getBackColorWend();
        else
            return this.getBackColor();
    },
    getBackColor() {
        if (this.themeSelected == 0) return "#c6c6c6";
        if (this.themeSelected == 1) return "#000000";
        if (this.themeSelected == 2) return "#000000";
    },
    getBackColorToday() {
        if (this.themeSelected == 0) return "#FFe0b0";
        if (this.themeSelected == 1) return "#80FFe050";
        if (this.themeSelected == 2) return '#40FFe050';
    },
    getForeColor() {
        if (this.themeSelected == 0) return "#005080";
        if (this.themeSelected == 1) return "#e0e0e0";
        if (this.themeSelected == 2) return "#e0e0e0";
    },
    getForeColorWend() {
        if (this.themeSelected == 0) return "#005080";
        if (this.themeSelected == 1) return "#ffc655";
        if (this.themeSelected == 2) return "#e0e0e0";
    },
    getBackColorWend() {
        if (this.themeSelected == 0) return "#ACB6DE";
        if (this.themeSelected == 1) return '#222222';
        if (this.themeSelected == 2) return '#111111';
    },
}