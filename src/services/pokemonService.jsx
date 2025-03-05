import axios from "axios";

const API = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  headers: { "Content-Type": "application/json" },
});

export const fetchPokemonDetails = async (name) => {
  try {
    const response = await API.get(`pokemon/${name}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchPokemonList = async (page) => {
  try {
    const response = await API.get(`pokemon?limit=10&offset=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
