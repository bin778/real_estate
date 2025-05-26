## 부동산 거래 DApp

> 블록체인 이더리움 부동산 DApp 저장소입니다.

## 개발 환경

* OS
  * Windows 10
* Language
  * JavaScript + Web3 Server
  * Node.js 22.14.0
  * Solidity
* Tools
  * Ganache 2.7.1
  * Visual Studio Code
  * Remix IDE

## 요구 사항

### 구현

* 매물 등록
  * 판매자는 부동산 매물 이름이나 금액을 입력한다.
  * onlyAdmin 제어자를 사용하여 판매자 계정만 호출 가능하다.
  * 입력한 이름이나 금액을 잘못 입력하면 매물 등록이 되지 않도록 한다.
* 매물 구입
  * 호출자는 금액을 전송해야 하며, 해당 매물의 가격 이상이어야 한다.
  * 만약, 금액이 부족하면 거래가 완료되지 않는다.
* 매물 삭제
  * 판매자는 해당 부동산 매물을 삭제할 수 있다.
  * onlyAdmin 제어자를 사용하여 판매자 계정만 삭제 가능하다.
* 매물 조회
  * 매물을 등록하면 properties에서 해당하는 부동산 매몰(Property 구조체)을 가져온다.
    * `p.location`: 매물의 위치(string)
    * `p.price`: 매물 가격(uint)
    * `p.owner`: 현재 소유자 계정(address)
    * `p.isAvailable`: 구매 가능 여부(bool)
  * 구조체를 호출하여 모든 부동산 매물 정보를 HTML 요소로 출력한다.
  * 0x000...는 삭제된 매물이므로 제외한다.
  * 해당 매물을 구매하거나 삭제할 수 있다.

### 입출력

* 판매자는 부동산 매물 이름이나 금액을 입력받는다.
  * 잘못 입력한 경우 부동산 매물 등록을 하지 않는다.
  * 금액은 정규표현식을 사용하여 필터링한다.

### 동적 처리 기능

* 웹에서 판매자 및 구매자 금액이나 부동산 매물 내역들을 바로 호출하고 초기화한다.
* 판매자와 구매자의 금액 현황을 조회한다.
  * 이때 거래가 완료되면 판매자와 구매자의 금액이 실시간으로 반영된다.

## 실행 예시

### 매물 등록
<img src="https://github.com/user-attachments/assets/97fbf5eb-92d5-4e83-a2ae-d0136e32f51d" width="450px" height="400px" />
<img src="https://github.com/user-attachments/assets/e0c59a93-a343-472d-94ea-60ebb90c0bd5" width="450px" height="400px" />


### 매물 구매
<img src="https://github.com/user-attachments/assets/1773c736-ec80-44de-bfb4-1a0db228a0fc" width="450px" height="400px" />
<img src="https://github.com/user-attachments/assets/7a496368-6190-49fa-8bc5-0242a94f6a61" width="450px" height="400px" />


## 매물 삭제
<img src="https://github.com/user-attachments/assets/9e58b19d-51d1-4771-ac1c-bae4eb278e1d" width="450px" height="400px" />
<img src="https://github.com/user-attachments/assets/e934ae8f-8df0-4667-a64a-57cf852a67a4" width="450px" height="400px" />



