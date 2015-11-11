var path = require('path');

const USERNAME = '',
    PASSWORD = '',
    FOLDER = path.join(__dirname, '/out'),
//FOLDER = 'files',
    COURSES = [
        {
            name: 'Machine Learning 2015',
            url: 'http://edimension.sutd.edu.sg/course/view.php?id=1035'
        },
        {
            name: 'Database 2015',
            url: 'http://edimension.sutd.edu.sg/course/view.php?id=1036'
        }
        /*,
         {
         name: 'SAGES 2015',
         url: 'http://edimension.sutd.edu.sg/course/view.php?id=982'
         }*/
    ];


module.exports = {
    USERNAME: USERNAME,
    PASSWORD: PASSWORD,
    LOGIN_URL: 'http://edimension.sutd.edu.sg/login/index.php',
    ROOT_PATH: path.normalize(FOLDER),
    COURSES: COURSES,
    LOGIN_OPTS: {
        method: 'POST',
        url: 'http://edimension.sutd.edu.sg/login/index.php',
        headers: {
            'postman-token': '52d20709-92a7-afb1-0c66-682a41753aee',
            'cache-control': 'no-cache',
            'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
        },
        formData: {
            username: USERNAME,
            password: PASSWORD
        },
        followAllRedirects: true
    }
};