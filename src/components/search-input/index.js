import React, {useState, useEffect, useRef, useMemo, useCallback, memo} from 'react';
import fakeDatabase from "../../db/database";
import {debounce} from "../../helpers";

function SearchInput({onSearch, history, onRemoveHistory}) {
    const [query, setQuery] = useState('');
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [showAutocompleteResults, setShowAutocompleteResults] = useState(false);
    const inputRef = useRef(null);
    const autoCompleteResultsRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const debouncedSearch = useMemo(
        () => debounce((query) => {
            if (query) {
                const filteredResults = fakeDatabase.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
                setAutocompleteResults(filteredResults);
                setShowAutocompleteResults(true);
            } else {
                setAutocompleteResults([]);
                setShowAutocompleteResults(false);
            }
        }, 300),
        []
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
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
        if (!query && history.length > 0 && !showAutocompleteResults) {
            setAutocompleteResults(history);
        }
        setShowAutocompleteResults(prev => !prev);
    };

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            onSearch(query);
            setShowAutocompleteResults(false)
        }
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
        inputRef.current.focus();
    };

    const showResults = useMemo(() => showAutocompleteResults && autocompleteResults.length > 0, [showAutocompleteResults, autocompleteResults.length]);
    const isInHistory = useCallback((item) => history.find(el => el.title === item.title), [history]);

    return (
        <div className="input-wrapper">
            <div className="search-input-wrapper">
                <input
                    className={`search-input${showResults ? ' has-results' : ''}`}
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onClick={handleFocus}
                    onKeyDown={handleEnterPress}
                    placeholder="Search..."
                />
                <img
                    width="16"
                    height="16"
                    src="/images/search-interface-symbol.png"
                    alt="Search Icon"
                    className="search-input-icon"
                />
            </div>
            {showResults && (
                <ul className="autocomplete-results" ref={autoCompleteResultsRef} onMouseDown={handleMouseDown}>
                    {autocompleteResults.slice(0, 10).map((item, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(item)}
                            style={{color: isInHistory(item) ? 'purple' : 'black'}}
                        >
                            <div>
                                <img width='16' height="16"
                                     src={`/images/${isInHistory(item) ? 'clock' : 'search-interface-symbol'}.png`}
                                     alt='icon'/>
                                <p>{item.title}</p>
                            </div>
                            {isInHistory(item) && (
                                <button onClick={(e) => handleHistoryRemove(e, item)}>Remove</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default memo(SearchInput);
