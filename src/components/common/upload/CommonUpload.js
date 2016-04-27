import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CommonAction from '../../../actions/CommonAction'
import { Upload, Icon ,Button  , Modal} from 'antd';
import auth from '../../../utils/auth'
import * as Constants from '../../../constants/constants'
export default class CommonUpload extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
    }

    componentDidMount() {
        //初始化数据
        this.props.commonAction.initUploadFile();
    };

    beforeUpload(file) {
        const {fileType,fileSize} = this.props;
        //验证文件类型
        let isFileType = false;
        let fileTypes = fileType.split(',');
        fileTypes.map(item=> {
            if (file.type === item)
                isFileType = true;
        })
        if (!isFileType) {
            Modal.error({
                title: `上传失败`,
                content: `只能上传${fileType}类型文件`,
            });
            return false;
        }
        //验证文件大小
        let size = parseInt(file.size / 1024);//单位 kb
        let maxSize = fileSize||10;//默认10m
        //console.info(maxSize)
        if (size > maxSize * 1024) {
            Modal.error({
                title: `上传失败`,
                content: `上传文件不能大于${maxSize}M`,
            });
            return false;
        }

        return true;
    }

    onChange(info) {
        const {setFile} = this.props;
        //setFile({name:'test.jpg',path:'/foo/bar/test.jpg'});//测试用
        //this.setState({file:info.file.name})//测试用
        if (info.file.status === 'done') {
            let response = info.file.response;
            //console.info(response);
            if (JSON.stringify(response).indexOf('errorMsg') != -1) {
                Modal.error({
                    title: `上传失败`,
                    content: `${info.file.name}:${response.errorMsg}`
                });
            } else {
                Modal.success({
                    title: `上传成功`,
                    content: `${info.file.name} 上传成功。`,
                });
                //console.info(response.result);
                this.props.commonAction.setUploadFile({
                    name: info.file.name,
                    path: response.result[0],
                    dist: response.result[0]
                });
                setFile({name: info.file.name, path: response.result[0], dist: response.result[0]});
            }

        } else if (info.file.status === 'error') {
            Modal.error({
                title: `上传失败`,
                content: `${info.file.name} 上传失败。`,
            });
        }
    }

    render() {
        const Authorization = auth.loggedIn() ? auth.loggedIn().token : '';
        const head = {'Authorization': Authorization};
        const {multiple,fileType,uploadFile,isShowFile,uploadName} = this.props;
        const props = {
                name: 'file',
                action: Constants.URL_UPLOAD + '/fastdfs/upload',
                headers: head,
                multiple: multiple,
                accept: fileType,
                showUploadList: false,
                onChange: this.onChange,
                beforeUpload: this.beforeUpload
            }
            ;

        let showFile = '';
        let isShow = isShowFile === false ? false : true;
        if (uploadFile && uploadFile.file && uploadFile.file.name && uploadFile.file.name != '' && isShow) {
            showFile = <div className="ant-upload-list-item ant-upload-list-item-done">
                <Icon type="paper-clip"/>
                <a className="ant-upload-list-item-name">{uploadFile.file.name}</a>
            </div>
        }
        return (
            <div >
                {showFile}
                <Upload {...props}>
                    <Button type="ghost">
                        <Icon type="upload"/> {uploadName || '点击上传'}
                    </Button>
                </Upload>
            </div>
        )
    }
}

//约束子组件接受的prop类型
const propTypes = {
    multiple: React.PropTypes.bool.isRequired,//是否上传多个
    fileType: React.PropTypes.string.isRequired,//上传文件类型
    fileSize: React.PropTypes.number,//上传文件大小 单位M
    setFile: React.PropTypes.func.isRequired,//上传成功回调方法 setFile(file) ,file={name,path,dist:'....xls'}
    isShowFile: React.PropTypes.bool,//上传成功是否显示文件
    uploadName: React.PropTypes.string,//上传组件名称
};

CommonUpload.propTypes = propTypes;


/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{productSaleAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        commonAction: bindActionCreators(CommonAction, dispatch),
    };
}

/**
 * 把store中的属性映射到this.props中
 * @param state
 * @returns {{selectedRowKeys: *, modalVisiable: *, singleResult: (singleResult|*), pgList: (pgList|*), initForm: *}}
 */
function stateToProps(state) {
    return {
        uploadFile: state.common.uploadFile,
    };
}

/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(CommonUpload);
