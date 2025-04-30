import axios from 'axios'


// console.log('API KEY:', import.meta.env.VITE_apiKey);
// console.log('API URL:', import.meta.env.VITE_API_URL);

// eslint-disable-next-line react-refresh/only-export-components
const Request = axios.create({
    // baseURL: `${'https://mistiaq-app-server.onrender.com/api/'}`,
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_apiKey}`
    },
    next: {
        revalidate: 3600
    }
})


async function fetchDataAPI(path) {
    try {
        const response = await Request.get(`/${path}`);
        // console.log('API Response:', response); // Check the full response
        if (response.status !== 200) {
            throw new Error('Failed to fetch data');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return undefined;
    }
}


export default fetchDataAPI;