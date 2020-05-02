
export const splice = (arr, query, count = 1) => {
    const el = arr.find(query);
    const index = arr.indexOf(el);
    if (index >= 0) {
        arr.splice(index, count);
    }
    return arr;
}


export const sortByCheckedThenName = (x, y) => {
    if (!x || !y) return 0;

    if (x.checked !== y.checked) {
        return x.checked ? 1 : -1;
    }

    if (x.name < y.name) {
        return -1;
    } else if (x.name > y.name) {
        return 1;
    }
    return 0;
}

export const groupBy = (array, getKey) => {
    return array.reduce(function (rv, x) {
        const key = getKey(x);
        const _key = JSON.stringify(key);
        let existing = rv.find(x => x._key === _key);
        if (existing) {
            existing.values.push(x);
        } else {
            rv.push({
                _key,
                key,
                values: [x]
            })
        }
        return rv;
    }, []);
}