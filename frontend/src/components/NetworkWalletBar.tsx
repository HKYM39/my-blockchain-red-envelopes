import {
  useChains,
  useConnect,
  useConnection,
  useConnectors,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import "./NetworkWalletBar.css";

const NetworkWalletBar = () => {
  const connector = useConnectors()[0];
  const chains = useChains()[0];
  const { connect } = useConnect();

  const { address } = useConnection();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const addressFormat = (add: `0x${string}` | undefined) => {
    if (add) {
      return add
        .substring(0, 6)
        .concat("....")
        .concat(add.substring(add.length - 4));
    }
    return "";
  };

  const walletConnectHandler = () => {
    connect({ connector });
  };

  return (
    <>
      <div className="network-chip" title="当前连接网络">
        <span className="pill-dot" />
        {chains.name}
      </div>
      <button
        className="wallet-chip"
        title="链上钱包组件占位"
        type="button"
        onClick={walletConnectHandler}
      >
        <span className="pill-dot online" />
        <span className="wallet-text">{ensName ?? addressFormat(address)}</span>
        {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      </button>
    </>
  );
};

export default NetworkWalletBar;
