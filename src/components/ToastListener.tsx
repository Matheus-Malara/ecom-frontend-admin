import {useEffect} from "react";
import {toast} from "react-toastify";
import {useToastStore} from "@/stores/toastStore";

export default function ToastListener() {
    const {message, type, clearToast} = useToastStore();

    useEffect(() => {
        if (message) {
            toast[type](message);
            setTimeout(() => {
                clearToast();
            }, 0);
        }
    }, [clearToast, message, type]);

    return null;
}
