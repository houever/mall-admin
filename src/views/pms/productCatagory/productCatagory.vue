<style scss>
  @import "_productCatagory.scss";
</style>
<template>
  <div class="productCatagory">
    <Row>
      <Col span="8">
        <Card title="分类管理" icon="md-person">
          <ButtonGroup :size="buttonSize">
            <Button :size="buttonSize" type="primary">
              <Icon type="ios-arrow-back"/>
              添加一级分类
            </Button>
            <Button :size="buttonSize" type="success">
              添加子分类
              <Icon type="ios-arrow-forward"/>
            </Button>
            <Button :size="buttonSize" type="error">
              删除分类
              <Icon type="md-trash"/>
            </Button>
          </ButtonGroup>
          <Input
            v-model="searchKey"
            suffix="ios-search"
            @on-change="searchCatagory"
            placeholder="输入分类名搜索"
            clearable
          />
          <Tree :data="catagoryData" show-checkbox @on-select-change="selectCategory"></Tree>
        </Card>
      </Col>
      <Col span="16">
        <Card title="三级分类分组" icon="md-person">
          <attr-group :attr-group-list="attrGroupList" :catelog-id="catelogId" :cat-name="catName"></attr-group>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { catagoryTree, attrGroupPage } from '@/api/pms/product'
  import attrGroup from './attrGroup'

  export default {
    name: 'productCatagory',
    components: { attrGroup },
    props: {},
    data() {
      return {
        catelogId: 0,
        catName: '',
        searchKey: '',
        buttonSize: 'large',
        catagoryData: [],
        attrGroupList: []
      }
    },
    methods: {
      //初始化执行方法
      init() {
        this.loadCatagoryTree()
      },
      //加载分类菜单
      loadCatagoryTree() {
        let newData = []
        catagoryTree().then(res => {
          if (res.success) {
            this.catagoryData = res.data
          }
        })
      },
      //根据关键字查找分类
      searchCatagory() {

      },
      //选择分类,返回值：当前已选中的节点数组、当前项
      selectCategory(v, n) {
        console.log(v)
        console.log(n)
        this.catelogId = n.id
        this.catName = n.title
        attrGroupPage(this.catelogId).then(res => {
          if (res.success) {
            res.data.forEach((e)=>e.catName=this.catName)
            this.attrGroupList = res.data
          }
        })
      }
    },
    mounted() {
      this.init()
    }
  }

  function TreeData(title, id) {
    this.title = title
    this.id = id
  }
</script>
