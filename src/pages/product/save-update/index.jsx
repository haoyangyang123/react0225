import React, { Component } from 'react';
import { Card, Icon, Form, Input, Button, Cascader, InputNumber } from  'antd';
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import  { reqCategories, reqAddProduct, reqUpdateProduct } from "../../../api";
import RichTextEditor from './rich-text-editor';
import PictureWall from './picture-wall';
import './index.less';
const { Item } = Form;


class SaveUpdate extends Component {
  state = {
    options:[]
  };
  richTextEditorRef = React.createRef();
  getCategories = async (parentId)=>{
    const result = await reqCategories(parentId);
    if (result) {
        if (parentId === '0') {
            this.setState({
                options: result.map((item) => {
                    return {
                        value: item._id,
                        label: item.name,
                        isLeaf: false,
                    }
                })
            })
        } else {
            this.setState({
                options:this.state.options.map((item)=>{
                    if (item.value === parentId){
                        item.children = result.map((item)=>{
                            return{
                                value:item._id,
                                label:item.name
                            }
                        })
                    }
                    return item;
                })
            })
        }
    }
  };
  async componentDidMount() {
      this.getCategories('0');
      const product = this.props.location.state;
      let categoriesId = [];
      if (product) {
          if (product.pCategoryId !== '0') {
              categoriesId.push(product.pCategoryId);
              this.getCategories(product.pCategoryId);
          }
          categoriesId.push(product.categoryId);
      }

      this.categoriesId = categoriesId;
  }
  loadDate = async selectedOptions =>{
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const result = await  reqCategories(targetOption.value);
    if(result){
      targetOption.loading = false;
      targetOption.children = result.map((item) =>{
        return{
            label:item.name,
            value:item._id,
        }
      });
      this.setState({
          options:[...this.state.options],
      });
    }
  };
  addProduct = (e) =>{
    e.preventDefault();
    this.props.form.validateFields(async( err,values)=>{
        if (!err){
            const { editorState } = this.richTextEditorRef.current.state;
            console.log(editorState)
            const  detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            console.log(detail);
            const { name, desc, price, categoriesId} = values;
            let pCategoryId = '0';
            let categoryId='';
            if (categoriesId.length === 1){
                categoryId = categoriesId[0];
            }else {
                pCategoryId = categoriesId[0];
                categoryId = categoriesId[1];
            }
            let promise= null;
            const product = this.props.location.state;
            const options ={ name, desc, price, categoryId, pCategoryId,detail};
            if (product){
                options._id =  product._id;
                promise = reqUpdateProduct(options);
            }else {
                promise = reqAddProduct(options);
            }
            const  result= await  promise;
            if (result){
                this.props.history.push('/product/index');
            }
        }
    })
  };
  goBack = () =>{
      this.props.history.goBack();
  };
  render(){
    const  { options } = this.state;
    const  { getFieldDecorator} = this.props.form;
    const  product = this.props.location.state;
    const  formItemaLayout = {
      labelCol:{
        xs:{ span:24 },
        sm:{ span:2},
      },
       wrapperCol:{
        xs:{ span: 24 },
        sm:{ span:10},
       } ,
    };
      return <Card title={<div className='product-title'><Icon type="arrow-left" className='arrow-icon' onClick={this .goBack}/><span>添加商品</span></div>}>
        <Form {...formItemaLayout} onSubmit={this.addProduct}>
            <Item label = '商品名称'>
                {
                    getFieldDecorator(
                        'name',
                        {
                            rules:[
                                {required:true, message:"请输入商品的名称"}
                            ],
                            initialValue:product ? product.name:''
                        }
                    )(
                        <Input placeholder = "请输入商品的名称"/>
                    )
                }
            </Item>
            <Item label = '商品描述'>
                {
                    getFieldDecorator(
                        'desc',
                        {
                            rules:[
                                {required:true, message:"请输入商品的描述"}
                            ],
                            initialValue:product ? product.desc:''
                        }
                    )(
                        <Input placeholder = "请输入商品的描述"/>
                    )
                }
            </Item>
            <Item label='选择分类' wrapperCol={{span:5}}>
                {
                    getFieldDecorator(
                        'categoriesId',
                        {
                            rule:[
                                { required:true,message:'请选择分类'}
                            ],
                            initialValue:this.categoriesId
                        }
                    )(
                        <Cascader options={options} loadData={this.loadDate} changeOnSelect placeholder='请选择分类'/>
                    )
                }
            </Item>
            <Item label='商品价格'>
                {
                    getFieldDecorator(
                        'price',
                        {
                            rule: [
                                {required: true, message: '请输入商品价格'}
                            ],
                            initialValue:product ? product.price:''
                        }
                    )(
                        <InputNumber
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/￥\s?|(,*)/g, '')}
                            className="input-number"
                        />
                    )
                }
            </Item>
            <Item label='商品图片'>
                <PictureWall imgs={product ? product.imgs:[]} id={product ? product._id:''}/>
            </Item>
            <Item label ='商品详情' wrapperCol={{span:20}}>
                  <RichTextEditor ref={this.richTextEditorRef} detail={product ? product.detail : ''}/>
            </Item>
            <Item>
                <Button type="primary" className='add-product-btn' htmlType="submit">提交</Button>
            </Item>
        </Form>
      </Card>;
  }
}
export  default Form.create()(SaveUpdate);