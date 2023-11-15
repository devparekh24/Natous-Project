import axios from 'axios'
import { displayAlert } from './alerts'

export const login = async (email, password) => {

    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            displayAlert('success', 'Logged in Successfully!')
            window.setTimeout(() => {
                location.assign('/')
            }, 10)
        }
    }
    catch (err) {
        displayAlert('error', err.response.data.message)
    }
}

// export const logout = async () => {

//     try {
//         const res = await axios({
//             method: 'GET',
//             url: 'http://localhost:3000/api/v1/users/logout'
//         });

//         if (res.data.status === 'success') location.reload(true);
//     }
//     catch (err) {
//         displayAlert('error', 'Error in LogOut! Try Again')
//     }
// }