import { Form as FormSUI, Message } from 'semantic-ui-react';
import { formatDate, formatDateTime } from '../../functions/dateFunctions';
const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    if(!callback) return;
    const data = GetFormData(e.target);
    callback(data, e);
}
export const Form = function ({ children, onSubmit, cover, ...otherProps }) {
    return <FormSUI {...otherProps} onSubmit={handleSubmit(onSubmit)} className={cover ? "form-cover" : ""}>
        {children}
        <style jsx>{`
            :global(.form-cover){
                height: 85vh;
            }
            `}</style>
    </FormSUI>
}

export const FormField = function (props) {
    return <FormSUI.Input {...props} />;
}

export const FormError = function ({ title, message, ...props }) {
    return <Message {...props} error header={title} content={message} />;
}

export const GetFormData = (target) => {
    const formData = new FormData(target);
    let iterator = formData.keys();
    const data = {};
    while (true) {
        const entry = iterator.next();
        if (entry.done) {
            break;
        }
        const type = target.elements.namedItem(entry.value).type;
        let rawValue = formData.get(entry.value);
        let parsedValue;
        switch (type) {
            case 'number':
                parsedValue = rawValue && Number(rawValue);
                break;
            case 'datetime':
                parsedValue = rawValue && formatDateTime(new Date(rawValue));
                break;
            case 'date':
                parsedValue = rawValue && formatDate(new Date(rawValue));
                //parsedValue = rawValue && new Date(rawValue).getTime();
                break;
            default:
                parsedValue = rawValue;
        }
        data[entry.value] = parsedValue;
    }
    return serializeFormData(data);
}
//TODO remove if not used
export const HasChanged = (current, change) => {
    let keys = Object.keys(current);
    let hasChange = false;
    keys.forEach(key => {
        if (current[key] !== change[key]) {
            hasChange = true;
        }
    })
    return hasChange;
}

export const GetFormDataById = (id) => {
    return GetFormData(document.getElementById(id));
}

const initKeys = (obj, key, partialKey) => {
    let result = partialKey.match(/(.*)\[(\d)\].?(.*)/);
    if (result) {

        let outer = result[1];
        let index = result[2];
        let inner = result[3];

        if (!obj[outer]) obj[outer] = [];

        // element in array can be object or simple type
        let innerObj = inner ?
            { [inner]: obj[partialKey] } :
            obj[partialKey];

        if (obj[outer][index]) {
            obj[outer][index][inner] = obj[partialKey];
        } else {
            obj[outer][index] = innerObj;
        }
        //we cannot delete keys right away since they have to be used for other keys as well
        let keysToDelete = initKeys(obj, key, outer);
        return [partialKey, ...(keysToDelete || [])];
    } else {
        return null;
    }
}
const serializeFormData = (obj) => {
    let keysToDelete = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            keysToDelete = keysToDelete.concat(initKeys(obj, key, key));
        }
    }
    keysToDelete.forEach(key => delete obj[key]);
    return obj;
}

