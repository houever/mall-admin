<template>
  <div class="productList">
    <Card>
      <Row>
        <Form v-show="openSearch" ref="searchForm" :model="searchForm" inline :label-width="70">
          <Form-item label="商品名称" prop="productName">
            <Input
              type="text"
              v-model="searchForm.productName"
              clearable
              placeholder="请输入商品名称"
              style="width: 200px"
            />
          </Form-item>

          <Form-item label="商品货号" prop="productName">
            <Input
              type="text"
              v-model="searchForm.spuNum"
              clearable
              placeholder="请输入商品名称"
              style="width: 200px"
            />
          </Form-item>
          <span v-if="drop">
          <Form-item label="商品分类" prop="productName">
            <Input
              type="text"
              v-model="searchForm.catelogId"
              clearable
              placeholder="请输入商品分类"
              style="width: 200px"
            />
          </Form-item>

          <Form-item label="商品品牌" prop="brand">
            <Input
              type="text"
              v-model="searchForm.brand"
              clearable
              placeholder="请输入商品分类"
              style="width: 200px"
            />
          </Form-item>

          <Form-item label="上架时间" prop="upTime">
            <Input
              type="text"
              v-model="searchForm.upTime"
              clearable
              placeholder="请输入商品分类"
              style="width: 200px"
            />
          </Form-item>

          <Form-item label="审核状态" prop="status">
            <Input
              type="text"
              v-model="searchForm.status"
              clearable
              placeholder="请输入商品分类"
              style="width: 200px"
            />
          </Form-item>
          </span>
          <Form-item style="margin-left:-35px;" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleReset">重置</Button>
            <a class="drop-down" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"/>
            </a>
          </Form-item>
        </Form>
      </Row>
      <Row class="operation">
        <Button @click="handleAddProduct" type="primary" icon="md-add">添加商品</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
        <Dropdown @on-click="handleDropdown">
          <Button>
            更多操作
            <Icon type="md-arrow-dropdown"/>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="refresh">刷新</DropdownItem>
            <DropdownItem name="reset">重置用户密码</DropdownItem>
            <DropdownItem name="exportData">导出所选数据</DropdownItem>
            <DropdownItem name="exportAll">导出全部数据</DropdownItem>
            <DropdownItem name="importData">导入数据(付费)</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? "关闭搜索" : "开启搜索"}}</Button>
        <Button type="dashed" @click="openTip=!openTip">{{openTip ? "关闭提示" : "开启提示"}}</Button>
      </Row>
      <Row v-show="openTip">
        <Alert show-icon>
          已选择
          <span class="select-count">{{selectCount}}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
      </Row>
      <Row>
        <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          sortable="custom"
          @on-sort-change="changeSort"
          @on-selection-change="showSelect"
          ref="table"
          stripe
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="handleEditProduct(row)">编辑</Button>
            <Button type="error" size="small" @click="handleDelProduct(row.id)">删除</Button>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page
          :current="current"
          :total="total"
          :page-size="size"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          size="small"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </Row>
    </Card>
    <add-product :add-product-modal="productModal" @closeAddProductModal="closeAddProductModal"></add-product>
    <Modal
      title="查看大图"
      v-model="productPicModal"
      footer-hide
      class-name="vertical-center-modal">
      <img :src="productPicUrl" v-if="productPicModal" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  import {loadProductList} from '@/api/pms/product'
  import AddProduct from './addProduct'

  export default {
    components: {AddProduct},
    comments: {
      AddProduct
    },
    props: {},
    data() {
      return {
        drop: false,
        loading: true,
        dropDownContent: '展开',
        dropDownIcon: 'ios-arrow-down',
        openSearch: true,
        selectCount: 1,
        productPicModal: false,
        productPicUrl: '',
        data: [],
        searchForm: {
          productName: '',
          spuNum: '',
          catelogId: '',
          brand: '',
          upTime: '',
          status: '',
        },
        current: 1,
        size: 10,
        total: 0,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            type: 'index',
            width: 80,
            align: 'center',
            fixed: 'left',
            title: '序号'
          },
          {
            title: '品牌',
            width: 100,
            align: 'center',
            key: 'brandName',
            sortable: true
          },
          {
            title: '商品图片',
            width: 100,
            align: 'center',
            key: 'productPic',
            render: (h, params) => {
              const row = params.row
              return h('div', [
                  h('img', {
                    style: {
                      'margin-top': '10px',
                      'margin-bottom': '10px',
                      'border-radius': '4px',
                      width: '50px',
                      height: '50px',
                      cursor: 'pointer'
                    },
                    attrs: {
                      'src': row.productPic,
                      onerror: row.productPic
                    },
                    on: {
                      click: (e) => {
                        this.handleProductPictureView(e.srcElement.currentSrc)
                      }
                    }
                  })
                ]
              )
            }
          },
          {
            title: '商品名称',
            width: 200,
            align: 'center',
            key: 'productName',
            fixed: 'left',
            sortable: true
          },
          {
            title: '商品价格',
            width: 130,
            align: 'center',
            key: 'price',
            sortable: true
          },
          {
            title: '市场价',
            width: 100,
            align: 'center',
            key: 'originalPrice',
            sortable: true
          },
          {
            title: '库存',
            width: 100,
            align: 'center',
            key: 'stock',
            sortable: true
          },
          {
            title: '库存预警值',
            width: 130,
            align: 'center',
            key: 'lowStock',
            sortable: true
          },
          {
            title: '货号',
            width: 100,
            align: 'center',
            key: 'productSn',
            sortable: true
          },
          {
            title: '销量',
            width: 100,
            align: 'center',
            key: 'sale',
            sortable: true
          },
          {
            title: '上架状态',
            width: 130,
            align: 'center',
            key: 'publishStatus',
            sortable: true,
            render: (h, params) => {  // 重点
              return h('div', [
                h('i-switch', {
                  props: {
                    type: 'primary',
                    size: 'large',
                    value: params.row.publishStatus,
                    'true-value': 1,
                    'false-value': 0,
                    'true-color':'#13ce66',
                    'false-color':'#ff4949'
                  },
                  scopedSlots: {
                    open: function () {
                      return h("span", "上架")
                    },
                    close: function () {
                      return h("span", "下架")
                    }
                  },
                  on: {
                    'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                      //参数value是回调值
                      this.updateProductPublishStatus(params.row.id,value)
                    }
                  }
                }, '')])
            }
          },
          {
            title: '促销类型',
            key: 'promotionType',
            width: 130,
            align: 'center',
            render: (h, params) => {
              const row = params.row

              if (row.promotionType === 0) {
                return h('Tag', {
                  props: {
                    color: 'success'
                  }
                }, '原价')
              } else if(row.promotionType === 1){
                return h('Tag', {
                  props: {
                    color: 'error'
                  }
                }, '促销价')
              }else if(row.promotionType === 2){
                return h('Tag', {
                  props: {
                    color: '#6495ED'
                  }
                }, '会员价')
              }else if(row.promotionType === 3){
                return h('Tag', {
                  props: {
                    color: 'blue'
                  }
                }, '阶梯价')
              }else if(row.promotionType === 4){
                return h('Tag', {
                  props: {
                    color: 'error'
                  }
                }, '满减')
              }else if(row.promotionType === 5){
                return h('Tag', {
                  props: {
                    color: 'error'
                  }
                }, '限时购')
              }
            }
          },
          {
            title: '操作',
            slot: 'action',
            width: 200,
            align: 'center',
            fixed: 'right'
          }
        ],
        productModal: false,
      }
    },
    methods: {
      init() {
        this.productList()
      },
      productList() {
        loadProductList(this.current, this.size, this.searchForm).then(res => {
          this.loading = false
          this.data = res.data.records
        })
      },
      dropDown() {
        if (this.drop) {
          this.dropDownContent = "展开";
          this.dropDownIcon = "ios-arrow-down";
        } else {
          this.dropDownContent = "收起";
          this.dropDownIcon = "ios-arrow-up";
        }
        this.drop = !this.drop;
      },
      //点击搜索
      handleSearch() {

      },
      //重置搜索参数
      handleReset() {

      },
      //清空搜索参数
      clearSelectAll() {

      },
      //下拉按钮
      handleDropdown() {

      },
      //点击添加商品
      handleAddProduct() {
        this.productModal = true
      },
      closeAddProductModal() {
        this.productModal = false
      },
      delAll() {

      },
      //分页触发
      changePage() {

      },
      changePageSize() {

      },
      openTip() {

      },
      changeSort() {

      },
      showSelect() {

      },
      //预览商品图片
      handleProductPictureView(url) {
        this.productPicModal = true
        this.productPicUrl = url
      },
      //修改商品上架状态
      updateProductPublishStatus(id,status) {
        //todo 修改商品上下架状态
        console.log(id)
        console.log(status)
      },
      handleEditProduct(row){
        console.log("点击编辑按钮======>"+row)
      },
      handleDelProduct(id){
        console.log("点击删除按钮======>"+id)
      }
    },
    mounted() {
      this.init()
    }
  };
</script>
