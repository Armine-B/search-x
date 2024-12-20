import './App.css';
import {useState} from "react";
import SearchInput from "./components/search-input";
import SearchResults from "./components/search-results";

function App() {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]);


    const handleSearch = (searchQuery) => {
        setQuery(searchQuery);
        if (!history.includes(searchQuery)) {
            setHistory(prev=> ([searchQuery, ...prev]));
        }
    };

    const handleRemoveHistory = (item) => {
        setHistory(prev => prev.filter(historyItem => historyItem !== item.title));
    };

    return (
        <div className="App">
            <h1> Search X</h1>

            <div>
                <SearchInput query={query} onSearch={handleSearch} history={history}
                             onRemoveHistory={handleRemoveHistory}/>
                <SearchResults query={query}/>
            </div>
        </div>
    );
}

export default App;
