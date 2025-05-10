import { useState } from "react"; // hook React pour stocker l’état en local

export const useLocalStorage: (keyName: string, defaultValue: any) => [any, React.Dispatch<any>] = (keyName: string, defaultValue: any) => {
  const [storedValue, setStoredValue] = useState(() => { // valeur stockée localement (dans React et localStorage)
    try {
      const value = window.localStorage.getItem(keyName); // récupère la valeur depuis le localStorage
      if (value) {
        return JSON.parse(value); // si existe, on la convertit en objet JS
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue)); // sinon, on stocke la valeur par défaut
        return defaultValue;
      }
    } catch (err) {
      return defaultValue; // si erreur (ex: JSON mal formé), on retourne la valeur par défaut
    }
  });

  const setValue = (newValue: any) => { // fonction pour mettre à jour la valeur
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue)); // on sauvegarde dans localStorage
    } catch (err) {
      console.log(err); // affiche l’erreur si échec d’écriture
    }
    setStoredValue(newValue); // on met à jour la valeur côté React
  };

  return [storedValue, setValue]; // retourne la valeur + fonction de mise à jour
};
