import './App.css';
import { useState, useEffect, useCallback } from "react";
import SearchInput from "./components/search-input";
import SearchResults from "./components/search-results";

function App() {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setHistory(savedHistory);
    }, []);

    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('searchHistory', JSON.stringify(history));
        }
    }, [history]);

    const handleSearch = useCallback((searchQuery) => {
        setQuery(searchQuery);
        if (!history.find(el => el.title === searchQuery)) {
            setHistory(prev => [{ title: searchQuery }, ...prev]);
        }
    }, [history]);

    const handleRemoveHistory = useCallback((item) => {
        setHistory(prev => prev.filter(historyItem => historyItem.title !== item.title));
    }, []);

    return (
        <div className="App">
            <h1> Search X</h1>
            <div>
                <SearchInput
                    query={query}
                    onSearch={handleSearch}
                    history={history}
                    onRemoveHistory={handleRemoveHistory}
                />
                <SearchResults query={query} />
            </div>
        </div>
    );
}

export default App;
