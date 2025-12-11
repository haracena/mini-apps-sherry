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
