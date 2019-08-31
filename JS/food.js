//所有的js文件中书写代码，都是全局作用域

//匿名函数，自调用函数----开启一个新的作用域，避免命名冲突(function () { })()
(function () 
{
    var position = 'absolute';
//记录上一次创建的食物，为删除做准备
    var element = [];
    function Food(options) {
        options = options || {};
        this.x =  options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 20;
        this.height = options.height || 20;
        this.color = options.color || 'green';
    }

//渲染创建food的显示方法
    Food.prototype.render = function (map) {
        //删除之前创建的食物
        remove();

        //随机设置生成的坐标点
        this.x = Tools.getRandom(0,map.offsetWidth/this.width-1) * this.width;
        this.y = Tools.getRandom(0,map.offsetHeight/this.height-1) * this.height;

        //创建一个动态div，表示页面上显示的食物
        var div = document.createElement('div')
        map.appendChild(div);
        element.push(div);
        /* var div = document.getElementById('map').appendChild('div');*/
        div.style.position = position;
        div.style.left = this.x + 'px'
        div.style.top = this.y + 'px'
        div.style.width = this.width + 'px'
        div.style.height = this.height + 'px'
        div.style.backgroundColor = this.color;
    }
    function remove() {
        for (var i = element.length - 1;i >= 0; i --) {
            //删除div
            element[i].parentNode.removeChild(element[i]);
            element.splice(i, 1);
        }

    }
//把Food构造函数  让外部能访问到使用window
    window.Food=Food; 
})();


