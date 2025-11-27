# 链上红包 Demo

一个包含智能合约与前端的链上红包示例。合约负责创建/拆红包，前端提供微信风格的发红包与抢红包体验，并接入钱包和链上交互。

## 仓库结构
- `hardHat/`：Hardhat 3 项目，包含红包合约 `contracts/redPack.sol`、测试与部署配置。
- `frontend/`：Vite + React + wagmi 前端，提供发红包和抢红包页面。

## 功能概览
- 发红包：输入金额与数量，调用 `createPacket` 上链，自动弹出“发送成功”弹框，展示红包 ID 与跳转路径。
- 抢红包：通过 `/claim/:id` 路由访问，点击“拆”调用 `grabPacket`，弹出领取结果。
- 钱包与网络：右上角展示当前网络与钱包信息（wagmi + MetaMask/injected connectors）。
- UI 风格：喜庆红金配色，移动端友好的单页切换。

## 快速开始
### 环境要求
- Node.js 18+（Hardhat 3 需要较新 Node）
- 推荐使用 `pnpm`（仓库自带 pnpm-lock）

### 1) 安装依赖
```bash
# 合约
cd hardHat
pnpm install

# 前端
cd ../frontend
pnpm install
```

### 2) 配置环境变量
- 前端 `frontend/.env`：提供合约地址  
  ```bash
  VITE_CONTRACT_ADDRESS=0xYourDeployedContract
  ```
- 合约部署到 Sepolia 时，需要提供 RPC 与私钥（可通过环境变量或 hardhat-keystore）：
  ```bash
  export SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/xxx
  export SEPOLIA_PRIVATE_KEY=0xyourprivatekey
  ```

### 3) 本地开发
```bash
cd frontend
pnpm dev
# 默认 http://localhost:5173 打开发红包页，抢红包路径为 /claim/:id
```

### 4) 合约测试与部署
```bash
cd hardHat

# 运行测试
pnpm hardhat test

# 本地网络部署示例
pnpm hardhat ignition deploy ignition/modules/Counter.ts

# 部署到 Sepolia（需提前配置 RPC 与私钥）
pnpm hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```

部署完成后，将生成的合约地址填入前端 `.env` 中的 `VITE_CONTRACT_ADDRESS`，重新运行前端即可与链上交互。

## 合约简述 (`hardHat/contracts/redPack.sol`)
- `createPacket(uint256 count)`：创建红包，`msg.value` 为总金额，`count` 为份数，触发 `packetCreated` 事件，返回红包 ID。
- `grabPacket(uint256 id)`：按平均值拆红包，防重复领取，最后一份拿走剩余全部，触发 `grabbed` 事件。

## 前端要点 (`frontend/`)
- 技术栈：React 19 + Vite 7 + wagmi 3 + viem 2 + TanStack Query。
- 路由：自定义路径解析，`/` 为发红包，`/claim/:id` 为抢红包。
- 交互：使用 `useWriteContract` 调用合约，`useWaitForTransactionReceipt` 监听上链结果，解析 `PacketCreated` 事件更新红包 ID。

## 可能的后续优化
- 接入更完整的错误提示与状态 loading。
- 增加手续费/余额校验与输入格式校验。
- 接入后端/graph 服务用于红包列表与历史记录。

## 许可证
MIT
