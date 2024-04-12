"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Header from "./header";

interface City {
  recordid: string;
  fields: {
    name: string;
    cou_name_en: string;
    timezone: string;
    population: number;
  };
}

interface HeaderProps {
  filterQuery: string;
  setFilterQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [filterQuery, setFilterQuery] = useState("");

  const limit = 10;

  const fetchCities = async () => {
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      ...(sortField && { order_by: `${sortField} ${sortOrder}` }),
      ...(filterQuery && { q: filterQuery }),
    }).toString();

    console.log("queryParams", queryParams);

    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&limit=${limit}&start=${offset}&${queryParams}`
      );
      setCities((prevCities) => [...prevCities, ...response.data.records]);
      setOffset((prevOffset) => prevOffset + limit);
      setHasMore(response.data.records.length === limit);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: string) => {
    // Immediately handle the field update
    if (field === sortField) {
      // Toggle sort order if the same field is clicked
      setSortOrder((prevOrder) => (prevOrder === "ASC" ? "DESC" : "ASC"));
    } else {
      // Set new field and reset order to "ASC" when changing fields
      setSortField(field);
      setSortOrder("ASC");
    }

    // Reset the offset and clear the cities list to fetch new sorted data
    setOffset(0);
    setCities([]);
  };

  useEffect(() => {
    fetchCities();
  }, [sortField, sortOrder, filterQuery]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <Header filterQuery={filterQuery} setFilterQuery={setFilterQuery} />
      <div className="mb-4">
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter cities..."
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        />
      </div>
      <InfiniteScroll
        dataLength={cities.length}
        next={fetchCities}
        hasMore={hasMore}
        loader={<h4 className="text-black">Loading...</h4>}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                City Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Country
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Timezone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Population
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cities.map((city, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {city.fields.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {city.fields.cou_name_en}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {city.fields.timezone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {city.fields.population}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <p className="text-lg text-black">Loading more cities...</p>
        </div>
      )}
    </main>
  );
}
