import { Input as InputSUI, Dropdown } from "semantic-ui-react"
import Augosuggest from 'react-autosuggest';
import { useState } from "react";
import './input.scss';
//type, placeholder
export const Input = function ({ loading, search, ...inputProps }) {
    const Input = <InputSUI fluid className="custom-input" {...inputProps} />;
    if (search) {
        return (<div>
            <div className={`custom-input ui left icon input ${loading && 'loading'}`}>
                {Input}
            </div>
        </div>);
    }
    return Input;
}

export function ActionDropdown({ options, defaultOptionValue, defaultValue, placeholder, label, onChange, ...otherProps }) {

    const [input, setInput] = useState(defaultValue);
    const [action, setAction] = useState(defaultOptionValue);

    const handleChange = type => (evt, { name, value }) => {
        let updatedInput = input;
        let updatedAction = action;
        switch (type) {
            case 'input':
                updatedInput = evt.target.value;
                setInput(updatedInput);
                break;
            case 'action':
                updatedAction = value;
                setAction(updatedAction);
                break;
        }
        onChange({
            input: updatedInput,
            action: updatedAction
        });
    }
    return (
        <Input {...otherProps} fluid defaultValue={defaultValue} placeholder={placeholder} label={label}
            onChange={handleChange('input')}
            action={
                <Dropdown button basic floating
                    defaultValue={defaultOptionValue}
                    onChange={handleChange('action')}
                    options={options.map(option => ({ key: option, text: option, value: option }))}
                />
            }
        />
    )
}

const renderProductItem = (suggestion) => {
    return <span>{suggestion.name}</span>;
}

const getProductItemValue = (suggestion) => {
    return suggestion.name;
}
export const AutoComplete = function ({ placeholder, getSuggestions, renderSuggestion, getSuggestionValue, onSelect }) {
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const onChange = (event, { newValue, method }) => {
        switch (method) {
            case 'click':
            case 'enter':
                onSelect(suggestions.find(x => getSuggestionValue(x) === newValue)); //find value
            case 'escape':
                setValue("");
                break;
            case 'up':
            case 'down':
                break;
            default:
                setValue(newValue);
                break;
        }
    }
    const onSuggestionFetchRequested = async ({ value }) => {
        setIsLoading(true);
        setSuggestions(await getSuggestions(value));
        setIsLoading(false);
    }
    const onSuggestionsClearRequested = () => setSuggestions([]);
    const shouldRenderSuggestions = (value) => value.length > 1;

    const inputProps = {
        placeholder: placeholder,
        value,
        onChange
    }
    return <Augosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderSuggestion={renderSuggestion}
        getSuggestionValue={getSuggestionValue}
        inputProps={inputProps}
    />
}

export const ProductItemAutoComplete = function (props) {
    return <AutoComplete {...props} renderSuggestion={renderProductItem} getSuggestionValue={getProductItemValue} />;
}

export const SearchInput = function ({ placeholder, onChange, ...otherProps }) {
    return <Input {...otherProps} icon='search' placeholder={placeholder} onChange={e => onChange(e.target.value)} />;
}

export const InputFile = ({ label, ...props }) => {
    return <div>
        <Input id='file' {...props} type='file' name='file' className='file-input' />
        <label htmlFor='file'>{label}</label>
    </div>
}