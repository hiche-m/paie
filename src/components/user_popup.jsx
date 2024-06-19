import CustomButton from "./custom_button";
import newIcon from '../assets/Icons/new.svg';
import CustomInput from "./custom_input";
import { useContext, useEffect, useRef, useState } from "react";
import { Grid as GridSpinner, ThreeDots } from 'react-loader-spinner'
import { getParam, signUp } from "../services/firebase";
import { databaseContext } from '../views/admin_dashboard';

const UserPopup = ({ closeDialog }) => {

    const database = useContext(databaseContext);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        nom: "",
        prenom: "",
        email: "",
        poste: "",
        submit: false,
    });

    const formRefs = {
        username: useRef(null),
        nom: useRef(null),
        prenom: useRef(null),
        email: useRef(null),
        poste: useRef(null),
        password: useRef(null),
    };

    useEffect(() => {
        if (formData.submit) {
            for (const [key, value] of Object.entries(formData)) {
                if (value === "") {
                    setError("Veuillez remplir tous les champs!");
                    focusInput(key);
                    setFormData({
                        ...formData,
                        submit: false
                    });
                    console.log(key, value);
                    return;
                }
            }
            setError("");
            setFormData({
                ...formData,
                submit: false
            });
            console.log(formData);
            create_user();
        }
    }, [formData.submit])

    const create_user = async () => {
        setDisableButton(true);
        const error = await signUp(formData.email, formData.password, formData.username, formData.nom, formData.prenom, formData.poste);
        setDisableButton(false);
        if (error !== null) {
            console.log(error);
            return;
        }
        closeDialog();
    };

    const focusInput = (inputKey) => {
        formRefs[inputKey].current.focus();
    };

    const [posts, setPosts] = useState([]);

    const [isFetching, setIsFetching] = useState(true);

    const [error, setError] = useState("");

    const [disableButton, setDisableButton] = useState(false);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        const post_values = await getParam(database, "poste");
        if (post_values) {
            setPosts(post_values);
            setFormData({
                ...formData,
                poste: post_values[0]
            });
        }
        setIsFetching(false);
    };

    const handleChange = (event, input) => {
        const value = event.target.value;
        setFormData({
            ...formData,
            [input]: value
        });
    };

    const handleSubmit = () => {
        setFormData({
            ...formData,
            submit: true
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
            onClick={closeDialog}
        >
            {isFetching && (<div className='relative top-50 mx-auto'>
                <GridSpinner
                    visible={true}
                    height="20"
                    width="20"
                    color="#FFFFFF"
                    ariaLabel="grid-loading"
                    radius="12.5"
                    wrapperStyle={{}}
                    wrapperClass="grid-wrapper"
                /></div>)}
            {!isFetching && (<div
                className="relative top-50 mx-auto flex flex-col p-5 border shadow-lg rounded-xl bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mt-3">
                    <div className="flex flex-col justify-center items-center">
                        <h3 className="text-center text-lg leading-6 font-medium text-gray-900">Ajouter un nouveau utilisateur</h3>
                        <span className="text-center text-textSecound">Attention : à la création d'un nouvel utilisateur, vous serez déconnecté.</span>
                    </div>
                    <div className="mt-5 px-7 py-3 flex flex-row space-x-10">
                        <CustomInput ref={formRefs.username} label="Nom d'utilisateur" type="text" placeholder="Content" autoFocus={true} onChange={(event) => handleChange(event, "username")} value={formData.username} />
                        <CustomInput ref={formRefs.password} label="Mot de passe" type="text" placeholder="Content" onChange={(event) => handleChange(event, "password")} value={formData.password} />
                    </div>
                    <div className="mt-5 px-7 py-3 flex flex-row space-x-10">
                        <CustomInput ref={formRefs.nom} label="Nom" type="text" placeholder="Content" onChange={(event) => handleChange(event, "nom")} value={formData.nom} />
                        <CustomInput ref={formRefs.prenom} label="Prénom" type="text" placeholder="Content" onChange={(event) => handleChange(event, "prenom")} value={formData.prenom} />
                    </div>
                    <div className="mt-2 px-7 py-3 flex flex-row space-x-10">
                        <CustomInput ref={formRefs.email} label="Email" type="text" placeholder="Content" onChange={(event) => handleChange(event, "email")} value={formData.email} />
                        <CustomInput ref={formRefs.poste} label="Poste" type="text" placeholder="Content" values={posts} onChange={(event) => handleChange(event, "poste")} value={formData.poste} />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-end px-4 py-3 space-x-10">
                    <span className="text-red-500">{error}</span>
                    <span className="text-textSecound underline cursor-pointer" onClick={closeDialog}>Annuler</span>
                    {disableButton ? <div className="cursor-pointer flex flex-row justify-center items-center p-3 bg-secoundaryIdle hover:bg-secoundaryLighter active:bg-secoundaryDarker rounded-lg">
                        <ThreeDots
                            visible={true}
                            height="20"
                            width="20"
                            color="#FFFFFF"
                            radius="5"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div> : (<CustomButton text="Ajouter" onClick={handleSubmit} icon={newIcon} />)}
                </div>
            </div>)}
        </div>
    );
}

export default UserPopup;