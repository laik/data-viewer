# api 标准规范


## 业务展示对象：超速统计

```
交互协议数据：

例:

// 交互数据协议结构
{
 
   "uid": "e1f96499-0836-41de-9306-243904b96bb1",  //UUID或者唯一名
   "kind": "overspeed",
   "version": "1638434837"

   "section": [140.11,22.23],
   "vehicle": "粤A11000",
}

// 集合列表结构

{
   "kind": "overspeed",
   "version": "1638434838"   // items里的版本号最大的
  "items":
      [
      {
        "uid": "e1f96499-0836-41de-9306-243904b96bb1",  //UUID或者唯一名
        "kind": "overspeed",
        "version": "1638434837"
        "section": [140.11,22.23],
        "vehicle": "粤A11000",
      },
       {
      "name": "e1f96499-0836-41de-9306-243904b96bb2",  //UUID或者唯一名
      "kind": "overspeed",
      "version": "1638434838"
      "section": [140.11,22.23],
      "vehicle": "粤A11001",
      }
      ]
}
```

## API规范

### 基于restful规范，拓展可以支持业务，版本，业务实体等多种维度的业务操作

操作与http method

创建数据 Create    POST     C
删除数据 Delete    DELETE   D
更新数据 Update    PUT      U
查询数据 Query|Read  GET    R

### API设计

1.1 基础API，每个API的设计与开发前需要拟定好后端的服务名

例1，查询超速车辆的集合，GET /base/apis/dataview.ym/v1/overspeed

服务                  base
api类型        apis
域名(公司或者业务)   dataview.ym
版本         v1
业务实体名       overspeed
 
例2，查询超速车辆单个用唯一，GET /base/apis/dataview.ym/v1/overspeed/:name
name                  业务UUID/name

1.2 拓展带更多操作API

例1, 将控制器的某个job暂停,使用的是http put,但是put一般用于更新数据对象，所以增加url op
样例：PUT /base/apis/controller.ym/v1/job/:name/op/pause

1.3 带租户/工作空间/命名空间的方式,三者中根据设计选择一种。
/base/apis/controller.ym/v1/namespace/:namespace/job/:name/op/pause
/base/apis/controller.ym/v1/workspace/:workspace/job/:name/op/pause
/base/apis/controller.ym/v1/tenant/:tenant/job/:name/op/pause

1.4 如果需要有workspace + tenant的方式
/base/apis/controller.ym/v1/workspace/:workspace/job/:name/op/pause?tenant=我是租户
