const mutations = {
  mutationsIsShowMoreMenus(state, payload) {
    state.isShowMoreMenus = payload
  },
  mutationsLogin(state){
    state.isLogined= true 
  },mutationsLoginname(state, payload) {
    state.loginname = payload
  },
  mutationsAccessToken(state, payload) {
    state.AccessToken = payload
  },mutationsLogout(state){
    state.isLogined= false;
    state.loginname = '';
    state.AccessToken = '';
  },
};

export default mutations;
