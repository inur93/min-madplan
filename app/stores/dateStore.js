import {
    getWeek as getWeekDF,
    setWeek as setWeekDF,
    format as formatDF,
    addDays as addDaysDF,
    endOfWeek as endOfWeekDF
} from 'date-fns';

import da from 'date-fns/locale/da';

const options = {
    weekStartsOn: 1,
    locale: da
}
const dateFormat = "yyyy-MM-dd";
const dateTimeFormat = "yyyy-MM-dd HH:mm";
const dayFormat = "EEEE";

export const getWeek = (date) => getWeekDF(date, options);

export const setWeek = (date, week) => setWeekDF(date, week, options);

export const formatDate = (date, format) => formatDF(date, format || dateFormat);

export const formatDateTime = (date) => formatDF(date, dateTimeFormat);

export const formatDay = (date) => formatDF(date, dayFormat, options);

export const addDays = (date, amount) => addDaysDF(date, amount);

export const endOfWeek = (date) => endOfWeekDF(date, options);

//for queries
export const formatDateForQuery = (date) => formatDF(date, dateFormat);

