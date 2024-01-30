import type { Address } from 'abitype'

import type {
  FeeValuesEIP1559,
  FeeValuesEIP4844,
  FeeValuesLegacy,
} from './fee.js'
import type { Log } from './log.js'
import type { Hash, Hex, Signature } from './misc.js'
import type { Branded, IsNever, OneOf } from './utils.js'

export type AccessList = { address: Address; storageKeys: Hex[] }[]

export type TransactionType =
  | 'legacy'
  | 'eip1559'
  | 'eip2930'
  | 'eip4844'
  | (string & {})

export type TransactionReceipt<
  TQuantity = bigint,
  TIndex = number,
  TStatus = 'success' | 'reverted',
  TType = TransactionType,
> = {
  /** The actual value per gas deducted from the sender's account for blob gas. Only specified for blob transactions as defined by EIP-4844. */
  blobGasPrice?: TQuantity
  /** The amount of blob gas used. Only specified for blob transactions as defined by EIP-4844. */
  blobGasUsed?: TQuantity
  /** Hash of block containing this transaction */
  blockHash: Hash
  /** Number of block containing this transaction */
  blockNumber: TQuantity
  /** Address of new contract or `null` if no contract was created */
  contractAddress: Address | null
  /** Gas used by this and all preceding transactions in this block */
  cumulativeGasUsed: TQuantity
  /** Pre-London, it is equal to the transaction's gasPrice. Post-London, it is equal to the actual gas price paid for inclusion. */
  effectiveGasPrice: TQuantity
  /** Transaction sender */
  from: Address
  /** Gas used by this transaction */
  gasUsed: TQuantity
  /** List of log objects generated by this transaction */
  logs: Log<TQuantity, TIndex, false>[]
  /** Logs bloom filter */
  logsBloom: Hex
  /** The post-transaction state root. Only specified for transactions included before the Byzantium upgrade. */
  root?: Hash
  /** `success` if this transaction was successful or `reverted` if it failed */
  status: TStatus
  /** Transaction recipient or `null` if deploying a contract */
  to: Address | null
  /** Hash of this transaction */
  transactionHash: Hash
  /** Index of this transaction in the block */
  transactionIndex: TIndex
  /** Transaction type */
  type: TType
}

export type TransactionBase<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
> = {
  /** Hash of block containing this transaction or `null` if pending */
  blockHash: TPending extends true ? null : Hash
  /** Number of block containing this transaction or `null` if pending */
  blockNumber: TPending extends true ? null : TQuantity
  /** Transaction sender */
  from: Address
  /** Gas provided for transaction execution */
  gas: TQuantity
  /** Hash of this transaction */
  hash: Hash
  /** Contract code or a hashed method call */
  input: Hex
  /** Unique number identifying this transaction */
  nonce: TIndex
  /** ECDSA signature r */
  r: Hex
  /** ECDSA signature s */
  s: Hex
  /** Transaction recipient or `null` if deploying a contract */
  to: Address | null
  /** Index of this transaction in the block or `null` if pending */
  transactionIndex: TPending extends true ? null : TIndex
  /** The type represented as hex. */
  typeHex: Hex | null
  /** ECDSA recovery ID */
  v: TQuantity
  /** Value in wei sent with this transaction */
  value: TQuantity
  /** The parity of the y-value of the secp256k1 signature. */
  yParity: TIndex
}
export type TransactionLegacy<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
  TType = 'legacy',
> = Omit<TransactionBase<TQuantity, TIndex, TPending>, 'yParity'> &
  FeeValuesLegacy<TQuantity> & {
    /** EIP-2930 Access List. */
    accessList?: never
    blobVersionedHashes?: never
    /** Chain ID that this transaction is valid on. */
    chainId?: TIndex
    yParity?: never
    type: TType
  }
export type TransactionEIP2930<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
  TType = 'eip2930',
> = TransactionBase<TQuantity, TIndex, TPending> &
  FeeValuesLegacy<TQuantity> & {
    /** EIP-2930 Access List. */
    accessList: AccessList
    blobVersionedHashes?: never
    /** Chain ID that this transaction is valid on. */
    chainId: TIndex
    type: TType
  }
export type TransactionEIP1559<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
  TType = 'eip1559',
> = TransactionBase<TQuantity, TIndex, TPending> &
  FeeValuesEIP1559<TQuantity> & {
    /** EIP-2930 Access List. */
    accessList: AccessList
    blobVersionedHashes?: never
    /** Chain ID that this transaction is valid on. */
    chainId: TIndex
    type: TType
  }
export type TransactionEIP4844<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
  TType = 'eip4844',
> = TransactionBase<TQuantity, TIndex, TPending> &
  FeeValuesEIP4844<TQuantity> & {
    /** EIP-2930 Access List. */
    accessList: AccessList
    /** List of versioned blob hashes associated with the transaction's blobs. */
    blobVersionedHashes: Hex[]
    /** Chain ID that this transaction is valid on. */
    chainId: TIndex
    type: TType
  }
export type Transaction<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
> = OneOf<
  | TransactionLegacy<TQuantity, TIndex, TPending>
  | TransactionEIP2930<TQuantity, TIndex, TPending>
  | TransactionEIP1559<TQuantity, TIndex, TPending>
  | TransactionEIP4844<TQuantity, TIndex, TPending>
>

export type TransactionRequestBase<TQuantity = bigint, TIndex = number> = {
  /** Contract code or a hashed method call with encoded args */
  data?: Hex
  /** Transaction sender */
  from: Address
  /** Gas provided for transaction execution */
  gas?: TQuantity
  /** Unique number identifying this transaction */
  nonce?: TIndex
  /** Transaction recipient */
  to?: Address | null
  /** Value in wei sent with this transaction */
  value?: TQuantity
}
export type TransactionRequestLegacy<
  TQuantity = bigint,
  TIndex = number,
  TTransactionType = 'legacy',
> = TransactionRequestBase<TQuantity, TIndex> &
  Partial<FeeValuesLegacy<TQuantity>> & {
    accessList?: never
    blobs?: undefined
    type?: TTransactionType
  }
export type TransactionRequestEIP2930<
  TQuantity = bigint,
  TIndex = number,
  TTransactionType = 'eip2930',
> = TransactionRequestBase<TQuantity, TIndex> &
  Partial<FeeValuesLegacy<TQuantity>> & {
    accessList?: AccessList
    blobs?: undefined
    type?: TTransactionType
  }
export type TransactionRequestEIP1559<
  TQuantity = bigint,
  TIndex = number,
  TTransactionType = 'eip1559',
> = TransactionRequestBase<TQuantity, TIndex> &
  Partial<FeeValuesEIP1559<TQuantity>> & {
    accessList?: AccessList
    blobs?: undefined
    type?: TTransactionType
  }
export type TransactionRequestEIP4844<
  TQuantity = bigint,
  TIndex = number,
  TTransactionType = 'eip4844',
> = TransactionRequestBase<TQuantity, TIndex> &
  Partial<FeeValuesEIP4844<TQuantity>> & {
    accessList?: AccessList
    /** The blobs associated with this transaction. */
    blobs: Hex[]
    type?: TTransactionType
  }
export type TransactionRequest<TQuantity = bigint, TIndex = number> = OneOf<
  | TransactionRequestLegacy<TQuantity, TIndex>
  | TransactionRequestEIP2930<TQuantity, TIndex>
  | TransactionRequestEIP1559<TQuantity, TIndex>
  | TransactionRequestEIP4844<TQuantity, TIndex>
>

export type TransactionSerializedEIP1559 = `0x02${string}`
export type TransactionSerializedEIP2930 = `0x01${string}`
export type TransactionSerializedEIP4844 = `0x03${string}`
export type TransactionSerializedLegacy = Branded<`0x${string}`, 'legacy'>
export type TransactionSerializedGeneric = `0x${string}`
export type TransactionSerialized<
  TType extends TransactionType = TransactionType,
  result =
    | (TType extends 'eip1559' ? TransactionSerializedEIP1559 : never)
    | (TType extends 'eip2930' ? TransactionSerializedEIP2930 : never)
    | (TType extends 'eip4844' ? TransactionSerializedEIP4844 : never)
    | (TType extends 'legacy' ? TransactionSerializedLegacy : never),
> = IsNever<result> extends true ? TransactionSerializedGeneric : result

export type TransactionSerializableBase<
  TQuantity = bigint,
  TIndex = number,
> = Omit<TransactionRequestBase<TQuantity, TIndex>, 'from'> & Partial<Signature>

export type TransactionSerializableLegacy<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  Partial<FeeValuesLegacy<TQuantity>> & {
    accessList?: undefined
    blobVersionedHashes?: undefined
    chainId?: number
    type?: 'legacy'
  }

export type TransactionSerializableEIP2930<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  Partial<FeeValuesLegacy<TQuantity>> & {
    accessList?: AccessList
    blobVersionedHashes?: undefined
    chainId: number
    type?: 'eip2930'
    yParity?: number
  }

export type TransactionSerializableEIP1559<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  Partial<FeeValuesEIP1559<TQuantity>> & {
    accessList?: AccessList
    blobVersionedHashes?: undefined
    chainId: number
    type?: 'eip1559'
    yParity?: number
  }

export type TransactionSerializableEIP4844<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  Partial<FeeValuesEIP4844<TQuantity>> &
  OneOf<WrapperPropertiesEIP4844 | {}> & {
    accessList?: AccessList
    blobVersionedHashes: Hex[]
    chainId: number
    type?: 'eip4844'
    yParity?: number
  }

export type TransactionSerializableGeneric<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> & {
  accessList?: AccessList
  blobVersionedHashes?: Hex[]
  chainId?: number
  gasPrice?: TQuantity
  maxFeePerBlobGas?: TQuantity
  maxFeePerGas?: TQuantity
  maxPriorityFeePerGas?: TQuantity
  type?: string
}

export type TransactionSerializable<
  TQuantity = bigint,
  TIndex = number,
> = OneOf<
  | TransactionSerializableLegacy<TQuantity, TIndex>
  | TransactionSerializableEIP2930<TQuantity, TIndex>
  | TransactionSerializableEIP1559<TQuantity, TIndex>
  | TransactionSerializableEIP4844<TQuantity, TIndex>
>
