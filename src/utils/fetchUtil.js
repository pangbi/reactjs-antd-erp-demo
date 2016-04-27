/**
 * Created by zhangqiang on 2016/2/25.
 */

import { Modal } from 'antd';
import { browserHistory } from 'react-router'
import auth from './auth'
let fetchUtil = {
    checkStatus(response) {
        //console.info('========dispatch=========')
        //console.info(response);
        if(response.status == 200){
            return response;
        }else if (response.status > 200 && response.status < 300) {
            return "";
        }else if(response.status == 400){
            return response.text().then(function (err){
                let msg = '';
                try{
                    let error = JSON.parse(err);
                    msg = error.errorMsg;
                }catch (e){
                    msg = err;
                }
                throw new Error(msg);
            })
        }else if(response.status == 401){
            auth.logout();
            throw new Error('认证过期');
        }else {
            throw new Error('网络异常');
        }
    },
    getHeader(){
        return {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':auth.loggedIn()? auth.loggedIn().token:''
        }
    },
    parseJSON(response) {
        //console.info('response data')
        //console.info(response)
        if(typeof(response) == "object")
            return response.json();
        else
            return response;
    },
    receivePosts(type, data) {
        return {
            type: type,
            data: data
        }
    },
    showMsg(commonResult){
        //console.info('=====commonResult=====');
        //console.info(commonResult);
        if(commonResult.result == 1){
            Modal.success({
                title: '操作成功'
            });
        }else if(commonResult.result == 0){
            Modal.error({
                title: '操作失败',
                content:commonResult.errMsg
            });
        }
    },
    showSuccess(){
        Modal.success({
            title: '操作成功'
        });
    },
    success(msg){
        Modal.success({
            title: msg.title,
            content:msg.content
        });
    },
    showError(err){
        Modal.error({
            title: '操作失败',
            content:err
        });
    }


}

export  default fetchUtil;
