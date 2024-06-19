import { onValue, ref } from 'firebase/database';
import { useState, useEffect } from 'react';

const useFetchCycle = (database) => {
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
                const data = { ...tempData.Cycle };

                let maxYear = -Infinity;
                let maxYearObject = null;

                for (const key in data) {
                    const numericKey = parseInt(key, 10); // Convert key to integer
                    if (!isNaN(numericKey) && numericKey > maxYear) {
                        maxYear = numericKey;
                        maxYearObject = data[key];
                    }
                }

                let maxMonth = -Infinity;
                let maxMonthObject = null;

                for (const key in maxYearObject) {
                    const numericKey = parseInt(key, 10); // Convert key to integer
                    if (!isNaN(numericKey) && numericKey > maxMonth) {
                        maxMonth = numericKey;
                        maxMonthObject = maxYearObject[key];
                    }
                }

                if (maxMonthObject !== null && maxMonthObject !== undefined && data !== null && data !== undefined) {
                    for (const id of Object.keys(maxMonthObject)) {
                        const temp = [
                            maxMonthObject[id]["Catégorie"],
                            maxMonthObject[id]["Echélon"],
                            maxMonthObject[id]["Rendement"],
                            maxMonthObject[id]["Grade"],
                            maxMonthObject[id]["Poste supérieur"],
                            maxMonthObject[id]["Situation familiale"],
                            maxMonthObject[id]["Conjointe"],
                            maxMonthObject[id]["Mutuelle Sociale"]
                        ];

                        maxMonthObject[id]["Catégorie"] = {};
                        maxMonthObject[id]["Echélon"] = {};
                        maxMonthObject[id]["Rendement"] = {};
                        maxMonthObject[id]["Grade"] = {};
                        maxMonthObject[id]["Poste supérieur"] = {};
                        maxMonthObject[id]["Situation familiale"] = {};
                        maxMonthObject[id]["Conjointe"] = {};
                        maxMonthObject[id]["Mutuelle Sociale"] = {};

                        maxMonthObject[id]["Catégorie"][temp[0]] = Object.keys(tempData.Echelons);
                        maxMonthObject[id]["Echélon"][temp[1]] = tempData.Parametres["echelons"];
                        maxMonthObject[id]["Rendement"][temp[2]] = tempData.Parametres["rendements"];
                        maxMonthObject[id]["Grade"][temp[3]] = tempData.Parametres["grades"];
                        maxMonthObject[id]["Poste supérieur"] = {
                            "values": tempData.Postes_Sup,
                            "selected": temp[4],
                        };
                        maxMonthObject[id]["Situation familiale"][temp[5]] = tempData.Parametres["situaions"];
                        maxMonthObject[id]["Conjointe"][temp[6]] = tempData.Parametres["conjointe"];
                        maxMonthObject[id]["Mutuelle Sociale"][temp[7]] = tempData.Parametres["mutuelle"];
                    }
                }

                if (data !== null && data !== undefined) {
                    setData(maxMonthObject);
                    unsubscribe(); // Unsubscribe once data is received
                }
            }
        });

        return () => {
            unsubscribe(); // Cleanup the listener on unmount
        };
    }, [database]);
    return [data, isLoading, error];
};

export default useFetchCycle;
