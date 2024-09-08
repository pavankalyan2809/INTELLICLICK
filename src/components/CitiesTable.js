import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=50&start=${page * 50}`
        );
        setCities((prevCities) => [...prevCities, ...response.data.records]);
        if (response.data.records.length === 0) setHasMore(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, [page]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = cities.filter((city) =>
      city.fields.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleSort = (column) => {
    const sortedCities = [...cities].sort((a, b) =>
      a.fields[column].localeCompare(b.fields[column])
    );
    setCities(sortedCities);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <input
        type="text"
        placeholder="Search cities..."
        value={searchQuery}
        onChange={handleSearch}
        style={{
          marginBottom: '20px',
          padding: '10px',
          fontSize: '16px',
          width: '100%',
          maxWidth: '400px',
          boxSizing: 'border-box'
        }}
      />
      <InfiniteScroll
        dataLength={cities.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '800px' }}>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>City Name</th>
              <th onClick={() => handleSort('country')} style={{ cursor: 'pointer', border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Country</th>
              <th onClick={() => handleSort('timezone')} style={{ cursor: 'pointer', border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {(searchQuery ? filteredCities : cities).map((city) => (
              <tr key={city.recordid}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <Link to={`/weather/${city.fields.name}`}>
                    {city.fields.name}
                  </Link>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{city.fields.country}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{city.fields.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default CitiesTable;
