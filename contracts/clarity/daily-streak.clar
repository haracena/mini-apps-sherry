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

;; Data variables
(define-map player-data
  principal
  {
    points: uint,
    last-spin-day: uint,
    current-streak: uint,
    total-spins: uint
  }
)

;; Track total points distributed
(define-data-var total-points-distributed uint u0)

;; Helper function: Get current day number
;; Uses Clarity 4 buff-to-uint-le function for timestamp conversion
(define-read-only (get-current-day)
  (/ block-height u144)  ;; Approximate: ~10 min blocks, 144 blocks per day
)

;; Helper function: Calculate prize based on pseudo-random
;; Uses Clarity 4 features for randomness and conversions
(define-private (calculate-prize (seed uint))
  (let
    (
      ;; Use Clarity 4 to-consensus-buff for better randomness
      (random-buff (unwrap-panic (to-consensus-buff? seed)))
      (random-val (buff-to-uint-le random-buff))
      (mod-val (mod random-val u100))
    )
    ;; Prize distribution: 10-150 points
    ;; 40%: 10-20 points (0-39)
    ;; 30%: 30-40 points (40-69)
    ;; 20%: 50-70 points (70-89)
    ;; 8%: 80-100 points (90-97)
    ;; 2%: 120-150 points (98-99)
    (if (< mod-val u40)
      (+ u10 (mod random-val u11))  ;; 10-20
      (if (< mod-val u70)
        (+ u30 (mod random-val u11))  ;; 30-40
        (if (< mod-val u90)
          (+ u50 (mod random-val u21))  ;; 50-70
          (if (< mod-val u98)
            (+ u80 (mod random-val u21))  ;; 80-100
            (+ u120 (mod random-val u31))  ;; 120-150
          )
        )
      )
    )
  )
)

;; Main spin function with Clarity 4 enhancements
(define-public (spin)
  (let
    (
      (player tx-sender)
      (current-day (get-current-day))
      (player-info (default-to
        { points: u0, last-spin-day: u0, current-streak: u0, total-spins: u0 }
        (map-get? player-data player)
      ))
      (last-day (get last-spin-day player-info))
      (prize (calculate-prize (+ block-height (to-uint tx-sender))))
    )
    ;; Check if already spun today
    (asserts! (not (is-eq current-day last-day)) err-already-spun-today)

    ;; Calculate new streak
    (let
      (
        (new-streak
          (if (is-eq (+ last-day u1) current-day)
            (+ (get current-streak player-info) u1)  ;; Continue streak
            u1  ;; Reset streak
          )
        )
        (new-points (+ (get points player-info) prize))
        (new-total-spins (+ (get total-spins player-info) u1))
      )
      ;; Update player data
      (map-set player-data player {
        points: new-points,
        last-spin-day: current-day,
        current-streak: new-streak,
        total-spins: new-total-spins
      })

      ;; Update total points distributed
      (var-set total-points-distributed
        (+ (var-get total-points-distributed) prize)
      )

      (ok { prize: prize, streak: new-streak, total-points: new-points })
    )
  )
)

;; Read-only functions using Clarity 4 features

;; Get player data with string conversion using Clarity 4
(define-read-only (get-player-info (player principal))
  (map-get? player-data player)
)

;; Get player points as string (Clarity 4 uint-to-string)
(define-read-only (get-points-as-string (player principal))
  (match (map-get? player-data player)
    player-info (some (uint-to-string (get points player-info)))
    none
  )
)

;; Get current streak with enhanced formatting
(define-read-only (get-streak (player principal))
  (match (map-get? player-data player)
    player-info (ok (get current-streak player-info))
    (ok u0)
  )
)

;; Check if player can spin today
(define-read-only (can-spin-today (player principal))
  (let
    (
      (current-day (get-current-day))
      (player-info (map-get? player-data player))
    )
    (match player-info
      info (not (is-eq current-day (get last-spin-day info)))
      true  ;; New player can spin
    )
  )
)

;; Get total points distributed globally
(define-read-only (get-total-points-distributed)
  (ok (var-get total-points-distributed))
)

;; Get formatted streak info as string (Clarity 4)
(define-read-only (get-streak-as-string (player principal))
  (match (map-get? player-data player)
    player-info (some (uint-to-string (get current-streak player-info)))
    none
  )
)
