export class ResponseDto {

    gubnCode : number;
    gubnName : string;
    waterLevel : number;
    rainfall : number;
    date : string;  
}

/*
query (@1) => req
~~url?gubncode=1
# momentjs 현재 시점 기준 (분)

data : [
    {guName : 강남,  //수위. 강우량 ("구")
    gubnCode : 강남에해당하는 구분코드 ("수위 지역 코드")
    date : 기준날짜 // 현재시점(분)
    rainfall : date에 해당하는 guName 기준으로 가져온 배열 내 값의 평균
    waterlevel :  date에 해당하는 guName 기준으로 가져온 배열 내 값의 평균  
},
 {

 }]
statusCode : 200

*/
