localStorage.setItem('token',123)
localStorage.setItem('refresh',456)
let arr = [],isRefreshToken = true

function get(url,params){    //封装请求
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

function checkToken(res){    //验证token是否失效
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

function getRefreshToken(){	   //获取新token
	get('https://www.easy-mock.com/mock/5d52485a4245803a2dd16054/getToken').then(res=>{
		localStorage.setItem('token',res.data.token)
		localStorage.setItem('refresh',res.data.refresh)
		isRefreshToken = true
		mapArr()
	})
}

function addSubscribe(callabck){	//存接口数组
	arr.push(callabck)
}

function mapArr(){	//重新发送请求 
	arr.map((e)=>{
		e()
	})
	arr = []
}

let ar = [1,2,3,4,5]
	
for(let i of ar){
	get('https://www.easy-mock.com/mock/5d52485a4245803a2dd16054/getContentList',{id:i})
}