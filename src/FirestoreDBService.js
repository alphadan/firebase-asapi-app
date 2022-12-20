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
  console.log("[createVendor]newDocument: ", newDocument);
  try {
    const docRef = addDoc(collection(db, folder), newDocument);
    return docRef;
  } catch (error) {
    console.log("[handleAddRecipe]error: ", error.message);
  }
};

const setDocument = async (folder, setid, newDocument) => {
  try {
    await setDoc(doc(db, folder, setid), newDocument);
    return;
  } catch (error) {
    console.error("[setDocument ]error: ", error.message);
    throw error;
  }
};

const updateReviewDocument = async (folder, setid, newDocument) => {
  console.log("[updateReviewDocument]:BEGIN");
  try {
    const docRef = query(
      collection(db, folder),
      where("reviewid", "==", setid)
    );
    console.log("[updateReviewDocument]:docRef", docRef.id);
    await setDoc(doc(db, folder, docRef.id), newDocument, { merge: true });
    return;
  } catch (error) {
    console.error("[setDocument ]error: ", error.message);
    throw error;
  }
};

const readDocuments = async (
  folder,
  queries,
  orderByField,
  orderByDirection
) => {
  try {
    let querySnapshot = {};
    const collectionRef = collection(db, folder);
    let q = {};

    if (queries && queries.length > 0) {
      for (const holder of queries) {
        q = query(
          collectionRef,
          where(holder.field, holder.condition, holder.value),
          orderBy(orderByField, orderByDirection)
        );
      }
    } else {
      q = query(collectionRef, orderBy(orderByField, orderByDirection));
    }

    querySnapshot = await getDocs(q);

    return querySnapshot;
  } catch (error) {
    console.log("[readDocuments]error: ", error.message);
  }
};

const handleFetchData = async (folder, orderByDirection) => {
  console.log("[handleFetchData]:BEGIN");
  console.log("[handleFetchData]:BEGIN folder: ", folder);
  console.log("[handleFetchData]:orderByDirection", orderByDirection);
  const collectionRef = collection(db, folder);
  let querySnapshot = {};
  console.log("[handleFetchData]:colRef", collectionRef);
  const items = [];

  let orderByField;

  if (folder) {
    switch (folder) {
      case "vendors":
        orderByField = "vendorname";
        break;
      case "reviewstats":
        orderByField = "reviewstatsid";
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
        break;
    }
  }

  console.log("[handleFetchData]:orderByField", orderByField);
  console.log("[handleFetchData]:orderByDirection", orderByDirection);

  const q = query(
    collectionRef,
    orderBy(orderByField, orderByDirection),
    limit(perPage)
  );

  console.log("[handleFetchData]:q", q);

  querySnapshot = await getDocs(q);

  querySnapshot.forEach(function (doc) {
    items.push({ key: doc.id, ...doc.data() });
  });
  console.log("first item ", items[0]);
  return items;
};

const showPrevious = async (folder, item, orderByDirection) => {
  console.log("[showPrevious]:item: ", item);
  const collectionRef = collection(db, folder);
  let querySnapshot = {};
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
        break;
    }
  }

  const docRef = doc(collectionRef, item.key);
  console.log("[showPrevious]:docRef", docRef);
  const docSnap = await getDoc(docRef);

  const q = query(
    collectionRef,
    orderBy(orderByField, orderByDirection),
    endBefore(docSnap),
    limitToLast(perPage)
  );

  querySnapshot = await getDocs(q);

  querySnapshot.forEach(function (doc) {
    items.push({ key: doc.id, ...doc.data() });
  });
  console.log("first item ", items[0]);
  return items;
};

const showNext = async (folder, item, orderByDirection) => {
  console.log("[showNext]:BEGIN: item", item);
  if (1 === 0) {
    alert("Thats all we have for now !");
  } else {
    const collectionRef = collection(db, folder);
    let querySnapshot = {};
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
          break;
      }
    }

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

    querySnapshot = await getDocs(q);

    querySnapshot.forEach(function (doc) {
      items.push({ key: doc.id, ...doc.data() });
    });
    console.log("first item ", items[0]);
    return items;
  }
};

const readCurrentItem = async (folder, queries) => {
  console.log("[readCurrentItem]folder: ", folder);
  console.log("[readCurrentItem]queries: ", queries);
  try {
    let querySnapshot = {};
    const collectionRef = collection(db, folder);
    console.log("[readCurrentItem]collectionRef: ", collectionRef);
    let q = {};

    if (queries && queries.length > 0) {
      for (const holder of queries) {
        q = query(
          collectionRef,
          where(holder.field, holder.condition, holder.value)
        );
      }
    }

    console.log("[readCurrentItem]q: ", q);
    querySnapshot = await getDocs(q);
    console.log("[readCurrentItem]querySnapshot: ", querySnapshot);
    return querySnapshot;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const updateDocument = async (folder, id, newDocument) => {
  try {
    const docRef = await setDoc(collection(db, folder, id), newDocument);
    return docRef;
  } catch (error) {
    console.log("[updateDocument]error: ", error.message);
  }
};

const deleteDocument = async (folder, deleteid) => {
  try {
    await deleteDoc(doc(db, folder, deleteid));
    return;
  } catch (error) {
    console.log("[updateDocument]error: ", error.message);
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
};

export default FirestoreDBService;
