//uso questa cartella per pulire tutte le rotte e le chiamate fetch, salvando l'url in un unica variabile

const BASE_URL = "https://e-commerce-backend-c9cn.onrender.com"

export const API_ENDPOINT = {
  //prodotti
  PRODUCTS: `${BASE_URL}/product`,

  //categorie
  CATEGORIES: `${BASE_URL}/categories`,

  //autenticazioni
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,

  // utenti (Gestione Admin)
  USERS: `${BASE_URL}/user`,

  //ordini
  ORDERS: `${BASE_URL}/orders`,
  MY_ORDERS: `${BASE_URL}/orders/me`,
}
