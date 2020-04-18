
export const splice = (arr, query, count = 1) => {
    const el = arr.find(query);
    const index = arr.indexOf(el);
    if (index >= 0) {
        arr.splice(index, count);
    }
    return arr;
}


export const sortByCheckedThenName = (x, y) => {
    if(!x || !y) return 0;
    if (x.checked) return 1;
    if (y.checked) return -1;

    if (x.name < y.name) {
        return -1;
    } else if (x.name > y.name) {
        return 1;
    }
    return 0;
}