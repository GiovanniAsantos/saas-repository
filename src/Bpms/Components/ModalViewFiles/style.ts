import { Modal } from "antd";
import styled from "styled-components";

export const ModalViewFileComponent = styled(Modal)`
  div {
    p {
      padding: 0 1rem;
      font-size: 1rem;
      font-weight: 500;
    }
  }
`;

interface ModalProps {
  isOpen: boolean;
}

export const ModalOverlay = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: ${(props: any) => (props.isOpen ? "1" : "0")};
  pointer-events: ${(props: any) => (props.isOpen ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

export const ModalHeader = styled.div`
  background: rgba(31, 31, 31, 0.8);
  color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;

  .titleAndBtn {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    button {
      background: none;
      border-radius: 100%;
      padding: 0.35rem;
      color: #fff;
      outline: none;
      border: none;
      transition: all 0.3s;

      &:hover {
        background: rgba(204, 204, 204, 0.2);
      }
    }

    .titleAndPath {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      h4 {
        margin: 0;
      }
      p {
        margin: 0;
      }
    }
  }

  .actionButtons {
    display: flex;
    gap: 1rem;

    button {
      background: none;
      border-radius: 100%;
      padding: 0.35rem;
      color: #fff;
      outline: none;
      border: none;
      transition: all 0.3s;

      &:hover {
        background: rgba(204, 204, 204, 0.2);
      }
    }

    .signatureButton {
      background: #20a8d8;
      border-radius: 10px;
      padding: 0.5rem 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #0d5873;
      }
    }

    .signedButton {
      background: #6fff97;
      border-radius: 10px;
      padding: 0.5rem 0.75rem;
      color: #000;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #34781f;
      }
    }

    .shareBtn {
      background: rgba(40, 56, 84, 1);
      padding: 0.5rem 1rem;
      border-radius: 15px;
      display: flex;
      gap: 0.25rem;
      font-weight: 600;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #406592;
      }
    }
  }
`;

export const ModalContent = styled.div`
  background: none;
  border-radius: 8px;
  padding: 20px;
  max-width: 95%;
  height: 75vh;
  overflow-y: auto;
  overflow-x: hidden;

  .loadingComponent {
    background: #fff;
    padding: 2rem 4rem;
    border-radius: 4px;

    display: flex;
    align-items: center;
    gap: 1rem;
    flex-direction: column;

    img {
      width: 10rem;
      height: 100%;
    }

    .loadingSpin {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;

      span {
        font-size: 1rem;
        font-weight: 600;
      }

      .loadingAnimation {
        animation: heartbeat 1s infinite;
        width: 4rem;
      }
    }

    @keyframes heartbeat {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  &::-webkit-scrollbar {
    width: 10px; /* Largura da barra de rolagem */
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(40, 56, 84, 1); /* Cor da barra de rolagem */
    border-radius: 10px; /* Borda arredondada do polegar da barra */
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: rgba(221, 221, 221, 0.2);
  }

  .pdfViewer {
    width: 100%;
    height: 100%;

    .react-pdf__Page__canvas {
      width: 100% !important;
    }

    .react-pdf__Page__textContent {
      width: 100% !important;
    }
  }

  .pathColumn {
    span {
      font-size: 0.85rem;
    }
  }

  .imageView {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .xlxViewer {
    width: 100%;
    height: 600px;

    .xlxContent {
    }
  }

  .react-pdf__Page__canvas {
    object-fit: contain;
  }
`;

export const ModalPdfPagination = styled.div`
  position: fixed;
  bottom: 10px;
  background: rgba(31, 31, 31, 0.8);
  padding: 1rem;
  border-radius: 4rem;
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  button {
    background: none;
    border-radius: 100%;
    padding: 0.35rem;
    color: #fff;
    outline: none;
    border: none;

    &:hover {
      background: rgba(204, 204, 204, 0.2);
    }
  }

  p {
    margin: 0;
  }
`;
