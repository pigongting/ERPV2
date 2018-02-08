import update from 'immutability-helper';
import { removelocal, removelocalkeepmain, removelocalkeepsub, removelocalkeepthree, getlocalname } from '../utils/localpath';

const initstate = {
  mainSiderCollapsed: false,
  subSiderCollapsed: false,
  pageTitle: '',
  mainmenu: [],
  submenu: [],
  submenudata: {},
  menuSelect: {
    main: [],
    sub: [],
    open: [],
  },
  menudate: [],
};

try {
  initstate.menudate = JSON.parse(localStorage.getItem('moduleList')) || [];
  initstate.menudate.unshift({
    id: 2000000,
    parentId: 0,
    url: 'index',
    icon: 'home',
    name: '主页',
  });
} catch (e) {
  console.log(e);
}

export default {

  namespace: 'pageframe',

  state: initstate,

  reducers: {
    toggleMainSiderCollapsed(state, data) {
      return update(state, {
        mainSiderCollapsed: {
          $set: data.payload,
        },
      });
    },
    toggleSubSiderCollapsed(state, data) {
      return update(state, {
        subSiderCollapsed: {
          $set: data.payload,
        },
      });
    },
    getMainMenu(state, data) {
      const mainmenuArray = [];
      const submenuArray = {};

      data.payload.map((sitem, key) => {
        const mainmenuItem = { ...sitem };

        mainmenuItem.submenu = !!sitem.submenu;

        if (sitem.submenu) {
          if (sitem.submenu[0].submenu) {
            mainmenuItem.url = sitem.submenu[0].submenu[0].url;
          } else {
            mainmenuItem.url = sitem.submenu[0].url;
          }

          for (let ss = 0; ss < sitem.submenu.length; ss++) {
            const ssitem = sitem.submenu[ss];

            if (ssitem.submenu) {
              ssitem.url = ssitem.submenu[0].url;

              for (let sss = 0; sss < ssitem.submenu.length; sss++) {
                const sssitem = ssitem.submenu[sss];
                sssitem.parentparentId = sitem.id;
              }
            }
          }
        }

        mainmenuArray.push(mainmenuItem);

        if (sitem.submenu) {
          submenuArray[sitem.id] = sitem.submenu;
        }

        return undefined;
      });

      return update(state, {
        mainmenu: {
          $push: mainmenuArray,
        },
        submenudata: {
          $set: submenuArray,
        },
      });
    },
    getSubMenu(state, action) {
      const curpath = removelocal(action.payload);

      let submenu = null;
      let curmainmenu = null;
      let ssmenuid;
      let sssmenuid;

      for (const key in state.submenudata) {
        if (key) {
          const sitem = state.submenudata[key];

          for (let ss = 0; ss < sitem.length; ss++) {
            const ssitem = sitem[ss];

            if (!ssitem.submenu) {
              if (`/${ssitem.url}` === curpath) {
                submenu = sitem;
                ssmenuid = ssitem.id;

                for (let s = 0; s < state.mainmenu.length; s++) {
                  if (ssitem.parentId === state.mainmenu[s].id) {
                    curmainmenu = state.mainmenu[s];
                  }
                }

                break;
              }
            } else {
              for (let i = 0; i < ssitem.submenu.length; i++) {
                const sssitem = ssitem.submenu[i];

                if (`/${sssitem.url}` === curpath) {
                  submenu = sitem;
                  ssmenuid = ssitem.id;
                  sssmenuid = sssitem.id;

                  for (let s = 0; s < state.mainmenu.length; s++) {
                    if (sssitem.parentparentId === state.mainmenu[s].id) {
                      curmainmenu = state.mainmenu[s];
                    }
                  }

                  break;
                }
              }
            }

            if (submenu) {
              break;
            }
          }
        }
      }

      return update(state, {
        submenu: {
          $set: submenu,
        },
        pageTitle: {
          $set: (curmainmenu) ? curmainmenu.name : '',
        },
        menuSelect: {
          main: {
            $set: (curmainmenu) ? [`${curmainmenu.id}`] : [],
          },
          sub: {
            $set: [`${ssmenuid}`, `${sssmenuid}`],
          },
          open: {
            $set: [`${ssmenuid}`],
          },
        },
      });
    },
    submenuChange(state, data) {
      return update(state, {
        menuSelect: {
          open: {
            $set: data.payload,
          },
        },
      });
    },
  },

  effects: {},

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'getMainMenu', payload: initstate.menudate });

      return history.listen(({ pathname, query }) => {
        const localname = getlocalname(pathname);

        // 未登录跳转
        if (!localStorage.getItem('moduleList') && pathname !== `/${localname}/login`) {
          history.replace(`/${localname}/login`);
          return;
        }

        dispatch({ type: 'getSubMenu', payload: query.frommenu || pathname });

        // if (removelocal(pathname) === '/index') {
        //   dispatch({ type: 'toggleMainSiderCollapsed', payload: false });
        // } else {
        //   dispatch({ type: 'toggleMainSiderCollapsed', payload: true });
        // }
      });
    },
  },

};
