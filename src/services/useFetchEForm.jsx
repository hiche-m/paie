import { useEffect, useState } from 'react';
import { database } from '../services/firebase'
import { onValue, ref } from 'firebase/database';
import Functions from '../utils/functions';

const useFetchEForm = () => {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const dbRef = ref(database);

        const unsubscribe = onValue(dbRef, snapshot => {
            setLoading(false);
            const tempData = snapshot.val();
            if (tempData === null) {
                setError("null");
            } else {
                let data = { ...tempData.Parametres };
                setData({
                    "grades": data["grades"],
                    "femme": data["conjointe"],
                    "sexe": data["sexe"],
                    "echelons": data["echelons"],
                    "rendements": data["rendements"],
                    "mutuelle": data["mutuelle"],
                    "situaions": data["situaions"],
                    "posts": tempData.Postes_Sup,
                    "mois": data["mois"],
                });

                if (data !== null && data !== undefined) {
                    unsubscribe(); // Unsubscribe once data is received
                }
            }
        });

        return () => {
            unsubscribe(); // Cleanup the listener on unmount
        };
    }, []);

    return [data, isLoading, error];
}

export default useFetchEForm;