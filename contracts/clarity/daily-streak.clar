;; Daily Streak Contract
;; Implements a daily spin wheel game with streak tracking on Stacks blockchain
;; Uses Clarity 4 features for enhanced functionality

;; Contract constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-already-spun-today (err u101))
(define-constant err-invalid-prize (err u102))

;; Daily spin reset time (midnight UTC in seconds since epoch)
(define-constant seconds-per-day u86400)
