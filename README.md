# Badbadconnection

利用 **免费** 的 websocket 服务实现多客户端消息传递

## 版本

> v1.201908191144

## 使用

#### 安装

```
yarn add git+https://github.com/cxwithyxy/badbadconnection.git
```

#### 代码编写

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



##  开发

#### 安装依赖

```
yarn
```

#### 测试

```
yarn test
```

