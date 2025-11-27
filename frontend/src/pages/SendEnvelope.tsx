import { useMemo, useState } from 'react'

type Props = {
  onPreviewClaim: (id: string) => void
}

const SendEnvelope = ({ onPreviewClaim }: Props) => {
  const [amount, setAmount] = useState('')
  const [count, setCount] = useState('')
  const [message, setMessage] = useState('恭喜发财，大吉大利')
  const [previewId, setPreviewId] = useState('demo-id')

  const handleSend = () => {
    console.log('发送红包占位', { amount, count, message })
  }

  const previewPath = useMemo(() => `/claim/${previewId || '{id}'}`, [previewId])

  return (
    <main className="screen">
      <section className="card send-card">
        <div className="card-header">
          <p className="card-subtitle">微信风格 · 拼手气红包</p>
          <h1 className="card-title">发红包</h1>
        </div>

        <div className="envelope-figure">
          <div className="figure-top">
            <div className="seal">福</div>
            <div className="figure-meta">
              <span className="meta-label">红包金额</span>
              <span className="meta-value">￥</span>
            </div>
          </div>
          <input
            className="figure-amount"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-grid">
          <label className="form-item">
            <span className="form-label">红包个数</span>
            <input
              className="text-input"
              inputMode="numeric"
              placeholder="输入数量"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </label>
          <label className="form-item">
            <span className="form-label">祝福语</span>
            <input
              className="text-input"
              placeholder="对方将看到这句话"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
        </div>

        <button className="primary-button" onClick={handleSend}>
          塞钱进红包
        </button>
      </section>

      <section className="card tips-card">
        <div className="tips-header">
          <span className="pill">路由</span>
          <span className="path">{previewPath}</span>
        </div>
        <p className="tips-text">
          抢红包页面通过路由参数访问。输入任意红包 ID，点击下方按钮即可跳转到抢红包效果页。
        </p>
        <div className="preview-row">
          <input
            className="text-input"
            value={previewId}
            onChange={(e) => setPreviewId(e.target.value)}
            placeholder="示例：abc123"
          />
          <button className="ghost-button" onClick={() => onPreviewClaim(previewId)}>
            打开抢红包
          </button>
        </div>
      </section>
    </main>
  )
}

export default SendEnvelope
