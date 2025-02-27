export const Colors = [
    {
      name: "softBlue",
      primary: "#5A9BD5", // azul suave
      secondary: "#E8F2FA", // azul muito claro
    },
    {
      name: "softGreen",
      primary: "#8BC34A", // verde suave
      secondary: "#EDF7E6", // verde muito claro
    },
    {
      name: "softPurple",
      primary: "#AB7AC1", // roxo suave
      secondary: "#F2EAF5", // roxo muito claro
    },
    {
      name: "softTeal",
      primary: "#4DB6AC", // verde-água suave
      secondary: "#E6F7F6", // verde-água muito claro
    },
    {
      name: "softCoral",
      primary: "#FF8A65", // coral suave
      secondary: "#FFEDE7", // coral muito claro
    },
    {
      name: "softYellow",
      primary: "#FDD835", // amarelo suave
      secondary: "#FFF9E6", // amarelo muito claro
    },
    {
      name: "softPink",
      primary: "#F48FB1", // rosa suave
      secondary: "#FFE6EE", // rosa muito claro
    },
    {
      name: "softLavender",
      primary: "#9575CD", // lavanda suave
      secondary: "#EFE6FA", // lavanda muito claro
    },
    {
      name: "softGray",
      primary: "#B0BEC5", // cinza suave
      secondary: "#F2F5F7", // cinza muito claro
    },
    {
      name: "softPeach",
      primary: "#FFB74D", // pêssego suave
      secondary: "#FFF3E0", // pêssego muito claro
    },
    {
      name: "softMint",
      primary: "#76D7C4", // menta suave
      secondary: "#E0F8F5", // menta muito claro
    },
    {
      name: "softRed",
      primary: "#E57373", // vermelho suave
      secondary: "#FFEBEB", // vermelho muito claro
    },
    {
      name: "softCyan",
      primary: "#4DD0E1", // ciano suave
      secondary: "#E0F7FA", // ciano muito claro
    },
    {
      name: "softIndigo",
      primary: "#7986CB", // índigo suave
      secondary: "#E8EAF6", // índigo muito claro
    },
    {
      name: "softOrange",
      primary: "#FFB74D", // laranja suave
      secondary: "#FFF3E0", // laranja muito claro
    },
    {
      name: "softBrown",
      primary: "#A1887F", // marrom suave
      secondary: "#EFE7E6", // marrom muito claro
    },
    {
      name: "softLime",
      primary: "#DCE775", // limão suave
      secondary: "#F9FBE7", // limão muito claro
    },
    {
      name: "softOlive",
      primary: "#A3A847", // oliva suave
      secondary: "#F6F9E1", // oliva muito claro
    },
    {
      name: "softPlum",
      primary: "#9C27B0", // ameixa suave
      secondary: "#F3E5F5", // ameixa muito claro
    },
    {
      name: "vibrantMagenta",
      primary: "#E91E63", // magenta vibrante
      secondary: "#FCE4EC", // magenta claro
    },
    {
      name: "vibrantOrange",
      primary: "#FF5722", // laranja vibrante
      secondary: "#FFEBE5", // laranja claro
    },
  ];
  
  export const getSecundaryColor = (primaryColor) => {
    const color = Colors?.filter(
      (c) => c?.primary?.toUpperCase() === primaryColor?.toUpperCase()
    )[0];
    if (color == undefined) {
      return primaryColor;
    } else {
      return color?.secondary;
    }
  };
  