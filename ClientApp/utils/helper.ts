import { DateRange } from "../store/Campus"

export function isEmpty(obj:any):boolean {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

export function transformDateRangeToUtc(dateRange: DateRange) : any {
   return {
       startDate: dateRange.startDate?dateRange.startDate.utc().format():null,
       endDate: dateRange.endDate?dateRange.endDate.utc().format():null
   }
}