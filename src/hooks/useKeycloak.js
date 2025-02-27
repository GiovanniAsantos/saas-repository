// import { useState, useEffect } from "react";
// import Keycloak, { KeycloakConfig } from "keycloak-js";
// import { keycloakConfig } from "../config/KeycloakConfig";

// export const useKeycloak = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [account, setAccount] = useState(null);

//   const keycloak = new Keycloak(keycloakConfig);

//   useEffect(() => {
//     const initKeycloak = async () => {
//       try {
//         const authenticated = await keycloak.init({
//           onLoad: "check-sso",
//           silentCheckSsoRedirectUri:
//             window.location.origin + "/silent-check-sso.html",
//         });

//         setIsAuthenticated(authenticated);

//         if (authenticated) {
//           setAccount(keycloak.tokenParsed);
//         }
//       } catch (error) {
//         console.error("Failed to initialize Keycloak", error);
//       }
//     };

//     initKeycloak();
//   }, []);

//   const login = keycloak.login;
//   const logout = keycloak.logout;

//   return { keycloak, isAuthenticated, account, login, logout };
// };
