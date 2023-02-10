--------------------------HƯỚNG DẪN CÁCH TRUY CẬP VÀO CƠ SỞ DỮ LIỆU MONGODB------------


Cách 1:
connection-string:
- mongodb+srv://519h0127:d99BPAOmLKqVYfkP@final-project.srtxh.mongodb.net/test

Kết nối vào cơ sở dữ liệu MongoDB Compass theo đường dẫn kết nối:
- Chúng ta sẽ sử dụng MongoDB Compass để hiện kết nối này
	Trường hợp không có mongoDB Compass: 
	- Truy cập đường dẫn để dowload MongoDB Compass: https://www.mongodb.com/try/download/compass
	Trường hợp đã có / đã tải mongoDB Compass:
	- Mở MongoDB Compass
	- Bấm vào connect và chọn new collection
	- Sử dụng connection-string được cung cấp để kết nối / import toàn bộ database
	- Sau khi kết nối thành công, click vô final-project ở mục database để kiểm soát dữ liệu của trang web
	
Cách 2(trường hợp cách 1 không thành công):

Kết nối trực tiếp vào cơ sở dữ liệu MongoDB sử dụng tài khoản admin:
- Truy cập đường link: https://account.mongodb.com/account/login
- Sử dụng tài khoản admin của trang web để đăng nhập
	-email: 519h0127@student.tdtu.edu.vn
	-pass: 4612302001

Sau khi truy cập thành công với tài khoản admin, để có thể xem/xóa/sử dữ liệu trực tiếp
chúng ta vào phần Database và chọn FINAL-PROJECT và ấn browse-collection

-----------------------------HƯỚNG DẪN CÁCH CHẠY TRANG WEB LOCAL---------------------------

Để chạy source code, chúng ta mở thư mục source, ở cửa sổ git bash terminal chúng ta
nhập lệnh "npm i" để tải các packages cần thiết, sau đó để run trang web chúng ta nhập
lệnh "npm run watch" 

Trang web sẽ hiển thị ở cổng http://localhost:8000

Để trải nghiệm thực tế trên trang web, người dùng nên sử dụng tài khoản gmail có thật để 
trải nghiệm các chức năng gửi và nhận thông báo, token, reset mật khẩu, đăng ký...

Để đảm bảo được sự ổn định liên kết giữa các trang, người dùng không thể bấm nút quay lại
trang trước trên trình duyệt, thay vì đó các thao tác lưu hành giữa các trang đã được cung cấp sẵn

Lưu ý, tên người dùng sẽ không thay đổi và không thể thay đổi ngay từ từ lúc admin cung cấp, chúng ta
chỉ có thể đổi mật khẩu, và cập nhật hình ảnh CMND. 
