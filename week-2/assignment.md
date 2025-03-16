# Report

That's the link of sepoliascan where you can verify the interactions with the contract that we have deployed:
https://sepolia.etherscan.io/address/0x2af1b834ba184f2565577b7f095fc284c41489fa

Contract deployment :

```shell
❯ npx ts-node --files ./scripts/DeployWithViem.ts "arg1" "arg2" "arg3"
Last block number: 7915076n
Deployer address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Deployer balance: 0.018394177303327792 ETH

Deploying Ballot contract
Transaction hash: 0x83a8494e8e92493a31174ee0fe964ce8843a3e76cec41809935caee0297a55d3
Waiting for confirmations...
Ballot contract deployed to: 0x2af1b834ba184f2565577b7f095fc284c41489fa
```

Casting votes for proposal 1 and vote from chairman for proposal 1:

```shell
❯ npx ts-node --files ./scripts/CastVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0"
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current voting weight: 1
Already voted: false
Proposal selected:
Voting to proposal "arg1" (index: 0, current votes: 0)
Confirm? (Y/n)
Y
Transaction hash: 0x7d051924ecef1d2f585772dae712178b109d8b3487f7ca05552873f61cbc63a4
Waiting for confirmations...
Transaction confirmed in block: 7915126n
Updated vote count for "arg1": 1
```

Try to revote for proposal 1 with same address:

```shell
❯ npx ts-node --files ./scripts/CastVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0"
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current voting weight: 1
Already voted: true
This address has already voted for proposal "arg1"
```

Try to vote for proposal 1 with another address and it refused the request:

```shell
PS C:\Users\samuw\Documents\EVM-Bootcamp\week-2\ballot> npx ts-node --files ./scripts/CastVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0"
>>
Voter address: 0x86fd0D762B53f21011e531fa57629D294d576A36
Current voting weight: 0
Already voted: false
Proposal selected: 
Voting to proposal "arg1" (index: 0, current votes: 1)
Confirm? (Y/n)
y
Error casting vote: ContractFunctionExecutionError: The contract function "vote" reverted with the following reason:
Has no right to vote

Contract Call:
  address:   0x2af1b834ba184f2565577b7f095fc284c41489fa
  function:  vote(uint256 proposal)
  args:          (0)
  sender:    0x86fd0D762B53f21011e531fa57629D294d576A36

Docs: https://viem.sh/docs/contract/writeContract
Version: viem@2.23.11
    at getContractError (C:\Users\samuw\Documents\EVM-Bootcamp\week-2\ballot\node_modules\viem\utils\errors\getContractError.ts:78:10)
    at writeContract (C:\Users\samuw\Documents\EVM-Bootcamp\week-2\ballot\node_modules\viem\actions\wallet\writeContract.ts:208:27)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async ReadStream.<anonymous> (C:\Users\samuw\Documents\EVM-Bootcamp\week-2\ballot\scripts\CastVote.ts:88:22) {
  cause: ContractFunctionRevertedError: The contract function "vote" reverted with the following reason:
  Has no right to vote

  Version: viem@2.23.11
      at C:\Users\samuw\Documents\EVM-Bootcamp\week-2\ballot\node_modules\viem\utils\errors\getContractError.ts:65:14
      at getContractError (C:\Users\samuw\Documents\EVM-Bootcamp\week-2\ballot\node_modules\viem\utils\errors\getContractError.ts:76:5)
      at writeContract (C:\Users\samuw\Documents\EVM-Bootcamp\week-2\ballot\node_modules\viem\actions\wallet\writeContract.ts:208:27)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at async ReadStream.<anonymous> (C:\Users\samuw\Documents\EVM-Bootcamp\week-2\ballot\scripts\CastVote.ts:88:22) {
    details: undefined,
    docsPath: undefined,
    metaMessages: undefined,
    shortMessage: 'The contract function "vote" reverted with the following reason:\n' +
      'Has no right to vote',
    version: '2.23.11',
    data: { abiItem: [Object], args: [Array], errorName: 'Error' },
    raw: '0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000014486173206e6f20726967687420746f20766f7465000000000000000000000000',
    reason: 'Has no right to vote',
    signature: undefined
  },
  details: undefined,
  docsPath: '/docs/contract/writeContract',
  metaMessages: [
    'Contract Call:',
    '  address:   0x2af1b834ba184f2565577b7f095fc284c41489fa\n' +
      '  function:  vote(uint256 proposal)\n' +
      '  args:          (0)\n' +
      '  sender:    0x86fd0D762B53f21011e531fa57629D294d576A36'
  ],
  shortMessage: 'The contract function "vote" reverted with the following reason:\n' +
    'Has no right to vote',
  version: '2.23.11',
  abi: [
    {
      inputs: [Array],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      inputs: [],
      name: 'chairperson',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'delegate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'giveRightToVote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'proposals',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'vote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'voters',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'winnerName',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'winningProposal',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    }
  ],
  args: [ 0n ],
  contractAddress: '0x2af1b834ba184f2565577b7f095fc284c41489fa',
  formattedArgs: undefined,
  functionName: 'vote',
  sender: '0x86fd0D762B53f21011e531fa57629D294d576A36'
}
```

Giving right to vote to another address:

```shell
❯ npx ts-node --files ./scripts/GiveRightToVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0x86fd0D762B53f21011e531fa57629D294d576A36"
Chairperson address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current voting weight for 0x86fd0D762B53f21011e531fa57629D294d576A36: 0
Giving right to vote to 0x86fd0D762B53f21011e531fa57629D294d576A36
Confirm? (Y/n)
y
Transaction hash: 0x39572309ee8da599f5166530f828264b8ff9566eb71cf8821703f881b0a22a32
Waiting for confirmations...
Transaction confirmed in block: 7915361n
Transaction details :
- Function: giveRightToVote(address _voter) ***
- MethodID: 0x9e7b8d61
- [0]:  00000000000000000000000086fd0d762b53f21011e531fa57629d294d576a36
Updated voting weight for 0x86fd0D762B53f21011e531fa57629D294d576A36: 1
```

Try to vote for proposal 1 with another address after give right to vote script and it worked:

```shell
> npx ts-node --files ./scripts/CastVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0"
>>
Voter address: 0x86fd0D762B53f21011e531fa57629D294d576A36
Current voting weight: 1
Already voted: false
Proposal selected:
Voting to proposal "arg1" (index: 0, current votes: 1)
Confirm? (Y/n)
y
Transaction hash: 0x789949c9e31c08afeb94b7bd834abc90e4c594de5cec9b3c5cfab62b8734f7e4
Waiting for confirmations...
Transaction confirmed in block: 7915367n
Updated vote count for "arg1": 2
```

Try to delegate a voting right from an address that already voted

```shell
❯ npx ts-node --files ./scripts/DelegateVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0x86fd0D762B53f21011e531fa57629D294d576A36"
Delegator address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Delegator voting weight: 1
Delegator already voted: true
Delegator current delegate: 0x0000000000000000000000000000000000000000

Delegate voting weight before delegation: 1

Delegating vote to 0x86fd0D762B53f21011e531fa57629D294d576A36
Confirm? (Y/n)
y
Error delegating vote: ContractFunctionExecutionError: The contract function "delegate" reverted with the following reason:
You already voted.

Contract Call:
  address:   0x2af1b834ba184f2565577b7f095fc284c41489fa
  function:  delegate(address to)
  args:              (0x86fd0D762B53f21011e531fa57629D294d576A36)
  sender:    0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23

Docs: https://viem.sh/docs/contract/writeContract
Version: viem@2.23.11
    at getContractError (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/utils/errors/getContractError.ts:78:10)
    at writeContract (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/actions/wallet/writeContract.ts:208:27)
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async ReadStream.<anonymous> (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/scripts/DelegateVote.ts:94:22) {
  cause: ContractFunctionRevertedError: The contract function "delegate" reverted with the following reason:
  You already voted.
  
  Version: viem@2.23.11
      at /home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/utils/errors/getContractError.ts:65:14
      at getContractError (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/utils/errors/getContractError.ts:76:5)
      at writeContract (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/actions/wallet/writeContract.ts:208:27)
      at processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async ReadStream.<anonymous> (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/scripts/DelegateVote.ts:94:22) {
    details: undefined,
    docsPath: undefined,
    metaMessages: undefined,
    shortMessage: 'The contract function "delegate" reverted with the following reason:\n' +
      'You already voted.',
    version: '2.23.11',
    data: { abiItem: [Object], args: [Array], errorName: 'Error' },
    raw: '0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012596f7520616c726561647920766f7465642e0000000000000000000000000000',
    reason: 'You already voted.',
    signature: undefined
  },
  details: undefined,
  docsPath: '/docs/contract/writeContract',
  metaMessages: [
    'Contract Call:',
    '  address:   0x2af1b834ba184f2565577b7f095fc284c41489fa\n' +
      '  function:  delegate(address to)\n' +
      '  args:              (0x86fd0D762B53f21011e531fa57629D294d576A36)\n' +
      '  sender:    0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23'
  ],
  shortMessage: 'The contract function "delegate" reverted with the following reason:\n' +
    'You already voted.',
  version: '2.23.11',
  abi: [
    {
      inputs: [Array],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      inputs: [],
      name: 'chairperson',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'delegate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'giveRightToVote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'proposals',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'vote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'voters',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'winnerName',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'winningProposal',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    }
  ],
  args: [ '0x86fd0D762B53f21011e531fa57629D294d576A36' ],
  contractAddress: '0x2af1b834ba184f2565577b7f095fc284c41489fa',
  formattedArgs: undefined,
  functionName: 'delegate',
  sender: '0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23'
}
```

Delegate voting right from another address that didn't vote but hadn't right to vote:

```shell
❯ npx ts-node --files ./scripts/DelegateVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0x86fd0D762B53f21011e531fa57629D294d576A36"
Delegator address: 0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D
Delegator voting weight: 0
Delegator already voted: false
Delegator current delegate: 0x0000000000000000000000000000000000000000

Delegate voting weight before delegation: 1

Delegating vote to 0x86fd0D762B53f21011e531fa57629D294d576A36
Confirm? (Y/n)
y
Error delegating vote: ContractFunctionExecutionError: The contract function "delegate" reverted with the following reason:
You have no right to vote

Contract Call:
  address:   0x2af1b834ba184f2565577b7f095fc284c41489fa
  function:  delegate(address to)
  args:              (0x86fd0D762B53f21011e531fa57629D294d576A36)
  sender:    0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D

Docs: https://viem.sh/docs/contract/writeContract
Version: viem@2.23.11
    at getContractError (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/utils/errors/getContractError.ts:78:10)
    at writeContract (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/actions/wallet/writeContract.ts:208:27)
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async ReadStream.<anonymous> (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/scripts/DelegateVote.ts:94:22) {
  cause: ContractFunctionRevertedError: The contract function "delegate" reverted with the following reason:
  You have no right to vote
  
  Version: viem@2.23.11
      at /home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/utils/errors/getContractError.ts:65:14
      at getContractError (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/utils/errors/getContractError.ts:76:5)
      at writeContract (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/node_modules/viem/actions/wallet/writeContract.ts:208:27)
      at processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async ReadStream.<anonymous> (/home/ngaud/dev/formation/Encode_EVM_Bootcamp-Q1_2025/evm_bootcamp-group-6-homework/week-2/ballot/scripts/DelegateVote.ts:94:22) {
    details: undefined,
    docsPath: undefined,
    metaMessages: undefined,
    shortMessage: 'The contract function "delegate" reverted with the following reason:\n' +
      'You have no right to vote',
    version: '2.23.11',
    data: { abiItem: [Object], args: [Array], errorName: 'Error' },
    raw: '0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000019596f752068617665206e6f20726967687420746f20766f746500000000000000',
    reason: 'You have no right to vote',
    signature: undefined
  },
  details: undefined,
  docsPath: '/docs/contract/writeContract',
  metaMessages: [
    'Contract Call:',
    '  address:   0x2af1b834ba184f2565577b7f095fc284c41489fa\n' +
      '  function:  delegate(address to)\n' +
      '  args:              (0x86fd0D762B53f21011e531fa57629D294d576A36)\n' +
      '  sender:    0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D'
  ],
  shortMessage: 'The contract function "delegate" reverted with the following reason:\n' +
    'You have no right to vote',
  version: '2.23.11',
  abi: [
    {
      inputs: [Array],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      inputs: [],
      name: 'chairperson',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'delegate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'giveRightToVote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'proposals',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'vote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [Array],
      name: 'voters',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'winnerName',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'winningProposal',
      outputs: [Array],
      stateMutability: 'view',
      type: 'function'
    }
  ],
  args: [ '0x86fd0D762B53f21011e531fa57629D294d576A36' ],
  contractAddress: '0x2af1b834ba184f2565577b7f095fc284c41489fa',
  formattedArgs: undefined,
  functionName: 'delegate',
  sender: '0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D'
}
```

Giving the previous address the right to vote :

```shell
❯ npx ts-node --files ./scripts/GiveRightToVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D"
Chairperson address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current voting weight for 0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D: 0
Giving right to vote to 0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D
Confirm? (Y/n)
y
Transaction hash: 0xc19bd72059e89d10dce9029551b6968ff7ffe683ab146ae0c9a7c39e02968c0f
Waiting for confirmations...
Transaction confirmed in block: 7915446n
Updated voting weight for 0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D: 1
```

Delegate voting right from another address that didn't vote and had right to vote:

```shell
❯ npx ts-node --files ./scripts/DelegateVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0x86fd0D762B53f21011e531fa57629D294d576A36"
Delegator address: 0xb86120f0eDc5F32E6D2151d6FC4FCb3c0c2f537D
Delegator voting weight: 1
Delegator already voted: false
Delegator current delegate: 0x0000000000000000000000000000000000000000

Delegate voting weight before delegation: 1

Delegating vote to 0x86fd0D762B53f21011e531fa57629D294d576A36
Confirm? (Y/n)
y
Transaction hash: 0x63f96126c18eb7119f2a20d5aa81e966f728845f1e2699f3238ef88d28cb8852
Waiting for confirmations...
Transaction confirmed in block: 7915450n

After delegation:
Delegator voting weight: 1
Delegator delegate: 0x86fd0D762B53f21011e531fa57629D294d576A36
Delegate voting weight: 1
```

Made a query with all informations about contract and interactions with proposals:

```shell
npx ts-node --files ./scripts/QueryResults.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa"
>> 
Contract information:
Address: 0x2af1b834ba184f2565577b7f095fc284c41489fa
Chairperson: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23

Total proposals: 3

Proposals:
Proposal 0: "arg1" - 3 vote(s)
Proposal 1: "arg2" - 0 vote(s)
Proposal 2: "arg3" - 0 vote(s)

Winning proposal: 0 - "arg1"
```

