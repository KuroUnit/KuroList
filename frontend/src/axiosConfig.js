import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // URL base para a API
});

// A função é chamada uma vez quando o app iniciar.
export const setInterceptors = (store) => {

  apiClient.interceptors.response.use(
    (response) => response,

    (error) => {
      if (error.response && error.response.status === 401) {
        console.log('Token inválido ou expirado.');
        store.dispatch({ type: 'auth/logout' });
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;