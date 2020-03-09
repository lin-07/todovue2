(function (Vue) {
	var STORAGE_KEY = 'items-vue.js';

	const itemStorage = {
		fetch () {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		},
		set (items) {
			localStorage.setItem(STORAGE_KEY,JSON.stringify(items))
		}
	}
	const items = [
		{
			id:'1',
			content:'vue.js',
			completed:false
		},
		{
			id:'2',
			content:'java',
			completed:false
		},
		{
			id:'3',
			content:'php',
			completed:true
		}
	]

	
	//全局自定义指令
	Vue.directive('app-focus',{
		inserted (el,binding) {
			el.focus()
		}
	})
	
	var app = new Vue({
		el:'#todoapp',
		data:{
			items: itemStorage.fetch(), //等价于items: items  es6的简写方式
			currentItem: null,
			filterStatus: 'all'
		},
		watch: {
			items: {
				//开启深度监听
				deep: true,
				handler (newItems,oldItems) {
					itemStorage.set(newItems);
				}
			}
		},
		directives: {
			'todo-focus': {
				update (el,binding) {
					if (binding.value) {
						el.focus()
					}
				}
			}
		},
		computed: {
			//任务项过滤计算属性
			filterItems () {
				switch (this.filterStatus) {
					case 'active':
						return this.items.filter((item) => !item.completed)
						break;
					case 'completed':
						return this.items.filter((item) => item.completed)
						break
					default:
						return this.items
						break;
				}
			},
			//复选框计算属性
			toggleAll : {
				get () {
					//当未完成任务项为0的时候选中复选框
					return this.remaining === 0
				},
				set (newStatus) {
					//设置所有任务项与复选框任务项状态一致
					this.items.forEach((item) => {
						item.completed = newStatus
					})
				}
			},
			//未完成任务数量计算属性
			remaining () {
				const unItems = this.items.filter((item) => {
					return !item.completed
				})
				return unItems.length
			}
		},
		methods: {
			//完成编辑
			finishEdit (item,index,event) {
				const content = event.target.value.trim()
				if(!content.length){
					//如果为空移除任务项
					this.removeItem(index)
					return
				}
				item.content = content
				this.currentItem = null

			},
			//取消编辑
			cancelEdit () {
				this.currentItem = null
			},
			//进入编辑状态
			toEdit (item) {
				this.currentItem = item
			},
			//移除所有已完成任务项
			removeCompleted () {
				this.items = this.items.filter((item) => !item.completed)
			},
			//移除任务项
			removeItem (index) {
				//从index下标开始移除，移除一个
				this.items.splice(index,1)
			},
			//增加任务项
			addItem (event) {
				//1.获取输入框的数据
				const content = event.target.value.trim()
				//2.如果输入框的值为空什么都不做
				if(!content.length){
					return
				}
				//3.如果不为空，添加到数据中
				const id = items.length + 1
				this.items.push({
					id,
					content,
					completed:false
				})
				//4.清空文本框的内容
				event.target.value = ''
			}
		},
	})
	//当路由 hash 值改变后会自动调用此函数
	window.onhashchange = function () {
		var hash = window.location.hash.substr(2) || 'all'
		app.filterStatus = hash
	}
	//第一次访问页面时,调用一次让状态生效
	window.onhashchange()

})(Vue);
