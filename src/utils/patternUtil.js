/**
 * Created by zhangqiang on 2016/3/25.
 */
export const intPattern = /^\d+$/;
export const urlPattern = /^((http|ftp|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[a-zA-Z0-9\&%_\./-~-]*)?$/;
export  function  numberPattern(n){
    var reg = '\/^\\d+(.?\\d\{'+n+'\})\/';
    return eval(reg);
}
