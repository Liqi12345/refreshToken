localStorage.setItem('token',123)
localStorage.setItem('refresh',456)
let arr = [],isRefreshToken = true

function get(url,params){
	let token = localStorage.getItem('token')
	return axios.get(
						url,
						{	
							params,
							headers:{
								'Content-Type':'application/json;charset=UTF-8',
								'Authorization': 'Bearer ' + token,
							}
						}
				).then(checkToken)
				.catch(err=>{console.log(arr)})
}



	get('https://www.easy-mock.com/mock/5d52485a4245803a2dd16054/getContentList',{id:1})
	get('https://www.easy-mock.com/mock/5d52485a4245803a2dd16054/getContentList',{id:2})
	get('https://www.easy-mock.com/mock/5d52485a4245803a2dd16054/getContentList',{id:3})
	get('https://www.easy-mock.com/mock/5d52485a4245803a2dd16054/getContentList',{id:4})
	get('https://www.easy-mock.com/mock/5d52485a4245803a2dd16054/getContentList',{id:5})

function checkToken(res){
	if(res.data.code == 1002){
		if(isRefreshToken){
			getRefreshToken()
		}
		isRefreshToken = false
		
		return new Promise((resolve,reject)=>{
			addSubscribe(()=>{
				resolve(get(res.config.url,res.config.params))
			})
		})
		
	}else{
		return res
	}
}

function getRefreshToken(){
	get('https://www.easy-mock.com/mock/5d52485a4245803a2dd16054/getToken').then(res=>{
		localStorage.setItem('token',res.data.token)
		localStorage.setItem('refresh',res.data.refresh)
		isRefreshToken = true
		mapArr()
	})
}

function addSubscribe(callabck){
	arr.push(callabck)
}

function mapArr(){
	arr.map((e)=>{
		e()
	})
	arr = []
}
