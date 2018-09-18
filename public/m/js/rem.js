window.addEventListener('load',function(){
    window.addEventListener('resize',setHtmlFontSize);
    setHtmlFontSize();
    function setHtmlFontSize(){
        //获得body的真实宽度
        windowWidth=document.documentElement.offsetWidth;
           // 限制最大屏幕 和最小屏幕
        if(windowWidth>750){
            windowWidth=750;
        }else if(windowWidth<320){
            windowWidth=320;
        }
        //设置标准屏幕的宽度
        standardWidth=375;
         // 标准屏幕的html的字体大小
         var StandardHtmlFontSize = 100;
        //计算出html的根元素字体大小
var htmlFontSize=windowWidth/standardWidth*StandardHtmlFontSize;
document.querySelector('html').style.fontSize=htmlFontSize+'px';
    }
})