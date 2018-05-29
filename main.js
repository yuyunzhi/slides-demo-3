
let $buttons
let $slides = $('#slides')
let current = 0
let $images = $slides.children('img')
let $buttonsNumber = $images.length


/**无缝轮播逻辑**/
init($buttonsNumber)

bindEvents();







//鼠标点击下一张
function clickNext(){
    $('#next').one('click',function(){
        setTimeout(()=>{
            goToSlide(current+1)
            clickNext()
        },300)
    })
    
}


//鼠标点击上一张
function clickPrevious(){
    $('#previous').one('click',function(){
        setTimeout(()=>{
            goToSlide(current-1)
            clickPrevious()
        },300)
    })
}

/*
//计时器，自动播放，同时解决页面hidde的Bug
document.addEventListener("visibilitychange",function(e){
    if(document.hidden){
        window.clearInterval(timer)
    }else{
        timer = setInterval(function(){
            goToSlide(current+1)
        },2000)
    }
})

let timer = setInterval(function(){
    goToSlide(current+1)
},2000)

$('.container').on('mouseenter',function(){
    window.clearInterval(timer)
})

$('.container').on('mouseleave',function(){
    timer = setInterval(function(){
        goToSlide(current+1)
    },2000)
})

*/

/*********init********** */


function init(buttonsNumber){
    makeFakeSlides()  //创建首尾两张“假图”
    createButtons(buttonsNumber) //创建button
    $slides.css({transform:'translateX(-800px)'}) //图片移动到第一张真图
}

//创建button
function createButtons(buttonsNumber){
    for(let num =0;num<buttonsNumber;num++){
        $button = $(`<button>${num+1}</button>`)
        $button.addClass('button')
        $('.buttons').append($button)
    }
    $buttons = $('#buttons>button')
}
//创建首尾两张“假图”
function makeFakeSlides(){
    let $firstCopy = $images.eq(0).clone(true)
    let $lastCopy = $images.eq($images.length-1).clone(true)
    $slides.append($firstCopy)
    $slides.prepend($lastCopy)
}

/**********init**********/


/**********bindEvents**********/

function bindEvents(){
    clickNext()
    clickPrevious()
    clickNumber()
}

//鼠标点击下一张
function clickNext(){
    $('#next').one('click',function(){
        setTimeout(()=>{
            goToSlide(current+1)
            clickNext()
        },300)
    })
    
}


//鼠标点击上一张
function clickPrevious(){
    $('#previous').one('click',function(){
        setTimeout(()=>{
            goToSlide(current-1)
            clickPrevious()
        },300)
    })
}

//鼠标点击数字
function clickNumber(){
    $('#buttons').on('click','button',function(e){
        let $button = $(e.currentTarget)
        let index = $button.index()
        goToSlide(index)
    })
}

/**********bindEvents**********/


function goToSlide(index){

    if(index>$buttons.length-1){
        index=0

    }else if(index<0){
        index=$buttons.length-1
    }

    if(current === $buttons.length-1 && index === 0){
        //最后一张到第一张
        $slides.css({
            transform:`translateX(${-($buttons.length+1)*800}px)`
        })
        .one('transitionend',function(){
            $slides.hide()
            .offset()//这是小技巧，hide() show()之间插入offset()，阻断浏览器同时执行
            $slides.css({transform:'translateX(-800px)'})
            .show()
        })   
    }else if(current === 0 && index === $buttons.length-1){
        //第一张到最后一张
        $slides.css({
            transform:'translateX(0px)'
        })
        .one('transitionend',function(){
            $slides.hide()
            .offset()
            $slides.css({transform:`translateX(${-(index+1)*800}px)`})
            .show()
        })  
    }else{
        $slides.css({
            transform:`translateX(${-(index+1)*800}px)`
        })
    }
    current = index
}

