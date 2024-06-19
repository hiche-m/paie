import vector from '../assets/login.svg';
import um from '../assets/UM.svg';
import fsei from '../assets/Fsei.svg';
import CustomInput from '../components/custom_input';
import CustomButton from '../components/custom_button';
import { useState } from 'react';
import { signIn } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

const LogIn = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const handleLoginOnClick = async () => {
        setIsLoading(true);
        const result = await signIn(form.username, form.password);
        setIsLoading(false);
        if (result === null) {
            navigate("/");
        } else {
            window.alert(result);
        }
    };

    const onUsernameChange = (event) => {
        setForm({
            ...form,
            ["username"]: event.target.value
        });
    };

    const onPasswwordChange = (event) => {
        setForm({
            ...form,
            ["password"]: event.target.value
        });
    };

    return (
        <div className="bg-white">
            <div className="bg-primaryIdle bg-opacity-15 h-screen w-screen flex justify-center items-center">
                <div className="h-[75vh] w-[60vw] bg-background rounded-2xl flex flex-row space-x-0">
                    <div className="flex flex-col justify-around w-1/2 h-full p-7">
                        <div className='flex flex-row justify-between'>
                            <img src={fsei} className='h-24' />
                            <img src={um} className='h-24' />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-bold text-2xl'>Se Connecter</span>
                            <p className='pt-2 text-textSecound'>Connectez-vous avec le compte qui vous est attribué, en cas de problème merci de contacter un superviseur.</p>
                        </div>
                        <div className='flex flex-col'>
                            <CustomInput type="text" placeholder="Votre nom d’utilisateur..." label="Nom d’utilisateur:" id="username" className='' value={form.username} onChange={(event) => onUsernameChange(event)} autoFocus={true} />
                            <CustomInput type="password" placeholder="Votre mot de passe..." label="Mot de passe:" id="password" className='pt-3' value={form.password} onChange={(event) => onPasswwordChange(event)} />
                        </div>
                        {isLoading ?
                            (<div className="cursor-pointer flex flex-row justify-center items-center p-3 bg-secoundaryIdle hover:bg-secoundaryLighter rounded-lg">
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
                            </div>)
                            : (<CustomButton text="Se connecter" onClick={() => handleLoginOnClick()} />)}
                    </div>
                    <div className="w-1/2 h-full bg-primaryIdle rounded-r-2xl flex justify-center items-center">
                        <img src={vector} className='h-2/5' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogIn;