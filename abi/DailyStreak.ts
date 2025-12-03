export const DailyStreakABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "points",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newTotalPoints",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentStreak",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "SpinCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "previousStreak",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "StreakLost",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "canSpin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentDay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPlayerData",
    outputs: [
      {
        internalType: "uint256",
        name: "totalPoints",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentStreak",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastSpinDay",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastSpinTimestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "hasActiveStreak",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "players",
    outputs: [
      {
        internalType: "uint256",
        name: "totalPoints",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentStreak",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastSpinDay",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastSpinTimestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "spin",
    outputs: [
      {
        internalType: "uint256",
        name: "points",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "timeUntilNextSpin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
