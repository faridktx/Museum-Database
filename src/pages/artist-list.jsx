import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "../components/utils";
import { Download } from "lucide-react";
import "../components/components.css";

export function ArtistList() {
  const { user } = useUser();
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [nameSearch, setNameSearch] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('All');
  const [birthDateStart, setBirthDateStart] = useState('');
  const [birthDateEnd, setBirthDateEnd] = useState('');
  const [deathDateStart, setDeathDateStart] = useState('');
  const [deathDateEnd, setDeathDateEnd] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await apiFetch("/api/artists-list", "GET", user.id);
        const data = response.data;
        
        // Extract unique nationalities from artist data
        const uniqueNationalities = [...new Set(data.map(artist => artist.nationality))].filter(Boolean);
        
        setArtists(data);
        setFilteredArtists(data);
        setNationalities(['All', ...uniqueNationalities]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artist data:', error);
        setLoading(false);
      }
    };

    fetchArtists();
  }, [user.id]);

  useEffect(() => {
    applyFilters();
  }, [artists, nameSearch, idSearch, selectedNationality, birthDateStart, birthDateEnd, deathDateStart, deathDateEnd]);

  const applyFilters = () => {
    let filtered = [...artists];

    // Name filter
    if (nameSearch) {
      filtered = filtered.filter(artist => 
        artist.artist_name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    // ID filter
    if (idSearch) {
      filtered = filtered.filter(artist => 
        artist.artist_id.toString().includes(idSearch)
      );
    }

    // Nationality filter
    if (selectedNationality && selectedNationality !== 'All') {
      filtered = filtered.filter(artist => 
        artist.nationality === selectedNationality
      );
    }

    // Birth date range filter
    if (birthDateStart) {
      filtered = filtered.filter(artist => 
        artist.birth_date && new Date(artist.birth_date) >= new Date(birthDateStart)
      );
    }
    if (birthDateEnd) {
      filtered = filtered.filter(artist => 
        artist.birth_date && new Date(artist.birth_date) <= new Date(birthDateEnd)
      );
    }

    // Death date range filter
    if (deathDateStart) {
      filtered = filtered.filter(artist => 
        artist.death_date && new Date(artist.death_date) >= new Date(deathDateStart)
      );
    }
    if (deathDateEnd) {
      filtered = filtered.filter(artist => 
        artist.death_date && new Date(artist.death_date) <= new Date(deathDateEnd)
      );
    }

    setFilteredArtists(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateAge = (birthDate, deathDate) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const death = deathDate ? new Date(deathDate) : new Date();
    
    let age = death.getFullYear() - birth.getFullYear();
    const monthDiff = death.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleClearFilters = () => {
    setNameSearch('');
    setIdSearch('');
    setSelectedNationality('All');
    setBirthDateStart('');
    setBirthDateEnd('');
    setDeathDateStart('');
    setDeathDateEnd('');
  };

  const exportToCsv = () => {
    const headers = [
      "ID",
      "Name",
      "Nationality",
      "Birth Date",
      "Death Date",
      "Age"
    ];
    
    const rows = filteredArtists.map(artist => [
      artist.artist_id,
      artist.artist_name,
      artist.nationality,
      artist.birth_date || 'N/A',
      artist.death_date || 'N/A',
      calculateAge(artist.birth_date, artist.death_date)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "artists_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading">Loading artist data...</div>;

  return (
    <div className="reports-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Artists Directory</h1>
        </div>

        <div className="report-controls-simplified">
          <div className="report-header-actions">
            <button
              className="button button-outline export-button"
              onClick={exportToCsv}
            >
              <Download size={16} />
              Export to CSV
            </button>
          </div>

          <div className="report-results">
            <div className="filters-container-horizontal">
              <div className="filter-row">
                {/* Name Search */}
                <div className="filter-item">
                  <input
                    id="name-search"
                    type="text"
                    placeholder="Artist Name"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="rounded-input"
                  />
                </div>

                {/* ID Search */}
                <div className="filter-item">
                  <input
                    id="id-search"
                    type="text"
                    placeholder="Artist ID"
                    value={idSearch}
                    onChange={(e) => setIdSearch(e.target.value)}
                    className="rounded-input"
                  />
                </div>

                {/* Nationality Filter */}
                <div className="filter-item">
                  <select
                    id="nationality-filter"
                    value={selectedNationality}
                    onChange={(e) => setSelectedNationality(e.target.value)}
                    className="rounded-input"
                  >
                    {nationalities.map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Birth Date Range */}
                <div className="filter-item date-range">
                  <label>Birth Date:</label>
                  <input
                    type="date"
                    placeholder="From"
                    value={birthDateStart}
                    onChange={(e) => setBirthDateStart(e.target.value)}
                    className="rounded-input date-input"
                  />
                  <span className="date-separator">to</span>
                  <input
                    type="date"
                    placeholder="To"
                    value={birthDateEnd}
                    onChange={(e) => setBirthDateEnd(e.target.value)}
                    className="rounded-input date-input"
                  />
                </div>

                {/* Death Date Range */}
                <div className="filter-item date-range">
                  <label>Death Date:</label>
                  <input
                    type="date"
                    placeholder="From"
                    value={deathDateStart}
                    onChange={(e) => setDeathDateStart(e.target.value)}
                    className="rounded-input date-input"
                  />
                  <span className="date-separator">to</span>
                  <input
                    type="date"
                    placeholder="To"
                    value={deathDateEnd}
                    onChange={(e) => setDeathDateEnd(e.target.value)}
                    className="rounded-input date-input"
                  />
                </div>

                {/* Clear Filters Button */}
                <div className="filter-item">
                  <button 
                    className="clear-filters rounded-button"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Birth Date</th>
                    <th>Death Date</th>
                    <th>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArtists.length > 0 ? (
                    filteredArtists.map((artist) => (
                      <tr key={artist.artist_id}>
                        <td>{artist.artist_id}</td>
                        <td>{artist.artist_name}</td>
                        <td>{artist.nationality || 'N/A'}</td>
                        <td>{formatDate(artist.birth_date)}</td>
                        <td>{formatDate(artist.death_date)}</td>
                        <td>{calculateAge(artist.birth_date, artist.death_date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-results">
                        No artists match the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}