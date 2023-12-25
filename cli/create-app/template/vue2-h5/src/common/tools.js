let qm_tools = {
  set_bscroll_height: function (obj) {
    return window.screen.availHeight - obj.offsetTop - document.documentElement.scrollTop
  },
  baidu_tongji: function () {
    let _hmt = _hmt || [];
    (function () {
      let hm = document.createElement('script');
      hm.src = 'https://hm.baidu.com/hm.js?dc00056b0b302f1139694685b1c53140';
      let s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(hm, s);
    })();
  },
  send_event_statistic: function(obj){
    let _dataEventStatisticArr = obj.getAttribute('data-event-statistic').split('/');
    _dataEventStatisticArr.forEach(function(n,i){
      setTimeout( () => {
        window.open('freereader://event_statistic?param={"type":"' + n + '"}','_self');
      }, i*20 + 30)
    })

    if(obj.getAttribute('data-href')){
        setTimeout( () => {
          if(obj.getAttribute('data-href').indexOf('freereader://') > -1){
            window.open(obj.getAttribute('data-href'),'_self');
          }else{
            if(obj.getAttribute('data-href').indexOf('http://') > -1 || obj.getAttribute('data-href').indexOf('https://') > -1){
                window.open('freereader://webview?param={"url":"' + obj.getAttribute('data-href') + '"}','_self');
            }else{
                window.open('freereader://webview?param={"url":"' + document.location.protocol + '//' + document.location.host + obj.getAttribute('data-href') + '"}','_self');
            }            
          }
          
        },_dataEventStatisticArr.length*20 + 100);
    }
  }
}

export default qm_tools;
