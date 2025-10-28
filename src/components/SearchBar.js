// src/components/SearchBar.js
import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({ data, onFiltered, placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter logic
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      onFiltered(data);
      return;
    }

    const lowerQuery = debouncedQuery.toLowerCase();
    const filtered = data.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        if (key === "key") return false;
        return String(value).toLowerCase().includes(lowerQuery);
      })
    );

    onFiltered(filtered);
  }, [debouncedQuery, data, onFiltered]);

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setQuery("")}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
