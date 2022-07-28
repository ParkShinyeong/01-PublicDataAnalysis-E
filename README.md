# 1주차 랩큐 - open api를 활용한 공공 데이터 분석 ✨

- 과제 수행 일자 : 2022 / 06 / 29 ~ 2022 / 07 / 01
- Framework : Nest js (v 8.2.3)
- Language : Node js (v17.9.1)
- volta 로 고정 세팅 (pin) 한 값 package.json에서 확인 가능합니다.

### 프로젝트 실행

    - git clone 'https://github.com/pre-onboarding-backend-E/01-PublicDataAnalysis-E.git'
    - cd 01-PublicDataAnalysis-E
    - yarn install
    - yarn start:dev
    ## docker 실행 시 🐳
    - docker compose build
    - docker compose up

### 테스트 실행

    - 유닛 테스트: yarn test
    - e2e 테스트: yarn test:e2e

### 환경변수 설정

- 서버의 포트 번호와 API 버전을 env/development.env에 다음과 같이 작성합니다.

```
SERVER_PORT=8081
API_VERSION=1
```

- Open API를 활용하기 위해서는 인증키가 필요하고, 이 정보는 env/.env로 관리하고 있습니다.
  - [서울시 하수관로 수위 현황](https://data.seoul.go.kr/dataList/OA-2527/S/1/datasetView.do)
  - [서울시 강우량 정보](http://data.seoul.go.kr/dataList/OA-1168/S/1/datasetView.do)
- 각각 Open API에서 인증키를 발급받고 env/.env 파일을 다음과 같이 작성합니다.

```.env
RAINFALL_API_ACCESS_KEY= ??  // 서울시 강우량 정보 key
PIPE_API_ACCESS_KEY= ??  // 서울시 하수관로 수위 현황 key
```

### API 문서

- localhost:8081/apiDoc

### 요구사항 분석 및 구현 과정 ✨

0. 서울시의 하수관로 수위 현황*(A) 과 강우량 정보 현황*(B)을 Open API를 활용하여 수집하고 이를 각 구(행정구역) 별로 하수관로 수위과 강우량을 파악할 수 있는 REST API를 설계합니다.
1. *A와 *B를 호출하는 서비스 로직을 구현합니다.
   - Open API 특성 상 한 번에 최대 1000개의 row를 호출할 수 있고 데이터의 무결성을 유지하기 위해 최대한 많은 데이터를 가져오는 방향을 고려하였습니다.
2. *A와 *B의 공통Key인 '구 이름'을 Type화 하여 구분코드로 처리 후 이를 기준으로 요청과 응답을 처리합니다.
3. *A와 *B의 Response 데이터를 구 별로 Join 하여 가져옵니다.
4. *A와 *B의 데이터는 클라이언트의 요청 시점에서 가장 최근 1시간을 기준으로 필터링하고 하수관로 수위와 강우량을 계산하여 응답값을 보냅니다.
5. 테스트 케이스를 작성하여 테스트를 거칩니다.

### REQUEST

- 각 구 별로 하수관로 수위와 강우량을 파악하기 위해 클라이언트에서는 쿼리로 구분 타입을 지정하여 요청해야 합니다.
  - 구에 해당하는 요청값 list
    - gangnam,gangdong,gangbuk,gangseo,gwanak,gwangjin,guro,geumcheon,nowon,dobong,dongdaemun,dongjak,mapo,seocho,seodaemun,seongbuk,seongdong,songpa,yangcheon,yeongdeungpo,yongsan,eunpyeong,jongno,jung,jungnang

### RESPONSE

- 하수관 수위 데이터와 강수량 데이터를 1시간 단위로 합쳐서 각각의 평균값으로 값을 내려 보냅니다. 이는 raw 데이터를 최대한 보존하기 위함입니다.
- 현재 호출 시점 기준으로 가장 최신의 data가 각 1000 row씩 호출되며 이는 약 1시간 (00분~59분) 까지의 평균 값을 의미합니다.
- 관측소가 많은 경우, 데이터 호출 가능 개수(1000 row)의 제한으로 인해 1시간의 평균치를 내기엔 어려운 경우도 필연적으로 발생합니다. 이를 고려하며 가장 최신의 데이터를, 최대한 많이 호출하여, 정확한 평균치를 낼 수 있도록 하였습니다.

### 배포

1. 배포 url

- 기본 url : http://34.64.40.3:8081/ (404)
- swagger url : http://34.64.40.3:8081/apiDoc/#/

2. 샘플 test url

- http://34.64.40.3:8081/info?region=gangnam

## ETC

1. status Code : 200 / 201 에 해당하는 경우, 해당 data와 status code만 response로 보여집니다.
2. error의 경우 어떤 error에 해당하는지 message도 함께 response로 확인 가능합니다.
3. api 호출 시 필요한 값들의 경우 interface화 하였습니다.
4. 서울시 구 값들은 type으로 관리합니다. ex) gangnam: { name: '강남', code: '23' }

## commit convention

[Main]

- ADD / 기능 신규 개발
- MODIFY / 기존 기능 수정
- REFACTOR / 기존 기능 개선
- FIX / 버그 픽스
- REMOVE / 불필요한 로직 제거
- COMMENT / 코드 리뷰 반영 결과 [Sub]
- git issue card - task를 기반으로 상세 커밋 내용을 한 줄 내외로 작성
