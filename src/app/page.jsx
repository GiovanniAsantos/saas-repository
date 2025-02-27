"use client";
import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components";
import { Avatar, Button, Dropdown } from "antd";
import { useEffect, useState } from "react";
import { useKeycloak } from "../auth/keycloakProvider";
import defaultProps from "../constants/_defaultProps";
import { AccountMeService } from "../Services/AccountMeService";
import { useRouter } from "next/navigation";

const loading = () => (
  <div style={{ textAlignLast: "center", fontSize: "20px" }}>
    <Avatar
      src="https://aba-public.s3.amazonaws.com/icon_original_transparente.png"
      className="logoAnimation"
      size={80}
    />
    <p>Carregando...</p>
  </div>
);

export default function RootLayout({ children }) {
  const { initialized, authenticated, account, logout } = useKeycloak();
  const router = useRouter();
  const accountMeService = new AccountMeService();

  const [accountMe, setAccountMe] = useState();

  const settings = {
    fixSiderbar: true,
    layout: "mix",
    splitMenus: true,
  };

  const [pathname, setPathname] = useState("/list/sub-page/sub-sub-page1");

  const [domLoaded, setDomLoaded] = useState(false);

  const avatarDefault = process.env.NEXT_PUBLIC_ICON_WHITE_ORIGINAL_TRANSPARENT;
  const logoBlue = process.env.NEXT_PUBLIC_LOGO_BLUE_TRANSPARENT;

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem(USER_TOKEN);
      keycloak.logout();
    } catch (e) {
      console.log(e);
    }
  };

  const getAccountMe = () => {
    accountMeService
      .getMe()
      .then((data) => {
        setAccountMe(data?.content);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Erro desconhecido";
        message.error(errorMessage);
      });
  };

  useEffect(() => {
    if (initialized && authenticated) {
      getAccountMe();
    }
  }, []);

  useEffect(() => {
    if (initialized && !authenticated) {
      localStorage.removeItem("token");
      logout();
      router.push(`/`);
    } else {
      window.addEventListener("resize", () => {
        console.log(window.innerHeight, window.innerWidth);
      });
      setDomLoaded(true);
    }
  }, []);

  if (!initialized) {
    return loading();
  }

  return (
    <>
      {authenticated && (
        <>
          {domLoaded ? (
            <div
              id="test-pro-layout"
              style={{
                height: "100vh",
              }}
            >
              <ProLayout
                bgLayoutImgList={[
                  {
                    src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                    left: 85,
                    bottom: 100,
                    height: "303px",
                  },
                  {
                    src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                    bottom: -68,
                    right: -45,
                    height: "303px",
                  },
                  {
                    src: "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
                    bottom: 0,
                    left: 0,
                    width: "331px",
                  },
                ]}
                {...defaultProps}
                location={{
                  pathname,
                }}
                menu={{
                  type: "group",
                }}
                avatarProps={{
                  src: { avatarDefault },
                  size: "small",
                  title: authenticated
                    ? account?.name + " LOGADO"
                    : "Deslogado",
                }}
                actionsRender={(props) => {
                  if (props.isMobile) return [];
                  const bb = authenticated ? (
                    <Dropdown placement="bottomRight" arrow>
                      <Button
                        type="link"
                        icon={<UserOutlined />}
                        style={{
                          float: "right",
                          margin: "16px 24px 16px 0",
                        }}
                      >
                        {account?.name}
                      </Button>
                    </Dropdown>
                  ) : (
                    <Button
                      type="link"
                      style={{ float: "right", margin: "16px 24px 16px 0" }}
                    >
                      Login
                    </Button>
                  );

                  return [
                    <InfoCircleFilled key="InfoCircleFilled" />,
                    <QuestionCircleFilled key="QuestionCircleFilled" />,
                    <GithubFilled key="GithubFilled" />,
                    bb,
                  ];
                }}
                menuFooterRender={(props) => {
                  if (props?.collapsed) return undefined;
                  return (
                    <div
                      style={{
                        textAlign: "center",
                        paddingBlockStart: 12,
                      }}
                    >
                      <div>© 2024</div>
                      <div>AbaBlockchain</div>
                    </div>
                  );
                }}
                onMenuHeaderClick={(e) => console.log(e)}
                title="nIAM"
                logo={logoBlue}
                headerTitleRender={(logo, title, _) => {
                  return <a>{logo}</a>;
                }}
                menuItemRender={(item, dom) => (
                  <div
                    onClick={() => {
                      if (item.path) {
                        router.push(item.path);
                      }
                    }}
                  >
                    {dom}
                  </div>
                )}
                {...settings}
              >
                <PageContainer breadcrumb={false} title={false}>
                  <ProCard
                    style={{
                      height: "auto",
                      minHeight: 800,
                    }}
                  >
                    {children}
                  </ProCard>
                </PageContainer>
              </ProLayout>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
