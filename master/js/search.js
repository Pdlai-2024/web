$("#text_search").autocomplete({
    minLength: 0,
    source: "/search-course",
    select: function (event, ui) {
        $("#text_search").val(ui.item['keyword']);
        return false;
    }
}).autocomplete("instance")._renderItem = function (ul, item) {
    return $("<li>")
        .append(`<a class="flex gap-3 pb-1" href="${item['link']}"><img class="h-8 w-auto" src="https://unica.vn/${item['image']}"> <div>${item['keyword']}</div> </a>`)
        .appendTo(ul);
};

$("#text_search_sidebar").autocomplete({
    minLength: 0,
    source: "/search-course",
    select: function (event, ui) {
        $("#text_search").val(ui.item['keyword']);
        return false;
    },
    response: function (event, ui) {
        $('#search_sidebar_result').html('');
        $('.search-box').removeClass('bg-white');
        $.each(ui.content, function (index, item) {
            $('.search-box').addClass('bg-white');
            $('#search_sidebar_result').append(`
                <a href="${item['link']}">
                    <div class="flex items-center space-x-2 py-1">
                        <img src="https://static.unica.vn/${item.image}" alt="${item.label}" class="h-8 w-autorounded-full">
                        <span class="font-medium">${item.keyword}</span>
                    </div>
                </a>`);
        });
    },
}).autocomplete("instance")._renderItem = function (ul, item) {
    return;
};
