import React, {useState, useEffect, useRef, useMemo} from 'react';
import fakeDatabase from "../../db/database";

function SearchInput({onSearch, history, onRemoveHistory}) {
    const [query, setQuery] = useState('');
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [showAutocompleteResults, setShowAutocompleteResults] = useState(false);
    const inputRef = useRef(null);
    const autoCompleteResultsRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value) {
            const filteredResults = fakeDatabase.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
            setAutocompleteResults(filteredResults);
            setShowAutocompleteResults(true);
        } else {
            setAutocompleteResults([]);
            setShowAutocompleteResults(false);
        }
    };

    const handleSelect = (result) => {
        onSearch(result.title);
        setQuery(result.title);
        setShowAutocompleteResults(false);
    };

    const handleHistoryRemove = (e, item) => {
        e.stopPropagation();
        onRemoveHistory(item);
    };

    const handleBlur = (e) => {
        if (!autoCompleteResultsRef.current?.contains(e.relatedTarget)) {
            setShowAutocompleteResults(false);
        }
    };

    const handleFocus = () => {
        if (autocompleteResults.length > 0) {
            setShowAutocompleteResults(true);
        }
    }

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            onSearch(query);
        }
    }
    const handleMouseDown = (event) => {
        event.preventDefault();
        inputRef.current.focus();
    };

    const showResults = useMemo(() => showAutocompleteResults && autocompleteResults.length > 0, [showAutocompleteResults, autocompleteResults.length])


    return (<div className="input-wrapper">
        <input
            className={`search-input${showResults  ? ' has-results ' : ''}`}
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleEnterPress}
            placeholder="Search..."
        />
        {showResults && (
            <ul className="autocomplete-results" ref={autoCompleteResultsRef} onMouseDown={handleMouseDown}>
                {autocompleteResults.slice(0, 10).map((item, index) => (<li
                    key={index}
                    onClick={() => handleSelect(item)}
                    style={{color: history.includes(item.title) ? 'purple' : 'black'}}
                >
                    <div>
                        <img width='20' height="20"
                             src={`/images/${history.includes(item.title) ? 'clock' : 'search-interface-symbol'}.png`}
                             alt='icon'/>
                        <h2>{item.title} </h2>
                    </div>
                    {history.includes(item.title) && (
                        <button onClick={(e) => handleHistoryRemove(e, item)}>Remove</button>)}
                </li>))}
            </ul>)}
    </div>);
}

export default SearchInput;
