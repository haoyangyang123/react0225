import  ajax from  './ajax';
import  jsonp from 'jsonp';
import { message } from 'antd';
export  const  reqLogin = (username, password) => ajax('/login', { username, password}, 'POST');
export  const  reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');
//请求天气
export const reqWeather = function () {
    let cancel = null;
    const promise = new Promise((resolve, reject) => {
        cancel = jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`, {}, function (err, data) {
            try {
                if (!err) {
                    const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                    resolve({
                        weatherImg: dayPictureUrl,
                        weather
                    });
                } else {
                    message.error('请求天气信息失败~请刷新试试~');
                    resolve();
                }
            } catch (e) {
                message.error('请求天气信息失败~请刷新试试~');
                resolve();
            }
        });
    });

    return {
        promise,
        cancel
    }
};
export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId});
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST');
export const reqUpdateCategoryName = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST');
export const reqProducts = ( pageNum, pageSize) => ajax('/manage/product/list',{pageNum,pageSize});
export const reqAddProduct = ({ name, desc, price, categoryId, pCategoryId, detail})=>ajax('/manage/product/add',{name, desc,price,categoryId,pCategoryId,detail},'POST');
export const reqUpdateProduct =({name, desc, price, categoryId, pCategoryId, detail, _id })=>ajax('/manage/product/update',{name, desc, price, categoryId, pCategoryId, detail, _id},'POST');
export const reqDeleteProductImg =(name,id)=>ajax('/manage/img/delete',{name,id},'POST');