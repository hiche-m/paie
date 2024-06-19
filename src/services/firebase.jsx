import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { uid } from "uid";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
    name: "Gestion_Paie",
    apiKey: "AIzaSyAElW-Ur2bXe6InjyAAnjvibHcBQapizig",
    authDomain: "paie-fsei.firebaseapp.com",
    databaseURL: "https://paie-fsei-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "paie-fsei",
    storageBucket: "paie-fsei.appspot.com",
    messagingSenderId: "398503146627",
    appId: "1:398503146627:web:399eebaa028380d87617b6",
    measurementId: "G-85MB83WB8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const database = getDatabase(app);

export const auth = getAuth(app);

const temp_app = initializeApp({ name: 'Secondary', ...firebaseConfig });

const temp_auth = getAuth(temp_app);

export const newprof = async (database, data, matricule = null) => {
    try {
        const uuid = matricule ?? uid();
        await set(ref(database, `/Enseignant/${uuid}`), data)
    } catch (error) {
        return error;
    }

    return null;
};

export const checkMatricule = async (database, matricule) => {
    try {
        const snapshot = await get(ref(database, `/Enseignant/${matricule}`));
        if (snapshot.exists()) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        window.alert(error);
    }
};

export const delPof = async (database, uid) => {
    try {
        await remove(ref(database, `/Enseignant/${uid}`));
    } catch (error) {
        console.error('Error deleting professor:', error);
        return error;
    }

    return null;
};

export const deleteUser = async (database, uid) => {
    try {
        await remove(ref(database, `/Agent/${uid}`));
    } catch (error) {
        console.error('Error deleting agent:', error);
        return error;
    }

    return null;
};

export const delCycle = async (database, year, month, uid) => {
    try {
        await remove(ref(database, `/Cycle/${year}/${month}/${uid}`));
    } catch (error) {
        console.error('Error deleting cycle:', error);
        return error;
    }

    return null;
};


export const editProf = async (databse, uid, data) => {
    try {
        await update(ref(databse, `/Enseignant/${uid}`), data)
    } catch (error) {
        console.error('Error editing professor:', error);
        return error;
    }

    return null;
};


export const editUser = async (databse, uid, data) => {
    try {
        await update(ref(databse, `/Agent/${uid}`), data)
    } catch (error) {
        console.error('Error editing agent:', error);
        return error;
    }

    return null;
};


export const editCycle = async (databse, year, month, uid, data) => {
    try {
        await update(ref(databse, `/Cycle/${year}/${month}/${uid}`), data)
    } catch (error) {
        console.error('Error editing cycle:', error);
        return error;
    }

    return null;
};

export const newUser = async (database, email, username, nom, prenom, poste) => {
    let data = {
        email: email,
        username: username,
        nom: nom,
        prenom: prenom,
    };
    const positions = await getParam(database, "poste");
    data = { poste: positions.indexOf(poste), ...data };
    try {
        // Use update instead of set
        await update(ref(database, `/Agent/${username}`), data);
        return null;
    } catch (error) {
        return error;
    }
};


export const signUp = async (email, password, username, nom, prenom, poste) => {

    try {
        const user = await createNewUser(email, password);
        if (user !== null) {
            window.alert(user.message);
            return "Erreur : " + user.message;
        }
        const response = await newUser(database, email, username, nom, prenom, poste);
        if (response !== null) {
            window.alert(response.message);
            return "Erreur: " + response;
        }
        return null;
    } catch (error) {
        console.error("Erreur: ", error);
        window.alert(error.message);
        return error;
    }
};

export const createNewUser = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(temp_auth, email, password);
        console.log('Successfully created new user');
        await signOut(temp_auth);
        return null;
    } catch (error) {
        console.error('Error creating new user:', error);
        return error;
    }
};

const getUsernameEmail = async (username) => {
    try {
        const snapshot = await get(ref(database, `/Agent/${username}`));
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const email = userData.email;
            return email;
        } else {
            throw new Error("Username not found");
        }
    } catch (error) {
        console.error("Error fetching username email:", error);
        throw error;
    }
};

export const getUserInfoByEmail = async (email) => {
    try {
        const usersRef = ref(database, 'Agent');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            // Iterate over each user to find the one with the matching email
            const users = snapshot.val();
            const usernames = Object.keys(users);
            for (const username of usernames) {
                const userData = users[username];
                if (userData.email === email) {
                    // User with the provided email found
                    return { username, ...userData };
                }
            }
        }

        // User not found
        return null;
    } catch (error) {
        console.error("Error fetching user info by email:", error);
        throw error;
    }
};

export const signIn = async (username, password) => {
    try {
        console.log(username, password);
        const email = await getUsernameEmail(username);
        console.log(email, password);
        await signInWithEmailAndPassword(auth, email, password);

        return null;
    } catch (error) {
        console.error("Error signing in: ", error);
        return error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        return null;
    } catch (error) {
        console.error("Error signing out: ", error);
        return error;
    }
};

export const getMonthsByYear = async (database, year) => {
    try {
        const usersRef = ref(database, 'Cycle');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const dates = snapshot.val();
            const years = Object.keys(dates);
            return Object.keys(years[year]);
        }

        return null;
    } catch (error) {
        console.error("Error fetching user info by email:", error);
        return null;
    }
}

export const getCycleByDate = async (database, year, month) => {
    try {
        const usersRef = ref(database, 'Cycle');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const dates = snapshot.val();
            return dates[year][month];
        }

        return null;
    } catch (error) {
        console.error("Error fetching user info by email:", error);
        return null;
    }
};

export const getDataByDate = async (database, year, month) => {
    const snapshot = await get(ref(database, `Cycle/${year}/${month}`));
    return snapshot.val();
};

export const getMonths = async (database) => {
    return await get(ref(database, `/Parametres/mois`));
};

export const getCategories = async (database) => {
    return Object.keys((await get(ref(database, `/Echelons`))).val());
};

export const getPosts = async (database) => {
    return (await get(ref(database, `/Postes_Sup`))).val();
};

export const getData = async (database) => {
    return (await get(ref(database, `/`))).val();
};

export const getParams = async (database) => {
    return (await get(ref(database, `/Parametres`))).val();
};

export const getParam = async (database, param) => {
    return (await get(ref(database, `/Parametres/${param}`))).val();
};