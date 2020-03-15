import {
    getWeek as getWeekDF,
    setWeek as setWeekDF,
    format as formatDF
} from 'date-fns';

const options = {
    weekStartsOn: 1
}
const dateFormat = "yyyy-MM-dd";
const dateTimeFormat = "yyyy-MM-dd HH:mm";

export const getWeek = (date) => getWeekDF(date, options);

export const setWeek = (date, week) => setWeekDF(date, week, options);

export const formatDate = (date, format) => formatDF(date, format || dateFormat);

export const formatDateTime = (date) => formatDF(date, dateTimeFormat);
