// import { Modal } from "antd";
// import styled from "styled-components";

// export const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;

//   .header {
//     h2 {
//       font-size: 1.7rem;
//     }
//     p {
//       font-size: 0.85rem;
//       margin: 0;
//     }
//   }

//   .mainContent {
//     background: #283854;
//     padding: 1rem;
//     border-radius: 0.5rem;

//     .titleBoard {
//       font-size: 1rem;
//     }

//     .board {
//       display: flex;
//       overflow-x: auto;
//       width: 100%;
//       gap: 0.5rem;
//       min-height: 30rem;

//       scrollbar-width: thin;
//       scrollbar-color: #5683b8 transparent;
//     }

//     .board::-webkit-scrollbar {
//       width: 10px;
//       height: 10px;
//     }

//     .board::-webkit-scrollbar-thumb {
//       background-color: #5683b8;
//       border-radius: 10px;
//     }

//     .board::-webkit-scrollbar-track {
//       background-color: transparent;
//     }
//   }
// `;

// export const DepartmentColumn = styled.div`
//   background: #f3f3f3;
//   border-radius: 1rem;
//   display: flex;
//   align-items: center;
//   flex-direction: column;
//   width: 17rem;
//   min-width: 17rem;
//   margin-bottom: 2rem;

//   .cardSelected {
//     background: #a2b8d5;

//     .getChildren {
//       /* color: #f3f3f3; */
//     }
//   }
// `;

// export const DepartmentCard = styled.div`
//   background-color: #fff;
//   border-radius: 4px;
//   padding: 10px;
//   margin: 10px;
//   width: 15rem;
//   height: 7rem;
//   min-width: 15rem;

//   box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

//   position: relative;

//   display: flex;
//   justify-content: space-between;
//   align-items: center;

//   .cardContent {
//     display: flex;

//     flex-direction: column;
//     align-items: center;
//     justify-content: space-between;
//     text-align: center;
//     width: 100%;
//     height: 100%;

//     .getChildren {
//       border: none;
//       background: none;
//       outline: none;
//       cursor: pointer;
//     }
//   }

//   .organAddBtn {
//     border: none;
//     background: #1f2b45;
//     color: #fff;
//     border-radius: 50%;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     width: 2.5rem;
//     height: 2rem;
//     outline: none;

//     font-size: 0.75rem;
//     transition: 0.3s ease;

//     &:active {
//       transform: scale(0.9);
//     }
//   }
// `;

// export const DepartmentName = styled.p`
//   font-weight: bold;
//   margin: 0;
// `;

// export const DepartmentDescription = styled.p`
//   margin: 0;
//   font-size: 0.8rem;
//   max-width: 10rem;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
// `;

// export const DepartmentAddMemberBtn = styled.button`
//   border: none;
//   border-radius: 4px;
//   background: #4d6ca1;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.5rem;
//   padding: 0.25rem 0.5rem;

//   color: #fff;
//   font-weight: 500;
//   font-size: 0.9rem;
//   outline: none;

//   &:active {
//     outline: none;
//   }

//   &:hover {
//     background: #283854;
//   }
// `;

// export const ArrowCss = styled.span`
//   &::after {
//     content: "";
//     position: absolute;
//     top: 40%; /* Ajuste conforme necessário */
//     left: -8px;
//     width: 0;
//     height: 0;
//     border-style: solid;
//     border-width: 10px 0 10px 10px; /* Ajuste o tamanho da seta aqui */
//     border-color: transparent transparent transparent #729fed; /* Ajuste a cor da seta aqui */
//   }
// `;

// export const LineCssFirst = styled.span`
//   &::after {
//     content: "";
//     position: absolute;
//     top: 47%;
//     left: -40px;
//     width: 35px;
//     height: 3px;
//     border-style: solid;
//     border-width: 3px 3px;
//     border-color: #729fed;
//   }
// `;

// export const LineCssOther = styled.span`
//   content: "";
//   position: absolute;
//   top: 47%;
//   left: -22.5px;
//   width: 17px;
//   height: 3px;
//   border-style: solid;
//   border-width: 3px 3px;
//   border-color: #729fed;

//   &::after {
//     content: "";
//     position: absolute;
//     top: -132px;
//     left: -3px;
//     width: 3px;
//     height: 134px;
//     border-style: solid;
//     border-width: 3px 3px;
//     border-color: #729fed;
//   }
// `;

// export const EmptyBoard = styled.div`
//   color: #fff;

//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   width: 100%;

//   button {
//     border: none;
//     padding: 1rem;
//     font-size: 1rem;
//     font-weight: 500;
//     border-radius: 4px;
//     outline: none;
//     background: #fff;
//   }
// `;

// export const ModalCreateDepartment = styled(Modal)`
//   .inputMod {
//     height: 2.5rem;
//     background: #47474708;
//     border: 1px solid #ffffff00;

//     color: #283854;
//     box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px;

//     &:focus {
//       border: 1px solid #729fed;
//     }
//   }

//   .ant-form-item-label {
//     font-weight: 500;
//   }

//   .ant-form-item-explain-error {
//     color: #ee4266;
//     font-size: 0.8rem;
//   }
//   .ant-input.ant-input-status-error.css-dev-only-do-not-override-sk7ap8.inputMod {
//     border: 1px solid #ee426670;
//   }
// `;

// export const ModalDepartmentInfo = styled(Modal)`
//   .description {
//     font-size: 0.85rem;
//   }

//   .buttonGroup {
//     display: flex;
//     width: 100%;
//     justify-content: space-between;
//     margin-bottom: 1rem;

//     button {
//       border: none;
//       border-radius: 5px;
//       outline: none;
//       background: #729fed;
//       color: #fff;
//       font-size: 0.9rem;

//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.4rem;
//       padding: 0.25rem 0.5rem;

//       &:hover {
//         background: #283854;
//       }
//     }

//     .organOptions {
//       display: flex;
//       gap: 0.2rem;

//       .removeBtn {
//         background: #ea3b25;

//         &:hover {
//           background: #f96654;
//         }
//       }
//     }
//   }

//   .usersList {
//     display: flex;
//     flex-direction: column;

//     background: #ddd;
//     border-radius: 4px;
//     padding: 1rem;
//     height: 20rem;
//     overflow-y: auto;

//     .userInfo {
//       display: flex;
//     }
//   }

//   .removeUser {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 1rem;
//     border: none;
//     background: #ea3b25;
//     color: #fff;
//     border-radius: 5px;
//     padding: 0.5rem;
//     outline: none;

//     &:hover {
//       background: #f96654;
//     }
//   }
// `;

// export const ModalAddUserToDepartment = styled(Modal)`
//   .search {
//     input {
//       box-sizing: border-box;
//       margin: 0;
//       padding: 4px 11px;
//       color: rgba(0, 0, 0, 0.88);
//       font-size: 14px;
//       line-height: 1.5714285714285714;
//       list-style: none;
//       font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
//         "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
//         "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
//       position: relative;
//       display: inline-block;
//       width: 18rem;
//       margin: 1rem 0 1rem 1rem;
//       min-width: 0;
//       background-color: #ffffff;
//       background-image: none;
//       border-width: 1px;
//       border-style: solid;
//       border-color: #d9d9d9;
//       border-radius: 6px;
//       transition: all 0.2s;

//       &:focus-visible {
//         outline: 1px solid #729fed;
//         box-shadow: 0 0 3px #729fed;
//         transition: all 0.2s;
//       }
//     }
//   }

//   .checkboxContainer {
//     overflow: hidden;
//     border-radius: 10px;

//     .tableUsers {
//       border: 1px solid #ddd;
//       border-radius: 10px;
//     }
//   }
// `;

// export const ModalUpdateDepartment = styled(Modal)`
//   .inputMod {
//     height: 2.5rem;
//     background: #47474708;
//     border: 1px solid #ffffff00;

//     color: #283854;
//     box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px;

//     &:focus {
//       border: 1px solid #729fed;
//     }
//   }

//   .ant-form-item-label {
//     font-weight: 500;
//   }

//   .ant-form-item-explain-error {
//     color: #ee4266;
//     font-size: 0.8rem;
//   }
//   .ant-input.ant-input-status-error.css-dev-only-do-not-override-sk7ap8.inputMod {
//     border: 1px solid #ee426670;
//   }
// `;

// export const ModalConfirmDelete = styled(Modal)`
//   h4 {
//     padding-top: 1rem;
//     font-weight: 700;
//   }

//   p {
//     padding: 0.5rem;
//     border-radius: 5px;
//     color:  #e91b01;
//     font-weight: 500;
//   }
// `;
