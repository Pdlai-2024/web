
$.fn.disable = function () {
    $(this).attr('disabled', true);
}
$.fn.unDisable = function () {
    $(this).removeAttr('disabled');
}
$.fn.addLoading = function () {
    $(this).find('.class-loading').remove();
    $(this).append(' <i class="fa fa-spin fa-spinner class-loading"></i>');
}
$.fn.removeLoading = function () {
    $(this).find('.class-loading').remove();
}


var global = {};
var setLocalStorage = function (name, obj) {
    if (typeof obj == 'object') {
        var strObj = JSON.stringify(obj);
        localStorage.setItem(name, strObj);
    } else {
        localStorage.setItem(name, obj);
    }
};

var getLocalStorage = function (name, type = '') {
    if (type == 'object') {
        var result = localStorage.getItem(name);
        return JSON.parse(result);
    } else {
        return localStorage.getItem(name);
    }
};
var oldLearned = getLocalStorage('oldLearned', 'object');
var secondsMem = getLocalStorage('secondsMem', 'object');
var check_jwplayer = $('#page-video-jwplayer').length;

if (typeof secondsMem != 'undefined' && secondsMem != null && secondsMem.course_id != '' && secondsMem.lession_id != '') {
    var course_id = typeof $('#course_id_hidden').val() != 'undefined' ? $('#course_id_hidden').val() : '';
    var lession_id = typeof $('#lession_id_hidden').val() != 'undefined' ? $('#lession_id_hidden').val() : '';
    // $.ajax({
    //     url: '/membership/minus',
    //     type: 'POST',
    //     data: Object.assign(secondsMem, {crsf:_csrf_code}),
    //     success: function (res) {
    //         secondsMem = {
    //             'lession_id': lession_id,
    //             'course_id': course_id,
    //             'seconds': 0
    //         };
    //         setLocalStorage('secondsMem', secondsMem);
    //     }
    // });
} else {
    if (check_jwplayer == 1) {
        var course_id = $('#course_id_hidden').val();
        var lession_id = $('#lession_id_hidden').val();
        secondsMem = {
            'lession_id': lession_id,
            'course_id': course_id,
            'seconds': 0
        };
        setLocalStorage('secondsMem', secondsMem);
    } else {
        localStorage.removeItem('secondsMem');
    }
}

/* if (oldLearned != null) {
    $.ajax({
        url: '/create/savepercentlearned',
        type: 'POST',
        data: oldLearned,
        success: function (res) {
        }
    });
    if (check_jwplayer === 1) {
        var course_id = $('#course_id_hidden').val();
        var lession_id = $('#lession_id_hidden').val();
        oldLearned.lession_id = lession_id;
        oldLearned.course_id = course_id;
        oldLearned.time = '00:00';
        setLocalStorage('oldLearned',oldLearned);
    }
} else {
    if (check_jwplayer === 1) {
        var course_id = $('#course_id_hidden').val();
        var lession_id = $('#lession_id_hidden').val();
        oldLearned = {
            'lession_id': lession_id,
            'course_id': course_id,
            'time': '00:00'
        };
        setLocalStorage('oldLearned', oldLearned);
    } else {
        localStorage.removeItem('oldLearned');
    }
} */

$('body').on('click',function () {
    $('.word-hot-search').addClass('hidden');
});
$('.input-search-box').on('click',function () {
    var $this = $(this);
    $.ajax({
        url : '/get-word-hot',
        type : 'GET',
        success : function (res) {
            $this.parent().find('.word-hot-search .content .modal-content .modal-body .content-load').html(res.data);
            $this.parent().find('.word-hot-search').removeClass('hidden');
        }
    });
});
$('.word-hot-search .content .modal-content .modal-body .content-load').on('click','p',function () {
    var $this = $(this);
    $('.form-search-top-result input[name="key"]').val($.trim($this.text()));
    $('.form-search-top-result button[type="submit"]').click();
});

function addComma(nStr)
{
    nStr += '';
    x = nStr.split(',');
    x1 = x[0];
    x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

$('#myselect').on('change',function(){
    var course_id = $(this).val();
    $('#msitecourse-course_id').val(course_id);
    $.ajax({
        url: '/dashboard/site/ajaxgetcourse',
        data:{"id":course_id},
        type: 'POST',
        success: function (res) {
            if(res){
                $('.load-boxcourse').removeAttr("style");
                link = res.data.Seo_url;
                image = res.data.Banner_small;
                name = res.data.Name;
                price = addComma(res.data.Price);
                vote = res.data.Vote_count;
                htmlPirce = price + "<sup>đ</sup>";
                description = res.data.Seo_description;
                $('.load-boxcourse a').attr('href',link);
                $('.load-boxcourse img').attr('src',image);
                $('.load-boxcourse .title-course').text(name);
                $('.load-boxcourse span.n-rate').text(vote);
                $('.load-boxcourse span.price-a').html(htmlPirce);
                $('.load-boxcourse .des-gv').text(description);
            }

        }
    });
});

$(".box-pop button").on('click',function(){
    var id = $(this).data('id');
    if(id){
        $.ajax({
            url:'/dashboard/site/delcourse',
            data:{'id':id},
            type:'POST',
            success:function(res){
                if(res){
                    $('.reset'+id).remove();
                }
            }
        });
    }
});

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!regex.test(email)) {
        return false;
    }else{
        return true;
    }
}

$("#adv-search .btn-search").on('click',function(){
    var email = $('input[name=search]').val();
    if(email== ''){
        $('input[name=search]').addClass('has-error');
        $('.with-errors').show();
        $('.with-errors').html('Vui lòng nhập địa chỉ email.');
        return false;
    }
    if(IsEmail(email)==false){
        $('input[name=search]').addClass('has-error');
        $('.with-errors').show();
        $('.with-errors').html('Email không hợp lệ!.');
        return false;
    }else{
        $('input[name=search]').removeClass('has-error');
        $('.with-errors').hide();
        $.ajax({
            url:'/dashboard/site/search',
            data:{'email':email},
            type:'POST',
            success:function(res){
                if(res){
                    $('.email').val(res.data.Email);
                    $('.fullname').val(res.data.Fullname);
                    $('.phone').val(res.data.Phone);
                    $('.id').val(res.data.ID);
                    $('.status').val(res.data.Status);
                }else{
                    $('input[name=search]').addClass('has-error');
                    $('.with-errors').show();
                    $('.with-errors').html('Email không tồn tại trên hệ thống!.');
                }
            }
        });
    }
});

$('.userDell').on('click',function(){
    var id = $(this).data('id');
    if(id){
        $.ajax({
            url:'/dashboard/site/delsiteuser',
            data:{'id':id},
            type:'POST',
            success:function(res){
                if(res){
                    $('.row_'+id).remove();
                }
            }
        });
    }
});

function hashParam() {
    var urlParams = null;
    var match,
        pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);
    if (query != '') {
        urlParams = {};
    }
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}

var paging = 0;
$('#loadmore_comment').on('click',function(){
    var params = hashParam();
    var id = $(this).data('id');
    paging = paging + 1;
    $.ajax({
        url: '/course/loadcommentajax',
        type: 'POST',
        data: {page: paging,id:id, params},
        success: function (result) {
            if (result.success) {
                $('.load_comment').append(result.data.html);
                if (result.data.count < 10) {
                    $(this).remove();
                    $('.view-more').remove();
                }
            } else {
                $('.btn-load-more').remove();
                $('.view-more').remove();
            }
        }
    });
});

var target = $('.target-box-inner').length;
if(target >6){
    $('.target-box-inner:gt(5)').hide();
}
var statusClick = 0;
$('.target-more').on('click',function(){
    statusClick++;
    if(target <= 12){
        $('.target-box-inner').show();
    }
    if(statusClick == 2){
        $(this).attr('href','/combo');
    }
});
