// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RedPack {
    /**
     * @dev struct Packet：定义一个红包的数据结构
     * creator        创建人（即发红包的人）
     * totalAmount    红包总金额（单位：wei）
     * remainAmount   红包剩余金额（单位：wei）
     * totalCount     红包总份数
     * remainCount    红包剩余份数
     * claimed        记录谁抢过该红包（防止重复抢）
     */
    // 创建红包数据结构
    struct Packet {
        address creator;
        uint256 totalAmount;
        uint256 remainAmount;
        uint256 packetSize;
        uint256 remainSize;
        mapping(address => bool) cliamied;
    }
    // 自增红包Id
    uint256 public PacketId;
    // 红包Id与红包数据结构的Map
    mapping(uint256 => Packet) public packets;
    // 发红包事件
    event packetCreated(
        uint256 indexed id,
        address indexed creator,
        uint256 amount,
        uint256 size
    );

    // 抢红包事件
    event grabbed(uint256 indexed id, address indexed user, uint256 amount);
    // 发红包函数
    function createPacket(uint256 count) public payable returns (uint256) {
        require(msg.value > 0, "Packetd amount cannot be 0");
        require(count > 0, "Packet size cannot be 0");

        PacketId++;
        Packet storage p = packets[PacketId];

        p.creator = msg.sender;
        p.totalAmount = msg.value;
        p.remainAmount = msg.value;
        p.packetSize = count;
        p.remainSize = count;

        emit packetCreated(PacketId, msg.sender, msg.value, count);
        return PacketId;
    }

    /**
     * @notice 抢红包（平均分发）
     * @param id 红包 ID
     *
     * 逻辑：
     * 1. 查询红包数据
     * 2. 检查是否还有份额
     * 3. 检查当前地址是否已领取
     * 4. 平均分配金额 share = totalAmount / totalCount
     * 5. 扣减剩余份数 & 剩余金额
     * 6. 发送 ETH 给用户
     * 7. 抢完最后一个人后，返还剩余零头给创建人
     *
     * 安全：
     * - transfer() 会自动 revert，如果失败不会丢钱
     */
    function grabPacket(uint256 id) external {
        // 获取到该id的红包
        Packet storage p = packets[id];
        // 判断大小是否为零，判断是否已经抢过这个红包
        require(p.remainSize > 0, "This packet is allready empty.");
        require(
            !p.cliamied[msg.sender],
            "You are allready grabed this packetd"
        );
        uint256 share;
        // 最后一个红包将无法整除的部分直接给最后一个抢的
        if (p.remainSize == 1) {
            share = p.remainAmount;
        } else {
            share = p.remainAmount / p.packetSize;
        }

        p.remainSize--;
        p.remainAmount -= share;
        p.cliamied[msg.sender] = true;

        payable(msg.sender).transfer(share);
        emit grabbed(id, msg.sender, share);
    }
}
