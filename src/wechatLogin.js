export default class wechatLogin 
{
	/**
	 * 合并参数值
	 * 
	 * @param {*} config 
	 */
	constructor(config) {
		const defaultConfig = {
			appid: '',
			isSaveUrl: true,
			urlSessionStorageName: 'redirct_url',
			redirect_uri: '',
			responseType: 'code',
			scope: 'snsapi_base',
			getCodeCallback: () => { },
		}
		this.config = Object.assign(defaultConfig, config)
	}

	// 获取当前需要记住的网址
	getRedirect (fullPath) {
		// router为 hash 模式时，需要去掉#以后的参数
		if( this.config.router.mode == 'hash' )
		{
			let redirectUri = window.location.href
			let redirectUriArr = redirectUri.split('#')
			return encodeURIComponent(redirectUriArr[0])
		}else{ 
			// router为 history 模式时，就需要组装授权请求地址
			//let host = window.location.protocol+'//'+window.location.host;
			let host = window.location.href;
			console.log('获取需要跳转的网址为：',host+fullPath);
			return encodeURIComponent(host+fullPath)
		}
	}

	/**
	 * 获取code认证值
	 */
	getCode (fullPath) {
		let authPageBaseUri = 'https://open.weixin.qq.com/connect/oauth2/authorize';

		let redirect_uri = this.getRedirect(fullPath);
		if( this.config.isSaveUrl ) {
			window.sessionStorage.setItem(this.config.urlSessionStorageName, redirect_uri);
		} else {
			redirect_uri = this.config.redirectUri
		}
		
		let authParams = `?appid=${this.config.appid}&redirect_uri=${redirect_uri}&response_type=${this.config.responseType}&scope=${this.config.scope}#wechat_redirect`;
		window.location.href = authPageBaseUri + authParams;
	}

	next (next) {
    return (to, code) => {
      if (code) {
        window.sessionStorage.setItem('wxcode', code);
        to? next(to): next();
      } else {
        to && next(to);
      }
    }
  }

	getCodeCallback(next, code) {
		return this.config.getCodeCallback(this.next(next),code);
	}

}