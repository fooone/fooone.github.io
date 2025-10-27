### flag_in_your_hand

解题：观察网页源代码和js文件

从源代码可知当ic为true时返回的是真实的flag，flag为fg,即为bm(token).

观察js文件里ic为true的条件：

var a = [118, 104, 102, 120, 117, 108, 119, 124, 48,123,101,120];
    if (s.length == a.length) {
        for (i = 0; i < s.length; i++) {
            if (a[i] - s.charCodeAt(i) != 3)
                return ic = false;
        }
        return ic = true;

当传入一个字符串后，先进行ic=checkToken(),返回false，然后进行fg=bm(token),bm函数嵌套了多个函数，总之会执行ck函数，传入的字符串转成ASCII值，与a一一对比，只有全部都满足a[i] - s.charCodeAt(i) == 3时，ic才为true，此时根据源代码能确定输出rightflag。根据a的值可以得出要输入的字符串应该为security-xbu，满足与a的关系。

![image-20251020162118978](C:\Users\541\AppData\Roaming\Typora\typora-user-images\image-20251020162118978.png)

function hm(s) {
    return rh(rstr(str2rstr_utf8(s)));
}
function bm(s) {
    return rb(rstr(str2rstr_utf8(s)));
}
function rstr(s) {
    return binl2rstr(binl(rstr2binl(s), s.length * 8));
}
function checkToken(s) {
    return s === "FAKE-TOKEN";
}
function rh(ip) {
    try {
        hc
    } catch (e) {
        hc = 0;
    }
    var ht = hc ? "0123456789ABCDEF" : "0123456789abcdef";
    var op = "";
    var x;
    for (var i = 0; i < ip.length; i++) {
        x = ip.charCodeAt(i);
        op += ht.charAt((x >>> 4) & 0x0F) + ht.charAt(x & 0x0F);
    }
    return op;
}
function rb(ip) {
    try {
        bp
    } catch (e) {
        bp = '';
    }
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var op = "";
    var len = ip.length;
    for (var i = 0; i < len; i += 3) {
        var t = (ip.charCodeAt(i) << 16) | (i + 1 < len ? ip.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? ip.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > ip.length * 8)
                op += bp;
            else
                op += b.charAt((t >>> 6 * (3 - j)) & 0x3F);
        }
    }
    return op;
}
function ck(s) {
    try {
        ic
    } catch (e) {
        return;
    }
    var a = [118, 104, 102, 120, 117, 108, 119, 124, 48,123,101,120];
    if (s.length == a.length) {
        for (i = 0; i < s.length; i++) {
            if (a[i] - s.charCodeAt(i) != 3)0
                return ic = false;
        }
        return ic = true;
    }
    return ic = false;
}
function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;
    while (++i < input.length) {
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++;
        }
        if (x <= 0x7F)
            output += String.fromCharCode(x);
        else if (x <= 0x7FF)
            output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
    }
    return output;
}
function rstr2binl(input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++)
        output[i] = 0;
    for (var i = 0; i < input.length * 8; i += 8)
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    return output;
}
