var allData = {};
var uniqueNum = [];
var inputValues = ['1', '1', '1'];
var uniArr;
var planSNum;

// get fruits.json
$.ajax({
    url: 'fruits.json',
    dataType: 'json',
    async: false,
    success: function(res) {
        allData = (typeof res === 'string') ? JSON.parse(res) : res;
    },

    error: function() {

    }
});


// -- 取得所有JSON資料
var fruitData = allData.fruits;
var seasonData = allData.season;
var nutrientsData = allData.nutrients;
var heatOfFoodData = allData.heatOfFood;
var situationData = allData.situation;


if ($('main').hasClass('plan-s')) {

    $('.result-block,.chart-block').hide();

} else {

    setFruitBlock();

};


$(document).on('change', '.plan-select', function() {

    planSNum = $(this).val();
    $('.result-block,.chart-block').show();
    $('.header-title').css({
        'padding-top':'50px',
        'transition': '0.3s'
    });
    getSituation(planSNum);

});


// == 整理情境
function getSituation(num) {

    var thatSitu = situationData[num].fruits;
    var thatArr = thatSitu.split(',');
    var allFruitArr = [];

    for (var i = 0; i < fruitData.length; i++) {

        for (var j = 0; j < thatArr.length; j++) {

            if (fruitData[i].fruitName == thatArr[j]) {
                allFruitArr.push(i);
            }

        }

    }

    allFruitArr.sort(function(a, b) {
        return 0.5 - Math.random();
    });

    planSNum = allFruitArr.slice(0, 3);

    setFruitBlock(planSNum);

}


// == append 水果block
function setFruitBlock(num) {

    var fruitKeys = Object.keys(fruitData);
    var fruitValues = Object.values(fruitData);
    uniqueNum = (typeof num === "undefined") ? getRandomNum(fruitKeys.length, 0, 3) : num ;
    var fruitString = '';
    var fruitSeason = [];
    var chartTags = [];
    var chartTagsArr = [];
    console.log(num);
    console.log(uniqueNum);

    getFruitHeat(uniqueNum);

    for (var i = 0; i < uniqueNum.length; i++) {

        var fruitInfo = {
            zhName: fruitData[uniqueNum[i]].fruitName,
            enName: fruitData[uniqueNum[i]].fruitEnName,
            season: getFruitSeason(fruitData[uniqueNum[i]].season) ? "season" : "",
            info: fruitData[uniqueNum[i]].info,
            nutrients: fruitData[uniqueNum[i]].nutrients,
            num: '1'
        };

        fruitString += setFruitString(fruitInfo);

        chartTags.push(fruitInfo.nutrients);

    }

    for (var i = 0; i < chartTags.length; i++) {

        var a = chartTags[i].split(',');

        for (var j = 0; j < a.length; j++) {

            chartTagsArr.push(a[j]);

        }

    }

    $('.result-area').html(fruitString);
    $('.chart-tags').html(getNutrientTags(setUniqueValue(chartTagsArr), 'chart'));

};


// == append 營養比例block
function setChartBlock() {

};


// == GET 水果營養素
function getFruitHeat(fruitNum) {

    var heatOfitem = [];
    var weight = [];
    var weightSum = 0;
    var protein = 0;

    for (var i = 0; i < fruitNum.length; i++) {

        heatOfitem.push(heatOfFoodData[fruitNum[i]]);

        weight[i] = Math.floor(heatOfitem[i].weight * heatOfitem[i].kcal);

        weightSum += weight[i];

    }

    uniArr = heatOfitem;

    getHeatOfFood(heatOfitem);

};


// == GET 水果月份
function getFruitSeason(season) {

    var month = season.split(',');

    for (var i = 0; i < month.length; i++) {
        return month[i] > getMonth();
    }

};


// == Set 水果數量
function setFruitsNum() {

    return 1;

}



// == 水果block string
function setFruitString(data) {
    return '<div class="result-item">\
      <div class="result-img">\
      <div class="square img-fit" style="background-image: url(images/fruit/' + data.enName + '.jpg);"></div>\
      <div class="addnums">\
      <a href="javascript:void(0)" class="minus"></a>\
      <input id="numCount" class="numCount" type="text" maxlength="2" value="' + data.num + '" disabled/>\
      <a href="javascript:void(0)" class="plus"></a>\
      </div>\
      </div>\
      <div class="result-info">\
      <h4 class="fruitname ' + data.season + '">' + data.zhName + '</h4>\
      <p style="margin-bottom: 5px;">' + data.info + '</p>\
      <ul>' + getNutrientTags(data.nutrients, 'block') + '</ul>\
      </div>\
      </div>';
};


// == 水果營養素tag string 
function getNutrientTags(data, status) {

    var tagsString = '';
    var arr;

    if (status == 'block') {

        arr = data.split(',');

    } else if (status == 'chart') {

        arr = data;

    }


    for (var i = 0; i < arr.length; i++) {

        arr[i] = arr[i] - 1;

        var sde = nutrientsData[arr[i]].name;

        if (sde.length) {

            tagsString += '<li class="tags result-more-tag">' + sde + '</li>';

        }


    }

    return tagsString;

}


// == get 現在時間
function getMonth() {
    var theDate = new Date();
    return theDate.getMonth() + 1;
};


// == 取得亂數數字
function getRandomNum(max, min, num) {

    var arr = new Set();

    while (arr.size < num) {

        arr.add(Math.floor(Math.random() * max));

    }

    return [...arr];

};


// == 資料去重複
function setUniqueValue(arr) {

    var arrSort = arr.sort();
    var arr = [];

    for (var i = 0; i < arrSort.length; i++) {

        if (arrSort[i] != arrSort[i + 1]) {

            arr.push(arrSort[i]);

        }

    }

    return arr;

}


// 取得水果熱量
function getHeatOfFood(array) {

    // 計算份數
    var countArr = array;

    countArr = getCountArr(countArr);

    // 計算份數取得水果營養成分數值
    getCountHeat(countArr);

}


// == 依照數量取得水果營養成分數值
function getCountHeat(arr) {

    var heatName = Object.keys(heatOfFoodData[1]);
    var result = [];
    var percentage = {};

    for (var i = 0; i < heatName.length; i++) {

        var nName = heatName[i];

        result[nName] = arr.reduce(function(accumulator, currentValue) {
            return accumulator + parseFloat(currentValue[i]);
        }, 0);

        var floorResult = result[nName].toFixed(1);

        $('.' + nName + ' span').html(floorResult);

        percentage[nName] = floorResult;

    }

    getChartPie(percentage);

    result['allKcal'] = arr.reduce(function(accumulator, currentValue) {
        return accumulator + parseFloat(currentValue[0] * currentValue[1]);
    }, 0);

    document.getElementById('kcal').innerHTML = parseInt(result['allKcal']);

}


// Toggle Block
$(document).on('click', '.readmore', function() {

    $('.result-area').toggleClass('moreinfo');

    if ($('.result-area').hasClass('moreinfo')) {
        $(this).html('展開更多說明');
    }

});


// 加減欄位數字
$(document).on('click', '.minus ,.plus', function() {

    var a = parseInt($(this).siblings('.numCount').val());

    if ($(this).hasClass('plus')) {

        a++;

    } else {

        if (a != 0) {
            a--;
        }

    }

    $(this).siblings('.numCount').val(a);
    getInputsNum();
    getFruitHeat(uniqueNum);

});


// 依照 份數/顆數 替換熱量數值
$(document).on('change', '.result-select', function() {

    getCountHeat(getCountArr(uniArr));

});

// == 紀錄input數值
function getInputsNum() {

    var b = document.getElementsByClassName('numCount');

    for (var i = 0; i < 3; i++) {

        inputValues[i] = b[i].value;

    }

    return inputValues;

}


// == 計算水果份數
function getCountArr(arr) {

    // 去除不要的
    var arrValue;
    var newArray = [];
    var num;
    var unit = $(".result-select").val();

    for (var i = 0; i < arr.length; i++) {

        arrValue = Object.values(arr[i]);
        num = [];


        for (var j = 0; j < arrValue.length; j++) {

            // 以份數算
            if (unit == 1) {

                if (j != 0) {
                    num.push(parseFloat(arrValue[j]) * inputValues[i]);
                } else {
                    num.push(1);
                }

            }
            // 以單位算
            else {
                // 重量
                if (j != 0) {
                    num.push(parseFloat(arrValue[j] * parseFloat(arrValue[0]) * inputValues[i] / 100));
                } else {
                    num.push(1);
                }

            }

        }

        newArray[i] = num;

    }

    return newArray;

}

// == 設置圓餅圖
function getChartPie(obj) {

    var sum, protein, fat, carbohydrates;

    sum = parseFloat(obj.protein) + parseFloat(obj.fat) + parseFloat(obj.carbohydrates);

    protein = ((parseFloat(obj.protein) / sum) * 100).toFixed(0);
    fat = ((parseFloat(obj.fat) / sum) * 100).toFixed(0);
    carbohydrates = ((parseFloat(obj.carbohydrates) / sum) * 100).toFixed(0);

    protein = parseInt(protein);
    fat = parseInt(fat);
    carbohydrates = parseInt(carbohydrates);

    var gradient = new ConicGradient({
        stops: '#3C989E 0% ' + protein + '%, #F4CDA5 ' + protein + '% ' + (protein + fat) + '% , #F57A82 ' + (protein + fat) + '% 100%',
        repeating: true,
        size: 400
    });

    $('#myChart').css('background', 'url(' + gradient.dataURL + ')');

}


// == append 選項進情境配
$(document).ready(function() {

    var txt;

    for (var i = 0; i < situationData.length; i++) {
        txt += '<option value=' + i + '>' + situationData[i].name + '</option>';
    }

    $('.plan-select').append(txt);

});