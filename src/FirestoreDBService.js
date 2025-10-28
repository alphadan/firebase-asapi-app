import {
  getFirestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc,
  orderBy,
  endBefore,
  limit,
  limitToLast,
  startAfter,
  query,
  getDocs,
  where,
  writeBatch,
} from "firebase/firestore";
import { app } from "./FirebaseConfig.js";
import { COLLECTIONS } from "./utils/constants.js";

const db = getFirestore(app);
const perPage = 12;

// ------------------------------------------------------------------
// CREATE / UPDATE / DELETE (unchanged)
// ------------------------------------------------------------------
const createNewDocument = async (folder, newDocument) => {
  try {
    const docRef = await addDoc(collection(db, folder), newDocument);
    return docRef;
  } catch (error) {
    console.error("[createNewDocument]:error: ", error.message, error.code);
    throw error;
  }
};

const setDocument = async (folder, setid, newDocument) => {
  try {
    await setDoc(doc(db, folder, setid), newDocument);
  } catch (error) {
    console.error("[setDocument]:error: ", error.message, error.code);
    throw error;
  }
};

const updateReviewDocument = async (folder, setid, newDocument) => {
  console.log(
    "[updateReviewDocument]:BEGIN folder =",
    folder,
    "setid =",
    setid
  );
  try {
    if (folder === "reviews") {
      const q = query(collection(db, folder), where("reviewid", "==", setid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await setDoc(docRef, newDocument, { merge: true });
        console.log("[updateReviewDocument]:success");
      } else {
        throw new Error(`No document found with reviewid = ${setid}`);
      }
    } else {
      await setDoc(doc(db, folder, setid), newDocument, { merge: true });
      console.log("[updateReviewDocument]:success");
    }
  } catch (error) {
    console.error("[updateReviewDocument]:error", error.message, error.code);
    throw error;
  }
};

const deleteDocument = async (folder, deleteid) => {
  try {
    await deleteDoc(doc(db, folder, deleteid));
  } catch (error) {
    console.error("[deleteDocument]:error", error.message, error.code);
    throw error;
  }
};

// ------------------------------------------------------------------
// INITIAL FETCH
// ------------------------------------------------------------------
const handleFetchData = async (folder, orderByDirection = "asc") => {
  console.log("[handleFetchData]:BEGIN folder:", folder);
  const collectionRef = collection(db, folder);
  const items = [];

  const config = COLLECTIONS[folder] || {};
  const orderByField = config.orderBy || null;

  try {
    let q;
    if (orderByField) {
      q = query(
        collectionRef,
        orderBy(orderByField, orderByDirection),
        limit(perPage)
      );
    } else {
      q = query(collectionRef, limit(perPage));
    }

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      items.push({ key: doc.id, ...doc.data() });
    });

    const lastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    const firstVisible = querySnapshot.docs[0] || null;

    console.log("[handleFetchData]:SUCCESS", { count: items.length });
    return { items, lastVisible, firstVisible };
  } catch (error) {
    console.error("[handleFetchData]:error", error.message, error.code);
    throw error;
  }
};

// ------------------------------------------------------------------
// PAGINATION: NEXT
// ------------------------------------------------------------------
const showNext = async (folder, lastVisible, orderByDirection = "asc") => {
  console.log("[showNext]:BEGIN lastVisible:", lastVisible?.id);

  if (!lastVisible) {
    console.warn("[showNext]: No lastVisible – returning empty");
    return { items: [], lastVisible: null, firstVisible: null };
  }

  const collectionRef = collection(db, folder);
  const config = COLLECTIONS[folder] || {};
  const orderByField = config.orderBy || null;

  if (!orderByField) {
    console.warn(`[showNext] No orderBy for ${folder}`);
    return { items: [], lastVisible: null, firstVisible: null };
  }

  try {
    const q = query(
      collectionRef,
      orderBy(orderByField, orderByDirection),
      startAfter(lastVisible),
      limit(perPage)
    );

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      key: doc.id,
      ...doc.data(),
    }));

    const newLastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    const newFirstVisible = querySnapshot.docs[0] || null;

    console.log("[showNext]:SUCCESS", { count: items.length });
    return {
      items,
      lastVisible: newLastVisible,
      firstVisible: newFirstVisible,
    };
  } catch (error) {
    console.error("[showNext]:error", error.message, error.code);
    throw error;
  }
};

// ------------------------------------------------------------------
// PAGINATION: PREVIOUS
// ------------------------------------------------------------------
const showPrevious = async (folder, firstVisible, orderByDirection = "asc") => {
  console.log("[showPrevious]:BEGIN firstVisible:", firstVisible?.id);

  if (!firstVisible) {
    console.warn("[showPrevious]: No firstVisible – returning empty");
    return { items: [], lastVisible: null, firstVisible: null };
  }

  const collectionRef = collection(db, folder);
  const config = COLLECTIONS[folder] || {};
  const orderByField = config.orderBy || null;

  if (!orderByField) {
    console.warn(`[showPrevious] No orderBy for ${folder}`);
    return { items: [], lastVisible: null, firstVisible: null };
  }

  try {
    const q = query(
      collectionRef,
      orderBy(orderByField, orderByDirection),
      endBefore(firstVisible),
      limitToLast(perPage)
    );

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      key: doc.id,
      ...doc.data(),
    }));

    const newFirstVisible = querySnapshot.docs[0] || null;
    const newLastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    console.log("[showPrevious]:SUCCESS", { count: items.length });
    return {
      items,
      lastVisible: newLastVisible,
      firstVisible: newFirstVisible,
    };
  } catch (error) {
    console.error("[showPrevious]:error", error.message, error.code);
    throw error;
  }
};

// ------------------------------------------------------------------
// UPDATE RECENT REVIEWS
// ------------------------------------------------------------------

const updateRecentReviews = async () => {
  console.log("[updateRecentReviews]:BEGIN");

  try {
    // 1. Get last 10 reviews
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, orderBy("reviewindex", "desc"), limit(10));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("No reviews found to update recentreviews");
    }

    const latestReviews = snapshot.docs.map(doc => ({
      key: doc.id,
      ...doc.data(),
    }));

    // 2. Use writeBatch (Modular SDK)
    const batch = writeBatch(db);  // FIXED: was db.batch()

    // 3. Delete existing recentreviews
    const recentRef = collection(db, "recentreviews");
    const existingSnap = await getDocs(recentRef);
    existingSnap.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 4. Add new ones
    latestReviews.forEach((review, index) => {
      const newDocRef = doc(db, "recentreviews", `review_${index + 1}`);
      batch.set(newDocRef, review);
    });

    // 5. Commit
    await batch.commit();

    console.log("[updateRecentReviews]:SUCCESS – 10 records updated");
  } catch (error) {
    console.error("[updateRecentReviews]:ERROR", error);
    throw error;
  }
};

// ------------------------------------------------------------------
// OTHER METHODS (unchanged)
// ------------------------------------------------------------------
const readDocuments = async (
  folder,
  queries,
  orderByField,
  orderByDirection
) => {
  try {
    let querySnapshot;
    const collectionRef = collection(db, folder);
    let q;

    if (queries && queries.length > 0) {
      q = query(
        collectionRef,
        ...queries.map((holder) =>
          where(holder.field, holder.condition, holder.value)
        ),
        orderBy(orderByField, orderByDirection)
      );
    } else {
      q = query(collectionRef, orderBy(orderByField, orderByDirection));
    }

    querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (error) {
    console.error("[readDocuments]:error: ", error.message, error.code);
    throw error;
  }
};

const readCurrentItem = async (folder, queries) => {
  try {
    const collectionRef = collection(db, folder);
    let q;

    if (queries && queries.length > 0) {
      q = query(
        collectionRef,
        ...queries.map((holder) =>
          where(holder.field, holder.condition, holder.value)
        )
      );
    } else {
      q = query(collectionRef);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (error) {
    console.error("[readCurrentItem]:error", error.message, error.code);
    throw error;
  }
};

const updateDocument = async (folder, id, newDocument) => {
  try {
    await setDoc(doc(db, folder, id), newDocument);
  } catch (error) {
    console.error("[updateDocument]:error", error.message, error.code);
    throw error;
  }
};

const testFetchReviewStats = async () => {
  try {
    const docRef = doc(db, "reviewstats", "1");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("[testFetchReviewStats]:data", {
        key: docSnap.id,
        ...docSnap.data(),
      });
    } else {
      console.log("[testFetchReviewStats]:no document found");
    }
  } catch (error) {
    console.error("[testFetchReviewStats]:error", error.message, error.code);
  }
};

// ------------------------------------------------------------------
// EXPORT
// ------------------------------------------------------------------
const FirestoreDBService = {
  createNewDocument,
  setDocument,
  readDocuments,
  updateDocument,
  updateReviewDocument,
  deleteDocument,
  readCurrentItem,
  handleFetchData,
  showNext,
  showPrevious,
  testFetchReviewStats,
  updateRecentReviews,
};

export default FirestoreDBService;
