"use client";

import { ConfigProvider } from "antd";
import pt_BR from "antd/es/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import i18next from "i18next";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { KeycloakProvider } from "../auth/keycloakProvider";
import store from "../auth/Store";
import theme from "../config/Themes/Th01";
import global_en from "../I18n/en/global.json";
import global_pt from "../I18n/pt/global.json";

export default function RootLayout({ children }) {
  i18next.init({
    interpolation: { escapeValue: true },
    lng: "pt",
    resources: {
      pt: {
        global: global_pt,
      },
      en: {
        global: global_en,
      },
    },
  });

  useEffect(() => {
    dayjs.locale("pt-br");
    i18next.off("languageChanged");
  }, []);

  return (
    <html>
      <body
        style={{
          // backgroundColor: 'white',
          maxHeight: "100vh",
        }}
      >
        <KeycloakProvider>
          <I18nextProvider i18n={i18next}>
            <Provider store={store}>
              <ConfigProvider theme={theme} locale={i18next.language === "en" ? null : pt_BR}>{children}</ConfigProvider>
            </Provider>
          </I18nextProvider>
        </KeycloakProvider>
      </body>
    </html>
  );
}
