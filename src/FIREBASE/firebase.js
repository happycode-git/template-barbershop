// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { deleteDoc, getFirestore, limit, orderBy } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//

//
import { randomString } from "../Global";
//
import {
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  getDoc,
  where,
} from "firebase/firestore";
import { query, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import emailjs from "emailjs-com";
//
import { setBlogsState } from "../REDUX/SLICES/BlogsSlice";
import { setProductsState } from "../REDUX/SLICES/ProductsSlice";
import { setDashUserState } from "../REDUX/SLICES/DashboardUserSlice";
import { setPageViewsState } from "../REDUX/SLICES/PageViewsSlice";
import { setLoadingState } from "../REDUX/SLICES/LoadingSlice";
import { setContactEntriesState } from "../REDUX/SLICES/ContactEntriesSlice";
import { setEventTypesState } from "../REDUX/SLICES/EventTypesSlice";
import { setScheduledEventsState } from "../REDUX/SLICES/ScheduledEventsSlice";
import { setTimecardEntryState } from "../REDUX/SLICES/TimecardEntrySlice";
import { setEmployeesState } from "../REDUX/SLICES/EmployeesSlice";
import {
  c_businessDesc,
  c_businessName,
  emailjs_contact_templateID,
  emailjs_fromEmail,
  emailjs_myContact_templateID,
  emailjs_myQuotes_templateID,
  emailjs_mySchedule_templateID,
  emailjs_myShop_templateID,
  emailjs_publicKey,
  emailjs_quotes_templateID,
  emailjs_schedule_templateID,
  emailjs_serviceID,
  emailjs_shop_templateID,
  firebase_configObj,
} from "../Constants";
import { setEmployeeState } from "../REDUX/SLICES/EmployeeUserSlice";
import { setPunchesState } from "../REDUX/SLICES/PunchesSlice";
import { setTotalHoursState } from "../REDUX/SLICES/TotalHoursSlice";
import Stripe from "stripe";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = firebase_configObj;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Stripe
const {
  STRIPE_SECRET = "sk_test_51MajXbKx2glJRMlw9H0xIW3l5STyygi6EuK6oIR7FgO5AnM37cxV4Ve24akw4c4cefORoIzdc48ZoCEVo2cuA6sa00lLrKUEix",
  STRIPE_CALLBACK: CALLBACK = "http://localhost:3000/shop",
  STRIPE_CANCEL_CALLBACK: CANCEL_CHECKOUT = "http://localhost:3000/shop",
} = process.env;

const stripe = new Stripe(STRIPE_SECRET);

// FIRESTORE
// CONTACT
export const sendContactForm = async (args, params) => {
  await setDoc(doc(db, "ContactEntries", randomString(30)), {
    Name: args.Name,
    Email: args.Email,
    Reason: args.Reason,
    Message: args.Message,
    Date: args.Date,
  });

  emailjs
    .send(
      emailjs_serviceID,
      emailjs_contact_templateID,
      params,
      emailjs_publicKey
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );

  // THIS WILL BE SENT TO BUSINESS
  const myParams = {
    to_name: args.Name,
    to_email: emailjs_fromEmail,
    from_name: args.Name,
    from_email: args.Email,
    message: args.Message,
    reply_to: args.Email
  }

  emailjs.send(emailjs_serviceID, emailjs_myContact_templateID, myParams, emailjs_publicKey)
    .then(function (response) {
      console.log('SUCCESS!', response.status, response.text);
    }, function (error) {
      console.log('FAILED...', error);
    });
};
// QUOTE
export const sendQuoteForm = async (args, params, myParams) => {
  await setDoc(doc(db, "QuoteEntries", randomString(30)), {
    Service: args.Service,
    Name: args.Name,
    Email: args.Email,
    Additional: args.Additional,
  });

  emailjs
    .send(
      emailjs_serviceID,
      emailjs_quotes_templateID,
      params,
      emailjs_publicKey
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );

  // THIS WILL BE SENT TO BUSINESS
  // const myParams = {
  //     to_name: args.Name,
  //     to_email: args.Email,
  //     from_name: c_businessName,
  //     from_email: emailjs_fromEmail,
  //     message: args.Message,
  //     reply_to: emailjs_fromEmail
  // }

  emailjs.send(emailjs_serviceID, emailjs_myQuotes_templateID, myParams, emailjs_publicKey)
    .then(function (response) {
      console.log('SUCCESS!', response.status, response.text);
    }, function (error) {
      console.log('FAILED...', error);
    });
};
// BLOG
export const getBlogs = async (dispatch) => {
  const querySnapshot = await getDocs(collection(db, "Blogs"));
  var blogs = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    const d = doc.data();
    const blog = {
      id: doc.id,
      Date: d.Date,
      Title: d.Title,
      Desc: d.Desc,
      ImgPath: d.ImgPath,
      Author: d.Author,
      Tags: d.Tags,
    };
    blogs.push(blog);
  });
  dispatch(setBlogsState(blogs));
};
//
// STORE
// Create a function that pulls products from DB
// Create function that updates the quantity
const createOrder = async (date, orderID, subTotal, tax, total, email, fullName) => {
  // Email Customer

  await setDoc(doc(db, "Orders", orderID), {
    Date: new Date(),
    SubTotal: subTotal,
    Tax: tax,
    Total: total,
    Complete: false,
    FullName: fullName,
    Email: email
  });
};
const createOrderItems = async (orderID, cartItems) => {
  for (var i in cartItems) {
    const item = cartItems[i];
    await setDoc(doc(db, "Orders", orderID, "Items", randomString(10)), {
      Name: item.Name,
      Price: item.Price,
      Quantity: item.Quantity,
      Desc: item.Desc
    });
  }
};
const updateProductQuantity = async (cartItems, products) => {
  // REVIEW
  for (var i in cartItems) {
    const item = cartItems[i];
    const itemRef = doc(db, "Products", item.id);

    for (var j in products) {
      if (products[j].id == item.id) {
        await updateDoc(itemRef, {
          Quantity: products[j].Quantity - item.Quantity,
        });
      }
    }
  }
};
const resetProductQuantity = async (cartItems, products) => {
  // REVIEW
  for (var i in cartItems) {
    const item = cartItems[i];
    const itemRef = doc(db, "Products", item.id);

    for (var j in products) {
      if (products[j].id == item.id) {
        await updateDoc(itemRef, {
          Quantity: products[j].Quantity + item.Quantity,
        });
      }
    }
  }
};

const createCheckoutSession = async (
  orderID,
  subTotal,
  tax,
  total,
  cartItems,
  products
) => {
  let lineItems = [];
  cartItems.map((item) => {
    const lineItem = {
      price_data: {
        unit_amount: item.Price * 100,
        currency: "usd",
        product_data: {
          name: item.Name,
          description: item.Desc,
        },
        tax_behavior: "exclusive",
      },

      quantity: item.Quantity,
    };
    lineItems.push(lineItem);
    return lineItems;
  });

  console.log({ lineItems });

  try {
    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      // amount_subtotal: subTotal,
      // amount_total: total,
      // total_details: {
      //   amount_tax: tax,
      // },

      line_items: lineItems,
      payment_intent_data: { setup_future_usage: "off_session" },
      mode: "payment",
      success_url: `${CALLBACK}?s={CHECKOUT_SESSION_ID}&orderid=${orderID}`,
      cancel_url: `${CANCEL_CHECKOUT}`,
    });
    console.log(session);
    return { sessionId: session.id, orderID: orderID };
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const purchaseItems = async ({
  date,
  subTotal,
  tax,
  total,
  cartItems,
  products,
  setResponse,
}, orderID, email, fullName, params, myParams) => {
  createOrder(date, orderID, subTotal, tax, total, email, fullName)
    .then(() => {
      updateProductQuantity(cartItems, products);
    })
    .then(() => {
      createCheckoutSession(
        orderID,
        subTotal,
        tax,
        total,
        cartItems,
        products
      ).then((res) => {
        console.log(res);
        setResponse(res);
        createOrderItems(orderID, cartItems);
        // SEND EMAIL WITH ORDER ID!!!!!
        emailjs
          .send(
            emailjs_serviceID,
            emailjs_shop_templateID,
            params,
            emailjs_publicKey
          )
          .then(
            function (response) {
              console.log("SUCCESS!", response.status, response.text);
            },
            function (error) {
              console.log("FAILED...", error);
            }
          );
        emailjs
          .send(
            emailjs_serviceID,
            emailjs_myShop_templateID,
            myParams,
            emailjs_publicKey
          )
          .then(
            function (response) {
              console.log("SUCCESS!", response.status, response.text);
            },
            function (error) {
              console.log("FAILED...", error);
            }
          );

      });
    })
    .catch((error) => {
      // update the db/firebase with error response. Example: put an extra row to order as paid (true/false) and update it. release the bookings of the item quantity
      resetProductQuantity(cartItems, products)
      console.log(error);
      return error;
    });
};

export const getProducts = async (dispatch, setProducts, setCategories) => {
  var products = [];
  var count = 0;

  const querySnapshot = await getDocs(
    collection(db, "Products"),
    orderBy("Category")
  );
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const d = doc.data();
    var imgUrls = []
    for (var i = 0; i < d.Images.length; i += 1) {
      const imgPath = d.Images[i]
      getDownloadURL(ref(storage, imgPath))
        .then((url) => {
          imgUrls.push(url)
          if (imgUrls.length == d.Images.length) {
            count += 1;
            const product = {
              id: doc.id,
              Name: d.Name,
              Desc: d.Desc,
              Price: d.Price,
              Quantity: d.Quantity,
              Category: d.Category,
              Images: imgUrls,
              TempCount: d.Images.length,
              CurrentCount: 0
            };
            if (product.Quantity > 0) {
              products.push(product);
            }
            if (count == querySnapshot.size) {
              dispatch(setProductsState(products));
              setProducts(products);
              var tempCategs = [];
              for (var i in products) {
                tempCategs.push(products[i].Category);
              }
              const temp = [...new Set(tempCategs)];
              setCategories(temp);
            }
            imgUrls = []
          }
        })
        .catch((error) => {
          // Handle any errors
          console.log(error);
        });
    }

  });
};
export const getOrders = async (setOrders, setCompletedOrders) => {
  const q = query(collection(db, "Orders"), orderBy("Date", "asc"));
  const _ = onSnapshot(q, (querySnapshot) => {
    const orders = [];
    const completedOrders = []
    querySnapshot.forEach((doc) => {
      const d = doc.data()

      const order = {
        id: doc.id,
        Date: new Date(d.Date.seconds * 1000).toLocaleString(),
        Total: d.Total,
        Complete: d.Complete,
        FullName: d.FullName
      }
      console.log(order)
      if (!order.Complete) {
        orders.push(order)
      } else {
        completedOrders.push(order)
      }
    });
    setOrders(orders)
    setCompletedOrders(completedOrders)
  });
}
export const getItemsbyOrder = async (orderID, setItems) => {
  const querySnapshot = await getDocs(collection(db, "Orders", orderID, "Items"));
  const items = []
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const d = doc.data()
    const item = {
      id: doc.id,
      Desc: d.Desc,
      Name: d.Name,
      Price: d.Price,
      Quantity: d.Quantity
    }
    items.push(item)
  });
  setItems(items)
}
export const markOrderAsComplete = async (orderID, setOrders, orders, setCompletedOrders, completedOrders) => {
  const ref = doc(db, "Orders", orderID);

  // Set the "capital" field of the city 'DC'
  await updateDoc(ref, {
    Complete: true
  });
  var order = {}
  for (var i in orders) {
    if (orders[i].id == orderID) {
      order = orders[i]
    }
  }
  const temp = orders.filter(function (obj) {
    return obj.id !== orderID;
  });
  setOrders(temp)
  setCompletedOrders([order, ...completedOrders])
}
//
// SCHEDULE
export const getEventTypes = async (dispatch) => {
  const q = query(collection(db, "EventTypes"), orderBy("Type", "asc"));
  const _ = onSnapshot(q, (querySnapshot) => {
    const types = [];
    querySnapshot.forEach((doc) => {
      const d = doc.data();
      const type = {
        id: doc.id,
        Type: d.Type,
        DOW: d.DOW,
        Duration: d.Duration,
        Desc: d.Desc,
        StartHour: d.StartHour,
        EndHour: d.EndHour,
        Workers: d.Workers,
        Price: d.Price
      };
      types.push(type);
    });
    dispatch(setEventTypesState(types));
  });
};
export const getScheduledEvents = async (dispatch, date, dateEnd) => {
  const fDateStart = Timestamp.fromDate(date);
  const fDateEnd = Timestamp.fromDate(dateEnd);
  const q = query(
    collection(db, "ScheduledEvents"),
    where("End", ">=", fDateStart),
    where("End", "<=", fDateEnd)
  );
  const _ = onSnapshot(q, (querySnapshot) => {
    const events = [];
    querySnapshot.forEach((doc) => {
      const d = doc.data();
      const event = {
        id: doc.id,
        Name: d.Name,
        Start: d.Start,
        End: d.End,
        Type: d.Type,
        Worker: d.Worker,
        Price: d.Price
      };
      events.push(event);
    });
    const sorted = events.sort((a, b) => a.Start - b.Start);
    dispatch(setScheduledEventsState(sorted));
  });
};
export const createScheduledEvent = async (args, params, myParams) => {
  const fStart = Timestamp.fromDate(new Date(args.Start * 1000));
  const fEnd = Timestamp.fromDate(new Date(args.End * 1000));

  await setDoc(doc(db, "ScheduledEvents", randomString(15)), {
    Name: args.Name,
    End: fEnd,
    Start: fStart,
    Email: args.Email,
    Type: args.Type,
    Worker: args.Worker
  });

  emailjs
    .send(
      emailjs_serviceID,
      emailjs_schedule_templateID,
      params,
      emailjs_publicKey
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );

  emailjs
    .send(
      emailjs_serviceID,
      emailjs_mySchedule_templateID,
      myParams,
      emailjs_publicKey
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );
};
export const firebaseCreateAppointmentType = async (args) => {
  await setDoc(doc(db, "EventTypes", randomString(15)), {
    Type: args.Type,
    StartHour: args.Start,
    EndHour: args.End,
    Desc: args.Desc,
    Price: args.Price,
    DOW: args.DOW,
    Duration: args.Duration,
    Workers: args.Workers
  });
};
export const firebaseUpdateAppointmentType = async (args) => {
  const washingtonRef = doc(db, "EventTypes", args.id);

  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    Type: args.Type,
    StartHour: args.Start,
    EndHour: args.End,
    Desc: args.Desc,
    Price: args.Price,
    DOW: args.DOW,
    Duration: args.Duration,
    Workers: args.Workers
  });
};
export const removeAppointmentType = async (args) => {
  await deleteDoc(doc(db, "EventTypes", args.id));
}

// LOGIN
export const firebaseLogin = (
  email,
  password,
  setErrorMsg,
  setShowError,
  navigate,
  dispatch
) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const _ = userCredential.user;
      // ...
      dispatch(setDashUserState({ Email: email }));
      navigate("/dashboard");
    })
    .catch((error) => {
      const errorCode = error.code;

      if (errorCode == "auth/configuration-not-found") {
        setErrorMsg("Email not found.");
        setShowError(true);
      } else if (errorCode == "auth/invalid-email") {
        setErrorMsg("Email has incorrect format.");
        setShowError(true);
      } else if (errorCode == "auth/wrong-password") {
        setErrorMsg("Password is incorrect.");
        setShowError(true);
      }
      dispatch(setLoadingState(false));
    });
};
export const firebaseSignOut = (dispatch) => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      dispatch(setDashUserState({}));
    })
    .catch((error) => {
      // An error happened.
    });
};

// DASHBOARD
const firebaseStorePageViews = async (page) => {
  const pageRef = doc(db, "Pages", page.Name);
  await updateDoc(pageRef, {
    Views: page.Views + 1,
  });
};
export const firebaseGetPageViews = async (page) => {
  const docRef = doc(db, "Pages", page.Name);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const thing = {
      Name: docSnap.data().Name,
      Views: docSnap.data().Views,
    };
    firebaseStorePageViews(thing);
  } else {
    // doc.data() will be undefined in this case
    firebaseCreatePageViews(page);
  }
};
const firebaseCreatePageViews = async (page) => {
  await setDoc(doc(db, "Pages", page.Name), {
    Views: 1,
    Name: page.Name,
  });
};
//
export const dashGetPageViews = async (dispatch) => {
  const q = query(collection(db, "Pages"), orderBy("Views", "desc"));
  const _ = onSnapshot(q, (querySnapshot) => {
    var pages = [];
    querySnapshot.forEach((doc) => {
      const d = doc.data();
      const page = {
        id: doc.id,
        Name: d.Name,
        Views: d.Views,
      };
      pages.push(page);
    });
    dispatch(setPageViewsState(pages));
  });
};
//
export const dashGetContactEntries = async (dispatch) => {
  const q = query(collection(db, "ContactEntries"), orderBy("Date", "desc"));
  const _ = onSnapshot(q, (querySnapshot) => {
    var entries = [];
    querySnapshot.forEach((doc) => {
      const d = doc.data();
      const entry = {
        id: doc.id,
        Name: d.Name,
        Email: d.Email,
        Reason: d.Reason,
        Message: d.Message,
      };
      entries.push(entry);
    });
    dispatch(setContactEntriesState(entries));
  });
};
//
export const dashGetEmployees = async (dispatch) => {
  const q = query(collection(db, "Employees"), orderBy("Name", "asc"));
  const _ = onSnapshot(q, (querySnapshot) => {
    const employees = [];
    querySnapshot.forEach((doc) => {
      const emp = {
        id: doc.id,
        Name: doc.data().Name,
        Email: doc.data().Email,
      };
      employees.push(emp);
    });
    dispatch(setEmployeesState(employees));
  });
};
export const dashGetPunches = async (employee, from, to, dispatch) => {
  const q = query(
    collection(db, "Employees", employee.id, "Timecard"),
    where("Date", ">=", from),
    where("Date", "<=", to),
    orderBy("Date", "desc")
  );
  const _ = onSnapshot(q, (querySnapshot) => {
    const punches = [];
    querySnapshot.forEach((doc) => {
      const punch = {
        id: doc.id,
        Date: `${new Date(doc.data().Date.seconds * 1000).toLocaleString()}`,
        Seconds: parseInt(doc.data().Date.seconds),
        Punch: doc.data().Punch,
      };
      punches.push(punch);
    });
    dispatch(setPunchesState(punches));
    const temp = [...punches].reverse();
    var punchInSec = 0;
    var punchOutSec = 0;
    var totalSec = 0;
    for (var i in temp) {
      const punch = temp[i];
      if (punch.Punch == "In") {
        punchInSec = punch.Seconds;
      } else {
        punchOutSec = punch.Seconds;
      }

      if (punchInSec != 0 && punchOutSec != 0) {
        totalSec += punchOutSec - punchInSec;
        punchInSec = 0;
        punchOutSec = 0;
      }
    }
    totalSec = (totalSec / 60 / 60).toFixed(2);
    dispatch(setTotalHoursState(totalSec));
  });
};

// FORMS
export const firebaseSendForm = async (files) => {
  const formID = randomString(20);
  for (var i in files) {
    const file = files[i];
    const storageRef = ref(storage, `Forms/${formID}/${file.Name}`);

    uploadBytes(storageRef, file.File).then((_) => {
      console.log("Uploaded a blob or file!");
    });
  }
};

// TIMECARD
export const getLatestTimecardEntry = async (employeeID, dispatch) => {
  const q = query(
    collection(db, "Employees", employeeID, "Timecard"),
    orderBy("Date", "desc"),
    limit(1)
  );
  const _ = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const d = doc.data();
      const entry = {
        id: doc.id,
        Date: `${new Date(d.Date.seconds * 1000).toLocaleString()}`,
        Punch: d.Punch,
      };
      dispatch(setTimecardEntryState(entry));
    });
  });
};
export const getEmployeeUser = async (email, dispatch) => {
  const querySnapshot = await getDocs(
    collection(db, "Employees"),
    where("Email", "==", email)
  );
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const emp = {
      id: doc.id,
      Name: doc.data().Name,
      Email: doc.data().Email,
    };
    dispatch(setEmployeeState(emp));
  });
};
export const firebaseLogin_timecard = (
  email,
  password,
  setErrorMsg,
  setShowError,
  navigate,
  dispatch
) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const _ = userCredential.user;
      // ...
      getEmployeeUser(email, dispatch);
      navigate("/employee-dashboard");
    })
    .catch((error) => {
      const errorCode = error.code;

      if (errorCode == "auth/configuration-not-found") {
        setErrorMsg("Email not found.");
        setShowError(true);
      } else if (errorCode == "auth/invalid-email") {
        setErrorMsg("Email has incorrect format.");
        setShowError(true);
      } else if (errorCode == "auth/wrong-password") {
        setErrorMsg("Password is incorrect.");
        setShowError(true);
      }
      dispatch(setLoadingState(false));
    });
};
export const employeePunch = async (employeeID, timecard) => {
  console.log(timecard);
  await setDoc(doc(db, "Employees", employeeID, "Timecard", timecard.id), {
    Date: Timestamp.fromDate(timecard.Date),
    Punch: timecard.Punch,
  });
};

// AUTH
/*

// ----------------- NEW USER--------------------
import { createUserWithEmailAndPassword } from "firebase/auth";

createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });

// ----------------- SIGN IN USER--------------------
import { signInWithEmailAndPassword } from "firebase/auth";

signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });

    // -----------------SIGN OUT USER--------------------
    import { signOut } from "firebase/auth";

    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });

    // ----------------- CURRENT SIGNED IN USER--------------------
    const user = auth.currentUser;

    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...
    } else {
        // No user is signed in.
    }

    // ----------------- VERIFY EMAIL USER--------------------
    import { sendEmailVerification } from "firebase/auth";

    sendEmailVerification(auth.currentUser)
        .then(() => {
            // Email verification sent!
            // ...
        });

    // -----------------SEND NEW PASSWORD EMAIL--------------------
    import { sendPasswordResetEmail } from "firebase/auth";

    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            // ..
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });

    // -----------------DELETE USER--------------------
    import { deleteUser } from "firebase/auth";

    const user = auth.currentUser;

    deleteUser(user).then(() => {
        // User deleted.
    }).catch((error) => {
        // An error ocurred
        // ...
    });

*/

// FIRESTORE
/*
// -----------------NEW DOC--------------------

import { doc, setDoc } from "firebase/firestore";

// Add a new document in collection "cities"
await setDoc(doc(db, "cities", "LA"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA"
});

// -----------------GET DOCS LISTENER--------------------

import { collection, query, where, onSnapshot } from "firebase/firestore";

const q = query(collection(db, "cities"), where("state", "==", "CA"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const cities = [];
  querySnapshot.forEach((doc) => {
      cities.push(doc.data().name);
  });
  console.log("Current cities in CA: ", cities.join(", "));
});

// -----------------GET DOC--------------------

import { doc, getDoc } from "firebase/firestore";

const docRef = doc(db, "cities", "SF");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
} else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
}

// -----------------GET DOCS--------------------

import { collection, getDocs } from "firebase/firestore";

const querySnapshot = await getDocs(collection(db, "cities"));
querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
});

// -----------------ORDER BY / LIMIT--------------------

import { query, orderBy, limit } from "firebase/firestore";

const q = query(citiesRef, orderBy("name"), limit(3));

// -----------------COMPOUND--------------------

import { query, where, orderBy, limit } from "firebase/firestore";

const q = query(citiesRef, where("population", ">", 100000), orderBy("population"), limit(2));

// -----------------UPDATE DOC--------------------

import { doc, updateDoc } from "firebase/firestore";

const washingtonRef = doc(db, "cities", "DC");

// Set the "capital" field of the city 'DC'
await updateDoc(washingtonRef, {
    capital: true
});

// -----------------DELETE DOC--------------------

import { doc, deleteDoc } from "firebase/firestore";

await deleteDoc(doc(db, "cities", "DC"));

*/

// STORAGE
/*
// -----------------UPLOAD FILE--------------------
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storageRef = ref(storage, 'some-child');

// 'file' comes from the Blob or File API
uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
});

// -----------------DOWNLOAD FILE--------------------

import { getStorage, ref, getDownloadURL } from "firebase/storage";

getDownloadURL(ref(storage, 'images/stars.jpg'))
    .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element
        const img = document.getElementById('myimg');
        img.setAttribute('src', url);
    })
    .catch((error) => {
        // Handle any errors
    });

//   -----------------DELETE FILE--------------------

import { getStorage, ref, deleteObject } from "firebase/storage";

// Create a reference to the file to delete
const desertRef = ref(storage, 'images/desert.jpg');

// Delete the file
deleteObject(desertRef).then(() => {
    // File deleted successfully
}).catch((error) => {
    // Uh-oh, an error occurred!
});
*/
