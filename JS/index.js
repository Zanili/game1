//合并所有js代码为一个js代码文件
//如果在合并中两个连续自调用函数合并时出现错误时，在每个自调用函数代码前面加一个分号“ ' ; ‘  避免加载出现错误。


/*-------------Tools--------------*/
//自调用函数传入window的目的是：让代码可以被压缩
//undefined:防止参数被改变
;(function (window,undefined) {
    var Tools = {

        getRandom: function(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    };
    window.Tools = Tools;
})(window,undefined);


/*-------------food--------------*/
//所有的js文件中书写代码，都是全局作用域

//匿名函数，自调用函数----开启一个新的作用域，避免命名冲突(function () { })()
;(function (window,undefined)
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
})(window,undefined);



/*-------------snake--------------*/
//自调用函数，开启一个新的局部作用域，防止命名冲突
;(function (window,undefined) {
    var position = 'absolute';
    //定义空数组记录之前创建的蛇
    var elements = [];
    function Snake(options) {
        //设置默认值，在未赋值时返回空对象默认值
        options = options ||{} ;
        //蛇节的大小
        this.width = options. width ||20;
        this.height = options. height ||20;
        //蛇移动的方向
        this.direction = options.direction ||'right';
        //蛇节第一个元素是蛇头
        this.body = [
            {x: 3, y: 2, color: 'red'},
            {x: 2, y: 2, color: 'blue'},
            {x: 1, y: 2, color: 'blue'}
        ];
    }
    Snake.prototype.render = function (map) {
        //删除之前创建的蛇
        remove();
        //把每一个蛇节渲染到地图上
        for (var i = 0, len = this.body.length; i< len; i++){
            //蛇节
            var object = this.body[i];
            //
            var div = document.createElement('div')
            map.appendChild(div);

            //记录当前的蛇
            elements.push(div);
            //设置样式
            div.style.position = position;
            div.style.left = object.x * this.width + 'px';
            div.style.top = object.y * this.height + 'px';
            div.style.width = this.width + 'px';
            div.style.height = this.height + 'px';
            div.style.backgroundColor = object.color;
        }
    }
//定义私有的成员函数
    function remove(){
        //从最后一个往前面删除
        for (var i = elements.length - 1; i >= 0; i--){
            //删除div
            elements[i].parentNode.removeChild(elements[i]);
            //删除数组中的元素
            elements.splice(i, 1);
        }
    }

//控制蛇移动的方法
    Snake.prototype.move = function(food,map){

        //控制蛇的身体移动（当前蛇节 到 上一个蛇节的位置）
        for (var i = this.body.length - 1; i > 0;i--){
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        //控制蛇头移动
        //判断蛇移动的方向
        var head = this.body[0];
        switch (this.direction) {
            case 'right':
                head.x += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'top':
                head.y -= 1;
                break;
            case  'bottom':
                head.y += 1;
                break;
        }
        // 2.4判断蛇头是否和食物坐标重合
        var headX = head.x * this.width;
        var headY = head.y * this.height;
        if (headX === food.x && headY === food.y){
            //让蛇增加一节，
            var last = this.body[this.body.length - 1];
            this.body.push({
                x: last.x,
                y: last.y,
                color: last.color
            })
            //随机在地图上生成食物
            food.render(map)
        }
    };


    window.Snake = Snake;

})(window,undefined);


/*-------------game--------------*/
//使用自调用函数，创建一个新的局部作用域，防止命名冲突
;(function (window,undefined){
    var that;   //记录游戏对象
    function Game(map) {
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
        that =this;
    }
    Game.prototype.start = function (map) {
        //1.把蛇和食物对象，渲染到地图上 

        this.food.render(this.map);
        this.snake.render(this.map);

        //2.开始游戏的逻辑
        //2.1让蛇能够移动起来
        runSnake();

        //2.2当蛇遇到边界时游戏结束

        //2.3通过键盘来控制蛇移动的方向
        bindkey();
        //2.4当蛇遇到食物 做相应的处理


    };



    function bindkey() {

        /*document.onkeydown = function () {} */
        document.addEventListener('keydown',function (e) {
            /*console.log(e.key);*/
            //ArrowUp --top
            //ArrowDown --bottom
            //ArrowLeft --left
            //ArrowRight--right
            switch (e.keyCode) {
                case 38:
                    this.snake.direction = 'top';
                    break;
                case 40:
                    this.snake.direction = 'bottom';
                    break;
                case 37:
                    this.snake.direction = 'left';
                    break;
                case 39:
                    this.snake.direction = 'right';
                    break;
            }
        }.bind(that),false);
    }
//私有的函数
    function runSnake(){
        var timerId = setInterval(function () {
            //在定时器的function中的this是指向window对象的
            this.snake.move(this.food,this.map);
            this.snake.render(this.map);
            //2.2当蛇遇到边界游戏结束
            //获取蛇头位置坐标
            var maxX = this.map.offsetWidth / this.snake.width;
            var maxY = this.map.offsetHeight / this.snake.height;
            var headX = this.snake.body[0].x;
            var headY = this.snake.body[0].y;
            if (headX < 0 ||headX  >= maxX){
                alert('Game Over');
                clearInterval(timerId);
            }
            if (headY < 0 ||headY >= maxY){
                alert('Game Over');
                clearInterval(timerId);
            }
        }. bind(that),150);
    }
//能让外部访问
    window.Game = Game;
})(window,undefined);





/*-------------main--------------*/
;(function (window,undefined) {
    /*//测试Food

    var food = new Food();
    var map = document.getElementById('map');
    food.render(map);

    //测试Snake
    var snake = new Snake();
    var map = document.getElementById('map')
    snake.render(map);*/

    //测试Game

    var map = document.getElementById('map')
    var game = new Game(map);
    game.start(map);



})(window,undefined);