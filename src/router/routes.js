/**
 * Created by zhangqiang on 2016/2/29.
 */
import auth from '../utils/auth'
import {Route,IndexRoute} from 'react-router'
import React from 'react';
/*
 import{Login,NotFound,App,Home,CustomerManage} from '../containers'
 */

/*


 export default (store) => {

 function redirectToLogin(nextState, replace) {
 //未登录 跳转到登录页面
 //console.info("replace");
 //console.info(replace)
 if (auth.loggedIn() == null) {
 console.info("redirect to login")
 replace('/login');
 }
 }


 /!*return (
 <Route path="/" component={App}>
 <IndexRoute component={Login}/>

 <Route path="login" component={Login}/>
 <Route onEnter={redirectToLogin}>
 <Route path="adminIndex" component={Home}>
 <Route path="customerManage" component={CustomerManage}/>
 </Route>
 </Route>
 <Route path="*" component={NotFound}/>
 </Route>
 );*!/
 const loadContainerAsync = route => (location, cb) => {
 console.info(route);
 require.ensure([], (require) => {
 console.info("require")
 console.info(require)
 cb(null, require(route));
 });
 };


 return (
 //<Route path="components" component={loader(require('bundle?lazy!./components.jsx'))}>
 <Route path="/"getComponent={loadContainerAsync('../containers/login/Login')}/>

 )
 /!*
 return (
 //<Route path="components" component={loader(require('bundle?lazy!./components.jsx'))}>
 <Route path="/" component={App}>
 <IndexRoute component={loader(require('bundle?lazy!../containers/login/Login'))}/>
 <Route path="login" component={loader(require('bundle?lazy!../containers/login/Login'))}/>
 <Route onEnter={redirectToLogin}>
 <Route path="adminIndex" component={loader(require('bundle?lazy!../containers/home/Home'))}>
 <Route path="customerManage"
 component={loader(require('bundle?lazy!../containers/customer/CustomerManage'))}/>
 </Route>
 </Route>
 <Route path="*" getChildRoutes={loader(require('bundle?lazy!../containers/notFound/NotFound'))}/>
 </Route>
 )*!/

 };
 */


function redirectToLogin(nextState, replace) {
    if (auth.loggedIn() == null) {
        //console.info("redirect to login")
        replace('/login');
    }
}
export default {
    component: require('../containers/App'),
    childRoutes: [
        {
            path: '/',
            getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('../containers/login/Login'))
                })
            }
        },
        {
            path: '/login',
            getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('../containers/login/Login'))
                })
            }
        },
        {
            path: '/test',
            getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('../containers/test/Test'))
                })
            }
        },
        {
            onEnter : redirectToLogin,
            path: '/adminIndex',
            getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('../containers/home/Home'))
                })
            },
            indexRoute : {
                getComponent: (location, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('../containers/adminIndex/AdminIndex'))
                    })
                },
            },
            childRoutes : [
                /*{
                    path: 'customerManage',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/customer/CustomerManage'))
                        })
                    }
                },
                {
                    path: 'systemMenuManage',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/systemMenu/SystemMenuManager'))
                        })
                    }
                },
                {
                    path: 'systemResourceManage',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/systemResource/SystemResourceManager'))
                        })
                    }
                },*/
                {
                    path: 'productSaleManage',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/productSale/ProductSaleManage'))
                        })
                    }
                },
                {
                    path : 'uploadList',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/uploadList/UploadList'))
                        })
                    }
                },
                {
                    path: 'proCodeUploadManage',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/proCodeUploadListView/ProCodeUploadManage'))
                        })
                    }
                },
                {
                    path: 'productInfoManage',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/product/ProductManager'))
                        })
                    }
                },
                {
                    path: 'activityProductRelation',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/activityProductRelation/ActivityProductRelationManager'))
                        })
                    }
                },
                {
                    path: 'activity',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/activity/ActivityManager'))
                        })
                    }
                },
                {
                    path: 'recommend',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/recommend/RecommendManager'))
                        })
                    }
                },
                {
                    path: 'editorProductForAddManage',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/editorProductForAdd/EditorProductForAddManage'))
                        })
                    }
                },
                {
                    path: 'editorProductForActivityManage',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/editorProductForActivity/EditorProductForActivityManage'))
                        })
                    }
                },
                {
                    path: 'activityDetail',
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../containers/activity/ActivityDetailManager'))
                        })
                    }
                },
            ]
        },
        {
            path: '*',
            getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('../containers/notFound/NotFound'))
                })
            }
        },
    ]
}

