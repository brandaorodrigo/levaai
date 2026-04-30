import "./App.scss";
import "antd/dist/reset.css";
import { App as AppOriginal, ConfigProvider } from "antd";
import ptBR from "antd/es/locale/pt_BR";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import routes from "./Routes";
import { theme } from "./theme/theme";
import { parseJSON } from "./utils/javascript";
import "./index.css";

// user --------------------------------------------------------------------------------------------

const userItem = window.localStorage.getItem("user");
const user = parseJSON(userItem, {}) as any;

export { user };

// axios -------------------------------------------------------------------------------------------

axios.defaults.baseURL = import.meta.env.VITE_API;

axios.defaults.headers.common.Authorization = `Bearer ${user?.token}`;

axios.interceptors.response.use(
  async (response) => {
    if (response.status === 202) {
      return axios(response.config);
    }
    if (response?.status === 200 && typeof response?.data !== "object") {
      response.data = {};
    }
    return response;
  },
  async (error) => {
    const localhost = window.location.hostname === "localhost";
    if (!localhost && error.response?.status !== 400) {
      window.localStorage.removeItem("user");
      window.location.reload();
    }
    const name = error?.response?.data?.name;
    const message = error?.response?.data?.error?.message;
    const code = error?.response?.data?.error?.code;
    throw new Error(name || message || code || "UNKNOWN_ERROR");
  },
);

// =================================================================================================

const App: React.FC = () => {
  return (
    <ConfigProvider
      componentSize="middle"
      form={{
        requiredMark: "optional",
        scrollToFirstError: true,
        validateMessages: { required: ["$", "{label} OBRIGATÓRIO"].join("") },
      }}
      locale={ptBR}
      theme={theme}
    >
      <AppOriginal>
        <AuthProvider>
          <RouterProvider
            router={createBrowserRouter([routes.login, routes.private], {
              basename: import.meta.env.BASE_URL,
            })}
          />
        </AuthProvider>
      </AppOriginal>
    </ConfigProvider>
  );
};

export default App;
