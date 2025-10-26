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
} from "firebase/firestore";
import { app } from "./FirebaseConfig.js";

const db = getFirestore(app);
console.log("[FirebaseDBService]db: ", db);
const perPage = 8;

const createNewDocument = async (folder, newDocument) => {
  console.log("[createNewDocument]:newDocument: ", newDocument);
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
  console.log("[updateReviewDocument]:BEGIN folder =", folder, "setid =", setid);
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

const readDocuments = async (folder, queries, orderByField, orderByDirection) => {
  try {
    let querySnapshot;
    const collectionRef = collection(db, folder);
    let q;

    if (queries && queries.length > 0) {
      q = query(
        collectionRef,
        ...queries.map((holder) => where(holder.field, holder.condition, holder.value)),
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

const handleFetchData = async (folder, orderByDirection) => {
  console.log("[handleFetchData]:BEGIN folder: ", folder);
  console.log("[handleFetchData]:orderByDirection", orderByDirection);
  const collectionRef = collection(db, folder);
  console.log("[handleFetchData]:colRef", collectionRef);
  const items = [];

  let orderByField;
  if (folder) {
    switch (folder) {
      case "vendors":
        orderByField = "vendorname";
        break;
      case "reviewstats":
        orderByField = null;
        break;
      case "shipoverride":
        orderByField = "productcode";
        break;
      case "reviews":
        orderByField = "reviewid";
        break;
      case "blogcategories":
        orderByField = "blogid";
        break;
      case "blogposts":
        orderByField = "postid";
        break;
      case "newscategories":
        orderByField = "newsindex";
        break;
      case "newsposts":
        orderByField = "newsid";
        break;
      default:
        orderByField = null;
        break;
    }
  }

  try {
    let q;
    if (orderByField && orderByDirection) {
      q = query(collectionRef, orderBy(orderByField, orderByDirection), limit(perPage));
    } else {
      q = query(collectionRef);
    }

    console.log("[handleFetchData]:q", q);
    const querySnapshot = await getDocs(q);
    console.log("[handleFetchData]:querySnapshot.size", querySnapshot.size);
    console.log("[handleFetchData]:querySnapshot.empty", querySnapshot.empty);

    querySnapshot.forEach((doc) => {
      items.push({ key: doc.id, ...doc.data() });
    });

    console.log("[handleFetchData]:items", items);
    return items;
  } catch (error) {
    console.error("[handleFetchData]:error", error.message, error.code);
    throw error;
  }
};

const testFetchReviewStats = async () => {
  try {
    const docRef = doc(db, "reviewstats", "1");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("[testFetchReviewStats]:data", { key: docSnap.id, ...docSnap.data() });
    } else {
      console.log("[testFetchReviewStats]:no document found");
    }
  } catch (error) {
    console.error("[testFetchReviewStats]:error", error.message, error.code);
  }
};

const showPrevious = async (folder, item, orderByDirection) => {
  console.log("[showPrevious]:item: ", item);
  const collectionRef = collection(db, folder);
  console.log("[showPrevious]:colRef", collectionRef);
  const items = [];

  let orderByField;
  if (folder) {
    switch (folder) {
      case "vendors":
        orderByField = "vendorname";
        break;
      case "reviews":
        orderByField = "reviewid";
        break;
      case "shipoverride":
        orderByField = "productcode";
        break;
      case "blogcategories":
        orderByField = "blogid";
        break;
      case "blogposts":
        orderByField = "postid";
        break;
      case "newscategories":
        orderByField = "newsindex";
        break;
      case "newsposts":
        orderByField = "newsid";
        break;
      default:
        orderByField = null;
        break;
    }
  }

  try {
    const docRef = doc(collectionRef, item.key);
    console.log("[showPrevious]:docRef", docRef);
    const docSnap = await getDoc(docRef);

    const q = query(
      collectionRef,
      orderBy(orderByField, orderByDirection),
      endBefore(docSnap),
      limitToLast(perPage)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      items.push({ key: doc.id, ...doc.data() });
    });
    console.log("[showPrevious]:items", items);
    return items;
  } catch (error) {
    console.error("[showPrevious]:error", error.message, error.code);
    throw error;
  }
};

const showNext = async (folder, item, orderByDirection) => {
  console.log("[showNext]:BEGIN: item", item);
  const collectionRef = collection(db, folder);
  console.log("[showNext]:colRef", collectionRef);
  const items = [];

  let orderByField;
  if (folder) {
    switch (folder) {
      case "vendors":
        orderByField = "vendorname";
        break;
      case "reviews":
        orderByField = "reviewid";
        break;
      case "shipoverride":
        orderByField = "productcode";
        break;
      case "blogcategories":
        orderByField = "blogid";
        break;
      case "blogposts":
        orderByField = "postid";
        break;
      case "newscategories":
        orderByField = "newsindex";
        break;
      case "newsposts":
        orderByField = "newsid";
        break;
      default:
        orderByField = null;
        break;
    }
  }

  try {
    const docRef = doc(collectionRef, item.key);
    console.log("[showNext]:docRef", docRef);
    const docSnap = await getDoc(docRef);

    const q = query(
      collectionRef,
      orderBy(orderByField, orderByDirection),
      startAfter(docSnap),
      limit(perPage)
    );

    console.log("[showNext]:q", q);
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      items.push({ key: doc.id, ...doc.data() });
    });
    console.log("[showNext]:items", items);
    return items;
  } catch (error) {
    console.error("[showNext]:error", error.message, error.code);
    throw error;
  }
};

const readCurrentItem = async (folder, queries) => {
  console.log("[readCurrentItem]folder: ", folder);
  console.log("[readCurrentItem]queries: ", queries);
  try {
    const collectionRef = collection(db, folder);
    let q;

    if (queries && queries.length > 0) {
      q = query(
        collectionRef,
        ...queries.map((holder) => where(holder.field, holder.condition, holder.value))
      );
    } else {
      q = query(collectionRef);
    }

    console.log("[readCurrentItem]q: ", q);
    const querySnapshot = await getDocs(q);
    console.log("[readCurrentItem]querySnapshot: ", querySnapshot);
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

const deleteDocument = async (folder, deleteid) => {
  try {
    await deleteDoc(doc(db, folder, deleteid));
  } catch (error) {
    console.error("[deleteDocument]:error", error.message, error.code);
    throw error;
  }
};

const FirestoreDBService = {
  createNewDocument,
  setDocument,
  readDocuments,
  updateDocument,
  updateReviewDocument,
  deleteDocument,
  readCurrentItem,
  handleFetchData,
  showPrevious,
  showNext,
  testFetchReviewStats,
};

export default FirestoreDBService;