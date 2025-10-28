// src/hooks/useCollection.js
import { useState, useEffect } from "react";
import FirestoreDBService from "../FirestoreDBService.js";
import { COLLECTIONS } from "../utils/constants.js";

const perPage = 8;

export const useCollection = (folder) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderByDirection, setOrderByDirection] = useState("asc");
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [canPaginate, setCanPaginate] = useState(true);

  // ------------------------------------------------------------------
  // INITIAL FETCH + CURSOR SETUP
  // ------------------------------------------------------------------
  const fetchInitial = async () => {
    if (!folder) return;

    setLoading(true);
    setError(null);

    try {
      const result = await FirestoreDBService.handleFetchData(folder, orderByDirection);

      // AFTER FIRST FETCH – SET CURSORS
      setData(result.items);
      setLastVisible(result.lastVisible);
      setFirstVisible(result.firstVisible);
      setCanPaginate(result.items.length === perPage);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitial();
  }, [folder, orderByDirection]);

  // ------------------------------------------------------------------
  // NEXT PAGE
  // ------------------------------------------------------------------
  const next = async () => {
    if (!lastVisible || loading) return;

    setLoading(true);
    try {
      const result = await FirestoreDBService.showNext(
        folder,
        lastVisible,
        orderByDirection
      );

      setData(result.items);
      setLastVisible(result.lastVisible);
      setFirstVisible(result.firstVisible);
      setCanPaginate(result.items.length === perPage);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // PREVIOUS PAGE
  // ------------------------------------------------------------------
  const prev = async () => {
    if (!firstVisible || loading) return;

    setLoading(true);
    try {
      const result = await FirestoreDBService.showPrevious(
        folder,
        firstVisible,
        orderByDirection
      );

      setData(result.items);
      setLastVisible(result.lastVisible);
      setFirstVisible(result.firstVisible);
      setCanPaginate(true); // Always allow next after going back
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // REFETCH (for add/delete/sync)
  // ------------------------------------------------------------------
  const refetch = async () => {
    await fetchInitial();
  };

  return {
    data,
    loading,
    error,
    orderByDirection,
    setOrderByDirection,
    next,
    prev,
    canPaginate,
    refetch,
  };
};