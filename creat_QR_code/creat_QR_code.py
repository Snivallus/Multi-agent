import qrcode

# 网址
url = "https://snivallus.github.io/Multi-agent/"

# 生成二维码
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# 创建二维码图像
img = qr.make_image(fill='black', back_color='white')

# 保存二维码图像
img.save("url_QR_code.png")

# 显示二维码图像
img.show()