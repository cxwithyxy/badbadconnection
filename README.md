# Badbadconnection

利用 **免费** 的 websocket 服务实现多客户端消息传递

## 版本

> v4.20191018203150

#### 历史版本

| 版本              | 特性                                                         |
| ----------------- | ------------------------------------------------------------ |
| v4.20191018203150 | 功能 增加websocketin的支持                                   |
| v3.20190929094933 | 功能 自动分割数据包                                          |
| v2.20190918142006 | 修复 实例化时没有成功连接websocket的问题<br />修复 自身发送的消息被自身再次接收的问题 |
| v1.20190917144230 | 修复 一条消息被接收两次的问题                                |
| v2.201908201135   | 功能 能够对消息内容进行加密和解密                            |
| v1.201908191144   | 功能 能进行消息传递                                          |



## 使用

#### 安装

```
yarn add git+https://github.com/cxwithyxy/badbadconnection.git
```

#### 代码编写

###### 基础代码

客户端A：

```typescript
let badbadconnection = await new Badbadconnection("our_char_room").init()
badbadconnection.on_recv((msg: string) =>
{
    console.log("收到消息了: " + msg)
})
badbadconnection.send("我是客户端A")
```

客户端B：

```typescript
let badbadconnection = await new Badbadconnection("our_char_room").init()
badbadconnection.on_recv((msg: string) =>
{
    console.log("收到消息了: " + msg)
})
badbadconnection.send("我是客户端B")
```

###### 启动加密

采用CTR加密，传入 **密码（string）** 和 **计数器（number）** 进行实例化即可

```typescript
let badbadconnection = await new Badbadconnection("our_char_room", {key: "我的密码", counter: 7}).init()
```



##  开发

#### 安装依赖

```
yarn
```

#### 测试

```
yarn test
```

