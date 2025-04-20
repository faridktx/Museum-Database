import React, { useState, useEffect } from "react";
import {
  Users,
  Tag,
  Bookmark,
  Clock,
  Filter,
  Search,
  Plus,
  BarChart,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import "../../components/components.css";
import "./curator.css";
import { useUser } from "@clerk/clerk-react";
import {
  ACQUISITIONTYPES,
  ARTMOVEMENTS,
  NATIONALITIES,
  CONDITIONS,
} from "../../components/constants.js";

const ART_MOVEMENT_COLORS = [
  "#8da0cb", // muted blue
  "#fc8d62", // soft orange
  "#66c2a5", // desaturated teal
  "#a6d854", // soft green
  "#ffd92f", // soft yellow
  "#e78ac3", // soft pink
  "#e5c494", // tan
  "#b3b3b3", // grey
  "#a1c9f4", // pastel blue
  "#c6dbef", // pale blue-grey
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: true,
      text: "Artifact Count by Year and Art Movement",
      padding: {
        top: 10,
        bottom: 20,
      },
    },
  },
  scales: {
    x: {
      stacked: false,
      title: {
        display: true,
        text: "Acquisition Year",
      },
    },
    y: {
      stacked: false,
      title: {
        display: true,
        text: "Number of Artifacts",
      },
    },
  },
};

const valueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: true,
      text: "Total Artifact Value by Year and Art Movement ($)",
      padding: {
        top: 10,
        bottom: 20,
      },
    },
  },
  scales: {
    x: {
      stacked: false,
      title: {
        display: true,
        text: "Acquisition Year",
      },
    },
    y: {
      stacked: false,
      title: {
        display: true,
        text: "Total Value ($)",
      },
      ticks: {
        callback: function (value) {
          return "$" + Number(value).toLocaleString();
        },
      },
    },
  },
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const prepareChartData = (artifacts) => {
  const yearList = artifacts.map((a) =>
    new Date(a.acquisitionDate).getFullYear(),
  );
  const minYear = Math.min(...yearList);
  const maxYear = Math.max(...yearList);
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  const movements = [...new Set(artifacts.map((a) => a.movement))];
  const datasets = movements.map((mov, index) => {
    const data = years.map(
      (year) =>
        artifacts.filter(
          (a) =>
            new Date(a.acquisitionDate).getFullYear() === year &&
            a.movement === mov,
        ).length,
    );

    return {
      label: mov,
      data,
      backgroundColor: hexToRgba(ART_MOVEMENT_COLORS[index], 0.7),
      borderColor: hexToRgba(ART_MOVEMENT_COLORS[index], 1),
      borderWidth: 1,
    };
  });

  return { labels: years, datasets };
};

const prepareValueChartData = (artifacts) => {
  const yearList = artifacts.map((a) =>
    new Date(a.acquisitionDate).getFullYear(),
  );
  const minYear = Math.min(...yearList);
  const maxYear = Math.max(...yearList);
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  const movements = [...new Set(artifacts.map((a) => a.movement))];
  const datasets = movements.map((mov, index) => {
    const data = years.map((year) =>
      artifacts
        .filter(
          (a) =>
            new Date(a.acquisitionDate).getFullYear() === year &&
            a.movement === mov,
        )
        .reduce((sum, a) => sum + (a.acquisitionValue || 0), 0),
    );

    return {
      label: mov,
      data,
      backgroundColor: hexToRgba(ART_MOVEMENT_COLORS[index], 0.7),
      borderColor: hexToRgba(ART_MOVEMENT_COLORS[index], 1),
      borderWidth: 1,
    };
  });

  return { labels: years, datasets };
};

export function getConditionClass(condition) {
  switch (condition) {
    case "Excellent":
      return "condition-excellent";
    case "Good":
      return "condition-good";
    case "Fair":
      return "condition-fair";
    case "Poor":
      return "condition-poor";
    case "Critical":
      return "condition-critical";
    default:
      return "";
  }
}

export function CuratorDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [exhibitsMap, setExhibitsMap] = useState([]);

  // Keep track of artists being deleted (for animation)
  const [deletingArtists, setDeletingArtists] = useState([]);

  // Keep track of artifacts being deleted (for animation)
  const [deletingArtifacts, setDeletingArtifacts] = useState([]);

  // State for artist being edited
  const [editingArtist, setEditingArtist] = useState(null);

  // State for artifact being edited
  const [editingArtifact, setEditingArtifact] = useState(null);

  // State for storing form data when editing
  const [editFormData, setEditFormData] = useState({});

  // State for showing new artist form
  const [showNewArtistForm, setShowNewArtistForm] = useState(false);

  useEffect(() => {
    const getCuratorInfo = async () => {
      const url = new URL(
        "/api/getcurator/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setCuratorData(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCuratorInfo();
  }, []);

  useEffect(() => {
    const getExhibitsMap = async () => {
      const url = new URL(
        "/api/getexhibitsmap/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setExhibitsMap(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getExhibitsMap();
  }, []);

  useEffect(() => {
    const getArtists = async () => {
      const url = new URL(
        "/api/getartists/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setArtists(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getArtists();
  }, []);

  useEffect(() => {
    const getArtifacts = async () => {
      const url = new URL(
        "/api/getartifacts/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setArtifacts(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getArtifacts();
  }, []);

  // State for new artist form data
  const [newArtistData, setNewArtistData] = useState({
    name: "",
    birthYear: "",
    deathYear: "",
    nationality: "",
    movement: "",
    notableWorks: "",
    biography: "",
  });

  // State for showing new artifact form
  const [showNewArtifactForm, setShowNewArtifactForm] = useState(false);

  // State for new artifact form data
  const [newArtifactData, setNewArtifactData] = useState({
    title: "",
    artistId: "",
    exhibitId: "",
    createdYear: "",
    medium: "",
    description: "",
    dimensions: "",
    condition: "",
    acquisitionType: "",
    acquisitionValue: "",
    acquisitionDate: "",
    needsRestoration: false,
  });

  // Separate search queries for each tab
  const [searchQueries, setSearchQueries] = useState({
    artists: "",
    artifacts: "",
    restoration: "",
  });

  // Function to update search query for current tab
  const updateSearchQuery = (value) => {
    setSearchQueries((prev) => ({
      ...prev,
      [activeTab]: value,
    }));
  };

  // Current search query based on active tab
  const currentSearchQuery = searchQueries[activeTab] || "";

  const [filters, setFilters] = useState({
    artists: {
      name: "",
      nationality: "",
      movement: "",
      notableWorks: "",
    },
    artifacts: {
      title: "",
      artist: "",
      year: "",
      medium: "",
      exhibitName: "",
      condition: "",
    },
  });

  // Function to check if an artist has any artifacts in the collection
  const artistHasArtifacts = (artistId) => {
    return artifacts.some((artifact) => artifact.artistId === artistId);
  };

  // Function to filter items based on search query and advanced filters
  const filterItems = (items, type) => {
    let filteredItems = [...items];

    // Apply search query filter first
    const tabSearchQuery = searchQueries[type] || "";
    if (tabSearchQuery.trim()) {
      const query = tabSearchQuery.toLowerCase().trim();

      if (type === "artists") {
        filteredItems = filteredItems.filter(
          (artist) =>
            artist.name.toLowerCase().includes(query) ||
            artist.nationality.toLowerCase().includes(query) ||
            artist.movement.toLowerCase().includes(query) ||
            artist.notableWorks.toLowerCase().includes(query),
        );
      } else if (type === "artifacts") {
        filteredItems = filteredItems.filter((artifact) => {
          const artistName = artifact?.name || "";
          return (
            artifact.title.toLowerCase().includes(query) ||
            artistName.toLowerCase().includes(query) ||
            artifact.medium.toLowerCase().includes(query) ||
            artifact.exhibitName.toLowerCase().includes(query) ||
            artifact.condition.toLowerCase().includes(query)
          );
        });
      }
    }

    // Then apply advanced filters
    if (type === "artists") {
      const { name, nationality, movement } = filters.artists;

      if (name) {
        filteredItems = filteredItems.filter((artist) =>
          artist.name.toLowerCase().includes(name.toLowerCase()),
        );
      }

      if (nationality) {
        filteredItems = filteredItems.filter((artist) =>
          artist.nationality.toLowerCase().includes(nationality.toLowerCase()),
        );
      }

      if (movement) {
        filteredItems = filteredItems.filter((artist) =>
          artist.movement.toLowerCase().includes(movement.toLowerCase()),
        );
      }
    } else if (type === "artifacts") {
      const { title, artist, year, medium, exhibitName, condition } =
        filters.artifacts;

      if (title) {
        filteredItems = filteredItems.filter((artifact) =>
          artifact.title.toLowerCase().includes(title.toLowerCase()),
        );
      }

      if (artist) {
        filteredItems = filteredItems.filter((artifact) => {
          const artistName = artifact?.name || "";
          return artistName.toLowerCase().includes(artist.toLowerCase());
        });
      }

      if (year) {
        filteredItems = filteredItems.filter((artifact) =>
          artifact.year.toString().includes(year),
        );
      }

      if (medium) {
        filteredItems = filteredItems.filter((artifact) =>
          artifact.medium.toLowerCase().includes(medium.toLowerCase()),
        );
      }

      if (exhibitName) {
        filteredItems = filteredItems.filter((artifact) =>
          artifact.exhibitName
            .toLowerCase()
            .includes(exhibitName.toLowerCase()),
        );
      }

      if (condition) {
        filteredItems = filteredItems.filter((artifact) =>
          artifact.condition.toLowerCase().includes(condition.toLowerCase()),
        );
      }
    }

    return filteredItems;
  };
  const [showSettings, setShowSettings] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
  });

  const [curatorData, setCuratorData] = useState({
    employeeId: "",
    name: "",
    title: "",
    email: "",
    phone: "",
    joinDate: "",
  });

  const [artists, setArtists] = useState([]);
  const [artifacts, setArtifacts] = useState([]);

  // Function to handle editing an artist
  const handleEditArtist = (artist) => {
    // Set the current artist as the one being edited
    setEditingArtist(artist.id);

    // Initialize the form data with current artist values
    setEditFormData({
      name: artist.name,
      birthYear: artist.birthYear,
      deathYear: artist.deathYear,
      nationality: artist.nationality,
      movement: artist.movement,
      notableWorks: artist.notableWorks,
    });
  };

  // Function to save edited artist data
  const handleSaveArtist = async () => {
    // Update the artists array with edited data
    setArtists(
      artists.map((artist) =>
        artist.id === editingArtist ? { ...artist, ...editFormData } : artist,
      ),
    );

    const url = new URL("/api/setartist/", process.env.REACT_APP_BACKEND_URL);
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, id: editingArtist }),
      });
    } catch (err) {
      console.log(err);
    }

    // Exit edit mode
    setEditingArtist(null);
    setEditFormData({});
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingArtist(null);
    setEditFormData({});
  };

  // Handle form field changes when editing artist
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Function to handle deleting an artist
  const handleDeleteArtist = async (artistId) => {
    if (window.confirm("Are you sure you want to delete this artist?")) {
      // Add this artist to the deleting list (for animation)
      setDeletingArtists([...deletingArtists, artistId]);

      // Wait for animation to complete before removing from the array
      setTimeout(() => {
        setArtists(artists.filter((artist) => artist.id !== artistId));
        setDeletingArtists(deletingArtists.filter((id) => id !== artistId));
      }, 300);

      const url = new URL(
        "/api/deleteartist/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artistId: artistId }),
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Function to handle editing an artifact
  const handleEditArtifact = (artifact) => {
    // Set the current artifact as the one being edited
    setEditingArtifact(artifact.id);

    // Initialize the form data with current artifact values
    setEditFormData({
      title: artifact.title,
      artistId: artifact.artistId,
      exhibitId: artifact.exhibitId,
      year: artifact.year,
      medium: artifact.medium,
      condition: artifact.condition,
    });
  };

  // Function to save edited artifact data
  const handleSaveArtifact = async () => {
    // Update the artifacts array with edited data
    setArtifacts(
      artifacts.map((artifact) =>
        artifact.id === editingArtifact
          ? { ...artifact, ...editFormData }
          : artifact,
      ),
    );

    const url = new URL("/api/setartifact/", process.env.REACT_APP_BACKEND_URL);
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, id: editingArtifact }),
      });
    } catch (err) {
      console.log(err);
    }

    // Exit edit mode
    setEditingArtifact(null);
    setEditFormData({});
  };

  // Function to cancel editing artifact
  const handleCancelArtifactEdit = () => {
    setEditingArtifact(null);
    setEditFormData({});
  };

  // Function to handle deleting an artifact
  const handleDeleteArtifact = async (artifactId) => {
    if (window.confirm("Are you sure you want to delete this artifact?")) {
      // Add this artifact to the deleting list (for animation)
      setDeletingArtifacts([...deletingArtifacts, artifactId]);

      // Wait for animation to complete before removing from the array
      setTimeout(() => {
        setArtifacts(
          artifacts.filter((artifact) => artifact.id !== artifactId),
        );
        setDeletingArtifacts(
          deletingArtifacts.filter((id) => id !== artifactId),
        );
      }, 300); // Match the CSS transition time
      const url = new URL(
        "/api/deleteartifact/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artifactId: artifactId }),
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Function to handle toggling restoration status
  const handleToggleRestoration = async (artifactId) => {
    const targetArtifact = artifacts.find(
      (artifact) => artifact.id === artifactId,
    );

    // If not found, optionally handle the error or return early
    if (targetArtifact && !targetArtifact.needsRestoration) {
      const url = new URL(
        "/api/addrestored/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: targetArtifact.id,
            employeeId: curatorData.employeeId,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    } else if (targetArtifact && targetArtifact.needsRestoration) {
      const url = new URL(
        "/api/setrestored/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: targetArtifact.id,
            employeeId: curatorData.employeeId,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    }

    setArtifacts(
      artifacts.map((artifact) =>
        artifact.id === artifactId
          ? { ...artifact, needsRestoration: !artifact.needsRestoration }
          : artifact,
      ),
    );
  };

  // Function to handle saving settings changes
  const handleSaveSettings = async () => {
    setCuratorData(formData);
    setShowSettings(false);
    const url = new URL(
      "/api/setcuratorinfo/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employeeId: curatorData.employeeId,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Initialize form data when settings panel is opened
  useEffect(() => {
    if (showSettings) {
      setFormData({
        name: curatorData.name,
        title: curatorData.title,
        email: curatorData.email,
        phone: curatorData.phone,
      });
    }
  }, [showSettings, curatorData]);

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle new artist form field changes
  const handleNewArtistChange = (e) => {
    const { name, value } = e.target;
    setNewArtistData({
      ...newArtistData,
      [name]: value,
    });
  };

  // Function to save a new artist
  const handleSaveNewArtist = async () => {
    const url = new URL("/api/addartist/", process.env.REACT_APP_BACKEND_URL);
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtistData),
      });
    } catch (err) {
      console.log(err);
    }

    // Add to the artists array
    setArtists([...artists, newArtistData]);

    // Reset form and hide it
    setNewArtistData({
      name: "",
      birthYear: "",
      deathYear: "",
      nationality: "",
      movement: "",
      notableWorks: "",
      biography: "",
    });
    setShowNewArtistForm(false);
  };

  // Function to cancel adding a new artist
  const handleCancelNewArtist = () => {
    setShowNewArtistForm(false);
    setNewArtistData({
      name: "",
      birthYear: "",
      deathYear: "",
      nationality: "",
      movement: "",
      notableWorks: "",
      biography: "",
    });
  };

  // Handle new artifact form field changes
  const handleNewArtifactChange = (e) => {
    let additionalChange = {};
    const { name, value, type, checked } = e.target;
    if (name === "artistId") {
      const artistName = artists.find(
        (artist) => parseInt(artist.id) === parseInt(value),
      );
      additionalChange = { artist: artistName?.name || "" };
    } else if (name === "exhibitId") {
      const exhibitName = exhibitsMap.find(
        (exhibit) => parseInt(exhibit.id) === parseInt(value),
      );
      additionalChange = { exhibitName: exhibitName?.name || "" };
    }

    setNewArtifactData({
      ...newArtifactData,
      [name]: type === "checkbox" ? checked : value,
      ...additionalChange,
    });
  };

  // Function to save a new artifact
  const handleSaveNewArtifact = async () => {
    const url = new URL("/api/addartifact/", process.env.REACT_APP_BACKEND_URL);
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtifactData),
      });
    } catch (err) {
      console.log(err);
    }

    const movement =
      artists.find((a) => parseInt(a.id) === parseInt(newArtifactData.artistId))
        ?.movement || "";
    newArtifactData.movement = movement;
    // Add to the artifacts array
    setArtifacts([...artifacts, newArtifactData]);

    // Reset form and hide it
    setNewArtifactData({
      title: "",
      artistId: "",
      exhibitId: "",
      createdYear: "",
      medium: "",
      description: "",
      dimensions: "",
      condition: "",
      acquisitionType: "",
      acquisitionValue: "",
      acquisitionDate: "",
      needsRestoration: false,
    });
    setShowNewArtifactForm(false);
  };

  // Function to cancel adding a new artifact
  const handleCancelNewArtifact = () => {
    setShowNewArtifactForm(false);
    setNewArtifactData({
      title: "",
      artistId: "",
      exhibitId: "",
      createdYear: "",
      medium: "",
      description: "",
      dimensions: "",
      condition: "",
      acquisitionType: "",
      acquisitionValue: "",
      acquisitionDate: "",
      needsRestoration: false,
    });
  };

  return (
    <div className="curator-dashboard" style={{ marginBottom: "3rem" }}>
      <div className="dashboard-header">
        <div className="header-title">
          <h1>MuseoCore Curator Portal</h1>
        </div>

        <div className="horizontal-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setShowAdvancedFilter(false);
            }}
          >
            <Users size={16} />
            <span>Profile</span>
          </button>
          <button
            className={`tab-button ${activeTab === "artists" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("artists");
              setShowAdvancedFilter(false);
            }}
          >
            <Tag size={16} />
            <span>Artists</span>
          </button>
          <button
            className={`tab-button ${activeTab === "artifacts" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("artifacts");
              setShowAdvancedFilter(false);
            }}
          >
            <Bookmark size={16} />
            <span>Artifacts</span>
          </button>
          <button
            className={`tab-button ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("reports");
              setShowAdvancedFilter(false);
            }}
          >
            <BarChart size={16} />
            <span>Reports</span>
          </button>
          <button
            className={`tab-button ${activeTab === "restoration" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("restoration");
              setShowAdvancedFilter(false);
            }}
          >
            <Clock size={16} />
            <span>Restoration</span>
          </button>
        </div>

        {/* Only show search on artists, artifacts, and restoration tabs */}
        {activeTab === "artists" ||
        activeTab === "artifacts" ||
        activeTab === "restoration" ? (
          <div className="header-search">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder={
                  activeTab === "artists"
                    ? "Search artist names..."
                    : activeTab === "artifacts"
                      ? "Search artifact titles..."
                      : activeTab === "restoration"
                        ? "Search artifacts needing restoration..."
                        : "Search..."
                }
                value={currentSearchQuery}
                onChange={(e) => updateSearchQuery(e.target.value)}
              />
              {currentSearchQuery && (
                <button
                  className="search-clear-button"
                  onClick={() => updateSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className={`filter-button ${showAdvancedFilter ? "active" : ""}`}
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            >
              <Filter size={16} />
              <span>Advanced Filter</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Advanced Filter Panel - visible for selected tabs */}
      {showAdvancedFilter &&
        (activeTab === "artists" ||
          activeTab === "artifacts" ||
          activeTab === "restoration") && (
          <div
            className={`advanced-filter-panel ${showAdvancedFilter ? "open" : ""}`}
          >
            {activeTab === "artists" && (
              <>
                <div className="filter-row">
                  <div className="filter-item">
                    <label htmlFor="artist-name">Artist Name</label>
                    <input
                      type="text"
                      id="artist-name"
                      placeholder="Filter artists by name"
                      value={filters.artists.name}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artists: {
                            ...filters.artists,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="artist-nationality">Nationality</label>
                    <input
                      type="text"
                      id="artist-nationality"
                      placeholder="Filter artists by nationality"
                      value={filters.artists.nationality}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artists: {
                            ...filters.artists,
                            nationality: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="artist-movement">Movement</label>
                    <input
                      type="text"
                      id="artist-movement"
                      placeholder="Filter by movement"
                      value={filters.artists.movement}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artists: {
                            ...filters.artists,
                            movement: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="filter-actions">
                  <button
                    className="reset-filter-button"
                    onClick={() => {
                      setFilters({
                        ...filters,
                        artists: {
                          name: "",
                          nationality: "",
                          movement: "",
                          notableWorks: "",
                        },
                      });
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </>
            )}

            {(activeTab === "artifacts" || activeTab === "restoration") && (
              <>
                <div className="filter-row">
                  <div className="filter-item">
                    <label htmlFor="artifact-title">Title</label>
                    <input
                      type="text"
                      id="artifact-title"
                      placeholder="Filter artifacts by title"
                      value={filters.artifacts.title}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artifacts: {
                            ...filters.artifacts,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="artifact-artist">Artist</label>
                    <input
                      type="text"
                      id="artifact-artist"
                      placeholder="Filter artifacts by artist name"
                      value={filters.artifacts.artist}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artifacts: {
                            ...filters.artifacts,
                            artist: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="artifact-medium">Medium</label>
                    <input
                      type="text"
                      id="artifact-medium"
                      placeholder="Filter by medium"
                      value={filters.artifacts.medium}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artifacts: {
                            ...filters.artifacts,
                            medium: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="filter-row">
                  <div className="filter-item">
                    <label htmlFor="artifact-year">Year</label>
                    <input
                      type="text"
                      id="artifact-year"
                      placeholder="Filter by year"
                      value={filters.artifacts.year}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artifacts: {
                            ...filters.artifacts,
                            year: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="artifact-condition">Condition</label>
                    <input
                      type="text"
                      id="artifact-condition"
                      placeholder="Filter by condition"
                      value={filters.artifacts.condition}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artifacts: {
                            ...filters.artifacts,
                            condition: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="filter-actions">
                  <button
                    className="reset-filter-button"
                    onClick={() => {
                      setFilters({
                        ...filters,
                        artifacts: {
                          title: "",
                          artist: "",
                          year: "",
                          medium: "",
                          condition: "",
                        },
                      });
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      <div className="dashboard-content">
        <div className="main-content">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <div className="profile-summary-card">
                <div className="profile-info-container">
                  <div className="profile-avatar">
                    <div className="profile-initials">
                      {curatorData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div className="profile-summary-details">
                    <h2>{curatorData.name}</h2>
                    <p className="curator-title">{curatorData.title}</p>
                    <div className="curator-department">
                      <span>{curatorData.department}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-stats">
                  <div className="profile-stat-item">
                    <span className="stat-number">{artists.length}</span>
                    <span className="stat-label">Artists</span>
                  </div>
                  <div className="profile-stat-item">
                    <span className="stat-number">{artifacts.length}</span>
                    <span className="stat-label">Artifacts</span>
                  </div>
                  <div className="profile-stat-item">
                    <span className="stat-number">
                      {artifacts.filter((a) => a.needsRestoration).length}
                    </span>
                    <span className="stat-label">Need Restoration</span>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  <div
                    className="profile-actions"
                    style={{ textAlign: "left" }}
                  >
                    <button
                      className={`action-button ${showSettings ? "action-button-cancel" : ""}`}
                      onClick={() => {
                        setShowSettings(!showSettings);
                      }}
                    >
                      {showSettings ? (
                        <>
                          <X size={16} />
                          <span>Cancel</span>
                        </>
                      ) : (
                        <>
                          <SettingsIcon size={16} />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {showSettings ? (
                  <div className="settings-form">
                    <h3>Edit Profile Information</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveSettings();
                      }}
                    >
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-buttons">
                        <button
                          type="button"
                          className="button-cancel"
                          onClick={() => setShowSettings(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="button-save">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="curator-profile">
                    <div className="profile-details">
                      <div className="detail-section">
                        <h3>Department</h3>
                        <p>{curatorData.department}</p>
                      </div>
                      <div className="detail-section">
                        <h3>Specialization</h3>
                        <p>{curatorData.specialization}</p>
                      </div>
                      <div className="detail-section">
                        <h3>Join Date</h3>
                        <p>{curatorData.joinDate}</p>
                      </div>
                    </div>

                    <div className="profile-contact-info">
                      <h3>Contact Information</h3>
                      <p>
                        <strong>Email:</strong>{" "}
                        <span style={{ wordBreak: "break-word" }}>
                          {curatorData.email}
                        </span>
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        <span style={{ wordBreak: "break-word" }}>
                          {curatorData.phone}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Artists Tab */}
          {activeTab === "artists" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Artist Management</h2>
                <button
                  className={`action-button ${showNewArtistForm ? "action-button-cancel" : ""}`}
                  onClick={() => setShowNewArtistForm(!showNewArtistForm)}
                >
                  {showNewArtistForm ? (
                    <>
                      <X size={16} />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add New Artist</span>
                    </>
                  )}
                </button>
              </div>
              <p className="section-description">
                Manage the artists assigned to your curatorial department. Track
                biographical information, update details for artists under your
                purview, and monitor which artists need new acquisitions for the
                collection.
              </p>

              {/* New Artist Form */}
              {showNewArtistForm && (
                <div className="new-artist-form">
                  <h3>Add New Artist</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveNewArtist();
                    }}
                  >
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="new-name">
                          Artist Name
                        </label>
                        <input
                          type="text"
                          id="new-name"
                          name="name"
                          value={newArtistData.name}
                          onChange={handleNewArtistChange}
                          required
                        />
                      </div>

                      <div className="form-group years-group">
                        <label className="required" htmlFor="new-birthYear">
                          Birth Year
                        </label>
                        <input
                          type="number"
                          min="100"
                          step="1"
                          id="new-birthYear"
                          name="birthYear"
                          value={newArtistData.birthYear}
                          onChange={handleNewArtistChange}
                          required
                        />
                      </div>

                      <div className="form-group years-group">
                        <label htmlFor="new-deathYear">Death Year</label>
                        <input
                          type="number"
                          min="100"
                          step="1"
                          id="new-deathYear"
                          name="deathYear"
                          value={newArtistData.deathYear}
                          onChange={handleNewArtistChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="new-nationality">
                          Nationality
                        </label>
                        <select
                          id="new-nationality"
                          name="nationality"
                          value={newArtistData.nationality}
                          onChange={handleNewArtistChange}
                          required
                        >
                          <option disabled selected value="">
                            Select an artist
                          </option>
                          {NATIONALITIES.map((nationality, index) => (
                            <option key={index} value={nationality}>
                              {nationality}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="required" htmlFor="new-movement">
                          Movement/Style
                        </label>
                        <select
                          id="new-movement"
                          name="movement"
                          value={newArtistData.movement}
                          onChange={handleNewArtistChange}
                          required
                        >
                          <option disabled selected value="">
                            Select a movement
                          </option>
                          {ARTMOVEMENTS.map((movement, index) => (
                            <option key={index} value={movement}>
                              {movement}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="new-notableWorks">Notable Works</label>
                        <input
                          type="text"
                          id="new-notableWorks"
                          name="notableWorks"
                          value={newArtistData.notableWorks}
                          onChange={handleNewArtistChange}
                          placeholder="Separate works with semicolons"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="new-biography">Biography</label>
                      <textarea
                        id="new-biography"
                        name="biography"
                        value={newArtistData.biography}
                        onChange={handleNewArtistChange}
                        rows={3}
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={handleCancelNewArtist}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="button-primary">
                        Save Artist
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="legend-container">
                <div className="table-legend">
                  <span className="legend-item">
                    🚫 No artworks in collection
                  </span>
                </div>
              </div>

              <div className="data-table-container">
                <table className="data-table artists-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Years</th>
                      <th>Nationality</th>
                      <th>Movement</th>
                      <th>Notable Works</th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(artists, "artists").map((artist) => (
                      <>
                        <tr
                          key={`artist-row-${artist.id}`}
                          className={`
                            ${deletingArtists.includes(artist.id) ? "deleting" : ""}
                            ${editingArtist === artist.id ? "editing" : ""}
                          `}
                        >
                          {editingArtist === artist.id ? (
                            // Edit mode - show input fields
                            <>
                              <td>
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.name || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="years-edit">
                                <input
                                  type="number"
                                  min="100"
                                  step="1"
                                  name="birthYear"
                                  value={editFormData.birthYear || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Birth Year"
                                />
                                <span>–</span>
                                <input
                                  type="number"
                                  min="100"
                                  step="1"
                                  name="deathYear"
                                  value={editFormData.deathYear || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Death Year (or blank)"
                                />
                              </td>
                              <td>
                                <select
                                  name="nationality"
                                  value={editFormData.nationality || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {NATIONALITIES.map((nationality, index) => (
                                    <option key={index} value={nationality}>
                                      {nationality}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <select
                                  name="movement"
                                  value={editFormData.movement || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {ARTMOVEMENTS.map((movement, index) => (
                                    <option key={index} value={movement}>
                                      {movement}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="notableWorks"
                                  value={editFormData.notableWorks || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="button-small button-success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveArtist();
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  className="button-small button-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit();
                                  }}
                                >
                                  Cancel
                                </button>
                              </td>
                            </>
                          ) : (
                            // View mode - display data
                            <>
                              <td>
                                {artist.name}
                                {!artistHasArtifacts(artist.id) && (
                                  <span className="no-artifacts-flag"> 🚫</span>
                                )}
                              </td>
                              <td className="artist-years">
                                {artist.birthYear} –{" "}
                                {artist.deathYear || "Present"}
                              </td>
                              <td>{artist.nationality}</td>
                              <td>
                                <span className="artist-movement">
                                  {artist.movement}
                                </span>
                              </td>
                              <td>{artist.notableWorks}</td>
                              <td className="action-buttons">
                                <button
                                  className="button-small button-edit"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row selection
                                    handleEditArtist(artist);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="button-small button-danger"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row selection
                                    handleDeleteArtist(artist.id);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detail view is now inline in the table */}
            </div>
          )}

          {/* Artifacts Tab */}
          {activeTab === "artifacts" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Artifact Management</h2>
                <button
                  className={`action-button ${showNewArtifactForm ? "action-button-cancel" : ""}`}
                  onClick={() => setShowNewArtifactForm(!showNewArtifactForm)}
                >
                  {showNewArtifactForm ? (
                    <>
                      <X size={16} />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add New Artifact</span>
                    </>
                  )}
                </button>
              </div>
              <p className="section-description">
                Manage the artworks under your curatorial responsibility.
                Monitor the items in your department's collection, document new
                acquisitions, and maintain accurate condition records for each
                piece.
              </p>

              {/* New Artifact Form */}
              {showNewArtifactForm && (
                <div className="new-artist-form">
                  <h3>Add New Artifact</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveNewArtifact();
                    }}
                  >
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="new-title">
                          Artifact Title
                        </label>
                        <input
                          type="text"
                          id="new-title"
                          name="title"
                          value={newArtifactData.title}
                          onChange={handleNewArtifactChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="required" htmlFor="new-artistId">
                          Artist
                        </label>
                        <select
                          id="new-artistId"
                          name="artistId"
                          value={newArtifactData.artistId}
                          onChange={handleNewArtifactChange}
                          required
                        >
                          <option disabled selected value="">
                            Select an artist
                          </option>
                          {artists.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                              {`${artist.name} (ID ${artist.id})`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="required" htmlFor="new-exhibitId">
                          Exhibit
                        </label>
                        <select
                          id="new-exhibitId"
                          name="exhibitId"
                          value={newArtifactData.exhibitId}
                          onChange={handleNewArtifactChange}
                          required
                        >
                          <option disabled selected value="">
                            Select an exhibit
                          </option>
                          {exhibitsMap.map((exhibit) => (
                            <option key={exhibit.id} value={exhibit.id}>
                              {exhibit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="new-createdYear">Created Year</label>
                        <input
                          type="number"
                          min="100"
                          step="1"
                          id="new-createdYear"
                          name="createdYear"
                          value={newArtifactData.createdYear}
                          onChange={handleNewArtifactChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new-medium">Medium</label>
                        <input
                          type="text"
                          id="new-medium"
                          name="medium"
                          value={newArtifactData.medium}
                          onChange={handleNewArtifactChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new-dimensions">Dimensions</label>
                        <input
                          type="text"
                          id="new-dimensions"
                          name="dimensions"
                          value={newArtifactData.dimensions}
                          onChange={handleNewArtifactChange}
                          placeholder="e.g. 36 × 30 in"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label
                          className="required"
                          htmlFor="new-acquisitionType"
                        >
                          Acquisition Type
                        </label>
                        <select
                          id="new-acquisitionType"
                          name="acquisitionType"
                          value={newArtifactData.acquisitionType}
                          onChange={handleNewArtifactChange}
                          required
                        >
                          <option disabled selected value="">
                            Select an acquisition type
                          </option>
                          {ACQUISITIONTYPES.map((acqType, index) => (
                            <option key={index} value={acqType}>
                              {acqType}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label
                          className="required"
                          htmlFor="new-acquisitionValue"
                        >
                          Acquisition Value
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          id="new-acquisitionValue"
                          name="acquisitionValue"
                          value={newArtifactData.acquisitionValue}
                          onChange={handleNewArtifactChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label
                          className="required"
                          htmlFor="new-acquisitionDate"
                        >
                          Acquisition Date
                        </label>
                        <input
                          type="date"
                          id="new-acquisitionDate"
                          name="acquisitionDate"
                          value={newArtifactData.acquisitionDate}
                          onChange={handleNewArtifactChange}
                          placeholder="e.g. January 15, 2023"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="new-condition">
                          Condition
                        </label>
                        <select
                          id="new-condition"
                          name="condition"
                          value={newArtifactData.condition}
                          onChange={handleNewArtifactChange}
                          required
                        >
                          <option disabled selected value="">
                            Select a condition
                          </option>
                          {CONDITIONS.map((condition, index) => (
                            <option key={index} value={condition}>
                              {condition}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group"></div>
                      <div className="form-group"></div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="new-description">Description</label>
                      <textarea
                        id="new-description"
                        name="description"
                        value={newArtifactData.description}
                        onChange={handleNewArtifactChange}
                        rows={3}
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={handleCancelNewArtifact}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="button-primary">
                        Save Artifact
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Warning for artifacts in poor condition but not flagged for restoration */}
              {filterItems(artifacts, "artifacts").filter(
                (a) =>
                  (a.condition === "Poor" || a.condition === "Critical") &&
                  !a.needsRestoration,
              ).length > 0 && (
                <div className="condition-warning-banner">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-text">
                    Warning:{" "}
                    {
                      filterItems(artifacts, "artifacts").filter(
                        (a) =>
                          (a.condition === "Poor" ||
                            a.condition === "Critical") &&
                          !a.needsRestoration,
                      ).length
                    }{" "}
                    artifact(s) in poor or critical condition are not flagged
                    for restoration
                  </span>
                </div>
              )}

              <div className="legend-container">
                <div className="table-legend">
                  <span className="legend-item">❗ Under Restoration</span>
                </div>
              </div>
              <div className="data-table-container">
                <table className="data-table artifacts-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Year</th>
                      <th>Medium</th>
                      <th>Exhibit Name</th>
                      <th>Condition</th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(artifacts, "artifacts").map((artifact) => (
                      <>
                        <tr
                          key={`artifact-row-${artifact.id}`}
                          className={`
                            ${deletingArtifacts.includes(artifact.id) ? "deleting" : ""}
                            ${editingArtifact === artifact.id ? "editing" : ""}
                          `}
                        >
                          {editingArtifact === artifact.id ? (
                            // Edit mode - show input fields
                            <>
                              <td>
                                <input
                                  type="text"
                                  name="title"
                                  value={editFormData.title}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                />
                              </td>
                              <td>
                                <select
                                  name="artistId"
                                  value={editFormData.artistId}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                >
                                  {artists.map((artist) => (
                                    <option key={artist.id} value={artist.id}>
                                      {artist.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="100"
                                  step="1"
                                  name="year"
                                  value={editFormData.year || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="medium"
                                  value={editFormData.medium || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <select
                                  name="exhibitId"
                                  value={editFormData.exhibitId}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                >
                                  {exhibitsMap.map((exhibit) => (
                                    <option key={exhibit.id} value={exhibit.id}>
                                      {exhibit.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <select
                                  name="condition"
                                  value={editFormData.condition}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                >
                                  <option disabled selected value="">
                                    Select a condition
                                  </option>
                                  {CONDITIONS.map((condition, index) => (
                                    <option key={index} value={condition}>
                                      {condition}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="button-small button-success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveArtifact();
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  className="button-small button-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelArtifactEdit();
                                  }}
                                >
                                  Cancel
                                </button>
                              </td>
                            </>
                          ) : (
                            // View mode - display data
                            <>
                              <td>
                                {artifact.needsRestoration
                                  ? `${artifact.title}❗`
                                  : artifact.title}
                              </td>
                              <td>{artifact.artist || "Unknown"}</td>
                              <td>{artifact.year}</td>
                              <td>{artifact.medium}</td>
                              <td>{artifact.exhibitName}</td>
                              <td>
                                <span
                                  className={`condition-badge ${getConditionClass(artifact.condition)}`}
                                >
                                  {artifact.condition}
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="button-small button-edit"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row selection
                                    handleEditArtifact(artifact);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="button-small button-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row selection
                                    handleToggleRestoration(artifact.id);
                                  }}
                                >
                                  {artifact.needsRestoration
                                    ? "Mark Restored"
                                    : "Needs Restoration"}
                                </button>
                                <button
                                  className="button-small button-danger"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row selection
                                    handleDeleteArtifact(artifact.id);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detail view is now inline in the table */}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Curation Reports</h2>
              </div>
              <p className="section-description">
                Review analytics for your curatorial area. Generate reports on
                acquisitions under your management, track collection growth
                metrics, and analyze key performance indicators for your
                assigned section.
              </p>

              <div
                className="report-card exhibit-performance"
                style={{ margin: "0 auto", height: "400px" }}
              >
                <Bar
                  data={prepareChartData(artifacts)}
                  options={chartOptions}
                />
              </div>
              <br></br>
              <div
                className="report-card employee-performance"
                style={{ margin: "0 auto", height: "400px" }}
              >
                <Bar
                  data={prepareValueChartData(artifacts)}
                  options={valueChartOptions}
                />
              </div>

              <div className="data-table-container">
                <table className="data-table artifacts-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Year</th>
                      <th>Medium</th>
                      <th>Exhibit Name</th>
                      <th>Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(artifacts, "artifacts").map((artifact) => (
                      <>
                        <tr key={`artifact-row-${artifact.id}`}>
                          {
                            // View mode - display data
                            <>
                              <td>
                                {artifact.needsRestoration
                                  ? `${artifact.title}❗`
                                  : artifact.title}
                              </td>
                              <td>{artifact.artist || "Unknown"}</td>
                              <td>{artifact.year}</td>
                              <td>{artifact.medium}</td>
                              <td>{artifact.exhibitName}</td>
                              <td>
                                <span
                                  className={`condition-badge ${getConditionClass(artifact.condition)}`}
                                >
                                  {artifact.condition}
                                </span>
                              </td>
                            </>
                          }
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Restoration Tab */}
          {activeTab === "restoration" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Artifacts Needing Restoration</h2>
              </div>
              <p className="section-description">
                Prioritize and coordinate restoration work for artifacts in your
                section. Flag items that need conservation treatment, track
                ongoing restoration projects, and manage the conservation
                workflow for your assigned pieces.
              </p>
              <div className="data-table-container">
                <table className="data-table artifacts-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Year</th>
                      <th>Medium</th>
                      <th>Current Exhibit</th>
                      <th>Condition</th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(artifacts, "artifacts")
                      .filter((artifact) => artifact.needsRestoration)
                      .map((artifact) => (
                        <>
                          <tr
                            key={`restoration-row-${artifact.id}`}
                            className={`
                              ${deletingArtifacts.includes(artifact.id) ? "deleting" : ""}
                              ${editingArtifact === artifact.id ? "editing" : ""}
                            `}
                          >
                            {editingArtifact === artifact.id ? (
                              // Edit mode - show input fields
                              <>
                                <td>{artifact.title}</td>
                                <td>{artifact?.artist || "Unknown"}</td>
                                <td>{artifact.year}</td>
                                <td>{artifact.medium}</td>
                                <td>{artifact.exhibitName}</td>
                                <td>
                                  <select
                                    id="new-condition"
                                    name="condition"
                                    value={editFormData.condition || ""}
                                    onChange={handleEditFormChange}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {CONDITIONS.map((condition, index) => (
                                      <option key={index} value={condition}>
                                        {condition}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="action-buttons">
                                  <button
                                    className="button-small button-success"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSaveArtifact();
                                    }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="button-small button-secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelArtifactEdit();
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </td>
                              </>
                            ) : (
                              // View mode - display data
                              <>
                                <td>
                                  {artifact.title}{" "}
                                  <span className="restoration-flag">❗</span>
                                </td>
                                <td>{artifact.artist || "Unknown"}</td>
                                <td>{artifact.year}</td>
                                <td>{artifact.medium}</td>
                                <td>{artifact.exhibitName}</td>
                                <td>
                                  <span
                                    className={`condition-badge ${getConditionClass(artifact.condition)}`}
                                  >
                                    {artifact.condition}
                                  </span>
                                </td>
                                <td className="action-buttons">
                                  <button
                                    className="button-small button-edit"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row selection
                                      handleEditArtifact(artifact);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="button-small button-secondary"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row selection
                                      handleToggleRestoration(artifact.id);
                                    }}
                                  >
                                    Mark as Restored
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        </>
                      ))}
                  </tbody>
                </table>

                {filterItems(artifacts, "artifacts").filter(
                  (a) => a.needsRestoration,
                ).length === 0 && (
                  <div className="empty-state">
                    <p>
                      No artifacts currently need restoration
                      {searchQueries.restoration.trim()
                        ? " matching your search"
                        : ""}
                      .
                    </p>
                  </div>
                )}
              </div>

              {/* Detail view is now inline in the table */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
