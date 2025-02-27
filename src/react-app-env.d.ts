/// <reference types="react-scripts" />

declare module "react-input-mask";
declare module "@tinymce/tinymce-react";
declare module "js-cookie";
declare module "event-source-polyfill";
declare module "TextComponent";
declare module "uniqid";
declare module "react-pdf";
declare module "react-file-viewer";
declare module "react-google-recaptcha";
declare module "cpf-cnpj-validator";
declare module "dayjs";
declare module "gerador-validador-cpf";
declare module "react-toastify";
declare module "react-i18next";
declare module "antd-img-crop";

declare const BryWebExtension: any;
declare const BryApiModule: any;

declare function fetchUser(id: number): Promise<User>;

declare module "*.png" {
  const value: string;
  export default value;
}
interface User {
  id: number;
  name: string;
  email: string;
}

interface Window {
  AdobeDC: any;
}
