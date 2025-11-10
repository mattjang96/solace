"use client";

import { useEffect, useState } from "react";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  photoUrl: string;
}

const formatPhoneNumber = (phone: number): string => {
  const phoneStr = phone.toString();
  return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/advocates")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }
        return response.json();
      })
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching advocates:", error);
        setIsLoading(false);
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term) {
      setFilteredAdvocates(advocates);
      return;
    }

    const filtered = advocates.filter((advocate) => {
      const fullName = `${advocate.firstName} ${advocate.lastName}`.toLowerCase();
      return (
        fullName.includes(term.toLowerCase()) ||
        advocate.city.toLowerCase().includes(term.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(term.toLowerCase()) ||
        advocate.specialties.some((specialty: string) =>
          specialty.toLowerCase().includes(term.toLowerCase())
        ) ||
        advocate.yearsOfExperience.toString().includes(term)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const onReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Professional Header Banner */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-600 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Solace</h1>
                <p className="text-xs text-gray-500 font-medium">
                  Your Personal Medical Advocates
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, city, specialty, degree, or experience..."
                value={searchTerm}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            {searchTerm && (
              <button
                onClick={onReset}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200 whitespace-nowrap"
              >
                Clear Search
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredAdvocates.length} of {advocates.length} advocates
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredAdvocates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No advocates found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria
            </p>
            {searchTerm && (
              <button
                onClick={onReset}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                View All Advocates
              </button>
            )}
          </div>
        ) : (
          /* Advocates List - Full Width Cards */
          <div className="space-y-6">
            {filteredAdvocates.map((advocate, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-teal-200"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0 relative">
                    <img
                      src={advocate.photoUrl}
                      alt={`${advocate.firstName} ${advocate.lastName}`}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-4xl font-bold shadow-md"
                      style={{ display: "none", position: "absolute", top: 0, left: 0 }}
                    >
                      {advocate.firstName[0]}
                      {advocate.lastName[0]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      {/* Name and Degree */}
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {advocate.firstName} {advocate.lastName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                            {advocate.degree}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {advocate.yearsOfExperience}{" "}
                            {advocate.yearsOfExperience === 1
                              ? "year"
                              : "years"}{" "}
                            experience
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-gray-600 mb-4">
                          <svg
                            className="h-5 w-5 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="font-medium text-base">
                            {advocate.city}
                          </span>
                        </div>
                      </div>

                      {/* Phone Number - Desktop */}
                      <div className="hidden sm:flex flex-col items-end gap-3">
                        <div className="flex items-center text-gray-600">
                          <svg
                            className="h-5 w-5 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="font-semibold text-lg">
                            {formatPhoneNumber(advocate.phoneNumber)}
                          </span>
                        </div>
                        <a
                          href={`tel:${advocate.phoneNumber}`}
                          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                          Call Now
                        </a>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Specialties:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {advocate.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Phone Number - Mobile */}
                    <div className="sm:hidden pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <svg
                            className="h-5 w-5 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="font-semibold">
                            {formatPhoneNumber(advocate.phoneNumber)}
                          </span>
                        </div>
                        <a
                          href={`tel:${advocate.phoneNumber}`}
                          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                          Call
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!isLoading && filteredAdvocates.length > 0 && (
          <div className="mt-12 text-center text-gray-600">
            <p>
              Showing {filteredAdvocates.length} advocate
              {filteredAdvocates.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
