# Badbadconnection

利用 **免费** 的 websocket 服务实现多客户端消息传递

## 版本

> v2.201908201135

#### 历史版本

| 版本            | 特性                         |
| --------------- | ---------------------------- |
| v2.201908201135 | 能够对消息内容进行加密和解密 |
| v1.201908191144 | 能进行消息传递               |



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

