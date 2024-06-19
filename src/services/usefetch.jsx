import { onValue, ref } from 'firebase/database';
import { useState, useEffect } from 'react';

const useFetch = (database) => {
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
                let data = { ...tempData.Enseignant };
                for (const id of Object.keys(data)) {
                    const temp = [tempData.Enseignant[id]["Conjointe"],
                    tempData.Enseignant[id]["Sexe"],
                    tempData.Enseignant[id]["Grade"],
                    tempData.Enseignant[id]["Echélon"],
                    tempData.Enseignant[id]["Rendement"],
                    tempData.Enseignant[id]["Mutuelle Sociale"],
                    tempData.Enseignant[id]["Situation familiale"],
                    tempData.Enseignant[id]["Poste supérieur"],
                    tempData.Enseignant[id]["Catégorie"],
                    ];

                    data[id]["Conjointe"] = {};
                    data[id]["Sexe"] = {};
                    data[id]["Grade"] = {};
                    data[id]["Echélon"] = {};
                    data[id]["Rendement"] = {};
                    data[id]["Mutuelle Sociale"] = {};
                    data[id]["Situation familiale"] = {};
                    data[id]["Poste supérieur"] = {};
                    data[id]["Catégorie"] = {};

                    data[id]["Conjointe"][temp[0]] = tempData.Parametres["conjointe"];
                    data[id]["Sexe"][temp[1]] = tempData.Parametres["sexe"];
                    data[id]["Grade"][temp[2]] = tempData.Parametres["grades"];
                    data[id]["Echélon"][temp[3]] = tempData.Parametres["echelons"];
                    data[id]["Rendement"][temp[4]] = tempData.Parametres["rendements"];
                    data[id]["Mutuelle Sociale"][temp[5]] = tempData.Parametres["mutuelle"];
                    data[id]["Situation familiale"][temp[6]] = tempData.Parametres["situaions"];
                    data[id]["Poste supérieur"] = {
                        "values": tempData.Postes_Sup,
                        "selected": temp[7],
                    };
                    data[id]["Catégorie"][temp[8]] = Object.keys(tempData.Echelons);
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

export default useFetch;
