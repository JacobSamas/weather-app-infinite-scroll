"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import Header from "./header";

declare var window:any

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
  const searchParams = useSearchParams();
  const [filterQuery, setFilterQuery] = useState(
    searchParams.get("search") || ""
  );

  const limit = 10;

  const router = useRouter();

  const sortField = searchParams.get("sort") || "";
  const sortOrder = searchParams.get("order") || "ASC";
  const searchText = searchParams.get("search") || "";

  const fetchCities = async () => {
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      ...(sortField && { order_by: `${sortField} ${sortOrder}` }),
      ...(filterQuery && { q: filterQuery }),
    }).toString();

    console.log("queryParams", queryParams);

    try {
      let whereQuery = "where=";

      if (searchText) {
        whereQuery += `search(name,'${searchText}')`;
      }

      const response = await axios.get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${limit}&start=${offset}&${queryParams}&${whereQuery}`
      );
      setCities((prevCities) => [...prevCities, ...response.data.results]);
      setOffset((prevOffset) => prevOffset + limit);
      setHasMore(response.data.results.length === limit);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debounce = (callback: any, delay: number) => {
    let timeoutId: any;

    console.log("debounce");

    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  };


  const setSearchText = (text: string) => {
    setFilterQuery(text);
    setOffset(0);
    // workaround
    window.text = text
    setLocation(); // Remove the argument from the function call
  };

  const setLocation = debounce(() => {
    console.log("setting location");
    location.href = `?sort=${sortField}&order=${sortOrder}&search=${window.text}`; // Use filterQuery instead of text
  }, 2000);

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "ASC" ? "DESC" : "ASC";
    setOffset(0);
    // router.push(`?sort=${field}&order=${newOrder}`);
    location.href = `?sort=${field}&order=${newOrder}`;
  };

  useEffect(() => {
    fetchCities();
  }, [searchParams]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Header filterQuery={filterQuery} setFilterQuery={setSearchText} />

      <div
        style={{
          height: "90vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          marginTop: "5.25rem",
        }}
        className="w-full"
        id="scrollableDiv"
      >
        <InfiniteScroll
          dataLength={cities.length}
          next={fetchCities}
          style={{ display: "flex", flexDirection: "column" }} //To put endMessage and loader to the top.
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={<h4 className="text-black">Loading...</h4>}
        >
          <table className="min-w-full divide-y divide-gray-200 h-[90vh] relative">
            <thead className="bg-gray-50 w-full sticky top-0 z-10">
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
                  onClick={() => handleSort("cou_name_en")}
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
              {cities.map((city: any, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    <a
                      href={`/weather?lat=${city.coordinates.lat}&lon=${city.coordinates.lon}`}
                      target="_blank"
                    >
                      {city.name}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {city.cou_name_en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {city.timezone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {city.population}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <p className="text-lg text-black">Loading more cities...</p>
        </div>
      )}
    </main>
  );
}
