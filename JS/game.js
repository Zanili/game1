//使用自调用函数，创建一个新的局部作用域，防止命名冲突
(function (){
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
})();



