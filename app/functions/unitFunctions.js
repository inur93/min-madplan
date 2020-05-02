import { GetUnitsApi } from "../_api";

function getConversionTable(units) {
    return units.reduce((map, value) => {
        map[value.name] = value.conversionTable || {};
        return map;
    }, {});
}

let conversionTable;
const api = GetUnitsApi();
api.getAll().then(units => conversionTable = getConversionTable(units));

function convertSingle(from, to) {
    if(!conversionTable) return from.amount;
    const scale = (conversionTable[from.unit] || {})[to.unit] || 1;
    return Number.parseFloat((from.amount * scale).toFixed(2));
}

export function transformAmount(from, to) {
    if (Array.isArray(from)) {
        return from.reduce((sum, el) => sum + convertSingle(el, to), 0);
    } else {
        return convertSingle(from, to);
    }
}