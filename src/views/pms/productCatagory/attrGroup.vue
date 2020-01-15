<template>
  <div>
    <Button :size="buttonSize" type="primary" @click="addAttrGroup">
      <Icon type="ios-arrow-back"/>
      添加属性
    </Button>
    <!--表格数据-->

    <Table border :columns="columns" :data="attrGroupList"></Table>

    <Modal v-model="showAddAttrGroup" width="720">
      <p slot="header" style="color:#2342ff;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>【{{this.attrGroupName}}】属性组关联</span>
      </p>
      <Table highlight-row ref="attrGroupRelation" :columns="attrGroupRelationColumn"
             :data="attrGroupRelationData"></Table>
    </Modal>

    <!--添加属性对话框-->
    <Modal v-model="handleAddAttrGroup" width="720">
      <p slot="header" style="color:#5cb4ff;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>添加属性</span>
      </p>
      <div style="text-align:center">
        <Form :model="attrForm" :label-width="80">
          <FormItem label="Input">
            <Input v-model="attrForm.attrName" placeholder="请输入属性名称..."></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" :loading="modal_loading" @click="doAddAttrGroup">保存</Button>
        <Button type="primary" :loading="modal_loading" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {attrGroupRelationList, delAttrGroupRelation} from '@/api/pms/product'

  export default {
    name: 'attrGroup',
    props: {
      attrGroupList: {
        type: Array,
        required: true,
        default: () => {
          return []
        }
      },
      catelogId: {
        type: Number,
        default: '默认显示的信息',
        require: false // 必填
      },
      catName: {
        type: String,
        default: '默认显示的信息',
        require: false // 必填
      }
    },
    data() {
      return {
        attrForm: {
          attrName: ''
        },
        attrGroupId: '',
        attrGroupRelationData: [],
        attrGroupName: '',
        showAddAttrGroup: false,
        modal_loading: false,
        handleAddAttrGroup: false,
        buttonSize: 'large',
        columns: [
          {
            title: '属性分组id',
            key: 'attrGroupId'
          },
          {
            title: '属性分组名',
            key: 'attrGroupName'
          },
          {
            title: '分类',
            key: 'catName'
          },
          {
            title: '分组描述',
            key: 'descript'
          },
          {
            title: '分组图标',
            key: 'icon'
          },
          {
            title: '分组顺序',
            key: 'sort'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showAddrGroup(params)
                    }
                  }
                }, '维护关联'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        attrGroupRelationColumn: [
          {
            title: '属性id',
            key: 'attrId'
          },
          {
            title: '属性信息',
            key: 'attrName'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeAttrGroupRelation(params)
                    }
                  }
                }, '删除关联')
              ])
            }
          }
        ]
      }
    },
    methods: {
      //点击添加属性
      addAttrGroup() {
        this.handleAddAttrGroup = true
      },
      //执行添加属性
      doAddAttrGroup() {

      },
      //关闭窗口
      cancel() {
        this.handleAddAttrGroup = false
      },
      //维护关联关系
      showAddrGroup(p) {
        this.attrGroupName = p.row.attrGroupName
        this.showAddAttrGroup = true
        this.attrGroupId = p.row.attrGroupId
        this.loadAttrGroupRelationData(p)
      },
      loadAttrGroupRelationData() {
        attrGroupRelationList(this.attrGroupId).then(res => {
          if (res.success) {
            this.attrGroupRelationData = res.data
          }
        });
      },

      remove(p) {

      },
      //删除关联关系
      removeAttrGroupRelation(p) {
        const param = {
          'attrId': p.row.attrId,
          'attrGroupId': this.attrGroupId
        }
        delAttrGroupRelation(param).then(res => {
          if (res.success) {
            this.$Message.success('解除关联关系成功');
            this.loadAttrGroupRelationData(this.attrGroupId)
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
