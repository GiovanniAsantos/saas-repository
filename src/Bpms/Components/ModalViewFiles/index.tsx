/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalPdfPagination,
  ModalViewFileComponent,
} from "./style";
import { SignatureService } from "../../../Services/SignatureService";
import { CloudService } from "../../../Services/CloudService";
// import { apiDrive, apiSignature } from "../../../services/api";
import { Spin } from "antd";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Document, Page, pdfjs } from "react-pdf";
import loadingSvg from "../../../assets/img/loading.svg";
import {
  MdArrowBack,
  MdDraw,
  MdFileDownload,
  MdInsertLink,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import FileViewer from "react-file-viewer";
import { toast } from "react-toastify";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface ModalViewFileProps {
  open: boolean;
  onCancel: any;
  filesIdToView: null | number;
  filesTypeToView: null | string;
  filesNameToView: null | string;
  filesParentToView: any;
  fileSelect: any;
  shareFile?: any;
  showCreateSignature?: boolean;
}
export default function ModalViewFile({
  open,
  onCancel,
  filesIdToView,
  filesTypeToView,
  filesNameToView,
  filesParentToView,
  fileSelect,
  shareFile,
  showCreateSignature,
}: ModalViewFileProps) {
  const iCON_WHITE_ORIGINAL_TRANSPARENT =
    process.env.REACT_APP_ICON_WHITE_ORIGINAL_TRANSPARENT;

  const signatureService = new SignatureService();
  const cloudService = new CloudService();

  const [loading, setLoading] = useState(false);
  const [base64, setBase64] = useState<any>(undefined);
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const [signatureContent, setSignatureContent] = useState<any>();

  const [isAcceptedFormat, setIsAcceptedFormat] = useState(false);

  const pdfType = ["application/pdf"];
  const imageType = ["image/jpeg", "image/png"];
  const docType = [
    // "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const pptType = [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  const xlsType = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
  ];
  const gifType = ["image/gif"];

  const txtType = ["text/plain", "text/txt"];
  const mp4Type = ["video/mp4"];

  const modalContentRef = useRef(null);
  const modalHeaderRef = useRef(null);
  const modalPaginationRef = useRef(null);
  const linkRef = useRef<any>(null);

  // const [progressDownload, setProgressDownload] = useState<any>();

  const handleClickOutsideModalContent = (e: MouseEvent) => {
    if (
      modalContentRef.current &&
      modalHeaderRef.current &&
      (!filesTypeToView ||
        !pdfType.includes(filesTypeToView) ||
        (modalPaginationRef.current &&
          //@ts-ignore
          !modalPaginationRef.current.contains(e.target))) &&
      //@ts-ignore
      !modalContentRef.current.contains(e.target) &&
      //@ts-ignore
      !modalHeaderRef.current.contains(e.target) &&
      //@ts-ignore
      !(linkRef && linkRef?.current && linkRef.current.contains(e.target))
    ) {
      handleCloseModal();
    }
  };

  const getBase64FromId = async () => {
    setLoading(true);
    if (fileSelect?.base64) {
      try {
        // Simula a conversão para exibição como uma data URL.
        const base64Data = `data:application/octet-stream;base64,${fileSelect.base64}`;
        setBase64(base64Data); // Define o conteúdo base64.

        // Verifica e busca assinatura, se aplicável.
        if (fileSelect?.documentSignature) {
          const response = await signatureService.getBase64FromId(
            fileSelect.documentSignature.signatureId
          );
          setSignatureContent(response?.content);
        }
      } catch (error) {
        toast.error("Erro ao carregar arquivo");
      } finally {
        setLoading(false); // Finaliza o loading
      }
      return; // Impede que o restante do código seja executado.
    }

    // Caso não tenha base64, mas tenha `filesIdToView`, faz o download do arquivo.
    if (filesIdToView) {
      setLoading(true); // Inicia o loading
      try {
        const response = await cloudService.getBase64FromId(filesIdToView);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result;
          setBase64(base64Data);
        };
        reader.readAsDataURL(response); // Converte o blob para base64.

        // Verifica e busca assinatura, se aplicável.
        if (fileSelect?.documentSignature) {
          const signatureResponse = await signatureService.getBase64FromId(
            fileSelect.documentSignature.signatureId
          );
          setSignatureContent(signatureResponse?.content);
        }
      } catch (error) {
        toast.error("Erro ao carregar arquivo");
      } finally {
        setLoading(false); // Finaliza o loading
      }
    }
  };

  const base64ToBlob = (base64: any) => {
    const match = base64.match(/^data:(.+);base64,(.+)$/);

    if (!match || match.length !== 3) {
      throw new Error(
        "A base64 fornecida é inválida ou em um formato incorreto."
      );
    }

    const [, mimeType, base64Data] = match;

    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const ViewComponent = () => {
    if (loading) {
      return (
        <div className="loadingComponent">
          <img src={loadingSvg} alt="carregando" />

          <div className="loadingSpin">
            <img
              className="loadingAnimation"
              src={iCON_WHITE_ORIGINAL_TRANSPARENT}
              alt="carregando"
            />
            <span>Carregando...</span>
          </div>
        </div>
      );
    }

    const format = filesTypeToView;

    if (format) {
      if (base64 && pdfType.includes(format)) {
        return (
          <div className="pdfViewer">
            <Document file={`${base64}`} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
        );
      }

      if (base64 && docType.includes(format)) {
        const blob = base64ToBlob(base64);

        if (format === "application/msword") {
          return (
            <div>
              <p>Formato não suportado para visualização</p>
            </div>
          );
        }

        if (
          format ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          return (
            <div>
              <FileViewer
                fileType={"docx"}
                filePath={URL.createObjectURL(blob)}
              />
            </div>
          );
        }
      }

      if (base64 && gifType.includes(format)) {
        const blob = base64ToBlob(base64);

        const docs = [{ uri: URL.createObjectURL(blob) }];
        return (
          <div>
            <DocViewer
              pluginRenderers={DocViewerRenderers}
              documents={docs}
              config={{
                header: {
                  disableHeader: true,
                  disableFileName: false,
                  retainURLParams: false,
                },
              }}
              style={{ height: 500 }}
            />
          </div>
        );
      }

      if (base64 && imageType.includes(format)) {
        const blob = base64ToBlob(base64);

        const docs = [{ uri: URL.createObjectURL(blob) }];
        return (
          <div className="imageView">
            <DocViewer
              pluginRenderers={DocViewerRenderers}
              documents={docs}
              config={{
                header: {
                  disableHeader: true,
                  disableFileName: false,
                  retainURLParams: false,
                },
              }}
              style={{ height: 500 }}
            />
          </div>
        );
      }

      if (base64 && pptType.includes(format)) {
        return (
          <div>
            <p>Formato não suportado para visualização</p>
          </div>
        );
      }

      if (base64 && txtType.includes(format)) {
        return (
          <div>
            <p>Formato não suportado para visualização</p>
          </div>
        );
      }

      if (base64 && xlsType.includes(format)) {
        const blob = base64ToBlob(base64);

        const type =
          format === "application/vnd.ms-excel"
            ? "xlsx"
            : format ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? "xlsx"
            : "";

        return (
          <div className="xlxViewer">
            <FileViewer
              className="xlxContent"
              fileType={type}
              filePath={URL.createObjectURL(blob)}
            />
          </div>
        );
      }

      if (base64 && mp4Type.includes(format)) {
        const blob = base64ToBlob(base64);

        return (
          <div>
            <FileViewer fileType={"mp4"} filePath={URL.createObjectURL(blob)} />
          </div>
        );
      }
    }

    if (loading) {
      return (
        <div className="loadingComponent">
          <img src={loadingSvg} alt="carregando" />

          <div className="loadingSpin">
            <img
              className="loadingAnimation"
              src={iCON_WHITE_ORIGINAL_TRANSPARENT}
              alt="carregando"
            />
            <span>Carregando...</span>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p>Formato não suportado para visualização</p>
      </div>
    );
  };

  const isAccepted = () => {
    if (typeof filesTypeToView === "string") {
      const acceptedTypes = [
        ...pdfType,
        ...docType,
        ...gifType,
        ...imageType,
        ...xlsType,
        ...mp4Type,
      ];

      setIsAcceptedFormat(acceptedTypes.includes(filesTypeToView));
    } else {
      setIsAcceptedFormat(false);
    }
  };

  const handlePathFromFile = (file: any) => {
    let folders = [];
    let text;
    let rootName = file.parentFolder && file.parentFolder?.name;

    folders.push(file.name);

    while (file.parentFolder !== null) {
      folders.push(file.parentFolder.name);
      file = file.parentFolder;
    }

    text = folders.reverse().join(" / ");

    return rootName ? (
      <span className="pathColumn">
        <span>{text}</span>
      </span>
    ) : (
      ""
    );
  };

  const handleDownloadFile = async () => {
    if (fileSelect) {
      await cloudService
        .handleDownloadFile(fileSelect)
        .then((response: any) => {
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement("a");
          link.href = url;

          const format = fileSelect?.subType;

          if (fileSelect?.name.endsWith(`.${format}`)) {
            link.setAttribute("download", `${fileSelect?.name}`);
          } else {
            link.setAttribute("download", `${fileSelect?.name}.${format}`);
          }

          document.body.appendChild(link);

          if (linkRef !== null) {
            linkRef.current = link;
          }

          link.click();
          link.remove();
        })
        .catch(() => {
          toast.error("Erro ao realizar o download");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleCloseModal = () => {
    setPageNumber(1);
    onCancel();
  };

  const handleShareFile = () => {
    handleCloseModal();
    shareFile();
  };

  useEffect(() => {
    if (open) {
      getBase64FromId();
      isAccepted();
      document.addEventListener("click", handleClickOutsideModalContent);
    } else {
      setBase64(null);
    }

    return () => {
      document.removeEventListener("click", handleClickOutsideModalContent);
      setSignatureContent(null);
    };
  }, [open]);

  return (
    <>
      {isAcceptedFormat ? (
        <ModalOverlay isOpen={open}>
          <ModalHeader ref={modalHeaderRef}>
            <div className="titleAndBtn">
              <button type="button" onClick={() => handleCloseModal()}>
                <MdArrowBack size={30} />
              </button>
              <div className="titleAndPath">
                <h4>{filesNameToView}</h4>
                <p>
                  {filesParentToView === null
                    ? null
                    : handlePathFromFile(filesParentToView)}
                </p>
              </div>
            </div>
            <div className="actionButtons">
              {fileSelect?.documentSignature === null &&
                filesTypeToView &&
                pdfType.includes(filesTypeToView) &&
                !window.location.pathname.startsWith(
                  "/assinaturas/minhas-assinaturas/criar"
                ) &&
                showCreateSignature && (
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        "/assinaturas/minhas-assinaturas/criar?uuids=" +
                          fileSelect?.key,
                        "_blank"
                      );
                    }}
                    className="signedButton"
                  >
                    <MdDraw size={24} />
                    Criar Assinatura
                  </button>
                )}

              {(signatureContent?.status === "ATIVADO_AGUARDANDO_ASSINATURAS" ||
                signatureContent?.status === "ASSINADO_PARCIALMENTE") && (
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      "/assinaturas/minhas-assinaturas/assinar?assinaturaId=" +
                        signatureContent?.id,
                      "_blank"
                    );
                  }}
                  className="signatureButton"
                >
                  {" "}
                  <MdDraw size={24} />
                  Processo em Andamento
                </button>
              )}

              {signatureContent?.status === "FINALIZADO" && (
                <button
                  type="button"
                  onClick={() => {
                    let docSignKey;

                    if (signatureContent && signatureContent.signedDocuments) {
                      const signedDocs = signatureContent.signedDocuments;

                      for (const signedDoc of signedDocs) {
                        if (
                          signedDoc.docOrigin &&
                          signedDoc.docOrigin.cloudDocumentUuid ===
                            fileSelect.key
                        ) {
                          docSignKey = signedDoc.cloudDocumentUuid;
                        }
                      }
                    }

                    window.open(
                      "/assinaturas/minhas-assinaturas/documento-assinado?key=" +
                        (docSignKey ? docSignKey : "") +
                        "&signature-id=" +
                        signatureContent?.id,
                      "_blank"
                    );
                  }}
                  className="signedButton"
                >
                  {" "}
                  <MdDraw size={24} />
                  Ver Documento Assinado
                </button>
              )}

              <button type="button" onClick={() => handleDownloadFile()}>
                {" "}
                <MdFileDownload size={24} />
              </button>
              {/* <button type="button" onClick={() => window.print()}>
                <MdLocalPrintshop size={24} />
              </button> */}
              {shareFile && (
                <button
                  type="button"
                  className="shareBtn"
                  onClick={() => handleShareFile()}
                >
                  <MdInsertLink size={24} />
                  Compartilhar
                </button>
              )}
            </div>
          </ModalHeader>
          <ModalContent
            ref={modalContentRef}
            onClick={(e) => e.stopPropagation()}
          >
            {ViewComponent()}
          </ModalContent>
          {filesTypeToView && pdfType.includes(filesTypeToView) && (
            <ModalPdfPagination ref={modalPaginationRef}>
              <button
                type="button"
                onClick={() => {
                  if (pageNumber > 1) {
                    setPageNumber(pageNumber - 1);
                  }
                }}
              >
                <MdKeyboardArrowLeft size={24} />
              </button>
              <p>
                Página {pageNumber} de {numPages}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (pageNumber < numPages) {
                    setPageNumber(pageNumber + 1);
                  }
                }}
              >
                <MdKeyboardArrowRight size={24} />
              </button>
            </ModalPdfPagination>
          )}
        </ModalOverlay>
      ) : (
        <ModalViewFileComponent
          zIndex={9999}
          open={open}
          onCancel={handleCloseModal}
          footer={""}
          width={500}
        >
          <Spin spinning={loading}>{ViewComponent()}</Spin>
        </ModalViewFileComponent>
      )}
    </>
  );
}
