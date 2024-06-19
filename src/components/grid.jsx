// src/components/grid.jsx
import React, { useContext, useEffect, useState } from 'react';
import EditInput from './editable_input';
import Spacer from './spacer';
import SearchBar from './editable_searchbar';
import Functions from '../utils/functions';
import newIcon from '../assets/Icons/new.svg';
import deleteIcon from '../assets/Icons/delete.svg';
import printIcon from '../assets/Icons/print.svg';
import saveIcon from '../assets/Icons/save.svg';
import { delPof, editProf } from '../services/firebase';
import { Grid as GridSpinner } from 'react-loader-spinner'
import { databaseContext } from '../views/AgentDashboard';
import { Link } from 'react-router-dom';
import CatEditInput from './cat_editable_input';

const Grid = ({ data, isLoading, error, headers, actionRoute, actionText = "Action", showPrint = true }) => {

    const database = useContext(databaseContext);

    const [originalData, setOriginalData] = useState(data);
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState([]);
    const sortOptions = ['Nom', 'Poste supérieur', 'Temps de modification'];
    const [showSave, setShowSave] = useState(false);
    const [showDeleteAll, setShowDeleteAll] = useState(false);
    const [editList, setEditList] = useState({
        edit: {/* 
            "ID": {
                "editedColumnId": newValue,
            },
            */
        },
        delete: [/* "ID" */],
    });

    const [inputData, setInputData] = useState(data);

    const handlePrint = (rowIndex) => {
        if (inputData === undefined || inputData === null) {
            return;
        }
        const rowKey = Object.keys(inputData)[rowIndex];
        console.log('Print row:', inputData[rowKey]);
    };

    useEffect(() => {
        setOriginalData(data);
        setInputData(data);
    }, [data]);

    const checkSave = () => {
        if (Object.keys(editList.edit).length + editList.delete.length > 0) {
            setShowSave(true);
        }
        setShowSave(false);
        setShowDeleteAll(false);
        deselectAll();
    };

    const checkDelete = () => {
        if (selected.length === 0) {
            setShowDeleteAll(false);
        } {
            setShowDeleteAll(true);
        }
    }

    const editEditList = (rowId, columnId, newValue) => {
        let temp = { ...editList };
        let edit = temp.edit;
        if (Object.keys(edit).includes(rowId)) {
            edit[rowId][columnId] = newValue;
            edit[rowId]["lastEdit"] = Date.now();
        } else {
            const temp = {}
            temp[columnId] = newValue;
            temp["lastEdit"] = Date.now();
            edit[rowId] = temp;
        }
        setEditList(temp);
    };

    const deleteEditList = (id) => {
        setShowSave(true);
        let temp = { ...editList };
        let list = Array.from(temp.delete);
        list.push(id);
        temp.delete = list;
        setEditList(temp);
        setShowSave(true);
    };

    const handleSaveClick = async () => {
        let temp = { ...editList };

        if (Object.keys(temp.edit).length > 0) {
            try {
                for (const [row, value] of Object.entries(temp.edit)) {
                    await editProf(database, row, temp.edit[row]);
                }
                temp.edit = {};
                setEditList(temp);
            } catch (error) {
                console.log("Failed to send edit requests: " + error);
            }
        }

        if (temp.delete.length > 0) {
            try {
                for (const id of temp.delete) {
                    const error = delPof(database, id);
                    if (error !== null) {
                        console.log(error)
                    }
                }
                temp.delete = {};
                setEditList(temp);
            } catch (error) {
                console.log("Failed to send delete requests: " + error);
            }
        }
        checkSave();
    };

    const handleDeleteButton = () => {
        setShowSave(true);
        const updatedData = { ...inputData };
        const tempSelected = Array.from(selected);

        selected.map((key, index) => {
            deleteEditList(key);
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
            const nom = item["Nom"].toString().toLowerCase();
            const prenom = item["Prénom"].toString().toLowerCase();

            if (Functions.checkString(searchTerm, nom, prenom)) {
                acc[key] = item;
            }
            return acc;
        }, {});

        setInputData(filteredData);
    };

    const handleSortChange = (event) => {
        if (inputData === undefined || inputData === null) {
            return;
        }
        const sortValue = event.target.value;
        let sortedData = { ...inputData };

        if (sortValue === 'Nom') {
            sortedData = Object.keys(sortedData)
                .sort((a, b) => {
                    const compareByNom = sortedData[a]["Nom"].localeCompare(sortedData[b]["Nom"]);
                    if (compareByNom === 0) {
                        return sortedData[a].Prénom.localeCompare(sortedData[b].Prénom);
                    }
                    return compareByNom;
                })
                .reduce((acc, key) => {
                    acc[key] = sortedData[key];
                    return acc;
                }, {});
        } else if (sortValue === 'Poste supérieur') {

            sortedData = Object.keys(sortedData)
                .sort((a, b) => {
                    const values = sortedData[a]["Poste supérieur"]['values'];
                    const postA = parseInt(values[sortedData[a]["Poste supérieur"]['selected'].split(";")[0]][sortedData[a]["Poste supérieur"]['selected'].split(";")[1]], 10);
                    const postB = parseInt(values[sortedData[b]["Poste supérieur"]['selected'].split(";")[0]][sortedData[b]["Poste supérieur"]['selected'].split(";")[1]], 10);
                    return postB - postA;
                })
                .reduce((acc, key) => {
                    acc[key] = sortedData[key];
                    return acc;
                }, {});
        } else if (sortValue === 'Temps de modification') {
            sortedData = Object.keys(sortedData)
                .sort((a, b) => {
                    const postA = new Date(sortedData[a]["lastEdit"]);
                    const postB = new Date(sortedData[b]["lastEdit"]);
                    return postB - postA;
                })
                .reduce((acc, key) => {
                    acc[key] = sortedData[key];
                    return acc;
                }, {});
        }

        setInputData(sortedData);
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
        updatedData[rowKey][columnKey] = newValue;

        editEditList(rowKey, columnKey, newValue);

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
        updatedData[rowKey][columnKey] = {};
        updatedData[rowKey][columnKey][newValue] = list;

        editEditList(rowKey, columnKey, newValue);

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

        updatedData[rowKey][columnKey]['selected'] = newValue;

        editEditList(rowKey, columnKey, newValue);

        setInputData(updatedData);
        setShowSave(true);
    };

    const handleDelete = (rowIndex) => {
        if (inputData === undefined || inputData === null) {
            return;
        }
        const rowKey = Object.keys(inputData)[rowIndex];
        const updatedData = { ...inputData };
        delete updatedData[rowKey];

        deleteEditList(rowKey);
        setInputData(updatedData);
        setShowSave(true);
    };

    if (isLoading) {
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

    if (error !== null) {
        return (
            <div className='flex items-center justify-center text-red-500 font-medium'>un erreur s'est produit, veuillez réessayer ultérieurement!</div>
        );
    }
    if (inputData === undefined || inputData === null || Object.keys(inputData).length === 0) {
        return (<div className='overflow-auto p-5 rounded-lg bg-white max-w-full shadow-md'>
            <div className="flex items-center justify-between mb-4">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    sortOptions={sortOptions}
                    onSortChange={handleSortChange}
                />
                <Link to={actionRoute}>
                    <button onClick={handleActionClick} className="bg-secoundaryIdle text-white p-2 rounded-lg hover:bg-secoundaryLighter active:bg-secoundaryDarker flex items-center justify-between">
                        <img src={newIcon} alt="Action Icon" className="w-4 h-4 mr-3 ml-1" />
                        {actionText}
                    </button>
                </Link>
            </div>
            <div className='flex justify-center italic'>Vide</div>
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
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    sortOptions={sortOptions}
                    onSortChange={handleSortChange}
                />
                <div className='flex items-center justify-center'>
                    {showDeleteAll ? <button onClick={handleDeleteButton} className="text-red-500 mr-2 p-2 rounded-lg hover:text-red-400 active:text-red-700 flex items-center justify-between">
                        Supprimer
                    </button> : <></>}
                    {showSave ? <button onClick={handleSaveClick} className="mr-2 bg-white text-secoundaryIdle border-secoundaryIdle border-2 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center justify-between">
                        <img src={saveIcon} alt="Action Icon" className="w-5 h-5 mr-3 ml-1" />
                        Sauvegarder
                    </button> : <div className='mr-2 p-2 flex items-center justify-between'> </div>}

                    <Link to={actionRoute}>
                        <button onClick={handleActionClick} className="bg-secoundaryIdle text-white p-2 rounded-lg hover:bg-secoundaryLighter active:bg-secoundaryDarker flex items-center justify-between">
                            <img src={newIcon} alt="Action Icon" className="w-4 h-4 mr-3 ml-1" />
                            {actionText}
                        </button>
                    </Link>
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
        </div>
    );
};

export default Grid;
