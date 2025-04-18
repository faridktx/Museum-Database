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
  Lock,
} from "lucide-react";
import { CollectionGrowthCharts } from "../charts/curator-growth";
import "../../components/components.css";
import "./curator.css";

export function CuratorDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

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
    year: "",
    medium: "",
    dimensions: "",
    location: "",
    condition: "Good",
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
      location: "",
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
          const artistName =
            artists.find((a) => a.id === artifact.artistId)?.name || "";
          return (
            artifact.title.toLowerCase().includes(query) ||
            artistName.toLowerCase().includes(query) ||
            artifact.medium.toLowerCase().includes(query) ||
            artifact.location.toLowerCase().includes(query) ||
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
      const { title, artist, year, medium, location, condition } =
        filters.artifacts;

      if (title) {
        filteredItems = filteredItems.filter((artifact) =>
          artifact.title.toLowerCase().includes(title.toLowerCase()),
        );
      }

      if (artist) {
        filteredItems = filteredItems.filter((artifact) => {
          const artistName =
            artists.find((a) => a.id === artifact.artistId)?.name || "";
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

      if (location) {
        filteredItems = filteredItems.filter((artifact) =>
          artifact.location.toLowerCase().includes(location.toLowerCase()),
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
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    department: "",
    specialization: "",
    bio: "",
  });

  const [curatorData, setCuratorData] = useState({
    name: "Dr. Eleanor Mitchell",
    title: "Senior Curator, Modern Art",
    email: "eleanor.mitchell@museocore.org",
    phone: "(555) 123-4567",
    department: "Modern & Contemporary Art",
    specialization: "Post-War Abstract Expressionism",
    joinDate: "June 15, 2018",
    bio: "Dr. Mitchell holds a Ph.D. in Art History from Columbia University. She has organized over 20 major exhibitions and published extensively on mid-century abstract art. Before joining MuseoCore, she served as Assistant Curator at the Whitney Museum of American Art.",
  });

  const [artists, setArtists] = useState([
    {
      id: 1,
      name: "Jackson Pollock",
      birthYear: 1912,
      deathYear: 1956,
      nationality: "American",
      movement: "Abstract Expressionism",
      notableWorks: "No. 5, 1948; Autumn Rhythm; Blue Poles",
      biography:
        "Paul Jackson Pollock was an influential American painter and a major figure in the abstract expressionist movement. Known for his unique style of drip painting.",
    },
    {
      id: 2,
      name: "Georgia O'Keeffe",
      birthYear: 1887,
      deathYear: 1986,
      nationality: "American",
      movement: "American Modernism",
      notableWorks: "Black Iris, Cow's Skull: Red, White, and Blue",
      biography:
        "Georgia O'Keeffe was an American artist known for her paintings of enlarged flowers, New York skyscrapers, and New Mexico landscapes.",
    },
    {
      id: 3,
      name: "Frida Kahlo",
      birthYear: 1907,
      deathYear: 1954,
      nationality: "Mexican",
      movement: "Surrealism",
      notableWorks:
        "The Two Fridas, Self-Portrait with Thorn Necklace and Hummingbird",
      biography:
        "Frida Kahlo was a Mexican painter known for her many portraits, self-portraits, and works inspired by nature and artifacts of Mexico.",
    },
    {
      id: 4,
      name: "Gustav Klimt",
      birthYear: 1862,
      deathYear: 1918,
      nationality: "Austrian",
      movement: "Art Nouveau",
      notableWorks:
        "The Kiss, Portrait of Adele Bloch-Bauer I, The Tree of Life",
      biography:
        "Gustav Klimt was an Austrian symbolist painter and one of the most prominent members of the Vienna Secession movement. His primary subject was the female body.",
    },
    {
      id: 5,
      name: "Anonymous",
      birthYear: -550,
      deathYear: -500,
      nationality: "Ancient Greek",
      movement: "Greek Black-Figure Pottery",
      notableWorks: "Various amphoras and vases from Athens region",
      biography:
        "An anonymous master potter and painter from ancient Athens known for distinctive black-figure pottery depicting mythological scenes and everyday life.",
    },
    {
      id: 6,
      name: "Sandro Botticelli",
      birthYear: 1445,
      deathYear: 1510,
      nationality: "Italian",
      movement: "Early Renaissance",
      notableWorks: "The Birth of Venus; Primavera; Madonna of the Book",
      biography:
        "Alessandro di Mariano di Vanni Filipepi, known as Sandro Botticelli, was an Italian painter of the Early Renaissance particularly known for his mythological masterpieces.",
    },
  ]);

  const [artifacts, setArtifacts] = useState([
    {
      id: 101,
      title: "Convergence",
      artistId: 1,
      year: 1952,
      medium: "Oil on canvas",
      dimensions: "93.5 × 155 in",
      location: "Gallery A, Section 3",
      acquisitionDate: "March 12, 2010",
      condition: "Good",
      needsRestoration: false,
    },
    {
      id: 102,
      title: "Red Canna",
      artistId: 2,
      year: 1924,
      medium: "Oil on canvas",
      dimensions: "36 × 30 in",
      location: "Gallery B, Section 1",
      acquisitionDate: "November 5, 2005",
      condition: "Excellent",
      needsRestoration: false,
    },
    {
      id: 103,
      title: "The Broken Column",
      artistId: 3,
      year: 1944,
      medium: "Oil on canvas",
      dimensions: "15.7 × 12.6 in",
      location: "Conservation Lab",
      acquisitionDate: "June 23, 2015",
      condition: "Poor",
      needsRestoration: true,
    },
    {
      id: 104,
      title: "Autumn Rhythm",
      artistId: 1,
      year: 1950,
      medium: "Enamel on canvas",
      dimensions: "105 × 207 in",
      location: "Storage Vault B",
      acquisitionDate: "September 30, 2012",
      condition: "Fair",
      needsRestoration: true,
    },
    {
      id: 105,
      title: "Ancient Greek Amphora",
      artistId: 5,
      year: -520, // 520 BCE
      medium: "Terracotta with black-figure decoration",
      dimensions: "45 cm × 25 cm",
      location: "Gallery D, Ancient Collection",
      acquisitionDate: "October 5, 2022",
      condition: "Poor",
      needsRestoration: false,
    },
    {
      id: 106,
      title: "Madonna and Child",
      artistId: 6,
      year: 1495,
      medium: "Tempera on panel",
      dimensions: "67 cm × 51 cm",
      location: "Renaissance Hall, Section 1",
      acquisitionDate: "July 17, 2021",
      condition: "Critical",
      needsRestoration: false,
    },
  ]);

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
      biography: artist.biography,
    });

    console.log("Editing artist:", artist);
  };

  // Function to save edited artist data
  const handleSaveArtist = () => {
    // Update the artists array with edited data
    setArtists(
      artists.map((artist) =>
        artist.id === editingArtist ? { ...artist, ...editFormData } : artist,
      ),
    );

    // Exit edit mode
    setEditingArtist(null);
    setEditFormData({});

    console.log("Artist updated successfully");
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
  const handleDeleteArtist = (artistId) => {
    if (window.confirm("Are you sure you want to delete this artist?")) {
      // Add this artist to the deleting list (for animation)
      setDeletingArtists([...deletingArtists, artistId]);

      // If the deleted artist was selected, clear the selection
      if (selectedArtist && selectedArtist.id === artistId) {
        setSelectedArtist(null);
      }

      // Wait for animation to complete before removing from the array
      setTimeout(() => {
        setArtists(artists.filter((artist) => artist.id !== artistId));
        setDeletingArtists(deletingArtists.filter((id) => id !== artistId));

        // Show a temporary success message (could be implemented with a toast)
        console.log("Artist successfully deleted");
      }, 300); // Match the CSS transition time
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
      year: artifact.year,
      medium: artifact.medium,
      dimensions: artifact.dimensions,
      location: artifact.location,
      acquisitionDate: artifact.acquisitionDate,
      condition: artifact.condition,
      needsRestoration: artifact.needsRestoration,
    });

    console.log("Editing artifact:", artifact);
  };

  // Function to save edited artifact data
  const handleSaveArtifact = () => {
    // Update the artifacts array with edited data
    setArtifacts(
      artifacts.map((artifact) =>
        artifact.id === editingArtifact
          ? { ...artifact, ...editFormData }
          : artifact,
      ),
    );

    // Exit edit mode
    setEditingArtifact(null);
    setEditFormData({});

    console.log("Artifact updated successfully");
  };

  // Function to cancel editing artifact
  const handleCancelArtifactEdit = () => {
    setEditingArtifact(null);
    setEditFormData({});
  };

  // Function to handle deleting an artifact
  const handleDeleteArtifact = (artifactId) => {
    if (window.confirm("Are you sure you want to delete this artifact?")) {
      // Add this artifact to the deleting list (for animation)
      setDeletingArtifacts([...deletingArtifacts, artifactId]);

      // If the deleted artifact was selected, clear the selection
      if (selectedArtifact && selectedArtifact.id === artifactId) {
        setSelectedArtifact(null);
      }

      // Wait for animation to complete before removing from the array
      setTimeout(() => {
        setArtifacts(
          artifacts.filter((artifact) => artifact.id !== artifactId),
        );
        setDeletingArtifacts(
          deletingArtifacts.filter((id) => id !== artifactId),
        );

        // Show a temporary success message (could be implemented with a toast)
        console.log("Artifact successfully deleted");
      }, 300); // Match the CSS transition time
    }
  };

  // Function to handle toggling restoration status
  const handleToggleRestoration = (artifactId) => {
    setArtifacts(
      artifacts.map((artifact) =>
        artifact.id === artifactId
          ? { ...artifact, needsRestoration: !artifact.needsRestoration }
          : artifact,
      ),
    );
  };

  // Function to handle saving settings changes
  const handleSaveSettings = () => {
    setCuratorData({
      ...curatorData,
      ...formData,
    });
    setShowSettings(false);
  };

  // Handle password form field changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Function to submit password change
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    // Validate password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Simulate checking current password (in a real app, this would verify against stored password)
    if (passwordData.currentPassword !== "currentpassword") {
      setPasswordError("Current password is incorrect");
      return;
    }

    // Password validation (minimum requirements)
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    // Simulate successful password change
    console.log("Password updated successfully");
    setPasswordSuccess(true);

    // Reset form after short delay
    setTimeout(() => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setPasswordSuccess(false);
    }, 2000);
  };

  // Initialize form data when settings panel is opened
  useEffect(() => {
    if (showSettings) {
      setFormData({
        name: curatorData.name,
        title: curatorData.title,
        email: curatorData.email,
        phone: curatorData.phone,
        department: curatorData.department,
        specialization: curatorData.specialization,
        bio: curatorData.bio,
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
  const handleSaveNewArtist = () => {
    // Create a new artist object with a unique ID
    const maxId = Math.max(...artists.map((artist) => artist.id), 0);
    const newArtist = {
      id: maxId + 1,
      ...newArtistData,
    };

    // Add to the artists array
    setArtists([...artists, newArtist]);

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

    console.log("New artist added successfully");
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
    const { name, value, type, checked } = e.target;
    setNewArtifactData({
      ...newArtifactData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to save a new artifact
  const handleSaveNewArtifact = () => {
    // Create a new artifact object with a unique ID and set needsRestoration to false
    const maxId = Math.max(...artifacts.map((artifact) => artifact.id), 0);
    const newArtifact = {
      id: maxId + 1,
      ...newArtifactData,
      needsRestoration: false, // Always set to false for new artifacts
    };

    // Add to the artifacts array
    setArtifacts([...artifacts, newArtifact]);

    // Reset form and hide it
    setNewArtifactData({
      title: "",
      artistId: "",
      year: "",
      medium: "",
      dimensions: "",
      location: "",
      condition: "Good",
      acquisitionDate: "",
      needsRestoration: false,
    });
    setShowNewArtifactForm(false);

    console.log("New artifact added successfully");
  };

  // Function to cancel adding a new artifact
  const handleCancelNewArtifact = () => {
    setShowNewArtifactForm(false);
    setNewArtifactData({
      title: "",
      artistId: "",
      year: "",
      medium: "",
      dimensions: "",
      location: "",
      condition: "Good",
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
                    <label htmlFor="artifact-location">Location</label>
                    <input
                      type="text"
                      id="artifact-location"
                      placeholder="Filter by location"
                      value={filters.artifacts.location}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          artifacts: {
                            ...filters.artifacts,
                            location: e.target.value,
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
                          location: "",
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
                      className={`action-button ${showPasswordForm ? "action-button-cancel" : ""}`}
                      onClick={() => {
                        setShowPasswordForm(!showPasswordForm);
                        if (showSettings) setShowSettings(false);
                        setPasswordError("");
                        setPasswordSuccess(false);
                      }}
                    >
                      {showPasswordForm ? (
                        <>
                          <X size={16} />
                          <span>Cancel</span>
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          <span>Change Password</span>
                        </>
                      )}
                    </button>
                    <button
                      className={`action-button ${showSettings ? "action-button-cancel" : ""}`}
                      onClick={() => {
                        setShowSettings(!showSettings);
                        if (showPasswordForm) setShowPasswordForm(false);
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

                {showPasswordForm ? (
                  <div className="settings-form password-form">
                    <h3>Change Password</h3>
                    {passwordSuccess && (
                      <div className="form-success-message">
                        Password changed successfully!
                      </div>
                    )}
                    {passwordError && (
                      <div className="form-error-message">{passwordError}</div>
                    )}
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="form-group">
                        <label htmlFor="currentPassword">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                            setPasswordError("");
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="save-button">
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                ) : null}

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
                        <label htmlFor="new-name">Artist Name</label>
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
                        <label htmlFor="new-birthYear">Birth Year</label>
                        <input
                          type="number"
                          id="new-birthYear"
                          name="birthYear"
                          value={newArtistData.birthYear}
                          onChange={handleNewArtistChange}
                        />
                      </div>

                      <div className="form-group years-group">
                        <label htmlFor="new-deathYear">Death Year</label>
                        <input
                          type="number"
                          id="new-deathYear"
                          name="deathYear"
                          value={newArtistData.deathYear}
                          onChange={handleNewArtistChange}
                          placeholder="Leave empty if alive"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="new-nationality">Nationality</label>
                        <input
                          type="text"
                          id="new-nationality"
                          name="nationality"
                          value={newArtistData.nationality}
                          onChange={handleNewArtistChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new-movement">Movement/Style</label>
                        <input
                          type="text"
                          id="new-movement"
                          name="movement"
                          value={newArtistData.movement}
                          onChange={handleNewArtistChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="new-notableWorks">Notable Works</label>
                      <input
                        type="text"
                        id="new-notableWorks"
                        name="notableWorks"
                        value={newArtistData.notableWorks}
                        onChange={handleNewArtistChange}
                        placeholder="Separate multiple works with semicolons"
                      />
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
                            ${selectedArtist?.id === artist.id ? "selected" : ""}
                            ${deletingArtists.includes(artist.id) ? "deleting" : ""}
                            ${editingArtist === artist.id ? "editing" : ""}
                          `}
                          onClick={() => {
                            if (editingArtist !== artist.id) {
                              setSelectedArtist(
                                selectedArtist?.id === artist.id
                                  ? null
                                  : artist,
                              );
                            }
                          }}
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
                                  name="birthYear"
                                  value={editFormData.birthYear || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Birth Year"
                                />
                                <span>–</span>
                                <input
                                  type="number"
                                  name="deathYear"
                                  value={editFormData.deathYear || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Death Year (or blank)"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="nationality"
                                  value={editFormData.nationality || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="movement"
                                  value={editFormData.movement || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
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
                        {selectedArtist?.id === artist.id && (
                          <tr
                            key={`artist-detail-${artist.id}`}
                            className="detail-row"
                          >
                            <td colSpan="6">
                              <div className="inline-detail-view">
                                <h3>Selected Artist Details</h3>
                                <div className="detail-content">
                                  <h4>{selectedArtist.name}</h4>
                                  <p className="artist-years">
                                    {selectedArtist.birthYear} –{" "}
                                    {selectedArtist.deathYear || "Present"} •{" "}
                                    {selectedArtist.nationality}
                                  </p>
                                  <p>
                                    <span className="artist-movement">
                                      {selectedArtist.movement}
                                    </span>
                                  </p>
                                  <div className="artist-detail-section">
                                    <h5>Biography</h5>
                                    <p>{selectedArtist.biography}</p>
                                  </div>
                                  <div className="artist-detail-section">
                                    <h5>Notable Works</h5>
                                    <p>{selectedArtist.notableWorks}</p>
                                  </div>
                                  <div className="artist-detail-section">
                                    <h5>Works in Collection</h5>
                                    <ul>
                                      {artifacts
                                        .filter(
                                          (artifact) =>
                                            artifact.artistId ===
                                            selectedArtist.id,
                                        )
                                        .map((artifact) => (
                                          <li key={artifact.id}>
                                            {artifact.title} ({artifact.year}) -{" "}
                                            {artifact.medium}
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
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
                        <label htmlFor="new-title">Artifact Title</label>
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
                        <label htmlFor="new-artistId">Artist</label>
                        <select
                          id="new-artistId"
                          name="artistId"
                          value={newArtifactData.artistId}
                          onChange={handleNewArtifactChange}
                          required
                        >
                          <option value="">Select an artist</option>
                          {artists.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                              {artist.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="new-year">Creation Year</label>
                        <input
                          type="number"
                          id="new-year"
                          name="year"
                          value={newArtifactData.year}
                          onChange={handleNewArtifactChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="new-medium">Medium</label>
                        <input
                          type="text"
                          id="new-medium"
                          name="medium"
                          value={newArtifactData.medium}
                          onChange={handleNewArtifactChange}
                          required
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
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="new-location">Location</label>
                        <input
                          type="text"
                          id="new-location"
                          name="location"
                          value={newArtifactData.location}
                          onChange={handleNewArtifactChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new-acquisitionDate">
                          Acquisition Date
                        </label>
                        <input
                          type="text"
                          id="new-acquisitionDate"
                          name="acquisitionDate"
                          value={newArtifactData.acquisitionDate}
                          onChange={handleNewArtifactChange}
                          placeholder="e.g. January 15, 2023"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new-condition">Condition</label>
                        <select
                          id="new-condition"
                          name="condition"
                          value={newArtifactData.condition}
                          onChange={handleNewArtifactChange}
                          required
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
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
                      <th>Location</th>
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
                            ${selectedArtifact?.id === artifact.id ? "selected" : ""}
                            ${deletingArtifacts.includes(artifact.id) ? "deleting" : ""}
                            ${editingArtifact === artifact.id ? "editing" : ""}
                          `}
                          onClick={() => {
                            if (editingArtifact !== artifact.id) {
                              setSelectedArtifact(
                                selectedArtifact?.id === artifact.id
                                  ? null
                                  : artifact,
                              );
                            }
                          }}
                        >
                          {editingArtifact === artifact.id ? (
                            // Edit mode - show input fields
                            <>
                              <td>
                                <input
                                  type="text"
                                  name="title"
                                  value={editFormData.title || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <select
                                  name="artistId"
                                  value={editFormData.artistId || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
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
                                <input
                                  type="text"
                                  name="location"
                                  value={editFormData.location || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="condition"
                                  value={editFormData.condition || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
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
                                {artifact.needsRestoration && (
                                  <span className="restoration-flag">❗</span>
                                )}
                              </td>
                              <td>
                                {artists.find((a) => a.id === artifact.artistId)
                                  ?.name || "Unknown"}
                              </td>
                              <td>{artifact.year}</td>
                              <td>{artifact.medium}</td>
                              <td>{artifact.location}</td>
                              <td>
                                <span
                                  className={`condition-badge ${artifact.needsRestoration ? "needs-restoration" : ""}`}
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
                        {selectedArtifact?.id === artifact.id && (
                          <tr
                            key={`artifact-detail-${artifact.id}`}
                            className="detail-row"
                          >
                            <td colSpan="7">
                              <div className="inline-detail-view">
                                <h3>Selected Artifact Details</h3>
                                {selectedArtifact.needsRestoration && (
                                  <div className="restoration-status-banner">
                                    <span className="restoration-flag">❗</span>{" "}
                                    This artifact is currently undergoing
                                    restoration
                                  </div>
                                )}
                                <div className="detail-content">
                                  <h4>
                                    {selectedArtifact.title} (
                                    {selectedArtifact.year})
                                  </h4>
                                  <p>
                                    <strong>Artist:</strong>{" "}
                                    {artists.find(
                                      (a) => a.id === selectedArtifact.artistId,
                                    )?.name || "Unknown"}
                                  </p>
                                  <p>
                                    <strong>Medium:</strong>{" "}
                                    {selectedArtifact.medium}
                                  </p>
                                  <p>
                                    <strong>Dimensions:</strong>{" "}
                                    {selectedArtifact.dimensions}
                                  </p>
                                  <p>
                                    <strong>Location:</strong>{" "}
                                    {selectedArtifact.location}
                                  </p>
                                  <p>
                                    <strong>Acquisition Date:</strong>{" "}
                                    {selectedArtifact.acquisitionDate}
                                  </p>
                                  <p>
                                    <strong>Condition:</strong>{" "}
                                    <span
                                      className={
                                        selectedArtifact.needsRestoration
                                          ? "text-danger"
                                          : ""
                                      }
                                    >
                                      {selectedArtifact.condition}
                                    </span>
                                    {selectedArtifact.needsRestoration &&
                                      " (Needs Restoration)"}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
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

              <div className="reports-grid">
                <div className="report-card">
                  <h3>Acquisition Report</h3>
                  <p>
                    Summary of artifacts acquired in the current quarter and
                    their status.
                  </p>
                  <button className="action-button">
                    <span>View Report</span>
                  </button>
                </div>

                <div className="report-card">
                  <h3>Artist Analytics</h3>
                  <p>
                    Analysis of represented artists and their works in the
                    collection.
                  </p>
                  <button className="action-button">
                    <span>View Report</span>
                  </button>
                </div>

                <div className="report-card">
                  <h3>Collection Status</h3>
                  <p>
                    Overview of the entire collection by period, medium, and
                    conservation status.
                  </p>
                  <button className="action-button">
                    <span>View Report</span>
                  </button>
                </div>
              </div>

              <div className="report-charts">
                <CollectionGrowthCharts />
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
                      <th>Current Location</th>
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
                              ${selectedArtifact?.id === artifact.id ? "selected" : ""}
                              ${deletingArtifacts.includes(artifact.id) ? "deleting" : ""}
                              ${editingArtifact === artifact.id ? "editing" : ""}
                            `}
                            onClick={() => {
                              if (editingArtifact !== artifact.id) {
                                setSelectedArtifact(
                                  selectedArtifact?.id === artifact.id
                                    ? null
                                    : artifact,
                                );
                              }
                            }}
                          >
                            {editingArtifact === artifact.id ? (
                              // Edit mode - show input fields
                              <>
                                <td>
                                  <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title || ""}
                                    onChange={handleEditFormChange}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </td>
                                <td>
                                  <select
                                    name="artistId"
                                    value={editFormData.artistId || ""}
                                    onChange={handleEditFormChange}
                                    onClick={(e) => e.stopPropagation()}
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
                                  <input
                                    type="text"
                                    name="location"
                                    value={editFormData.location || ""}
                                    onChange={handleEditFormChange}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="condition"
                                    value={editFormData.condition || ""}
                                    onChange={handleEditFormChange}
                                    onClick={(e) => e.stopPropagation()}
                                  />
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
                                <td>
                                  {artists.find(
                                    (a) => a.id === artifact.artistId,
                                  )?.name || "Unknown"}
                                </td>
                                <td>{artifact.year}</td>
                                <td>{artifact.medium}</td>
                                <td>{artifact.location}</td>
                                <td>
                                  <span className="condition-badge needs-restoration">
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
                          {selectedArtifact?.id === artifact.id && (
                            <tr
                              key={`restoration-detail-${artifact.id}`}
                              className="detail-row"
                            >
                              <td colSpan="7">
                                <div className="inline-detail-view">
                                  <h3>Restoration Details</h3>
                                  <div className="restoration-status-banner">
                                    <span className="restoration-flag">❗</span>{" "}
                                    This artifact is currently undergoing
                                    restoration
                                  </div>
                                  <div className="detail-content">
                                    <h4>
                                      {selectedArtifact.title} (
                                      {selectedArtifact.year})
                                    </h4>
                                    <p>
                                      <strong>Artist:</strong>{" "}
                                      {artists.find(
                                        (a) =>
                                          a.id === selectedArtifact.artistId,
                                      )?.name || "Unknown"}
                                    </p>
                                    <p>
                                      <strong>Current Location:</strong>{" "}
                                      {selectedArtifact.location}
                                    </p>
                                    <p>
                                      <strong>Condition:</strong>{" "}
                                      <span className="text-danger">
                                        {selectedArtifact.condition}
                                      </span>
                                      {" (Needs Restoration)"}
                                    </p>
                                    <div className="artist-detail-section">
                                      <h5>Restoration Requirements</h5>
                                      <ul>
                                        <li>
                                          Assess physical condition of the
                                          artwork
                                        </li>
                                        <li>
                                          Document damage with high-resolution
                                          photos
                                        </li>
                                        <li>
                                          Formulate restoration plan with
                                          conservation team
                                        </li>
                                        <li>
                                          Prepare cost estimate and timeline
                                        </li>
                                        <li>
                                          Request approval from curatorial
                                          department
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="restoration-actions">
                                      <button
                                        className="button-small button-success"
                                        onClick={() =>
                                          handleToggleRestoration(
                                            selectedArtifact.id,
                                          )
                                        }
                                      >
                                        Mark as Restored
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
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
