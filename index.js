var selectedRow = null;
function validateInput() {
  var taiKhoan = document.getElementById("tknv").value;
  var hoTen = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var ngayLam = document.getElementById("datepicker").value;
  var chucVu = document.getElementById("chucvu").value;
  var luongCB = document.getElementById("luongCB").value;
  var gioLam = document.getElementById("gioLam").value;
  var password = document.getElementById("password").value; // Thêm trường mật khẩu
  var taiKhoanPattern = /^\d{4,6}$/;
  var hoTenPattern = /^[a-zA-Z ]+$/;
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var luongCBPattern = /^[1-9]\d{5,7}$/;
  var passwordPattern = /^[a-zA-Z0-9!@#$%^&*,./]{6,16}$/;
  if (!taiKhoan.match(taiKhoanPattern)) {
    alert("Tài khoản không hợp lệ. Vui lòng nhập từ 4 đến 6 ký số.");
    return false;
  }
  if (!hoTen.match(hoTenPattern)) {
    alert("Tên nhân viên không hợp lệ. Vui lòng nhập chữ.");
    return false;
  }
  if (!email.match(emailPattern)) {
    alert("Email không hợp lệ. Vui lòng kiểm tra định dạng.");
    return false;
  }
  if (!luongCB.match(luongCBPattern)) {
    alert("Lương cơ bản không hợp lệ. Vui lòng nhập từ 1,000,000 đến 20,000,000.");
    return false;
  }
  if (isNaN(parseFloat(gioLam)) || gioLam < 80 || gioLam > 200) {
    alert("Số giờ làm trong tháng không hợp lệ. Vui lòng nhập từ 80 đến 200 giờ.");
    return false;
  }
  if (chucVu !== "Giám đốc" && chucVu !== "Trưởng phòng" && chucVu !== "Nhân viên") {
    alert("Chức vụ không hợp lệ. Vui lòng chọn chức vụ hợp lệ.");
    return false;
  }
  // Kiểm tra mật khẩu
  if (!passwordPattern.test(password)) {
    alert(
      "Mật khẩu không hợp lệ. Mật khẩu phải chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt và có độ dài từ 6 đến 10 ký tự."
    );
    return false;
  }
  return true;
}
function tinhTongLuong(chucVu, luongCB) {
  if (chucVu === "Giám đốc") {
    return luongCB * 3;
  } else if (chucVu === "Trưởng phòng") {
    return luongCB * 2;
  } else {
    return luongCB;
  }
}
function capNhatLaiLuongTong(row) {
  var chucVu = row.cells[4].textContent;
  var luongCB = parseFloat(row.cells[5].textContent);
  var luongTong = tinhTongLuong(chucVu, luongCB);
  row.cells[5].textContent = luongTong;
}
var btnThemNV = document.getElementById("btnThemNV");
btnThemNV.addEventListener("click", function () {
  if (validateInput()) {
    var fields = ["tknv", "name", "email", "datepicker", "chucvu", "luongCB"];
    var values = {};
    fields.forEach(function (field) {
      values[field] = document.getElementById(field).value;
    });
    var luongCB = parseFloat(values["luongCB"]);
    var chucVu = values["chucvu"];
    var luongTong = tinhTongLuong(chucVu, luongCB);
    var tableDanhSach = document.getElementById("tableDanhSach");
    var newRow = tableDanhSach.insertRow();
    Object.values(values).forEach(function (value) {
      newRow.insertCell().textContent = value;
    });
    var gioLam = parseFloat(document.getElementById("gioLam").value);
    var xepLoai = "";
    if (gioLam >= 192) {
      xepLoai = "Xuất sắc";
    } else if (gioLam >= 176) {
      xepLoai = "Giỏi";
    } else if (gioLam >= 160) {
      xepLoai = "Khá";
    } else {
      xepLoai = "Trung bình";
    }
    newRow.insertCell().textContent = xepLoai;
    newRow.cells[5].textContent = luongTong;
    capNhatLaiLuongTong(newRow);
    var actionsCell = newRow.insertCell();
    var editButton = document.createElement("button");
    editButton.className = "btn btn-primary mx-1";
    editButton.textContent = "Sửa";
    editButton.onclick = function () {
      suaNhanVien(newRow);
    };
    actionsCell.appendChild(editButton);
    var deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger mx-1";
    deleteButton.textContent = "Xóa";
    deleteButton.onclick = function () {
      xoaNhanVien(newRow);
    };
    actionsCell.appendChild(deleteButton);

    tableDanhSach.classList.remove("d-none");

    fields.forEach(function (field) {
      document.getElementById(field).value = "";
    });
  }
});
function xoaNhanVien(row) {
  var table = row.parentNode;
  while (table && table.tagName.toLowerCase() != "table") {
    table = table.parentNode;
  }
  if (!table) {
    return;
  }
  table.deleteRow(row.rowIndex);
}
function suaNhanVien(row) {
  selectedRow = row;
  var cells = row.cells;
  var taiKhoan = cells[0].textContent;
  var hoTen = cells[1].textContent;
  var email = cells[2].textContent;
  var ngayLam = cells[3].textContent;
  var chucVu = cells[4].textContent;
  var luongCB = parseFloat(cells[5].textContent);
  document.getElementById("tknv").value = taiKhoan;
  document.getElementById("name").value = hoTen;
  document.getElementById("email").value = email;
  document.getElementById("datepicker").value = ngayLam;
  document.getElementById("chucvu").value = chucVu;
  document.getElementById("luongCB").value = luongCB;
  $("#myModal").modal("show");
}
var btnCapNhat = document.getElementById("btnCapNhat");
btnCapNhat.addEventListener("click", function () {
  if (selectedRow) {
    if (validateInput()) {
      var taiKhoan = document.getElementById("tknv").value;
      var hoTen = document.getElementById("name").value;
      var email = document.getElementById("email").value;
      var ngayLam = document.getElementById("datepicker").value;
      var chucVu = document.getElementById("chucvu").value;
      var luongCB = parseFloat(document.getElementById("luongCB").value);

      var cells = selectedRow.cells;
      cells[0].textContent = taiKhoan;
      cells[1].textContent = hoTen;
      cells[2].textContent = email;
      cells[3].textContent = ngayLam;
      cells[4].textContent = chucVu;
      cells[5].textContent = luongCB;
      var gioLam = parseFloat(document.getElementById("gioLam").value);
      var xepLoai = "";
      if (gioLam >= 192) {
        xepLoai = "Xuất sắc";
      } else if (gioLam >= 176) {
        xepLoai = "Giỏi";
      } else if (gioLam >= 160) {
        xepLoai = "Khá";
      } else {
        xepLoai = "Trung bình";
      }
      cells[6].textContent = xepLoai;
      capNhatLaiLuongTong(selectedRow);
      $("#myModal").modal("hide");
    }
  }
});
