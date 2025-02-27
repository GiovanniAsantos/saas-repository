import React, { createContext, useContext, useEffect, useState } from "react";
import { initKeycloak, keycloak, logout } from "../keycloakConfig";
import { AccountMeService } from "@/src/Services/AccountMeService";

const KeycloakContext = createContext({
  initialized: false,
  authenticated: false,
  account: null,
  accountKeycloak: null,
  logout: () => {},
});

export const KeycloakProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [accountKeycloak, setAccountKeycloak] = useState(null);
  const accountService = new AccountMeService();

  const getAccount = async () => {
    try {
      const response = await accountService.getMe();
      setAccount(response?.content);
    } catch (error) {
      console.log(error?.response);
      return null;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      initKeycloak()
        .then((auth) => {
          setAuthenticated(auth);
          if (keycloak && auth) {
            const tokenParsed = keycloak.tokenParsed;

            if (!tokenParsed.email_verified) {
              alert("Por favor, verifique seu e-mail.");
              logout();
            }

            setAccountKeycloak({
              name: keycloak?.tokenParsed?.name,
              numberDocument: keycloak?.tokenParsed?.preferred_username,
              email: keycloak?.tokenParsed?.email,
            });

            getAccount();
          }
          setInitialized(true);
        })
        .catch((err) => console.error("Failed to initialize Keycloak", err));
    }
  }, []);

  return (
    <KeycloakContext.Provider
      value={{ initialized, authenticated, account, accountKeycloak, logout }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => useContext(KeycloakContext);
