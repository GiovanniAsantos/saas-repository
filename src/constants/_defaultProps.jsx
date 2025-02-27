import {
  CrownFilled,
} from '@ant-design/icons';
const defaultProps = 

{
  route: {
    path: '/',
    routes: [
      {
        name: <></>, //this empty part is important as without it in mobile it wont render
        // icon: "",
        path: '/',
        href: '/ListTableList',
        routes: [
          {
            path: '/list/sub-page',
            name: 'Bpms',
            icon: <CrownFilled />,
            routes: [
              {
                path: '/dashboard',
                name: 'Dashboard',
                icon: <CrownFilled />,
              },
              {
                path: '/organogram',
                name: 'Organograma',
                icon: <CrownFilled />,
              }
            ],
          },
          {
            path: '/instancias',
            name: 'Instancias',
            icon: <CrownFilled />,
          }
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      icon: 'https://login-hmg.abablockchain.io/images/favicon.ico',
      title: 'ABABlockchain',
      desc: 'Plataforma',
      url: 'https://antv.vision/',
      target: '_blank',
    },
  ],
};
 export default defaultProps
