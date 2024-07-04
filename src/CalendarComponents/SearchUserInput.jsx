function SearchUserInput(props) {

    return (
        <>
            <div className="search-div">
                <button className="search-div_cancel" onClick={() => { props.setSearch(false) }}>X</button>
                <h2>Search results:</h2>
                <div className="search-div_results">{props.searchResult}</div>
                <button className="search-div_hide_button" onClick={() => { props.setSearch(false) }}>Hide the search results!</button>
            </div>
        </>
    )
}
export default SearchUserInput