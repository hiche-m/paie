import { onValue, ref } from 'firebase/database';
import { useState, useEffect } from 'react';
import { database } from './firebase';

const useFetchUsers = () => {
    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const dbRef = ref(database);

        const unsubscribe = onValue(dbRef, snapshot => {
            setLoading(false);
            const tempData = snapshot.val();
            if (tempData === null) {
                setError("null");
            } else {
                let data = { ...tempData.Agent };
                for (const id of Object.keys(data)) {
                    const temp = tempData.Agent[id]["poste"];
                    data[id]["poste"] = {};
                    data[id]["poste"][temp] = tempData.Parametres["poste"];
                }
                if (data !== null && data !== undefined) {
                    setData(data);
                    unsubscribe(); // Unsubscribe once data is received
                }
            }
        });

        return () => {
            unsubscribe(); // Cleanup the listener on unmount
        };
    }, [database]);

    return { data, isLoading, error };
};

export default useFetchUsers;
