import axios, { AxiosRequestConfig } from 'axios';
import { useUserStore } from '../store/useUserStore';
import { SearchMovie, SearchMovieQuery, SearchMovieResponse, MovieDetailsResponse } from '../store/useTmdbStore';

const getToken = (): string | undefined => useUserStore.getState().user?.token;

const apiURL = 'http://localhost:5001';

const api = axios.create({
    baseURL: apiURL,
    headers: { 'Content-Type': 'application/json' }
});

// Konfigurieren eines Axios Interceptor für die spezifisch erstellte Axios-Instanz
api.interceptors.response.use(
	response => response,
	error => {
		if (
			error.response && error.response.status === 401 && error.response.data.error === "Token expired" ||
			error.response && error.response.status === 401 && error.response.data.error === "Please authenticate."
		) {
			console.log("Token expired");
			
			// Token ist abgelaufen, logge den Nutzer aus
			useUserStore.setState({ loggedIn: false, user: null });
		}
		return Promise.reject(error);
	}
);
  

const withToken = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    const token = getToken();
    return {
		...config,
		headers: {
			...config.headers,
			Authorization: `Bearer ${token}`
		}
    }
};

const userLogin = async (username: string, password: string) =>
	await axios.post(`${apiURL}/auth/user/login`, { username, password });

const userLogout = async () => {
	const config = await withToken({});
	return await api.post(`${apiURL}/auth/user/logout`, {}, config);
}

const isUserTokenValid = async () =>{
	const config = await withToken({});
	return await api.get(`${apiURL}/auth/user/tokenIsValid`, config);
}

const searchMovieOnTmdb = async (query: SearchMovieQuery): Promise<SearchMovieResponse> => {
	const config = await withToken({});
	return (await api.post(`${apiURL}/tmdb/search/movie`, { ...query }, config)).data;
}

const getMovieDetailsFromTmdb = async (movieId: number, language='de-DE'): Promise<MovieDetailsResponse> => {
	const config = await withToken({
		params: {
			language
		}
	});
	return (await api.get(`${apiURL}/tmdb/movie/${movieId}`, config)).data;
}

export {
	api,
	getToken,
	userLogin,
	userLogout,
	isUserTokenValid,
	searchMovieOnTmdb,
	getMovieDetailsFromTmdb,
};