import React, { Component } from 'react';
import  { Card, Button, Table, Icon, Modal, message  } from 'antd';
import { reqCategories, reqAddCategory, reqUpdateCategoryName } from '../../api';
import  MyButton from '../../components/my-button';
import  AddCategoryForm from  './add-category-form';
import UpdateCategoryNameForm from  './update-category-name';
import  './index.less';

export default class Category extends Component {
  state = {
      categories:[], //一级分类的列表
      subCategories:[],//二级分类的列表
      isShowAddCategory:false,//显示添加品类
      isShowUpdateCategoryName:false,//显示修改分类名称
      loading:true,//是否显示loading
  };
  category = {};
  componentDidMount(){
      this.fetchCategories('0');
  };
  fetchCategories = async( parentId) => {
      this.setState({
          loading:true
      });
      const result = await  reqCategories(parentId);
      if (result){
          if (parentId === "0"){
              this.setState({ categories:result});
          } else {
              this.setState({
                  subCategories:result,
                  isShowSubCategories:true
              })
          }
      }
      this.setState({
          loading:false
      })
  };
  addCategory = () =>{
      // 1. 表单校验
      // 2. 收集表单数据
      console.log(this);
      const { form } =  this.addCategoryForm.props;
      form.validateFields(async (err, values)=>{
          if(!err){
              console.log(values);
              const  { parentId, categoryName } = values;
              const result = await  reqAddCategory(parentId, categoryName);
              if(result){
                  message.success('添加分类成功啦',2);
                  form.resetFields(['parentId','categoryName']);
                  const  options={
                      isShowAddCategory:false
                  };
                  const { isShowCategories } =this.state;
                  if (result.parentId === '0'){
                      options.categories = [...this.state.categories,result];
                  }else if(isShowCategories && result.parentId === this.paentCategory._id){
                      options.subCategories = [...this.state.subCategories,result];
                  }
                  this.setState(options);
              }
          }
      })
  };
  toggleDisplay = (stateName, stateValue) => {
        return () => {
            this.setState({
                [stateName]: stateValue
            })
        }
  };
  hideUpdateCategoryName = () => {
        // 清空表单项的值
        this.updateCategoryNameForm.props.form.resetFields(['categoryName']);
        // 隐藏对话框
        this.setState({
            isShowUpdateCategoryName: false
        })
  };
  saveCategory = (category) => {
        return () => {
            // 保存要更新的分类数据
            this.category = category;
            this.setState({
                isShowUpdateCategoryName: true
            })
        }
  };
  updateCategoryName = () => {
        const { form } = this.updateCategoryNameForm.props;
        //校验表单，并收集数据
        form.validateFields(async (err, values)=>{
            if(!err){
                const { categoryName } = values;
                const  categoryId = this.category._id;
                //f发送请求
                const  result = await  reqUpdateCategoryName(categoryId, categoryName);
                if (result){
                    const { parentId }= this.category;
                    let categoryDate = this.state.categories;
                    let stateName = 'categories';
                    if (parentId !=='0'){
                        //二级分类
                        categoryDate = this.state.subCategories;
                        stateName = 'subCategories';
                    }
                    //不想修改元数据
                    const  categories = this.state.categories.map((category)=>{
                        let {_id, name, parentId} = category;
                        //找到对应的id的category，修改分类的名称
                        if (_id === categoryId){
                            name = categoryName;
                            return{
                                _id,
                                name,
                                parentId
                            }
                        }
                        //没有修改的数据直接返回
                        return category
                    });
                    //清空表单项的值 隐藏对话框
                    form.resetFields(['categoryName']);
                    message.success('更新分类名称成功',2);
                    this.setState({
                        isShowUpdateCategoryName:false,
                        [stateName]:categories
                    })
                }
            }
        })
    };
  showSubCategory = (category) =>{
      return async () =>{
          this.parentCategory = category;
          this.fetchCategories(category._id);
      }
  };
  goBack = () =>{
      this.setState({
          isShowSubCategories:false
      })
  };

  render() {
        const { categories, subCategories, isShowSubCategories, isShowAddCategory, isShowUpdateCategoryName, loading } = this.state;
        // 决定表头内容
        const columns = [
            {
                title: '品类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                // dataIndex: '_id',
                className: 'category-operation',
                // 改变当列的显示
                render: category => {
                    return <div>
                        <MyButton onClick={this.saveCategory(category)}>修改名称</MyButton>
                        {
                            this.state.isShowSubCategories ? null:<MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>
                        }

                    </div>
                },
            },
        ];
        //决定表格里面的数据
      return <Card title={ isShowSubCategories ? <div><MyButton onClick={this.goBack}>一级分类</MyButton><Icon type="arrow-right"/>&nbsp;{this.parentCategory.name}</div>:"一级分类列表"}
                     extra={<Button type="primary" onClick={this.toggleDisplay('isShowAddCategory',true)}><Icon type="plus"/>添加品类</Button>}>
                  <Table
                      columns={columns}
                      dataSource={ isShowSubCategories ? subCategories : categories }
                      bordered
                      pagination={{
                          showSizeChanger: true,
                          pageSizeOptions: ['3', '6', '9', '12'],
                          defaultPageSize: 3,
                          showQuickJumper: true
                      }}
                      rowKey="_id"
                      loading = {loading}
                  />
                    <Modal
                    title='添加分类'
                    visible={isShowAddCategory}
                    onOk={ this.addCategory}
                    onCancel={this.toggleDisplay('isShowAddCategory',false)}
                    okText='确认'
                    cancelText='取消'
                    >
                        <AddCategoryForm categories={categories} wrappedComponentRef={(form) =>this.addCategoryForm = form} />
                    </Modal>
                    <Modal
                    title="修改分类名称"
                    visible={isShowUpdateCategoryName}
                    onOk={this.updateCategoryName}
                    onCancel={this.hideUpdateCategoryName}
                    okText="确认"
                    cancelText="取消"
                    width={250}
                    >
                        <UpdateCategoryNameForm categoryName={this.category.name} wrappedComponentRef={(form)=> this.updateCategoryNameForm = form}/>
                    </Modal>
          </Card>;
  }
}