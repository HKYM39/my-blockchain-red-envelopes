import { useEffect, useMemo, useState } from "react";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abiJson from "../abis/RedPack.json";
import { decodeEventLog, parseEther } from "viem";
import { sepolia } from "viem/chains";

type Props = {
  onPreviewClaim: (id: string) => void;
};

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const ABI = abiJson.abi;

const SendEnvelope = ({ onPreviewClaim }: Props) => {
  const [amount, setAmount] = useState("");
  const [count, setCount] = useState("");
  const [previewId, setPreviewId] = useState("demo-id");
  const [showSuccess, setShowSuccess] = useState(false);
  const [sentId, setSentId] = useState("");
  const [sentAmount, setSentAmount] = useState("");
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  // const [isPending, setPending] = useState<Boolean>(false);
  const { data: receipt, isLoading: isMining } = useWaitForTransactionReceipt({
    hash,
    chainId: sepolia.id,
  });

  const isSending = isPending || isMining;

  const handleSend = () => {
    // setPending(true);
    console.log("发送红包占位", { amount, count });
    writeContract(
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "createPacket",
        args: [count],
        value: parseEther(amount),
      },
      {
        onSuccess(data) {
          console.log(
            "%c [ data ]-39",
            "font-size:14px; background:pink; color:#bf2c9f;",
            "红包发送成功！",
            data
          );
        },
      }
    );
    if (error) {
      throw new Error("交互错误", error);
    }
  };
  useEffect(() => {
    console.log(receipt);

    if (!receipt) return;
    for (const log of receipt.logs) {
      try {
        const event = decodeEventLog({
          abi: ABI,
          topics: log.topics,
          data: log.data,
        });
        if (event.eventName === "packetCreated") {
          const packetId = event!.args.id;
          console.log("红包ID：", packetId.toString());
          const packetIdString = packetId.toString();
          setPreviewId(packetIdString);
          setSentId(packetIdString);
          setSentAmount(amount || "0.00");
          setShowSuccess(true);
        }
      } catch (e) {
        //
        console.error(e);
      }
    }
  }, [isMining]);

  const previewPath = useMemo(
    () => `/claim/${previewId || "{id}"}`,
    [previewId]
  );

  const handlerAmountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === "" || /^(\d+(\.\d*)?|\.\d*)$/.test(input)) {
      setAmount(input);
    }
  };
  const handlerSizeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === "" || /^[1-9]\d*$/.test(input)) {
      setCount(input);
    }
  };

  return (
    <main className="screen">
      <section className="card send-card">
        <div className="card-header">
          <p className="card-subtitle">红包Demo</p>
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
            onChange={handlerAmountChanged}
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
              onChange={handlerSizeChanged}
            />
          </label>
        </div>

        <button className="primary-button" onClick={handleSend}>
          {isSending ? (
            <span className="flex items-center gap-2">
              等待上链…
              <span className="loader"></span>
            </span>
          ) : (
            <span>塞进红包</span>
          )}
        </button>
      </section>

      {showSuccess && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <p className="card-subtitle subtle">红包已上链</p>
            <h3 className="modal-amount">¥{sentAmount || amount || "0.00"}</h3>
            <p className="modal-meta">红包 ID：{sentId || previewId}</p>
            <p className="modal-meta">路由：{previewPath}</p>
            <div className="preview-row" style={{ marginTop: 12 }}>
              <button
                className="ghost-button"
                onClick={() => onPreviewClaim(sentId || previewId)}
              >
                去抢红包
              </button>
              <button
                className="primary-button"
                onClick={() => setShowSuccess(false)}
              >
                继续发红包
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="card tips-card">
        <div className="tips-header">
          <span className="pill">路由</span>
          <span className="path">{previewPath}</span>
        </div>
        <p className="tips-text">
          抢红包页面通过路由参数访问。输入任意红包
          ID，点击下方按钮即可跳转到抢红包效果页。
        </p>
        <div className="preview-row">
          <input
            className="text-input"
            value={previewId}
            onChange={(e) => setPreviewId(e.target.value)}
            placeholder="示例：abc123"
          />
          <button
            className="ghost-button"
            onClick={() => onPreviewClaim(previewId)}
          >
            打开抢红包
          </button>
        </div>
      </section>
    </main>
  );
};

export default SendEnvelope;
