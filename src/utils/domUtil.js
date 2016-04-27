/**
 * Created by zhourongjing on 2016/3/30.
 */

const doc = document;
const iframeHide = doc.createElement('iframe');
iframeHide.style.display = 'none';
iframeHide.name = 'myIframe';
doc.body.appendChild(iframeHide);
import auth from './auth'


const DomUtil = (function(){
    return {
        /*
         *
         * 在当前元素后面插入节点 [new node dom元素, old node dom元素]
         * */
        insertAfter(newEl, oldEl){
            let pEl = oldEl.parentNode;
            if( pEl.lastChild == oldEl ){// 如果是最后一个节点,在父节点插入节点
                pEl.appendChild(newEl);
            }else {// 否则在当前节点的后面一个节点 插入
                pEl.insertBefore(newEl, oldEl.nextSibling);
            }
        },

        /*
        * 找到最近的父节点
         * el : dom元素
         * nodename :父节点 [string]
         **/
        findClosestParent(el, nodename){
            //console.log(el, nodename);
            let parent = el.parentNode;

            while(parent.tagName.toLowerCase() !== nodename){
                parent = parent.parentNode;
            }
            return parent;
        },

        hasClass(el, classname){
            return el.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
        },

        addClass(el, classname){
            if (!this.hasClass(el, classname)) el.className += " " + classname;
        },

        removeClass(el, classname){
            let str = el.className;
            if( this.hasClass(el, classname) ){
                str = str.replace(classname, '');
                el.className = str;
            }
        },

        download(url, data, method){

            if (url && data) {
                // data 是 string 或者 array/object
                //data = typeof data == 'string' ? data : JSON.stringify(data);// 。。。不是stringify

                // 把参数组装成 form的  input
                let token = auth.loggedIn()? auth.loggedIn().token:'';
                let inputs = '', arr = data.split('&');
                arr.forEach(function(item, index){
                    let pair = item.split('=');
                    inputs += '<input type="text" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
                });
                inputs+= '<input type="text" name="token" value="'+ token +'" />';
                //let inputs = '<input type="submit" value="提交" name="" />';

                let form = doc.createElement('form');
                form.setAttribute('action', url);
                form.setAttribute('method', method || 'get');
                form.setAttribute('target', 'myIframe');
                form.innerHTML = inputs;

//                console.log(form.outerHTML);
                doc.body.appendChild(form).submit();
                form.outerHTML = '';

            }
        },
        downloadProduct(type, data,url, method,token){
//            console.info(type);

            if (url ) {
                // data 是 string 或者 array/object
                //data = typeof data == 'string' ? data : JSON.stringify(data);// 。。。不是stringify

                // 把参数组装成 form的  input
                let formInputs = '';
                let token = auth.loggedIn()? auth.loggedIn().token:'';
//                console.info(token);
                formInputs += '<input type="text" name="type" value="'+ type +'" />';
                formInputs += '<input type="text" name="token" value="'+ token +'" />';
                if(type==1){
                    if(data&&data.length>0){
                        for(let v of data) {
                            formInputs += '<input type="text" name="productId" value="'+ v +'" />';
                        }
                    }
                }else if(type==2){
                    if(data){
                        for (var key of Object.keys(data)) {
                            if(data[key]){
                                formInputs += '<input type="text" name="'+key+'" value="'+ data[key] +'" />';
                            }
                        }
                    }

                }
//                console.info(formInputs);
                let form = doc.createElement('form');
                form.setAttribute('action', url);
                form.setAttribute('method', method || 'get');
                form.setAttribute('target', 'myIframe');
                form.innerHTML = formInputs;

//                console.log(form.outerHTML);
                doc.body.appendChild(form).submit();
                form.outerHTML = '';

            }
        },

        /*转化正确日期格式 yyyy-mm-dd hh-mm-ss*/
        turnDate(t){
//            console.log("tttttttt", t);
            if(typeof t !== 'undefined' && t){
                let y   = t.getFullYear(),
                    m   = t.getMonth()+1,
                    d   = t.getDate(),
                    h   = t.getHours(),
                    mi  = t.getMinutes(),
                    s   = t.getSeconds();
                t = y+ '-' + m +'-' + d + ' '+ h + '-'+ mi +'-' +s;
//                console.log("1111t",t)
                return t ;
            }
        },

        /*找到元素的最近的子元素*/
        findCloseChild(el, ch){
//            console.log(el, ch);
            let child = el.firstElementChild;

            while( !child.classList.includes(ch) ){
                child = child.firstElementChild;
            }
            return child;
        },

        /*
        * 处理table 涉及到dom 操作
        * table联动
        * 控制table高度，不出现滚动条
        * */
        controlTable(){
            // 找到formWrap的最外面的两个table 比较宽度，取大的；
            // 绑定事件，scroll 的时候 改变 scrollLeft
            //let formWrap = document.querySelectorAll('.form-wrap')[0];
            let tableWrap = document.querySelectorAll('.ant-table')[0];
            let tableHead = document.querySelectorAll('.ant-table-header')[0],
                tableBody = document.querySelectorAll('.ant-table-body')[0];
            var w = tableWrap.offsetWidth,
                wHead   = tableHead.scrollWidth,
                wBody   = tableBody.scrollWidth,
                _wBody = tableBody.offsetWidth;
            let maxW = Math.max(wHead, wBody);
            //if( wHead > wBody ){
            //    tableBody.style.width = maxW + 'px';
            //}else {
            //tableHead.style.width = tableBody.scrollWidth + 'px';
            //}

            if(wBody > _wBody){
                tableBody.classList.add('w100');
            }
            // 处理tableBody 没有内容的情况
            if( !tableBody.querySelectorAll('tr').length ){
                tableHead.style.cssText += ' overflow:auto;height:200px;';
            }else {
                tableHead.style.cssText += ' overflow:hidden;height:38px;';// 不要清空样式，而应该恢复上一步操作
            }

            // 为保持一致性， 没有内容的td 填充span
            let tds = tableBody.querySelectorAll('td');
            //console.log(tds.length);
            tds = Array.from(tds);
            tds.forEach(function(item){
                var span = item.querySelectorAll('span'),
                    div  = item.querySelectorAll('div');// 必须有span 或者div
                if( !span.length && !div.length ){
                    item.innerHTML = '<span></span>';
                }
            });


            //setPadding();
            setBar();

            tableBody.onscroll = function(){// table 联动
                tableHead.style.marginLeft = -tableBody.scrollLeft + 'px';
            };
            tableBody.onscroll();


            // 控制table的高度 使得不超出页面 不出现滚动条
            function setBar(){
                let winHei = document.documentElement.offsetHeight;
                let h = winHei - tableBody.getBoundingClientRect().top - 50;
                tableBody.style.height = h + 'px';
            }

            function setPadding(){

                // 获取滚动条的宽度 使得上下table对齐
                /*if( tableBody.scrollWidth <= parseInt( tableHead.style.width )  ){
                    //tableHead.style.width = 'auto';
                    tableHead.style.paddingRight = 0 + 'px';
                    //clearTimeout(t);
                    return;
                }*/

                var t = setTimeout(function(){
                    let wBar = tableBody.offsetWidth - tableBody.scrollWidth;


                    console.log('wBar:',wBar);
                    if( wBar > 1 ){// 未超过宽度
                        tableHead.style.paddingRight = wBar + 'px';
                       /* tableHead.style.width = tableBody.scrollWidth;
                        if( tableBody.scrollWidth <= parseInt( tableHead.style.width )  ){
                            tableHead.style.paddingRight = 0 + 'px';
                        }*/

                    }else if( wBar < 0 ){// 说明存在很长的横向滚动
                        tableHead.style.paddingRight = 40 + 'px';
                        /*if( tableBody.scrollWidth <= parseInt( tableHead.style.width )  ){
                            tableHead.style.width = tableBody.scrollWidth;

                            tableHead.style.paddingRight = 0 + 'px';
                            return;
                        }*/
                    }else {// 没有滚动条
                        //tableHead.style.width = tableBody.scrollWidth;

                        tableHead.style.paddingRight = 0 + 'px';
                    }
                    clearTimeout(t);
                }, 0);

            }
        },

        initDetail(){
            // 重置详情
            // 原先的 详情 addTr;并且移除class showDetail;去除 been 属性
            let doc = document;
            let trs         = doc.querySelectorAll('.addTr'),// 所有的详情列表
                arr         = Array.from(trs),
                details     = doc.querySelectorAll('.showDetail'),
                _arr        = Array.from(details),
                btns        = doc.querySelectorAll('button'),
                arrBtn      = Array.from(btns);

            arr.forEach(function(item){
                item.outerHTML = '';
            });
            _arr.forEach(function(item){
                item.classList.remove('showDetail');
            });
            arrBtn.forEach(function(item){
                item.removeAttribute('been');
            });
        },

        controlForm(){
            // 如果超出1行 addClass
            let form = document.querySelector('.J_form');
            if( !form ){
                return;
            }

            let height = form.offsetHeight;
            let btn = form.querySelector('.J_btn');

            //console.log('控制表单', height);

            // 初始化
            if( height > 84 ){
                form.classList.add('hideForm');
                form.querySelector('.btn-wrap').style.display = "block";
            }

            btn.onclick = function(){
                if( form.classList.contains('hideForm') ){
                    //console.log(1)
                    form.classList.remove('hideForm');
                    btn.innerHTML = '点击收起';
                    DomUtil.controlTable();
                    return;
                }
                //console.log(2)
                form.classList.add('hideForm');
                DomUtil.controlTable();

                btn.innerHTML = '点击展开';
            };
        }
    };

})();

module.exports = DomUtil;