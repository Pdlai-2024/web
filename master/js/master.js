function addCart(model) {
    let course_id = $(model).attr('data-id');

    $.ajax({
        type: 'POST',
        url: '/cart/add',
        data: {
            'course_id': course_id,
        },
        beforeSend: function() {
            $(model).html(`<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>Đang xử lý`);
        },
        success: function(data) {
            let resData = data.data;
            // if (resData.redirect_link) {
            //     return authenticationModal.show();
            // }
            $(model).html("Đã thêm vào giỏ");
            $(model).attr('onclick', 'removeCart(this)');
            $('#quantity-cart').html(`<span class="absolute left-3.5 bottom-3.5 text-[10px] text-white font-bold rounded-full px-1.5 py-0.5 bg-[#1782FB]">${resData.count_items}</span>`);
            $("#cart-modal #item-img").attr({ "src": `https://static.unica.vn/${resData.item_image}` });
            $("#cart-modal #item-name").html(resData.item_name);
            $("#cart-modal #item-teacher").html(resData.item_teacher);
            $("#cart-modal #buy_together").html(resData.buy_together);
            $("#cart-modal #buy_together_price_sale").html(resData.buy_together_info.price_sale.toLocaleString('vi-VN', { minimumFractionDigits: 0 }));
            $("#cart-modal #buy_together_price").html(resData.buy_together_info.price.toLocaleString('vi-VN', { minimumFractionDigits: 0 }));
            $("#cart-modal input[name=suggest_course_ids]").val(resData.buy_together_info.items);
            window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
            window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                    items: resData.item
                }
            });
            if (typeof cartModal !== 'undefined' && cartModal) {
                cartModal.show();
            } else {
                window.location.reload();
            }
        }
    });
}

function removeCart(model) {
    Swal.fire({
        title: 'Bạn chắc chắn muốn bỏ khóa học này chứ?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Đóng',
        confirmButtonColor: '#3085d6cc',
        cancelButtonColor: '#dd3333f2',
        confirmButtonText: 'Xóa khóa học'
    }).then((result) => {
        if (result.isConfirmed) {
            var id = $(model).attr('id');
            var price_sale = $(model).attr('price_sale');
            var discount = $(model).attr('discount') == undefined ? '0' : $(model).attr('discount');
            var type = 'course_id';
            $.ajax({
                type: 'POST',
                url: '/cart/remove',
                data: {
                    'id': id,
                },
                beforeSend: function() {
                    $(model).html(`<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>Đang xử lý`);
                },
                success: function(res) {
                    if (res.success) {
                        window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
                        window.dataLayer.push({
                            event: "remove_from_cart",
                            ecommerce: {
                                items: []
                            }
                        });
                        location.reload();
                    }
                },
            });
        }
    })
}

function addMultipleCart(el, course_ids) {
    $.ajax({
        type: 'POST',
        url: '/cart/add-multiple-cart',
        data: {
            'course_ids': course_ids,
        },
        beforeSend: function() {
            el.html(`<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>Đang xử lý`);
        },
        success: function(resData) {
            if (resData.data.redirect_link) {
                return authenticationModal.show();
            }
            if (resData.success) {
                cartModal.hide();
                $('#quantity-cart').html(`<span class="absolute left-3.5 bottom-3.5 text-[10px] text-white font-bold rounded-full px-1.5 py-0.5 bg-[#1782FB]">${resData.data.count_items}</span>`);
                el.html("Đã thêm vào giỏ hàng").removeClass('hover:bg-orange-700').attr("disabled", "disabled");
                Swal.fire({
                    title: "Đã thêm vào giỏ hàng!",
                    icon: "success"
                });
            }
        }
    })
}

$('.action-favourite').click(function() {
    let courseId = $(this).data('id');
    let heartIcon = $(this).find('i');
    $.ajax({
        type: 'POST',
        url: '/course_action/add_quan_tam',
        data: {
            'Course_id': courseId
        },
        success: function(result) {
            if (result.data.redirect_link) {
                return authenticationModal.show();
            }
            if (result.success) {
                if (result.data.Favorited == 1) {
                    heartIcon.addClass('fa-heart text-[#006CCB]').removeClass('fa-heart-o');
                } else {
                    heartIcon.removeClass('fa-heart text-[#006CCB]').addClass('fa-heart-o');
                }
            }
        }
    });
})

localStorage.setItem('color-theme', 'light');



// Hàm kiểm tra tên miền
function checkDomain() {
    const currentDomain = window.location.hostname;
    //window.location.href = "https://example.com";
    // Kiểm tra xem tên miền hiện tại có trong danh sách cho phép

    if (currentDomain != '118.70.236.153') {
        // Làm mờ toàn bộ nội dung trang
        window.location.href = "https://example.com";
        document.body.style.filter = 'blur(5px)';
        document.body.style.pointerEvents = 'none';

        // Ngăn cuộn trang
        document.body.style.overflow = 'hidden';
    }
}

// // Gọi hàm kiểm tra khi trang được tải
window.onload = checkDomain;