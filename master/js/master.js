function addCart(url) {
    window.open(url, '_blank');
}

localStorage.setItem('color-theme', 'light');
const fab = document.getElementById('quick-contact-fab');
const mainBtn = document.getElementById('quick-contact-main');
mainBtn.onclick = function () {
    fab.classList.toggle('active');
};
// Ẩn khi click ngoài
document.addEventListener('click', function (e) {
    if (!fab.contains(e.target)) fab.classList.remove('active');
});

function getParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


const dalogin = getParam('dalogin');

if (dalogin && dalogin.trim() !== '') {
    document.getElementsByClassName('xinchao')[0].innerHTML= dalogin + ' <i class="fa fa-caret-down"></i>';

    Array.from(document.getElementsByClassName('checklogin')).forEach(el => {
        el.style.display = "none";
    });

    Array.from(document.getElementsByClassName('checklogin_ok')).forEach(el => {
        el.style.display = "block";
    });

} else {

    Array.from(document.getElementsByClassName('checklogin')).forEach(el => {
        el.style.display = "block";
    });
    Array.from(document.getElementsByClassName('checklogin_ok')).forEach(el => {
        el.style.display = "none";
    });
}




function getCoursesFromDOM() {
    const courses = [];
    document.querySelectorAll('.md\\:grid a[target="_blank"]').forEach(a => {
        const img = a.querySelector('img');
        const title = a.querySelector('h3');
        const price = a.querySelector('.text-red-600');
        const teacherDiv = a.querySelector('.text-sm.font-light');
        const originalPriceDiv = a.querySelector('.line-through');
        const ratingDiv = a.querySelector('.text-sm.font-medium');

        let teacher = '';
        if (teacherDiv) teacher = teacherDiv.textContent.trim();
        if (img && title && price) {
            courses.push({
                title: title.textContent.trim(),
                teacher: teacher,
                img: img.getAttribute('data-src'),
                price: price.textContent.trim(),
                originalPrice: originalPriceDiv ? originalPriceDiv.textContent.trim() : '',
                rating: ratingDiv ? ratingDiv.textContent.trim() : 'N/A',

                url: a.getAttribute('href')
            });
        }
    });
    return courses;
}


if (!document.getElementById('autocomplete-list')) {
    const input = document.getElementById('text_search');
    if (input) {
        const wrap = document.createElement('div');
        wrap.style.position = 'relative';
        input.parentNode.style.position = 'relative';
        const list = document.createElement('div');
        list.id = 'autocomplete-list';
        list.style.position = 'absolute';
        list.style.top = input.offsetHeight + 4 + 'px';
        list.style.left = '0';
        list.style.right = '0';
        list.style.background = '#fff';
        list.style.border = '1px solid #ddd';
        list.style.borderRadius = '10px';
        list.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        list.style.zIndex = 9999;
        list.style.display = 'none';
        list.style.maxHeight = '350px';
        list.style.overflowY = 'auto';
        input.parentNode.appendChild(list);
    }
}
document.getElementById('text_search')?.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    const list = document.getElementById('autocomplete-list');
    if (!q || q.length < 2) {
        list.style.display = 'none';
        return;
    }
    const courses = getCoursesFromDOM();
    // Tìm theo tiêu đề hoặc tên giảng viên
    const result = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.teacher && c.teacher.toLowerCase().includes(q))
    );
    let html = '';
    if (result.length) {
        html = result.map(item => `
            <a href="${item.url}" target="_blank" style="display:flex;align-items:center;gap:12px;padding:8px 12px;text-decoration:none;color:#222;border-bottom:1px solid #f3f3f3;">
                <img src="${item.img}" alt="${item.title}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;">
                <div>
                    <div style="font-weight:600;">${item.title}</div>
                    <div style="color:#888;font-size:13px;">${item.teacher ? item.teacher : ''}</div>
                    <div style="color:#e11d48;font-weight:bold;font-size:14px;">${item.price}</div>
                </div>
            </a>
        `).join('');
    } else {
        html = '<div style="padding:8px 12px;color:#888;">Không tìm thấy kết quả</div>';
    }
    list.innerHTML = html;
    list.style.display = 'block';
});

// Ẩn autocomplete khi click ngoài
document.addEventListener('click', function (e) {
    const input = document.getElementById('text_search');
    const list = document.getElementById('autocomplete-list');
    if (!input || !list) return;
    if (!input.contains(e.target) && !list.contains(e.target)) {
        list.style.display = 'none';
    }
});

// Hiện lại khi focus nếu có dữ liệu
document.getElementById('text_search')?.addEventListener('focus', function () {
    const list = document.getElementById('autocomplete-list');
    if (list && list.innerHTML.trim() !== '') list.style.display = 'block';
});




document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe sự kiện chọn radio đánh giá
    let selectedRating = null;
    document.querySelectorAll('.star-rate').forEach(radio => {
        radio.addEventListener('change', function () {
            selectedRating = parseFloat(this.value);
            const key = new URLSearchParams(window.location.search).get('key');
            showSearchResult(key ? key.trim().toLowerCase() : '');
        });
    });

    // Sắp xếp kết quả search theo dropdown
    let sortBy = null;
    document.querySelectorAll('.sort_by').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const url = new URL(this.href, window.location.origin);
            sortBy = url.searchParams.get('sort_by');
            const key = new URLSearchParams(window.location.search).get('key');
            updateSortTitle(sortBy); // Thêm dòng này để đổi tiêu đề
            showSearchResult(key ? key.trim().toLowerCase() : '');
        });
    });


    function updateSortTitle(sortBy) {
        const sortTitle = {
            'learn-most': 'Học nhiều nhất',
            'rating': 'Đánh giá cao',
            'new': 'Mới nhất',
            'price-low': 'Giá thấp đến cao',
            'price-high': 'Giá cao đến thấp'
        };

        document.querySelectorAll('#dropdownDefaultButton span.text-xs.leading-4.w-full').forEach((el, idx) => {
            if (idx === 1) el.textContent = sortTitle[sortBy] || 'Học nhiều nhất';
        });
    }

    function showSearchResult(q) {
        const list = document.getElementById('search-result-list');
        if (!q || q.length < 2) {
            list.style.display = 'none';
            return;
        }
        const courses = getCoursesFromDOM();

        // Lọc theo từ khóa và đánh giá
        let result = courses.filter(c =>
            (c.title.toLowerCase().includes(q) ||
                (c.teacher && c.teacher.toLowerCase().includes(q)))
            && (!selectedRating || (c.rating && c.rating >= selectedRating))
        );


        // Sắp xếp kết quả
        if (sortBy) {
            if (sortBy === 'learn-most') {
                result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
            } else if (sortBy === 'rating') {
                result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
            } else if (sortBy === 'new') {
                // Nếu có trường ngày tạo, ví dụ a.createdAt, thì sort theo đó
                result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            } else if (sortBy === 'price-low') {
                result.sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')));
            } else if (sortBy === 'price-high') {
                result.sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')));
            }
        }


        const urlParams = new URLSearchParams(window.location.search);
        const key = urlParams.get('key');
        const resultDiv = document.querySelector('#ketqua');
        if (resultDiv) {
            resultDiv.textContent = `${result.length} kết quả cho "${q}"${selectedRating ? `, đánh giá từ ${selectedRating}★` : ''}`;
        }


        let html = '';
        if (result.length) {
            html = result.map((item, index) => {
                const popoverId = `popover-${index}`;
                return `
                <a class="flex mb-6 gap-2 border border-gray rounded bg-white" href="${item.url}" target="_blank">
                    <div class="lg:w-[250px]">
                        <img class="lg:w-full lg:h-full w-[70px] h-[70px] object-cover rounded border-[0.5px] border-grey"
                             data-popover-target="${popoverId}" data-popover-trigger="hover" data-popover-placement="right"
                             src="${item.img}" alt="${item.title}">
                    </div>
                    <div class="flex-1 flex px-4 py-3 flex-col lg:flex-row gap-[32px]">
                        <div class="flex flex-1 flex-col gap-4">
                            <span class="font-bold text-base leading-5">${item.title}</span>
                            <div class="flex flex-col gap-2 font-light text-xs lg:text-sm">
                                <span class="leading-4">${item.teacher ? item.teacher : ''}</span>
                                <span class="leading-4 flex gap-2">
                                    <span class="font-bold">${item.rating || 'N/A'}</span>
                                    <span class="text-[#F77321] flex gap-1">
                                        ${Array(5).fill().map((_, i) =>
                    `<i class="fa fa-star co-or" aria-hidden="true"></i>`
                ).join('')}
                                    </span> (${item.reviewCount || 0})
                                </span>
                                <p> Thời lượng: ${item.duration || 'N/A'}, <span> ${item.lectureCount || 0} bài giảng </p>
                            </div>
                        </div>
                        <div class="w-30 flex flex-row lg:flex-col gap-2 lg:gap-1 mt-2 sm:mt-0">
                            <span class="font-bold text-base">${item.price}</span>
                            ${item.originalPrice ? `<span class="line-through text-sm text-[#929292]">${item.originalPrice}<sup>đ</sup></span>` : ''}
                        </div>
                    </div>
                </a>
                <div data-popover id="${popoverId}" role="tooltip"
                     class="absolute z-10 invisible opacity-0 inline-block w-96 p-6 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div>
                        <div class="font-bold mb-4"> Bạn sẽ học được </div>
                        <ul>
                            ${item.learnItems && item.learnItems.length ? item.learnItems.map(learn => `
                                <li class="flex gap-2 pb-3 text-sm">
                                    <div>
                                        <svg class="w-5 h-5" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.047 4L6.7137 11.3333L3.38037 8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <p>${learn}</p>
                                </li>
                            `).join('') : '<li class="text-sm">Không có thông tin chi tiết.</li>'}
                        </ul>
                        <div class="flex gap-2 h-[50px] mt-6">
                        <button onclick="addCart('${item.url}')" class="w-full bg-[#E66B22] text-white border rounded font-bold py-auto uppercase hover:bg-orange-600">
                            Đăng ký ngay
                        </button>
                       
                    </div>
                    </div>
                    <div data-popper-arrow></div>
                </div>
            `;
            }).join('');
        } else {
            html = '<div class="p-4 text-gray-500">Không tìm thấy kết quả</div>';
        }
        list.innerHTML = html;
        list.style.display = 'block';
    }

    if (key) {
        document.getElementById('main').style.display = 'none';
        document.getElementById('timkiem').style.display = 'block';
        showSearchResult(key.trim().toLowerCase());
        document.getElementById('search-result-list').scrollIntoView({ behavior: 'smooth' });
    }
});

// // Hàm kiểm tra tên miền
// function checkDomain() {
//     const currentDomain = window.location.hostname;
//     //window.location.href = "https://example.com";
//     // Kiểm tra xem tên miền hiện tại có trong danh sách cho phép

//     if (currentDomain != 'pdlai-2024.github.io') {
//         // Làm mờ toàn bộ nội dung trang
//         window.location.href = "https://example.com";
//         document.body.style.filter = 'blur(5px)';
//         document.body.style.pointerEvents = 'none';

//         // Ngăn cuộn trang
//         document.body.style.overflow = 'hidden';
//     }
// }

// // // Gọi hàm kiểm tra khi trang được tải
// window.onload = checkDomain;
