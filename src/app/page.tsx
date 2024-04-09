"use client";

import Image from "next/image";
import axios from "axios";
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const [filterQuery, setFilterQuery] = useState("");

  const limit = 10; // Number of records per request

  const fetchCities = async () => {
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      ...(sortField && { order_by: `${sortField} ${sortOrder}` }),
      ...(filterQuery && { q: filterQuery }),
    }).toString();

    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&limit=${limit}&offset=${offset}&${queryParams}`
      );
      setCities((prevCities) => [...prevCities, ...response.data.records]);
      setOffset((prevOffset) => prevOffset + limit);
      setHasMore(response.data.records.length === limit);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
    setIsLoading(false);
  };

  const handleSort = (field:string) => {
    setSortField(field);
    setSortOrder(prevOrder => prevOrder === 'ASC' ? 'DESC' : 'ASC');
    setOffset(0);
    setCities([]); // Clear existing data
    fetchCities(); // Fetch sorted data
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <InfiniteScroll
        dataLength={cities.length}
        next={fetchCities} // Implement a function to fetch more data
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name') }>City Name</th>
              <th>Country</th>
              <th>Timezone</th>
              <th>Population</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {cities.map((city: any) => (
              <tr key={city.recordid}>
                <td>{city.fields.name}</td>
                <td>{city.fields.cou_name_en}</td>
                <td>{city.fields.timezone}</td>
                <td>{city.fields.population}</td>
                {/* Add more cell data as needed */}
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p>Loading more cities...</p>}
      </InfiniteScroll>
    </main>
  );
}
