<h1>手写一个无缝轮播</h1>

<img src="https://i.loli.net/2018/05/30/5b0e7b8ee9d31.jpg" alt="图" title="无缝轮播" />

<p>做了一个无缝轮播：插入img自动生成按钮，更改图片尺寸不影响无缝轮播效果；</p>

<p><strong>关键词：</strong>JavaScript、jQuery</p>

<p><strong>描述：</strong>该无缝轮播能够自动播放、点击前后按钮切换图片、点击第N个灰色按钮切换到第N张图片。通过百分比布局实现更改图片尺寸不影响无缝轮播效果，通过jQuery动态生成与img数量相等的button，通过jQuery动态增删class来激活button的状态。</p>

<strong>源码链接：</strong>
<p>本页</p>

<strong>预览链接：</strong>

<a href="https://yuyunzhi.github.io/slides-demo-3/slidesdemo.html">无缝轮播啊</a>

<h2>一、怎么做呢？先说说原理</h2>

<ul>
    <li>找到3张图片无缝切换的规律</li>
    <li>给三张图分别编号为a,b,c</li>
    <li>动态生成首尾两张“假图”：c',a,b,c,a'</li>
    <li>开始时的窗口位于a</li>
    <li>当向右播放到c的时候，并不是进到a</li>
    <li>而是到a'，同时用hide()隐藏移动到a窗口再show()出来，那么再播放的时候就到b了</li>
    <li>反之亦然</li>
    <li>常量存入变量，动态获取img数量，根据数量生成等数量的button</li>
    <li>动态获取图片的宽高，将移动的常量赋值给变量let $width</li>
    <li>百分比布局，把css具体的定位值改为百分数</li>
</ul>

<h2>二、所用到的知识点</h2>

<h3>1、setInterval</h3>

<p>创建建定时器</p>

```
let timer = setInterval(function(){
    //执行。。。。
},autoPlaySpeed)
```

<p>停止定时器</p>

```
window.clearInterval(timer)
```

<h3>2、xxx.clone()</h3>

<p>复制第一个img并插入到末尾</p>

```
let $firstCopy = $images.eq(0).clone(true)
$slides.append($firstCopy)
```

<p>复制最后一个img并插入开头</p>

```
let $lastCopy = $images.eq($images.length-1).clone(true)
$slides.prepend($lastCopy)
```

<h3>3、xxx.one('click',()=>{})与xxx.on('click',()=>{})</h3>

```
xxx.one('click',()=>{})//对元素点击事件只监听一次后就不再监听
xxx.on('click',()=>{})//持续对元素进行点击事件的监听
```

<h3>4、hide()与show()同时使用</h3>

```
$slides.css({
    transform:`translateX(-400px)`
})
.one('transitionend',function(){
    $slides.hide()
    .offset()
    $slides.css({transform:`translateX(-400px)`})
    .show()
})
```
<p>注意：在hide()与 show()之间插入offset()，会阻断浏览器同时执行hide()show()，这是个小技巧。</p>

<h2>三、实现功能</h2>

<p><strong>1、绑定事件：</strong>clickNext()、clickPrevious()、clickNumber()、mouseEnterStop()、mouseLeavePlay()</p>

```
//鼠标点击下一张
function clickNext(){
    $('#next').one('click',function(){
        setTimeout(()=>{
            goToSlide(current+1)
            clickNext()
        },duration)
    })
}

//鼠标点击上一张
function clickPrevious(){
    $('#previous').one('click',function(){
        setTimeout(()=>{
            goToSlide(current-1)
            clickPrevious()
        },duration)
    })
}

//鼠标点击数字按钮(蓝圈)
function clickNumber(){
    $('#buttons').on('click','button',function(e){
 let $button = $(e.currentTarget)
 let index = $button.index()
        goToSlide(index)
    })
}

//鼠标进入图片，停止播放
function mouseEnterStop(){
    $('.container').on('mouseenter',function(){
        window.clearInterval(timer)
    })
}

//鼠标离开图片，继续播放
function mouseLeavePlay(){
    $('.container').on('mouseleave',function(){
        timer = setInterval(function(){
            goToSlide(current+1)
        },autoPlaySpeed)
    })
}
```

<p>注意下段代码表示：当点击一次向前切换一张图的按钮后，该click事件就不再监听了（因为用的是one）。然后执行第一次点击后执行的函数，duration毫秒后向前切换一张图，并且再次调用clickPrevious(),于是又可以进行监听了。<strong>这样的好处是，用户快速点击的时候不会出现bug。</strong></p>

```
clickPrevious()
function clickPrevious(){
    $('#previous').one('click',function(){
        setTimeout(()=>{
            goToSlide(current-1)
            clickPrevious()
        },duration)
    })
}
```

<h3>2、goToSlide()</h3>

```
function goToSlide(index){
    if(index>$buttons.length-1){
           index=0
       }else if(index<0){
           index=$buttons.length-1
       }
   
    if(current === $buttons.length-1 && index === 0){
    //最后一张到第一张
         let n = -($buttons.length+1)*$width
         $slides.css({
               transform:`translateX(${n}px)`
           })
          .one('transitionend',function(){
               $slides.hide()
               .offset()//这是小技巧，hide() show()之间插入offset()，阻断浏览器同时执行
               $slides.css({transform:`translateX(${-$width}px)`})
               .show()
           })   
       }else if(current === 0 && index === $buttons.length-1){
    //第一张到最后一张
         let n = -(index+1)*$width
               $slides.css({
               transform:'translateX(0px)'
           })
               .one('transitionend',function(){
               $slides.hide()
               .offset()
               $slides.css({transform:`translateX(${n}px)`})
               .show()
           })  
       }else{
           let n = -(index+1)*$width
           $slides.css({
               transform:`translateX(${n}px)`
           })
       }
   //对button的状态激活
       whichPicture=index+1
       $(`.container>.buttons>button`).removeClass('active')
       $(`.container>.buttons>button:nth-child(${whichPicture})`).addClass('active')
   
      current = index
}
```

<h2>四、解决2个bug</h2>

<ol>
    <li>用户快速点击前一张后一张按钮出现bug，解决方案上面写了。</li>
    <li>当用户突然不看该页面a，而打开了b页面，过了一段时间再开a页面会发现图片切换出现bug（自动播放）。解决方案是，监听用户是否离开了a页面，如果离开了就停止定时器，回到a页面的时候就开启定时器，如下代码：</li>
</ol>

```
let autoPlaySpeed = 1500  //毫秒
//计时器，自动播放，同时解决页面hidden的Bug
document.addEventListener("visibilitychange",function(e){
 if(document.hidden){
        window.clearInterval(timer)
    }else{
         timer = setInterval(function(){
             goToSlide(current+1)
    },autoPlaySpeed)
    }
})

let timer = setInterval(function(){
    goToSlide(current+1)
},autoPlaySpeed)
```

