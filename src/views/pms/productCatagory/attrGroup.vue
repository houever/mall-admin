<template>
  <div>
    <Button :size="buttonSize" type="primary" @click="addAttrGroup">
      <Icon type="ios-arrow-back"/>
      添加属性分组
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

    <!--添加属性分组-->
    <Modal v-model="handleAddAttrGroup" width="720">
      <p slot="header" style="color:#5cb4ff;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>添加属性分组</span>
      </p>
      <div style="text-align:center">
        <Form :model="attrGroupForm" :label-width="120">
          <FormItem label="属性分组名称">
            <Input v-model="attrGroupForm.attrGroupName" placeholder="请输入分组名称..."></Input>
          </FormItem>
          <FormItem label="属性分组排序">
            <InputNumber size="large" placeholder="属性分组排序..." :max="100" :min="1"
                         v-model="attrGroupForm.sort"></InputNumber>
          </FormItem>
          <FormItem label="属性分组描述">
            <Input v-model="attrGroupForm.descript" placeholder="属性分组描述..."></Input>
          </FormItem>

          <FormItem label="图标">
            <Upload
              multiple
              type="drag"
              :default-file-list=this.attrIconFileList
              :before-upload="beforeUploadAttrIcon"
              :on-progress="progressUploadAttrIcon"
              :on-success="successUploadAttrIcon"
              :on-error="errorUploadAttrIcon"
              action="//jsonplaceholder.typicode.com/posts/">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或者拖拽上传图标(只能上传jpg/png文件，且不超过10MB)</p>
              </div>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" :loading="modal_loading" @click="doAddAttrGroup">保存</Button>
        <Button type="primary" :loading="modal_loading" @click="closeAttrGroup">取消</Button>
      </div>
    </Modal>
    <!--添加属性对话框-->
    <Modal v-model="handleAddAttr" width="720">
      <p slot="header" style="color:#5cb4ff;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>添加属性分组</span>
      </p>
      <div style="text-align:center">
        <Form :model="attrForm" :label-width="120">
          <FormItem label="属性名称">
            <Input v-model="attrForm.attrName" placeholder="请输入属性名称..."></Input>
          </FormItem>
          <FormItem label="属性名称">
            <Row
              v-for="(item,index) in attrForm.attrValue"
              :key="index"
              style="border-bottom: 1px solid #f0f0f0;padding: 10px;"
            >
              <Col span="12">
                <Input v-model="attrForm.attrValue[index]" placeholder="请输入属性名称..."></Input>
              </Col>
              <Col span="12">
                <Button type="primary" icon="ios-add" @click="handleAddAttrVal()">新增参数</Button>
                <Button type="error" icon="ios-close" @click="handleDelAttrVal()">删除参数</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="属性类型">
            <Select v-model="attrForm.attrType">
              <Option value="1">基本属性</Option>
              <Option value="0">销售属性</Option>
            </Select>
          </FormItem>
          <FormItem label="是否需要检索">
            <i-switch v-model="attrForm.searchType" true-value=1 false-value=0 size="large" true-color="#13ce66"
                      false-color="#ff4949">
              <span slot=1>是</span>
              <span slot=0>否</span>
            </i-switch>
          </FormItem>
          <FormItem label="可否选择多个值">
            <i-switch v-model="attrForm.valueType" true-value="1" false-value="0" size="large" true-color="#13ce66"
                      false-color="#ff4949">
              <span slot="1">是</span>
              <span slot="0">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否启用">
            <i-switch v-model="attrForm.enable" true-value="1" false-value="0" size="large" true-color="#13ce66"
                      false-color="#ff4949">
              <span slot="1">是</span>
              <span slot="0">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否展示在介绍">
            <i-switch v-model="attrForm.showDesc" true-value="1" false-value="0" size="large" true-color="#13ce66"
                      false-color="#ff4949">
              <span slot="1">是</span>
              <span slot="0">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="图标">
            <Upload
              multiple
              type="drag"
              :default-file-list=this.attrIconFileList
              :before-upload="beforeUploadAttrIcon"
              :on-progress="progressUploadAttrIcon"
              :on-success="successUploadAttrIcon"
              :on-error="errorUploadAttrIcon"
              action="//jsonplaceholder.typicode.com/posts/">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或者拖拽上传图标(只能上传jpg/png文件，且不超过10MB)</p>
              </div>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" :loading="modal_loading" @click="doAddAttr">保存</Button>
        <Button type="primary" :loading="modal_loading" @click="closeAttr">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    attrGroupPage,
    callDelAttrGroup,
    attrGroupRelationList,
    delAttrGroupRelation,
    callAddAttrGroup,
    callAddAttr
  } from '@/api/pms/product'

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
        attrGroupForm: {
          attrGroupName: '',
          sort: 0,
          descript: '',
          icon: ''
        },
        attrForm: {
          attrName: '',
          attrValue: [''],
          valueSelect: '',
          attrType: 1,
          searchType: 1,
          valueType: 1,
          enable: 1,
          showDesc: 1,
          icon: ''
        },
        attrIconFileList: [],
        attrGroupId: '',
        attrGroupRelationData: [],
        attrGroupName: '',
        showAddAttrGroup: false,
        modal_loading: false,
        handleAddAttr: false,
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
            width: 300,
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
                      this.addAttr(params)
                    }
                  }
                }, '新增属性'),
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
                      this.removeAttrGroup(params)
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
      //点击添加属性分组
      addAttrGroup() {
        if (this.catelogId === 0) {
          this.$Message.error('请选择分类');
          return;
        }
        this.handleAddAttrGroup = true
      },
      //点击添加属性
      addAttr(p) {
        this.attrForm.attrGroupId = p.row.attrGroupId
        this.attrForm.catelogId = this.catelogId
        this.handleAddAttr = true
      },
      //添加属性分组
      doAddAttrGroup() {
        this.attrGroupForm.catelogId = this.catelogId
        console.log(this.attrGroupForm)
        //调用后端接口处理添加属性分组
        callAddAttrGroup(this.attrGroupForm).then(res => {
          console.log(res)
          this.loadAttrGroupPage()
          this.handleAddAttrGroup = false
        })
      },
      //后端添加属性
      doAddAttr() {
        this.attrForm.valueSelect = JSON.stringify(this.attrForm.attrValue)
        callAddAttr(this.attrForm).then(res => {
          if (res.success) {
            this.$Message.success('新增属性成功');
            this.handleAddAttr = false
          }
        })
      },
      //关闭窗口
      closeAttrGroup() {
        this.handleAddAttrGroup = false
      },
      closeAttr(modal) {
        this.handleAddAttr = false
      },
      //维护关联关系
      showAddrGroup(p) {
        this.attrGroupName = p.row.attrGroupName
        this.showAddAttrGroup = true
        this.attrGroupId = p.row.attrGroupId
        this.loadAttrGroupRelationData(p)
      },
      //加载属性分组列表
      loadAttrGroupRelationData() {
        attrGroupRelationList(this.attrGroupId).then(res => {
          if (res.success) {
            this.attrGroupRelationData = res.data
          }
        });
      },

      //删除属性分组
      removeAttrGroup(p) {
        callDelAttrGroup(p.row.attrGroupId).then(res => {
          if (res.success) {
            this.$Message.success('删除分组成功');
            this.loadAttrGroupPage()
          }
        })
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
      },
      //增加一个属性值
      handleAddAttrVal() {
        this.attrForm.attrValue.push('')
      },
      //删除一个属性值
      handleDelAttrVal() {
        this.attrForm.attrValue.splice(this.attrForm.attrValue.length - 1, 1)
      },
      //上传之前钩子
      beforeUploadAttrIcon(file) {
        console.log("上传前", file)
      },
      progressUploadAttrIcon(event, file, fileList) {
        console.log("处理中")
      },
      successUploadAttrIcon(response, file, fileList) {
        console.log("上传成功", response, file, fileList)
      },
      errorUploadAttrIcon(error, file, fileList) {
        console.log("上传失败", error)
      },
      loadAttrGroupPage() {
        attrGroupPage(this.catelogId).then(res => {
          if (res.success) {
            res.data.forEach((e) => e.catName = this.catName)
            this.attrGroupList = res.data
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
