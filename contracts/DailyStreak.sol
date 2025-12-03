// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DailyStreak
 * @notice Daily spin wheel game with streak tracking
 * @dev Spins reset at 12:00 UTC daily
 */
contract DailyStreak {
    struct PlayerData {
        uint256 totalPoints;
        uint256 currentStreak;
        uint256 lastSpinDay;
        uint256 lastSpinTimestamp;
    }

    mapping(address => PlayerData) public players;

    event SpinCompleted(
        address indexed player,
        uint256 points,
        uint256 newTotalPoints,
        uint256 currentStreak,
        uint256 timestamp
    );

    event StreakLost(
        address indexed player,
        uint256 previousStreak,
        uint256 timestamp
    );

    uint256 private constant SECONDS_PER_DAY = 86400;
    uint256 private constant UTC_RESET_HOUR = 12;

    /**
     * @notice Get current day number based on UTC 12:00 reset
     * @return Current day number since epoch
     */
    function getCurrentDay() public view returns (uint256) {
        uint256 adjustedTime = block.timestamp - (UTC_RESET_HOUR * 3600);
        return adjustedTime / SECONDS_PER_DAY;
    }

    /**
     * @notice Check if player can spin today
     * @param player Address to check
     * @return bool True if player can spin
     */
    function canSpin(address player) public view returns (bool) {
        uint256 currentDay = getCurrentDay();
        return players[player].lastSpinDay < currentDay;
    }

    /**
     * @notice Get time until next spin is available
     * @param player Address to check
     * @return Seconds until next spin (0 if can spin now)
     */
    function timeUntilNextSpin(address player) public view returns (uint256) {
        if (canSpin(player)) {
            return 0;
        }

        uint256 currentDay = getCurrentDay();
        uint256 nextDayStart = (currentDay + 1) * SECONDS_PER_DAY + (UTC_RESET_HOUR * 3600);

        return nextDayStart > block.timestamp ? nextDayStart - block.timestamp : 0;
    }

    /**
     * @notice Generate random points within prize tiers
     * @dev Uses block data for randomness (not secure for high-value applications)
     * @param player Address of player
     * @return Points awarded
     */
    function _generatePoints(address player) private view returns (uint256) {
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    player,
                    players[player].totalPoints
                )
            )
        ) % 100;

        // Prize distribution:
        // 40% chance: 10-20 points
        // 30% chance: 30-40 points
        // 20% chance: 50-70 points
        // 8% chance: 80-100 points
        // 2% chance: 120-150 points

        if (randomNumber < 40) {
            // 10-20 points
            return 10 + (randomNumber % 11);
        } else if (randomNumber < 70) {
            // 30-40 points
            return 30 + (randomNumber % 11);
        } else if (randomNumber < 90) {
            // 50-70 points
            return 50 + (randomNumber % 21);
        } else if (randomNumber < 98) {
            // 80-100 points
            return 80 + (randomNumber % 21);
        } else {
            // 120-150 points
            return 120 + (randomNumber % 31);
        }
    }

    /**
     * @notice Spin the wheel and get points
     * @return points Points awarded
     */
    function spin() external returns (uint256 points) {
        require(canSpin(msg.sender), "Already spun today");

        uint256 currentDay = getCurrentDay();
        PlayerData storage player = players[msg.sender];

        // Check if streak should be reset
        if (player.lastSpinDay > 0) {
            uint256 daysSinceLastSpin = currentDay - player.lastSpinDay;

            if (daysSinceLastSpin == 1) {
                // Consecutive day - increment streak
                player.currentStreak += 1;
            } else if (daysSinceLastSpin > 1) {
                // Missed days - reset streak
                emit StreakLost(msg.sender, player.currentStreak, block.timestamp);
                player.currentStreak = 1;
            }
        } else {
            // First spin ever
            player.currentStreak = 1;
        }

        // Generate and award points
        points = _generatePoints(msg.sender);
        player.totalPoints += points;
        player.lastSpinDay = currentDay;
        player.lastSpinTimestamp = block.timestamp;

        emit SpinCompleted(
            msg.sender,
            points,
            player.totalPoints,
            player.currentStreak,
            block.timestamp
        );

        return points;
    }

    /**
     * @notice Get player data
     * @param player Address to query
     * @return totalPoints Total points accumulated
     * @return currentStreak Current consecutive days streak
     * @return lastSpinDay Last day player spun
     * @return lastSpinTimestamp Last timestamp player spun
     */
    function getPlayerData(address player)
        external
        view
        returns (
            uint256 totalPoints,
            uint256 currentStreak,
            uint256 lastSpinDay,
            uint256 lastSpinTimestamp
        )
    {
        PlayerData memory data = players[player];
        return (
            data.totalPoints,
            data.currentStreak,
            data.lastSpinDay,
            data.lastSpinTimestamp
        );
    }

    /**
     * @notice Check if player has active streak
     * @param player Address to check
     * @return bool True if streak is active (played yesterday or today)
     */
    function hasActiveStreak(address player) external view returns (bool) {
        uint256 currentDay = getCurrentDay();
        uint256 lastSpinDay = players[player].lastSpinDay;

        if (lastSpinDay == 0) return false;

        uint256 daysSinceLastSpin = currentDay - lastSpinDay;
        return daysSinceLastSpin <= 1;
    }
}
