var MockJS = require('mockjs');

var MockData = {
    '/home/banner': {
        'code': 200,
        'msg': '',
        'body': {
            'list|3-6': [{
                'id|+1': 1,
                'img|1': ['/static/img/pic03.jpg','/static/img/pic04.jpg'],
                'link': 'http://m.baidu.com'
            }]
        }
    },
    // 首页任务列表
    '/home/taskList': {
        'code': 200,
        'msg': '',
        'body': {
            'list|10': [{
                'id|1-100': 1,
                'img|1': ['/static/img/pic03.jpg','/static/img/pic04.jpg'],
                'title': '@ctitle(6, 18)',
                'tag|1': ['试用', '发单'],
                'remaining|1-100': 1,
                'reward|1-100.2': 1
            }]
        }
    },
    // 用户接受的任务列表 0: 待完成 1: 待验收 2: 已结束
    '/task/taskList': {
        'code': 200,
        'msg': '',
        'body': {
            'info': {
                'unTotal|1-100': 1,
                'doTotal|1-100': 1
            },
            'list|10': [{
                'id|1-100': 1,
                'taskId|1-100': 1,
                'title': '@ctitle(6, 18)',
                'tag|1': ['', '项目执行'],
                'systemTime': '@date(yyyy-MM-dd hh:mm:ss)',
                'startTime': '@date(yyyy-MM-dd hh:mm:ss)',
                'endTime': '@date(yyyy-MM-dd hh:mm:ss)',
                'status|0-4': 1,  // 0 待完成 1 已延迟 2 待验收 3 已结束拒绝 4 已结束通过
                'reason': '@cparagraph(1, 2)'
            }]
        }
    },
    // 任务详情
    '/task/detail': {
        'code': 200,
        'msg': '',
        'body': {
            'detail': {
                'id|1-100': 1,
                'status|1-3': 1,
                'img': '/static/img/pic04.jpg',
                'title': '@ctitle(6, 18)',
                'tag|1': ['试用', '发单'],
                'remaining|1-100': 1,
                'reward|1-100.2': 1,
                'date': '@date(MM-dd hh:mm)',
                'duration|1': ['36小时', '三天', '一周'],
                'content': '@cparagraph(20, 30)'
            }
        }
    },
    // 获取验证码
    '/user/getCode': {
        'code': 200,
        'msg': '',
        'verify|000000-999999': 1
    },
    // 登录
    '/user/login': {
        'code': 200,
        'msg': '',
        'info': {
            'id|1-100': 1,
            'phone|13000000000-19999999999': 1,
            'user': '@ctitle(2, 4)'
        }
    }
};

function ResData(url) {
    var key, data;
    for (key in MockData) {
        if (url.indexOf(key) > -1) {
            data = MockJS.mock(MockData[key]);
            break;
        }
    }
    return data;
}

module.exports = ResData;