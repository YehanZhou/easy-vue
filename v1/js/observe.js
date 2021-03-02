function Observe(obj, key, value) { // 观察者，数据拦截，加getter，setter
    const dep = new Dep()
    if(Object.prototype.toString.call(value) === '[object objest]') {
        Object.keys(value).forEach(k => {
            new Observe(value, k, value[k])
        })
    }

    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get () {
            if (Dep.target) {
                dep.addSub(Dep.target) // 添加订阅：收集依赖
            }
            return value
        },
        set (newVal) {
            if (value === newVal) return
            value = newVal
            dep.notify() // 订阅管理器dep发布更新消息，触发订阅者回调
        }
    })
}

function Watcher(fn) { // 订阅者
    this.update = function () {
        Dep.target = this
        fn.call() // vue中这个回调就是updateComponent，做了生成虚拟DOM（_render），更新真实DOM（_update）的操作
        Dep.target = null
    }
    this.update()
}

function Dep() { // 订阅管理器
    this.subs = []

    this.addSub = function (sub) {
        this.subs.push(sub)
    }

    this.notify = function () {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}