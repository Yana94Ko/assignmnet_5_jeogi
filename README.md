# Udemy Backend Nest Project : 저기어때

## 요구조건

1. 사용자는 일반 사용자 또는 사업자 사용자로 회원가입 및 로그인 할 수 있다.
   1. 일반 사용자 → `User`
   2. 사업자 사용자 → `Partner`
2. `Partner`는 복수의 `Accommodation`을 CRUD 할 수 있다.
3. `Accommodation`은 복수의 `Room`을 가진다
4. `Room`은 복수의 `Reservation`을 가진다.
   1. `Room`은 하나의 날짜에 대해서는 하나의 `Reservation` 만을 가진다.
   2. `Reservation`은 연박을 고려하지 않는다.
   3. `Reservation`은 대실 등의 경우를 고려하지 않고 숙박의 경우만을 다룬다.
5. `User`는 복수의 `Reservation`을 가질 수 있다.
6. 로그인 하지 않은 사용자도 다음의 조건들을 사용하여 예약 가능한 숙소 목록을 볼 수 있다.
   1. 날짜
   2. `Region`
   3. `AccommodationType`
7. `isReserved` 상태의 `Reservation`은 일반 고객과 사업자 고객 양쪽 모두에 의해 취소 될 수 있다.
8. `isCheckedIn` 상태의 `Reservation`에 대해 `User`는 `Review`를 생성할 수 있다.
9. `Reservation`은 2024년 3월 31일까지만 가능하다.
