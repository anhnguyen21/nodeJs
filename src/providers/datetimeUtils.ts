import { addWeeks, addMonths, addYears, addDays } from 'date-fns'

export const dateUtils = {
  nowDay: new Date(),
  nextOneDay: addDays(new Date(), 1),
  nextOneWeek: addWeeks(new Date(), 1),
  nextOneMonth: addMonths(new Date(), 1),
  nextOneYear: addYears(new Date(), 1)
}
