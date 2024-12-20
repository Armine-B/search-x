import React, {useState, useEffect, memo} from 'react';
import fakeDatabase from "../../db/database";

function SearchResults({ query }) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchDuration, setSearchDuration] = useState(0);

    useEffect(() => {
        if (query) {
            setIsLoading(true);
            const startTime = Date.now();

            const filteredResults = fakeDatabase.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            let endTime
            setTimeout(() => {
                endTime = Date.now()
                setResults(filteredResults);
                setSearchDuration(Math.round(endTime - startTime));
                setIsLoading(false);
            }, 1000 / filteredResults.length);

        } else {
            setResults([]);
            setSearchDuration(0);
        }
    }, [query]);

    return (
        <div className="search-results">
            {isLoading ? (<div>Loading...</div>) :
                <>
                    {searchDuration > 0 && (
                        <p>Results: {results.length} ({searchDuration}ms)</p>
                    )}
                    <ul>
                        {results.map((item, index) => (
                            <li key={index}>
                                <a className="result-title" href={`#${item.title}`} target="_blank" rel="noopener noreferrer">
                                    {item.title}
                                </a>
                                <p>{item.description}</p>
                            </li>
                        ))}
                    </ul>
                </>}
        </div>
    );
}

export default memo(SearchResults);
