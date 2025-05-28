// src/utils/fetchWrapper.js
const fetchWrapper = async (url, options = {}) => {
    const token = localStorage.getItem("userToken");
  
    // Adiciona headers padrão
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  
    // Mescla headers e outras opções
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers, // prioridade para headers do chamador
      },
    };
  
    try {
      const response = await fetch(url, config);
  
      // Se não autorizado, redireciona para login
      if (response.status === 401) {
        localStorage.removeItem("userToken");
        window.location.href = "/login";
        return;
      }
  
      // Tenta converter para JSON se possível
      const data = await response.json().catch(() => null);
  
      if (!response.ok) {
        throw new Error(data?.message || "Unknown error");
      }
  
      return data;
    } catch (error) {
      console.error("Fetch error:", error.message);
      throw error;
    }
  };
  
  export default fetchWrapper;
  