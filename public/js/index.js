$(function () {

    const serverUrl = "https://api.experimentalschedule.autumnfrost.top/";
    加载();

    {
        var 时间戳 = new Date();
        天 = 时间戳.valueOf();
        天 = 天 / 86400000;
        天 = 天 - 19226;
        var 周 = Math.ceil(天 / 7);
        var 星期 = 时间戳.getDay();
        if (星期 == 0) {
            星期 = 7;
        }
        $(".题头").text("今天是第" + 周 + "周 星期" + 星期 + "捏");
    }

    // 打开页面第一次加载
    function 加载() {
        var key = 读取课表();
        if (key) {
            var 课表 = JSON.parse(localStorage.getItem(key));
            let 近期 = [];
            let 未来 = [];
            let 完成 = [];
            var 时间戳 = new Date();
            var 天 = 时间戳.valueOf();
            天 = 天 / 86400000;
            天 = 天 - 19226;
            var 周 = Math.ceil(天 / 7);
            var 星期 = 时间戳.getDay();
            if (星期 == 0) {
                星期 = 7;
            }
            var now = (周 - 1) * 7 + 星期;
            for (var i = 0; i < 课表.length; i++) {
                if (((课表[i].week - 1) * 7 + 课表[i].weekDay * 1) < now) {
                    完成.push(课表[i]);
                } else {
                    if (((课表[i].week - 1) * 7 + 课表[i].weekDay * 1) - now <= 3) {
                        近期.push(课表[i]);
                    } else {
                        未来.push(课表[i]);
                    }
                }
            }
            var 近 = 创建课表(近期, ".待做课程列表捏", ".近期待做捏");
            var 未 = 创建课表(未来, ".未来课程列表捏", ".未来待做捏");
            var 完 = 创建课表(完成, ".完成课程列表捏", ".完成的捏");
            绑定课表事件();
            设置饼图(近, 未, 完);
            $(".text1").text("未来实验:" + 未);
            $(".text2").text("近期实验:" + 近);
            $(".text3").text("完成实验:" + 完);
            $(".任务栏标题捏").text(localStorage.getItem("账号"))
        }
    }

    // 课表排序
    function 课表排序(课表) {
        课表.sort((a, b) => (a.week - b.week));

        课表.sort((a, b) => {
            if (a.week === b.week) {
                return a.weekDay - b.weekDay;
            }
        })
        return 课表;
    }

    // 设置饼图样式和参数
    function 设置饼图(近期, 未来, 完成) {
        var chartDom = document.querySelector('.左');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}<br/>{c}"
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            color: [
                '#38a169',
                '#3182ce',
                '#dd6b20'
            ],
            series: [
                {
                    type: 'pie',
                    center: ['65%', '50%'],
                    radius: '70%',
                    data: [
                        { value: 完成, name: "accomplish" },
                        { value: 未来, name: "To do" },
                        { value: 近期, name: "near" },
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        fontSize: 0
                    },
                    labelLine: {
                        length: 0,
                        length2: 0
                    }
                }
            ]
        };
        option && myChart.setOption(option);
    }

    // 申请网页验证码函数
    function 申请验证码() {
        $.ajax({
            // url
            url: serverUrl + "login",
            // 请求类型
            type: "GET",
            // 成功回调
            success: function (data) {
                console.log(data);
                $(".验证码图片").prop("src", data);
            },
        })
    }

    // 给课表添加绑定事件
    function 绑定课表事件() {
        const 课程高度 = $(".课程捏").css("height");
        $(".显示行").on("click", function () {
            if ($(this).parent().css("height") === 课程高度) {
                $(this).parent().stop().animate({
                    height: "20vw"
                }, 500);
            } else {
                $(this).parent().stop().animate({
                    height: "10vw"
                }, 500);
            }
        })
    }

    // 读取本地存储数据
    function 读取课表() {
        var data = localStorage.getItem("AutumnFrost");
        if (data !== null) {
            return data;
        } else {
            return null;
        }
    }

    // 读取存储的课表数据
    function 创建课表(课表, 状态, 标题框) {
        $(状态).hide();
        $(标题框).hide();
        $(状态).html("");
        var length = 课表.length;
        if (length > 0) {
            $(状态).show();
            $(标题框).show();
        }
        for (var i = 0; i < length; i++) {
            var 一节课 = $("<li class=课程捏><div class=显示行><div class=课程名>" + 课表[i].experimentProjectId + "</div><div class=日期>" + 课表[i].week + "周，星期" + 课表[i].weekDay + "</div><div class=时间>" + 课表[i].classTime + "</div></div><div class=隐藏行><div class=位置>教室：" + 课表[i].labAddress + "</div><div class=座位号>座位号：" + 课表[i].seatNumber + "</div><div class=教师>授课教师：" + 课表[i].teacherId + "</div></div></li>");
            $(状态).append(一节课);
        }
        return length;
    }

    // 绑定轮播图
    var swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        // navigation: {
        //     nextEl: ".swiper-button-next",
        //     prevEl: ".swiper-button-prev",
        // },
    });

    // 保持弹出框总是填充屏幕
    const QAQ = $(".任务栏").css("left");
    $(".图标").on("click", function () {
        $(".侧边栏").css("top", $('.导航栏').offset().top);
        $(".modal-framework").css("top", $('.导航栏').offset().top);
        $(".登陆状态框").css("top", $('.导航栏').offset().top);
        $(".注册框架").css("top", $('.导航栏').offset().top);
        $(".侧边栏").show();
        $(".任务栏").animate({
            left: 0
        }, 500);

        // 侧边栏弹出时禁止页面滚动
        var top = $(document).scrollTop();
        $(document).on('scroll.unable', function (e) {
            $(document).scrollTop(top);
        })

    })

    // 点击空白后侧边栏隐藏
    $(".空白").on("click", function () {
        $(".任务栏").animate({
            left: QAQ
        }, 500);
        setTimeout(function () {
            $(".侧边栏").hide();
        }, 500);
        $(document).unbind("scroll.unable");
    })

    // 登录账号
    $(".登录").on("click", function () {
        $(".modal-framework").show();
        $(".modal-main-body").fadeIn(200);
    })

    // 注销账号
    $(".注销").on("click", function () {
        localStorage.removeItem(localStorage.getItem("AutumnFrost"));
        localStorage.setItem("AutumnFrost", "");
        localStorage.setItem("账号", "");
        localStorage.setItem("密码", "");
        $(".待做课程列表捏").html("");
        $(".未来课程列表捏").html("");
        $(".完成课程列表捏").html("");
        $(".任务栏标题捏").html("QAQ");
        $(".text1").text("未来实验:" + 0);
        $(".text2").text("近期实验:" + 0);
        $(".text3").text("完成实验:" + 0);
        $(".近期待做捏").hide();
        $(".未来待做捏").hide();
        $(".完成的捏").hide();
        申请验证码();
    })

    // 侧边栏下拉
    $(".下拉").on("click", function () {
        $(".关于").css("height", "20vw");
        $(".关于下拉的").stop().slideDown(500);
        $(".下拉").hide();
        $(".上拉").show();
    })

    // 侧边栏上拉
    $(".上拉").on("click", function () {
        $(".关于下拉的").stop().slideUp(500);
        $(".上拉").hide();
        $(".下拉").show();
        $(".关于").css("height", "10vw");
    })

    // 取消登录
    $(".modal-cancel").on("click", function () {
        $(".modal-framework").hide();
        $(".modal-main-body").fadeOut(0);
        $(".modal-change-name").val("");
        $(".modal-change-href").val("");
    })

    // 确认登录
    $(".modal-confirm").on("click", function () {
        $(".modal-framework").hide();
        $(".modal-main-body").hide();
        $(".登陆状态框").show();
        if (localStorage.getItem($(".modal-change-name").val() + $(".modal-change-href").val())) {
            localStorage.setItem("AutumnFrost", $(".modal-change-name").val() + $(".modal-change-href").val());
            $(".登陆成功").show();
            localStorage.setItem("账号", $(".modal-change-name").val());
            localStorage.setItem("密码", $(".modal-change-href").val());
            加载();
        } else if (!($(".modal-change-name").val() && $(".modal-change-href").val())) {
            $(".登陆失败").show();
            $(".失败提示字").text("请将信息填写完整");
        } else {
            $(".登陆失败").show();
            $(".失败提示字").text("该账号还没有注册");
        }
    })

    // 登录成功显示
    $(".登陆成功").on("click", function () {
        $(".登陆成功").hide();
        $(".登陆状态框").hide();
        $(".modal-change-name").val("");
        $(".modal-change-href").val("");
    })

    // 登陆失败显示
    $(".登陆失败").on("click", function () {
        $(".登陆失败").hide();
        $(".登陆状态框").hide();
        $(".modal-framework").show();
        $(".modal-main-body").show();
    })

    // 注册用户
    $(".注册").on("click", function () {
        $(".注册框架").show();
        $(".注册框").fadeIn(200);
        $(".号").val(localStorage.getItem("账号"));
        $(".密").val(localStorage.getItem("密码"));
        $(".验").val("");
        申请验证码();
    })

    // 点击更换验证码
    $(".验证码图片").on("click", function () {
        申请验证码();
    })

    // 取消注册
    $(".取消").on("click", function () {
        $(".号").val("");
        $(".密").val("");
        $(".验").val("");
        $(".注册框架").hide();
        $(".注册框").fadeOut(0);
    })

    // 提交注册信息
    $(".提交").on("click", function () {
        // if (localStorage.getItem($(".号").val() + $(".密").val())) {
        //     alert("该账号已注册了捏");
        //     $(".号").val("");
        //     $(".密").val("");
        //     $(".验").val("");
        //     return false;
        // }
        if (!($(".号").val() && $(".密").val() && $(".验").val())) {
            alert("请将信息填写完整捏");
            return false;
        }
        $.ajax({
            // url
            url: serverUrl + "getData",
            // 参数
            data: { account: $(".号").val(), password: $(".密").val(), code: $(".验").val() },
            // 请求类型
            type: "GET",
            // 成功回调
            success: function (data) {
                // console.log(data);
                // console.log(课表.records.length);
                课表 = JSON.parse(data);
                课表 = 课表.records;
                课表 = 课表排序(课表);
                localStorage.setItem($(".号").val() + $(".密").val(), JSON.stringify(课表));
                localStorage.setItem("AutumnFrost", $(".号").val() + $(".密").val());
                localStorage.setItem("账号", $(".号").val());
                localStorage.setItem("密码", $(".密").val());
                加载();
            }
        })
        $(".注册框架").hide();
        $(".注册框").hide();
        // alert("注册成功!");
    })

})
