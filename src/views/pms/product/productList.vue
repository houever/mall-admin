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
        ></Table>
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
  </div>
</template>

<script>
  import {loadProductList} from '@/api/pms/product'

  export default {
    props: {},
    data() {
      return {
        drop: false,
        loading: true,
        dropDownContent: '展开',
        dropDownIcon: 'ios-arrow-down',
        openSearch: true,
        selectCount: 1,
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
        size: 1,
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
            title: '商品名称',
            width: 200,
            align: 'center',
            key: 'spuName',
            fixed: 'left',
            sortable: true
          },
        ],
      }
    },
    methods: {
      init() {
        this.productList()
      },
      productList() {
        loadProductList(this.current,this.size,this.searchForm).then(res => {
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

      }
    },
    mounted() {
      this.init()
    }
  };
</script>
