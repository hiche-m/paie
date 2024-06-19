import React, { useContext, useEffect, useRef, useState } from 'react';
import EditInput from './editable_input';
import Functions from '../utils/functions';
import deleteIcon from '../assets/Icons/delete.svg';
import printIcon from '../assets/Icons/print.svg';
import saveIcon from '../assets/Icons/save.svg';
import { delCycle, editCycle, getCategories, getData, getDataByDate, getMonths, getParams } from '../services/firebase';
import { Grid as GridSpinner } from 'react-loader-spinner'
import { databaseContext } from '../views/AgentDashboard';
import CycleSearchBar from './cycle_search_bar';
import { useReactToPrint } from 'react-to-print';
import CatEditInput from './cat_editable_input';
import FichePDF from './preview_fiche';
import { calculateSalary } from '../utils/calculate_salary';


const CycleGrid = ({ data, isLoading, error, headers, showPrint = true }) => {

    const database = useContext(databaseContext);

    const [originalData, setOriginalData] = useState(data);
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState([]);
    const [showSave, setShowSave] = useState(false);
    const [showDeleteAll, setShowDeleteAll] = useState(false);
    const [editList, setEditList] = useState({
        edit: {/*

            "ID": {

                "editedColumnId": newValue,

            },

            */
        },
        delete: {/* "ID" */ },
    });
    const [yearValue, setYearValue] = useState(new Date().getFullYear());
    const [monthValue, setMonthValue] = useState(new Date().getMonth() + 1);
    const [loadingDate, setLoadingDate] = useState(false);
    const [monthValues, setMonthValues] = useState(null);

    const sortYears = Functions.range(new Date().getFullYear(), 2000, -1);
    const sortMonths = Functions.range(1, 12, 1);

    const [inputData, setInputData] = useState(data);
    const [printData, setPrintData] = useState({});

    const loadMonths = async () => {
        setLoadingDate(true);
        try {
            const response = await getMonths(database);
            setMonthValues(response.val());
            if (monthValues !== null)
                setMonthValue(monthValues[monthValue])
        } catch (error) {
            window.alert(error.message);
        }
        setLoadingDate(false);
    };

    const handlePrint = async (rowIndex) => {
        if (inputData === undefined || inputData === null) {
            return;
        }

        const rowKey = Object.keys(inputData)[rowIndex];

        const infoPersonel = {
            year: inputData[rowKey]["Année"],
            month: monthValues[inputData[rowKey]["Mois"]],
            matricule: inputData[rowKey]["Matricule"],
            nom: inputData[rowKey]["Nom"],
            prenom: inputData[rowKey]["Prénom"],
            grade: Object.values(inputData[rowKey]["Grade"])[0][Object.keys(inputData[rowKey]["Grade"])[0]],
            categorie: Object.values(inputData[rowKey]["Catégorie"])[0][Object.keys(inputData[rowKey]["Catégorie"])[0]],
            echelon: Object.values(inputData[rowKey]["Echélon"])[0][Object.keys(inputData[rowKey]["Echélon"])[0]],
            agence: inputData[rowKey]["Société"],
            compte: inputData[rowKey]["N° Compte"],
            dateChange: inputData[rowKey]["Date de naissance"],
            recChange: inputData[rowKey]["Date de recrutement"],
        }

        const tempData = await getData(database);
        const echelons = tempData.Echelons;
        const params = tempData.Parametres;
        const irg = params.irg;

        const salary_details = {
            nb_abs: inputData[rowKey]["Absence(h)"] === null || inputData[rowKey]["Absence(h)"] === undefined || inputData[rowKey]["Absence(h)"] === "" ? 0 : parseFloat(inputData[rowKey]["Absence(h)"]),
            indice_grade: echelons[Object.values(inputData[rowKey]["Catégorie"])[0][Object.keys(inputData[rowKey]["Catégorie"])[0]]][0],
            indice_ech: echelons[Object.values(inputData[rowKey]["Catégorie"])[0][Object.keys(inputData[rowKey]["Catégorie"])[0]]][Object.keys(inputData[rowKey]["Echélon"])[0]],
            indice_poste_supt: tempData.Postes_Sup[inputData[rowKey]["Poste supérieur"].selected.split(";")[0]][inputData[rowKey]["Poste supérieur"].selected.split(";")[1]],
            indice_doc_cat: params.doc[params.grade_eq[Object.keys(inputData[rowKey]["Grade"])[0]]],
            ind_enc_suivi_cat: params.suivi[Object.keys(inputData[rowKey]["Grade"])[0]],
            ind_qual_cat: params.qualif[Object.keys(inputData[rowKey]["Grade"])[0]],
            irg: irg,
            mutuelle: parseInt(Object.keys(inputData[rowKey]["Mutuelle Sociale"])[0]),
            nb_enfants: inputData[rowKey]["Nombre d'enfants"] === null || inputData[rowKey]["Nombre d'enfants"] === undefined || inputData[rowKey]["Nombre d'enfants"] === "" ? 0 : parseInt(inputData[rowKey]["Nombre d'enfants"]),
            nb_enfants_p: inputData[rowKey]["Enfants (+10)"] === null || inputData[rowKey]["Enfants (+10)"] === undefined || inputData[rowKey]["Enfants (+10)"] === "" ? 0 : parseInt(inputData[rowKey]["Enfants (+10)"]),
            conjointe: parseInt(Object.keys(inputData[rowKey]["Conjointe"])[0]),
            sexe: inputData[rowKey]["Sexe"],
            situaion: parseInt(Object.keys(inputData[rowKey]["Situation familiale"])[0]),
        };

        const infoSalaire = calculateSalary(salary_details);

        const temp = {
            "infoPersonel": infoPersonel,
            "infoSalaire": infoSalaire
        };

        setPrintData(temp);

        printNow();
    };

    const childComponentRef = useRef();
    const [isPrinting, setIsPrinting] = useState(false);

    // We store the resolve Promise being used in `onBeforeGetContent` here

    const promiseResolveRef = useRef(null);

    useEffect(() => {
        setOriginalData(data);
        setInputData(data);
        loadMonths();

    }, [data]);

    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed

            promiseResolveRef.current();
        }
    }, [isPrinting]);

    const checkDelete = () => {
        if (selected.length === 0) {
            setShowDeleteAll(false);
        } {
            setShowDeleteAll(true);
        }
    };

    const printNow = useReactToPrint({
        content: () => childComponentRef.current,
        onBeforeGetContent: () => {
            return new Promise((resolve) => {
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again

            promiseResolveRef.current = null;
            setIsPrinting(false);
        }
    });

    const editEditList = (year, month, rowId, columnId, newValue) => {
        let temp = { ...editList };
        let edit = temp.edit;
        if (Object.keys(edit).includes(rowId)
            && Object.keys(edit[rowId]).includes(year.toString())
            && Object.keys(edit[rowId][year]).includes(month.toString())) {
            edit[rowId][year][month][columnId] = newValue;
            edit[rowId][year][month]["modifiedAt"] = Date.now();
        } else {
            let tempId = {}
            tempId[columnId] = newValue;
            tempId["modifiedAt"] = Date.now();

            let tempMonth = {};
            tempMonth[month] = tempId;

            let tempYear = {};
            tempYear[year] = tempMonth;
            edit[rowId] = tempYear;
        }
        temp.edit = edit;
        setEditList(temp);
    };

    const deleteEditList = (id, year, month) => {
        setShowSave(true);
        let temp = { ...editList };
        let list = temp.delete;

        list[id] = { year, month };
        temp.delete = list;
        setEditList(temp);
        setShowSave(true);
    };

    const handleSaveClick = async () => {
        let temp = { ...editList };
        let success = true;

        if (Object.keys(temp.edit).length > 0) {
            try {
                for (const [row, value] of Object.entries(temp.edit)) {
                    const year = Object.keys(value)[0];
                    const month = Object.keys(value[year])[0];
                    const update = value[year][month];
                    await editCycle(database, year, month, row, update);
                }
                temp.edit = {};
                setEditList(temp);
            } catch (error) {
                console.log("Failed to send edit requests: " + error);
                window.alert(error.message);
                success = false;
            }
        }

        if (Object.keys(temp.delete).length > 0) {
            try {
                for (const id of Object.keys(temp.delete)) {
                    const error = await delCycle(database, temp.delete[id]["year"], temp.delete[id]["month"], id);
                    if (error !== null) {
                        console.log(error);
                    }
                }
                temp.delete = {};
                setEditList(temp);
            } catch (error) {
                console.log("Failed to send delete requests: " + error);
                window.alert(error.message);
                success = false;
            }
        }
        if (Object.keys(temp.delete).length + Object.keys(temp.edit).length === 0) {
            setShowSave(false);
        }
        if (!success) {
            window.alert("Sauvegardé!");
        }
    };

    const handleDeleteButton = () => {
        setShowSave(true);
        const updatedData = { ...inputData };
        const tempSelected = Array.from(selected);

        selected.map(async (key, index) => {
            deleteEditList(key, updatedData[key]["Année"], updatedData[key]["Mois"]);
            delete updatedData[key];
            tempSelected.splice(index, 1);
        });

        setInputData(updatedData);
        deselectAll();
        setShowDeleteAll(false);
        setShowSave(true);
    };

    const handleSearchChange = (event) => {
        if (inputData === undefined || inputData === null) {
            return;
        }
        const searchTerm = event.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search

        setSearchTerm(searchTerm);
        const filteredData = Object.keys(originalData).reduce((acc, key) => {
            const item = originalData[key];
            const matricule = item["Matricule"].toString().toLowerCase();
            const nom = item["Nom"].toString().toLowerCase();
            const prenom = item["Prénom"].toString().toLowerCase();

            if (Functions.checkStrings(searchTerm, [nom, prenom, matricule])) {
                acc[key] = item;
            }
            return acc;
        }, {});

        setInputData(filteredData);
    };

    const handleSortYear = async (value) => {
        setYearValue(value);
        setLoadingDate(true);

        const tempData = await getData(database);
        let response = null;

        try {
            response = tempData.Cycle[value][monthValues.indexOf(monthValue)];
        } catch (error) {
            console.log("Valeur n'existe pas");
        }

        if (response !== null && response !== undefined) {
            for (const id of Object.keys(response)) {
                const temp = [
                    response[id]["Catégorie"],
                    response[id]["Echélon"],
                    response[id]["Rendement"],
                    response[id]["Grade"],
                    response[id]["Poste supérieur"],
                    response[id]["Situation familiale"],
                    response[id]["Conjointe"],
                    response[id]["Mutuelle Sociale"]
                ];

                response[id]["Catégorie"] = {};
                response[id]["Echélon"] = {};
                response[id]["Rendement"] = {};
                response[id]["Grade"] = {};
                response[id]["Poste supérieur"] = {};
                response[id]["Situation familiale"] = {};
                response[id]["Conjointe"] = {};
                response[id]["Mutuelle Social"] = {};

                response[id]["Catégorie"][temp[0]] = Object.keys(tempData.Echelons);
                response[id]["Echélon"][temp[1]] = tempData.Parametres["echelons"];
                response[id]["Rendement"][temp[2]] = tempData.Parametres["rendements"];
                response[id]["Grade"][temp[3]] = tempData.Parametres["grades"];
                response[id]["Poste supérieur"] = {
                    "values": tempData.Postes_Sup,
                    "selected": temp[4],
                };
                response[id]["Situation familiale"][temp[5]] = tempData.Parametres["situaions"];
                response[id]["Conjointe"][temp[6]] = tempData.Parametres["conjointe"];
                response[id]["Mutuelle Social"][temp[7]] = tempData.Parametres["mutuelle"];
            }
        }
        setLoadingDate(false);
        setInputData(response);
    };

    const handleSortMonth = async (value) => {
        setMonthValue(value);
        setLoadingDate(true);

        const tempData = await getData(database);

        let response = null;

        try {
            response = tempData.Cycle[yearValue][monthValues.indexOf(value)];
        } catch (error) {
            console.log("Valeur n'existe pas");
        }

        if (response !== null && response !== undefined) {
            for (const id of Object.keys(response)) {
                const temp = [
                    response[id]["Catégorie"],
                    response[id]["Echélon"],
                    response[id]["Rendement"],
                    response[id]["Grade"],
                    response[id]["Poste supérieur"],
                    response[id]["Situation familiale"],
                    response[id]["Conjointe"],
                    response[id]["Mutuelle Sociale"]
                ];

                response[id]["Catégorie"] = {};
                response[id]["Echélon"] = {};
                response[id]["Rendement"] = {};
                response[id]["Grade"] = {};
                response[id]["Poste supérieur"] = {};
                response[id]["Situation familiale"] = {};
                response[id]["Conjointe"] = {};
                response[id]["Mutuelle Social"] = {};

                response[id]["Catégorie"][temp[0]] = Object.keys(tempData.Echelons);
                response[id]["Echélon"][temp[1]] = tempData.Parametres["echelons"];
                response[id]["Rendement"][temp[2]] = tempData.Parametres["rendements"];
                response[id]["Grade"][temp[3]] = tempData.Parametres["grades"];
                response[id]["Poste supérieur"] = {
                    "values": tempData.Postes_Sup,
                    "selected": temp[4],
                };
                response[id]["Situation familiale"][temp[5]] = tempData.Parametres["situaions"];
                response[id]["Conjointe"][temp[6]] = tempData.Parametres["conjointe"];
                response[id]["Mutuelle Social"][temp[7]] = tempData.Parametres["mutuelle"];
            }
        }
        setLoadingDate(false);
        setInputData(response);
    };

    const handleActionClick = () => {
        console.log('Action button clicked');
    };

    const getSelectAllValue = () => {
        let filteredSelections = Array.from(selected);

        if (filteredSelections.length === Object.keys(inputData).length) {
            return 'checked';
        }
        return '';
    }

    const deselectAll = () => {
        setSelected([]);
    }

    const handleSelectAll = (event) => {
        let filteredSelections = Array.from(selected);

        if (filteredSelections.length === Object.keys(inputData).length) {
            filteredSelections = [];
            setShowDeleteAll(false);
        } else {
            filteredSelections = Object.keys(inputData);
            setShowDeleteAll(true);
        }
        setSelected(filteredSelections);
    };

    const boolFromId = (id) => {
        let filteredSelections = Array.from(selected);

        if (filteredSelections.includes(id.toString())) {
            return 'checked';
        }
        return '';
    }

    const handleSelection = (id) => {
        let filteredSelections = Array.from(selected);

        if (filteredSelections.includes(id.toString())) {
            const indexToRemove = filteredSelections.indexOf(id.toString());
            filteredSelections.splice(indexToRemove, 1);
            if (filteredSelections.length === 0) {
                setShowDeleteAll(false);
            }
        } else {
            filteredSelections.push(id.toString())
            setShowDeleteAll(true);
        }
        setSelected(filteredSelections);
        checkDelete();
    };

    const updateProperty = (row, column, newValue) => {
        if (inputData === undefined || inputData === null) {
            return;
        }
        const rowKey = Object.keys(inputData)[row];
        const columnKey = header[column];
        const updatedData = { ...inputData };
        const year = updatedData[rowKey]["Année"];
        const month = updatedData[rowKey]["Mois"];
        updatedData[rowKey][columnKey] = newValue;

        editEditList(year, month, rowKey, columnKey, newValue);

        setInputData(updatedData);
        setShowSave(true);
    };

    const updateDropdown = (row, column, newValue) => {
        if (inputData === undefined || inputData === null) {
            return;
        }
        const rowKey = Object.keys(inputData)[row];
        const columnKey = header[column];
        const updatedData = { ...inputData };
        const list = Object.values(updatedData[rowKey][columnKey])[0].map((number) => number.toString());
        const year = updatedData[rowKey]["Année"];
        const month = updatedData[rowKey]["Mois"];
        updatedData[rowKey][columnKey] = {};
        updatedData[rowKey][columnKey][newValue] = list;

        editEditList(year, month, rowKey, columnKey, newValue);

        setInputData(updatedData);
        setShowSave(true);
    };

    const updateCatDropdown = (row, column, newValue) => {
        if (inputData === undefined || inputData === null) {
            return;
        }
        const rowKey = Object.keys(inputData)[row];
        const columnKey = header[column];

        const updatedData = { ...inputData };
        const year = updatedData[rowKey]["Année"];
        const month = updatedData[rowKey]["Mois"];

        updatedData[rowKey][columnKey]['selected'] = newValue;

        editEditList(year, month, rowKey, columnKey, newValue);

        setInputData(updatedData);
        setShowSave(true);
    };

    const handleDelete = (rowIndex) => {
        setShowSave(true);
        if (inputData === undefined || inputData === null) {
            return;
        }

        const rowKey = Object.keys(inputData)[rowIndex];
        const updatedData = { ...inputData };

        deleteEditList(rowKey, updatedData[rowKey]["Année"], updatedData[rowKey]["Mois"]);

        delete updatedData[rowKey];
        setInputData(updatedData);
        setShowSave(true);
    };

    if (isLoading || loadingDate) {
        return (<div className='flex items-center justify-center'>
            <GridSpinner

                visible={true}
                height="20"
                width="20"
                color="#2B52EA"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
            /></div>);
    }

    if (error !== null && error !== undefined) {
        console.log(error);
        return (
            <div className='flex items-center justify-center text-red-500 font-medium'>un erreur s'est produit, veuillez réessayer ultérieurement!</div>
        );
    }
    if (inputData === undefined || inputData === null || Object.keys(inputData).length === 0) {
        return (<div className='overflow-auto p-5 rounded-lg bg-white max-w-full shadow-md'>
            <div className="flex items-center justify-between mb-4">
                <CycleSearchBar

                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    sortYears={sortYears}
                    sortMonths={monthValues === null ? sortMonths : monthValues}
                    onYearChange={(event) => handleSortYear(event.target.value)}
                    onMonthChange={(event) => handleSortMonth(event.target.value)}
                    yearValue={yearValue}
                    monthValue={monthValue}
                />
                {showSave ? <button onClick={handleSaveClick} className="mr-2 bg-white text-secoundaryIdle border-secoundaryIdle border-2 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center justify-between">
                    <img src={saveIcon} alt="Action Icon" className="w-5 h-5 mr-3 ml-1" />
                    Sauvegarder

                </button> : <div className='mr-2 p-2 flex items-center justify-between'> </div>}
                {/* <Link to={actionRoute}>

                    <button onClick={handleActionClick} className="bg-secoundaryIdle text-white p-2 rounded-lg hover:bg-secoundaryLighter active:bg-secoundaryDarker flex items-center justify-between">

                        <img src={newIcon} alt="Action Icon" className="w-4 h-4 mr-3 ml-1" />

                        {actionText}

                    </button>

                </Link> */}
            </div>
            <div className='flex justify-center italic'>Aucune donnée n'a été saisie pour ce mois.</div>
        </div>)
    }

    let allSelected = getSelectAllValue();

    /* if (headers.length !== Object.keys(Object.values(inputData)[0]).length) {
        return (
            <div className='flex items-center justify-center text-red-500 font-medium'>Headers do not match data!</div>
        );
    } */

    const rows = Object.keys(inputData).length;
    const header = headers;
    const columns = header.length;

    return (
        <div className='overflow-x-auto mx-auto min-w-[1060px] p-5 rounded-lg bg-white max-w-full shadow-lg'>
            <div className="flex items-center justify-between mb-4">
                <CycleSearchBar

                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    sortYears={sortYears}
                    sortMonths={monthValues === null ? sortMonths : monthValues}
                    onYearChange={(event) => handleSortYear(event.target.value)}
                    onMonthChange={(event) => handleSortMonth(event.target.value)}
                    yearValue={yearValue}
                    monthValue={monthValue}
                />
                <div className='flex items-center justify-center'>
                    {showDeleteAll ? <button onClick={handleDeleteButton} className="text-red-500 mr-2 p-2 rounded-lg hover:text-red-400 active:text-red-700 flex items-center justify-between">
                        Supprimer

                    </button> : <></>}
                    {showSave ? <button onClick={handleSaveClick} className="mr-2 bg-white text-secoundaryIdle border-secoundaryIdle border-2 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center justify-between">
                        <img src={saveIcon} alt="Action Icon" className="w-5 h-5 mr-3 ml-1" />
                        Sauvegarder

                    </button> : <div className='mr-2 p-2 flex items-center justify-between'> </div>}

                    {/* <Link to={actionRoute}>

                        <button onClick={handleActionClick} className="bg-secoundaryIdle text-white p-2 rounded-lg hover:bg-secoundaryLighter active:bg-secoundaryDarker flex items-center justify-between">

                            <img src={newIcon} alt="Action Icon" className="w-4 h-4 mr-3 ml-1" />

                            {actionText}

                        </button>

                    </Link> */}
                </div>
            </div>
            <div className="grid gap-0" style={{ gridTemplateColumns: `auto repeat(${columns}, minmax(100px, 1fr)) auto auto` }}>
                {/* Header with Selection Box */}
                <div className="border-t-0 border-b border-l-0 border-r-0 border-disabled p-2 text-textSecound text-left flex items-center">
                    <input type="checkbox" className="p-2 h-5 w-5 accent-secoundaryIdle rounded cursor-pointer" onChange={handleSelectAll} checked={allSelected} />
                </div>
                {header.map((headerItem, index) => (
                    <div

                        key={`header-${index}`}
                        className="border-t-0 border-b border-l-0 border-r-0 border-disabled p-2 text-textSecound text-left flex items-center"
                    >
                        {headerItem}
                    </div>
                ))}
                <div className="border-t-0 border-b border-l-0 border-r-0 border-disabled p-2 text-textSecondary text-left flex items-center"></div>
                <div className="border-t-0 border-b border-l-0 border-r-0 border-disabled p-2 text-textSecondary text-left flex items-center"></div>
                {/* Generate Grid Cells with Selection Boxes */}

                {(Array.from({ length: rows }).map((_, rowIndex) => {
                    const rowKey = inputData !== undefined && inputData !== null ? Object.keys(inputData)[rowIndex] : 0;
                    let selected = boolFromId(rowKey);

                    return <React.Fragment key={`row-${rowIndex}`}>
                        <div className="border-t border-b-0 border-l-0 border-r-0 border-disabled p-2 pt-5 pb-5 text-center flex items-center">
                            <input type="checkbox" className="p-2 h-5 w-5 accent-secoundaryIdle rounded cursor-pointer" checked={selected} onChange={(event) => { handleSelection(rowKey); }} />
                        </div>
                        {header.map((_, colIndex) => {
                            const columnKey = header[colIndex];
                            const cellValue = inputData[rowKey][columnKey];

                            if (typeof cellValue === 'object' && cellValue !== null && Object.values(cellValue).length > 0 && typeof Object.values(Object.values(cellValue)[0])[0] !== 'object') {
                                return (
                                    <EditInput

                                        key={`editable-${rowIndex}-${colIndex}`}
                                        indexKey={rowIndex * columns + colIndex}
                                        data={Object.values(cellValue)[0]}
                                        value={Object.values(cellValue)[0][Object.keys(cellValue)[0]]}
                                        onChange={(value) => updateDropdown(rowIndex, colIndex, Object.values(cellValue)[0].indexOf(value.target.value).toString())}
                                    />
                                );
                            }

                            if (typeof cellValue === 'object' && cellValue !== null && Object.values(cellValue).length > 0 && typeof Object.values(Object.values(cellValue)[0])[0] === 'object') {
                                return (<CatEditInput

                                    key={`editable-cat-${rowIndex}-${colIndex}`}
                                    data={cellValue.values}
                                    value={cellValue.selected}
                                    onChange={(value) => updateCatDropdown(rowIndex, colIndex, value.target.value)}
                                />);
                            }

                            return (
                                <input

                                    key={`input-${rowIndex}-${colIndex}`}
                                    type="text"
                                    className="border-t border-b-0 border-l-0 border-r-0 border-disabled p-2 outline-none focus:border-gray-500 flex items-center"
                                    value={cellValue}
                                    onChange={(e) => updateProperty(rowIndex, colIndex, e.target.value)}
                                />
                            );
                        })}
                        {showPrint ? <div className="border-t border-b-0 border-l-0 border-r-0 border-disabled pl-2 flex items-center min-w-10">
                            <button

                                onClick={() => handlePrint(rowIndex)}
                                className="p-1 cursor-pointer"
                            >
                                <img src={printIcon} alt="Action Icon" className="w-6 h-6" />
                            </button>
                        </div> : <div className="border-t border-b-0 border-l-0 border-r-0 border-disabled pl-2 flex items-center"></div>}
                        <div className="border-t border-b-0 border-l-0 border-r-0 border-disabled pl-2 flex items-center min-w-10">
                            <button

                                onClick={() => handleDelete(rowIndex)}
                                className="p-1 cursor-pointer"
                            >
                                <img src={deleteIcon} alt="Action Icon" className="w-6 h-6" />
                            </button>
                        </div>
                    </React.Fragment>
                })
                )}
            </div>
            <div style={{ display: 'none' }}>
                <FichePDF ref={childComponentRef} infoPersonel={printData} />
            </div>
        </div>
    );
};


export default CycleGrid;