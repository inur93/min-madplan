

export const splice = (arr, query, count = 1) => {
    const el = arr.find(query);
    const index = arr.indexOf(el);
    if (index >= 0) {
        arr.splice(index, count);
    }
    return arr;
}