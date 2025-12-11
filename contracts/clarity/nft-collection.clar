;; NFT Collection Contract
;; SIP-009 compliant NFT implementation on Stacks blockchain
;; Uses Clarity 4 features for enhanced functionality

;; Define the NFT
(define-non-fungible-token sherry-nft uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-invalid-price (err u102))
(define-constant err-insufficient-funds (err u103))
(define-constant err-token-exists (err u104))
(define-constant err-metadata-frozen (err u105))

;; Data variables
(define-data-var last-token-id uint u0)
(define-data-var mint-price uint u1000000) ;; 1 STX in microSTX
(define-data-var base-uri (string-ascii 256) "ipfs://")

;; Token metadata map
(define-map token-metadata
  uint
  {
    uri: (string-ascii 256),
    name: (string-utf8 64),
    created-at: uint
  }
)

;; SIP-009 Trait Implementation

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (some (get uri (unwrap! (map-get? token-metadata token-id) (err u404)))))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? sherry-nft token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (nft-transfer? sherry-nft token-id sender recipient)
  )
)

;; Mint function with Clarity 4 enhancements
(define-public (mint (name (string-utf8 64)) (uri (string-ascii 256)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
      (price (var-get mint-price))
    )
    ;; Check payment
    (try! (stx-transfer? price tx-sender contract-owner))

    ;; Mint NFT
    (try! (nft-mint? sherry-nft token-id tx-sender))

    ;; Store metadata using Clarity 4 block-height
    (map-set token-metadata token-id {
      uri: uri,
      name: name,
      created-at: block-height
    })

    ;; Update last token ID
    (var-set last-token-id token-id)

    (ok token-id)
  )
)

;; Set mint price (owner only)
(define-public (set-mint-price (new-price uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-price u0) err-invalid-price)
    (var-set mint-price new-price)
    (ok true)
  )
)
