export default class wechatLogin 
{

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
	getRedirect(){
		let redirectUri = window.location.href
		// router为hash模式时，需要去掉#以后的参数
		if( redirectUri.indexOf('#') != -1 )
		{
			let redirectUriArr = redirectUri.split('#')
			redirectUri = encodeURIComponent(redirectUriArr[0])
		}else{ 
			// router为html5模式时，就直接用全地址
			redirectUri = encodeURIComponent(redirectUri)
		}
		return redirectUri;
	}

	/**
	 * 获取code认证值
	 */
	getCode () {
		let authPageBaseUri = 'https://open.weixin.qq.com/connect/oauth2/authorize';

		let redirect_uri = this.getRedirect();
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