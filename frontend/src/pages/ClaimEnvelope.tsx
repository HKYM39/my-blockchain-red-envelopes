type Props = {
  envelopeId: string
  onBack: () => void
}

const ClaimEnvelope = ({ envelopeId, onBack }: Props) => {
  const handleOpen = () => {
    console.log('抢红包占位', { envelopeId })
  }

  return (
    <main className="screen">
      <section className="card claim-card">
        <div className="claim-header">
          <div className="avatar">链</div>
          <div>
            <p className="card-subtitle subtle">好友红包</p>
            <h2 className="card-title">链上红包</h2>
            <p className="claim-id">红包 ID：{envelopeId}</p>
          </div>
        </div>

        <p className="claim-blessing">祝你手气最佳，秒变锦鲤</p>

        <button className="open-button" onClick={handleOpen}>
          拆
        </button>
      </section>

      <div className="nav-actions">
        <button className="ghost-button" onClick={onBack}>
          返回发红包
        </button>
        <div className="hint">
          路径格式：<code>/claim/红包ID</code>，刷新后依然会停留在抢红包页面。
        </div>
      </div>
    </main>
  )
}

export default ClaimEnvelope
