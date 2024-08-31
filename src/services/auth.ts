import axios from "axios";
import config from "../config/config";
import mAxios from "@/app/utils/mAxios";

class authService {
    static signinWithEmail = async (email: string, password: string) => {
        try {
            const { data: response } = await axios.post(`${config.apiBaseUrl}/auth/email/signin`, {
                email,
                password
            });
            return response.data;
        }
        catch (error) {
            console.error("Error signing in with email:", error);
            throw error;
        }
    }

    static getSelf = async () => {
        try {
            const { data: response } = await mAxios.get('/auth/self');
            return response.data;
        }
        catch (error) {
            console.error("Error signing in with email:", error);
            throw error;
        }
    }
}

export default authService;