export default class CalendarApi {
    constructor(year) {
        this.year = year;
        // this.calendar = this.buildCalendar()
    }

    buildCalendar() {
        const months = [];
        const firstDayOfWeekOfYear = new Date(this.year, 0, 1).getDay();

        // Get All Months 
        for(let month = 0, dayOfWeek = firstDayOfWeekOfYear; month < 12; month++) {
            const lastDayOfMonth = new Date(this.year, month + 1, 0).getDate();
            const daysOfMonth = [];

            // Single Month days
            for(let day = 1; day <= lastDayOfMonth; day++) {
                if(dayOfWeek > 6) {
                    dayOfWeek = 0;
                }

                daysOfMonth.push({day: day, dayOfWeek: dayOfWeek});
                dayOfWeek++;
            }

            months.push(daysOfMonth);
        }

        return months;
    }

    getMonth(month) {
        return this.buildCalendar()[month]
    }

}
