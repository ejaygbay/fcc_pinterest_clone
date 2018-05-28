$(document).ready(function() {
    $(".button-collapse").sideNav();
    $('select').material_select();
    var imgName = [];
    var s;
    var ip;
    get_IP_address();
    favorite_vote();

    function favorite_vote() {
        var vote = 0;
        var id;
        var counts;
        var convert;
        var text;
        $(".favorite").click(function() {
            text = $(this).text();
            id = $(this).attr('id');
            if (text == "favorite_border") {
                document.getElementById(id).innerHTML = 'favorite';
            } else if (text == "favorite") {
                document.getElementById(id).innerHTML = 'favorite_border';
            }
        });
        $('count').click(function() {
            console.log(ip);
            id = $(this).attr('id');
            alert(id);
            if (vote == 0) {
                counts = $(this).text();
                convert = parseInt(counts);
                document.getElementById(id).innerHTML = convert + 1;
                vote = 1;
            } else if (vote == 1 && id == id) {
                id = $(this).attr('id');
                counts = $(this).text();
                convert = parseInt(counts);
                document.getElementById(id).innerHTML = convert - 1;
                vote = 0;
            } else
                alert("Sorry");

            // $(this).click(function() {
            // alert(vote);
            // if (id == id && vote == 1) {
            //     counts = $(this).text();
            //     convert = parseInt(counts);
            //     document.getElementById(id).innerHTML = convert - 1;
            // }
            // favorite_vote();
        });
        // favorite_vote();
        console.log(convert + 1);
        console.log(id);
    };
    // }

    // // external js: masonry.pkgd.js, imagesloaded.pkgd.js
    // // init Masonry
    // var grid = document.querySelector('.grid');

    // var msnry = new Masonry(grid, {
    //     itemSelector: '.grid-item',
    //     columnWidth: '.grid-sizer',
    //     percentPosition: true
    // });

    // imagesLoaded(grid).on('progress', function() {
    //     // layout Masonry after each image loads
    //     msnry.layout();
    // });
    $("#btn").click(function() {
        // getDiv();
        getImage()
    });
    $("#btn2").click(function() {
        getDiv();
        // getImage()
    });

    function get_IP_address() {
        var xhttp;
        var yourData;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                yourData = JSON.parse(xhttp.responseText);
                ip = yourData.ip;
            };
        }
        xhttp.open("GET", "https://ipapi.co/json/", true);
        xhttp.send(xhttp.responseText);
    }

    function getImage() {
        var xhttp;
        var yourData;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                yourData = JSON.parse(xhttp.responseText);
                for (s = 0; s < yourData.length; s++) {
                    imgName.push(yourData[s].image);
                }
                console.log(imgName);
                console.log(imgName[0]);
                // getDiv();
                // document.getElementById("newImg").innerHTML = yourData.image;

                // var allCells = document.getElementById("grid");
                // for (var i = 0; i < 2; i++) {
                //     var row = document.createElement("div");
                //     row.className = "grid";
                //     for (var x = 0; x <= imgName.length; x++) {
                //         var cell = document.createElement("div");
                //         cell.className = "grid-item";
                //         cell.innerHTML = '<img src="' + imgName[x] + '">' + '<a href="#">Author: James Flomo</a>';
                //         row.appendChild(cell);
                //     }
                //     allCells.appendChild(cell);
                //     document.getElementById("grid").innerHTML = allCells.innerHTML;
                // }
            };
        }
        xhttp.open("GET", "http://localhost:8000/list_of_pictures", true);
        xhttp.send(xhttp.responseText);
        getDiv();
    }

    // console.log(imgName);

    function getDiv() {
        // console.log("===================");
        console.log(imgName);
        console.log(imgName[0]);
        var allCells = document.getElementById("grid");
        for (var i = 0; i < 3; i++) {
            var row = document.createElement("div");
            row.className = "row";
            for (var x = 0; x < 4; x++) {
                var cell = document.createElement("div");
                cell.className = "col l3 m3 s3 allDivs grid-item";
                // cell.innerHTML = '<img src="https://images.reverb.com/image/upload/s--7u-hch3_--/a_exif,c_limit,e_unsharp_mask:80,f_auto,fl_progressive,g_south,h_620,q_90,w_620/v1479765046/dxcs3ukjgww3inurthon.png">' + '<a href="#">Author: James Flomo</a>';
                cell.innerHTML = '<img src="' + imgName[0] + '">' + '<a href="#">Author: James Flomo</a>';
                row.appendChild(cell);
            }
            allCells.appendChild(row);
        }
        document.getElementById("grid").innerHTML = allCells.innerHTML;
    }

    // function genDivs() {
    //     var allCells = document.getElementById("code");
    //     for (var i = 0; i < 10; i++) {
    //         var row = document.createElement("div");
    //         row.className = "row";
    //         for (var x = 1; x <= 4; x++) {
    //             var cell = document.createElement("div");
    //             cell.className = "col l3 m3 s3 allDivs";
    //             cell.innerHTML = '<img src="../image.png" style="width:130px; height:inherit">';
    //             // cell.innerHTML = (i * 10) + x;
    //             row.appendChild(cell);
    //         }
    //         allCells.appendChild(row);
    //     }
    //     document.getElementById("code").innerHTML = allCells.innerHTML;
    // }





});