//自调用函数，开启一个新的局部作用域，防止命名冲突
(function () {
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
/*
//   方法一：用最后一个蛇节来获取增加蛇节的长度块
this.body.push({
    x: last.x,
    y: last.y,
    color: last.color
});
*/
//  方法二：用extend方法继承增加蛇节的长度
        var obj = {
            //对象拷贝
            extend(last, obj) {
              this.body.push(obj);  
            }

        }


        //随机在地图上生成食物
        food.render(map)
    }
};


window.Snake = Snake;

})();