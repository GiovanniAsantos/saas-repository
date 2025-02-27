import { createStore } from "redux";
import reducers from "./reducers";

// Verifica se estamos no cliente antes de acessar `window`
const store = createStore(
  reducers,
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
);

export default store;
