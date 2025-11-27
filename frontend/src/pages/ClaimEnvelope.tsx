import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abiJson from "../abis/RedPack.json";
import { decodeEventLog, formatEther } from "viem";

type Props = {
  envelopeId: string;
  onBack: () => void;
};

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const ABI = abiJson.abi;

const ClaimEnvelope = ({ envelopeId, onBack }: Props) => {
  const [showResult, setShowResult] = useState(false);
  const [amount, setAmount] = useState("0.00");
  const [sender, setSender] = useState("好友");
  const { writeContract, data: hash, error } = useWriteContract();
  const { data: receipt, isLoading: isMining } = useWaitForTransactionReceipt({
    hash,
  });
  const handleOpen = () => {
    console.log("抢红包占位", { envelopeId });

    writeContract(
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "grabPacket",
        args: [envelopeId],
      },
      {
        onSuccess(data) {
          console.log(
            "%c [ data ]-31",
            "font-size:14px; background:pink; color:#bf2c9f;",
            data,
            "抢红包成功！"
          );
        },
      }
    );
    if (error) {
      throw new Error("交互错误", error);
    }
  };

  useEffect(() => {
    if (!receipt) return;
    for (const log of receipt.logs) {
      try {
        const event = decodeEventLog({
          abi: ABI,
          data: log.data,
          topics: log.topics,
        });

        if (event.eventName === "grabbed") {
          const amount = event.args.amount;
          setAmount(formatEther(amount));
          setSender("链上好友");
          setShowResult(true);
        }
      } catch (e) {
        console.error(e);
        return;
      }
    }
  }, [isMining]);

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

      {showResult && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <p className="card-subtitle subtle">红包到账</p>
            <h3 className="modal-amount">¥{amount}</h3>
            <p className="modal-meta">来自：{sender}</p>
            <p className="modal-meta">红包 ID：{envelopeId}</p>
            <button
              className="primary-button"
              onClick={() => setShowResult(false)}
            >
              继续抢红包
            </button>
          </div>
        </div>
      )}

      <div className="nav-actions">
        <button className="ghost-button" onClick={onBack}>
          返回发红包
        </button>
        <div className="hint">
          路径格式：<code>/claim/红包ID</code>，刷新后依然会停留在抢红包页面。
        </div>
      </div>
    </main>
  );
};

export default ClaimEnvelope;
